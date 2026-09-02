import React from 'react';
import { CabinetItem, UnitType } from '../../types';
import { formatDimension } from '../../utils/unitConversion';

interface CabinetNode2DProps {
  cabinet: CabinetItem;
  isSelected: boolean;
  unit: UnitType;
  showDimensions: boolean;
  showLabels: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const CabinetNode2D: React.FC<CabinetNode2DProps> = ({
  cabinet,
  isSelected,
  unit,
  showDimensions,
  showLabels,
  onSelect,
  onMouseDown,
}) => {
  const { 
    id, 
    name, 
    category, 
    type, 
    width, 
    depth, 
    height,
    z,
    x, 
    y, 
    rotation, 
    doorCount, 
    drawerCount, 
    doorHinge, 
    hasSinkCutout,
    hasApplianceCavity,
    flipUpDoor,
    isCeilingUnit,
    hasGlassDoors
  } = cabinet;

  const isWall = category === 'wall';
  const isTall = category === 'tall';
  const isCorner = type === 'base-corner-l';
  const isLoft = isCeilingUnit || type.includes('loft') || z > 2000;
  const isFlap = flipUpDoor || doorHinge === 'top' || type.includes('lift-up') || type.includes('aventos');

  // Colors based on category
  let fillColor = '#1e293b'; // slate-800 for base
  let strokeColor = '#94a3b8'; // slate-400
  let strokeDash = 'none';

  if (isLoft) {
    fillColor = '#1e1b4b'; // deep indigo
    strokeColor = '#f59e0b'; // amber-500 for ceiling units
    strokeDash = '5,2';
  } else if (isWall) {
    fillColor = '#0f172a'; // darker slate
    strokeColor = '#38bdf8'; // sky-400
    strokeDash = '4,3'; // dashed for wall units
  } else if (isTall) {
    fillColor = '#1e1b4b';
    strokeColor = '#818cf8'; // indigo-400
  } else if (isCorner) {
    fillColor = '#1e293b';
    strokeColor = '#a78bfa'; // purple-400
  }

  if (isSelected) {
    strokeColor = '#38bdf8'; // bright cyan highlight
  }

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation}, 0, 0)`}
      onClick={onSelect}
      onMouseDown={onMouseDown}
      className="cursor-move group"
    >
      {/* 1. Base Box / Polygon */}
      {isCorner ? (
        <polygon
          points={`0,0 ${width},0 ${width},${depth * 0.6} ${width * 0.6},${depth * 0.6} ${width * 0.6},${depth} 0,${depth}`}
          fill={fillColor}
          fillOpacity={isWall ? 0.75 : 0.95}
          stroke={strokeColor}
          strokeWidth={isSelected ? 3 : 1.5}
        />
      ) : (
        <rect
          x="0"
          y="0"
          width={width}
          height={depth}
          fill={fillColor}
          fillOpacity={isWall ? 0.75 : 0.95}
          stroke={strokeColor}
          strokeWidth={isSelected ? 3 : 1.5}
          strokeDasharray={strokeDash}
          rx="2"
        />
      )}

      {/* 2. Front Edge Indicator (Thicker bottom line representing front doors) */}
      <line
        x1="0"
        y1={depth}
        x2={width}
        y2={depth}
        stroke={isSelected ? '#38bdf8' : isLoft ? '#f59e0b' : '#f8fafc'}
        strokeWidth={3}
      />

      {/* 3. FLAP / LIFT-UP CEILING DOOR INDICATORS (أبواب قلابة للأعلى) */}
      {isFlap && (
        <g stroke="#f59e0b" fill="none" opacity="0.9">
          {/* Flip Up Arc & Arrow Symbol */}
          <path
            d={`M ${width * 0.3},${depth - 15} Q ${width * 0.5},${depth - 35} ${width * 0.7},${depth - 15}`}
            strokeWidth="1.8"
            strokeDasharray="3,2"
          />
          {/* Arrowhead */}
          <polygon
            points={`${width * 0.5},${depth - 40} ${width * 0.5 - 6},${depth - 30} ${width * 0.5 + 6},${depth - 30}`}
            fill="#f59e0b"
          />
          <text
            x={width * 0.5}
            y={depth - 46}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            قلاب ⮝
          </text>
        </g>
      )}

      {/* 4. DRAWERS FACADES (تقسيمات وتفاصيل الأدراج) */}
      {drawerCount > 0 && (
        <g stroke="#64748b" strokeWidth="1">
          {Array.from({ length: drawerCount - 1 }).map((_, i) => {
            const dy = (depth / drawerCount) * (i + 1);
            return (
              <g key={i}>
                <line
                  x1="8"
                  y1={dy}
                  x2={width - 8}
                  y2={dy}
                  strokeDasharray="3,3"
                />
                {/* Individual Drawer Handle */}
                <line
                  x1={width / 2 - 20}
                  y1={dy - 5}
                  x2={width / 2 + 20}
                  y2={dy - 5}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
              </g>
            );
          })}
          {/* Bottom Drawer Handle */}
          <line
            x1={width / 2 - 25}
            y1={depth - 8}
            x2={width / 2 + 25}
            y2={depth - 8}
            stroke="#f8fafc"
            strokeWidth="3"
          />
        </g>
      )}

      {/* 5. FIXED DOOR / PANEL INDICATOR (ضلفة ثابتة) */}
      {cabinet.doorType === 'fixed' && (
        <g>
          <line x1="0" y1={depth - 8} x2={width} y2={depth - 8} stroke="#a855f7" strokeWidth="2" strokeDasharray="4,2" />
          <text x={width / 2} y={depth - 3} fill="#a855f7" fontSize="8" fontWeight="bold" textAnchor="middle">
            ثابت FIX
          </text>
        </g>
      )}

      {/* 5b. OPEN DRESSING / HANGING RAIL INDICATOR */}
      {(cabinet.doorType === 'open' || doorCount === 0) && cabinet.hasHangingRail && (
        <g stroke="#94a3b8" strokeWidth="2" opacity="0.6">
          <line x1={width * 0.1} y1={depth * 0.5} x2={width * 0.9} y2={depth * 0.5} />
          <circle cx={width * 0.1} cy={depth * 0.5} r="3" fill="#94a3b8" />
          <circle cx={width * 0.9} cy={depth * 0.5} r="3" fill="#94a3b8" />
        </g>
      )}

      {/* 5c. SINGLE DOOR SWING ARC & HANDLE */}
      {doorCount === 1 && drawerCount === 0 && !isFlap && cabinet.doorType !== 'fixed' && cabinet.doorType !== 'open' && (
        <g stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" fill="none">
          {doorHinge === 'left' ? (
            <path d={`M 0,${depth} A ${width} ${width} 0 0 1 ${width},${depth + width * 0.4}`} opacity="0.35" />
          ) : (
            <path d={`M ${width},${depth} A ${width} ${width} 0 0 0 0,${depth + width * 0.4}`} opacity="0.35" />
          )}
          {/* Door Handle */}
          <line
            x1={doorHinge === 'left' ? width - 25 : 15}
            y1={depth - 7}
            x2={doorHinge === 'left' ? width - 8 : 32}
            y2={depth - 7}
            stroke="#f8fafc"
            strokeWidth="3"
          />
        </g>
      )}

      {/* 6. DOUBLE DOOR SWING INDICATOR & DUAL HANDLES */}
      {doorCount === 2 && drawerCount === 0 && !isFlap && cabinet.doorType !== 'fixed' && cabinet.doorType !== 'open' && (
        <g stroke="#64748b" strokeWidth="1">
          <line x1={width / 2} y1="0" x2={width / 2} y2={depth} strokeDasharray="3,3" />
          {/* Left Handle */}
          <line x1={width / 2 - 22} y1={depth - 7} x2={width / 2 - 6} y2={depth - 7} stroke="#f8fafc" strokeWidth="3" />
          {/* Right Handle */}
          <line x1={width / 2 + 6} y1={depth - 7} x2={width / 2 + 22} y2={depth - 7} stroke="#f8fafc" strokeWidth="3" />
        </g>
      )}

      {/* 6b. MULTI-DOOR (3 OR 4 DOORS) */}
      {doorCount >= 3 && drawerCount === 0 && !isFlap && cabinet.doorType !== 'fixed' && cabinet.doorType !== 'open' && (
        <g stroke="#64748b" strokeWidth="1">
          {Array.from({ length: doorCount - 1 }).map((_, i) => {
            const dx = ((i + 1) * width) / doorCount;
            return <line key={i} x1={dx} y1="0" x2={dx} y2={depth} strokeDasharray="3,3" />;
          })}
        </g>
      )}

      {/* 7. GLASS VITRINE CROSS HATCH (فيترينة زجاج) */}
      {(hasGlassDoors || cabinet.doorType === 'glass-frame' || type === 'wall-glass-vitrine') && (
        <g stroke="#38bdf8" strokeWidth="0.8" opacity="0.35" strokeDasharray="2,3">
          <line x1="15" y1="15" x2={width - 15} y2={depth - 15} />
          <line x1={width - 15} y1="15" x2="15" y2={depth - 15} />
        </g>
      )}

      {/* 8. SINK BASIN / PLUMBING CUTOUT */}
      {hasSinkCutout && (
        <g stroke="#38bdf8" fill="none" opacity="0.8">
          <rect x={width * 0.12} y={depth * 0.15} width={width * 0.76} height={depth * 0.7} rx="6" strokeWidth="1.2" />
          <circle cx={width * 0.5} cy={depth * 0.5} r="9" strokeWidth="1" />
          <circle cx={width * 0.5} cy={depth * 0.22} r="4" fill="#38bdf8" />
        </g>
      )}

      {/* 8b. KITCHEN MAKER: DISH RACK (مطبق تركي وصفاية) */}
      {cabinet.hasDishRack && (
        <g stroke="#10b981" fill="none" opacity="0.85">
          <rect x={width * 0.08} y={depth * 0.15} width={width * 0.84} height={depth * 0.7} rx="4" strokeWidth="1" strokeDasharray="3,2" />
          {/* Plate notches */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={width * 0.18 + i * (width * 0.14)} y1={depth * 0.25} x2={width * 0.18 + i * (width * 0.14)} y2={depth * 0.75} strokeWidth="1" />
          ))}
          <text x={width * 0.5} y={depth * 0.88} fill="#10b981" fontSize="7" fontWeight="bold" textAnchor="middle">
            مطبق تركي
          </text>
        </g>
      )}

      {/* 8c. KITCHEN MAKER: TOP STRETCHERS (عوارض 10 سم) */}
      {cabinet.hasTopStretchers && (
        <g fill="#f59e0b" opacity="0.15">
          <rect x="0" y="0" width={width} height={Math.min(depth * 0.2, 100)} />
          <rect x="0" y={depth - Math.min(depth * 0.2, 100)} width={width} height={Math.min(depth * 0.2, 100)} />
        </g>
      )}

      {/* 8d. KITCHEN MAKER: SIDE FILLER (فيلر تعويض) */}
      {cabinet.hasFillerPanel && (
        <g>
          <rect x={width} y="0" width={70} height={depth} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
          <line x1={width} y1="0" x2={width + 70} y2={depth} stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />
          <text x={width + 35} y={depth / 2} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle" transform={`rotate(-90, ${width + 35}, ${depth / 2})`}>
            فيلر 7سم
          </text>
        </g>
      )}

      {/* 9. APPLIANCE CAVITY (OVEN / MICROWAVE) */}
      {hasApplianceCavity && (
        <g stroke="#fb923c" fill="none" opacity="0.75">
          <rect x={width * 0.1} y={depth * 0.15} width={width * 0.8} height={depth * 0.65} rx="4" strokeWidth="1" strokeDasharray="4,2" />
          <circle cx={width * 0.5} cy={depth * 0.48} r="14" strokeWidth="1" />
        </g>
      )}

      {/* 10. LABELS, ID & DIMENSION ANNOTATIONS ON THE CABINET */}
      {showLabels && (
        <g transform={`translate(${width / 2}, ${depth / 2})`}>
          {/* ID Pill */}
          <rect
            x="-24"
            y="-15"
            width="48"
            height="18"
            rx="4"
            fill={isSelected ? '#38bdf8' : isLoft ? '#78350f' : '#0f172a'}
            stroke={isSelected ? '#ffffff' : strokeColor}
            strokeWidth="1"
          />
          <text
            x="0"
            y="-5"
            dominantBaseline="central"
            textAnchor="middle"
            fill={isSelected ? '#0f172a' : '#f8fafc'}
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {id}
          </text>

          {/* Width & Depth Dimensions Text */}
          {showDimensions && (
            <text
              x="0"
              y="13"
              dominantBaseline="central"
              textAnchor="middle"
              fill={isSelected ? '#38bdf8' : '#94a3b8'}
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {formatDimension(width, unit)}
            </text>
          )}
        </g>
      )}

      {/* 11. LIVE ACCURATE DIMENSION ARROWS AROUND SELECTED CABINET */}
      {isSelected && showDimensions && (
        <g className="pointer-events-none">
          {/* Top Width Dimension Bar */}
          <g transform="translate(0, -18)">
            <line x1="0" y1="0" x2={width} y2="0" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1={width} y1="-5" x2={width} y2="5" stroke="#38bdf8" strokeWidth="1.2" />
            <rect
              x={width / 2 - 28}
              y="-10"
              width="56"
              height="16"
              rx="4"
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <text
              x={width / 2}
              y="-2"
              dominantBaseline="central"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {formatDimension(width, unit)}
            </text>
          </g>

          {/* Side Depth Dimension Bar */}
          <g transform={`translate(${width + 18}, 0)`}>
            <line x1="0" y1="0" x2="0" y2={depth} stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="-5" y1={depth} x2="5" y2={depth} stroke="#38bdf8" strokeWidth="1.2" />
            <rect
              x="-24"
              y={depth / 2 - 8}
              width="48"
              height="16"
              rx="4"
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <text
              x="0"
              y={depth / 2}
              dominantBaseline="central"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {formatDimension(depth, unit)}
            </text>
          </g>
        </g>
      )}

      {/* 12. Selection Glow & Corner Handles */}
      {isSelected && (
        <g className="pointer-events-none">
          <rect
            x="-4"
            y="-4"
            width={width + 8}
            height={depth + 8}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="4,4"
            rx="4"
          />
          <circle cx="-4" cy="-4" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
          <circle cx={width + 4} cy="-4" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
          <circle cx={width + 4} cy={depth + 4} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
          <circle cx="-4" cy={depth + 4} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
        </g>
      )}
    </g>
  );
};
