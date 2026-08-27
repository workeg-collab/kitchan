import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
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
  LogOut,
  Users
} from 'lucide-react';

export const ProjectDashboard: React.FC = () => {
  const { loadSampleProject } = useProjectStore();
  const { setActiveTab } = useUIStore();
  const { currentUser, logout, setIsUserModalOpen } = useAuthStore();

  const modules: {
    id: ProjectType;
    title: string;
    titleEn: string;
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
    sample: typeof SAMPLE_PROJECT_KITCHEN;
  }[] = [
    {
      id: 'kitchen',
      title: 'مطابخ',
      titleEn: 'Kitchens',
      icon: <CookingPot size={42} strokeWidth={1.75} />,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 group-hover:bg-blue-600 group-hover:text-white',
      sample: SAMPLE_PROJECT_KITCHEN,
    },
    {
      id: 'dressing',
      title: 'دريسينج',
      titleEn: 'Dressing Rooms',
      icon: <Shirt size={42} strokeWidth={1.75} />,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 group-hover:bg-amber-600 group-hover:text-white',
      sample: SAMPLE_PROJECT_DRESSING,
    },
    {
      id: 'bedroom',
      title: 'غرف نوم',
      titleEn: 'Bedrooms',
      icon: <BedDouble size={42} strokeWidth={1.75} />,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 group-hover:bg-purple-600 group-hover:text-white',
      sample: SAMPLE_PROJECT_BEDROOM,
    },
    {
      id: 'library',
      title: 'مكتبات',
      titleEn: 'Libraries & TV Units',
      icon: <BookOpen size={42} strokeWidth={1.75} />,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white',
      sample: SAMPLE_PROJECT_LIBRARY,
    },
  ];

  const handleSelectModule = (sampleData: typeof SAMPLE_PROJECT_KITCHEN) => {
    loadSampleProject(sampleData);
    setActiveTab('2d-plan');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none font-sans overflow-hidden">
      {/* 1. Full Screen High-Resolution Luxury Kitchen & Dressing Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85')`,
        }}
      >
        {/* Soft Dark Vignette & Blur Overlay to make light cards stand out beautifully */}
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px]" />
      </div>

      {/* Top Floating Discreet User Header (No white bar) */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <span className="font-mono font-black text-white text-sm">FC</span>
          </div>
          <span className="font-bold text-base tracking-tight text-white drop-shadow">
            فرنتشر كاد <span className="text-blue-400 font-extrabold">برو</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 rounded-xl text-xs font-bold transition shadow-md"
            title="إدارة المستخدمين"
          >
            <Users size={14} />
            <span>{currentUser?.username || 'admin'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('هل تريد تسجيل الخروج؟')) {
                logout();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md border border-red-400/40 rounded-xl text-xs font-bold transition shadow-md"
            title="تسجيل الخروج"
          >
            <LogOut size={14} />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* 2. Main Center Content Container */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500 mt-6">
        {/* Header Title */}
        <div className="space-y-2 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-lg">
            <span>منظومة تصميم وتصنيع الأثاث والديكور</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            اختر قسم التصميم
          </h1>
          <p className="text-sm md:text-base text-slate-200 font-medium drop-shadow max-w-md mx-auto">
            انقر على أي قسم لفتح ساحة العمل ثلاثية الأبعاد والمخطط الهندسي فوراً
          </p>
        </div>

        {/* 3. The 4 Clean, Light-Colored Square Cards (بدون أي بيانات داخل المربع) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-2">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelectModule(m.sample)}
              className="group aspect-square w-full bg-white/95 hover:bg-white backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-2xl hover:shadow-blue-600/30 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden"
            >
              {/* Subtle top light reflection accent */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-500 transition-colors" />

              {/* Large Icon Container */}
              <div className={`w-24 h-24 rounded-3xl ${m.iconBg} ${m.iconColor} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 mb-5`}>
                {m.icon}
              </div>

              {/* Only Clean Title */}
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                {m.title}
              </h2>
              
              {/* English Sub-label */}
              <span className="text-xs font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider group-hover:text-slate-600 transition-colors">
                {m.titleEn}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
