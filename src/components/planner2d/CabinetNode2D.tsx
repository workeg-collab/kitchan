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
  const { id, name, category, type, width, depth, x, y, rotation, doorCount, drawerCount, doorHinge, hasSinkCutout } = cabinet;

  const isWall = category === 'wall';
  const isTall = category === 'tall';
  const isCorner = type === 'base-corner-l';

  // Styling based on category
  let fillColor = '#1e293b'; // slate-800 for base
  let strokeColor = '#94a3b8'; // slate-400
  let strokeDash = 'none';

  if (isWall) {
    fillColor = '#0f172a'; // darker
    strokeColor = '#38bdf8'; // sky-400
    strokeDash = '4,3'; // dashed for upper wall units
  } else if (isTall) {
    fillColor = '#1e1b4b'; // indigo-950
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
      {/* Base Rectangle or Corner Polygon */}
      {isCorner ? (
        <polygon
          points={`0,0 ${width},0 ${width},${depth * 0.6} ${width * 0.6},${depth * 0.6} ${width * 0.6},${depth} 0,${depth}`}
          fill={fillColor}
          fillOpacity={isWall ? 0.7 : 0.9}
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
          fillOpacity={isWall ? 0.7 : 0.9}
          stroke={strokeColor}
          strokeWidth={isSelected ? 3 : 1.5}
          strokeDasharray={strokeDash}
          rx="2"
        />
      )}

      {/* Front Edge Indicator (Thicker bottom line representing front doors) */}
      <line
        x1="0"
        y1={depth}
        x2={width}
        y2={depth}
        stroke={isSelected ? '#38bdf8' : '#f8fafc'}
        strokeWidth={2.5}
      />

      {/* Door Swing / Drawers / Symbology */}
      {drawerCount > 0 && (
        <g stroke="#64748b" strokeWidth="1" strokeDasharray="3,3">
          {Array.from({ length: drawerCount - 1 }).map((_, i) => (
            <line
              key={i}
              x1="15"
              y1={(depth / drawerCount) * (i + 1)}
              x2={width - 15}
              y2={(depth / drawerCount) * (i + 1)}
            />
          ))}
          {/* Drawer handle indicator */}
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

      {/* Single Door Swing Arc */}
      {doorCount === 1 && drawerCount === 0 && (
        <g stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" fill="none">
          {doorHinge === 'left' ? (
            <path d={`M 0,${depth} A ${width} ${width} 0 0 1 ${width},${depth + width * 0.5}`} opacity="0.4" />
          ) : (
            <path d={`M ${width},${depth} A ${width} ${width} 0 0 0 0,${depth + width * 0.5}`} opacity="0.4" />
          )}
          {/* Door Handle line */}
          <line
            x1={doorHinge === 'left' ? width - 30 : 15}
            y1={depth - 6}
            x2={doorHinge === 'left' ? width - 10 : 35}
            y2={depth - 6}
            stroke="#f8fafc"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* Double Door Swing Indicator */}
      {doorCount === 2 && drawerCount === 0 && (
        <g stroke="#64748b" strokeWidth="1">
          <line x1={width / 2} y1="0" x2={width / 2} y2={depth} strokeDasharray="3,3" />
          {/* Left Handle */}
          <line x1={width / 2 - 25} y1={depth - 6} x2={width / 2 - 8} y2={depth - 6} stroke="#f8fafc" strokeWidth="2.5" />
          {/* Right Handle */}
          <line x1={width / 2 + 8} y1={depth - 6} x2={width / 2 + 25} y2={depth - 6} stroke="#f8fafc" strokeWidth="2.5" />
        </g>
      )}

      {/* Sink Basin Shape */}
      {hasSinkCutout && (
        <g stroke="#38bdf8" fill="none" opacity="0.7">
          <rect x={width * 0.15} y={depth * 0.15} width={width * 0.7} height={depth * 0.7} rx="6" strokeWidth="1.2" />
          <circle cx={width * 0.5} cy={depth * 0.5} r="10" strokeWidth="1" />
          <circle cx={width * 0.5} cy={depth * 0.25} r="4" fill="#38bdf8" />
        </g>
      )}

      {/* ID Badge & Labels */}
      {showLabels && (
        <g transform={`translate(${width / 2}, ${depth / 2})`}>
          {/* ID Pill */}
          <rect
            x="-22"
            y="-16"
            width="44"
            height="18"
            rx="4"
            fill={isSelected ? '#38bdf8' : '#0f172a'}
            stroke={isSelected ? '#ffffff' : strokeColor}
            strokeWidth="1"
          />
          <text
            x="0"
            y="-6"
            dominantBaseline="central"
            textAnchor="middle"
            fill={isSelected ? '#0f172a' : '#f8fafc'}
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {id}
          </text>

          {/* Width Dimension Text */}
          {showDimensions && (
            <text
              x="0"
              y="12"
              dominantBaseline="central"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {formatDimension(width, unit)}
            </text>
          )}
        </g>
      )}

      {/* Selection Glow / Handles */}
      {isSelected && (
        <g className="pointer-events-none">
          <rect
            x="-4"
            y="-4"
            width={width + 8}
            height={depth + 8}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            rx="4"
          />
          {/* 4 Corner handles */}
          <circle cx="-4" cy="-4" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
          <circle cx={width + 4} cy="-4" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
          <circle cx={width + 4} cy={depth + 4} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
          <circle cx="-4" cy={depth + 4} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        </g>
      )}
    </g>
  );
};
