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
  Settings 
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
    updateCountertop,
    updatePlinth,
    updateManufacturing,
  } = useProjectStore();

  const { unit, language } = useUIStore();
  const t = TRANSLATIONS[language];
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, manufacturing } = project;

  const selectedCabinet = selectedType === 'cabinet' ? cabinets.find((c) => c.id === selectedId) : null;
  const selectedAppliance = selectedType === 'appliance' ? appliances.find((a) => a.id === selectedId) : null;
  const selectedElement = selectedType === 'element' ? architecturalElements.find((e) => e.id === selectedId) : null;

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none z-20 overflow-y-auto shadow-sm">
      {/* --- SELECTED CABINET INSPECTOR --- */}
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
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.posY}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.y, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { y: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.posZ}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.z, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { z: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-mono">{t.rotationAngle}</label>
              <select
                value={selectedCabinet.rotation}
                onChange={(e) => updateCabinet(selectedCabinet.id, { rotation: Number(e.target.value) })}
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value={0}>0° ({t.wallA})</option>
                <option value={90}>90° ({t.wallB})</option>
                <option value={180}>180° ({t.wallC})</option>
                <option value={270}>270° ({t.wallD})</option>
              </select>
            </div>
          </div>

          {/* Internal Structure */}
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
                  max={8}
                  value={selectedCabinet.shelfCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { shelfCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.doors}</label>
                <input
                  type="number"
                  min={0}
                  max={2}
                  value={selectedCabinet.doorCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { doorCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.drawers}</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={selectedCabinet.drawerCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { drawerCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {selectedCabinet.doorCount === 1 && (
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.hingeSide}</label>
                <select
                  value={selectedCabinet.doorHinge}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { doorHinge: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value="left">{t.hingeLeft}</option>
                  <option value="right">{t.hingeRight}</option>
                  <option value="top">{t.hingeTop}</option>
                </select>
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

      {/* --- SELECTED APPLIANCE / ELEMENT INSPECTORS --- */}
      {selectedAppliance && (
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                {selectedAppliance.id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedAppliance.name}</h3>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

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

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">{t.dimensionsLabel} ({unit})</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.width}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.width, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.height}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.height, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.depth}</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.depth, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { depth: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DEFAULT GLOBAL SETTINGS PANEL --- */}
      {!selectedCabinet && !selectedAppliance && !selectedElement && (
        <div className="p-4 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings size={16} className="text-blue-600" />
              {t.roomSetup}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{language === 'ar' ? 'الأبعاد المعمارية للغرفة' : 'Global architectural parameters'}</p>
          </div>

          {/* Room Dimensions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              {language === 'ar' ? 'أبعاد الغرفة' : 'Room Dimensions'} ({unit})
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
                <label className="text-[10px] text-slate-500 font-mono">{language === 'ar' ? 'ارتفاع السقف' : 'Ceiling (Z)'}</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.ceilingHeight, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, room.length, convertUnitToMm(Number(e.target.value), unit), room.wallThickness)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{language === 'ar' ? 'سماكة الجدار' : 'Wall Thickness'}</label>
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
              {language === 'ar' ? 'معايير التصنيع' : 'Manufacturing Defaults'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{t.boardThickness}</label>
                <select
                  value={manufacturing.boardThickness}
                  onChange={(e) => updateManufacturing({ boardThickness: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                >
                  <option value={16}>16 mm</option>
                  <option value={18}>18 mm (Std)</option>
                  <option value={19}>19 mm</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono">{language === 'ar' ? 'فراغ الخلوص' : 'Reveal Gap'}</label>
                <input
                  type="number"
                  value={manufacturing.doorReveal}
                  onChange={(e) => updateManufacturing({ doorReveal: Number(e.target.value) })}
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
