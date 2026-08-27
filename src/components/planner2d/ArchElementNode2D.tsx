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

  const isWallOpening = type === 'door' || type === 'window';

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation}, 0, 0)`}
      onClick={onSelect}
      onMouseDown={onMouseDown}
      className="cursor-move group"
    >
      {/* 1. DOOR EMBEDDED INSIDE WALL (الباب يدخل داخل سماكة الحائط مع قوس فتح داخلي) */}
      {type === 'door' && (
        <g stroke={strokeColor} fill="none">
          {/* Wall Cutout (Clears the wall thickness) */}
          <rect x="0" y={-depth} width={width} height={depth} fill="#f1f5f9" stroke="none" />
          
          {/* Outer Wall Cutout Ticks / Jambs */}
          <line x1="0" y1={-depth} x2="0" y2="0" stroke="#475569" strokeWidth="3" />
          <line x1={width} y1={-depth} x2={width} y2="0" stroke="#475569" strokeWidth="3" />
          <line x1="0" y1={-depth} x2={width} y2={-depth} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

          {/* Door Threshold at inner wall line */}
          <line x1="0" y1="0" x2={width} y2="0" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Door Leaf swinging into room from inner wall face */}
          <line x1="0" y1="0" x2="0" y2={width} stroke="#10b981" strokeWidth="3" />

          {/* 90-degree Swing Arc */}
          <path
            d={`M 0,${width} A ${width} ${width} 0 0 0 ${width},0`}
            stroke="#10b981"
            strokeWidth="1.4"
            strokeDasharray="4,3"
            opacity="0.8"
          />

          {/* Label inside Wall Pocket */}
          <text
            x={width / 2}
            y={-depth / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#10b981"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            باب {formatDimension(width, unit)}
          </text>
        </g>
      )}

      {/* 2. WINDOW EMBEDDED INSIDE WALL (الشباك يدخل داخل سماكة الحائط مع زجاج وسيل) */}
      {type === 'window' && (
        <g stroke={strokeColor}>
          {/* Wall Cutout (Clears the wall thickness) */}
          <rect x="0" y={-depth} width={width} height={depth} fill="#f1f5f9" stroke="none" />

          {/* Window Jambs */}
          <line x1="0" y1={-depth} x2="0" y2="0" stroke="#475569" strokeWidth="3" />
          <line x1={width} y1={-depth} x2={width} y2="0" stroke="#475569" strokeWidth="3" />

          {/* Outer Wall Boundary */}
          <line x1="0" y1={-depth} x2={width} y2={-depth} stroke="#64748b" strokeWidth="2" />

          {/* Double Glass Panes inside the wall aperture */}
          <line x1="0" y1={-depth * 0.6} x2={width} y2={-depth * 0.6} strokeWidth="1.8" stroke="#38bdf8" />
          <line x1="0" y1={-depth * 0.4} x2={width} y2={-depth * 0.4} strokeWidth="1.8" stroke="#38bdf8" />

          {/* Interior Window Sill / Marble Edge */}
          <line x1="-12" y1="0" x2={width + 12} y2="0" strokeWidth="3" stroke="#0284c7" />

          {/* Label */}
          <text
            x={width / 2}
            y={-depth / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#0284c7"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            شباك {formatDimension(width, unit)}
          </text>
        </g>
      )}

      {/* 3. COLUMN: Cross-hatched structural pillar */}
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
            fontFamily="sans-serif"
          >
            عمود
          </text>
        </g>
      )}

      {/* 4. BEAM: Drop Beam */}
      {type === 'beam' && (
        <g stroke="#eab308" fill="#713f12" opacity="0.85">
          <rect x="0" y="0" width={width} height={depth} strokeWidth="1.5" strokeDasharray="4,2" />
          <text
            x={width / 2}
            y={depth / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#fde047"
            fontSize="9"
            fontWeight="bold"
          >
            كمرة ساقطة
          </text>
        </g>
      )}

      {/* 5. PIPE: Circular plumbing / gas riser */}
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
            fill="#ec4899"
            fontSize="9"
            fontWeight="bold"
          >
            ماسورة
          </text>
        </g>
      )}

      {/* Selection Glow Box */}
      {isSelected && (
        <g className="pointer-events-none">
          <rect
            x="-4"
            y={isWallOpening ? -depth - 4 : -4}
            width={width + 8}
            height={isWallOpening ? depth + 8 : depth + 8}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            rx="4"
          />
        </g>
      )}
    </g>
  );
};
