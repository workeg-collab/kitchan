import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { ActiveTab, ProjectType } from '../../types';
import { TRANSLATIONS } from '../../utils/i18n';
import { FileMenu } from './FileMenu';
import { 
  Compass, 
  Box, 
  Layers, 
  FileText, 
  Scissors, 
  Calculator, 
  RotateCcw, 
  RotateCw, 
  Download, 
  PencilRuler, 
  Languages, 
  Check, 
  Users, 
  LogOut, 
  CookingPot, 
  Shirt, 
  BedDouble, 
  BookOpen, 
  LayoutDashboard, 
  Settings2, 
  Building2, 
  Sparkles,
  Settings,
  Save
} from 'lucide-react';
import { dbService } from '../../services/dbService';

export const TopNavbar: React.FC = () => {
  const { project, updateMetadata, undo, redo, canUndo, canRedo } = useProjectStore();
  const { currentUser, setIsUserModalOpen, logout } = useAuthStore();
  const { setIsAdminModalOpen } = useSubscriptionStore();
  const {
    activeTab,
    setActiveTab,
    language,
    toggleLanguage,
    unit,
    toggleUnit,
    setIsExportModalOpen,
    setIsRoomSketcherOpen,
    setIsCustomKitchenModalOpen,
    setIsSettingsModalOpen,
  } = useUIStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState(project.metadata.name);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const t = TRANSLATIONS[language];
  const projectType = project.metadata.projectType || 'kitchen';

  const handleTitleSave = () => {
    updateMetadata({ name: projectTitle.trim() || 'مشروع جديد' });
    setIsEditingTitle(false);
  };

  const handleQuickSave = async () => {
    try {
      const tenantId = currentUser?.username || 'admin';
      await dbService.saveProjectForTenant(tenantId, project);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const getModuleBadge = (type: ProjectType) => {
    switch (type) {
      case 'kitchen':
        return { label: 'مطابخ', icon: <CookingPot size={13} />, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'dressing':
        return { label: 'دريسينج', icon: <Shirt size={13} />, color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'bedroom':
        return { label: 'غرف نوم', icon: <BedDouble size={13} />, color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'library':
        return { label: 'مكتبات', icon: <BookOpen size={13} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'living':
        return { label: 'معيشة وصالون', icon: <Sparkles size={13} />, color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'مطابخ', icon: <CookingPot size={13} />, color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  const moduleInfo = getModuleBadge(projectType);

  const mainTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: '2d-plan', label: t.plan2D, icon: <Compass size={14} /> },
    { id: '3d-view', label: t.view3D, icon: <Box size={14} /> },
    { id: 'walkthrough-vr', label: 'جولة VR', icon: <Sparkles size={14} className="text-purple-600" /> },
    { id: 'visualization-studio', label: 'استوديو الرندر', icon: <Layers size={14} className="text-amber-600" /> },
    { id: 'presentation-mode', label: 'عرض العميل', icon: <Users size={14} className="text-emerald-600" /> },
    { id: 'templates-catalog', label: 'قوالب جاهزة', icon: <Sparkles size={14} className="text-blue-600" /> },
    { id: 'elevations', label: t.elevations, icon: <Layers size={14} /> },
    { id: 'technical-drawings', label: t.blueprint, icon: <FileText size={14} /> },
    { id: 'manufacturing-bom', label: 'التقطيع', icon: <Scissors size={14} /> },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-3 md:px-4 flex items-center justify-between z-30 shadow-xs select-none font-sans">
      {/* LEFT SECTION: Brand, File Menu & Project Name */}
      <div className="flex items-center gap-2">
        {/* Back to Projects Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200"
          title="العودة لصفحة الأقسام والمشاريع"
        >
          <LayoutDashboard size={14} className="text-blue-600" />
          <span className="hidden md:inline">المشاريع</span>
        </button>

        {/* 1. THE FILE MENU (ملف) */}
        <FileMenu />

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

        {/* Current Module Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shadow-xs ${moduleInfo.color}`}>
          {moduleInfo.icon}
          <span>{moduleInfo.label}</span>
        </div>

        {/* Editable Title */}
        <div className="flex items-center gap-1.5">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                autoFocus
                className="px-2 py-0.5 border border-blue-500 rounded text-xs font-bold text-slate-900 bg-white shadow-xs focus:outline-none"
              />
              <button onClick={handleTitleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-black text-slate-800 hover:text-blue-600 cursor-pointer truncate max-w-[130px] lg:max-w-[180px]"
              title="انقر لتعديل اسم المشروع"
            >
              {project.metadata.name}
            </div>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="hidden lg:flex items-center gap-0.5 text-slate-500">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1 rounded transition ${canUndo ? 'hover:text-slate-900 hover:bg-slate-100' : 'opacity-30 cursor-not-allowed'}`}
            title="تراجع"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1 rounded transition ${canRedo ? 'hover:text-slate-900 hover:bg-slate-100' : 'opacity-30 cursor-not-allowed'}`}
            title="إعادة"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* CENTER SECTION: Ultra-Clean Segmented Views Bar */}
      <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 gap-1">
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* RIGHT SECTION: Quick Actions */}
      <div className="flex items-center gap-1.5">
        {/* Custom Kitchen / Unit Builder */}
        <button
          onClick={() => setIsCustomKitchenModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-extrabold shadow-sm transition transform active:scale-95"
          title="مصمم الوحدات والمطابخ المخصص"
        >
          <Sparkles size={14} />
          <span className="hidden xl:inline">مطابخ كاستوم</span>
        </button>

        {/* Quick Save */}
        <button
          onClick={handleQuickSave}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            saveSuccess
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}
          title="حفظ المشروع"
        >
          {saveSuccess ? <Check size={14} /> : <Save size={14} />}
          <span className="hidden lg:inline">{saveSuccess ? 'تم الحفظ' : 'حفظ'}</span>
        </button>

        {/* Export Technical Package */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
          title="تصدير المخططات الهندسية والـ PDF"
        >
          <Download size={14} />
          <span className="hidden sm:inline">تصدير</span>
        </button>

        {/* Comprehensive Settings Modal */}
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200"
          title="إعدادات المشروع والتصنيع"
        >
          <Settings size={14} className="text-slate-700" />
        </button>

        {/* Super Admin Licenses & Catalog */}
        {currentUser?.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('admin-catalog')}
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-200"
              title="إدارة الكتالوج والخامات والقوالب"
            >
              <Layers size={14} className="text-purple-600" />
              <span>إدارة الكتالوج</span>
            </button>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hidden 2xl:flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
              title="لوحة تحكم الاشتراكات والشركات"
            >
              <Building2 size={14} />
              <span>الاشتراكات</span>
            </button>
          </>
        )}

        {/* Unit Toggle mm / cm */}
        <button
          onClick={toggleUnit}
          className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-xs font-mono font-bold text-slate-700 transition"
          title="تبديل وحدة القياس"
        >
          <span className={`px-1.5 py-0.5 rounded-lg ${unit === 'mm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>مم</span>
          <span className={`px-1.5 py-0.5 rounded-lg ${unit === 'cm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>سم</span>
        </button>

        {/* User Account */}
        <button
          onClick={() => setIsUserModalOpen(true)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200"
          title="إدارة الحساب"
        >
          <Users size={14} className="text-slate-700" />
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            if (window.confirm('هل تريد تسجيل الخروج؟')) {
              logout();
            }
          }}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
          title="تسجيل الخروج"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
};
