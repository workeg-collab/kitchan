import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { dbService } from '../../services/dbService';
import { 
  File, 
  FolderOpen, 
  FilePlus, 
  Save, 
  Download, 
  Settings, 
  FileSpreadsheet, 
  FileText, 
  Image, 
  LayoutDashboard, 
  ChevronRight, 
  Check,
  Code
} from 'lucide-react';

export const FileMenu: React.FC = () => {
  const { project, setProject, resetProject } = useProjectStore();
  const { 
    setActiveTab, 
    setIsExportModalOpen, 
    setIsRoomSketcherOpen,
    setIsCustomKitchenModalOpen 
  } = useUIStore();
  const { currentUser } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [showSaveAsSubmenu, setShowSaveAsSubmenu] = useState(false);

  // Quick Save Project to Local Database & Storage
  const handleQuickSave = async () => {
    try {
      const tenantId = currentUser?.username || 'admin';
      await dbService.saveProjectForTenant(tenantId, project);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء حفظ المشروع');
    }
  };

  // Export Project File as JSON (.fcad)
  const handleExportFCAD = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.metadata.name || 'مشروع'}_${project.metadata.projectType}.fcad`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  // Export CSV Cutting List
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'الكود,اسم الوحدة,التصنيف,العرض (مم),الارتفاع (مم),العمق (مم),الرفوف,الأدراج\n';
    project.cabinets.forEach((c) => {
      csvContent += `${c.id},"${c.name}",${c.category},${c.width},${c.height},${c.depth},${c.shelfCount || 0},${c.drawerCount || 0}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${project.metadata.name}_cutting_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  // Import JSON Project (.fcad)
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.metadata && parsed.room && parsed.cabinets) {
          setProject(parsed);
          alert('تم فتح واستيراد المشروع بنجاح!');
          setIsOpen(false);
        } else {
          alert('الملف غير صالح أو لا يحتوي على بنية مشروع كيتشن كاد');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف المشروع');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      {/* File Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
        }`}
      >
        <File size={14} className={isOpen ? 'text-white' : 'text-blue-600'} />
        <span>ملف</span>
      </button>

      {/* Save Toast Indicator */}
      {saveToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold z-50 animate-in fade-in slide-in-from-top-3">
          <Check size={16} />
          <span>تم حفظ المشروع بنجاح في قاعدة البيانات ✅</span>
        </div>
      )}

      {/* Hidden File Input for Importing .fcad files */}
      <input
        type="file"
        id="import-fcad-input"
        accept=".json,.fcad"
        onChange={handleImportFile}
        className="hidden"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-2 text-xs text-slate-800 animate-in fade-in zoom-in-95 select-none font-sans">
            {/* 1. New Project */}
            <button
              onClick={() => {
                if (window.confirm('هل تريد بدء مشروع جديد فارغ؟ تأكد من حفظ مشروعك الحالي أولاً.')) {
                  resetProject();
                  setIsOpen(false);
                }
              }}
              className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition text-right group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                  <FilePlus size={15} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">مشروع جديد (New Project)</div>
                  <div className="text-[10px] text-slate-400">بدء مسقط معماري جديد فارغ</div>
                </div>
              </div>
            </button>

            {/* 2. Open Project From DB / Dashboard */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition text-right group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
                  <FolderOpen size={15} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">فتح مشروع (Open Project)</div>
                  <div className="text-[10px] text-slate-400">استعراض مشاريع الشركة السابقة</div>
                </div>
              </div>
            </button>

            {/* 3. Open From Disk (.fcad / JSON) */}
            <button
              onClick={() => {
                document.getElementById('import-fcad-input')?.click();
              }}
              className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition text-right group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                  <Code size={15} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">استيراد ملف مشروع (.fcad)</div>
                  <div className="text-[10px] text-slate-400">فتح ملف من جهاز الكمبيوتر</div>
                </div>
              </div>
            </button>

            <div className="my-1.5 border-t border-slate-100" />

            {/* 4. Quick Save */}
            <button
              onClick={handleQuickSave}
              className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition text-right group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Save size={15} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>حفظ المشروع (Save)</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Ctrl+S</span>
                  </div>
                  <div className="text-[10px] text-slate-400">حفظ دائم في قاعدة البيانات</div>
                </div>
              </div>
            </button>

            {/* 5. Save As / Export Submenu */}
            <div className="relative">
              <button
                onClick={() => setShowSaveAsSubmenu(!showSaveAsSubmenu)}
                onMouseEnter={() => setShowSaveAsSubmenu(true)}
                className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition text-right group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Download size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">حفظ وتصدير بصيغة... (Save As)</div>
                    <div className="text-[10px] text-slate-400">PDF, CAD, Excel, أو ملف FCAD</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 rotate-180" />
              </button>

              {/* Submenu */}
              {showSaveAsSubmenu && (
                <div 
                  className="absolute right-full top-0 mr-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 text-xs space-y-1 animate-in fade-in"
                  onMouseLeave={() => setShowSaveAsSubmenu(false)}
                >
                  <button
                    onClick={handleExportFCAD}
                    className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-right transition"
                  >
                    <Code size={14} className="text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900">ملف مشروع (.fcad / JSON)</div>
                      <div className="text-[10px] text-slate-400">للمشاركة والتعديل لاحقاً</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsExportModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-right transition"
                  >
                    <FileText size={14} className="text-red-600" />
                    <div>
                      <div className="font-bold text-slate-900">تقرير هندسي PDF تنفيذي</div>
                      <div className="text-[10px] text-slate-400">المساقط، الواجهات، والأسعار</div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-right transition"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900">جدول التقطيع والتكلفة (Excel / CSV)</div>
                      <div className="text-[10px] text-slate-400">لقوائم تقطيع المنشار</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsExportModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-right transition"
                  >
                    <Image size={14} className="text-blue-600" />
                    <div>
                      <div className="font-bold text-slate-900">صورة ثلاثية الأبعاد 3D عالية الدقة</div>
                      <div className="text-[10px] text-slate-400">PNG / JPG للمعاينة للعميل</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <div className="my-1.5 border-t border-slate-100" />

            {/* 6. Comprehensive Settings */}
            <button
              onClick={() => {
                useUIStore.getState().setIsSettingsModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition text-right group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-800 group-hover:text-white transition">
                  <Settings size={15} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">إعدادات المشروع والتصنيع (Settings)</div>
                  <div className="text-[10px] text-slate-400">العملة، الخامات، سمك الخشب، والأسعار</div>
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
