import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { ActiveTab } from '../../types';
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
  LayoutTemplate 
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const { project, updateMetadata, undo, redo, canUndo, canRedo } = useProjectStore();
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
  } = useUIStore();

  const t = TRANSLATIONS[language];
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.metadata.name);

  const handleSaveTitle = () => {
    updateMetadata({ name: tempTitle.trim() || 'تصميم مطبخ جديد' });
    setIsEditingTitle(false);
  };

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: '2d-plan', label: t.plan2D, icon: <Compass size={16} /> },
    { id: '3d-view', label: t.view3D, icon: <Box size={16} /> },
    { id: 'elevations', label: t.elevations, icon: <Layers size={16} /> },
    { id: 'technical-drawings', label: t.blueprint, icon: <FileText size={16} /> },
    { id: 'cabinet-schedule', label: t.schedule, icon: <FileSpreadsheet size={16} /> },
    { id: 'manufacturing-bom', label: t.manufacturing, icon: <Scissors size={16} /> },
    { id: 'pricing-calculator', label: language === 'ar' ? 'حاسبة الأمتار والتسعير' : 'Pricing & Meters', icon: <Calculator size={16} /> },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 select-none z-30 relative shadow-sm">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="font-mono font-black text-white text-sm tracking-tighter">KC</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 hidden md:inline">
            {language === 'ar' ? 'كيتشن كاد' : 'KITCHEN'}<span className="text-blue-600 font-extrabold">{language === 'ar' ? ' برو' : 'CAD PRO'}</span>
          </span>
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
              className="px-2.5 py-1 bg-slate-50 border border-blue-500 rounded-md text-xs text-slate-900 focus:outline-none w-48 font-semibold"
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
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2 py-1 rounded hover:bg-slate-100 transition max-w-[200px] truncate"
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
            <RotateCcw size={15} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition ${
              canRedo ? 'hover:text-slate-900 hover:bg-slate-100' : 'opacity-30 cursor-not-allowed'
            }`}
            title="إعادة"
          >
            <RotateCw size={15} />
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

      {/* Actions & Settings Right Toolbar */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border border-slate-200"
          title="تغيير اللغة"
        >
          <Languages size={14} className="text-blue-600" />
          <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* Unit Toggle mm / cm */}
        <button
          onClick={toggleUnit}
          className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-mono font-bold text-slate-700 transition"
          title="تبديل وحدة القياس"
        >
          <span className={`px-2 py-1 rounded ${unit === 'mm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>مم</span>
          <span className={`px-2 py-1 rounded ${unit === 'cm' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>سم</span>
        </button>

        {/* Room Sketcher */}
        <button
          onClick={() => setIsRoomSketcherOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-200"
          title="رسم وتعديل أبعاد الغرفة"
        >
          <PencilRuler size={14} className="text-indigo-600" />
          <span className="hidden xl:inline">{t.sketchRoom}</span>
        </button>

        {/* Templates */}
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-200"
          title="نماذج جاهزة"
        >
          <LayoutTemplate size={14} />
          <span className="hidden xl:inline">{t.templates}</span>
        </button>

        {/* Export Technical Package Modal */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 transition"
        >
          <Download size={15} />
          <span>{t.exportPackage}</span>
        </button>
      </div>
    </header>
  );
};
