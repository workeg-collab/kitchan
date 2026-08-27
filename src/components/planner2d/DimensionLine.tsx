import React from 'react';
import { UnitType } from '../../types';
import { formatDimension } from '../../utils/unitConversion';

interface DimensionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  value: number; // in mm
  unit: UnitType;
  offset?: number; // perpendicular offset distance
  orientation?: 'horizontal' | 'vertical' | 'aligned';
  color?: string;
  fontSize?: number;
  prefix?: string;
  showTicks?: boolean;
}

export const DimensionLine: React.FC<DimensionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  value,
  unit,
  offset = 0,
  orientation = 'aligned',
  color = '#60a5fa', // blue-400
  fontSize = 11,
  prefix = '',
  showTicks = true,
}) => {
  if (value <= 0) return null;

  // Calculate perpendicular vector for offset
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return null;

  const nx = -dy / len;
  const ny = dx / len;

  const ox1 = x1 + nx * offset;
  const oy1 = y1 + ny * offset;
  const ox2 = x2 + nx * offset;
  const oy2 = y2 + ny * offset;

  const midX = (ox1 + ox2) / 2;
  const midY = (oy1 + oy2) / 2;

  // Tick size
  const tickSize = 6;
  const tickAngle = Math.PI / 4; // 45 degree architectural tick

  const tx1 = ox1 - Math.cos(tickAngle) * tickSize;
  const ty1 = oy1 - Math.sin(tickAngle) * tickSize;
  const tx2 = ox1 + Math.cos(tickAngle) * tickSize;
  const ty2 = oy1 + Math.sin(tickAngle) * tickSize;

  const tx3 = ox2 - Math.cos(tickAngle) * tickSize;
  const ty3 = oy2 - Math.sin(tickAngle) * tickSize;
  const tx4 = ox2 + Math.cos(tickAngle) * tickSize;
  const ty4 = oy2 + Math.sin(tickAngle) * tickSize;

  const formattedText = `${prefix}${formatDimension(value, unit)}`;

  // Text angle
  let angle = Math.atan2(oy2 - oy1, ox2 - ox1) * (180 / Math.PI);
  if (angle > 90 || angle < -90) {
    angle += 180;
  }

  return (
    <g className="cad-dimension select-none pointer-events-none">
      {/* Extension lines from target points to dimension line if offset exists */}
      {Math.abs(offset) > 2 && (
        <>
          <line
            x1={x1}
            y1={y1}
            x2={ox1 + nx * (offset > 0 ? 3 : -3)}
            y2={oy1 + ny * (offset > 0 ? 3 : -3)}
            stroke={color}
            strokeWidth="0.8"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          <line
            x1={x2}
            y1={y2}
            x2={ox2 + nx * (offset > 0 ? 3 : -3)}
            y2={oy2 + ny * (offset > 0 ? 3 : -3)}
            stroke={color}
            strokeWidth="0.8"
            strokeDasharray="2,2"
            opacity="0.6"
          />
        </>
      )}

      {/* Main dimension line */}
      <line
        x1={ox1}
        y1={oy1}
        x2={ox2}
        y2={oy2}
        stroke={color}
        strokeWidth="1.2"
        opacity="0.9"
      />

      {/* Architectural 45-degree ticks */}
      {showTicks && (
        <>
          <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={color} strokeWidth="1.8" />
          <line x1={tx3} y1={ty3} x2={tx4} y2={ty4} stroke={color} strokeWidth="1.8" />
        </>
      )}

      {/* Dimension Text with background pill */}
      <g transform={`translate(${midX}, ${midY}) rotate(${orientation === 'horizontal' ? 0 : angle})`}>
        <rect
          x={-formattedText.length * 3.8 - 4}
          y={-fontSize * 0.7 - 2}
          width={formattedText.length * 7.6 + 8}
          height={fontSize + 4}
          fill="#0f172a"
          fillOpacity="0.85"
          rx="3"
        />
        <text
          x="0"
          y="0"
          dominantBaseline="central"
          textAnchor="middle"
          fill={color}
          fontSize={fontSize}
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="0.5px"
        >
          {formattedText}
        </text>
      </g>
    </g>
  );
};
