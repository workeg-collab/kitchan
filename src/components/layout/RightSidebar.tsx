import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension, convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { TRANSLATIONS } from '../../utils/i18n';
import { 
  Sliders, 
  RotateCw, 
  Copy, 
  Trash2, 
  X, 
  Settings, 
  AlertTriangle, 
  DoorClosed,
  AppWindow,
  Square,
  MinusSquare,
  CircleDot,
  Layers,
  Ruler,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Box
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const {
    project,
    selectedId,
    selectedType,
    clearSelection,
    updateCabinet,
    updateAppliance,
    updateElement,
    duplicateCabinet,
    rotateCabinet,
    removeCabinet,
    duplicateAppliance,
    rotateAppliance,
    removeAppliance,
    removeElement,
    updateRoomDimensions,
  } = useProjectStore();

  const { unit, language, isRightPanelCollapsed, setIsRightPanelCollapsed } = useUIStore();
  const t = TRANSLATIONS[language];
  const { room, cabinets, appliances, architecturalElements } = project;

  const selectedCabinet = selectedType === 'cabinet' ? cabinets.find((c) => c.id === selectedId) : null;
  const selectedAppliance = selectedType === 'appliance' ? appliances.find((a) => a.id === selectedId) : null;
  const selectedElement = selectedType === 'element' ? architecturalElements.find((e) => e.id === selectedId) : null;

  const hasSelection = !!(selectedCabinet || selectedAppliance || selectedElement);

  // If user collapsed the panel and nothing is selected, keep it completely hidden to give 100% canvas!
  if (isRightPanelCollapsed && !hasSelection) {
    return null;
  }

  return (
    <>
      {/* Backdrop on mobile when an item is selected */}
      {hasSelection && (
        <div 
          onClick={clearSelection}
          className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 transition-opacity"
        />
      )}

      <aside className="fixed inset-x-0 bottom-12 max-h-[75vh] w-full bg-white border-t-2 border-slate-300 z-40 shadow-2xl rounded-t-3xl overflow-y-auto select-none font-sans animate-in slide-in-from-bottom duration-200 text-xs lg:relative lg:bottom-0 lg:max-h-full lg:w-68 lg:rounded-none lg:border-t-0 lg:border-l lg:border-slate-200/90 lg:z-20 lg:slide-in-from-right-2">
        {/* Mobile Drag Indicator Pill */}
        <div className="lg:hidden flex items-center justify-center pt-2 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>
      {/* ========================================================================= */}
      {/* 1. CABINET / FURNITURE ITEM INSPECTOR                                      */}
      {/* ========================================================================= */}
      {selectedCabinet && (
        <div className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 shrink-0">
                {selectedCabinet.id}
              </span>
              <input
                type="text"
                value={selectedCabinet.name}
                onChange={(e) => updateCabinet(selectedCabinet.id, { name: e.target.value })}
                className="font-bold text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-slate-100 px-1.5 py-0.5 rounded border border-transparent focus:border-blue-500 truncate text-xs"
              />
            </div>

            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
              title="إلغاء التحديد وإغلاق اللوحة"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Actions Ribbon */}
          <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => duplicateCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg text-slate-700 font-bold transition shadow-2xs text-[11px]"
              title="تكرار الوحدة"
            >
              <Copy size={12} />
              <span>نسخ</span>
            </button>

            <button
              onClick={() => rotateCabinet(selectedCabinet.id, 90)}
              className="flex items-center justify-center gap-1 py-1 bg-white hover:bg-purple-50 hover:text-purple-600 border border-slate-200 rounded-lg text-slate-700 font-bold transition shadow-2xs text-[11px]"
              title="تدوير 90 درجة"
            >
              <RotateCw size={12} />
              <span>تدوير 90°</span>
            </button>

            <button
              onClick={() => removeCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1 py-1 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg text-red-600 font-bold transition shadow-2xs text-[11px]"
              title="حذف الوحدة"
            >
              <Trash2 size={12} />
              <span>حذف</span>
            </button>
          </div>

          {/* Dimensions Card (W x H x D) */}
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Ruler size={13} className="text-purple-600" />
                <span>المقاسات ({unit})</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400">W × H × D</span>
            </h4>

            <div className="grid grid-cols-3 gap-1.5 font-mono">
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">العرض (W)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.width, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">الارتفاع (H)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.height, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">العمق (D)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.depth, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { depth: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Quick Width Presets */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[9px] font-bold text-slate-400">تعديل سريع:</span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { width: Math.max(200, selectedCabinet.width - 100) })}
                  className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded font-bold text-slate-700"
                  title="إنقاص العرض 10 سم"
                >
                  -10
                </button>
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { width: Math.max(200, selectedCabinet.width - 50) })}
                  className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded font-bold text-slate-700"
                  title="إنقاص العرض 5 سم"
                >
                  -5
                </button>
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { width: Math.min(3000, selectedCabinet.width + 50) })}
                  className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded font-bold text-slate-700"
                  title="زيادة العرض 5 سم"
                >
                  +5
                </button>
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { width: Math.min(3000, selectedCabinet.width + 100) })}
                  className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-slate-200 rounded font-bold text-slate-700"
                  title="زيادة العرض 10 سم"
                >
                  +10
                </button>
              </div>
            </div>

            {/* Height presets for dressing/wardrobes */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[9px] font-bold text-slate-400">ارتفاع قياسي:</span>
              <div className="flex items-center gap-1 font-mono text-[9px]">
                {[2200, 2400, 2600, 2800].map((h) => (
                  <button
                    key={h}
                    onClick={() => updateCabinet(selectedCabinet.id, { height: h })}
                    className={`px-1 py-0.5 rounded font-bold border transition ${
                      selectedCabinet.height === h
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {h / 10}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 font-mono pt-1">
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">من الأرض (Z)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.z, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { z: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">الدوران (°)</label>
                <input
                  type="number"
                  value={selectedCabinet.rotation}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { rotation: Number(e.target.value) })}
                  className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DOORS & PARTITIONS CONTROLLER (إضافة ضلف / إلغاء ضلف / ضلف ثابتة)           */}
          {/* ========================================================================= */}
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Sliders size={13} className="text-blue-600" />
              <span>الضلف والأبواب والتقسيم</span>
            </h4>

            {/* Door Count Selector: Add / Remove Doors */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-600 font-bold">الضلف (إضافة أو إلغاء):</label>
                <span className="text-[9px] text-blue-600 font-mono font-bold">
                  {selectedCabinet.doorCount === 0 ? 'مفتوح (بدون ضلف)' : `${selectedCabinet.doorCount} ضلفة`}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center font-bold text-xs">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      updateCabinet(selectedCabinet.id, {
                        doorCount: num,
                        doorType: num === 0 ? 'open' : (selectedCabinet.doorType === 'open' ? 'hinged' : selectedCabinet.doorType || 'hinged')
                      });
                    }}
                    className={`py-1 rounded-lg border transition ${
                      selectedCabinet.doorCount === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={num === 0 ? 'إلغاء الضلف (دريسنج مفتوح)' : `${num} ضلفة`}
                  >
                    {num === 0 ? 'مفتوح' : `${num}ض`}
                  </button>
                ))}
              </div>
            </div>

            {/* Door Types & Fixed Door Mode */}
            {selectedCabinet.doorCount > 0 && (
              <div className="space-y-1 pt-1 border-t border-slate-200/60">
                <label className="text-[10px] text-slate-600 font-bold block mb-0.5">نوع الضلفة / ضلفة ثابتة:</label>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
                  <button
                    onClick={() => updateCabinet(selectedCabinet.id, { doorType: 'hinged' })}
                    className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 transition ${
                      selectedCabinet.doorType === 'hinged' || !selectedCabinet.doorType
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <DoorClosed size={12} />
                    <span>مفصلات عادية</span>
                  </button>

                  <button
                    onClick={() => updateCabinet(selectedCabinet.id, { doorType: 'fixed' })}
                    className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 transition ${
                      selectedCabinet.doorType === 'fixed'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="ضلفة ثابتة لا تفتح (Fixed Panel / Faux Door)"
                  >
                    <Square size={12} />
                    <span>ضلفة ثابتة 🔒</span>
                  </button>

                  <button
                    onClick={() => updateCabinet(selectedCabinet.id, { doorType: 'sliding' })}
                    className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 transition ${
                      selectedCabinet.doorType === 'sliding'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sliders size={12} />
                    <span>جرار سحاب</span>
                  </button>

                  <button
                    onClick={() => updateCabinet(selectedCabinet.id, { doorType: 'glass-frame' })}
                    className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 transition ${
                      selectedCabinet.doorType === 'glass-frame'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <AppWindow size={12} />
                    <span>زجاج فريم</span>
                  </button>
                </div>
              </div>
            )}

            {/* Internal Shelves & Drawers */}
            <div className="grid grid-cols-2 gap-2 font-mono pt-1">
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">عدد الأرفف</label>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={selectedCabinet.shelfCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { shelfCount: Number(e.target.value) })}
                  className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">عدد الأدراج</label>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={selectedCabinet.drawerCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { drawerCount: Number(e.target.value) })}
                  className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-center"
                />
              </div>
            </div>

            {/* Dressing Specific Toggles */}
            <div className="pt-1.5 border-t border-slate-200/80 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 block">إكسسوارات الدريسينج:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { hasHangingRail: !selectedCabinet.hasHangingRail })}
                  className={`p-1 rounded-lg border transition text-right px-2 ${
                    selectedCabinet.hasHangingRail ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  ماسورة تعليق {selectedCabinet.hasHangingRail ? '✓' : ''}
                </button>

                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { hasShoeShelves: !selectedCabinet.hasShoeShelves })}
                  className={`p-1 rounded-lg border transition text-right px-2 ${
                    selectedCabinet.hasShoeShelves ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  أرفف أحذية {selectedCabinet.hasShoeShelves ? '✓' : ''}
                </button>

                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { hasJewelryDrawer: !selectedCabinet.hasJewelryDrawer })}
                  className={`p-1 rounded-lg border transition text-right px-2 ${
                    selectedCabinet.hasJewelryDrawer ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  درج ساعات {selectedCabinet.hasJewelryDrawer ? '✓' : ''}
                </button>

                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { hasTrouserRack: !selectedCabinet.hasTrouserRack })}
                  className={`p-1 rounded-lg border transition text-right px-2 ${
                    selectedCabinet.hasTrouserRack ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  حامل بناطيل {selectedCabinet.hasTrouserRack ? '✓' : ''}
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* KITCHEN MAKER CARCASS & SPECS (شاسيه وتجميع كيتشن ميكر)                   */}
          {/* ========================================================================= */}
          <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <Box size={13} className="text-amber-600" />
                <span>تفصيل كيتشن ميكر (شاسيه العلبة)</span>
              </h4>
              <span className="text-[9px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded font-bold font-mono">
                KM PRO
              </span>
            </div>

            {/* Back Panel Mount */}
            <div>
              <label className="text-[9px] text-amber-800 font-bold block mb-0.5">نوع ظهر العلبة:</label>
              <select
                value={selectedCabinet.backPanelType || 'groove-6mm'}
                onChange={(e) => updateCabinet(selectedCabinet.id, { backPanelType: e.target.value as any })}
                className="w-full px-1.5 py-1 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-900"
              >
                <option value="groove-6mm">مفرز في الأجناب 6 مم (Grooved)</option>
                <option value="rebate-18mm">لطش مسامير 18 مم (Rebated)</option>
                <option value="flush-screwed">تجليد ظهر كامل 18 مم (Solid)</option>
              </select>
            </div>

            {/* Top Stretchers & Waterproof Bottom Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px] font-bold pt-0.5">
              <button
                onClick={() => updateCabinet(selectedCabinet.id, { hasTopStretchers: !selectedCabinet.hasTopStretchers })}
                className={`p-1.5 rounded-lg border transition text-right px-2 ${
                  selectedCabinet.hasTopStretchers
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/40'
                }`}
                title="عوارض خشب أمامية وخلفية 10 سم للتهوية وحمل الرخام بدلاً من السقف المقفول"
              >
                عوارض سقف 10سم {selectedCabinet.hasTopStretchers ? '✓' : ''}
              </button>

              <button
                onClick={() => updateCabinet(selectedCabinet.id, { hasAluminumWaterproofBottom: !selectedCabinet.hasAluminumWaterproofBottom })}
                className={`p-1.5 rounded-lg border transition text-right px-2 ${
                  selectedCabinet.hasAluminumWaterproofBottom
                    ? 'bg-cyan-600 text-white border-cyan-600'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/40'
                }`}
                title="قاع مصفح ألومنيوم معزول ومقاوم للمياه بنسبة 100% لوحدات الحوض"
              >
                قاع حوض ألومنيوم {selectedCabinet.hasAluminumWaterproofBottom ? '✓' : ''}
              </button>
            </div>

            {/* Dish Rack & Gola Profile Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
              <button
                onClick={() => updateCabinet(selectedCabinet.id, { hasDishRack: !selectedCabinet.hasDishRack })}
                className={`p-1.5 rounded-lg border transition text-right px-2 ${
                  selectedCabinet.hasDishRack
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/40'
                }`}
                title="مطبق تركي صفاية أطباق استانلس استيل مع صينية مياه"
              >
                مطبق تركي استانلس {selectedCabinet.hasDishRack ? '✓' : ''}
              </button>

              <button
                onClick={() => updateCabinet(selectedCabinet.id, { hasGolaProfile: !selectedCabinet.hasGolaProfile })}
                className={`p-1.5 rounded-lg border transition text-right px-2 ${
                  selectedCabinet.hasGolaProfile
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/40'
                }`}
                title="تفريز بروفايل جولا ألومنيوم للمطابخ المودرن بدون مقابض"
              >
                بروفايل جولا (Gola) {selectedCabinet.hasGolaProfile ? '✓' : ''}
              </button>
            </div>

            {/* Wall Infill Filler Toggle */}
            <div className="pt-1 border-t border-amber-200/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-900">فيلر تعويض جداري:</span>
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { hasFillerPanel: !selectedCabinet.hasFillerPanel })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                    selectedCabinet.hasFillerPanel
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-slate-700 border-amber-300'
                  }`}
                >
                  {selectedCabinet.hasFillerPanel ? 'مفعّل (7 سم)' : 'إضافة فيلر'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. APPLIANCE ITEM INSPECTOR                                               */}
      {/* ========================================================================= */}
      {selectedAppliance && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                {selectedAppliance.id}
              </span>
              <h3 className="font-bold text-slate-900 text-xs truncate">{selectedAppliance.name}</h3>
            </div>
            <button onClick={clearSelection} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => duplicateAppliance(selectedAppliance.id)}
              className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-lg text-slate-700 font-bold transition text-[11px]"
            >
              <Copy size={13} />
              <span>نسخ</span>
            </button>
            <button
              onClick={() => rotateAppliance(selectedAppliance.id, 90)}
              className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-lg text-slate-700 font-bold transition text-[11px]"
            >
              <RotateCw size={13} />
              <span>تدوير 90°</span>
            </button>
            <button
              onClick={() => removeAppliance(selectedAppliance.id)}
              className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg text-red-600 font-bold transition text-[11px]"
            >
              <Trash2 size={13} />
              <span>حذف</span>
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-700">أبعاد الجهاز ({unit})</h4>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">العرض</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.width, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الارتفاع</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.height, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">العمق</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.depth, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { depth: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ARCHITECTURAL OPENINGS INSPECTOR                                       */}
      {/* ========================================================================= */}
      {selectedElement && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                {selectedElement.id}
              </span>
              <h3 className="font-bold text-slate-900 text-xs truncate">{selectedElement.name}</h3>
            </div>
            <button onClick={clearSelection} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <X size={15} />
            </button>
          </div>

          <button
            onClick={() => removeElement(selectedElement.id)}
            className="w-full flex items-center justify-center gap-1 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-red-600 font-bold transition text-xs"
          >
            <Trash2 size={13} />
            <span>حذف العنصر المعماري</span>
          </button>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-700">أبعاد الفتحة ({unit})</h4>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">العرض</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedElement.width, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الارتفاع</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedElement.height, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GLOBAL ROOM DIMENSIONS (When nothing is selected)                      */}
      {/* ========================================================================= */}
      {!hasSelection && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-blue-600" />
              <h3 className="text-xs font-black text-slate-900">أبعاد ومواصفات الغرفة</h3>
            </div>

            <button
              onClick={() => setIsRightPanelCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="إخفاء اللوحة لتوسيع ساحة العمل"
            >
              <X size={15} />
            </button>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-700">الأبعاد الكلية للغرفة ({unit})</h4>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">العرض (X)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.width, unit)}
                  onChange={(e) => updateRoomDimensions(convertUnitToMm(Number(e.target.value), unit), room.length, room.ceilingHeight, room.wallThickness)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الطول (Y)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.length, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, convertUnitToMm(Number(e.target.value), unit), room.ceilingHeight, room.wallThickness)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">ارتفاع السقف (Z)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.ceilingHeight, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, room.length, convertUnitToMm(Number(e.target.value), unit), room.wallThickness)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">سماكة الجدار</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.wallThickness, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, room.length, room.ceilingHeight, convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  );
};
