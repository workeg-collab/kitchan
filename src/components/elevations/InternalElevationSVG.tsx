import React from 'react';
import { ProjectData } from '../../types';
import { formatDimension } from '../../utils/unitConversion';
import { DimensionLine } from '../planner2d/DimensionLine';

interface InternalElevationSVGProps {
  project: ProjectData;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

export const InternalElevationSVG: React.FC<InternalElevationSVGProps> = ({
  project,
  svgRef,
}) => {
  const { cabinets, metadata } = project;
  const unit = metadata.unit;

  // Filter units with internal divisions (wardrobes, libraries, dressers)
  const internalUnits = cabinets.filter(
    (c) => c.category === 'wardrobe' || c.category === 'closet-internals' || c.category === 'library-full' || c.category === 'bookshelf' || c.category === 'tall' || c.shelfCount > 0
  );

  const totalWidth = internalUnits.reduce((acc, u) => acc + u.width + 100, 200);
  const maxHeight = Math.max(...internalUnits.map((u) => u.height), 2400);

  const margin = 140;
  const svgWidth = Math.max(1200, totalWidth + 2 * margin);
  const svgHeight = maxHeight + 2 * margin + 120;

  const toSvgY = (zHeight: number) => margin + maxHeight - zHeight;

  let currentX = margin;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-full bg-white select-none shadow-sm"
    >
      <defs>
        <pattern id="internalHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#e2e8f0" strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* Ground Line */}
      <line
        x1={margin - 50}
        y1={margin + maxHeight}
        x2={svgWidth - margin + 50}
        y2={margin + maxHeight}
        stroke="#475569"
        strokeWidth="3"
      />
      <text x={margin - 30} y={margin + maxHeight + 20} fill="#64748b" fontSize="12" fontFamily="monospace">
        F.F.L (أرضية التشطيب 0.00)
      </text>

      {/* Internal Units Layout */}
      {internalUnits.map((unitItem) => {
        const uX = currentX;
        const uY = toSvgY(unitItem.height);
        const uW = unitItem.width;
        const uH = unitItem.height;
        currentX += uW + 120;

        return (
          <g key={unitItem.id} className="internal-unit-elevation">
            {/* Outer Carcase Carcass Box */}
            <rect
              x={uX}
              y={uY}
              width={uW}
              height={uH}
              fill="url(#internalHatch)"
              stroke="#0f172a"
              strokeWidth="2.5"
              rx="2"
            />

            {/* Plinth Base */}
            <rect
              x={uX}
              y={toSvgY(80)}
              width={uW}
              height={80}
              fill="#cbd5e1"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text x={uX + uW / 2} y={toSvgY(40)} dominantBaseline="central" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">
              وزرة 80 مم
            </text>

            {/* Vertical Dividers */}
            {unitItem.verticalDividersCount && unitItem.verticalDividersCount > 0 && (
              Array.from({ length: unitItem.verticalDividersCount }).map((_, divIdx) => {
                const divX = uX + ((divIdx + 1) * uW) / (unitItem.verticalDividersCount! + 1);
                return (
                  <g key={`div-${divIdx}`}>
                    <line
                      x1={divX}
                      y1={uY}
                      x2={divX}
                      y2={toSvgY(80)}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text x={divX} y={uY - 15} textAnchor="middle" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      قاطع رأسي 18 مم
                    </text>
                  </g>
                );
              })
            )}

            {/* Internal Shelves */}
            {unitItem.shelfCount > 0 && (
              Array.from({ length: unitItem.shelfCount }).map((_, sIdx) => {
                const sY = uY + ((sIdx + 1) * (uH - 80)) / (unitItem.shelfCount + 1);
                return (
                  <g key={`shelf-${sIdx}`}>
                    <line
                      x1={uX}
                      y1={sY}
                      x2={uX + uW}
                      y2={sY}
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    <rect x={uX + uW / 2 - 25} y={sY - 8} width="50" height="16" fill="#ffffff" stroke="#2563eb" rx="3" />
                    <text x={uX + uW / 2} y={sY} dominantBaseline="central" textAnchor="middle" fill="#2563eb" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      رف داخلي
                    </text>
                  </g>
                );
              })
            )}

            {/* Hanging Rail (for Wardrobes) */}
            {unitItem.hasHangingRail && (
              <g>
                <line
                  x1={uX + 20}
                  y1={uY + 220}
                  x2={uX + uW - 20}
                  y2={uY + 220}
                  stroke="#d97706"
                  strokeWidth="4"
                />
                <circle cx={uX + 20} cy={uY + 220} r="5" fill="#d97706" />
                <circle cx={uX + uW - 20} cy={uY + 220} r="5" fill="#d97706" />
                <text x={uX + uW / 2} y={uY + 200} textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="bold">
                  ماسورة تعليق ملابس (Hanging Rail)
                </text>
              </g>
            )}

            {/* Drawers Stack (if any) */}
            {unitItem.drawerCount > 0 && (
              Array.from({ length: unitItem.drawerCount }).map((_, dIdx) => {
                const drwH = 180;
                const drwY = toSvgY(80 + (dIdx + 1) * drwH);
                return (
                  <g key={`drw-${dIdx}`}>
                    <rect x={uX + 6} y={drwY} width={uW - 12} height={drwH - 6} fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" rx="3" />
                    <line x1={uX + uW / 2 - 30} y1={drwY + drwH / 2} x2={uX + uW / 2 + 30} y2={drwY + drwH / 2} stroke="#0f172a" strokeWidth="3" />
                    <text x={uX + 20} y={drwY + drwH / 2} dominantBaseline="central" fill="#475569" fontSize="10" fontWeight="bold">
                      درج #{dIdx + 1} (H: 180 مم)
                    </text>
                  </g>
                );
              })
            )}

            {/* Overall Dimensions for this unit */}
            <DimensionLine
              x1={uX}
              y1={uY - 35}
              x2={uX + uW}
              y2={uY - 35}
              value={uW}
              unit={unit}
              color="#2563eb"
              fontSize={11}
              prefix="العرض: "
            />
            <DimensionLine
              x1={uX + uW + 35}
              y1={toSvgY(0)}
              x2={uX + uW + 35}
              y2={toSvgY(uH)}
              value={uH}
              unit={unit}
              color="#0284c7"
              fontSize={11}
              prefix="الارتفاع: "
            />

            {/* Unit Tag Badge */}
            <g transform={`translate(${uX + uW / 2}, ${margin + maxHeight + 40})`}>
              <rect x="-40" y="-12" width="80" height="24" rx="6" fill="#1e293b" />
              <text x="0" y="0" dominantBaseline="central" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                {unitItem.id}
              </text>
            </g>
          </g>
        );
      })}

      {/* Elevation Title Block */}
      <g transform={`translate(${margin}, ${svgHeight - 30})`}>
        <text fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="monospace">
          القطاع الرأسي والتفصيل الداخلي (INTERNAL CONSTRUCTION ELEVATION)
        </text>
        <text x="500" fill="#64748b" fontSize="12" fontFamily="monospace">
          SCALE: 1:20 | يوضح مقاسات الرفوف، القواطع، ومواسير التعليق
        </text>
      </g>
    </svg>
  );
};
