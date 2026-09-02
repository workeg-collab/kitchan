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
  Scissors, 
  Calculator, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Check, 
  Users, 
  LogOut, 
  CookingPot, 
  Shirt, 
  BedDouble, 
  BookOpen, 
  LayoutDashboard, 
  Building2, 
  Sparkles,
  Settings,
  Save,
  Pencil,
  ChevronDown,
  Camera,
  FolderOpen,
  Play,
  Menu,
  Eye
} from 'lucide-react';
import { FileMenu } from './FileMenu';
import { dbService } from '../../services/dbService';
import { soundEffects } from '../../services/soundEffectsService';

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
    setIsSettingsModalOpen,
    setIsManufacturingSystemModalOpen,
    setIsVideoTutorialOpen,
    setIsCameraScannerOpen,
    setIsMobileMenuOpen,
  } = useUIStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState(project.metadata.name);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isViewsDropdownOpen, setIsViewsDropdownOpen] = useState(false);

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
      soundEffects.playSuccess();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
      soundEffects.playError();
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
      default:
        return { label: 'مطابخ', icon: <CookingPot size={13} />, color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  const moduleInfo = getModuleBadge(projectType);

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-3 md:px-4 flex items-center justify-between z-30 shadow-xs select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. LEFT SECTION: BRAND, PROJECT TITLE, UNDO/REDO & QUICK SAVE             */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2.5">
        {/* Back to Projects Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          title="العودة لصفحة الأقسام والمشاريع"
        >
          <LayoutDashboard size={14} className="text-blue-400" />
          <span className="hidden sm:inline">المشاريع</span>
        </button>

        {/* Project File Menu */}
        <FileMenu />

        {/* Category Pill Badge */}
        <div className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${moduleInfo.color}`}>
          {moduleInfo.icon}
          <span>{moduleInfo.label}</span>
        </div>

        {/* Project Name (Click to edit) */}
        <div className="flex items-center">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                className="px-2 py-1 text-xs font-bold text-slate-900 bg-slate-100 border border-blue-500 rounded-lg outline-none w-44"
              />
              <button onClick={handleTitleSave} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                <Check size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setProjectTitle(project.metadata.name);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-lg transition text-right group max-w-[180px] sm:max-w-[240px]"
              title="انقر لتعديل اسم المشروع"
            >
              <span className="text-xs font-bold text-slate-800 truncate block">
                {project.metadata.name || 'مشروع جديد'}
              </span>
              <Pencil size={11} className="text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </button>
          )}
        </div>

        {/* Undo / Redo / Quick Save Controls Pod */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg transition ${
              canUndo ? 'text-slate-700 hover:bg-white hover:text-blue-600 shadow-xs' : 'text-slate-300 cursor-not-allowed'
            }`}
            title="تراجع (Ctrl+Z)"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg transition ${
              canRedo ? 'text-slate-700 hover:bg-white hover:text-blue-600 shadow-xs' : 'text-slate-300 cursor-not-allowed'
            }`}
            title="إعادة (Ctrl+Y)"
          >
            <RotateCw size={14} />
          </button>
          <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
          <button
            onClick={handleQuickSave}
            className={`p-1.5 rounded-lg transition ${
              saveSuccess ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-white hover:text-blue-600'
            }`}
            title={saveSuccess ? 'تم الحفظ بنجاح!' : 'حفظ فوري في السحابة (Ctrl+S)'}
          >
            {saveSuccess ? <Check size={14} /> : <Save size={14} className="text-blue-600" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTER SECTION: WORKSPACE MODE SEGMENTED CONTROL                       */}
      {/* ========================================================================= */}
      {/* Mobile Compact View Switcher */}
      <div className="flex lg:hidden items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('2d-plan')}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
            activeTab === '2d-plan' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => setActiveTab('3d-view')}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
            activeTab === '3d-view' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          3D
        </button>
      </div>

      <nav className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
        {/* 2D Plan */}
        <button
          onClick={() => setActiveTab('2d-plan')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === '2d-plan'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Compass size={14} />
          <span>مخطط 2D</span>
        </button>

        {/* 3D Realistic */}
        <button
          onClick={() => setActiveTab('3d-view')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === '3d-view'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Box size={14} />
          <span>منظور 3D</span>
        </button>

        {/* Client Presentation / Showcase */}
        <button
          onClick={() => setActiveTab('presentation-mode')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'presentation-mode'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
          title="معاينة العميل بعد الانتهاء، العرض النهائي، دوران 360، وتصدير التقارير"
        >
          <Eye size={14} />
          <span>معاينة العميل</span>
        </button>

        {/* Render Studio */}
        <button
          onClick={() => setActiveTab('visualization-studio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'visualization-studio'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Camera size={14} />
          <span>استوديو الرندر</span>
        </button>

        {/* VR Walkthrough */}
        <button
          onClick={() => setActiveTab('walkthrough-vr')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'walkthrough-vr'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles size={14} />
          <span>جولة VR</span>
        </button>

        {/* Engineering & Manufacturing Menu */}
        <div className="relative">
          <button
            onClick={() => setIsViewsDropdownOpen(!isViewsDropdownOpen)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              ['elevations', 'technical-drawings', 'manufacturing-bom', 'pricing-calculator', 'cabinet-schedule'].includes(activeTab)
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Scissors size={14} />
            <span>الهندسة والتصنيع</span>
            <ChevronDown size={12} />
          </button>

          {isViewsDropdownOpen && (
            <div className="absolute top-full mt-1.5 right-0 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 font-sans">
              <button
                onClick={() => {
                  setActiveTab('elevations');
                  setIsViewsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-right transition ${
                  activeTab === 'elevations' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Layers size={14} className="text-blue-500" />
                <span>الواجهات الرأسية (Elevations)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('technical-drawings');
                  setIsViewsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-right transition ${
                  activeTab === 'technical-drawings' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText size={14} className="text-indigo-500" />
                <span>المخطط التنفيذي (Blueprint)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('manufacturing-bom');
                  setIsViewsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-right transition ${
                  activeTab === 'manufacturing-bom' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Scissors size={14} className="text-emerald-500" />
                <span>قوائم التقطيع وتوزيع الألواح (BOM)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('pricing-calculator');
                  setIsViewsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-right transition ${
                  activeTab === 'pricing-calculator' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Calculator size={14} className="text-amber-500" />
                <span>حاسبة التكاليف وعروض الأسعار</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                onClick={() => {
                  setIsManufacturingSystemModalOpen(true);
                  setIsViewsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-right text-purple-700 hover:bg-purple-50 transition"
              >
                <Settings size={14} className="text-purple-600" />
                <span>أنظمة وتفصيل كيتشن ميكر (KM)</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. RIGHT SECTION: HARMONIZED COMPACT TOOLS & ACCOUNT                      */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex items-center gap-1.5">
        {/* Unit Toggle cm / mm */}
        <button
          onClick={toggleUnit}
          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold transition border border-slate-200"
          title={`تبديل وحدة القياس (الحالية: ${unit})`}
        >
          {unit === 'cm' ? 'سم' : 'مم'}
        </button>

        {/* Unified Tool Icons Group */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 gap-0.5">
          {/* Camera Scanner */}
          <button
            onClick={() => setIsCameraScannerOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-emerald-700 hover:bg-white rounded-lg text-xs font-bold transition"
            title="مسح المطبخ بالكاميرا واستخراج تصميم بالذكاء الاصطناعي"
          >
            <Camera size={14} className="text-emerald-600" />
            <span className="hidden xl:inline text-[11px]">كاميرا AI</span>
          </button>

          {/* Export / PDF */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-blue-700 hover:bg-white rounded-lg text-xs font-bold transition"
            title="تصدير المخطط أو ملفات PDF"
          >
            <Download size={14} className="text-blue-600" />
            <span className="hidden xl:inline text-[11px]">تصدير</span>
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-purple-700 hover:bg-white rounded-lg text-xs font-bold transition"
            title="إعدادات المشروع والخامات والأسعار"
          >
            <Settings size={14} className="text-purple-600" />
            <span className="hidden xl:inline text-[11px]">الإعدادات</span>
          </button>

          {/* Tutorial */}
          <button
            onClick={() => setIsVideoTutorialOpen(true)}
            className="p-1.5 text-slate-700 hover:text-rose-600 hover:bg-white rounded-lg transition"
            title="فيديو شرح استخدام البرنامج"
          >
            <Play size={13} fill="currentColor" className="text-rose-500" />
          </button>
        </div>

        {/* User Account / Admin Badge */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
            title="لوحة الإدارة والاشتراكات"
          >
            <Building2 size={13} />
            <span>الإدارة</span>
          </button>
        )}

        <button
          onClick={() => setIsUserModalOpen(true)}
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition"
          title={currentUser?.name || currentUser?.username || 'المستخدم'}
        >
          <Users size={15} />
        </button>
      </div>

      {/* Mobile Controls (lg:hidden) */}
      <div className="flex lg:hidden items-center gap-1.5">
        {/* Camera Shortcut */}
        <button
          onClick={() => setIsCameraScannerOpen(true)}
          className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition shadow-2xs"
          title="مسح بالكاميرا"
        >
          <Camera size={16} />
        </button>

        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition shadow-sm flex items-center justify-center"
          title="فتح القائمة الشاملة"
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
};
