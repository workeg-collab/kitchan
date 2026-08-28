import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
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
  Users,
  Building2,
  Sparkles,
  Layers,
  Play,
  Video,
  Camera
} from 'lucide-react';
import { AppVideoTutorialModal } from '../modals/AppVideoTutorialModal';
import { AICameraRoomScannerModal } from '../modals/AICameraRoomScannerModal';

export const ProjectDashboard: React.FC = () => {
  const { loadSampleProject } = useProjectStore();
  const { setActiveTab, setIsVideoTutorialOpen, setIsCameraScannerOpen } = useUIStore();
  const { currentUser, logout, setIsUserModalOpen } = useAuthStore();
  const { setIsAdminModalOpen } = useSubscriptionStore();

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
      title: 'مكتبات وشاشات',
      titleEn: 'Libraries & Media',
      icon: <BookOpen size={42} strokeWidth={1.75} />,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white',
      sample: SAMPLE_PROJECT_LIBRARY,
    },
  ];

  const handleSelectModule = (typeId: ProjectType, sampleData: typeof SAMPLE_PROJECT_KITCHEN) => {
    loadSampleProject(sampleData);
    setActiveTab('templates-catalog');
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

      {/* Top Floating User Header */}
      <div className="relative sm:absolute top-0 sm:top-4 inset-x-0 sm:inset-x-6 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 p-3 sm:p-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <span className="font-mono font-black text-white text-sm">FC</span>
          </div>
          <span className="font-bold text-base tracking-tight text-white drop-shadow">
            فرنتشر كاد <span className="text-blue-400 font-extrabold">برو</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Mobile Camera AI Room Scanner Trigger */}
          <button
            onClick={() => setIsCameraScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/30 border border-white/30 backdrop-blur-md cursor-pointer transform hover:scale-105 active:scale-95"
            title="تصوير ومسح المطبخ أو الغرفة بالكاميرا واستخراج رسمة جاهزة بالذكاء الاصطناعي"
          >
            <Camera size={14} />
            <span>مسح بالكاميرا 📷</span>
          </button>

          {/* Video Tutorial Glowing Trigger Button */}
          <button
            onClick={() => setIsVideoTutorialOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/30 border border-white/30 backdrop-blur-md cursor-pointer transform hover:scale-105 active:scale-95"
            title="فيديو ودليل الشرح الشامل لطرق الرسم والتعامل مع البلوكات والأدوات المخفية"
          >
            <Play size={13} fill="currentColor" />
            <span>فيديو الشرح</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-md border border-blue-400/40"
              title="لوحة تحكم الاشتراكات والشركات"
            >
              <Building2 size={13} />
              <span>الإدارة</span>
            </button>
          )}

          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 rounded-xl text-xs font-bold transition shadow-md"
            title={currentUser?.role === 'admin' ? 'إدارة المستخدمين' : 'بيانات حسابي واشتراكي'}
          >
            <Users size={13} />
            <span>{currentUser?.name || currentUser?.username || 'المستخدم'}</span>
          </button>

          <button
            onClick={() => {
              logout();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md border border-red-400/40 rounded-xl text-xs font-bold transition shadow-md"
            title="تسجيل الخروج"
          >
            <LogOut size={13} />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* 2. Main Center Content Container */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500 my-auto py-6">
        {/* Header Title */}
        <div className="space-y-1.5 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-lg">
            <span>منظومة تصميم وتصنيع الأثاث والديكور</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            اختر قسم التصميم
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium drop-shadow max-w-md mx-auto">
            انقر على أي قسم لفتح ساحة العمل ثلاثية الأبعاد والمخطط الهندسي فوراً
          </p>
        </div>

        {/* 3. The 4 Clean, Pure Category Cards (2 columns on mobile, 4 columns on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full px-2">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelectModule(m.id, m.sample)}
              className="group aspect-square w-full bg-white/95 hover:bg-white backdrop-blur-xl border border-white/80 rounded-3xl p-4 sm:p-6 shadow-xl sm:shadow-2xl hover:shadow-blue-600/30 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden"
            >
              {/* Subtle top light reflection accent */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-500 transition-colors" />

              {/* Large Icon Container */}
              <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl ${m.iconBg} ${m.iconColor} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 mb-2 sm:mb-4`}>
                {m.icon}
              </div>

              {/* Clean Title */}
              <h2 className="text-base sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight text-center">
                {m.title}
              </h2>
              
              {/* English Sub-label */}
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 mt-0.5 sm:mt-1 uppercase tracking-wider group-hover:text-slate-600 transition-colors text-center">
                {m.titleEn}
              </span>
            </button>
          ))}
        </div>

        {/* Centered Luxury Projects Catalog Shortcut */}
        <div className="flex items-center justify-center pt-1 sm:pt-3">
          <button
            onClick={() => setActiveTab('templates-catalog')}
            className="flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-2xl shadow-blue-500/40 transition transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 cursor-pointer border border-white/30 backdrop-blur-md text-center"
          >
            <Sparkles size={16} className="text-amber-300 animate-pulse shrink-0" />
            <span>كتالوج المشاريع والتصاميم الجاهزة والمواءمة الذكية</span>
          </button>
        </div>
      </div>

      {/* Absolute Bottom Clean Minimalist Footer */}
      <div className="absolute bottom-3 inset-x-0 z-20 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-300/90 font-medium select-none pointer-events-auto text-center px-4">
        <span>تطوير وبرمجة: <strong className="text-white font-mono font-bold">POM Agency</strong></span>
        <span className="text-slate-400/50">•</span>
        <span>للتواصل والاستفسارات:</span>
        <a
          href="mailto:sales@pom-agency.online"
          className="font-mono text-amber-300/90 hover:text-amber-200 underline underline-offset-2 transition"
          title="sales@pom-agency.online"
        >
          sales@pom-agency.online
        </a>
      </div>

      {/* Video Tutorial Modal */}
      <AppVideoTutorialModal />

      {/* AI Camera Room Scanner Modal */}
      <AICameraRoomScannerModal />
    </div>
  );
};
