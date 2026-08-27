import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { X, Check, Sliders } from 'lucide-react';

export const RoomConfigModal: React.FC = () => {
  const { project, updateRoomDimensions, updateCountertop, updatePlinth, updateBacksplash, updateManufacturing } = useProjectStore();
  const { isRoomModalOpen, setIsRoomModalOpen, unit } = useUIStore();

  const { room, countertop, plinth, backsplash, manufacturing } = project;

  const [width, setWidth] = useState(room.width);
  const [length, setLength] = useState(room.length);
  const [ceilingHeight, setCeilingHeight] = useState(room.ceilingHeight);
  const [wallThickness, setWallThickness] = useState(room.wallThickness);

  const [worktopThickness, setWorktopThickness] = useState(countertop.thickness);
  const [worktopOverhang, setWorktopOverhang] = useState(countertop.overhangFront);
  const [plinthHeight, setPlinthHeight] = useState(plinth.height);
  const [backsplashHeight, setBacksplashHeight] = useState(backsplash.height);
  const [boardThickness, setBoardThickness] = useState(manufacturing.boardThickness);

  if (!isRoomModalOpen) return null;

  const handleSave = () => {
    updateRoomDimensions(width, length, ceilingHeight, wallThickness);
    updateCountertop({ thickness: worktopThickness, overhangFront: worktopOverhang });
    updatePlinth({ height: plinthHeight });
    updateBacksplash({ height: backsplashHeight });
    updateManufacturing({ boardThickness });
    setIsRoomModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">إعدادات أبعاد ومعايير الغرفة</h2>
              <p className="text-xs text-slate-500">تعديل الأبعاد المعمارية الصافية، ارتفاع السقف، والوزرات</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoomModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Room Dimensions */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-3">
              1. الأبعاد المعمارية للغرفة ({unit})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">العرض الصافي (X)</label>
                <input
                  type="number"
                  value={convertMmToUnit(width, unit)}
                  onChange={(e) => setWidth(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">العمق الصافي (Y)</label>
                <input
                  type="number"
                  value={convertMmToUnit(length, unit)}
                  onChange={(e) => setLength(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">ارتفاع السقف (Z)</label>
                <input
                  type="number"
                  value={convertMmToUnit(ceilingHeight, unit)}
                  onChange={(e) => setCeilingHeight(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">سماكة الجدران</label>
                <input
                  type="number"
                  value={convertMmToUnit(wallThickness, unit)}
                  onChange={(e) => setWallThickness(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Standards & Tolerances */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-3">
              2. معايير الوزرة والرخام وسماكة الخشب
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">ارتفاع الوزرة السفلية (مم)</label>
                <input
                  type="number"
                  value={plinthHeight}
                  onChange={(e) => setPlinthHeight(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">سماكة قرصة الرخام (مم)</label>
                <input
                  type="number"
                  value={worktopThickness}
                  onChange={(e) => setWorktopThickness(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">بروز الرخام للأمام (مم)</label>
                <input
                  type="number"
                  value={worktopOverhang}
                  onChange={(e) => setWorktopOverhang(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">سماكة ألواح الخشب الشاسيه</label>
                <select
                  value={boardThickness}
                  onChange={(e) => setBoardThickness(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value={16}>16 مم (اقتصادي)</option>
                  <option value={18}>18 مم (قياسي معتمد)</option>
                  <option value={19}>19 مم (ثقيل)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => setIsRoomModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
          >
            <Check size={15} />
            <span>حفظ وتطبيق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
