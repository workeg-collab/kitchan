import React from 'react';
import { ApplianceItem, UnitType } from '../../types';
import { formatDimension } from '../../utils/unitConversion';

interface ApplianceNode2DProps {
  appliance: ApplianceItem;
  isSelected: boolean;
  unit: UnitType;
  showDimensions: boolean;
  showLabels: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const ApplianceNode2D: React.FC<ApplianceNode2DProps> = ({
  appliance,
  isSelected,
  unit,
  showDimensions,
  showLabels,
  onSelect,
  onMouseDown,
}) => {
  const { id, name, type, width, depth, x, y, rotation } = appliance;

  let strokeColor = '#f59e0b'; // amber-500
  if (isSelected) strokeColor = '#38bdf8';

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation}, 0, 0)`}
      onClick={onSelect}
      onMouseDown={onMouseDown}
      className="cursor-move group"
    >
      {/* Body Box */}
      <rect
        x="0"
        y="0"
        width={width}
        height={depth}
        fill="#1e1b18"
        fillOpacity="0.85"
        stroke={strokeColor}
        strokeWidth={isSelected ? 2.5 : 1.5}
        rx="3"
      />

      {/* Appliance Specific Visual Symbology */}
      {type === 'cooktop-induction' && (
        <g stroke="#f59e0b" fill="none" opacity="0.8">
          <circle cx={width * 0.3} cy={depth * 0.35} r={Math.min(width, depth) * 0.18} strokeWidth="1.2" />
          <circle cx={width * 0.7} cy={depth * 0.35} r={Math.min(width, depth) * 0.15} strokeWidth="1.2" />
          <circle cx={width * 0.3} cy={depth * 0.7} r={Math.min(width, depth) * 0.15} strokeWidth="1.2" />
          <circle cx={width * 0.7} cy={depth * 0.7} r={Math.min(width, depth) * 0.22} strokeWidth="1.2" />
          {/* Touch control bar */}
          <rect x={width * 0.35} y={depth * 0.88} width={width * 0.3} height={depth * 0.06} fill="#f59e0b" rx="2" />
        </g>
      )}

      {type === 'fridge-freestanding' && (
        <g stroke="#f59e0b" fill="none">
          <line x1="0" y1={depth * 0.25} x2={width} y2={depth * 0.25} strokeWidth="1.5" strokeDasharray="3,3" />
          {/* Dual handles */}
          <rect x={width * 0.45} y={depth - 6} width={width * 0.1} height={4} fill="#f59e0b" rx="1" />
        </g>
      )}

      {type === 'dishwasher' && (
        <g stroke="#f59e0b" fill="none" strokeWidth="1" strokeDasharray="3,3" opacity="0.6">
          <rect x={width * 0.1} y={depth * 0.1} width={width * 0.8} height={depth * 0.8} />
          <line x1={width * 0.1} y1={depth * 0.5} x2={width * 0.9} y2={depth * 0.5} />
        </g>
      )}

      {type === 'sink-single' && (
        <g stroke="#38bdf8" fill="none" opacity="0.8">
          <rect x={width * 0.1} y={depth * 0.1} width={width * 0.8} height={depth * 0.8} rx="8" strokeWidth="1.5" />
          {/* Tap */}
          <circle cx={width * 0.5} cy={depth * 0.2} r="5" fill="#38bdf8" />
          <line x1={width * 0.5} y1={depth * 0.2} x2={width * 0.5} y2={depth * 0.35} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {type === 'sink-double' && (
        <g stroke="#38bdf8" fill="none" opacity="0.8">
          <rect x={width * 0.08} y={depth * 0.1} width={width * 0.4} height={depth * 0.8} rx="6" strokeWidth="1.2" />
          <rect x={width * 0.52} y={depth * 0.1} width={width * 0.4} height={depth * 0.8} rx="6" strokeWidth="1.2" />
          {/* Central Tap */}
          <circle cx={width * 0.5} cy={depth * 0.2} r="5" fill="#38bdf8" />
          <line x1={width * 0.5} y1={depth * 0.2} x2={width * 0.5} y2={depth * 0.35} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* ID Badge */}
      {showLabels && (
        <g transform={`translate(${width / 2}, ${depth / 2})`}>
          <rect
            x="-20"
            y="-14"
            width="40"
            height="18"
            rx="4"
            fill={isSelected ? '#38bdf8' : '#451a03'}
            stroke={isSelected ? '#ffffff' : strokeColor}
            strokeWidth="1"
          />
          <text
            x="0"
            y="-4"
            dominantBaseline="central"
            textAnchor="middle"
            fill={isSelected ? '#0f172a' : '#fbbf24'}
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {id}
          </text>
          {showDimensions && (
            <text
              x="0"
              y="14"
              dominantBaseline="central"
              textAnchor="middle"
              fill="#d97706"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {formatDimension(width, unit)}
            </text>
          )}
        </g>
      )}
    </g>
  );
};
