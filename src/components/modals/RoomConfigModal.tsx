import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension, convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { X, Maximize, Check, Square, LayoutTemplate } from 'lucide-react';

export const RoomConfigModal: React.FC = () => {
  const { project, updateRoomDimensions, updateRoom } = useProjectStore();
  const { isRoomModalOpen, setIsRoomModalOpen, unit } = useUIStore();

  const [width, setWidth] = useState(project.room.width);
  const [length, setLength] = useState(project.room.length);
  const [height, setHeight] = useState(project.room.ceilingHeight);
  const [thickness, setThickness] = useState(project.room.wallThickness);

  if (!isRoomModalOpen) return null;

  const handleApply = () => {
    updateRoomDimensions(width, length, height, thickness);
    setIsRoomModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <Maximize size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Kitchen Room Setup</h2>
              <p className="text-xs text-slate-400">Define real-world room boundaries and architectural dimensions</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoomModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Dimensional Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Room Width (X Axis)</label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  value={convertMmToUnit(width, unit)}
                  onChange={(e) => setWidth(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 uppercase">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Room Length (Y Axis)</label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  value={convertMmToUnit(length, unit)}
                  onChange={(e) => setLength(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 uppercase">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Ceiling Height (Z Axis)</label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  value={convertMmToUnit(height, unit)}
                  onChange={(e) => setHeight(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 uppercase">{unit}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Wall Thickness</label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  value={convertMmToUnit(thickness, unit)}
                  onChange={(e) => setThickness(convertUnitToMm(Number(e.target.value), unit))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 uppercase">{unit}</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Standard Kitchen Sizes</span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={() => { setWidth(3200); setLength(2600); }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
              >
                <div className="text-xs font-bold text-white">Compact Studio</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">3.2m x 2.6m</div>
              </button>

              <button
                type="button"
                onClick={() => { setWidth(4200); setLength(3600); }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
              >
                <div className="text-xs font-bold text-white">Medium L-Shape</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">4.2m x 3.6m</div>
              </button>

              <button
                type="button"
                onClick={() => { setWidth(5400); setLength(4200); }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
              >
                <div className="text-xs font-bold text-white">Luxury Island / U</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">5.4m x 4.2m</div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950">
          <button
            onClick={() => setIsRoomModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition"
          >
            <Check size={15} />
            <span>Apply Dimensions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
