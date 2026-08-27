import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CabinetCategory } from '../../types';
import { convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { X, Check, Plus } from 'lucide-react';

export const CustomCabinetModal: React.FC = () => {
  const { addCabinet, project } = useProjectStore();
  const { isCustomCabinetModalOpen, setIsCustomCabinetModalOpen, unit } = useUIStore();

  const [name, setName] = useState('وحدة مخصصة خاصة');
  const [category, setCategory] = useState<CabinetCategory>('base');
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(720);
  const [depth, setDepth] = useState(560);
  const [z, setZ] = useState(100);
  const [doorCount, setDoorCount] = useState(1);
  const [drawerCount, setDrawerCount] = useState(0);
  const [shelfCount, setShelfCount] = useState(1);
  const [doorHinge, setDoorHinge] = useState<'left' | 'right' | 'double' | 'top' | 'none'>('right');
  const [notes, setNotes] = useState('');

  if (!isCustomCabinetModalOpen) return null;

  const handleCreate = () => {
    addCabinet({
      name,
      category,
      type: 'custom-box',
      width,
      height,
      depth,
      x: 100,
      y: 0,
      z,
      rotation: 0,
      wallId: 'wall-a',
      doorCount,
      drawerCount,
      shelfCount,
      doorHinge,
      customNotes: notes,
      materialFront: project.materials.frontFinish,
      materialBody: project.materials.bodyColor,
      handleType: project.materials.handleStyle,
      isCustom: true,
    });

    setIsCustomCabinetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">إنشاء وحدة / كابينة بمقاسات مخصصة</h2>
              <p className="text-xs text-slate-500">تحديد العرض، الارتفاع، العمق، والتقسيم الداخلي بدقة</p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomCabinetModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          <div>
            <label className="text-xs font-semibold text-slate-700">اسم وتوصيف الوحدة</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">نوع وتصنيف الوحدة</label>
            <select
              value={category}
              onChange={(e) => {
                const cat = e.target.value as CabinetCategory;
                setCategory(cat);
                if (cat === 'wall') {
                  setHeight(720);
                  setDepth(350);
                  setZ(1450);
                } else if (cat === 'tall') {
                  setHeight(2050);
                  setDepth(560);
                  setZ(100);
                } else {
                  setHeight(720);
                  setDepth(560);
                  setZ(100);
                }
              }}
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="base">وحدة سفلية (Base)</option>
              <option value="wall">وحدة علوية جدارية (Wall)</option>
              <option value="tall">دولاب طولي كامل (Tall)</option>
              <option value="corner">وحدة ركنة زاوية (Corner)</option>
              <option value="custom">تصنيع خاص (Custom)</option>
            </select>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600">العرض ({unit})</label>
              <input
                type="number"
                value={convertMmToUnit(width, unit)}
                onChange={(e) => setWidth(convertUnitToMm(Number(e.target.value), unit))}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">الارتفاع ({unit})</label>
              <input
                type="number"
                value={convertMmToUnit(height, unit)}
                onChange={(e) => setHeight(convertUnitToMm(Number(e.target.value), unit))}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">العمق ({unit})</label>
              <input
                type="number"
                value={convertMmToUnit(depth, unit)}
                onChange={(e) => setDepth(convertUnitToMm(Number(e.target.value), unit))}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Internals */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600">عدد الأبواب</label>
              <input
                type="number"
                min={0}
                max={4}
                value={doorCount}
                onChange={(e) => setDoorCount(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">عدد الأدراج</label>
              <input
                type="number"
                min={0}
                max={6}
                value={drawerCount}
                onChange={(e) => setDrawerCount(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">عدد الرفوف</label>
              <input
                type="number"
                min={0}
                max={8}
                value={shelfCount}
                onChange={(e) => setShelfCount(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600">ملاحظات التصنيع والإكسسوارات</label>
            <textarea
              rows={2}
              placeholder="مثال: سلة قلاب للقمامة، مجاري بلوم تاندم..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => setIsCustomCabinetModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
          >
            <Check size={15} />
            <span>إضافة الوحدة للمخطط</span>
          </button>
        </div>
      </div>
    </div>
  );
};
