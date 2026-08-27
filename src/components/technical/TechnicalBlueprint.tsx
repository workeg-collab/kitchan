import React, { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { formatDimension } from '../../utils/unitConversion';
import { DimensionLine } from '../planner2d/DimensionLine';
import { Printer, Download, FileText } from 'lucide-react';

export const TechnicalBlueprint: React.FC = () => {
  const { project } = useProjectStore();
  const printRef = useRef<HTMLDivElement>(null);
  const { metadata, room, cabinets, appliances, manufacturing } = project;
  const unit = metadata.unit;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-auto p-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto mb-4 bg-slate-900 px-5 py-3 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText size={16} className="text-blue-400" />
            Architectural Workshop Blueprint (Sheet A-101)
          </h2>
          <p className="text-xs text-slate-400">Scale 1:25 Top View with Full Wall & Cabinet Dimension Strings</p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/30 transition"
        >
          <Printer size={15} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable CAD Blueprint Sheet */}
      <div
        ref={printRef}
        className="w-full max-w-6xl mx-auto bg-[#0a192f] border-2 border-slate-700 rounded-2xl shadow-2xl p-8 text-white flex flex-col justify-between aspect-[1.414/1] relative overflow-hidden"
      >
        {/* Engineering Grid Overlay */}
        <div className="absolute inset-0 bg-blueprint opacity-60 pointer-events-none" />

        {/* Blueprint Sheet Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-blue-400/40 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold">
              KITCHEN MANUFACTURING & ARCHITECTURAL CAD
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">{metadata.name}</h1>
            <p className="text-xs text-slate-300">Client: {metadata.clientName || 'Standard Production'} | Designer: {metadata.designerName || 'CAD Studio'}</p>
          </div>

          <div className="text-right font-mono text-xs text-slate-300">
            <div>DATE: {metadata.date}</div>
            <div>BOARD: {manufacturing.boardThickness}mm Melamine</div>
            <div>STATUS: <span className="text-emerald-400 font-bold">APPROVED FOR PRODUCTION</span></div>
          </div>
        </div>

        {/* CAD SVG Graphic Center */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-6">
          <svg
            viewBox={`-200 -200 ${room.width + 400} ${room.length + 400}`}
            className="w-full h-full max-h-[500px]"
          >
            {/* Room boundary */}
            <rect
              x={0}
              y={0}
              width={room.width}
              height={room.length}
              fill="#061224"
              stroke="#60a5fa"
              strokeWidth="2.5"
            />

            {/* Cabinets */}
            {cabinets.map((cab) => {
              let w = cab.width;
              let d = cab.depth;
              if (cab.rotation === 90 || cab.rotation === 270) {
                w = cab.depth;
                d = cab.width;
              }

              return (
                <g key={cab.id} transform={`translate(${cab.x}, ${cab.y})`}>
                  <rect
                    x={0}
                    y={0}
                    width={w}
                    height={d}
                    fill="#0f2b48"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                    strokeDasharray={cab.category === 'wall' ? '4,4' : 'none'}
                  />
                  <text
                    x={w / 2}
                    y={d / 2 - 4}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize="42"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {cab.id}
                  </text>
                  <text
                    x={w / 2}
                    y={d / 2 + 35}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#93c5fd"
                    fontSize="32"
                    fontFamily="monospace"
                  >
                    {formatDimension(cab.width, unit)}
                  </text>
                </g>
              );
            })}

            {/* Overall Dimensions */}
            <DimensionLine
              x1={0}
              y1={0}
              x2={room.width}
              y2={0}
              value={room.width}
              unit={unit}
              offset={-120}
              color="#60a5fa"
              fontSize={40}
              prefix="WALL A: "
            />
            <DimensionLine
              x1={room.width}
              y1={0}
              x2={room.width}
              y2={room.length}
              value={room.length}
              unit={unit}
              offset={-120}
              color="#60a5fa"
              fontSize={40}
              prefix="WALL B: "
            />
          </svg>
        </div>

        {/* Blueprint Title Block (Bottom Footer) */}
        <div className="relative z-10 grid grid-cols-4 border-2 border-blue-400/60 bg-[#061224] text-xs font-mono">
          <div className="p-3 border-r border-blue-400/40">
            <div className="text-[10px] text-slate-400">ROOM DIMENSIONS</div>
            <div className="font-bold text-white text-sm">
              {formatDimension(room.width, unit)} x {formatDimension(room.length, unit)}
            </div>
            <div className="text-slate-400">Ceiling H: {formatDimension(room.ceilingHeight, unit)}</div>
          </div>
          <div className="p-3 border-r border-blue-400/40">
            <div className="text-[10px] text-slate-400">CABINET COUNT</div>
            <div className="font-bold text-white text-sm">{cabinets.length} UNITS</div>
            <div className="text-slate-400">Base: {cabinets.filter(c => c.category === 'base').length} | Wall: {cabinets.filter(c => c.category === 'wall').length} | Tall: {cabinets.filter(c => c.category === 'tall').length}</div>
          </div>
          <div className="p-3 border-r border-blue-400/40">
            <div className="text-[10px] text-slate-400">FINISHES & HARDWARE</div>
            <div className="font-bold text-white">{project.materials.frontFinish}</div>
            <div className="text-slate-400">Top: {project.materials.countertopMaterial}</div>
          </div>
          <div className="p-3 flex flex-col justify-between bg-blue-950/40">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-400">DRAWING NO.</span>
              <span className="font-bold text-blue-400">A-101</span>
            </div>
            <div className="text-[10px] text-right text-slate-400">SCALE 1:25 @ A4</div>
          </div>
        </div>
      </div>
    </div>
  );
};
