import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { CabinetCategory, ProjectType } from '../../types';
import { CABINET_LIBRARY, CabinetTemplate } from '../../constants/cabinetLibrary';
import { WARDROBE_LIBRARY, WardrobeTemplate } from '../../constants/wardrobeLibrary';
import { BEDROOM_LIBRARY, BedroomTemplate } from '../../constants/bedroomLibrary';
import { LIBRARY_LIBRARY, LibraryTemplate } from '../../constants/libraryUnitLibrary';
import { APPLIANCE_LIBRARY } from '../../constants/applianceLibrary';
import { ARCHITECTURAL_LIBRARY, ArchitecturalTemplate } from '../../constants/archLibrary';
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

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none z-20 shadow-xs font-sans">
      {/* Catalog Navigation Tabs */}
      <div className="grid grid-cols-4 p-2 gap-1 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-600">
        <button
          onClick={() => setActiveCatalogTab('main')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
            activeCatalogTab === 'main' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <Box size={16} className="mb-0.5" />
          <span>الوحدات</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('appliances')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
            activeCatalogTab === 'appliances' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <Tv size={16} className="mb-0.5" />
          <span>الأجهزة</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('architecture')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
            activeCatalogTab === 'architecture' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <DoorClosed size={16} className="mb-0.5" />
          <span>الفتحات</span>
        </button>

        <button
          onClick={() => setActiveCatalogTab('finishes')}
          className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
            activeCatalogTab === 'finishes' ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <Palette size={16} className="mb-0.5" />
          <span>الخامات</span>
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
                placeholder={`بحث في كتالوج الـ ${projectType}...`}
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
                  أبراج طولية
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
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  الكل ({WARDROBE_LIBRARY.length})
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('wardrobe')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'wardrobe' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  دواليب
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('accessories')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'accessories' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  إكسسوارات وجزر
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

          {/* Units List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-2.5">
            {filteredItems.map((template: any, idx: number) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({ type: 'cabinet', template }));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="bg-white border border-slate-200 rounded-2xl p-3 hover:border-blue-400 hover:shadow-md transition cursor-grab active:cursor-grabbing group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 group-hover:text-blue-500 transition text-xs">⋮⋮</span>
                      <h4 className="text-xs font-bold text-slate-900">{template.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{template.description}</p>
                  </div>
                  {template.tag && (
                    <span className="text-[10px] font-sans px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-lg font-bold shrink-0">
                      {template.tag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 mt-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
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
                        className="px-2 py-0.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-md text-[10px] font-mono transition"
                        title={`إضافة بعرض ${formatDimension(sw, unit)}`}
                      >
                        {formatDimension(sw, unit, false)}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddItem(template)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition ml-2 shadow-xs flex items-center gap-1"
                    title="إضافة فورية للرسم (أو اسحب القطعة وأفلتها)"
                  >
                    <Plus size={14} />
                    <span className="text-[10px] font-bold px-0.5">إضافة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- APPLIANCES TAB --- */}
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
            className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl hover:border-amber-400 transition group shadow-xs text-right"
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
              className="bg-white border border-slate-200 rounded-2xl p-3 hover:border-amber-400 hover:shadow-md transition"
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
                      finish: 'stainless',
                    });
                  }}
                  className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shadow-xs"
                  title="وضع الجهاز أو الشاشة"
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

      {/* --- FINISHES TAB --- */}
      {activeCatalogTab === 'finishes' && (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 mb-2">لون وتشطيب الضلف الأمامية (Doors Finish)</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'أبيض مطفي ناصع (Matte White)', color: '#f8fafc' },
                { name: 'كشمير بيج دافئ (Warm Cashmere)', color: '#d6cec4' },
                { name: 'رمادي غامق أنثراسيت (Anthracite)', color: '#334155' },
                { name: 'خشب جوز أمريكي (Walnut Wood)', color: '#5c4033' },
                { name: 'خشب أرو طبيعي (Natural Oak)', color: '#c49a6c' },
                { name: 'أخضر زمردي مودرن (Forest Green)', color: '#1b4332' },
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => updateMaterials({ frontFinish: f.name })}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 transition flex items-center gap-2 text-right bg-slate-50 hover:bg-white"
                >
                  <span className="w-5 h-5 rounded-lg border border-slate-300 shrink-0 shadow-xs" style={{ backgroundColor: f.color }} />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-2">لون الشاسيه الداخلي (Carcase Body)</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'أبيض كونتر', color: '#ffffff' },
                { name: 'رمادي فاتح', color: '#e2e8f0' },
                { name: 'خشب سابيلي', color: '#8b4513' },
              ].map((b) => (
                <button
                  key={b.name}
                  onClick={() => updateMaterials({ bodyColor: b.color })}
                  className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 transition flex flex-col items-center gap-1.5 text-center bg-slate-50"
                >
                  <span className="w-5 h-5 rounded-lg border border-slate-300 shadow-xs" style={{ backgroundColor: b.color }} />
                  <span className="text-[10px] font-bold text-slate-700">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
