import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
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
  Settings2
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const { project, updateMetadata, undo, redo, canUndo, canRedo } = useProjectStore();
  const { currentUser, setIsUserModalOpen, logout } = useAuthStore();
  const {
    activeTab,
    setActiveTab,
    unit,
    toggleUnit,
    language,
    toggleLanguage,
    setIsRoomSketcherOpen,
    setIsExportModalOpen,
    setIsTemplateModalOpen,
    setIsManufacturingSystemModalOpen,
  } = useUIStore();

  const t = TRANSLATIONS[language];
  const projectType = project.metadata.projectType || 'kitchen';
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.metadata.name);

  const handleSaveTitle = () => {
    updateMetadata({ name: tempTitle.trim() || 'مشروع تصميم جديد' });
    setIsEditingTitle(false);
  };

  const getModuleBadge = (type: ProjectType) => {
    switch (type) {
      case 'dressing':
        return { label: 'دريسنج روم', icon: <Shirt size={13} />, color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'bedroom':
        return { label: 'غرف نوم', icon: <BedDouble size={13} />, color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'library':
        return { label: 'مكتبات وشاشات', icon: <BookOpen size={13} />, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'kitchen':
      default:
        return { label: 'مطابخ', icon: <CookingPot size={13} />, color: 'bg-blue-50 text-blue-800 border-blue-200' };
    }
  };

  const moduleInfo = getModuleBadge(projectType);

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'لوحة المشاريع', icon: <LayoutDashboard size={15} /> },
    { id: '2d-plan', label: t.plan2D, icon: <Compass size={15} /> },
    { id: '3d-view', label: t.view3D, icon: <Box size={15} /> },
    { id: 'elevations', label: t.elevations, icon: <Layers size={15} /> },
    { id: 'technical-drawings', label: t.blueprint, icon: <FileText size={15} /> },
    { id: 'cabinet-schedule', label: t.schedule, icon: <FileSpreadsheet size={15} /> },
    { id: 'manufacturing-bom', label: t.manufacturing, icon: <Scissors size={15} /> },
    { id: 'pricing-calculator', label: t.pricingCalculator, icon: <Calculator size={15} /> },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 select-none z-30 relative shadow-sm">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 group text-left"
          title="العودة للوحة الأقسام والمشاريع"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <span className="font-mono font-black text-white text-sm tracking-tighter">FC</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 hidden md:inline">
            فرنتشر كاد <span className="text-blue-600 font-extrabold">برو</span>
          </span>
        </button>

        {/* Module Badge */}
        <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${moduleInfo.color}`}>
          {moduleInfo.icon}
          <span>{moduleInfo.label}</span>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

        {/* Project Title Quick Edit */}
        {isEditingTitle ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="px-2.5 py-1 bg-slate-50 border border-blue-500 rounded-md text-xs text-slate-900 focus:outline-none w-40 font-semibold"
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setTempTitle(project.metadata.name);
              setIsEditingTitle(true);
            }}
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2 py-1 rounded hover:bg-slate-100 transition max-w-[150px] truncate"
            title="انقر لتعديل اسم المشروع"
          >
            {project.metadata.name}
          </button>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 text-slate-500">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition ${
              canUndo ? 'hover:text-slate-900 hover:bg-slate-100' : 'opacity-30 cursor-not-allowed'
            }`}
            title="تراجع"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition ${
              canRedo ? 'hover:text-slate-900 hover:bg-slate-100' : 'opacity-30 cursor-not-allowed'
            }`}
            title="إعادة"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Actions Right Toolbar */}
      <div className="flex items-center gap-2">
        {/* Manufacturing Systems & Profiles Builder */}
        <button
          onClick={() => setIsManufacturingSystemModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition border border-slate-200"
          title="قواعد وأنظمة التصنيع والقطاعات"
        >
          <Settings2 size={14} className="text-blue-600" />
          <span className="hidden xl:inline">أنظمة التصنيع</span>
        </button>

        {/* User Management */}
        <button
          onClick={() => setIsUserModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition border border-blue-200 shadow-xs"
          title="إدارة المستخدمين"
        >
          <Users size={14} className="text-blue-600" />
          <span className="hidden md:inline">{currentUser?.username || 'admin'}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border border-slate-200"
          title="تغيير اللغة"
        >
          <Languages size={14} className="text-blue-600" />
          <span className="hidden sm:inline">{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Unit Toggle mm / cm */}
        <button
          onClick={toggleUnit}
          className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-mono font-bold text-slate-700 transition"
          title="تبديل وحدة القياس"
        >
          <span className={`px-1.5 py-0.5 rounded ${unit === 'mm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>مم</span>
          <span className={`px-1.5 py-0.5 rounded ${unit === 'cm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>سم</span>
        </button>

        {/* Room Sketcher */}
        <button
          onClick={() => setIsRoomSketcherOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-200"
          title="رسم وتعديل أبعاد الغرفة"
        >
          <PencilRuler size={14} className="text-indigo-600" />
          <span className="hidden 2xl:inline">{t.sketchRoom}</span>
        </button>

        {/* Export Technical Package Modal */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 transition"
        >
          <Download size={14} />
          <span>{t.exportPackage}</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            if (window.confirm('هل تريد تسجيل الخروج؟')) {
              logout();
            }
          }}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          title="تسجيل الخروج"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
