import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { ProjectType, ProjectData } from '../../types';
import { 
  SAMPLE_PROJECT_KITCHEN, 
  SAMPLE_PROJECT_DRESSING, 
  SAMPLE_PROJECT_BEDROOM, 
  SAMPLE_PROJECT_LIBRARY 
} from '../../constants/sampleProjects';
import { formatDimension } from '../../utils/unitConversion';
import { 
  CookingPot, 
  Shirt, 
  BedDouble, 
  BookOpen, 
  Plus, 
  Layers, 
  Calendar, 
  User, 
  Sparkles, 
  FolderPlus, 
  ArrowRight, 
  CheckCircle2, 
  Maximize2,
  Sliders
} from 'lucide-react';

export const ProjectDashboard: React.FC = () => {
  const { project, loadSampleProject, setProject } = useProjectStore();
  const { setActiveTab, unit } = useUIStore();

  const [activeFilter, setActiveFilter] = useState<'all' | ProjectType>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedModuleForNew, setSelectedModuleForNew] = useState<ProjectType>('kitchen');
  const [newProjectName, setNewProjectName] = useState('');
  const [newClientName, setNewClientName] = useState('');

  const sampleList: {
    type: ProjectType;
    data: ProjectData;
    tag: string;
    icon: React.ReactNode;
    gradient: string;
    badge: string;
  }[] = [
    {
      type: 'kitchen',
      data: SAMPLE_PROJECT_KITCHEN,
      tag: 'مطابخ حديثة',
      icon: <CookingPot size={22} />,
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      type: 'dressing',
      data: SAMPLE_PROJECT_DRESSING,
      tag: 'دريسنج ودواليب',
      icon: <Shirt size={22} />,
      gradient: 'from-amber-600 to-orange-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      type: 'bedroom',
      data: SAMPLE_PROJECT_BEDROOM,
      tag: 'غرف نوم ماستر',
      icon: <BedDouble size={22} />,
      gradient: 'from-purple-600 to-pink-600',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      type: 'library',
      data: SAMPLE_PROJECT_LIBRARY,
      tag: 'مكتبات وشاشات',
      icon: <BookOpen size={22} />,
      gradient: 'from-emerald-600 to-teal-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const modulesMeta: {
    id: ProjectType;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'kitchen',
      title: 'تصميم المطابخ',
      desc: 'كبائن سفلية، علوية، أبراج أفران، أسطح رخام، وأجهزة',
      icon: <CookingPot size={24} />,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'dressing',
      title: 'الدريسنج ودواليب الملابس',
      desc: 'دواليب مفصلي وجرار، دريسنج مفتوح، علاقات ملابس، وأرفف أحذية',
      icon: <Shirt size={24} />,
      color: 'from-amber-600 to-orange-600',
    },
    {
      id: 'bedroom',
      title: 'أثاث غرف النوم',
      desc: 'أسرّة ماستر وسحارة هيدروليك، كومودينو، تسريحات مع مرايا',
      icon: <BedDouble size={24} />,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'library',
      title: 'المكتبات ووحدات الشاشة',
      desc: 'مكتبات جدارية كاملة، تجاويف شاشة تلفزيون، وفيترينات زجاج',
      icon: <BookOpen size={24} />,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  const filteredSamples = sampleList.filter(
    (item) => activeFilter === 'all' || item.type === activeFilter
  );

  const handleOpenProject = (projectData: ProjectData) => {
    loadSampleProject(projectData);
    setActiveTab('2d-plan');
  };

  const handleCreateNewBlank = (mod: ProjectType) => {
    let sampleBase = SAMPLE_PROJECT_KITCHEN;
    if (mod === 'dressing') sampleBase = SAMPLE_PROJECT_DRESSING;
    else if (mod === 'bedroom') sampleBase = SAMPLE_PROJECT_BEDROOM;
    else if (mod === 'library') sampleBase = SAMPLE_PROJECT_LIBRARY;

    setProject({
      ...sampleBase,
      metadata: {
        ...sampleBase.metadata,
        id: `proj-${mod}-${Date.now()}`,
        name: newProjectName.trim() || `مشروع ${modulesMeta.find(m => m.id === mod)?.title} جديد`,
        clientName: newClientName.trim() || 'بدون اسم',
        projectType: mod,
        date: new Date().toISOString().split('T')[0],
      },
      cabinets: [],
      appliances: [],
      architecturalElements: [],
    });

    setIsCreatingNew(false);
    setActiveTab('2d-plan');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-auto p-6 md:p-10 select-none font-sans">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full mb-2.5">
              لوحة المشاريع والتصاميم المعتمدة
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              أهلاً بك، اختر المشروع للبدء في التصميم
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
              تصفح مشاريع المطابخ، الدريسنج، غرف النوم، والمكتبات أو أنشئ مشروعاً جديداً بمقاسات صافية.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/25 transition transform active:scale-98"
            >
              <Plus size={16} />
              <span>مشروع جديد</span>
            </button>
          </div>
        </div>

        {/* Current Active Working Project Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs text-blue-300 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>المشروع المفتوح حالياً في ساحة العمل:</span>
            </div>
            <h2 className="text-xl font-bold text-white">{project.metadata.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2 font-mono">
              <span>القسم: <strong className="text-white uppercase">{project.metadata.projectType || 'kitchen'}</strong></span>
              <span>•</span>
              <span>العميل: <strong className="text-white">{project.metadata.clientName || 'بدون اسم'}</strong></span>
              <span>•</span>
              <span>الأبعاد: <strong className="text-white">{formatDimension(project.room.width, unit)} × {formatDimension(project.room.length, unit)}</strong></span>
              <span>•</span>
              <span>الوحدات: <strong className="text-blue-400">{project.cabinets.length} وحدة</strong></span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('2d-plan')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/40 transition shrink-0 transform active:scale-98"
          >
            <span>فتح ومتابعة التصميم (2D / 3D)</span>
            <ArrowRight size={16} className="rotate-180" />
          </button>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            {[
              { id: 'all', label: 'جميع المشاريع' },
              { id: 'kitchen', label: '🍳 المطابخ' },
              { id: 'dressing', label: '👗 الدريسنج والدواليب' },
              { id: 'bedroom', label: '🛏️ غرف النوم' },
              { id: 'library', label: '📚 المكتبات ووحدات الشاشة' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeFilter === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-400 font-mono">
            {filteredSamples.length} تصاميم جاهزة للتعديل
          </span>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSamples.map((item, idx) => {
            const isCurrentlyLoaded = project.metadata.id === item.data.metadata.id;

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-md`}>
                      {item.icon}
                    </div>

                    <span className={`px-3 py-1 rounded-full border text-[11px] font-bold ${item.badge}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition">
                    {item.data.metadata.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.data.metadata.notes}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-5 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center font-mono text-[11px]">
                    <div>
                      <div className="text-[10px] text-slate-400">أبعاد الغرفة</div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {formatDimension(item.data.room.width, unit, false)}x{formatDimension(item.data.room.length, unit, false)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">عدد الوحدات</div>
                      <div className="font-bold text-blue-600 mt-0.5">
                        {item.data.cabinets.length} وحدة
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">ارتفاع السقف</div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {formatDimension(item.data.room.ceilingHeight, unit)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 font-medium">
                    العميل: <span className="text-slate-700 font-bold">{item.data.metadata.clientName}</span>
                  </div>

                  <button
                    onClick={() => handleOpenProject(item.data)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
                  >
                    <span>فتح وتعديل المشروع</span>
                    <ArrowRight size={14} className="rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Project Modal Dialog */}
        {isCreatingNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">إنشاء مشروع أثاث جديد</h3>
                <p className="text-xs text-slate-500 mt-0.5">اختر قسم التصميم واكتب بيانات المشروع</p>
              </div>

              {/* Module Selection */}
              <div className="grid grid-cols-2 gap-3">
                {modulesMeta.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModuleForNew(m.id)}
                    className={`p-4 rounded-2xl border text-right transition flex items-start gap-3 ${
                      selectedModuleForNew === m.id
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${m.color} text-white shrink-0`}>
                      {m.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{m.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">اسم المشروع *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مطبخ فيلا الياسمين"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">اسم العميل / المالك</label>
                  <input
                    type="text"
                    placeholder="مثال: أ / أحمد خالد"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleCreateNewBlank(selectedModuleForNew)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
                >
                  بدء التصميم
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
