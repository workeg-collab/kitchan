import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CabinetCategory, ProjectType } from '../../types';
import { CABINET_LIBRARY, CabinetTemplate } from '../../constants/cabinetLibrary';
import { WARDROBE_LIBRARY, WardrobeTemplate } from '../../constants/wardrobeLibrary';
import { BEDROOM_LIBRARY, BedroomTemplate } from '../../constants/bedroomLibrary';
import { LIBRARY_LIBRARY, LibraryTemplate } from '../../constants/libraryUnitLibrary';
import { LIVING_AND_OTHER_LIBRARY, LivingTemplate } from '../../constants/livingAndOtherLibrary';
import { APPLIANCE_LIBRARY } from '../../constants/applianceLibrary';
import { ARCHITECTURAL_LIBRARY, ArchitecturalTemplate } from '../../constants/archLibrary';
import { useMaterialsStore } from '../../store/useMaterialsStore';
import { formatDimension } from '../../utils/unitConversion';
import { TRANSLATIONS } from '../../utils/i18n';
import { 
  Plus, 
  Search, 
  DoorClosed, 
  AppWindow, 
  Square, 
  CircleDot, 
  Palette, 
  Sliders, 
  Tv, 
  Box, 
  CookingPot, 
  Shirt, 
  BedDouble, 
  BookOpen,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { addCabinet, addAppliance, addElement, updateMaterials, project } = useProjectStore();
  const { unit, setIsCustomKitchenModalOpen, setIsCustomCabinetModalOpen, language } = useUIStore();
  const t = TRANSLATIONS[language];

  const projectType = project.metadata.projectType || 'kitchen';

  const [activeCatalogTab, setActiveCatalogTab] = useState<'main' | 'appliances' | 'architecture' | 'finishes'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Determine current active catalog items based on Project Type
  const getCurrentLibrary = (): any[] => {
    switch (projectType) {
      case 'kitchen':
        return CABINET_LIBRARY;
      case 'dressing':
        return WARDROBE_LIBRARY;
      case 'bedroom':
        return BEDROOM_LIBRARY;
      case 'library':
        return LIBRARY_LIBRARY;
      case 'living':
      case 'office':
      case 'bathroom':
        return LIVING_AND_OTHER_LIBRARY;
      default:
        return CABINET_LIBRARY;
    }
  };

  const currentLibrary = getCurrentLibrary();

  const filteredItems = currentLibrary.filter((item: any) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategoryFilter === 'all') return matchesSearch;
    return matchesSearch && (item.category === selectedCategoryFilter || item.tag?.includes(selectedCategoryFilter));
  });

  const handleAddItem = (template: any, customW?: number) => {
    const w = customW || template.defaultWidth;
    addCabinet({
      name: template.name,
      category: template.category,
      type: template.type,
      projectType,
      width: w,
      height: template.defaultHeight,
      depth: template.defaultDepth,
      x: 1200,
      y: 0,
      z: template.defaultZ,
      rotation: 0,
      wallId: 'wall-a',
      doorCount: template.doorCount,
      drawerCount: template.drawerCount,
      shelfCount: template.shelfCount,
      doorHinge: template.doorHinge || 'right',
      doorType: template.doorType,
      hasSinkCutout: template.hasSinkCutout,
      hasApplianceCavity: template.hasApplianceCavity,
      applianceCavityHeight: template.applianceCavityHeight,
      applianceCavityZ: template.applianceCavityZ,
      hasHangingRail: template.hasHangingRail,
      hangingRailCount: template.hangingRailCount,
      hasShoeShelves: template.hasShoeShelves,
      hasJewelryDrawer: template.hasJewelryDrawer,
      hasTrouserRack: template.hasTrouserRack,
      hasIntegratedLed: template.hasIntegratedLed,
      verticalDividersCount: template.verticalDividersCount,
    });
  };

  const { materials } = useMaterialsStore();
  const frontMaterials = materials.filter(m => m.category === 'wood-sheet' || m.category === 'fabric' || m.category === 'glass');
  const countertopMaterials = materials.filter(m => m.category === 'countertop');

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none z-20 shadow-xs font-sans">
      {/* Dynamic Module-Aware Catalog Navigation Tabs */}
      <div className="grid grid-cols-3 p-2 gap-1 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-600">
        <button
          onClick={() => setActiveCatalogTab('main')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
            activeCatalogTab === 'main' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <Box size={16} className="mb-0.5" />
          <span>
            {projectType === 'dressing' ? 'الدواليب والركنات' : projectType === 'bedroom' ? 'السرائر والكومود' : projectType === 'library' ? 'المكتبات والشاشات' : 'الوحدات'}
          </span>
        </button>

        {projectType === 'kitchen' ? (
          <button
            onClick={() => setActiveCatalogTab('appliances')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
              activeCatalogTab === 'appliances' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <Tv size={16} className="mb-0.5" />
            <span>الأجهزة</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveCatalogTab('architecture')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
              activeCatalogTab === 'architecture' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <DoorClosed size={16} className="mb-0.5" />
            <span>الفتحات والأبواب</span>
          </button>
        )}

        <button
          onClick={() => setActiveCatalogTab('finishes')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
            activeCatalogTab === 'finishes' ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <Palette size={16} className="mb-0.5" />
          <span>الخامات والألوان ({materials.length})</span>
        </button>
      </div>

      {/* --- MAIN MODULE UNITS TAB --- */}
      {activeCatalogTab === 'main' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="px-3 pt-3 pb-1.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder={`بحث في كتالوج الـ ${projectType === 'dressing' ? 'دريسينج' : projectType === 'bedroom' ? 'غرف النوم' : projectType === 'library' ? 'المكتبات' : 'مطابخ'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>

          {/* Quick Filter Category Chips */}
          <div className="px-3 py-1 flex items-center gap-1 overflow-x-auto no-scrollbar text-[10px] font-bold">
            {projectType === 'kitchen' && (
              <>
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  الكل ({CABINET_LIBRARY.length})
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('base')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'base' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  سفلي
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('wall')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'wall' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  علوي
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('tall')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'tall' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  طولي
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('corner')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'corner' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  أركان وزوايا
                </button>
              </>
            )}

            {projectType === 'dressing' && (
              <>
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  الكل ({WARDROBE_LIBRARY.length})
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('wardrobe')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'wardrobe' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  دواليب
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('accessories')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'accessories' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  إكسسوارات
                </button>
              </>
            )}

            {projectType === 'bedroom' && (
              <>
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  الكل ({BEDROOM_LIBRARY.length})
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('bed')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'bed' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  سرائر
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('nightstand')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'nightstand' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  كومودينو
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('dresser')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'dresser' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  تسريحات
                </button>
              </>
            )}
          </div>

          {/* Custom Builder Banner */}
          <div className="px-3 py-1.5">
            {projectType === 'kitchen' ? (
              <button
                onClick={() => setIsCustomKitchenModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl hover:border-amber-500 transition group shadow-xs text-right"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600 group-hover:rotate-45 transition" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">مصمم المطابخ المخصص (Custom Kitchen)</div>
                    <div className="text-[10px] text-slate-500">تحديد أبعاد حرة، طراز الضلف جولا/فلات، والتقسيم</div>
                  </div>
                </div>
                <Plus size={16} className="text-amber-600" />
              </button>
            ) : (
              <button
                onClick={() => setIsCustomCabinetModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl hover:border-blue-400 transition group shadow-xs text-right"
              >
                <div className="flex items-center gap-2">
                  <Sliders size={16} className="text-blue-600 group-hover:rotate-45 transition" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">إنشاء وحدة مخصصة (Custom Unit)</div>
                    <div className="text-[10px] text-slate-500">تعديل العرض، الارتفاع، والتقسيم الداخلي</div>
                  </div>
                </div>
                <Plus size={16} className="text-blue-600" />
              </button>
            )}
          </div>

          {/* Catalog Items List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
            {filteredItems.map((item: any) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-3 hover:border-blue-400 hover:shadow-md transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold shrink-0">
                    {item.category}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <span>{formatDimension(item.defaultWidth, unit)}</span>
                    <span>×</span>
                    <span>{formatDimension(item.defaultHeight, unit)}</span>
                    <span>×</span>
                    <span>{formatDimension(item.defaultDepth, unit)}</span>
                  </div>

                  <button
                    onClick={() => handleAddItem(item)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    title="إضافة للمخطط"
                  >
                    <Plus size={13} />
                    <span>إضافة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- APPLIANCES TAB (Kitchen Only) --- */}
      {activeCatalogTab === 'appliances' && projectType === 'kitchen' && (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
          {APPLIANCE_LIBRARY.map((app, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-3 hover:border-amber-400 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{app.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{app.description}</p>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-bold">
                  {app.category}
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {formatDimension(app.defaultWidth, unit)} x {formatDimension(app.defaultHeight, unit)} x {formatDimension(app.defaultDepth, unit)}
                </span>

                <button
                  onClick={() => {
                    addAppliance({
                      name: app.name,
                      type: app.type as any,
                      category: app.category as any,
                      width: app.defaultWidth,
                      height: app.defaultHeight,
                      depth: app.defaultDepth,
                      x: 1000,
                      y: 0,
                      z: app.defaultZ,
                      rotation: 0,
                      wallId: 'wall-a',
                      finish: 'stainless',
                    });
                  }}
                  className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shadow-xs"
                  title="إضافة الجهاز"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ARCHITECTURE OPENINGS TAB --- */}
      {activeCatalogTab === 'architecture' && (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
          {ARCHITECTURAL_LIBRARY.map((template: ArchitecturalTemplate, idx: number) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-3 hover:border-emerald-400 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{template.nameAr || template.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{template.descriptionAr || template.description}</p>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">
                  {template.type}
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {formatDimension(template.defaultWidth, unit)} x {formatDimension(template.defaultHeight, unit)}
                </span>

                <button
                  onClick={() => {
                    addElement({
                      name: template.nameAr || template.name,
                      type: template.type,
                      width: template.defaultWidth,
                      height: template.defaultHeight,
                      depth: template.defaultDepth,
                      x: 1000,
                      y: 0,
                      z: template.defaultZ,
                      rotation: 0,
                      wallId: 'wall-a',
                    });
                  }}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-xs"
                  title="إضافة العنصر المعماري"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- FINISHES TAB WITH DYNAMIC USER MATERIALS --- */}
      {activeCatalogTab === 'finishes' && (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>لون وتشطيب الواجهات والضلف</span>
              <span className="text-[10px] font-mono text-slate-400 font-normal">من الكتالوج المخصص</span>
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {frontMaterials.map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateMaterials({ frontFinish: f.name, frontColor: f.colorCode })}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 transition flex items-center justify-between text-right bg-slate-50 hover:bg-white group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-lg border border-slate-300 shrink-0 shadow-xs" style={{ backgroundColor: f.colorCode }} />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-slate-800 leading-tight block truncate">{f.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono block">
                        {f.sheetLength}×{f.sheetWidth} مم • {f.price} {project.pricing.currency}/{f.pricingUnit}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {projectType === 'kitchen' && countertopMaterials.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-800 mb-2">خامات الرخام والكوارتز للأسطح</h4>
              <div className="grid grid-cols-1 gap-2">
                {countertopMaterials.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateMaterials({ countertopMaterial: c.name, countertopColor: c.colorCode })}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 transition flex items-center justify-between text-right bg-slate-50 hover:bg-white"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-lg border border-slate-300 shrink-0 shadow-xs" style={{ backgroundColor: c.colorCode }} />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 leading-tight block truncate">{c.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">
                          {c.thickness} مم • {c.price} {project.pricing.currency}/{c.pricingUnit}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
