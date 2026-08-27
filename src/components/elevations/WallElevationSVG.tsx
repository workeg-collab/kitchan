import React from 'react';
import { ProjectData, Wall } from '../../types';
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

  const isWallA = wall.id === 'wall-a';
  const isWallB = wall.id === 'wall-b';
  const isWallC = wall.id === 'wall-c';
  const isWallD = wall.id === 'wall-d';

  const wallLength = isWallA || isWallC ? room.width : room.length;
  const ceilingHeight = room.ceilingHeight;

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

  const getElevationX = (item: { x: number; y: number; width: number; depth: number; rotation: number }) => {
    if (isWallA) return item.x;
    if (isWallB) return item.y;
    if (isWallC) return room.width - (item.x + item.width);
    if (isWallD) return room.length - (item.y + (item.rotation === 90 || item.rotation === 270 ? item.width : item.depth));
    return item.x;
  };

  const margin = 120;
  const svgWidth = wallLength + 2 * margin + 200;
  const svgHeight = ceilingHeight + 2 * margin + 100;

  const toSvgY = (zHeight: number) => margin + ceilingHeight - zHeight;

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
      className="w-full h-full bg-white select-none shadow-sm"
    >
      <defs>
        <pattern id="elevGridLight" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0, 0, 0, 0.04)" strokeWidth="1" />
        </pattern>
        <pattern id="floorHatchLight" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#cbd5e1" strokeWidth="2" />
        </pattern>
      </defs>

      <g transform="translate(0, 0)">
        {/* Wall Background Area (Clean Architectural Paper) */}
        <rect
          x={margin}
          y={margin}
          width={wallLength}
          height={ceilingHeight}
          fill="url(#elevGridLight)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Floor Ground Strip */}
        <rect
          x={margin - 40}
          y={margin + ceilingHeight}
          width={wallLength + 80}
          height={40}
          fill="url(#floorHatchLight)"
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

        {/* Backsplash Tile Zone */}
        {backsplash.enabled && (
          <rect
            x={margin}
            y={toSvgY(worktopTotalH + backsplash.height)}
            width={wallLength}
            height={backsplash.height}
            fill="#e2e8f0"
            fillOpacity="0.5"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        )}

        {/* Architectural Elements (Windows, Doors) */}
        {wallElements.map((el) => {
          const elX = margin + getElevationX(el);
          const elY = toSvgY(el.z + el.height);

          if (el.type === 'window') {
            return (
              <g key={el.id} stroke="#0284c7" fill="#f0f9ff">
                <rect x={elX} y={elY} width={el.width} height={el.height} strokeWidth="2" />
                <rect x={elX + 15} y={elY + 15} width={el.width - 30} height={el.height - 30} strokeWidth="1" strokeDasharray="3,3" />
                <line x1={elX + el.width / 2} y1={elY + 15} x2={elX + el.width / 2} y2={elY + el.height - 15} strokeWidth="1" />
                <rect x={elX - 10} y={elY + el.height} width={el.width + 20} height={20} fill="#e2e8f0" stroke="#64748b" />
                <text x={elX + el.width / 2} y={elY + el.height / 2} textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">
                  WINDOW {formatDimension(el.width, unit)} x {formatDimension(el.height, unit)}
                </text>
              </g>
            );
          }

          if (el.type === 'door') {
            return (
              <g key={el.id} stroke="#16a34a" fill="#f0fdf4">
                <rect x={elX} y={toSvgY(el.height)} width={el.width} height={el.height} strokeWidth="2" />
                <line x1={elX + 15} y1={toSvgY(el.height) + 15} x2={elX + el.width - 15} y2={toSvgY(el.height) + 15} strokeWidth="1" />
                <circle cx={elX + el.width - 30} cy={toSvgY(1000)} r="6" fill="#16a34a" />
                <text x={elX + el.width / 2} y={toSvgY(el.height / 2)} textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="bold">
                  DOOR {formatDimension(el.width, unit)}
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* Cabinets on Elevation */}
        {wallCabinets.map((cab) => {
          const cabX = margin + getElevationX(cab);
          const cabY = toSvgY(cab.z + cab.height);
          const isWallCab = cab.category === 'wall';
          const isTallCab = cab.category === 'tall';

          let strokeColor = '#334155';
          let fillColor = '#f8fafc';
          if (isWallCab) {
            strokeColor = '#0284c7';
            fillColor = '#f0f9ff';
          } else if (isTallCab) {
            strokeColor = '#6366f1';
            fillColor = '#eef2ff';
          }

          return (
            <g key={cab.id} className="elevation-cabinet">
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

              {(cab.category === 'base' || isTallCab) && plinth.enabled && (
                <rect
                  x={cabX}
                  y={toSvgY(cab.z)}
                  width={cab.width}
                  height={cab.z}
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              )}

              {cab.category === 'base' && countertop.enabled && (
                <rect
                  x={cabX}
                  y={toSvgY(cab.z + cab.height + countertop.thickness)}
                  width={cab.width}
                  height={countertop.thickness}
                  fill="#cbd5e1"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
              )}

              {/* Door Swing V-Lines */}
              {cab.doorCount === 1 && cab.drawerCount === 0 && (
                <g stroke={strokeColor} strokeWidth="1.2" strokeDasharray="4,3" fill="none" opacity="0.7">
                  {cab.doorHinge === 'left' ? (
                    <polyline points={`${cabX},${cabY} ${cabX + cab.width},${cabY + cab.height / 2} ${cabX},${cabY + cab.height}`} />
                  ) : (
                    <polyline points={`${cabX + cab.width},${cabY} ${cabX},${cabY + cab.height / 2} ${cabX + cab.width},${cabY + cab.height}`} />
                  )}
                  <line
                    x1={cab.doorHinge === 'left' ? cabX + cab.width - 25 : cabX + 25}
                    y1={cabY + cab.height / 2 - 35}
                    x2={cab.doorHinge === 'left' ? cabX + cab.width - 25 : cabX + 25}
                    y2={cabY + cab.height / 2 + 35}
                    stroke="#0f172a"
                    strokeWidth="3"
                  />
                </g>
              )}

              {cab.doorCount === 2 && cab.drawerCount === 0 && (
                <g stroke={strokeColor} strokeWidth="1.2" strokeDasharray="4,3" fill="none" opacity="0.7">
                  <polyline points={`${cabX},${cabY} ${cabX + cab.width / 2},${cabY + cab.height / 2} ${cabX},${cabY + cab.height}`} />
                  <polyline points={`${cabX + cab.width},${cabY} ${cabX + cab.width / 2},${cabY + cab.height / 2} ${cabX + cab.width},${cabY + cab.height}`} />
                  <line x1={cabX + cab.width / 2} y1={cabY} x2={cabX + cab.width / 2} y2={cabY + cab.height} stroke={strokeColor} strokeWidth="1" />
                  <line x1={cabX + cab.width / 2 - 20} y1={cabY + cab.height / 2 - 35} x2={cabX + cab.width / 2 - 20} y2={cabY + cab.height / 2 + 35} stroke="#0f172a" strokeWidth="3" />
                  <line x1={cabX + cab.width / 2 + 20} y1={cabY + cab.height / 2 - 35} x2={cabX + cab.width / 2 + 20} y2={cabY + cab.height / 2 + 35} stroke="#0f172a" strokeWidth="3" />
                </g>
              )}

              {cab.drawerCount > 0 && (
                <g stroke={strokeColor} strokeWidth="1.5">
                  {Array.from({ length: cab.drawerCount }).map((_, idx) => {
                    const drwH = cab.height / cab.drawerCount;
                    const dy = cabY + idx * drwH;
                    return (
                      <g key={idx}>
                        <rect x={cabX + 2} y={dy + 2} width={cab.width - 4} height={drwH - 4} fill="none" stroke={strokeColor} />
                        <line x1={cabX + cab.width / 2 - 30} y1={dy + drwH / 2} x2={cabX + cab.width / 2 + 30} y2={dy + drwH / 2} stroke="#0f172a" strokeWidth="3" />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ID Badge Pill */}
              <g transform={`translate(${cabX + cab.width / 2}, ${cabY + cab.height / 2})`}>
                <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />
                <text x="0" y="0" dominantBaseline="central" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {cab.id}
                </text>
              </g>

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

        {/* Appliances */}
        {wallAppliances.map((app) => {
          const appX = margin + getElevationX(app);
          const appY = toSvgY(app.z + app.height);

          return (
            <g key={app.id} stroke="#d97706" fill="#fef3c7">
              <rect x={appX} y={appY} width={app.width} height={app.height} strokeWidth="2" rx="2" />
              <rect x={appX + app.width / 2 - 20} y={appY + app.height / 2 - 10} width="40" height="20" rx="3" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
              <text x={appX + app.width / 2} y={appY + app.height / 2} dominantBaseline="central" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                {app.id}
              </text>
            </g>
          );
        })}

        {/* Vertical Dimensions Chain */}
        {showDimensions && (
          <g className="vertical-dimensions">
            {plinthH > 0 && (
              <DimensionLine
                x1={margin + wallLength + 40}
                y1={toSvgY(0)}
                x2={margin + wallLength + 40}
                y2={toSvgY(plinthH)}
                value={plinthH}
                unit={unit}
                color="#64748b"
                fontSize={10}
                prefix="PLINTH: "
              />
            )}

            <DimensionLine
              x1={margin + wallLength + 40}
              y1={toSvgY(plinthH)}
              x2={margin + wallLength + 40}
              y2={toSvgY(plinthH + baseH)}
              value={baseH}
              unit={unit}
              color="#64748b"
              fontSize={10}
              prefix="BASE: "
            />

            {worktopT > 0 && (
              <DimensionLine
                x1={margin + wallLength + 40}
                y1={toSvgY(plinthH + baseH)}
                x2={margin + wallLength + 40}
                y2={toSvgY(worktopTotalH)}
                value={worktopT}
                unit={unit}
                color="#475569"
                fontSize={9}
                prefix="TOP: "
              />
            )}

            <DimensionLine
              x1={margin + wallLength + 40}
              y1={toSvgY(worktopTotalH)}
              x2={margin + wallLength + 40}
              y2={toSvgY(wallMountH)}
              value={wallMountH - worktopTotalH}
              unit={unit}
              color="#0284c7"
              fontSize={10}
              prefix="SPLASH: "
            />

            <DimensionLine
              x1={margin + wallLength + 40}
              y1={toSvgY(wallMountH)}
              x2={margin + wallLength + 40}
              y2={toSvgY(wallMountH + wallUnitH)}
              value={wallUnitH}
              unit={unit}
              color="#0284c7"
              fontSize={10}
              prefix="WALL: "
            />

            <DimensionLine
              x1={margin + wallLength + 120}
              y1={toSvgY(0)}
              x2={margin + wallLength + 120}
              y2={toSvgY(ceilingHeight)}
              value={ceilingHeight}
              unit={unit}
              color="#2563eb"
              fontSize={12}
              prefix="CEILING: "
            />
          </g>
        )}

        {/* Overall Wall Length */}
        {showDimensions && (
          <DimensionLine
            x1={margin}
            y1={margin - 40}
            x2={margin + wallLength}
            y2={margin - 40}
            value={wallLength}
            unit={unit}
            color="#2563eb"
            fontSize={13}
            prefix={`OVERALL ${wall.name.toUpperCase()}: `}
          />
        )}

        {/* Elevation Title Stamp */}
        <g transform={`translate(${margin}, ${svgHeight - 40})`}>
          <text fill="#0f172a" fontSize="18" fontWeight="bold" fontFamily="monospace">
            {wall.name.toUpperCase()} ELEVATION
          </text>
          <text x="350" fill="#64748b" fontSize="12" fontFamily="monospace">
            LENGTH: {formatDimension(wallLength, unit)} | CEILING: {formatDimension(ceilingHeight, unit)} | SCALE: 1:20
          </text>
        </g>
      </g>
    </svg>
  );
};
