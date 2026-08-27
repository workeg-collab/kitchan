import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CabinetCategory, CabinetType, DoorHinge } from '../../types';
import { convertMmToUnit, convertUnitToMm } from '../../utils/unitConversion';
import { X, Sliders, Check, Plus } from 'lucide-react';

export const CustomCabinetModal: React.FC = () => {
  const { addCabinet, project } = useProjectStore();
  const { isCustomCabinetModalOpen, setIsCustomCabinetModalOpen, unit } = useUIStore();

  const [name, setName] = useState('Custom Unit');
  const [category, setCategory] = useState<CabinetCategory>('base');
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(720);
  const [depth, setDepth] = useState(560);
  const [z, setZ] = useState(100);
  const [shelfCount, setShelfCount] = useState(1);
  const [doorCount, setDoorCount] = useState(1);
  const [drawerCount, setDrawerCount] = useState(0);
  const [doorHinge, setDoorHinge] = useState<DoorHinge>('right');
  const [customNotes, setCustomNotes] = useState('');

  if (!isCustomCabinetModalOpen) return null;

  const handleCategoryChange = (cat: CabinetCategory) => {
    setCategory(cat);
    if (cat === 'wall') {
      setHeight(720);
      setDepth(350);
      setZ(1450);
      setShelfCount(2);
    } else if (cat === 'tall') {
      setHeight(2050);
      setDepth(580);
      setZ(100);
      setShelfCount(4);
      setDoorCount(2);
    } else {
      setHeight(720);
      setDepth(560);
      setZ(100);
    }
  };

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
      shelfCount,
      doorCount,
      drawerCount,
      doorHinge,
      customNotes,
      materialFront: project.materials.frontFinish,
      materialBody: project.materials.bodyColor,
      handleType: project.materials.handleStyle,
      isCustom: true,
    });
    setIsCustomCabinetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Custom Cabinet Builder</h2>
              <p className="text-xs text-slate-400">Build bespoke cabinet with custom manufacturing dimensions</p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomCabinetModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Cabinet Name & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Cabinet Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as CabinetCategory)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="base">Base Unit</option>
                <option value="wall">Wall Unit (Upper)</option>
                <option value="tall">Tall Unit (Pantry/Tower)</option>
                <option value="custom">Bespoke Custom</option>
              </select>
            </div>
          </div>

          {/* Exact Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Width ({unit})</label>
              <input
                type="number"
                value={convertMmToUnit(width, unit)}
                onChange={(e) => setWidth(convertUnitToMm(Number(e.target.value), unit))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Height ({unit})</label>
              <input
                type="number"
                value={convertMmToUnit(height, unit)}
                onChange={(e) => setHeight(convertUnitToMm(Number(e.target.value), unit))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Depth ({unit})</label>
              <input
                type="number"
                value={convertMmToUnit(depth, unit)}
                onChange={(e) => setDepth(convertUnitToMm(Number(e.target.value), unit))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Internals */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Shelves</label>
              <input
                type="number"
                min={0}
                max={10}
                value={shelfCount}
                onChange={(e) => setShelfCount(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Doors</label>
              <input
                type="number"
                min={0}
                max={4}
                value={doorCount}
                onChange={(e) => setDoorCount(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Drawers</label>
              <input
                type="number"
                min={0}
                max={6}
                value={drawerCount}
                onChange={(e) => setDrawerCount(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Custom Notes</label>
            <input
              type="text"
              placeholder="e.g. Cutout for gas valve or custom divider"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950">
          <button
            onClick={() => setIsCustomCabinetModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition"
          >
            <Plus size={15} />
            <span>Create Cabinet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
