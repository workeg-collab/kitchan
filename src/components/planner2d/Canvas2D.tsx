import React, { useRef, useState, useCallback } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CabinetNode2D } from './CabinetNode2D';
import { ApplianceNode2D } from './ApplianceNode2D';
import { ArchElementNode2D } from './ArchElementNode2D';
import { DimensionLine } from './DimensionLine';
import { calculateSnap, calculateAisleClearance } from '../../utils/cadGeometry';
import { formatDimension, convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { TRANSLATIONS } from '../../utils/i18n';
import { FloatingCanvasToolbar } from '../layout/FloatingCanvasToolbar';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCw, 
  Copy, 
  Trash2, 
  Grid, 
  Ruler, 
  Eye,
  PencilRuler,
  Archive,
  X
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';

export const Canvas2D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    project,
    selectedId,
    selectedType,
    setSelected,
    clearSelection,
    addCabinet,
    addAppliance,
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
    updateRoomDimensions,
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
    setIsRoomSketcherOpen,
    language,
    drawingTool,
    setDrawingTool,
  } = useUIStore();

  const t = TRANSLATIONS[language];
  const { room, cabinets, appliances, architecturalElements } = project;

  // Manual CAD Interactive Drawing Box
  const [drawBox, setDrawBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

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

  // Interactive Room Resizing Handle
  const [isResizingRoom, setIsResizingRoom] = useState(false);
  const [roomResizeStart, setRoomResizeStart] = useState({ startX: 0, startY: 0, initialW: 0, initialL: 0 });

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

  // Canvas Mouse Down
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (drawingTool !== 'none') {
      const svgCoords = clientToSVG(e.clientX, e.clientY);
      const snappedX = snapToGridEnabled ? Math.round(svgCoords.x / gridSize) * gridSize : Math.round(svgCoords.x);
      const snappedY = snapToGridEnabled ? Math.round(svgCoords.y / gridSize) * gridSize : Math.round(svgCoords.y);
      setDrawBox({ startX: snappedX, startY: snappedY, currentX: snappedX, currentY: snappedY });
      clearSelection();
      return;
    }

    if (e.target === svgRef.current || (e.target as HTMLElement).id === 'cad-canvas-bg' || (e.target as HTMLElement).id === 'room-floor-bg') {
      if (e.button === 0 || e.button === 1) {
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
    if (drawingTool !== 'none') {
      handleCanvasMouseDown(e);
      return;
    }
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
    soundEffects.playPick();
  };

  // Start Resizing Room from Corner Handle
  const handleRoomResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const svgCoords = clientToSVG(e.clientX, e.clientY);
    setIsResizingRoom(true);
    setRoomResizeStart({
      startX: svgCoords.x,
      startY: svgCoords.y,
      initialW: room.width,
      initialL: room.length,
    });
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawBox) {
      const svgCoords = clientToSVG(e.clientX, e.clientY);
      const snappedX = snapToGridEnabled ? Math.round(svgCoords.x / gridSize) * gridSize : Math.round(svgCoords.x);
      const snappedY = snapToGridEnabled ? Math.round(svgCoords.y / gridSize) * gridSize : Math.round(svgCoords.y);
      setDrawBox((prev) => (prev ? { ...prev, currentX: snappedX, currentY: snappedY } : null));
      return;
    }

    if (isPanning) {
      setPan2D({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (isResizingRoom) {
      const svgCoords = clientToSVG(e.clientX, e.clientY);
      const dx = svgCoords.x - roomResizeStart.startX;
      const dy = svgCoords.y - roomResizeStart.startY;
      const newW = Math.max(2000, Math.round((roomResizeStart.initialW + dx) / 100) * 100);
      const newL = Math.max(2000, Math.round((roomResizeStart.initialL + dy) / 100) * 100);
      updateRoomDimensions(newW, newL, room.ceilingHeight, room.wallThickness);
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
          snapToGridEnabled ? gridSize : 1,
          75,
          room.width,
          room.length
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

  const handleMouseUp = () => {
    if (drawBox) {
      const minX = Math.min(drawBox.startX, drawBox.currentX);
      const minY = Math.min(drawBox.startY, drawBox.currentY);
      const rawW = Math.abs(drawBox.currentX - drawBox.startX);
      const rawD = Math.abs(drawBox.currentY - drawBox.startY);

      if (rawW >= 150 && rawD >= 150) {
        const roundedW = Math.round(rawW / 10) * 10;
        const roundedD = Math.round(rawD / 10) * 10;
        const roundedX = Math.round(minX / 10) * 10;
        const roundedY = Math.round(minY / 10) * 10;

        if (drawingTool === 'dressing') {
          const newCabinet: any = {
            id: `dressing-custom-${Date.now().toString().slice(-4)}`,
            name: `علبة دريسنج رسم يدوي (${formatDimension(roundedW, unit)} × ${formatDimension(roundedD, unit)})`,
            type: 'dressing-carcass-custom',
            category: 'wardrobe',
            x: roundedX,
            y: roundedY,
            z: 0,
            width: roundedW,
            depth: roundedD,
            height: 2400,
            rotation: 0,
            doorCount: 0,
            doorType: 'open',
            drawerCount: 2,
            shelfCount: 3,
            hasHangingRail: true,
            isCustomDressingCarcass: true,
            verticalDividersCount: roundedW > 1000 ? 1 : 0,
            materialBody: 'كونتر ميلامين أبيض',
            materialFront: 'MDF قشرة أرو طبيعي',
          };
          addCabinet(newCabinet);
          setSelected(newCabinet.id, 'cabinet');
          soundEffects.playDrop();
        } else if (drawingTool === 'shoe-cabinet') {
          const isSlim = roundedD <= 260;
          const newCabinet: any = {
            id: `shoe-custom-${Date.now().toString().slice(-4)}`,
            name: `جزامة رسم يدوي (${formatDimension(roundedW, unit)} × ${formatDimension(roundedD, unit)})`,
            type: isSlim ? 'shoe-cabinet-drop-down' : 'shoe-cabinet-custom',
            category: 'shoe-cabinet',
            x: roundedX,
            y: roundedY,
            z: 0,
            width: roundedW,
            depth: roundedD,
            height: isSlim ? 1200 : (roundedW > 800 ? 2000 : 1100),
            rotation: 0,
            doorCount: isSlim ? 0 : 2,
            doorType: isSlim ? 'open' : 'hinged',
            drawerCount: isSlim ? 0 : 1,
            shelfCount: isSlim ? 3 : 4,
            isShoeCabinet: true,
            shoeCabinetType: isSlim ? 'drop-down' : 'tall-shelves',
            hasDropFlaps: isSlim,
            shoeTiersCount: 3,
            hasShoeShelves: true,
            materialBody: 'كونتر ميلامين أبيض',
            materialFront: 'MDF قشرة أرو طبيعي',
          };
          addCabinet(newCabinet);
          setSelected(newCabinet.id, 'cabinet');
          soundEffects.playDrop();
        }
      }
      setDrawBox(null);
      setDrawingTool('none');
      return;
    }

    if (draggingItem) {
      soundEffects.playDrop();
    }
    setIsPanning(false);
    setDraggingItem(null);
    setIsResizingRoom(false);
    setActiveGuides([]);
  };

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

  // Global Keyboard Shortcuts in 2D Planner
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (drawingTool !== 'none') {
          setDrawingTool('none');
          setDrawBox(null);
          return;
        }
        clearSelection();
        return;
      }

      if (!selectedId) return;

      const step = e.shiftKey ? 100 : e.altKey ? 10 : 50;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (selectedCabinet) updateCabinet(selectedId, { x: Math.max(0, selectedCabinet.x - step) });
        if (selectedAppliance) updateAppliance(selectedId, { x: Math.max(0, selectedAppliance.x - step) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (selectedCabinet) updateCabinet(selectedId, { x: Math.min(room.width, selectedCabinet.x + step) });
        if (selectedAppliance) updateAppliance(selectedId, { x: Math.min(room.width, selectedAppliance.x + step) });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedCabinet) updateCabinet(selectedId, { y: Math.max(0, selectedCabinet.y - step) });
        if (selectedAppliance) updateAppliance(selectedId, { y: Math.max(0, selectedAppliance.y - step) });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedCabinet) updateCabinet(selectedId, { y: Math.min(room.length, selectedCabinet.y + step) });
        if (selectedAppliance) updateAppliance(selectedId, { y: Math.min(room.length, selectedAppliance.y + step) });
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (selectedType === 'cabinet') rotateCabinet(selectedId, 90);
        if (selectedType === 'appliance') rotateAppliance(selectedId, 90);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedType === 'cabinet') removeCabinet(selectedId);
        if (selectedType === 'appliance') removeAppliance(selectedId);
        if (selectedType === 'element') removeElement(selectedId);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (selectedType === 'cabinet') duplicateCabinet(selectedId);
        if (selectedType === 'appliance') duplicateAppliance(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedType, selectedCabinet, selectedAppliance, room.width, room.length, drawingTool]);

  // Handle Drag & Drop from Catalog into 2D Canvas
  const handleDrop2D = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      const svgCoords = clientToSVG(e.clientX, e.clientY);

      if (data.type === 'cabinet' && data.template) {
        const template = data.template;
        const w = data.width || template.defaultWidth;
        const d = template.defaultDepth;

        const snap = calculateSnap(
          svgCoords.x - w / 2,
          svgCoords.y - d / 2,
          w,
          d,
          0,
          room.walls,
          cabinets,
          gridSize,
          75,
          room.width,
          room.length
        );

        addCabinet({
          name: template.name,
          category: template.category,
          type: template.type,
          projectType: project.metadata.projectType,
          width: w,
          height: template.defaultHeight,
          depth: d,
          x: snap.x,
          y: snap.y,
          z: template.defaultZ,
          rotation: 0,
          wallId: snap.snappedToWall || 'wall-a',
          doorCount: template.doorCount,
          drawerCount: template.drawerCount,
          shelfCount: template.shelfCount,
          doorHinge: template.doorHinge || 'right',
          doorType: template.doorType,
          hasSinkCutout: template.hasSinkCutout,
          hasApplianceCavity: template.hasApplianceCavity,
          flipUpDoor: template.flipUpDoor,
          isCeilingUnit: template.isCeilingUnit,
        });
      }
    } catch (err) {
      console.warn('2D drop error:', err);
    }
  };

  const aisleClearances = showAisleClearance ? calculateAisleClearance(cabinets, room.width, room.length) : [];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-100 overflow-hidden flex flex-col select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop2D}
    >
      {/* Sleek Floating Canvas Toolbar */}
      <FloatingCanvasToolbar mode="2d" />

      {/* Floating Selection Quick Toolbar */}
      {selectedItemPos && selectedId && (
        <div
          className="absolute z-30 flex items-center gap-1.5 p-1.5 bg-slate-900/95 text-white backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${Math.max(16, Math.min(window.innerWidth - 380, pan2D.x + selectedItemPos.x * zoom2D))}px`,
            top: `${Math.max(16, pan2D.y + selectedItemPos.y * zoom2D - 52)}px`,
          }}
        >
          {/* Item Label Badge */}
          <div className="px-2.5 py-1 bg-slate-800 rounded-xl text-xs font-bold text-amber-400 font-mono border border-slate-700">
            {selectedCabinet ? selectedCabinet.id : selectedAppliance?.id}
          </div>

          {/* Rotate 90 deg */}
          <button
            onClick={() => {
              if (selectedType === 'cabinet') rotateCabinet(selectedId, 90);
              else if (selectedType === 'appliance') rotateAppliance(selectedId, 90);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-blue-600 rounded-xl text-xs font-bold transition text-slate-200 hover:text-white"
            title="تدوير 90 درجة (R)"
          >
            <RotateCw size={14} />
            <span>تدوير</span>
          </button>

          {/* Quick Width Buttons */}
          {selectedCabinet && (
            <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => updateCabinet(selectedCabinet.id, { width: Math.max(200, selectedCabinet.width - 50) })}
                className="px-1.5 py-1 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition"
                title="إنقاص العرض 5 سم"
              >
                -5
              </button>
              <span className="text-[11px] font-bold text-amber-400 px-1 font-mono">
                {formatDimension(selectedCabinet.width, unit)}
              </span>
              <button
                onClick={() => updateCabinet(selectedCabinet.id, { width: Math.min(2400, selectedCabinet.width + 50) })}
                className="px-1.5 py-1 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition"
                title="زيادة العرض 5 سم"
              >
                +5
              </button>
            </div>
          )}

          {/* Duplicate */}
          <button
            onClick={() => {
              if (selectedType === 'cabinet') duplicateCabinet(selectedId);
              else if (selectedType === 'appliance') duplicateAppliance(selectedId);
            }}
            className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl transition"
            title="تكرار القطعة (Ctrl+D)"
          >
            <Copy size={15} />
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              if (selectedType === 'cabinet') removeCabinet(selectedId);
              else if (selectedType === 'appliance') removeAppliance(selectedId);
              else if (selectedType === 'element') removeElement(selectedId);
            }}
            className="p-1.5 bg-slate-800 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition"
            title="حذف القطعة (Del)"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}

      {/* Floating Active Drawing Mode Banner */}
      {drawingTool !== 'none' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-slate-900/95 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200 select-none">
          <div className={`p-1.5 rounded-xl text-white ${drawingTool === 'dressing' ? 'bg-purple-600 shadow-md shadow-purple-600/30' : 'bg-emerald-600 shadow-md shadow-emerald-600/30'}`}>
            {drawingTool === 'dressing' ? <PencilRuler size={17} /> : <Archive size={17} />}
          </div>
          <div>
            <p className="text-xs font-bold flex items-center gap-2">
              <span>{drawingTool === 'dressing' ? 'وضع رسم الدريسينج اليدوي نشط' : 'وضع رسم الجزامة اليدوي نشط'}</span>
              <span className="text-[10px] bg-white/20 text-slate-100 px-2 py-0.5 rounded-md font-mono">
                اضغط واسحب المؤشر
              </span>
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5">
              انقر في أي مكان داخل الغرفة واسحب الماوس لتحديد العرض والعمق المطلوب ثم ارفع يدك
            </p>
          </div>
          <button
            onClick={() => {
              setDrawingTool('none');
              setDrawBox(null);
            }}
            className="mr-2 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-1 text-xs font-bold"
            title="إلغاء وضع الرسم (Esc)"
          >
            <X size={15} />
            <span>إلغاء</span>
          </button>
        </div>
      )}

      {/* Main SVG CAD Canvas (Light Mode) */}
      <svg
        ref={svgRef}
        id="cad-canvas-bg"
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
      >
        <defs>
          <pattern id="cadGridLightSmall" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0, 0, 0, 0.04)" strokeWidth="1" />
          </pattern>
          <pattern id="cadGridLightMajor" width="500" height="500" patternUnits="userSpaceOnUse">
            <rect width="500" height="500" fill="url(#cadGridLightSmall)" />
            <path d="M 500 0 L 0 0 0 500" fill="none" stroke="rgba(37, 99, 235, 0.12)" strokeWidth="1.5" />
          </pattern>
        </defs>

        <g transform={`translate(${pan2D.x}, ${pan2D.y}) scale(${zoom2D})`}>
          {/* Light Grid Background */}
          <rect
            x={-5000}
            y={-5000}
            width={15000}
            height={15000}
            fill="url(#cadGridLightMajor)"
            className="pointer-events-none"
          />

          {/* Room Interior Floor (Clean White) */}
          <rect
            x={0}
            y={0}
            width={room.width}
            height={room.length}
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            rx="2"
          />

          {/* Outer Wall Boundaries */}
          <g className="walls-group">
            {/* Top Wall A */}
            <rect
              x={-room.wallThickness}
              y={-room.wallThickness}
              width={room.width + 2 * room.wallThickness}
              height={room.wallThickness}
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Right Wall B */}
            <rect
              x={room.width}
              y={-room.wallThickness}
              width={room.wallThickness}
              height={room.length + 2 * room.wallThickness}
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Bottom Wall C */}
            <rect
              x={-room.wallThickness}
              y={room.length}
              width={room.width + 2 * room.wallThickness}
              height={room.wallThickness}
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Left Wall D */}
            <rect
              x={-room.wallThickness}
              y={-room.wallThickness}
              width={room.wallThickness}
              height={room.length + 2 * room.wallThickness}
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Wall Labels */}
            <text x={room.width / 2} y={-room.wallThickness / 2} textAnchor="middle" dominantBaseline="central" fill="#475569" fontSize="24" fontWeight="bold" fontFamily="monospace">
              {t.wallA}
            </text>
            <text x={room.width + room.wallThickness / 2} y={room.length / 2} textAnchor="middle" dominantBaseline="central" fill="#475569" fontSize="24" fontWeight="bold" fontFamily="monospace" transform={`rotate(90, ${room.width + room.wallThickness / 2}, ${room.length / 2})`}>
              {t.wallB}
            </text>
            <text x={room.width / 2} y={room.length + room.wallThickness / 2} textAnchor="middle" dominantBaseline="central" fill="#475569" fontSize="24" fontWeight="bold" fontFamily="monospace">
              {t.wallC}
            </text>
            <text x={-room.wallThickness / 2} y={room.length / 2} textAnchor="middle" dominantBaseline="central" fill="#475569" fontSize="24" fontWeight="bold" fontFamily="monospace" transform={`rotate(-90, ${-room.wallThickness / 2}, ${room.length / 2})`}>
              {t.wallD}
            </text>
          </g>

          {/* Interactive Room Corner Resize Handle */}
          <g
            transform={`translate(${room.width}, ${room.length})`}
            onMouseDown={handleRoomResizeMouseDown}
            className="cursor-nwse-resize group"
          >
            <circle cx="0" cy="0" r="16" fill="#2563eb" fillOpacity="0.8" stroke="#ffffff" strokeWidth="3" className="group-hover:scale-125 transition" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="10" fontWeight="bold">↔</text>
          </g>

          {/* Architectural Elements (Doors & Windows) */}
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
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              {guide.label && (
                <text
                  x={(guide.x1 + guide.x2) / 2}
                  y={(guide.y1 + guide.y2) / 2 - 8}
                  fill="#2563eb"
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
              {showWallDimensions && (
                <>
                  <DimensionLine
                    x1={0}
                    y1={0}
                    x2={room.width}
                    y2={0}
                    value={room.width}
                    unit={unit}
                    offset={-room.wallThickness - 60}
                    color="#2563eb"
                    fontSize={14}
                    prefix={`${t.wallA}: `}
                  />
                  <DimensionLine
                    x1={room.width}
                    y1={0}
                    x2={room.width}
                    y2={room.length}
                    value={room.length}
                    unit={unit}
                    offset={-room.wallThickness - 60}
                    color="#2563eb"
                    fontSize={14}
                    prefix={`${t.wallB}: `}
                  />
                </>
              )}

              {aisleClearances.map((aisle, i) => (
                <DimensionLine
                  key={`aisle-${i}`}
                  x1={aisle.x1}
                  y1={aisle.y1}
                  x2={aisle.x2}
                  y2={aisle.y2}
                  value={aisle.distance}
                  unit={unit}
                  color="#9333ea"
                  fontSize={12}
                  prefix={`${t.aisles}: `}
                />
              ))}
            </g>
          )}

          {/* Live Manual CAD Drawing Box (مستطيل وأبعاد الرسم اليدوي المباشر) */}
          {drawBox && (
            <g className="pointer-events-none">
              {(() => {
                const minX = Math.min(drawBox.startX, drawBox.currentX);
                const minY = Math.min(drawBox.startY, drawBox.currentY);
                const w = Math.max(10, Math.abs(drawBox.currentX - drawBox.startX));
                const d = Math.max(10, Math.abs(drawBox.currentY - drawBox.startY));
                const isDressing = drawingTool === 'dressing';
                const strokeColor = isDressing ? '#9333ea' : '#059669';
                const fillColor = isDressing ? 'rgba(147, 51, 234, 0.22)' : 'rgba(5, 150, 105, 0.22)';

                return (
                  <>
                    {/* Outer Drawn Box */}
                    <rect
                      x={minX}
                      y={minY}
                      width={w}
                      height={d}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                      rx="4"
                    />

                    {/* Corner Guides / Crosslines */}
                    <line x1={minX} y1={minY} x2={minX + w} y2={minY + d} stroke={strokeColor} strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
                    <line x1={minX + w} y1={minY} x2={minX} y2={minY + d} stroke={strokeColor} strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />

                    {/* Live Dimension Badge at Center */}
                    <g transform={`translate(${minX + w / 2}, ${minY + d / 2})`}>
                      <rect
                        x="-75"
                        y="-16"
                        width="150"
                        height="32"
                        rx="10"
                        fill="#0f172a"
                        opacity="0.92"
                      />
                      <text
                        x="0"
                        y="4"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {formatDimension(Math.round(w / 10) * 10, unit)} × {formatDimension(Math.round(d / 10) * 10, unit)}
                      </text>
                    </g>

                    {/* Title Banner */}
                    <text
                      x={minX + w / 2}
                      y={minY - 10}
                      fill={strokeColor}
                      fontSize="12"
                      fontWeight="extrabold"
                      textAnchor="middle"
                    >
                      {isDressing ? '✏️ علبة دريسنج يدوي' : '👟 جزامة يدوي'}
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </g>
      </svg>

      {/* Floating Direct Quick Dimension Editor Pill (Direct On-Canvas Editing) */}
      {(selectedCabinet || selectedAppliance || selectedElement) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-300 shadow-xl px-4 py-2 rounded-2xl flex items-center gap-3 z-30 animate-in fade-in slide-in-from-top-2 text-xs select-none">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>
              {selectedCabinet?.name || selectedAppliance?.name || selectedElement?.name}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Quick Editable Inputs for Width, Height, Depth */}
          {selectedCabinet && (
            <div className="flex items-center gap-2 font-mono">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">W:</span>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedCabinet.width, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { width: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-blue-600 focus:bg-white focus:outline-none text-center"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">H:</span>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedCabinet.height, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { height: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 focus:bg-white focus:outline-none text-center"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">D:</span>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedCabinet.depth, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { depth: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 focus:bg-white focus:outline-none text-center"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{unit}</span>
            </div>
          )}

          {selectedAppliance && (
            <div className="flex items-center gap-2 font-mono">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">W:</span>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedAppliance.width, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { width: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-amber-600 focus:bg-white focus:outline-none text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">H:</span>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedAppliance.height, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { height: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 focus:bg-white focus:outline-none text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">D:</span>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedAppliance.depth, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { depth: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 focus:bg-white focus:outline-none text-center"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{unit}</span>
            </div>
          )}

          {selectedElement && (
            <div className="flex items-center gap-2 font-mono">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">W:</span>
                <input
                  type="number"
                  min={1}
                  value={convertMmToUnit(selectedElement.width, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { width: Math.max(1, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-emerald-600 focus:bg-white focus:outline-none text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">D:</span>
                <input
                  type="number"
                  min={1}
                  value={convertMmToUnit(selectedElement.depth, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { depth: Math.max(1, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 focus:bg-white focus:outline-none text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">H:</span>
                <input
                  type="number"
                  min={1}
                  value={convertMmToUnit(selectedElement.height, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { height: Math.max(1, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 focus:bg-white focus:outline-none text-center"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{unit}</span>
            </div>
          )}

          <button
            onClick={clearSelection}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition"
            title="إلغاء التحديد"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
