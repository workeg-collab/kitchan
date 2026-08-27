import React from 'react';
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
  Maximize, 
  Layers, 
  Settings, 
  AlertTriangle, 
  Shirt, 
  BedDouble, 
  Tv, 
  Sparkles 
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const {
    project,
    selectedId,
    selectedType,
    clearSelection,
    updateCabinet,
    updateAppliance,
    duplicateCabinet,
    rotateCabinet,
    removeCabinet,
    duplicateAppliance,
    rotateAppliance,
    removeAppliance,
    removeElement,
    updateRoomDimensions,
    updateManufacturing,
  } = useProjectStore();

  const { unit, language } = useUIStore();
  const t = TRANSLATIONS[language];
  const { room, cabinets, appliances, architecturalElements, manufacturing } = project;

  const selectedCabinet = selectedType === 'cabinet' ? cabinets.find((c) => c.id === selectedId) : null;
  const selectedAppliance = selectedType === 'appliance' ? appliances.find((a) => a.id === selectedId) : null;

  // Shelf span warning for wide shelves without vertical dividers
  const hasShelfSpanWarning =
    selectedCabinet &&
    selectedCabinet.width > 900 &&
    (selectedCabinet.verticalDividersCount === undefined || selectedCabinet.verticalDividersCount === 0) &&
    (selectedCabinet.shelfCount > 0 || selectedCabinet.category === 'library-full' || selectedCabinet.category === 'bookshelf');

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none z-20 overflow-y-auto shadow-sm">
      {/* --- SELECTED ITEM INSPECTOR --- */}
      {selectedCabinet && (
        <div className="p-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200">
                {selectedCabinet.id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedCabinet.name}</h3>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Engineering Warning for Shelf Span */}
          {hasShelfSpanWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">تحذير هندسي (ترييح الرف):</strong>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  عرض الرف ({selectedCabinet.width} مم) كبير بالنسبة لسماكة اللوح — يُنصح بإضافة قاطع رأسي (Vertical Divider) أو زيادة سماكة الخشب إلى 25 مم لمنع التقوس.
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => rotateCabinet(selectedCabinet.id, 90)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <RotateCw size={14} className="text-blue-600" />
              <span>{t.rotate}</span>
            </button>
            <button
              onClick={() => duplicateCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <Copy size={14} className="text-indigo-600" />
              <span>{t.duplicate}</span>
            </button>
            <button
              onClick={() => removeCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold border border-red-200 transition"
            >
              <Trash2 size={14} />
              <span>{t.delete}</span>
            </button>
          </div>

          {/* Dimensions (W x H x D) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Maximize size={14} className="text-blue-600" />
              {t.dimensionsLabel} ({unit})
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.width}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.width, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.height}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.height, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.depth}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.depth, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { depth: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Position Coordinates (X, Y, Elevation Z) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sliders size={14} className="text-emerald-600" />
              {t.positionLabel} ({unit})
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.posX}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.x, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { x: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.posY}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.y, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { y: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.posZ}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.z, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { z: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-mono">{t.rotationAngle}</label>
              <select
                value={selectedCabinet.rotation}
                onChange={(e) => updateCabinet(selectedCabinet.id, { rotation: Number(e.target.value) })}
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
              >
                <option value={0}>0° (الجدار أ)</option>
                <option value={90}>90° (الجدار ب)</option>
                <option value={180}>180° (الجدار ج)</option>
                <option value={270}>270° (الجدار د)</option>
              </select>
            </div>
          </div>

          {/* Internal Organization */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Layers size={14} className="text-purple-600" />
              {t.internalsLabel}
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.shelves}</label>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={selectedCabinet.shelfCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { shelfCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.doors}</label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={selectedCabinet.doorCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { doorCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.drawers}</label>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={selectedCabinet.drawerCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { drawerCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            {/* TV Library Specific Fields */}
            {selectedCabinet.hasTvCavity && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Tv size={14} className="text-blue-600" />
                  <span>تجهيزات تجويف الشاشة</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="text-slate-500">عرض تجويف الشاشة</label>
                    <input
                      type="number"
                      value={selectedCabinet.tvWidth || 1500}
                      onChange={(e) => updateCabinet(selectedCabinet.id, { tvWidth: Number(e.target.value) })}
                      className="w-full mt-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500">ارتفاع تجويف الشاشة</label>
                    <input
                      type="number"
                      value={selectedCabinet.tvHeight || 900}
                      onChange={(e) => updateCabinet(selectedCabinet.id, { tvHeight: Number(e.target.value) })}
                      className="w-full mt-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-slate-500 font-mono">{t.notes}</label>
            <textarea
              rows={2}
              value={selectedCabinet.customNotes || ''}
              onChange={(e) => updateCabinet(selectedCabinet.id, { customNotes: e.target.value })}
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* --- DEFAULT GLOBAL SETTINGS PANEL --- */}
      {!selectedCabinet && !selectedAppliance && (
        <div className="p-4 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings size={16} className="text-blue-600" />
              {t.roomSetup}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              الأبعاد المعمارية الصافية وقواعد التصنيع
            </p>
          </div>

          {/* Room Dimensions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              أبعاد الغرفة ({unit})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.width} (X)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.width, unit)}
                  onChange={(e) => updateRoomDimensions(convertUnitToMm(Number(e.target.value), unit), room.length, room.ceilingHeight, room.wallThickness)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.depth} (Y)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.length, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, convertUnitToMm(Number(e.target.value), unit), room.ceilingHeight, room.wallThickness)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">ارتفاع السقف (Z)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.ceilingHeight, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, room.length, convertUnitToMm(Number(e.target.value), unit), room.wallThickness)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">سماكة الجدار</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.wallThickness, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, room.length, room.ceilingHeight, convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Manufacturing Defaults */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              معايير وقواعد التصنيع
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.boardThickness}</label>
                <select
                  value={manufacturing.boardThickness}
                  onChange={(e) => updateManufacturing({ boardThickness: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                >
                  <option value={16}>16 مم (اقتصادي)</option>
                  <option value={18}>18 مم (قياسي معتمد)</option>
                  <option value={25}>25 مم (أرفف ثقيلة ومكتبات)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">طريقة تجميع الشاسيه</label>
                <select
                  value={manufacturing.constructionMethod || 'sides-full-height'}
                  onChange={(e) => updateManufacturing({ constructionMethod: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="sides-full-height">الجوانب كاملة الارتفاع (سقف وقاع بين الجانبين)</option>
                  <option value="top-bottom-full-width">السقف والقاع بعرض كامل (فوق الجوانب)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
