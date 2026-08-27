import React from 'react';
import { ProjectData, Wall, CabinetItem, ApplianceItem, ArchitecturalElement } from '../../types';
import { formatDimension } from '../../utils/unitConversion';
import { DimensionLine } from '../planner2d/DimensionLine';

interface WallElevationSVGProps {
  wall: Wall;
  project: ProjectData;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  showDimensions?: boolean;
}

export const WallElevationSVG: React.FC<WallElevationSVGProps> = ({
  wall,
  project,
  svgRef,
  showDimensions = true,
}) => {
  const { metadata, room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash } = project;
  const unit = metadata.unit;

  // Determine wall length and orientation
  const isWallA = wall.id === 'wall-a';
  const isWallB = wall.id === 'wall-b';
  const isWallC = wall.id === 'wall-c';
  const isWallD = wall.id === 'wall-d';

  const wallLength = isWallA || isWallC ? room.width : room.length;
  const ceilingHeight = room.ceilingHeight;

  // Filter items located on this wall
  // Wall A: Y near 0, rotation 0
  // Wall B: X near room.width, rotation 90
  // Wall C: Y near room.length, rotation 180
  // Wall D: X near 0, rotation 270
  const wallCabinets = cabinets.filter((c) => {
    if (c.wallId === wall.id) return true;
    if (isWallA && (c.y <= 100 || c.rotation === 0)) return true;
    if (isWallB && (c.x >= room.width - 700 || c.rotation === 90)) return true;
    if (isWallC && (c.y >= room.length - 700 || c.rotation === 180)) return true;
    if (isWallD && (c.x <= 100 || c.rotation === 270)) return true;
    return false;
  });

  const wallAppliances = appliances.filter((a) => {
    if (a.wallId === wall.id) return true;
    if (isWallA && (a.y <= 100 || a.rotation === 0)) return true;
    if (isWallB && (a.x >= room.width - 700 || a.rotation === 90)) return true;
    if (isWallC && (a.y >= room.length - 700 || a.rotation === 180)) return true;
    if (isWallD && (a.x <= 100 || a.rotation === 270)) return true;
    return false;
  });

  const wallElements = architecturalElements.filter((e) => {
    if (e.wallId === wall.id) return true;
    if (isWallA && e.y <= 100) return true;
    if (isWallB && e.x >= room.width - 700) return true;
    if (isWallC && e.y >= room.length - 700) return true;
    if (isWallD && e.x <= 100) return true;
    return false;
  });

  // Calculate local X offset along the wall for each item
  const getElevationX = (item: { x: number; y: number; width: number; depth: number; rotation: number }) => {
    if (isWallA) return item.x;
    if (isWallB) return item.y;
    if (isWallC) return room.width - (item.x + item.width);
    if (isWallD) return room.length - (item.y + (item.rotation === 90 || item.rotation === 270 ? item.width : item.depth));
    return item.x;
  };

  // SVG Drawing viewport dimensions & margins
  const margin = 120;
  const svgWidth = wallLength + 2 * margin + 200; // Extra right space for vertical dimension chain
  const svgHeight = ceilingHeight + 2 * margin + 100;

  // Helper to convert elevation Y (Z in 3D, where 0 is floor) to SVG Y (where 0 is top)
  const toSvgY = (zHeight: number) => margin + ceilingHeight - zHeight;

  // Standard vertical reference benchmarks
  const plinthH = plinth.enabled ? plinth.height : 0;
  const baseH = 720;
  const worktopT = countertop.enabled ? countertop.thickness : 0;
  const worktopTotalH = plinthH + baseH + worktopT;
  const wallMountH = 1450;
  const wallUnitH = 720;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-full bg-[#0a0f1d] select-none"
    >
      <defs>
        {/* Wall background grid */}
        <pattern id="elevGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
        </pattern>
        {/* Hatching for floor */}
        <pattern id="floorHatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#334155" strokeWidth="2" />
        </pattern>
      </defs>

      {/* Main Container */}
      <g transform="translate(0, 0)">
        {/* Wall Background Area */}
        <rect
          x={margin}
          y={margin}
          width={wallLength}
          height={ceilingHeight}
          fill="url(#elevGrid)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Floor Ground Strip */}
        <rect
          x={margin - 40}
          y={margin + ceilingHeight}
          width={wallLength + 80}
          height={40}
          fill="url(#floorHatch)"
          stroke="#475569"
          strokeWidth="2"
        />
        {/* Ceiling Line */}
        <line
          x1={margin - 40}
          y1={margin}
          x2={margin + wallLength + 40}
          y2={margin}
          stroke="#475569"
          strokeWidth="3"
          strokeDasharray="6,4"
        />

        {/* Backsplash Tile Zone on Elevation */}
        {backsplash.enabled && (
          <rect
            x={margin}
            y={toSvgY(worktopTotalH + backsplash.height)}
            width={wallLength}
            height={backsplash.height}
            fill="#1e293b"
            fillOpacity="0.4"
            stroke="#38bdf8"
            strokeWidth="0.8"
            strokeDasharray="4,4"
          />
        )}

        {/* --- ARCHITECTURAL ELEMENTS (Windows, Doors) --- */}
        {wallElements.map((el) => {
          const elX = margin + getElevationX(el);
          const elY = toSvgY(el.z + el.height);

          if (el.type === 'window') {
            return (
              <g key={el.id} stroke="#38bdf8" fill="#0f172a" fillOpacity="0.8">
                <rect x={elX} y={elY} width={el.width} height={el.height} strokeWidth="2" />
                {/* Window inner frame & glass mullions */}
                <rect x={elX + 15} y={elY + 15} width={el.width - 30} height={el.height - 30} strokeWidth="1" strokeDasharray="3,3" />
                <line x1={elX + el.width / 2} y1={elY + 15} x2={elX + el.width / 2} y2={elY + el.height - 15} strokeWidth="1" />
                {/* Window Sill */}
                <rect x={elX - 10} y={elY + el.height} width={el.width + 20} height={20} fill="#334155" stroke="#475569" />
                <text x={elX + el.width / 2} y={elY + el.height / 2} textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                  WINDOW {formatDimension(el.width, unit)} x {formatDimension(el.height, unit)}
                </text>
              </g>
            );
          }

          if (el.type === 'door') {
            return (
              <g key={el.id} stroke="#10b981" fill="#0f172a" fillOpacity="0.8">
                <rect x={elX} y={toSvgY(el.height)} width={el.width} height={el.height} strokeWidth="2" />
                <line x1={elX + 15} y1={toSvgY(el.height) + 15} x2={elX + el.width - 15} y2={toSvgY(el.height) + 15} strokeWidth="1" />
                {/* Handle */}
                <circle cx={elX + el.width - 30} cy={toSvgY(1000)} r="6" fill="#10b981" />
                <text x={elX + el.width / 2} y={toSvgY(el.height / 2)} textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">
                  DOOR {formatDimension(el.width, unit)}
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* --- CABINETS ON ELEVATION --- */}
        {wallCabinets.map((cab) => {
          const cabX = margin + getElevationX(cab);
          const cabY = toSvgY(cab.z + cab.height);
          const isWallCab = cab.category === 'wall';
          const isTallCab = cab.category === 'tall';

          let strokeColor = '#94a3b8';
          let fillColor = '#1e293b';
          if (isWallCab) {
            strokeColor = '#38bdf8';
            fillColor = '#0f2438';
          } else if (isTallCab) {
            strokeColor = '#818cf8';
            fillColor = '#1e1b4b';
          }

          return (
            <g key={cab.id} className="elevation-cabinet">
              {/* Cabinet Carcase Box */}
              <rect
                x={cabX}
                y={cabY}
                width={cab.width}
                height={cab.height}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="2"
                rx="2"
              />

              {/* Plinth Kickboard below base/tall units */}
              {(cab.category === 'base' || isTallCab) && plinth.enabled && (
                <rect
                  x={cabX}
                  y={toSvgY(cab.z)}
                  width={cab.width}
                  height={cab.z}
                  fill="#090d16"
                  stroke="#475569"
                  strokeWidth="1"
                />
              )}

              {/* Countertop slice above base unit */}
              {cab.category === 'base' && countertop.enabled && (
                <rect
                  x={cabX}
                  y={toSvgY(cab.z + cab.height + countertop.thickness)}
                  width={cab.width}
                  height={countertop.thickness}
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
              )}

              {/* Door Swing V-Lines (Architectural standard hinge indicator) */}
              {cab.doorCount === 1 && cab.drawerCount === 0 && (
                <g stroke={strokeColor} strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.65">
                  {cab.doorHinge === 'left' ? (
                    // Hinge on left, opens on right: V points to right
                    <polyline points={`${cabX},${cabY} ${cabX + cab.width},${cabY + cab.height / 2} ${cabX},${cabY + cab.height}`} />
                  ) : (
                    // Hinge on right, opens on left: V points to left
                    <polyline points={`${cabX + cab.width},${cabY} ${cabX},${cabY + cab.height / 2} ${cabX + cab.width},${cabY + cab.height}`} />
                  )}
                  {/* Door Handle */}
                  <line
                    x1={cab.doorHinge === 'left' ? cabX + cab.width - 25 : cabX + 25}
                    y1={cabY + cab.height / 2 - 40}
                    x2={cab.doorHinge === 'left' ? cabX + cab.width - 25 : cabX + 25}
                    y2={cabY + cab.height / 2 + 40}
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                </g>
              )}

              {/* Double Door Swing V-Lines */}
              {cab.doorCount === 2 && cab.drawerCount === 0 && (
                <g stroke={strokeColor} strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.65">
                  {/* Left Door */}
                  <polyline points={`${cabX},${cabY} ${cabX + cab.width / 2},${cabY + cab.height / 2} ${cabX},${cabY + cab.height}`} />
                  {/* Right Door */}
                  <polyline points={`${cabX + cab.width},${cabY} ${cabX + cab.width / 2},${cabY + cab.height / 2} ${cabX + cab.width},${cabY + cab.height}`} />
                  {/* Center Line */}
                  <line x1={cabX + cab.width / 2} y1={cabY} x2={cabX + cab.width / 2} y2={cabY + cab.height} stroke={strokeColor} strokeWidth="1" />
                  {/* Handles */}
                  <line x1={cabX + cab.width / 2 - 20} y1={cabY + cab.height / 2 - 35} x2={cabX + cab.width / 2 - 20} y2={cabY + cab.height / 2 + 35} stroke="#ffffff" strokeWidth="3" />
                  <line x1={cabX + cab.width / 2 + 20} y1={cabY + cab.height / 2 - 35} x2={cabX + cab.width / 2 + 20} y2={cabY + cab.height / 2 + 35} stroke="#ffffff" strokeWidth="3" />
                </g>
              )}

              {/* Drawer Lines */}
              {cab.drawerCount > 0 && (
                <g stroke={strokeColor} strokeWidth="1.5">
                  {Array.from({ length: cab.drawerCount }).map((_, idx) => {
                    const drwH = cab.height / cab.drawerCount;
                    const dy = cabY + idx * drwH;
                    return (
                      <g key={idx}>
                        <rect x={cabX + 2} y={dy + 2} width={cab.width - 4} height={drwH - 4} fill="none" stroke={strokeColor} />
                        {/* Drawer handle */}
                        <line x1={cabX + cab.width / 2 - 30} y1={dy + drwH / 2} x2={cabX + cab.width / 2 + 30} y2={dy + drwH / 2} stroke="#ffffff" strokeWidth="3" />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Internal Shelves dashed indicator */}
              {cab.shelfCount > 0 && (
                <g stroke="#64748b" strokeWidth="1" strokeDasharray="2,2">
                  {Array.from({ length: cab.shelfCount }).map((_, idx) => {
                    const sy = cabY + ((cab.height) / (cab.shelfCount + 1)) * (idx + 1);
                    return <line key={idx} x1={cabX + 10} y1={sy} x2={cabX + cab.width - 10} y2={sy} />;
                  })}
                </g>
              )}

              {/* ID Badge Pill */}
              <g transform={`translate(${cabX + cab.width / 2}, ${cabY + cab.height / 2})`}>
                <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#0f172a" stroke={strokeColor} strokeWidth="1.5" />
                <text x="0" y="0" dominantBaseline="central" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {cab.id}
                </text>
              </g>

              {/* Horizontal Width Dimension under/above cabinet */}
              {showDimensions && (
                <DimensionLine
                  x1={cabX}
                  y1={isWallCab ? cabY - 20 : cabY + cab.height + (cab.category === 'base' ? plinthH + 20 : 20)}
                  x2={cabX + cab.width}
                  y2={isWallCab ? cabY - 20 : cabY + cab.height + (cab.category === 'base' ? plinthH + 20 : 20)}
                  value={cab.width}
                  unit={unit}
                  color={strokeColor}
                  fontSize={10}
                />
              )}
            </g>
          );
        })}

        {/* --- APPLIANCES ON ELEVATION --- */}
        {wallAppliances.map((app) => {
          const appX = margin + getElevationX(app);
          const appY = toSvgY(app.z + app.height);

          return (
            <g key={app.id} stroke="#f59e0b" fill="#451a03" fillOpacity="0.8">
              <rect x={appX} y={appY} width={app.width} height={app.height} strokeWidth="2" rx="2" />
              {/* ID Badge */}
              <rect x={appX + app.width / 2 - 20} y={appY + app.height / 2 - 10} width="40" height="20" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
              <text x={appX + app.width / 2} y={appY + app.height / 2} dominantBaseline="central" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
                {app.id}
              </text>
            </g>
          );
        })}

        {/* --- VERTICAL ARCHITECTURAL DIMENSION CHAIN (Right side) --- */}
        {showDimensions && (
          <g className="vertical-dimensions">
            {/* Plinth Height (0 -> 100mm) */}
            {plinthH > 0 && (
              <DimensionLine
                x1={margin + wallLength + 40}
                y1={toSvgY(0)}
                x2={margin + wallLength + 40}
                y2={toSvgY(plinthH)}
                value={plinthH}
                unit={unit}
                color="#94a3b8"
                fontSize={10}
                prefix="PLINTH: "
              />
            )}

            {/* Base Unit Height (100 -> 820mm) */}
            <DimensionLine
              x1={margin + wallLength + 40}
              y1={toSvgY(plinthH)}
              x2={margin + wallLength + 40}
              y2={toSvgY(plinthH + baseH)}
              value={baseH}
              unit={unit}
              color="#94a3b8"
              fontSize={10}
              prefix="BASE: "
            />

            {/* Countertop Thickness (820 -> 850mm) */}
            {worktopT > 0 && (
              <DimensionLine
                x1={margin + wallLength + 40}
                y1={toSvgY(plinthH + baseH)}
                x2={margin + wallLength + 40}
                y2={toSvgY(worktopTotalH)}
                value={worktopT}
                unit={unit}
                color="#cbd5e1"
                fontSize={9}
                prefix="TOP: "
              />
            )}

            {/* Backsplash Gap (850 -> 1450mm) */}
            <DimensionLine
              x1={margin + wallLength + 40}
              y1={toSvgY(worktopTotalH)}
              x2={margin + wallLength + 40}
              y2={toSvgY(wallMountH)}
              value={wallMountH - worktopTotalH}
              unit={unit}
              color="#38bdf8"
              fontSize={10}
              prefix="SPLASH: "
            />

            {/* Wall Unit Height (1450 -> 2170mm) */}
            <DimensionLine
              x1={margin + wallLength + 40}
              y1={toSvgY(wallMountH)}
              x2={margin + wallLength + 40}
              y2={toSvgY(wallMountH + wallUnitH)}
              value={wallUnitH}
              unit={unit}
              color="#38bdf8"
              fontSize={10}
              prefix="WALL CAB: "
            />

            {/* Top Gap to Ceiling (2170 -> 2600mm) */}
            {ceilingHeight > wallMountH + wallUnitH && (
              <DimensionLine
                x1={margin + wallLength + 40}
                y1={toSvgY(wallMountH + wallUnitH)}
                x2={margin + wallLength + 40}
                y2={toSvgY(ceilingHeight)}
                value={ceilingHeight - (wallMountH + wallUnitH)}
                unit={unit}
                color="#64748b"
                fontSize={10}
                prefix="CEIL GAP: "
              />
            )}

            {/* Overall Ceiling Height String (0 -> 2600mm) */}
            <DimensionLine
              x1={margin + wallLength + 120}
              y1={toSvgY(0)}
              x2={margin + wallLength + 120}
              y2={toSvgY(ceilingHeight)}
              value={ceilingHeight}
              unit={unit}
              color="#60a5fa"
              fontSize={12}
              prefix="CEILING H: "
            />
          </g>
        )}

        {/* --- OVERALL WALL LENGTH DIMENSION (Top) --- */}
        {showDimensions && (
          <DimensionLine
            x1={margin}
            y1={margin - 40}
            x2={margin + wallLength}
            y2={margin - 40}
            value={wallLength}
            unit={unit}
            color="#60a5fa"
            fontSize={13}
            prefix={`OVERALL ${wall.name.toUpperCase()}: `}
          />
        )}

        {/* Elevation Title Stamp */}
        <g transform={`translate(${margin}, ${svgHeight - 40})`}>
          <text fill="#f8fafc" fontSize="18" fontWeight="bold" fontFamily="monospace">
            {wall.name.toUpperCase()} ELEVATION
          </text>
          <text x="350" fill="#94a3b8" fontSize="12" fontFamily="monospace">
            WALL LENGTH: {formatDimension(wallLength, unit)} | CEILING: {formatDimension(ceilingHeight, unit)} | SCALE: 1:20
          </text>
        </g>
      </g>
    </svg>
  );
};
