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
  Sparkles,
  DoorClosed,
  AppWindow,
  Info
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
    updateManufacturing,
  } = useProjectStore();

  const { unit, language } = useUIStore();
  const t = TRANSLATIONS[language];
  const { room, cabinets, appliances, architecturalElements, manufacturing } = project;

  const selectedCabinet = selectedType === 'cabinet' ? cabinets.find((c) => c.id === selectedId) : null;
  const selectedAppliance = selectedType === 'appliance' ? appliances.find((a) => a.id === selectedId) : null;
  const selectedElement = selectedType === 'element' ? architecturalElements.find((e) => e.id === selectedId) : null;

  // Soft Validation Warnings (Non-blocking)
  const cabinetWarnings: string[] = [];
  if (selectedCabinet) {
    if (selectedCabinet.category === 'base' && (selectedCabinet.depth < 400 || selectedCabinet.depth > 750)) {
      cabinetWarnings.push(`عمق الكابينة السفلية (${selectedCabinet.depth} مم) يختلف عن النطاق الشائع (500 - 650 مم).`);
    }
    if (selectedCabinet.category === 'wall' && selectedCabinet.depth > 400) {
      cabinetWarnings.push(`عمق الكابينة العلوية (${selectedCabinet.depth} مم) كبير وقد يعيق حركة الرأس فوق أسطح العمل.`);
    }
    if (selectedCabinet.width > 900 && (!selectedCabinet.verticalDividersCount || selectedCabinet.verticalDividersCount === 0) && (selectedCabinet.shelfCount > 0 || selectedCabinet.category === 'library-full')) {
      cabinetWarnings.push(`عرض الرف (${selectedCabinet.width} مم) كبير — يُنصح بإضافة قاطع رأسي أو زيادة سماكة الخشب لتجنب التقوس.`);
    }
    if (selectedCabinet.height < 300) {
      cabinetWarnings.push(`ارتفاع الوحدة (${selectedCabinet.height} مم) قليل جداً.`);
    }
  }

  const elementWarnings: string[] = [];
  if (selectedElement) {
    if (selectedElement.type === 'door' && selectedElement.height < 1900) {
      elementWarnings.push(`ارتفاع الباب (${selectedElement.height} مم) أقل من الارتفاع القياسي للمرور (2000 - 2200 مم).`);
    }
    if (selectedElement.type === 'door' && selectedElement.width < 600) {
      elementWarnings.push(`عرض فتحة الباب (${selectedElement.width} مم) ضيق جداً للمرور المريح.`);
    }
    if (selectedElement.type === 'window' && selectedElement.z < 500) {
      elementWarnings.push(`جلسة النافذة (${selectedElement.z} مم) منخفضة جداً بالنسبة للأرضية.`);
    }
  }

  return (
    <aside className="w-84 bg-white border-l border-slate-200 flex flex-col h-full select-none z-20 overflow-y-auto shadow-sm font-sans">
      {/* ========================================================================= */}
      {/* 1. CABINET / FURNITURE ITEM INSPECTOR                                      */}
      {/* ========================================================================= */}
      {selectedCabinet && (
        <div className="p-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200">
                {selectedCabinet.id}
              </span>
              <input
                type="text"
                value={selectedCabinet.name}
                onChange={(e) => updateCabinet(selectedCabinet.id, { name: e.target.value })}
                className="text-xs font-bold text-slate-900 mt-1 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 w-full"
                title="انقر لتعديل اسم الوحدة"
              />
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Soft Warning Alerts */}
          {cabinetWarnings.map((warn, idx) => (
            <div key={idx} className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">ملاحظة هندسية:</strong>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">{warn}</p>
              </div>
            </div>
          ))}

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

          {/* Fully Custom Dimensions (W x H x D) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Maximize size={14} className="text-blue-600" />
                المقاسات المخصصة ({unit})
              </h4>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">Custom Editable</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.width} (W)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedCabinet.width, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { width: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.height} (H)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedCabinet.height, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { height: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.depth} (D)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedCabinet.depth, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { depth: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick Preset Dimension Chips */}
            <div>
              <div className="text-[10px] text-slate-400 font-mono mb-1">مقاسات سريعة مقترحة (Preset Chips):</div>
              <div className="flex items-center gap-1 flex-wrap">
                {[300, 450, 600, 800, 900, 1000, 1200].map((sw) => (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => updateCabinet(selectedCabinet.id, { width: sw })}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded border transition ${
                      selectedCabinet.width === sw
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {formatDimension(sw, unit, false)}
                  </button>
                ))}
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
                <option value={0}>0° (الجدار أ - الخلفي)</option>
                <option value={90}>90° (الجدار ب - الأيمن)</option>
                <option value={180}>180° (الجدار ج - الأمامي)</option>
                <option value={270}>270° (الجدار د - الأيسر)</option>
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

            {/* Vertical Dividers for Libraries & Wardrobes */}
            <div>
              <label className="text-[10px] text-slate-500 font-mono">عدد القواطع الرأسية (Vertical Dividers)</label>
              <input
                type="number"
                min={0}
                max={6}
                value={selectedCabinet.verticalDividersCount || 0}
                onChange={(e) => updateCabinet(selectedCabinet.id, { verticalDividersCount: Math.max(0, Number(e.target.value)) })}
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. APPLIANCE & SCREEN CUSTOM DIMENSION INSPECTOR                          */}
      {/* ========================================================================= */}
      {selectedAppliance && (
        <div className="p-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                {selectedAppliance.id}
              </span>
              <input
                type="text"
                value={selectedAppliance.name}
                onChange={(e) => updateAppliance(selectedAppliance.id, { name: e.target.value })}
                className="text-xs font-bold text-slate-900 mt-1 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent focus:border-amber-500 rounded px-1 w-full"
              />
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Action Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => rotateAppliance(selectedAppliance.id, 90)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <RotateCw size={14} className="text-amber-600" />
              <span>{t.rotate}</span>
            </button>
            <button
              onClick={() => duplicateAppliance(selectedAppliance.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <Copy size={14} className="text-indigo-600" />
              <span>{t.duplicate}</span>
            </button>
            <button
              onClick={() => removeAppliance(selectedAppliance.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold border border-red-200 transition"
            >
              <Trash2 size={14} />
              <span>{t.delete}</span>
            </button>
          </div>

          {/* Custom Dimensions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Maximize size={14} className="text-amber-600" />
              أبعاد الجهاز المخصصة ({unit})
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">العرض (W)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedAppliance.width, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { width: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">الارتفاع (H)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedAppliance.height, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { height: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">العمق (D)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedAppliance.depth, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { depth: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Position and Elevation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sliders size={14} className="text-emerald-600" />
              الموقع والارتفاع ({unit})
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">X</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.x, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { x: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">Y</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.y, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { y: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">Z (الارتفاع)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.z, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { z: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ARCHITECTURAL DOORS & WINDOWS CUSTOM DIMENSION INSPECTOR                */}
      {/* ========================================================================= */}
      {selectedElement && (
        <div className="p-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                {selectedElement.type === 'door' ? <DoorClosed size={16} /> : <AppWindow size={16} />}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedElement.id}
                </span>
                <input
                  type="text"
                  value={selectedElement.name}
                  onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                  className="text-xs font-bold text-slate-900 mt-0.5 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent focus:border-emerald-500 rounded px-1 w-full"
                />
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Soft Warning Alerts */}
          {elementWarnings.map((warn, idx) => (
            <div key={idx} className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">ملاحظة معمارية:</strong>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">{warn}</p>
              </div>
            </div>
          ))}

          {/* Quick Action Bar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateElement(selectedElement.id, { rotation: (selectedElement.rotation + 90) % 360 })}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <RotateCw size={14} className="text-emerald-600" />
              <span>{t.rotate}</span>
            </button>
            <button
              onClick={() => removeElement(selectedElement.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold border border-red-200 transition"
            >
              <Trash2 size={14} />
              <span>{t.delete}</span>
            </button>
          </div>

          {/* Custom Dimensions (Width, Height, Depth / Frame Thickness) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Maximize size={14} className="text-emerald-600" />
              الأبعاد المعمارية الصافية ({unit})
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">العرض (W)</label>
                <input
                  type="number"
                  min={100}
                  value={convertMmToUnit(selectedElement.width, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { width: Math.max(100, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">الارتفاع (H)</label>
                <input
                  type="number"
                  min={100}
                  value={convertMmToUnit(selectedElement.height, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { height: Math.max(100, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">سماكة الحلق (D)</label>
                <input
                  type="number"
                  min={50}
                  value={convertMmToUnit(selectedElement.depth, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { depth: Math.max(50, convertUnitToMm(Number(e.target.value), unit)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Position on Wall and Sill Height Z */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">الموقع X</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedElement.x, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { x: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">الموقع Y</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedElement.y, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { y: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">ارتفاع الجلسة Z</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedElement.z, unit)}
                  onChange={(e) => updateElement(selectedElement.id, { z: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Opening Direction for Doors */}
            {selectedElement.type === 'door' && (
              <div>
                <label className="text-[10px] text-slate-500 font-mono">اتجاه فتح الباب</label>
                <select
                  value={selectedElement.openingDirection || 'inward-left'}
                  onChange={(e) => updateElement(selectedElement.id, { openingDirection: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                >
                  <option value="inward-left">فتح للداخل - يسار</option>
                  <option value="inward-right">فتح للداخل - يمين</option>
                  <option value="outward-left">فتح للخارج - يسار</option>
                  <option value="outward-right">فتح للخارج - يمين</option>
                  <option value="sliding">باب جرار سحاب (Sliding)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GLOBAL ROOM & MANUFACTURING SETTINGS (When nothing is selected)        */}
      {/* ========================================================================= */}
      {!selectedCabinet && !selectedAppliance && !selectedElement && (
        <div className="p-4 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings size={16} className="text-blue-600" />
              {t.roomSetup}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              الأبعاد المعمارية الصافية للغرفة وقواعد التصنيع
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
        </div>
      )}
    </aside>
  );
};
