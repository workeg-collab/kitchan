import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CABINET_LIBRARY, CabinetTemplate } from '../../constants/cabinetLibrary';
import { APPLIANCE_LIBRARY, ApplianceTemplate } from '../../constants/applianceLibrary';
import { ARCHITECTURAL_LIBRARY, ArchitecturalTemplate } from '../../constants/archLibrary';
import { FRONT_FINISHES, COUNTERTOP_MATERIALS, CARCASS_FINISHES, FLOOR_MATERIALS, WALL_COLORS, HANDLE_OPTIONS } from '../../constants/materialCatalog';
import { formatDimension } from '../../utils/unitConversion';
import { TRANSLATIONS } from '../../utils/i18n';
import { 
  Box, 
  Tv, 
  DoorClosed, 
  Palette, 
  Plus, 
  Sliders, 
  Search, 
  Layers, 
  AppWindow, 
  Maximize2 
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { project, addCabinet, addAppliance, addElement, updateMaterials } = useProjectStore();
  const { unit, setIsCustomCabinetModalOpen, language } = useUIStore();
  const t = TRANSLATIONS[language];

  const [activeCatalogTab, setActiveCatalogTab] = useState<'cabinets' | 'appliances' | 'architecture' | 'finishes'>('cabinets');
  const [cabinetCategory, setCabinetCategory] = useState<'all' | 'base' | 'wall' | 'tall' | 'corner'>('all');
  const [applianceCategory, setApplianceCategory] = useState<'all' | 'cooling' | 'cooking' | 'cleaning' | 'ventilation' | 'sinks'>('all');
  const [archCategory, setArchCategory] = useState<'all' | 'doors' | 'windows' | 'structural'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle adding cabinet
  const handleAddCabinet = (template: CabinetTemplate, widthOverride?: number) => {
    const W = widthOverride || template.defaultWidth;
    const D = template.defaultDepth;
    const H = template.defaultHeight;
    const Z = template.defaultZ;

    const xPos = Math.min(Math.max(100, (project.cabinets.length * 600) % (project.room.width - 700)), project.room.width - W);

    addCabinet({
      name: template.name,
      category: template.category,
      type: template.type,
      width: W,
      height: H,
      depth: D,
      x: xPos,
      y: 0,
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
  const handleAddArchElement = (template: ArchitecturalTemplate) => {
    addElement({
      name: language === 'ar' ? template.nameAr : template.name,
      type: template.type,
      width: template.defaultWidth,
      height: template.defaultHeight,
      depth: template.defaultDepth,
      x: template.type === 'door' ? 500 : 1500,
      y: template.type === 'door' ? project.room.length : 0,
      z: template.defaultZ,
      rotation: template.type === 'door' ? 180 : 0,
      wallId: template.type === 'door' ? 'wall-c' : 'wall-a',
      openingDirection: template.openingDirection,
    });
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

  // Filtered Architectural Elements
  const filteredArch = ARCHITECTURAL_LIBRARY.filter((el) => {
    const matchesCat = archCategory === 'all' || el.category === archCategory;
    const matchesSearch =
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none z-20 shadow-sm">
      {/* Top Sidebar Category Navigation */}
      <div className="grid grid-cols-4 p-2 bg-slate-50 border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveCatalogTab('cabinets')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-bold transition ${
            activeCatalogTab === 'cabinets' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Box size={16} className="mb-0.5" />
          <span>{t.cabinets}</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('appliances')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-bold transition ${
            activeCatalogTab === 'appliances' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tv size={16} className="mb-0.5" />
          <span>{t.appliances}</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('architecture')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-bold transition ${
            activeCatalogTab === 'architecture' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DoorClosed size={16} className="mb-0.5" />
          <span>{t.obstacles}</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('finishes')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-bold transition ${
            activeCatalogTab === 'finishes' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette size={16} className="mb-0.5" />
          <span>{t.finishes}</span>
        </button>
      </div>

      {/* --- CABINETS TAB --- */}
      {activeCatalogTab === 'cabinets' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Subcategory Filter */}
          <div className="p-3 border-b border-slate-100 flex items-center gap-1 overflow-x-auto bg-slate-50/50">
            {(['all', 'base', 'wall', 'tall', 'corner'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCabinetCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize whitespace-nowrap transition ${
                  cabinetCategory === cat ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? t.all : cat === 'base' ? t.base : cat === 'wall' ? t.wall_cat : cat === 'tall' ? t.tall : t.corner}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="px-3 pt-2 pb-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث في الوحدات...' : 'Search modules...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Custom Cabinet Creator Banner */}
          <div className="px-3 py-2">
            <button
              onClick={() => setIsCustomCabinetModalOpen(true)}
              className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-400 transition group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-blue-600 group-hover:rotate-45 transition" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">{t.customBox}</div>
                  <div className="text-[10px] text-slate-500">{language === 'ar' ? 'تحديد العرض والارتفاع بدقة' : 'Custom W x H x D dimensions'}</div>
                </div>
              </div>
              <Plus size={16} className="text-blue-600" />
            </button>
          </div>

          {/* Cabinet Modules List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-2.5">
            {filteredCabinets.map((template, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{template.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{template.description}</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-blue-600 rounded font-bold">
                    {template.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 mt-2 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  <span>W:{formatDimension(template.defaultWidth, unit)}</span>
                  <span>H:{formatDimension(template.defaultHeight, unit)}</span>
                  <span>D:{formatDimension(template.defaultDepth, unit)}</span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {template.standardWidths.map((sw) => (
                      <button
                        key={sw}
                        onClick={() => handleAddCabinet(template, sw)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded text-[10px] font-mono transition"
                      >
                        {formatDimension(sw, unit, false)}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddCabinet(template)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition ml-2 shadow-sm"
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
          <div className="p-3 border-b border-slate-100 flex items-center gap-1 overflow-x-auto bg-slate-50/50">
            {(['all', 'cooling', 'cooking', 'cleaning', 'ventilation', 'sinks'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setApplianceCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize whitespace-nowrap transition ${
                  applianceCategory === cat ? 'bg-white text-amber-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? t.all : cat === 'cooling' ? t.cooling : cat === 'cooking' ? t.cooking : cat === 'cleaning' ? t.cleaning : cat === 'ventilation' ? t.ventilation : t.sinks}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
            {filteredAppliances.map((template, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-3 hover:border-amber-400 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{template.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{template.description}</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-bold">
                    {template.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 mt-2 bg-slate-50 px-2 py-1 rounded border border-slate-100">
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
                        className="px-2 py-0.5 bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 rounded text-[10px] font-mono transition"
                      >
                        {formatDimension(sw, unit, false)}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddAppliance(template)}
                    className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shadow-sm"
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

      {/* --- DOORS, WINDOWS & ARCHITECTURE TAB --- */}
      {activeCatalogTab === 'architecture' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Subcategory Filter */}
          <div className="p-3 border-b border-slate-100 flex items-center gap-1 overflow-x-auto bg-slate-50/50">
            {(['all', 'doors', 'windows', 'structural'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setArchCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize whitespace-nowrap transition ${
                  archCategory === cat ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? t.all : cat === 'doors' ? (language === 'ar' ? 'الأبواب' : 'Doors') : cat === 'windows' ? (language === 'ar' ? 'النوافذ' : 'Windows') : (language === 'ar' ? 'أعمدة ومواسير' : 'Structural')}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredArch.map((template, idx) => (
              <div
                key={idx}
                onClick={() => handleAddArchElement(template)}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">
                    {language === 'ar' ? template.nameAr : template.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {formatDimension(template.defaultWidth, unit)} × {formatDimension(template.defaultHeight, unit)}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Plus size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- FINISHES & MATERIALS TAB --- */}
      {activeCatalogTab === 'finishes' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              {language === 'ar' ? 'واجهات الأبواب' : 'Cabinet Fronts'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {FRONT_FINISHES.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => updateMaterials({ frontFinish: mat.name, frontColor: mat.color })}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                    project.materials.frontFinish === mat.name ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: mat.color }} />
                  <span className="text-[11px] font-semibold text-slate-800 truncate">{mat.name.split(' ')[0]} {mat.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              {language === 'ar' ? 'أسطح العمل (رخام / كوارتز)' : 'Countertop Material'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {COUNTERTOP_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => updateMaterials({ countertopMaterial: mat.name, countertopColor: mat.color })}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                    project.materials.countertopMaterial === mat.name ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: mat.color }} />
                  <span className="text-[11px] font-semibold text-slate-800 truncate">{mat.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              {language === 'ar' ? 'المقابض' : 'Cabinet Handles'}
            </h4>
            <div className="space-y-1.5">
              {HANDLE_OPTIONS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => updateMaterials({ handleStyle: h.id as any, handleColor: h.color })}
                  className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition ${
                    project.materials.handleStyle === h.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-800">{h.name}</span>
                  <div className="w-4 h-4 rounded-sm border border-slate-300" style={{ backgroundColor: h.color }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
