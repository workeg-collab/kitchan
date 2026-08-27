import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension, convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { TRANSLATIONS } from '../../utils/i18n';
import { X, PencilRuler, Check, LayoutGrid, RotateCcw } from 'lucide-react';

export const RoomSketcherModal: React.FC = () => {
  const { project, updateRoomDimensions } = useProjectStore();
  const { isRoomSketcherOpen, setIsRoomSketcherOpen, unit, language } = useUIStore();
  const t = TRANSLATIONS[language];

  const [shape, setShape] = useState<'rectangular' | 'l-shape' | 'u-shape' | 'galley'>('rectangular');
  const [width, setWidth] = useState(project.room.width);
  const [length, setLength] = useState(project.room.length);
  const [ceilingHeight, setCeilingHeight] = useState(project.room.ceilingHeight);
  const [wallThickness, setWallThickness] = useState(project.room.wallThickness);

  // L-Shape specific notch cutouts
  const [notchW, setNotchW] = useState(1500);
  const [notchL, setNotchL] = useState(1500);

  if (!isRoomSketcherOpen) return null;

  const handleApplySketch = () => {
    updateRoomDimensions(width, length, ceilingHeight, wallThickness);
    setIsRoomSketcherOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <PencilRuler size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.roomSketcherTitle}</h2>
              <p className="text-xs text-slate-500">{t.roomSketcherDesc}</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoomSketcherOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[75vh]">
          {/* Left: Shape Selection & Dimension Form */}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                {language === 'ar' ? 'نمط وتخطيط المطبخ' : 'Kitchen Layout Shape'}
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { id: 'rectangular', label: t.shapeRectangular },
                  { id: 'l-shape', label: t.shapeLShape },
                  { id: 'u-shape', label: t.shapeUShape },
                  { id: 'galley', label: t.shapeGalley },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShape(s.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                      shape === s.id
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Numeric Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">{t.width} ({unit})</label>
                  <input
                    type="number"
                    value={convertMmToUnit(width, unit)}
                    onChange={(e) => setWidth(convertUnitToMm(Number(e.target.value), unit))}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">{t.depth} / Length ({unit})</label>
                  <input
                    type="number"
                    value={convertMmToUnit(length, unit)}
                    onChange={(e) => setLength(convertUnitToMm(Number(e.target.value), unit))}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">{t.height} ({unit})</label>
                  <input
                    type="number"
                    value={convertMmToUnit(ceilingHeight, unit)}
                    onChange={(e) => setCeilingHeight(convertUnitToMm(Number(e.target.value), unit))}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">{language === 'ar' ? 'سماكة الجدار' : 'Wall Thickness'} ({unit})</label>
                  <input
                    type="number"
                    value={convertMmToUnit(wallThickness, unit)}
                    onChange={(e) => setWallThickness(convertUnitToMm(Number(e.target.value), unit))}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive SVG Visualizer */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between">
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                {language === 'ar' ? 'معاينة المسقط الأفقي' : 'Top View Blueprint'}
              </span>
              <span className="text-[11px] font-mono text-blue-600 font-bold">
                {formatDimension(width, unit)} x {formatDimension(length, unit)}
              </span>
            </div>

            {/* SVG Diagram */}
            <div className="w-full aspect-square bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center relative overflow-hidden shadow-inner">
              <svg viewBox="-50 -50 400 400" className="w-full h-full">
                {/* Room Fill */}
                <rect x="0" y="0" width="300" height="260" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="4" />
                {/* Walls */}
                <line x1="0" y1="0" x2="300" y2="0" stroke="#2563eb" strokeWidth="6" />
                <line x1="300" y1="0" x2="300" y2="260" stroke="#2563eb" strokeWidth="6" />
                <line x1="300" y1="260" x2="0" y2="260" stroke="#2563eb" strokeWidth="6" />
                <line x1="0" y1="260" x2="0" y2="0" stroke="#2563eb" strokeWidth="6" />

                {/* Wall Labels */}
                <text x="150" y="-12" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">WALL A</text>
                <text x="315" y="130" textAnchor="start" fill="#64748b" fontSize="12" fontWeight="bold">WALL B</text>
                <text x="150" y="280" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">WALL C</text>
                <text x="-15" y="130" textAnchor="end" fill="#64748b" fontSize="12" fontWeight="bold">WALL D</text>

                {/* Simulated Kitchen Base Zone */}
                {shape === 'l-shape' && (
                  <g fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5">
                    <rect x="0" y="0" width="300" height="45" opacity="0.7" />
                    <rect x="255" y="0" width="45" height="260" opacity="0.7" />
                  </g>
                )}
                {shape === 'u-shape' && (
                  <g fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5">
                    <rect x="0" y="0" width="45" height="260" opacity="0.7" />
                    <rect x="0" y="0" width="300" height="45" opacity="0.7" />
                    <rect x="255" y="0" width="45" height="260" opacity="0.7" />
                  </g>
                )}
                {shape === 'galley' && (
                  <g fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5">
                    <rect x="0" y="0" width="300" height="45" opacity="0.7" />
                    <rect x="0" y="215" width="300" height="45" opacity="0.7" />
                  </g>
                )}
              </svg>
            </div>

            <p className="text-[10px] text-slate-400 mt-2 text-center">
              {language === 'ar' ? 'يتم تحديث جميع الأبعاد والمساقط تلقائياً في التصميمين 2D و 3D' : 'Dimensions and walls will synchronize with 2D CAD and 3D views automatically'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => setIsRoomSketcherOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleApplySketch}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition"
          >
            <Check size={15} />
            <span>{language === 'ar' ? 'تطبيق المخطط' : 'Apply Layout'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
