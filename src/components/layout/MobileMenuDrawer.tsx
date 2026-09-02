import React, { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { dbService } from '../../services/dbService';
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
  Building2, 
  LogOut, 
  LayoutDashboard, 
  Tv, 
  Eye, 
  Ruler, 
  Check, 
  ChevronLeft,
  FilePlus,
  Save,
  CopyPlus,
  Laptop,
  Upload,
  FolderOpen
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

  const { project, setProject, resetProject } = useProjectStore();
  const { currentUser, logout } = useAuthStore();
  const { setIsAdminModalOpen } = useSubscriptionStore();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!isMobileMenuOpen) return null;

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Quick Save
  const handleQuickSave = async () => {
    try {
      const tenantId = currentUser?.username || 'admin';
      await dbService.saveProjectForTenant(tenantId, project);
      showToast('تم حفظ المشروع بنجاح ✅');
    } catch (e) {
      alert('حدث خطأ أثناء حفظ المشروع');
    }
  };

  // Save As
  const handleSaveAs = async () => {
    const defaultName = `${project.metadata.name || 'مشروع جديد'} - نسخة`;
    const newName = window.prompt('أدخل اسماً جديداً للمشروع:', defaultName);
    if (!newName || !newName.trim()) return;

    try {
      const tenantId = currentUser?.username || 'admin';
      const clonedProject = {
        ...project,
        metadata: {
          ...project.metadata,
          id: 'proj_' + Date.now(),
          name: newName.trim(),
          updatedAt: new Date().toISOString(),
        }
      };
      await dbService.saveProjectForTenant(tenantId, clonedProject);
      setProject(clonedProject);
      showToast(`تم حفظ نسخة باسم "${newName.trim()}"! 💾✅`);
    } catch (e) {
      alert('حدث خطأ أثناء حفظ نسخة من المشروع');
    }
  };

  // Save to PC (.fcad)
  const handleSaveToPC = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `${project.metadata.name || 'مشروع'}.fcad`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`تم تنزيل وحفظ ملف (${filename}) على جهازك! 💻✅`);
  };

  // Import from PC
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.metadata && parsed.room && parsed.cabinets) {
          setProject(parsed);
          showToast('تم فتح المشروع بنجاح! 📂✅');
          setIsMobileMenuOpen(false);
        } else {
          alert('الملف غير صالح');
        }
      } catch (err) {
        alert('خطأ في قراءة الملف');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans select-none animate-in fade-in duration-200">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-60 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hidden File Input for Importing */}
      <input
        type="file"
        id="mobile-import-fcad-input"
        accept=".json,.fcad"
        onChange={handleImportFile}
        className="hidden"
      />

      {/* Dark Overlay Backdrop */}
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-[88vw] max-w-sm h-full bg-slate-900 text-white shadow-2xl border-r border-slate-800 flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        
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
              <span className="text-[11px] leading-tight">مسح بالكاميرا 📷</span>
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

          {/* ========================================================================= */}
          {/* 1. Project & File Operations (مشروع جديد، فتح، حفظ، حفظ باسم، حفظ للكمبيوتر) */}
          {/* ========================================================================= */}
          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-blue-400 font-bold block px-1">
              ملف المشروع والحفظ:
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  if (window.confirm('هل تريد بدء مشروع جديد فارغ؟')) {
                    resetProject();
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition text-right"
              >
                <FilePlus size={14} className="text-blue-400 shrink-0" />
                <span className="truncate">مشروع جديد</span>
              </button>

              <button
                onClick={() => navigateTo('dashboard')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition text-right"
              >
                <FolderOpen size={14} className="text-amber-400 shrink-0" />
                <span className="truncate">فتح مشروع</span>
              </button>

              <button
                onClick={handleQuickSave}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition text-right shadow-sm shadow-emerald-600/20"
              >
                <Save size={14} className="shrink-0" />
                <span className="truncate">حفظ (Save)</span>
              </button>

              <button
                onClick={handleSaveAs}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition text-right"
              >
                <CopyPlus size={14} className="text-cyan-400 shrink-0" />
                <span className="truncate">حفظ باسم...</span>
              </button>
            </div>

            <div className="pt-1 flex flex-col gap-1.5">
              <button
                onClick={handleSaveToPC}
                className="w-full p-2 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 rounded-xl font-bold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Laptop size={14} className="text-indigo-400" />
                  <span>حفظ على الكمبيوتر (.fcad)</span>
                </div>
                <Download size={14} />
              </button>

              <button
                onClick={() => document.getElementById('mobile-import-fcad-input')?.click()}
                className="w-full p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Upload size={14} className="text-purple-400" />
                  <span>فتح ملف من الكمبيوتر (استيراد)</span>
                </div>
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>

          {/* 2. Main Design Views Section */}
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
              onClick={() => navigateTo('presentation-mode')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'presentation-mode' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Eye size={16} className="text-amber-400" />
                <span>معاينة العميل والعرض النهائي (Presentation)</span>
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

          {/* 3. Engineering & Pricing Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block px-1">
              الأسعار والتصنيع والتقطيع:
            </span>

            <button
              onClick={() => navigateTo('pricing-calculator')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'pricing-calculator' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calculator size={16} className="text-emerald-400" />
                <span>حاسبة التكاليف وعروض الأسعار</span>
              </div>
              <ChevronLeft size={14} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigateTo('manufacturing-bom')}
              className={`w-full p-2.5 rounded-xl font-bold flex items-center justify-between transition ${
                activeTab === 'manufacturing-bom' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
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

          {/* 4. Global Tools & Settings Section */}
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
                <span>قائمة السيتينج (الخامات، الأسعار، التصنيع)</span>
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

          {/* 5. Dashboard & Account */}
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
                <span>لوحة تحكم المشتركين والشركات</span>
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('هل تريد تسجيل الخروج؟')) {
                  logout();
                  setIsMobileMenuOpen(false);
                }
              }}
              className="w-full p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl font-bold flex items-center gap-2.5 transition"
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
