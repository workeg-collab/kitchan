import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useMaterialsStore } from '../../store/useMaterialsStore';
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
  Palette, 
  Tv, 
  Box, 
  Shirt, 
  BedDouble, 
  BookOpen, 
  Sparkles, 
  Layers, 
  X, 
  Pin, 
  PinOff,
  Grid,
  Ruler,
  Sliders,
  Maximize2
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { addCabinet, addAppliance, addElement, updateMaterials, project } = useProjectStore();
  const { 
    unit, 
    language,
    activeLeftCategory, 
    setActiveLeftCategory, 
    toggleLeftCategory,
    isLeftPanelPinned,
    toggleLeftPanelPinned,
    setIsRoomSketcherOpen,
    setIsCustomKitchenModalOpen,
    setActiveTab
  } = useUIStore();

  const { materials } = useMaterialsStore();
  const t = TRANSLATIONS[language];
  const projectType = project.metadata.projectType || 'kitchen';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Determine current active catalog items based on Project Type
  const getActiveLibrary = () => {
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

  const currentLibrary = getActiveLibrary();

  // Filter items by category & search query
  const filteredItems = currentLibrary.filter((item: any) => {
    const matchesCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddItem = (template: any, customWidth?: number) => {
    const w = customWidth || template.defaultWidth;
    addCabinet({
      name: template.name,
      type: template.type,
      category: template.category as CabinetCategory,
      projectType,
      width: w,
      height: template.defaultHeight,
      depth: template.defaultDepth,
      x: 1000,
      y: 0,
      z: template.defaultZ || 0,
      rotation: 0,
      wallId: 'wall-a',
      shelfCount: template.shelfCount || (template.category === 'wall' || template.category === 'tall' ? 2 : 0),
      doorCount: template.doorCount !== undefined ? template.doorCount : 1,
      drawerCount: template.drawerCount || 0,
      doorHinge: template.doorHinge || 'right',
      doorType: template.doorType || 'full',
      flipUpDoor: template.flipUpDoor || false,
      hasGlassDoors: template.hasGlassDoors || false,
      hasSinkCutout: template.hasSinkCutout || false,
      hasCooktopCutout: template.hasCooktopCutout || false,
      hasApplianceCavity: template.hasApplianceCavity || false,
    });
  };

  const frontMaterials = materials.filter(m => m.category === 'wood-sheet' || m.category === 'fabric' || m.category === 'glass');
  const countertopMaterials = materials.filter(m => m.category === 'countertop');

  return (
    <div className="flex h-full select-none font-sans relative">
      {/* Backdrop on mobile when drawer is open */}
      {activeLeftCategory && (
        <div 
          onClick={() => setActiveLeftCategory(null)}
          className="lg:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-30 transition-opacity"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. SLIM ICON TOOL RAIL (54px width) - Professional CAD Look               */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex w-14 bg-white border-r border-slate-200/90 flex-col items-center py-3 gap-2 z-20 shadow-xs">
        {/* Main Furniture / Cabinets Category */}
        <button
          onClick={() => toggleLeftCategory('cabinets')}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition group relative ${
            activeLeftCategory === 'cabinets'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
          }`}
          title={projectType === 'dressing' ? 'دواليب وخزائن الدريسينج' : projectType === 'bedroom' ? 'السرائر والكومود والتسريحة' : projectType === 'library' ? 'المكتبات وحوائط الشاشات' : 'وحدات ودواليب المطبخ'}
        >
          {projectType === 'dressing' ? <Shirt size={19} /> : projectType === 'bedroom' ? <BedDouble size={19} /> : projectType === 'library' ? <BookOpen size={19} /> : <Box size={19} />}
          <span className="text-[8px] font-bold mt-0.5 leading-none">
            {projectType === 'dressing' ? 'خزائن' : projectType === 'bedroom' ? 'سرائر' : projectType === 'library' ? 'مكتبات' : 'وحدات'}
          </span>
        </button>

        {/* Appliances (Kitchen only) */}
        {projectType === 'kitchen' && (
          <button
            onClick={() => toggleLeftCategory('appliances')}
            className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition group relative ${
              activeLeftCategory === 'appliances'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
            title="الأجهزة الكهربائية والبيلت إن (Appliances)"
          >
            <Tv size={19} />
            <span className="text-[8px] font-bold mt-0.5 leading-none">أجهزة</span>
          </button>
        )}

        {/* Openings & Architecture */}
        <button
          onClick={() => toggleLeftCategory('architecture')}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition group relative ${
            activeLeftCategory === 'architecture'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
          title="الأبواب، النوافذ، والأعمدة المعمارية"
        >
          <DoorClosed size={19} />
          <span className="text-[8px] font-bold mt-0.5 leading-none">فتحات</span>
        </button>

        {/* Materials & Colors */}
        <button
          onClick={() => toggleLeftCategory('finishes')}
          className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition group relative ${
            activeLeftCategory === 'finishes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title="الخامات، الألوان، والألواح المخصصة"
        >
          <Palette size={19} />
          <span className="text-[8px] font-bold mt-0.5 leading-none">خامات</span>
        </button>

        {/* Ready-made Templates Quick Access */}
        <button
          onClick={() => setActiveTab('templates-catalog')}
          className="w-10 h-10 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition group"
          title="كتالوج التصاميم الجاهزة والمواءمة الذكية"
        >
          <Sparkles size={19} />
          <span className="text-[8px] font-bold mt-0.5 leading-none">تصاميم</span>
        </button>

        <div className="w-6 h-px bg-slate-200 my-1" />

        {/* Room Shape & Dimension Sketcher */}
        <button
          onClick={() => setIsRoomSketcherOpen(true)}
          className="w-10 h-10 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition group"
          title="تعديل مقاسات الغرفة وتخطيط الجدران"
        >
          <Ruler size={19} />
          <span className="text-[8px] font-bold mt-0.5 leading-none">الغرفة</span>
        </button>
      </aside>

      {/* ========================================================================= */}
      {/* 2. FLYOUT DRAWER PANEL (310px width) - Slides out seamlessly             */}
      {/* ========================================================================= */}
      {activeLeftCategory && (
        <div className="fixed inset-y-0 right-0 max-w-[85vw] w-80 bg-white border-l border-slate-200 z-40 shadow-2xl flex flex-col h-full lg:relative lg:border-r lg:border-l-0 lg:z-10 animate-in slide-in-from-right lg:slide-in-from-left duration-200">
          {/* Drawer Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-900">
                {activeLeftCategory === 'cabinets' && (projectType === 'dressing' ? 'خزائن ودواليب الدريسينج' : projectType === 'bedroom' ? 'السرائر والكومود والتسريحة' : projectType === 'library' ? 'المكتبات وحوائط الشاشات' : 'وحدات ودواليب المطبخ')}
                {activeLeftCategory === 'appliances' && 'الأجهزة الكهربائية والبيلت إن'}
                {activeLeftCategory === 'architecture' && 'الفتحات والأبواب المعمارية'}
                {activeLeftCategory === 'finishes' && `الخامات والألوان المعتمدة (${materials.length})`}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleLeftPanelPinned}
                className={`p-1.5 rounded-lg transition ${
                  isLeftPanelPinned ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700'
                }`}
                title={isLeftPanelPinned ? 'تثبيت اللوحة (Pinned)' : 'إلغاء التثبيت للإغلاق التلقائي'}
              >
                {isLeftPanelPinned ? <Pin size={13} /> : <PinOff size={13} />}
              </button>

              <button
                onClick={() => setActiveLeftCategory(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                title="إغلاق اللوحة لتوسيع ساحة العمل"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* TAB: CABINETS & FURNITURE ITEMS                                       */}
          {/* ===================================================================== */}
          {activeLeftCategory === 'cabinets' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Box */}
              <div className="p-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="بحث في الكتالوج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              {/* Category Quick Chips */}
              <div className="px-3 pb-2 flex items-center gap-1 overflow-x-auto no-scrollbar text-[10px] font-bold">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  الكل ({currentLibrary.length})
                </button>
                {projectType === 'kitchen' && (
                  <>
                    <button
                      onClick={() => setSelectedCategoryFilter('base')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'base' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      سفلي
                    </button>
                    <button
                      onClick={() => setSelectedCategoryFilter('wall')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'wall' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      علوي
                    </button>
                    <button
                      onClick={() => setSelectedCategoryFilter('tall')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'tall' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      طولي
                    </button>
                  </>
                )}
                {projectType === 'dressing' && (
                  <>
                    <button
                      onClick={() => setSelectedCategoryFilter('wardrobe')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'wardrobe' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      دواليب
                    </button>
                    <button
                      onClick={() => setSelectedCategoryFilter('accessories')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'accessories' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      إكسسوارات
                    </button>
                  </>
                )}
                {projectType === 'bedroom' && (
                  <>
                    <button
                      onClick={() => setSelectedCategoryFilter('bed')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'bed' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      سرائر
                    </button>
                    <button
                      onClick={() => setSelectedCategoryFilter('nightstand')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'nightstand' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      كومودينو
                    </button>
                    <button
                      onClick={() => setSelectedCategoryFilter('dresser')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedCategoryFilter === 'dresser' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      تسريحات
                    </button>
                  </>
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-3 py-1 space-y-2">
                {filteredItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-2xl p-2.5 hover:border-purple-400 hover:shadow-sm transition group text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 pr-1.5">
                        <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[10px] font-mono text-slate-500">
                        <span>{formatDimension(item.defaultWidth, unit)}</span>
                        <span>×</span>
                        <span>{formatDimension(item.defaultHeight, unit)}</span>
                        <span>×</span>
                        <span>{formatDimension(item.defaultDepth, unit)}</span>
                      </div>

                      <button
                        onClick={() => handleAddItem(item)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
                        title="إضافة للرسم"
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

          {/* ===================================================================== */}
          {/* TAB: APPLIANCES                                                       */}
          {/* ===================================================================== */}
          {activeLeftCategory === 'appliances' && (
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {APPLIANCE_LIBRARY.map((app, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-2.5 hover:border-amber-400 hover:shadow-sm transition text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{app.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{app.description}</p>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-bold">
                      {app.category}
                    </span>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {formatDimension(app.defaultWidth, unit)} × {formatDimension(app.defaultHeight, unit)} × {formatDimension(app.defaultDepth, unit)}
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
                      className="p-1 px-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                      title="إضافة الجهاز"
                    >
                      <Plus size={13} />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB: OPENINGS & ARCHITECTURE                                          */}
          {/* ===================================================================== */}
          {activeLeftCategory === 'architecture' && (
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {ARCHITECTURAL_LIBRARY.map((template, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-2.5 hover:border-emerald-400 hover:shadow-sm transition text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{template.nameAr || template.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{template.descriptionAr || template.description}</p>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">
                      {template.type}
                    </span>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {formatDimension(template.defaultWidth, unit)} × {formatDimension(template.defaultHeight, unit)}
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
                      className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                      title="إضافة العنصر"
                    >
                      <Plus size={13} />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB: MATERIALS & FINISHES                                             */}
          {/* ===================================================================== */}
          {activeLeftCategory === 'finishes' && (
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>تشطيب الضلف والواجهات</span>
                  <span className="text-[10px] font-mono text-slate-400 font-normal">من الكتالوج المخصص</span>
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {frontMaterials.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateMaterials({ frontFinish: f.name, frontColor: f.colorCode })}
                      className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 transition flex items-center justify-between text-right bg-slate-50 hover:bg-white group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
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
                  <h4 className="font-bold text-slate-800 mb-2">خامات الرخام والكوارتز</h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {countertopMaterials.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => updateMaterials({ countertopMaterial: c.name, countertopColor: c.colorCode })}
                        className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 transition flex items-center justify-between text-right bg-slate-50 hover:bg-white"
                      >
                        <div className="flex items-center gap-2 min-w-0">
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
        </div>
      )}
    </div>
  );
};
