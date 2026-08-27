import React from 'react';
import { ArchitecturalElement, UnitType } from '../../types';
import { formatDimension } from '../../utils/unitConversion';

interface ArchElementNode2DProps {
  element: ArchitecturalElement;
  isSelected: boolean;
  unit: UnitType;
  showDimensions: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const ArchElementNode2D: React.FC<ArchElementNode2DProps> = ({
  element,
  isSelected,
  unit,
  showDimensions,
  onSelect,
  onMouseDown,
}) => {
  const { id, type, width, depth, height, x, y, rotation, openingDirection } = element;

  let strokeColor = '#10b981'; // emerald-500
  if (isSelected) strokeColor = '#38bdf8';

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation}, 0, 0)`}
      onClick={onSelect}
      onMouseDown={onMouseDown}
      className="cursor-move group"
    >
      {/* DOOR: Leaf + 90 degree swing arc */}
      {type === 'door' && (
        <g stroke={strokeColor} fill="none">
          {/* Wall cutout background to clear wall */}
          <rect x="0" y="-5" width={width} height={depth + 10} fill="#0f172a" stroke="none" />
          {/* Door Frame */}
          <line x1="0" y1="0" x2="0" y2={depth} strokeWidth="3" />
          <line x1={width} y1="0" x2={width} y2={depth} strokeWidth="3" />
          {/* Door Leaf (open at 90 deg) */}
          <line x1="0" y1={depth} x2="0" y2={depth + width} strokeWidth="2.5" />
          {/* Swing Arc */}
          <path
            d={`M 0,${depth + width} A ${width} ${width} 0 0 0 ${width},${depth}`}
            strokeWidth="1.2"
            strokeDasharray="3,3"
            opacity="0.7"
          />
          {/* Label */}
          <text
            x={width / 2}
            y={depth / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#10b981"
            fontSize="10"
            fontWeight="bold"
          >
            DOOR {formatDimension(width, unit)}
          </text>
        </g>
      )}

      {/* WINDOW: Double glass line & Sill */}
      {type === 'window' && (
        <g stroke={strokeColor}>
          <rect x="0" y="-5" width={width} height={depth + 10} fill="#0f172a" stroke="none" />
          {/* Outer Wall Boundaries */}
          <line x1="0" y1="0" x2="0" y2={depth} strokeWidth="3" />
          <line x1={width} y1="0" x2={width} y2={depth} strokeWidth="3" />
          {/* Glass lines */}
          <line x1="0" y1={depth * 0.35} x2={width} y2={depth * 0.35} strokeWidth="1.5" stroke="#38bdf8" />
          <line x1="0" y1={depth * 0.65} x2={width} y2={depth * 0.65} strokeWidth="1.5" stroke="#38bdf8" />
          {/* Sill */}
          <line x1="-10" y1={depth} x2={width + 10} y2={depth} strokeWidth="2" stroke="#e2e8f0" />
          <text
            x={width / 2}
            y={depth / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="9"
            fontWeight="bold"
          >
            WIN {formatDimension(width, unit)}
          </text>
        </g>
      )}

      {/* COLUMN: Cross-hatched structural pillar */}
      {type === 'column' && (
        <g stroke={strokeColor}>
          <rect x="0" y="0" width={width} height={depth} fill="#334155" strokeWidth="2" />
          <line x1="0" y1="0" x2={width} y2={depth} strokeWidth="1.2" opacity="0.6" />
          <line x1="0" y1={depth} x2={width} y2="0" strokeWidth="1.2" opacity="0.6" />
          <text
            x={width / 2}
            y={depth / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
          >
            COL
          </text>
        </g>
      )}

      {/* PIPE: Circular plumbing / gas riser */}
      {type === 'pipe' && (
        <g stroke="#ec4899" fill="#831843" opacity="0.9">
          <circle cx={width / 2} cy={depth / 2} r={Math.min(width, depth) / 2} strokeWidth="2" />
          <line x1={0} y1={depth / 2} x2={width} y2={depth / 2} stroke="#ec4899" strokeWidth="1.5" />
          <line x1={width / 2} y1={0} x2={width / 2} y2={depth} stroke="#ec4899" strokeWidth="1.5" />
          <text
            x={width / 2}
            y={depth + 14}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#f472b6"
            fontSize="9"
            fontWeight="bold"
          >
            PIPE ⌀{formatDimension(width, unit)}
          </text>
        </g>
      )}

      {/* BEAM: Overhead beam with dashed borders */}
      {type === 'beam' && (
        <g stroke="#f59e0b" strokeDasharray="4,4" fill="none">
          <rect x="0" y="0" width={width} height={depth} strokeWidth="1.5" />
          <text
            x={width / 2}
            y={depth / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="9"
            fontWeight="bold"
          >
            BEAM (H:{formatDimension(height, unit)})
          </text>
        </g>
      )}
    </g>
  );
};
