import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { ActiveTab, ProjectType } from '../../types';
import { TRANSLATIONS } from '../../utils/i18n';
import { 
  Compass, 
  Box, 
  Layers, 
  FileText, 
  FileSpreadsheet, 
  Scissors, 
  Calculator, 
  RotateCcw, 
  RotateCw, 
  Download, 
  PencilRuler, 
  Languages, 
  Check, 
  LayoutTemplate,
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
  Sliders
} from 'lucide-react';

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
    setIsManufacturingSystemModalOpen,
    setIsCustomKitchenModalOpen,
    setIsTemplateModalOpen,
  } = useUIStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState(project.metadata.name);

  const t = TRANSLATIONS[language];
  const projectType = project.metadata.projectType || 'kitchen';

  const handleTitleSave = () => {
    updateMetadata({ name: projectTitle.trim() || 'مشروع جديد' });
    setIsEditingTitle(false);
  };

  const getModuleBadge = (type: ProjectType) => {
    switch (type) {
      case 'kitchen':
        return { label: 'تصميم المطابخ', icon: <CookingPot size={13} />, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'dressing':
        return { label: 'الدريسينج روم', icon: <Shirt size={13} />, color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'bedroom':
        return { label: 'أثاث غرف النوم', icon: <BedDouble size={13} />, color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'library':
        return { label: 'المكتبات ووحدات الشاشة', icon: <BookOpen size={13} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'تصميم المطابخ', icon: <CookingPot size={13} />, color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  const moduleInfo = getModuleBadge(projectType);

  const designTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: '2d-plan', label: t.plan2D, icon: <Compass size={14} /> },
    { id: '3d-view', label: t.view3D, icon: <Box size={14} /> },
    { id: 'elevations', label: t.elevations, icon: <Layers size={14} /> },
    { id: 'technical-drawings', label: t.blueprint, icon: <FileText size={14} /> },
  ];

  const factoryTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'manufacturing-bom', label: 'تقطيع الألواح والأعواد', icon: <Scissors size={14} /> },
    { id: 'cabinet-schedule', label: t.schedule, icon: <FileSpreadsheet size={14} /> },
    { id: 'pricing-calculator', label: t.pricingCalculator, icon: <Calculator size={14} /> },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-3 md:px-4 flex items-center justify-between z-30 shadow-xs select-none font-sans">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-2.5">
        {/* Back to Projects Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 shadow-xs"
          title="العودة لصفحة الأقسام والمشاريع"
        >
          <LayoutDashboard size={14} className="text-blue-600" />
          <span className="hidden sm:inline">لوحة المشاريع</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Current Module Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shadow-xs ${moduleInfo.color}`}>
          {moduleInfo.icon}
          <span className="hidden sm:inline">{moduleInfo.label}</span>
        </div>

        {/* Editable Title */}
        <div className="flex items-center gap-1.5 ml-1">
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
              className="text-xs font-black text-slate-800 hover:text-blue-600 cursor-pointer truncate max-w-[150px] lg:max-w-[200px]"
              title="انقر لتعديل اسم المشروع"
            >
              {project.metadata.name}
            </div>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 text-slate-500">
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

      {/* Main Navigation Tabs Grouped Sleekly */}
      <div className="flex items-center gap-2">
        {/* Design Views Group */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-0.5">
          {designTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab.icon}
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Factory & Costing Group */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-0.5">
          {factoryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? 'bg-white text-emerald-600 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab.icon}
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions Right Toolbar */}
      <div className="flex items-center gap-1.5">
        {/* Custom Kitchen / Unit Builder Action */}
        <button
          onClick={() => setIsCustomKitchenModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-extrabold shadow-sm transition transform active:scale-95"
          title="مصمم الوحدات والمطابخ المخصص"
        >
          <Sparkles size={14} />
          <span className="hidden lg:inline">مطابخ كاستوم</span>
        </button>

        {/* Manufacturing Systems & Profiles */}
        <button
          onClick={() => setIsManufacturingSystemModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-200"
          title="قواعد وأنظمة التصنيع والقطاعات"
        >
          <Settings2 size={14} className="text-blue-600" />
          <span className="hidden 2xl:inline">أنظمة التصنيع</span>
        </button>

        {/* Super Admin Subscription Dashboard */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
            title="لوحة تحكم الاشتراكات والشركات"
          >
            <Building2 size={14} />
            <span className="hidden 2xl:inline">الاشتراكات</span>
          </button>
        )}

        {/* Room Sketcher */}
        <button
          onClick={() => setIsRoomSketcherOpen(true)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200"
          title="رسم وتعديل أبعاد الغرفة"
        >
          <PencilRuler size={14} className="text-indigo-600" />
        </button>

        {/* Unit Toggle mm / cm */}
        <button
          onClick={toggleUnit}
          className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-xs font-mono font-bold text-slate-700 transition"
          title="تبديل وحدة القياس"
        >
          <span className={`px-1.5 py-0.5 rounded-lg ${unit === 'mm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>مم</span>
          <span className={`px-1.5 py-0.5 rounded-lg ${unit === 'cm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>سم</span>
        </button>

        {/* Export Technical Package Modal */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Download size={14} />
          <span className="hidden sm:inline">{t.exportPackage}</span>
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
