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
  Maximize2
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

      <aside className="fixed inset-x-0 bottom-12 max-h-[75vh] w-full bg-white border-t-2 border-slate-300 z-40 shadow-2xl rounded-t-3xl overflow-y-auto select-none font-sans animate-in slide-in-from-bottom duration-200 text-xs lg:relative lg:bottom-0 lg:max-h-full lg:w-80 lg:rounded-none lg:border-t-0 lg:border-l lg:border-slate-200/90 lg:z-20 lg:slide-in-from-right-2">
        {/* Mobile Drag Indicator Pill */}
        <div className="lg:hidden flex items-center justify-center pt-2 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>
      {/* ========================================================================= */}
      {/* 1. CABINET / FURNITURE ITEM INSPECTOR                                      */}
      {/* ========================================================================= */}
      {selectedCabinet && (
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 shrink-0">
                {selectedCabinet.id}
              </span>
              <input
                type="text"
                value={selectedCabinet.name}
                onChange={(e) => updateCabinet(selectedCabinet.id, { name: e.target.value })}
                className="font-bold text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-slate-100 px-1.5 py-0.5 rounded border border-transparent focus:border-blue-500 truncate"
              />
            </div>

            <button
              onClick={clearSelection}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
              title="إلغاء التحديد وإغلاق اللوحة"
            >
              <X size={15} />
            </button>
          </div>

          {/* Quick Actions Ribbon */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => duplicateCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg text-slate-700 font-bold transition shadow-2xs text-[11px]"
              title="تكرار الوحدة"
            >
              <Copy size={13} />
              <span>نسخ</span>
            </button>

            <button
              onClick={() => rotateCabinet(selectedCabinet.id, 90)}
              className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-purple-50 hover:text-purple-600 border border-slate-200 rounded-lg text-slate-700 font-bold transition shadow-2xs text-[11px]"
              title="تدوير 90 درجة"
            >
              <RotateCw size={13} />
              <span>تدوير 90°</span>
            </button>

            <button
              onClick={() => removeCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-lg text-red-600 font-bold transition shadow-2xs text-[11px]"
              title="حذف الوحدة"
            >
              <Trash2 size={13} />
              <span>حذف</span>
            </button>
          </div>

          {/* Dimensions Card (W x H x D) */}
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Ruler size={13} className="text-purple-600" />
              <span>الأبعاد والمقاسات ({unit})</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 font-mono">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">{t.width} (X)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.width, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">{t.height} (Y)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.height, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">{t.depth} (Z)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.depth, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { depth: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono pt-1">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الارتفاع عن الأرض (Z)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.z, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { z: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">زاوية الدوران (°)</label>
                <input
                  type="number"
                  value={selectedCabinet.rotation}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { rotation: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Internal Configuration (Doors, Shelves, Drawers) */}
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Sliders size={13} className="text-blue-600" />
              <span>التقسيم الداخلي والضلف</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 font-mono">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الأرفف</label>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={selectedCabinet.shelfCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { shelfCount: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الضلف</label>
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={selectedCabinet.doorCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { doorCount: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-center"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">الأدراج</label>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={selectedCabinet.drawerCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { drawerCount: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-center"
                />
              </div>
            </div>

            {selectedCabinet.doorCount > 0 && (
              <div className="pt-1">
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">مفصلات الباب</label>
                <select
                  value={selectedCabinet.doorHinge}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { doorHinge: e.target.value as any })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                >
                  <option value="right">يمين (Right Hinge)</option>
                  <option value="left">يسار (Left Hinge)</option>
                  <option value="double">مزدوج (Double Doors)</option>
                  <option value="top">قلاب علوي (Top Lift)</option>
                  <option value="none">بدون مفصلات</option>
                </select>
              </div>
            )}
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
