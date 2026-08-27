import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension, convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { 
  Sliders, 
  RotateCw, 
  Copy, 
  Trash2, 
  X, 
  Maximize, 
  Layers, 
  Wrench, 
  Settings, 
  Box, 
  Tv, 
  DoorClosed,
  ChevronDown
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
    updateBacksplash,
    updateManufacturing,
  } = useProjectStore();

  const { unit } = useUIStore();
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, manufacturing } = project;

  const selectedCabinet = selectedType === 'cabinet' ? cabinets.find((c) => c.id === selectedId) : null;
  const selectedAppliance = selectedType === 'appliance' ? appliances.find((a) => a.id === selectedId) : null;
  const selectedElement = selectedType === 'element' ? architecturalElements.find((e) => e.id === selectedId) : null;

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none z-20 overflow-y-auto">
      {/* --- SELECTED CABINET INSPECTOR --- */}
      {selectedCabinet && (
        <div className="p-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800">
                {selectedCabinet.id}
              </span>
              <h3 className="text-sm font-bold text-white mt-1">{selectedCabinet.name}</h3>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Action Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => rotateCabinet(selectedCabinet.id, 90)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition"
            >
              <RotateCw size={14} />
              <span>Rotate 90°</span>
            </button>
            <button
              onClick={() => duplicateCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition"
            >
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button
              onClick={() => removeCabinet(selectedCabinet.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs font-semibold border border-red-800/40 transition"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>

          {/* Dimensions (W x H x D) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize size={14} className="text-blue-400" />
              Dimensions ({unit})
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Width</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.width, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono">Height</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.height, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono">Depth</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.depth, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { depth: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Position Coordinates (X, Y, Elevation Z) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} className="text-emerald-400" />
              Position & Elevation ({unit})
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">X (Left)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.x, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { x: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono">Y (Depth)</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.y, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { y: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono">Elevation Z</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedCabinet.z, unit)}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { z: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-mono">Rotation Angle</label>
              <select
                value={selectedCabinet.rotation}
                onChange={(e) => updateCabinet(selectedCabinet.id, { rotation: Number(e.target.value) })}
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value={0}>0° (Facing Forward / Wall A)</option>
                <option value={90}>90° (Facing Left / Wall B)</option>
                <option value={180}>180° (Facing Backward / Wall C)</option>
                <option value={270}>270° (Facing Right / Wall D)</option>
              </select>
            </div>
          </div>

          {/* Internal Structure */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-purple-400" />
              Cabinet Internals
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Shelves</label>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={selectedCabinet.shelfCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { shelfCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono">Doors</label>
                <input
                  type="number"
                  min={0}
                  max={2}
                  value={selectedCabinet.doorCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { doorCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono">Drawers</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={selectedCabinet.drawerCount}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { drawerCount: Math.max(0, Number(e.target.value)) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {selectedCabinet.doorCount === 1 && (
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Door Hinge Side</label>
                <select
                  value={selectedCabinet.doorHinge}
                  onChange={(e) => updateCabinet(selectedCabinet.id, { doorHinge: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="left">Left Hinged</option>
                  <option value="right">Right Hinged</option>
                  <option value="top">Top Lift-Up</option>
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono">Workshop & Hardware Notes</label>
            <textarea
              rows={2}
              value={selectedCabinet.customNotes || ''}
              onChange={(e) => updateCabinet(selectedCabinet.id, { customNotes: e.target.value })}
              placeholder="e.g. Blum Legrabox soft-close slides..."
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* --- SELECTED APPLIANCE INSPECTOR --- */}
      {selectedAppliance && (
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800">
                {selectedAppliance.id}
              </span>
              <h3 className="text-sm font-bold text-white mt-1">{selectedAppliance.name}</h3>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => rotateAppliance(selectedAppliance.id, 90)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition"
            >
              <RotateCw size={14} />
              <span>Rotate 90°</span>
            </button>
            <button
              onClick={() => duplicateAppliance(selectedAppliance.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition"
            >
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button
              onClick={() => removeAppliance(selectedAppliance.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs font-semibold border border-red-800/40 transition"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dimensions ({unit})</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Width</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.width, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { width: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Height</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.height, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Depth</label>
                <input
                  type="number"
                  value={convertMmToUnit(selectedAppliance.depth, unit)}
                  onChange={(e) => updateAppliance(selectedAppliance.id, { depth: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DEFAULT GLOBAL SETTINGS PANEL (When nothing is selected) --- */}
      {!selectedCabinet && !selectedAppliance && !selectedElement && (
        <div className="p-4 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings size={16} className="text-blue-400" />
              Room & Kitchen Setup
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Global architectural parameters</p>
          </div>

          {/* Room Dimensions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Room Dimensions ({unit})</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Room Width (X)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.width, unit)}
                  onChange={(e) => updateRoomDimensions(convertUnitToMm(Number(e.target.value), unit), room.length, room.ceilingHeight, room.wallThickness)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Room Length (Y)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.length, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, convertUnitToMm(Number(e.target.value), unit), room.ceilingHeight, room.wallThickness)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Ceiling Height (Z)</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.ceilingHeight, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, room.length, convertUnitToMm(Number(e.target.value), unit), room.wallThickness)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Wall Thickness</label>
                <input
                  type="number"
                  value={convertMmToUnit(room.wallThickness, unit)}
                  onChange={(e) => updateRoomDimensions(room.width, room.length, room.ceilingHeight, convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Countertop & Plinth Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Countertop & Plinth ({unit})</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Top Thickness</label>
                <input
                  type="number"
                  value={convertMmToUnit(countertop.thickness, unit)}
                  onChange={(e) => updateCountertop({ thickness: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Top Overhang</label>
                <input
                  type="number"
                  value={convertMmToUnit(countertop.overhangFront, unit)}
                  onChange={(e) => updateCountertop({ overhangFront: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Plinth Height</label>
                <input
                  type="number"
                  value={convertMmToUnit(plinth.height, unit)}
                  onChange={(e) => updatePlinth({ height: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Plinth Setback</label>
                <input
                  type="number"
                  value={convertMmToUnit(plinth.setback, unit)}
                  onChange={(e) => updatePlinth({ setback: convertUnitToMm(Number(e.target.value), unit) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Manufacturing Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Manufacturing Defaults</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Board Thickness</label>
                <select
                  value={manufacturing.boardThickness}
                  onChange={(e) => updateManufacturing({ boardThickness: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                >
                  <option value={16}>16 mm</option>
                  <option value={18}>18 mm (Std)</option>
                  <option value={19}>19 mm</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono">Door Reveal Gap</label>
                <input
                  type="number"
                  value={manufacturing.doorReveal}
                  onChange={(e) => updateManufacturing({ doorReveal: Number(e.target.value) })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
