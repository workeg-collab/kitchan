import React, { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension } from '../../utils/unitConversion';
import { DimensionLine } from '../planner2d/DimensionLine';
import { TRANSLATIONS } from '../../utils/i18n';
import { Printer, FileText } from 'lucide-react';

export const TechnicalBlueprint: React.FC = () => {
  const { project } = useProjectStore();
  const { language } = useUIStore();
  const printRef = useRef<HTMLDivElement>(null);
  const { metadata, room, cabinets, manufacturing } = project;
  const unit = metadata.unit;
  const t = TRANSLATIONS[language];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-auto p-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto mb-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            {language === 'ar' ? 'المخطط التنفيذي الهندسي (ورقة A-101)' : 'Architectural Workshop Blueprint (Sheet A-101)'}
          </h2>
          <p className="text-xs text-slate-500">{language === 'ar' ? 'مقياس رسم 1:25 مع شبكة أبعاد الجدران والكبائن' : 'Scale 1:25 Top View with Full Wall & Cabinet Dimension Strings'}</p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
        >
          <Printer size={15} />
          <span>{language === 'ar' ? 'طباعة / حفظ كـ PDF' : 'Print / Save as PDF'}</span>
        </button>
      </div>

      {/* Printable CAD Blueprint Sheet (Light Mode) */}
      <div
        ref={printRef}
        className="w-full max-w-6xl mx-auto bg-white border-2 border-slate-300 rounded-3xl shadow-xl p-8 text-slate-900 flex flex-col justify-between aspect-[1.414/1] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blueprint-light opacity-50 pointer-events-none" />

        {/* Blueprint Sheet Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-slate-300 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-blue-600 uppercase font-extrabold">
              {language === 'ar' ? 'مخططات مطابخ هندسية تنفيذية' : 'KITCHEN MANUFACTURING & ARCHITECTURAL CAD'}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{metadata.name}</h1>
            <p className="text-xs text-slate-600">
              {language === 'ar' ? 'العميل' : 'Client'}: {metadata.clientName || 'Standard Production'} | {language === 'ar' ? 'المصمم' : 'Designer'}: {metadata.designerName || 'CAD Studio'}
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-600">
            <div>DATE: {metadata.date}</div>
            <div>BOARD: {manufacturing.boardThickness}mm Melamine</div>
            <div className="text-emerald-700 font-bold">{t.approvedProduction}</div>
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
              fill="#ffffff"
              stroke="#2563eb"
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
                    fill="#eff6ff"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray={cab.category === 'wall' ? '4,4' : 'none'}
                  />
                  <text
                    x={w / 2}
                    y={d / 2 - 4}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#1e3a8a"
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
                    fill="#2563eb"
                    fontSize="32"
                    fontFamily="monospace"
                    fontWeight="bold"
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
              color="#2563eb"
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
              color="#2563eb"
              fontSize={40}
              prefix="WALL B: "
            />
          </svg>
        </div>

        {/* Blueprint Title Block (Bottom Footer) */}
        <div className="relative z-10 grid grid-cols-4 border-2 border-slate-400 bg-slate-50 text-xs font-mono">
          <div className="p-3 border-r border-slate-300">
            <div className="text-[10px] text-slate-500 font-bold">{language === 'ar' ? 'أبعاد الغرفة' : 'ROOM DIMENSIONS'}</div>
            <div className="font-bold text-slate-900 text-sm">
              {formatDimension(room.width, unit)} x {formatDimension(room.length, unit)}
            </div>
            <div className="text-slate-500">H: {formatDimension(room.ceilingHeight, unit)}</div>
          </div>
          <div className="p-3 border-r border-slate-300">
            <div className="text-[10px] text-slate-500 font-bold">{language === 'ar' ? 'إجمالي الوحدات' : 'CABINET COUNT'}</div>
            <div className="font-bold text-slate-900 text-sm">{cabinets.length} {language === 'ar' ? 'وحدة' : 'UNITS'}</div>
            <div className="text-slate-500">Base: {cabinets.filter(c => c.category === 'base').length} | Wall: {cabinets.filter(c => c.category === 'wall').length}</div>
          </div>
          <div className="p-3 border-r border-slate-300">
            <div className="text-[10px] text-slate-500 font-bold">{language === 'ar' ? 'التشطيبات' : 'FINISHES'}</div>
            <div className="font-bold text-slate-900">{project.materials.frontFinish}</div>
            <div className="text-slate-500">{project.materials.countertopMaterial}</div>
          </div>
          <div className="p-3 flex flex-col justify-between bg-blue-50">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold">SHEET NO.</span>
              <span className="font-bold text-blue-600">A-101</span>
            </div>
            <div className="text-[10px] text-right text-slate-500">SCALE 1:25 @ A4</div>
          </div>
        </div>
      </div>
    </div>
  );
};
