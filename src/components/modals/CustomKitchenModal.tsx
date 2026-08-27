import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CabinetCategory, CabinetType } from '../../types';
import { formatDimension, convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { 
  Sliders, 
  X, 
  Plus, 
  CookingPot, 
  Layers, 
  Maximize, 
  Sparkles, 
  Check, 
  Box, 
  Tv, 
  Droplet, 
  CornerDownRight,
  Minus
} from 'lucide-react';

export const CustomKitchenModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addCabinet } = useProjectStore();
  const { unit } = useUIStore();

  const [category, setCategory] = useState<CabinetCategory>('base');
  const [name, setName] = useState('كابينة مطبخ مخصصة');
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(720);
  const [depth, setDepth] = useState(560);
  const [z, setZ] = useState(100);

  // Styling & Facade
  const [doorStyle, setDoorStyle] = useState<'flat' | 'gola' | 'shaker' | 'glass' | 'jpull'>('flat');
  const [doorCount, setDoorCount] = useState(1);
  const [drawerCount, setDrawerCount] = useState(0);
  const [shelfCount, setShelfCount] = useState(1);
  const [doorHinge, setDoorHinge] = useState<'left' | 'right' | 'double' | 'top' | 'none'>('right');
  const [hasSinkCutout, setHasSinkCutout] = useState(false);
  const [hasApplianceCavity, setHasApplianceCavity] = useState(false);
  const [hasIntegratedLed, setHasIntegratedLed] = useState(false);
  const [verticalDividersCount, setVerticalDividersCount] = useState(0);

  if (!isOpen) return null;

  const handleCategoryChange = (cat: CabinetCategory) => {
    setCategory(cat);
    if (cat === 'base') {
      setHeight(720);
      setDepth(560);
      setZ(100);
      setName('كابينة سفلية مخصصة');
    } else if (cat === 'wall') {
      setHeight(720);
      setDepth(350);
      setZ(1450);
      setName('كابينة علوية مخصصة');
    } else if (cat === 'tall') {
      setHeight(2050);
      setDepth(580);
      setZ(100);
      setName('برج مطبخ طولي مخصص');
    } else if (cat === 'corner') {
      setWidth(900);
      setHeight(720);
      setDepth(900);
      setZ(100);
      setName('وحدة ركنة زاوية مخصصة');
    }
  };

  const handleCreateCabinet = (e: React.FormEvent) => {
    e.preventDefault();

    let finalType: CabinetType = 'base-single-door';
    if (category === 'wall') {
      finalType = doorStyle === 'glass' ? 'wall-glass-vitrine' : 'wall-single-door';
    } else if (category === 'tall') {
      finalType = hasApplianceCavity ? 'tall-oven-tower' : 'tall-pantry-pullout';
    } else if (category === 'corner') {
      finalType = 'base-corner-l';
    } else if (drawerCount > 0) {
      finalType = drawerCount === 2 ? 'base-drawers-2' : drawerCount === 3 ? 'base-drawers-3' : 'base-drawers-4';
    }

    addCabinet({
      name: name.trim() || 'كابينة مطبخ مخصصة',
      category,
      type: finalType,
      projectType: 'kitchen',
      width,
      height,
      depth,
      x: 1200,
      y: 0,
      z,
      rotation: 0,
      wallId: 'wall-a',
      doorCount,
      drawerCount,
      shelfCount,
      doorHinge,
      hasSinkCutout,
      hasApplianceCavity,
      hasIntegratedLed,
      verticalDividersCount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in select-none font-sans">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-600/20">
              <CookingPot size={22} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                مصمم المطابخ والوحدات المخصصة (Custom Kitchen Cabinet Builder)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تحديد دقيق للأبعاد، التقسيمات الداخلية، طراز الضلف (جولا / فلات / زجاج / شيكر)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreateCabinet} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* 1. Category Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-2 font-mono uppercase text-[11px]">
              1. نوع الوحدة / القسم الأساسي
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('base')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1.5 ${
                  category === 'base' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Box size={16} />
                <span>سفلي (Base)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('wall')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1.5 ${
                  category === 'wall' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Layers size={16} />
                <span>علوي (Wall)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('tall')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1.5 ${
                  category === 'tall' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Tv size={16} />
                <span>برج طولي (Tall)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('corner')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1.5 ${
                  category === 'corner' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <CornerDownRight size={16} />
                <span>ركنة (Corner)</span>
              </button>
            </div>
          </div>

          {/* 2. Unit Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">اسم الوحدة وتوصيفها</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 3. Exact Custom Dimensions */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                <Maximize size={15} className="text-blue-600" />
                المقاسات الدقيقة الصافية ({unit})
              </span>
              <span className="text-[10px] text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded font-bold">Custom Sizes</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">العرض (W)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(width, unit)}
                  onChange={(e) => setWidth(Math.max(50, convertUnitToMm(Number(e.target.value), unit)))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-blue-600 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">الارتفاع (H)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(height, unit)}
                  onChange={(e) => setHeight(Math.max(50, convertUnitToMm(Number(e.target.value), unit)))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">العمق (D)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(depth, unit)}
                  onChange={(e) => setDepth(Math.max(50, convertUnitToMm(Number(e.target.value), unit)))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">الارتفاع Z</label>
                <input
                  type="number"
                  value={convertMmToUnit(z, unit)}
                  onChange={(e) => setZ(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-center"
                />
              </div>
            </div>
          </div>

          {/* 4. Door Style & Facade */}
          <div>
            <label className="font-bold text-slate-700 block mb-2 font-mono uppercase text-[11px]">
              4. طراز الضلف والمقابض
            </label>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { id: 'flat', label: 'سادة فلات' },
                { id: 'gola', label: 'جولا بروفايل' },
                { id: 'jpull', label: 'مقبض J-Pull' },
                { id: 'glass', label: 'فريم زجاج' },
                { id: 'shaker', label: 'شيكر كلاسيك' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setDoorStyle(style.id as any)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition ${
                    doorStyle === style.id ? 'bg-blue-50 text-blue-700 border-blue-400 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Internal Organization Setup */}
          <div className="space-y-3">
            <label className="font-bold text-slate-700 block mb-1 font-mono uppercase text-[11px]">
              5. التقسيم الداخلي والتجهيزات
            </label>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">عدد الضلف (الأبواب)</label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={doorCount}
                  onChange={(e) => {
                    const count = Math.max(0, Number(e.target.value));
                    setDoorCount(count);
                    if (count === 1) setDoorHinge('right');
                    else if (count === 2) setDoorHinge('double');
                    else if (count === 0) setDoorHinge('none');
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">عدد الأدراج</label>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={drawerCount}
                  onChange={(e) => setDrawerCount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">عدد الرفوف الداخلية</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={shelfCount}
                  onChange={(e) => setShelfCount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Special Equipment Toggles */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSinkCutout}
                  onChange={(e) => setHasSinkCutout(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">تفريغ حوض سباكة</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasApplianceCavity}
                  onChange={(e) => setHasApplianceCavity(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">تجويف فرن / ميكروويف</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasIntegratedLed}
                  onChange={(e) => setHasIntegratedLed(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">إضاءة LED بروفايل</span>
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/25 transition transform active:scale-95 flex items-center gap-2"
            >
              <Plus size={16} />
              <span>إضافة الوحدة المصممة إلى المخطط</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
