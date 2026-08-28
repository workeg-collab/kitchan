import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { 
  X, 
  Compass, 
  Box, 
  Sparkles, 
  Camera, 
  Layers, 
  Scissors, 
  Calculator, 
  FileText, 
  Settings, 
  Download, 
  Play, 
  Users, 
  Building2, 
  LogOut, 
  LayoutDashboard, 
  Tv, 
  Eye, 
  Ruler, 
  Check, 
  ChevronLeft,
  Flame,
  Palette
} from 'lucide-react';

export const MobileMenuDrawer: React.FC = () => {
  const { 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    activeTab, 
    setActiveTab, 
    unit, 
    toggleUnit, 
    setIsExportModalOpen, 
    setIsSettingsModalOpen, 
    setIsVideoTutorialOpen, 
    setIsCameraScannerOpen 
  } = useUIStore();

  const { project } = useProjectStore();
  const { currentUser, logout, setIsUserModalOpen } = useAuthStore();
  const { setIsAdminModalOpen } = useSubscriptionStore();

  if (!isMobileMenuOpen) return null;

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans select-none animate-in fade-in duration-200">
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer (From Left or Right depending on RTL) */}
      <div className="relative w-[85vw] max-w-sm h-full bg-slate-900 text-white shadow-2xl border-r border-slate-800 flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-blue-500/30">
              FC
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate max-w-[170px]">
                {project.metadata.name || 'فرنتشر كاد برو'}
              </h3>
              <span className="text-[10px] text-slate-400 block font-mono">القائمة الشاملة</span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          
          {/* Quick Scanner & Tutorial Banner */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCameraScannerOpen(true);
              }}
              className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 text-center"
            >
              <Camera size={18} />
              <span className="text-[11px] leading-tight">مسح المطبخ بالكاميرا 📷</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsVideoTutorialOpen(true);
              }}
              className="p-3 bg-gradient-to-br from-rose-600 to-amber-700 hover:from-rose-500 hover:to-amber-600 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 text-center"
            >
              <Play size={18} fill="currentColor" />
              <span className="text-[11px] leading-tight">فيديو شرح البرنامج</span>
            </button>
          </div>

          {/* 1. Main Design Views Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block px-1">
              ساحة التصميم والرؤية:
            </span>

            <button
              onClick={() => navigateTo('2d-plan')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === '2d-plan' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass size={16} className="text-blue-400" />
                <span>مخطط الرسم الهندسي 2D Plan</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigateTo('3d-view')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === '3d-view' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box size={16} className="text-purple-400" />
                <span>المنظور ثلاثي الأبعاد 3D View</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigateTo('walkthrough-vr')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'walkthrough-vr' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-amber-300" />
                <span>جولة الواقع الافتراضي VR</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigateTo('visualization-studio')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'visualization-studio' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tv size={16} className="text-amber-400" />
                <span>استوديو الرندر والإضاءة</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>
          </div>

          {/* 2. Engineering & Pricing Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block px-1">
              الأسعار والتصنيع والتقطيع:
            </span>

            <button
              onClick={() => navigateTo('pricing-calculator')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'pricing-calculator' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calculator size={16} className="text-emerald-400" />
                <span>حاسبة الأسعار وعرض السعر (م² وش الوحدات)</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigateTo('manufacturing-bom')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'manufacturing-bom' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Scissors size={16} className="text-rose-400" />
                <span>كشوفات التقطيع وتوزيع الألواح BOM</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigateTo('elevations')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'elevations' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers size={16} className="text-indigo-400" />
                <span>الواجهات الرأسية (Elevations)</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigateTo('technical-drawings')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'technical-drawings' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-cyan-400" />
                <span>المخطط التنفيذي (Blueprint)</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>
          </div>

          {/* 3. Global Tools & Settings Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block px-1">
              الإعدادات والأدوات:
            </span>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSettingsModalOpen(true);
              }}
              className="w-full p-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-200 rounded-xl font-bold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Settings size={16} className="text-purple-400" />
                <span>الخامات والإعدادات وتعديل الأسعار</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsExportModalOpen(true);
              }}
              className="w-full p-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-200 rounded-xl font-bold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Download size={16} className="text-blue-400" />
                <span>تصدير المخطط، PDF، أو DXF</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={toggleUnit}
              className="w-full p-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-200 rounded-xl font-bold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Ruler size={16} className="text-amber-400" />
                <span>وحدة القياس الحالية: <strong className="text-amber-300 font-mono">{unit === 'cm' ? 'سنتيمتر (cm)' : 'ميليمتر (mm)'}</strong></span>
              </div>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-white font-mono">تبديل</span>
            </button>
          </div>

          {/* 4. Dashboard & Account */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <button
              onClick={() => navigateTo('dashboard')}
              className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2.5 transition"
            >
              <LayoutDashboard size={16} className="text-blue-400" />
              <span>العودة لصفحة الأقسام والمشاريع</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAdminModalOpen(true);
                }}
                className="w-full p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center gap-2.5 transition shadow-sm"
              >
                <Building2 size={16} />
                <span>لوحة تحكم الاشتراكات والشركات</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsUserModalOpen(true);
              }}
              className="w-full p-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-200 rounded-xl font-bold flex items-center gap-2.5 transition"
            >
              <Users size={16} className="text-slate-400" />
              <span>بيانات حسابي ({currentUser?.name || currentUser?.username || 'المستخدم'})</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="w-full p-2.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl font-bold flex items-center gap-2.5 transition border border-red-500/30"
            >
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
