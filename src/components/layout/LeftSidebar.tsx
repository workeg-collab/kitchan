import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CABINET_LIBRARY, CabinetTemplate } from '../../constants/cabinetLibrary';
import { APPLIANCE_LIBRARY, ApplianceTemplate } from '../../constants/applianceLibrary';
import { FRONT_FINISHES, COUNTERTOP_MATERIALS, CARCASS_FINISHES, FLOOR_MATERIALS, WALL_COLORS, HANDLE_OPTIONS } from '../../constants/materialCatalog';
import { formatDimension } from '../../utils/unitConversion';
import { 
  Box, 
  Tv, 
  DoorClosed, 
  Palette, 
  Plus, 
  Sliders, 
  Search, 
  Layers, 
  Droplets, 
  Flame, 
  Columns2, 
  Rows3, 
  Refrigerator, 
  CornerDownRight, 
  PanelTopOpen, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { project, addCabinet, addAppliance, addElement, updateMaterials } = useProjectStore();
  const { unit, setIsCustomCabinetModalOpen } = useUIStore();

  const [activeCatalogTab, setActiveCatalogTab] = useState<'cabinets' | 'appliances' | 'architecture' | 'finishes'>('cabinets');
  const [cabinetCategory, setCabinetCategory] = useState<'all' | 'base' | 'wall' | 'tall' | 'corner'>('all');
  const [applianceCategory, setApplianceCategory] = useState<'all' | 'cooling' | 'cooking' | 'cleaning' | 'ventilation' | 'sinks'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle adding a cabinet from template
  const handleAddCabinet = (template: CabinetTemplate, widthOverride?: number) => {
    const W = widthOverride || template.defaultWidth;
    const D = template.defaultDepth;
    const H = template.defaultHeight;
    const Z = template.defaultZ;

    // Position in available spot or room center
    const xPos = Math.min(Math.max(100, (project.cabinets.length * 600) % (project.room.width - 700)), project.room.width - W);
    const yPos = template.category === 'wall' ? 0 : 0;

    addCabinet({
      name: template.name,
      category: template.category,
      type: template.type,
      width: W,
      height: H,
      depth: D,
      x: xPos,
      y: yPos,
      z: Z,
      rotation: 0,
      wallId: 'wall-a',
      shelfCount: template.shelfCount,
      doorCount: template.doorCount,
      drawerCount: template.drawerCount,
      doorHinge: template.doorHinge,
      hasSinkCutout: template.hasSinkCutout,
      hasApplianceCavity: template.hasApplianceCavity,
      applianceCavityHeight: template.applianceCavityHeight,
      applianceCavityZ: template.applianceCavityZ,
      materialFront: project.materials.frontFinish,
      materialBody: project.materials.bodyColor,
      handleType: project.materials.handleStyle,
    });
  };

  // Handle adding appliance
  const handleAddAppliance = (template: ApplianceTemplate, widthOverride?: number) => {
    const W = widthOverride || template.defaultWidth;
    const D = template.defaultDepth;
    const H = template.defaultHeight;
    const Z = template.defaultZ;

    addAppliance({
      name: template.name,
      type: template.type,
      width: W,
      height: H,
      depth: D,
      x: 1200,
      y: 0,
      z: Z,
      rotation: 0,
      wallId: 'wall-a',
      clearanceSides: template.clearanceSides,
      clearanceBack: template.clearanceBack,
      clearanceTop: template.clearanceTop,
      finish: 'stainless',
    });
  };

  // Handle adding architectural element
  const handleAddElement = (type: 'door' | 'window' | 'column' | 'beam' | 'pipe') => {
    if (type === 'window') {
      addElement({
        name: 'Window',
        type: 'window',
        x: 1500,
        y: 0,
        z: 950,
        width: 1200,
        height: 1100,
        depth: 150,
        rotation: 0,
        wallId: 'wall-a',
      });
    } else if (type === 'door') {
      addElement({
        name: 'Entry Door',
        type: 'door',
        x: 500,
        y: project.room.length,
        z: 0,
        width: 900,
        height: 2100,
        depth: 150,
        rotation: 180,
        wallId: 'wall-c',
        openingDirection: 'inward-left',
      });
    } else if (type === 'column') {
      addElement({
        name: 'Corner Column',
        type: 'column',
        x: 0,
        y: 0,
        z: 0,
        width: 400,
        height: project.room.ceilingHeight,
        depth: 400,
        rotation: 0,
      });
    } else if (type === 'pipe') {
      addElement({
        name: 'Plumbing Riser',
        type: 'pipe',
        x: 2000,
        y: 100,
        z: 0,
        width: 160,
        height: 800,
        depth: 160,
        rotation: 0,
      });
    }
  };

  // Filtered Cabinets
  const filteredCabinets = CABINET_LIBRARY.filter((c) => {
    const matchesCat = cabinetCategory === 'all' || c.category === cabinetCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Appliances
  const filteredAppliances = APPLIANCE_LIBRARY.filter((a) => {
    const matchesCat = applianceCategory === 'all' || a.category === applianceCategory;
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none z-20">
      {/* Top Sidebar Category Nav */}
      <div className="grid grid-cols-4 p-2 bg-slate-950/80 border-b border-slate-800 gap-1">
        <button
          onClick={() => setActiveCatalogTab('cabinets')}
          className={`flex flex-col items-center justify-center py-2 rounded-lg text-[11px] font-semibold transition ${
            activeCatalogTab === 'cabinets' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box size={16} className="mb-0.5" />
          <span>Cabinets</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('appliances')}
          className={`flex flex-col items-center justify-center py-2 rounded-lg text-[11px] font-semibold transition ${
            activeCatalogTab === 'appliances' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv size={16} className="mb-0.5" />
          <span>Appliances</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('architecture')}
          className={`flex flex-col items-center justify-center py-2 rounded-lg text-[11px] font-semibold transition ${
            activeCatalogTab === 'architecture' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DoorClosed size={16} className="mb-0.5" />
          <span>Obstacles</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('finishes')}
          className={`flex flex-col items-center justify-center py-2 rounded-lg text-[11px] font-semibold transition ${
            activeCatalogTab === 'finishes' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette size={16} className="mb-0.5" />
          <span>Finishes</span>
        </button>
      </div>

      {/* --- CABINETS TAB --- */}
      {activeCatalogTab === 'cabinets' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Subcategory Pills */}
          <div className="p-3 border-b border-slate-800 flex items-center gap-1 overflow-x-auto">
            {(['all', 'base', 'wall', 'tall', 'corner'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCabinetCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize whitespace-nowrap transition ${
                  cabinetCategory === cat ? 'bg-slate-800 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="px-3 pt-2 pb-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Custom Cabinet Creator Banner */}
          <div className="px-3 py-2">
            <button
              onClick={() => setIsCustomCabinetModalOpen(true)}
              className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/40 rounded-xl hover:border-blue-400 transition group"
            >
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-blue-400 group-hover:rotate-45 transition" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Custom Box Builder</div>
                  <div className="text-[10px] text-slate-400">Custom W x H x D dimensions</div>
                </div>
              </div>
              <Plus size={16} className="text-blue-400" />
            </button>
          </div>

          {/* Cabinet Modules List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-2.5">
            {filteredCabinets.map((template, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{template.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{template.description}</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-800 rounded text-blue-400">
                    {template.category}
                  </span>
                </div>

                {/* Default Dimensions Pill */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-2 bg-slate-900 px-2 py-1 rounded">
                  <span>W:{formatDimension(template.defaultWidth, unit)}</span>
                  <span>H:{formatDimension(template.defaultHeight, unit)}</span>
                  <span>D:{formatDimension(template.defaultDepth, unit)}</span>
                </div>

                {/* Standard Width Selector Buttons */}
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {template.standardWidths.map((sw) => (
                      <button
                        key={sw}
                        onClick={() => handleAddCabinet(template, sw)}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 rounded text-[10px] font-mono transition"
                        title={`Add ${sw}mm wide unit`}
                      >
                        {formatDimension(sw, unit, false)}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddCabinet(template)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition ml-2 shadow"
                    title="Add Cabinet"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- APPLIANCES TAB --- */}
      {activeCatalogTab === 'appliances' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Appliance Subcategories */}
          <div className="p-3 border-b border-slate-800 flex items-center gap-1 overflow-x-auto">
            {(['all', 'cooling', 'cooking', 'cleaning', 'ventilation', 'sinks'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setApplianceCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize whitespace-nowrap transition ${
                  applianceCategory === cat ? 'bg-slate-800 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
            {filteredAppliances.map((template, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{template.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{template.description}</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-amber-950 text-amber-400 rounded">
                    {template.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-2 bg-slate-900 px-2 py-1 rounded">
                  <span>W:{formatDimension(template.defaultWidth, unit)}</span>
                  <span>H:{formatDimension(template.defaultHeight, unit)}</span>
                  <span>D:{formatDimension(template.defaultDepth, unit)}</span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {template.standardWidths.map((sw) => (
                      <button
                        key={sw}
                        onClick={() => handleAddAppliance(template, sw)}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-300 rounded text-[10px] font-mono transition"
                      >
                        {formatDimension(sw, unit, false)}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddAppliance(template)}
                    className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shadow"
                    title="Place Appliance"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ARCHITECTURE & OBSTACLES TAB --- */}
      {activeCatalogTab === 'architecture' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="text-xs text-slate-400 mb-2">
            Add doors, windows, columns, beams and pipe risers to ensure accurate clearance:
          </div>

          <div
            onClick={() => handleAddElement('window')}
            className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 cursor-pointer transition flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white">Window (1200 x 1100mm)</div>
              <div className="text-[10px] text-slate-400">950mm sill elevation from floor</div>
            </div>
            <Plus size={16} className="text-blue-400 group-hover:scale-110 transition" />
          </div>

          <div
            onClick={() => handleAddElement('door')}
            className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500 cursor-pointer transition flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white">Door / Terrace (900 x 2100mm)</div>
              <div className="text-[10px] text-slate-400">With 90° architectural swing arc</div>
            </div>
            <Plus size={16} className="text-emerald-400 group-hover:scale-110 transition" />
          </div>

          <div
            onClick={() => handleAddElement('column')}
            className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-purple-500 cursor-pointer transition flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white">Structural Column (400 x 400mm)</div>
              <div className="text-[10px] text-slate-400">Full ceiling height concrete/drywall pillar</div>
            </div>
            <Plus size={16} className="text-purple-400 group-hover:scale-110 transition" />
          </div>

          <div
            onClick={() => handleAddElement('pipe')}
            className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-pink-500 cursor-pointer transition flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white">Plumbing / Gas Pipe (⌀160mm)</div>
              <div className="text-[10px] text-slate-400">Fixed obstacle marker with clearance</div>
            </div>
            <Plus size={16} className="text-pink-400 group-hover:scale-110 transition" />
          </div>
        </div>
      )}

      {/* --- FINISHES & MATERIALS TAB --- */}
      {activeCatalogTab === 'finishes' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Cabinet Fronts */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Cabinet Fronts</h4>
            <div className="grid grid-cols-2 gap-2">
              {FRONT_FINISHES.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => updateMaterials({ frontFinish: mat.name, frontColor: mat.color })}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                    project.materials.frontFinish === mat.name ? 'border-blue-500 bg-blue-950/30' : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: mat.color }} />
                  <span className="text-[11px] text-slate-200 truncate">{mat.name.split(' ')[0]} {mat.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Countertops */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Countertop Material</h4>
            <div className="grid grid-cols-2 gap-2">
              {COUNTERTOP_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => updateMaterials({ countertopMaterial: mat.name, countertopColor: mat.color })}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                    project.materials.countertopMaterial === mat.name ? 'border-blue-500 bg-blue-950/30' : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md border border-slate-700 shadow-sm" style={{ backgroundColor: mat.color }} />
                  <span className="text-[11px] text-slate-200 truncate">{mat.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Handles */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Cabinet Handles</h4>
            <div className="space-y-1.5">
              {HANDLE_OPTIONS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => updateMaterials({ handleStyle: h.id as any, handleColor: h.color })}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition ${
                    project.materials.handleStyle === h.id ? 'border-blue-500 bg-blue-950/30' : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <span className="text-xs text-slate-200">{h.name}</span>
                  <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: h.color }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
