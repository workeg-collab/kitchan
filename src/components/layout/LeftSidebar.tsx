import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CABINET_LIBRARY, CabinetTemplate } from '../../constants/cabinetLibrary';
import { WARDROBE_LIBRARY, WardrobeTemplate } from '../../constants/wardrobeLibrary';
import { BEDROOM_LIBRARY, BedroomTemplate } from '../../constants/bedroomLibrary';
import { LIBRARY_LIBRARY, LibraryTemplate } from '../../constants/libraryUnitLibrary';
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
  Shirt, 
  BedDouble, 
  BookOpen, 
  Sparkles,
  CookingPot
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { project, addCabinet, addAppliance, addElement, updateMaterials } = useProjectStore();
  const { unit, setIsCustomCabinetModalOpen, language } = useUIStore();
  const t = TRANSLATIONS[language];
  const projectType = project.metadata.projectType || 'kitchen';

  const [activeCatalogTab, setActiveCatalogTab] = useState<'main' | 'appliances' | 'architecture' | 'finishes'>('main');
  const [kitchenCat, setKitchenCat] = useState<string>('all');
  const [dressingCat, setDressingCat] = useState<string>('all');
  const [bedroomCat, setBedroomCat] = useState<string>('all');
  const [libraryCat, setLibraryCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle adding item
  const handleAddItem = (template: any, widthOverride?: number) => {
    const W = widthOverride || template.defaultWidth;
    const D = template.defaultDepth;
    const H = template.defaultHeight;
    const Z = template.defaultZ || 0;

    const xPos = Math.min(
      Math.max(100, (project.cabinets.length * 600) % Math.max(1000, project.room.width - 800)),
      project.room.width - W
    );

    addCabinet({
      name: template.name,
      category: template.category,
      type: template.type,
      projectType,
      width: W,
      height: H,
      depth: D,
      x: xPos,
      y: 0,
      z: Z,
      rotation: 0,
      wallId: 'wall-a',
      shelfCount: template.shelfCount || 0,
      doorCount: template.doorCount || 0,
      drawerCount: template.drawerCount || 0,
      doorHinge: template.doorHinge || (template.doorCount === 2 ? 'double' : template.doorCount === 1 ? 'right' : 'none'),
      doorType: template.doorType,
      hasSinkCutout: template.hasSinkCutout,
      hasApplianceCavity: template.hasApplianceCavity,
      applianceCavityHeight: template.applianceCavityHeight,
      applianceCavityZ: template.applianceCavityZ,
      hasHangingRail: template.hasHangingRail,
      hangingRailCount: template.hangingRailCount,
      hasShoeShelves: template.hasShoeShelves,
      hasJewelryDrawer: template.hasJewelryDrawer,
      bedSize: template.bedType,
      mattressWidth: template.mattressWidth,
      mattressLength: template.mattressLength,
      headboardHeight: template.headboardHeight,
      headboardThickness: template.headboardThickness,
      hasHydraulicStorage: template.hasHydraulicStorage,
      hasMirror: template.hasMirror,
      mirrorHeight: template.mirrorHeight,
      hasTvCavity: template.hasTvCavity,
      tvWidth: template.tvWidth,
      tvHeight: template.tvHeight,
      tvDepth: template.tvDepth,
      verticalDividersCount: template.verticalDividersCount,
      hasGlassDoors: template.hasGlassDoors,
      hasIntegratedLed: template.hasIntegratedLed,
      materialFront: project.materials.frontFinish,
      materialBody: project.materials.bodyColor,
      handleType: project.materials.handleStyle,
    });
  };

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

  // Get current active library based on projectType
  let currentLibrary: any[] = CABINET_LIBRARY;
  let mainTabTitle = t.cabinets;
  let mainIcon = <CookingPot size={16} className="mb-0.5" />;

  if (projectType === 'dressing') {
    currentLibrary = WARDROBE_LIBRARY;
    mainTabTitle = 'دواليب ودريسنج';
    mainIcon = <Shirt size={16} className="mb-0.5" />;
  } else if (projectType === 'bedroom') {
    currentLibrary = BEDROOM_LIBRARY;
    mainTabTitle = 'أثاث النوم';
    mainIcon = <BedDouble size={16} className="mb-0.5" />;
  } else if (projectType === 'library') {
    currentLibrary = LIBRARY_LIBRARY;
    mainTabTitle = 'مكتبات وشاشات';
    mainIcon = <BookOpen size={16} className="mb-0.5" />;
  }

  const filteredItems = currentLibrary.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none z-20 shadow-sm">
      {/* Top Sidebar Category Navigation */}
      <div className="grid grid-cols-4 p-2 bg-slate-50 border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveCatalogTab('main')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition ${
            activeCatalogTab === 'main' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {mainIcon}
          <span className="truncate max-w-[65px]">{mainTabTitle}</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('appliances')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition ${
            activeCatalogTab === 'appliances' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tv size={16} className="mb-0.5" />
          <span>{projectType === 'kitchen' ? 'الأجهزة' : 'الشاشات'}</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('architecture')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition ${
            activeCatalogTab === 'architecture' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DoorClosed size={16} className="mb-0.5" />
          <span>أبواب ونوافذ</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('finishes')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition ${
            activeCatalogTab === 'finishes' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette size={16} className="mb-0.5" />
          <span>الخامات</span>
        </button>
      </div>

      {/* --- MAIN MODULE LIBRARY TAB --- */}
      {activeCatalogTab === 'main' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="px-3 pt-3 pb-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder={`بحث في وحدات الـ ${projectType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Custom Unit Builder Banner */}
          <div className="px-3 py-2">
            <button
              onClick={() => setIsCustomCabinetModalOpen(true)}
              className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-400 transition group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-blue-600 group-hover:rotate-45 transition" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">إنشاء وحدة مخصصة (Custom)</div>
                  <div className="text-[10px] text-slate-500">تحديد العرض، الارتفاع، والتقسيم الداخلي</div>
                </div>
              </div>
              <Plus size={16} className="text-blue-600" />
            </button>
          </div>

          {/* Module Modules List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-2.5">
            {filteredItems.map((template, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{template.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{template.description}</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-bold">
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
                    {template.standardWidths?.map((sw: number) => (
                      <button
                        key={sw}
                        onClick={() => handleAddItem(template, sw)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded text-[10px] font-mono transition"
                      >
                        {formatDimension(sw, unit, false)}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddItem(template)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition ml-2 shadow-sm"
                    title="إضافة الوحدة للمخطط"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- APPLIANCES & SCREENS TAB --- */}
      {activeCatalogTab === 'appliances' && (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
          {/* Custom Appliance Builder Banner */}
          <button
            onClick={() => {
              addAppliance({
                name: 'جهاز / شاشة بمقاسات مخصصة',
                type: 'tv-screen',
                width: 600,
                height: 850,
                depth: 600,
                x: 1200,
                y: 0,
                z: 0,
                rotation: 0,
                wallId: 'wall-a',
                finish: 'stainless',
                customNotes: 'جهاز تم تخصيص مقاساته يدوياً',
              });
            }}
            className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:border-amber-400 transition group shadow-sm text-right"
          >
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-amber-600 group-hover:rotate-90 transition" />
              <div>
                <div className="text-xs font-bold text-slate-900">إضافة جهاز أو شاشة بمقاس حر</div>
                <div className="text-[10px] text-slate-500">تعديل العرض والارتفاع والعمق يدوياً</div>
              </div>
            </div>
            <Tv size={16} className="text-amber-600" />
          </button>

          {APPLIANCE_LIBRARY.map((template, idx) => (
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

              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {formatDimension(template.defaultWidth, unit)} x {formatDimension(template.defaultHeight, unit)}
                </span>

                <button
                  onClick={() => {
                    addAppliance({
                      name: template.name,
                      type: template.type,
                      width: template.defaultWidth,
                      height: template.defaultHeight,
                      depth: template.defaultDepth,
                      x: 1200,
                      y: 0,
                      z: template.defaultZ,
                      rotation: 0,
                      wallId: 'wall-a',
                      clearanceSides: template.clearanceSides,
                      clearanceBack: template.clearanceBack,
                      clearanceTop: template.clearanceTop,
                      finish: 'stainless',
                    });
                  }}
                  className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shadow-sm"
                  title="وضع الجهاز أو الشاشة"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- DOORS, WINDOWS & ARCHITECTURE TAB --- */}
      {activeCatalogTab === 'architecture' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {ARCHITECTURAL_LIBRARY.map((template, idx) => (
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
      )}

      {/* --- FINISHES & MATERIALS TAB --- */}
      {activeCatalogTab === 'finishes' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              واجهات الأثاث والخشب
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
                  <div className="w-5 h-5 rounded-full border border-slate-300 shadow-sm shrink-0" style={{ backgroundColor: mat.color }} />
                  <span className="text-[11px] font-semibold text-slate-800 truncate">{mat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              المقابض وإكسسوارات الفتح
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
