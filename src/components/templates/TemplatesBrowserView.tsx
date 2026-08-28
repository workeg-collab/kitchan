import React, { useState } from 'react';
import { ALL_SAMPLE_PROJECTS } from '../../constants/expandedProjects';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { ProjectData } from '../../types';
import { SpaceAdaptationModal } from '../modals/SpaceAdaptationModal';
import { 
  Search, 
  CookingPot, 
  Shirt, 
  BedDouble, 
  BookOpen, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Layers,
  Ruler,
  Maximize2,
  Armchair
} from 'lucide-react';

export const TemplatesBrowserView: React.FC = () => {
  const { project, setProject, resetProject } = useProjectStore();
  const { setActiveTab } = useUIStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(project.metadata.projectType || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  // Space Adaptation Modal State
  const [adaptingProject, setAdaptingProject] = useState<ProjectData | null>(null);
  const [isAdaptModalOpen, setIsAdaptModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'جميع التصاميم', icon: <Layers size={15} /> },
    { id: 'kitchen', label: 'مطابخ كاملة', icon: <CookingPot size={15} /> },
    { id: 'dressing', label: 'دريسينج روم', icon: <Shirt size={15} /> },
    { id: 'bedroom', label: 'غرف نوم', icon: <BedDouble size={15} /> },
    { id: 'library', label: 'مكتبات وشاشات TV', icon: <BookOpen size={15} /> },
    { id: 'living', label: 'صالون ومعيشة', icon: <Armchair size={15} /> },
  ];

  const filteredProjects = ALL_SAMPLE_PROJECTS.filter((proj) => {
    const matchesCategory = selectedCategory === 'all' || proj.category === selectedCategory;
    const matchesSearch = 
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateBlankProject = () => {
    resetProject();
    const cat = (selectedCategory === 'all' ? 'kitchen' : selectedCategory) as any;
    useProjectStore.getState().updateMetadata({
      name: `مشروع ${cat === 'kitchen' ? 'مطبخ' : cat === 'dressing' ? 'دريسينج' : cat === 'bedroom' ? 'غرفة نوم' : cat === 'library' ? 'مكتبة' : 'صالون'} جديد`,
      projectType: cat,
    });
    setActiveTab('3d-view');
  };

  const handleDuplicateAndCustomize = (templateData: ProjectData) => {
    setAdaptingProject(templateData);
    setIsAdaptModalOpen(true);
  };

  const handleApplyAdaptedProject = (adaptedData: ProjectData) => {
    setProject(adaptedData);
    setActiveTab('3d-view');
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-100 text-slate-900 overflow-hidden select-none font-sans">
      {/* Top Header & Search Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-10 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="text-blue-600" size={22} />
            <span>كتالوج المشاريع والتصاميم الجاهزة (Ready-Made Projects)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            اختر أي مشروع جاهز، عدّل أبعاده لتطابق غرفة عميلك، وابدأ تخصيص الخامات والرندرات فوراً
          </p>
        </div>

        {/* Search Input & Start Blank Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="بحث بالاسم، الطراز، أو الأبعاد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 font-sans shadow-xs"
            />
          </div>

          <button
            onClick={handleCreateBlankProject}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-black shadow-md transition transform active:scale-95 cursor-pointer"
            title="بدء مشروع جديد فارغ في هذا القسم"
          >
            <span>+ مشروع فارغ</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Grid of Project Cards */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col group"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={p.previewThumbnail}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Dimensions Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-xl text-[11px] font-mono font-bold text-white flex items-center gap-1 border border-white/20">
                  <Ruler size={12} className="text-amber-400" />
                  <span>{p.dimensions}</span>
                </div>

                {/* Style Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-slate-900 shadow-sm">
                  {p.style}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {p.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions: Duplicate & Customize / Adapt */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicateAndCustomize(p.data)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition transform active:scale-95 cursor-pointer"
                  >
                    <Maximize2 size={14} />
                    <span>مواءمة وتخصيص للمشروع</span>
                  </button>

                  <button
                    onClick={() => {
                      const cloned = JSON.parse(JSON.stringify(p.data));
                      cloned.metadata.id = `proj-${Date.now()}`;
                      cloned.metadata.name = `${p.name} (نسخة جديدة)`;
                      setProject(cloned);
                      setActiveTab('3d-view');
                    }}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition shadow-xs"
                    title="فتح مباشر كما هو"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Space Adaptation Modal */}
      <SpaceAdaptationModal
        isOpen={isAdaptModalOpen}
        onClose={() => setIsAdaptModalOpen(false)}
        templateProject={adaptingProject}
        onApplyAdapted={handleApplyAdaptedProject}
      />
    </div>
  );
};
