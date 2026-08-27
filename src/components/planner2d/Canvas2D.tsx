import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CabinetNode2D } from './CabinetNode2D';
import { ApplianceNode2D } from './ApplianceNode2D';
import { ArchElementNode2D } from './ArchElementNode2D';
import { DimensionLine } from './DimensionLine';
import { calculateSnap, calculateAisleClearance, getRotatedDimensions } from '../../utils/cadGeometry';
import { formatDimension } from '../../utils/unitConversion';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCw, 
  Copy, 
  Trash2, 
  Grid, 
  Magnet, 
  Ruler, 
  Eye 
} from 'lucide-react';

export const Canvas2D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    project,
    selectedId,
    selectedType,
    setSelected,
    clearSelection,
    updateCabinet,
    updateAppliance,
    updateElement,
    duplicateCabinet,
    rotateCabinet,
    removeCabinet,
    duplicateAppliance,
    rotateAppliance,
    removeAppliance,
    removeElement,
  } = useProjectStore();

  const {
    unit,
    zoom2D,
    setZoom2D,
    pan2D,
    setPan2D,
    resetView2D,
    snapToGridEnabled,
    snapToWallEnabled,
    snapToCabinetEnabled,
    gridSize,
    showDimensions2D,
    showAisleClearance,
    showCabinetLabels,
    showWallDimensions,
    setSnapToGridEnabled,
    setShowDimensions2D,
    setShowAisleClearance,
  } = useUIStore();

  const { room, cabinets, appliances, architecturalElements } = project;

  // Dragging / Panning State
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingItem, setDraggingItem] = useState<{
    id: string;
    type: 'cabinet' | 'appliance' | 'element';
    startX: number;
    startY: number;
    itemStartX: number;
    itemStartY: number;
    width: number;
    depth: number;
    rotation: number;
  } | null>(null);

  const [activeGuides, setActiveGuides] = useState<{ x1: number; y1: number; x2: number; y2: number; label?: string }[]>([]);

  // Convert client coordinates to CAD SVG coordinates
  const clientToSVG = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - pan2D.x) / zoom2D;
    const y = (clientY - rect.top - pan2D.y) / zoom2D;
    return { x, y };
  }, [pan2D, zoom2D]);

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom2D * zoomFactor, 0.05), 1.5);

    // Zoom towards mouse position
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPanX = mouseX - (mouseX - pan2D.x) * (newZoom / zoom2D);
      const newPanY = mouseY - (mouseY - pan2D.y) * (newZoom / zoom2D);

      setZoom2D(newZoom);
      setPan2D({ x: newPanX, y: newPanY });
    }
  };

  // Canvas Mouse Down (Start Panning or Clear Selection)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).id === 'cad-canvas-bg') {
      if (e.button === 0 || e.button === 1) { // Left or middle click on background
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan2D.x, y: e.clientY - pan2D.y });
        clearSelection();
      }
    }
  };

  // Item Drag Start
  const handleItemMouseDown = (
    e: React.MouseEvent,
    id: string,
    type: 'cabinet' | 'appliance' | 'element',
    itemX: number,
    itemY: number,
    w: number,
    d: number,
    rot: number
  ) => {
    e.stopPropagation();
    setSelected(id, type);

    const svgCoords = clientToSVG(e.clientX, e.clientY);
    setDraggingItem({
      id,
      type,
      startX: svgCoords.x,
      startY: svgCoords.y,
      itemStartX: itemX,
      itemStartY: itemY,
      width: w,
      depth: d,
      rotation: rot,
    });
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan2D({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (draggingItem) {
      const svgCoords = clientToSVG(e.clientX, e.clientY);
      const dx = svgCoords.x - draggingItem.startX;
      const dy = svgCoords.y - draggingItem.startY;

      let targetX = draggingItem.itemStartX + dx;
      let targetY = draggingItem.itemStartY + dy;

      if (snapToGridEnabled || snapToWallEnabled || snapToCabinetEnabled) {
        const otherCabs = cabinets.filter((c) => c.id !== draggingItem.id);
        const snap = calculateSnap(
          targetX,
          targetY,
          draggingItem.width,
          draggingItem.depth,
          draggingItem.rotation,
          snapToWallEnabled ? room.walls : [],
          snapToCabinetEnabled ? otherCabs : [],
          snapToGridEnabled ? gridSize : 1
        );
        targetX = snap.x;
        targetY = snap.y;
        setActiveGuides(snap.guideLines || []);
      }

      if (draggingItem.type === 'cabinet') {
        updateCabinet(draggingItem.id, { x: targetX, y: targetY });
      } else if (draggingItem.type === 'appliance') {
        updateAppliance(draggingItem.id, { x: targetX, y: targetY });
      } else if (draggingItem.type === 'element') {
        updateElement(draggingItem.id, { x: targetX, y: targetY });
      }
    }
  };

  // Mouse Up
  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingItem(null);
    setActiveGuides([]);
  };

  // Selected item reference for floating mini-toolbar
  const selectedCabinet = cabinets.find((c) => c.id === selectedId);
  const selectedAppliance = appliances.find((a) => a.id === selectedId);
  const selectedElement = architecturalElements.find((e) => e.id === selectedId);

  const selectedItemPos = selectedCabinet
    ? { x: selectedCabinet.x, y: selectedCabinet.y, w: selectedCabinet.width, d: selectedCabinet.depth, rot: selectedCabinet.rotation }
    : selectedAppliance
    ? { x: selectedAppliance.x, y: selectedAppliance.y, w: selectedAppliance.width, d: selectedAppliance.depth, rot: selectedAppliance.rotation }
    : selectedElement
    ? { x: selectedElement.x, y: selectedElement.y, w: selectedElement.width, d: selectedElement.depth, rot: selectedElement.rotation }
    : null;

  // Aisle clearances
  const aisleClearances = showAisleClearance ? calculateAisleClearance(cabinets, room.width, room.length) : [];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 2D Floating Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl">
        <button
          onClick={() => setZoom2D((z) => Math.min(z * 1.2, 1.5))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          title="Zoom In (+)"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setZoom2D((z) => Math.max(z * 0.8, 0.05))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          title="Zoom Out (-)"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={resetView2D}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          title="Fit / Reset View"
        >
          <Maximize2 size={18} />
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        <button
          onClick={() => setSnapToGridEnabled(!snapToGridEnabled)}
          className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${
            snapToGridEnabled ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Toggle Grid Snap"
        >
          <Grid size={17} />
          <span>{gridSize}mm</span>
        </button>

        <button
          onClick={() => setShowDimensions2D(!showDimensions2D)}
          className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${
            showDimensions2D ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Toggle Dimension Lines"
        >
          <Ruler size={17} />
          <span>Dims</span>
        </button>

        <button
          onClick={() => setShowAisleClearance(!showAisleClearance)}
          className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${
            showAisleClearance ? 'bg-purple-600/30 text-purple-400 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Toggle Working Aisle Clearances"
        >
          <Eye size={17} />
          <span>Aisles</span>
        </button>
      </div>

      {/* Floating Selection Quick Toolbar */}
      {selectedItemPos && selectedId && (
        <div
          className="absolute z-20 flex items-center gap-1 p-1 bg-slate-900/95 border border-blue-500/50 rounded-lg shadow-xl"
          style={{
            left: `${pan2D.x + selectedItemPos.x * zoom2D}px`,
            top: `${Math.max(16, pan2D.y + selectedItemPos.y * zoom2D - 45)}px`,
          }}
        >
          <button
            onClick={() => {
              if (selectedType === 'cabinet') rotateCabinet(selectedId, 90);
              else if (selectedType === 'appliance') rotateAppliance(selectedId, 90);
            }}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Rotate 90° (R)"
          >
            <RotateCw size={15} />
          </button>
          <button
            onClick={() => {
              if (selectedType === 'cabinet') duplicateCabinet(selectedId);
              else if (selectedType === 'appliance') duplicateAppliance(selectedId);
            }}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Duplicate (D)"
          >
            <Copy size={15} />
          </button>
          <button
            onClick={() => {
              if (selectedType === 'cabinet') removeCabinet(selectedId);
              else if (selectedType === 'appliance') removeAppliance(selectedId);
              else if (selectedType === 'element') removeElement(selectedId);
            }}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition"
            title="Delete (Del)"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}

      {/* Main SVG CAD Canvas */}
      <svg
        ref={svgRef}
        id="cad-canvas-bg"
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
      >
        <defs>
          {/* CAD Background Grid Pattern */}
          <pattern id="smallGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
          </pattern>
          <pattern id="majorGrid" width="500" height="500" patternUnits="userSpaceOnUse">
            <rect width="500" height="500" fill="url(#smallGrid)" />
            <path d="M 500 0 L 0 0 0 500" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.5" />
          </pattern>

          {/* Wall Hatch Pattern */}
          <pattern id="wallHatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="2" />
          </pattern>
        </defs>

        {/* Global Pan & Zoom Transform Group */}
        <g transform={`translate(${pan2D.x}, ${pan2D.y}) scale(${zoom2D})`}>
          {/* CAD Background Grid */}
          <rect
            x={-5000}
            y={-5000}
            width={15000}
            height={15000}
            fill="url(#majorGrid)"
            className="pointer-events-none"
          />

          {/* Room Interior Floor */}
          <rect
            x={0}
            y={0}
            width={room.width}
            height={room.length}
            fill="#090d16"
            stroke="none"
          />

          {/* Outer Wall Boundaries with architectural thickness */}
          <g className="walls-group">
            {/* Top Wall A */}
            <rect
              x={-room.wallThickness}
              y={-room.wallThickness}
              width={room.width + 2 * room.wallThickness}
              height={room.wallThickness}
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Right Wall B */}
            <rect
              x={room.width}
              y={-room.wallThickness}
              width={room.wallThickness}
              height={room.length + 2 * room.wallThickness}
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Bottom Wall C */}
            <rect
              x={-room.wallThickness}
              y={room.length}
              width={room.width + 2 * room.wallThickness}
              height={room.wallThickness}
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Left Wall D */}
            <rect
              x={-room.wallThickness}
              y={-room.wallThickness}
              width={room.wallThickness}
              height={room.length + 2 * room.wallThickness}
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Wall Labels (Wall A, Wall B, Wall C, Wall D) */}
            <text x={room.width / 2} y={-room.wallThickness / 2} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="24" fontWeight="bold" fontFamily="monospace">
              WALL A (BACK)
            </text>
            <text x={room.width + room.wallThickness / 2} y={room.length / 2} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="24" fontWeight="bold" fontFamily="monospace" transform={`rotate(90, ${room.width + room.wallThickness / 2}, ${room.length / 2})`}>
              WALL B (RIGHT)
            </text>
            <text x={room.width / 2} y={room.length + room.wallThickness / 2} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="24" fontWeight="bold" fontFamily="monospace">
              WALL C (FRONT)
            </text>
            <text x={-room.wallThickness / 2} y={room.length / 2} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="24" fontWeight="bold" fontFamily="monospace" transform={`rotate(-90, ${-room.wallThickness / 2}, ${room.length / 2})`}>
              WALL D (LEFT)
            </text>
          </g>

          {/* Architectural Elements (Doors, Windows, Columns, Beams, Pipes) */}
          <g className="arch-elements-group">
            {architecturalElements.map((el) => (
              <ArchElementNode2D
                key={el.id}
                element={el}
                isSelected={selectedId === el.id}
                unit={unit}
                showDimensions={showDimensions2D}
                onSelect={(e) => {
                  e.stopPropagation();
                  setSelected(el.id, 'element');
                }}
                onMouseDown={(e) => handleItemMouseDown(e, el.id, 'element', el.x, el.y, el.width, el.depth, el.rotation)}
              />
            ))}
          </g>

          {/* Cabinets Layer */}
          <g className="cabinets-group">
            {cabinets.map((cab) => (
              <CabinetNode2D
                key={cab.id}
                cabinet={cab}
                isSelected={selectedId === cab.id}
                unit={unit}
                showDimensions={showDimensions2D}
                showLabels={showCabinetLabels}
                onSelect={(e) => {
                  e.stopPropagation();
                  setSelected(cab.id, 'cabinet');
                }}
                onMouseDown={(e) => handleItemMouseDown(e, cab.id, 'cabinet', cab.x, cab.y, cab.width, cab.depth, cab.rotation)}
              />
            ))}
          </g>

          {/* Appliances Layer */}
          <g className="appliances-group">
            {appliances.map((app) => (
              <ApplianceNode2D
                key={app.id}
                appliance={app}
                isSelected={selectedId === app.id}
                unit={unit}
                showDimensions={showDimensions2D}
                showLabels={showCabinetLabels}
                onSelect={(e) => {
                  e.stopPropagation();
                  setSelected(app.id, 'appliance');
                }}
                onMouseDown={(e) => handleItemMouseDown(e, app.id, 'appliance', app.x, app.y, app.width, app.depth, app.rotation)}
              />
            ))}
          </g>

          {/* Snapping Guide Lines */}
          {activeGuides.map((guide, idx) => (
            <g key={idx} className="pointer-events-none">
              <line
                x1={guide.x1}
                y1={guide.y1}
                x2={guide.x2}
                y2={guide.y2}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              {guide.label && (
                <text
                  x={(guide.x1 + guide.x2) / 2}
                  y={(guide.y1 + guide.y2) / 2 - 8}
                  fill="#38bdf8"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {guide.label}
                </text>
              )}
            </g>
          ))}

          {/* Dimension Chains & Aisle Clearances */}
          {showDimensions2D && (
            <g className="dimension-chains-group pointer-events-none">
              {/* Overall Room Dimensions */}
              {showWallDimensions && (
                <>
                  {/* Top Wall Dimension */}
                  <DimensionLine
                    x1={0}
                    y1={0}
                    x2={room.width}
                    y2={0}
                    value={room.width}
                    unit={unit}
                    offset={-room.wallThickness - 60}
                    color="#93c5fd"
                    fontSize={14}
                    prefix="ROOM W: "
                  />
                  {/* Right Wall Dimension */}
                  <DimensionLine
                    x1={room.width}
                    y1={0}
                    x2={room.width}
                    y2={room.length}
                    value={room.length}
                    unit={unit}
                    offset={-room.wallThickness - 60}
                    color="#93c5fd"
                    fontSize={14}
                    prefix="ROOM L: "
                  />
                </>
              )}

              {/* Working Aisle Clearances */}
              {aisleClearances.map((aisle, i) => (
                <DimensionLine
                  key={`aisle-${i}`}
                  x1={aisle.x1}
                  y1={aisle.y1}
                  x2={aisle.x2}
                  y2={aisle.y2}
                  value={aisle.distance}
                  unit={unit}
                  color="#c084fc" // purple-400
                  fontSize={12}
                  prefix="AISLE: "
                />
              ))}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
