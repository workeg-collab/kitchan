import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { ProjectType } from '../../types';
import { 
  SAMPLE_PROJECT_KITCHEN, 
  SAMPLE_PROJECT_DRESSING, 
  SAMPLE_PROJECT_BEDROOM, 
  SAMPLE_PROJECT_LIBRARY 
} from '../../constants/sampleProjects';
import { 
  CookingPot, 
  Shirt, 
  BedDouble, 
  BookOpen, 
  Plus, 
  ArrowLeft, 
  Layers, 
  Calendar, 
  User, 
  Sparkles, 
  CheckCircle2, 
  FolderPlus 
} from 'lucide-react';

export const ProjectDashboard: React.FC = () => {
  const { project, loadSampleProject, resetProject, setProject } = useProjectStore();
  const { setActiveTab, language } = useUIStore();

  const [activeFilter, setActiveFilter] = useState<'all' | ProjectType>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedModuleForNew, setSelectedModuleForNew] = useState<ProjectType>('kitchen');
  const [newProjectName, setNewProjectName] = useState('');
  const [newClientName, setNewClientName] = useState('');

  const modules: {
    id: ProjectType;
    title: string;
    titleEn: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    badgeColor: string;
    sample: typeof SAMPLE_PROJECT_KITCHEN;
  }[] = [
    {
      id: 'kitchen',
      title: 'تصميم المطابخ الحديثة',
      titleEn: 'Kitchen Design',
      description: 'كبائن سفلية، علوية، أبراج أفران، أسطح رخام، أجهزة بلت إن، وبواكي حوض',
      icon: <CookingPot size={28} />,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      sample: SAMPLE_PROJECT_KITCHEN,
    },
    {
      id: 'dressing',
      title: 'الدريسنج روم ودواليب الملابس',
      titleEn: 'Dressing & Wardrobe Design',
      description: 'دواليب مفصلية وسحاب، دريسنج مفتوح، علاقات ملابس مزدوجة، أرفف أحذية، وجزر إكسسوارات',
      icon: <Shirt size={28} />,
      color: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      sample: SAMPLE_PROJECT_DRESSING,
    },
    {
      id: 'bedroom',
      title: 'أثاث وتصميم غرف النوم',
      titleEn: 'Bedroom Furniture Design',
      description: 'أسرّة ماستر وسحارة هيدروليك، كومودينو، تسريحات مع مرايا، وبانكيت نهاية السرير',
      icon: <BedDouble size={28} />,
      color: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      sample: SAMPLE_PROJECT_BEDROOM,
    },
    {
      id: 'library',
      title: 'المكتبات ووحدات الحائط والشاشة',
      titleEn: 'Library & TV Wall Units',
      description: 'مكتبات جدارية كاملة، مكتبات شاشة تلفزيون وساوند بار، فيترينات زجاج، وأرفف طائرة',
      icon: <BookOpen size={28} />,
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      sample: SAMPLE_PROJECT_LIBRARY,
    },
  ];

  const handleStartWithSample = (sampleData: typeof SAMPLE_PROJECT_KITCHEN) => {
    loadSampleProject(sampleData);
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
        name: newProjectName.trim() || `مشروع ${modules.find(m => m.id === mod)?.title} جديد`,
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
        {/* Top Welcome & Stats Header */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full mb-2.5">
              منظومة التصميم والتصنيع المتكاملة للأثاث والديكور
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              أهلاً بك في منصة <span className="text-blue-600">فرنتشر كاد برو</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
              اختر قسم التصميم لبدء العمل في بيئة ثلاثية وثنائية الأبعاد مخصصة بقواعد تصنيع وجداول تقطيع معتمدة.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => setActiveTab('2d-plan')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition border border-slate-200"
            >
              متابعة المشروع الحالي
            </button>
            <button
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/25 transition transform active:scale-98"
            >
              <Plus size={16} />
              <span>إنشاء مشروع جديد</span>
            </button>
          </div>
        </div>

        {/* Create New Project Modal Overlay */}
        {isCreatingNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">إنشاء مشروع أثاث جديد</h3>
                <p className="text-xs text-slate-500 mt-0.5">اختر قسم التصميم واكتب بيانات المشروع</p>
              </div>

              {/* Module 4 Options */}
              <div className="grid grid-cols-2 gap-3">
                {modules.map((m) => (
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
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{m.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Project Meta Inputs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">اسم المشروع *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: دريسنج ماستر فيلا الياسمين"
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
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
                >
                  بدء التصميم
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4 Specialized Design Modules Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="text-blue-600" size={18} />
              أقسام التصميم التخصصية (Design Modules)
            </h2>
            <span className="text-xs text-slate-400 font-mono">4 أقسام مستقلة بقواعد تصنيع متقدمة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((m) => {
              const isCurrentActive = project.metadata.projectType === m.id;

              return (
                <div
                  key={m.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white shadow-lg`}>
                        {m.icon}
                      </div>

                      {isCurrentActive ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                          القسم النشط حالياً
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                          {m.id}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleStartWithSample(m.sample)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition"
                    >
                      فتح نموذج جاهز
                    </button>

                    <button
                      onClick={() => {
                        setSelectedModuleForNew(m.id);
                        setIsCreatingNew(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
                    >
                      <Plus size={14} />
                      <span>مشروع جديد</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
