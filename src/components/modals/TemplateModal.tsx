import React, { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { SAMPLE_PROJECT_MODERN_L } from '../../constants/sampleProjects';
import { ProjectData } from '../../types';
import { saveAs } from 'file-saver';
import { X, LayoutTemplate, Upload, Download, RefreshCcw } from 'lucide-react';

export const TemplateModal: React.FC = () => {
  const { project, setProject, loadSampleProject, resetProject } = useProjectStore();
  const { isTemplateModalOpen, setIsTemplateModalOpen } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isTemplateModalOpen) return null;

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${project.metadata.name.replace(/\s+/g, '_')}.kitchan.json`);
    setIsTemplateModalOpen(false);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as ProjectData;
        if (parsed.cabinets && parsed.room) {
          setProject(parsed);
          setIsTemplateModalOpen(false);
        } else {
          alert('ملف غير صالح أو تالف');
        }
      } catch (err) {
        console.error('JSON parse error:', err);
        alert('حدث خطأ أثناء قراءة ملف المشروع');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">النماذج الجاهزة وحفظ / فتح المشاريع</h2>
              <p className="text-xs text-slate-500">تحميل تصاميم مطابخ جاهزة أو استيراد وتصدير ملف المشروع الكامل</p>
            </div>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Sample Preset Template Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-blue-500 transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">
                  نموذج احترافي جاهز
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">{SAMPLE_PROJECT_MODERN_L.metadata.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{SAMPLE_PROJECT_MODERN_L.metadata.notes}</p>
              </div>

              <button
                onClick={() => {
                  loadSampleProject(SAMPLE_PROJECT_MODERN_L);
                  setIsTemplateModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition shrink-0 ml-3"
              >
                تحميل النموذج
              </button>
            </div>
          </div>

          {/* Import / Export JSON */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition flex flex-col items-center justify-center text-center group"
            >
              <Upload size={22} className="text-indigo-600 mb-1.5 group-hover:-translate-y-0.5 transition" />
              <span className="text-xs font-bold text-slate-900">استيراد مشروع (.json)</span>
              <span className="text-[10px] text-slate-400 mt-0.5">فتح ملف مشروع محفوظ مسبقاً</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />

            <button
              onClick={handleExportJSON}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition flex flex-col items-center justify-center text-center group"
            >
              <Download size={22} className="text-emerald-600 mb-1.5 group-hover:translate-y-0.5 transition" />
              <span className="text-xs font-bold text-slate-900">حفظ وتصدير المشروع</span>
              <span className="text-[10px] text-slate-400 mt-0.5">حفظ كملف بيانات .kitchan.json</span>
            </button>
          </div>

          {/* Reset Workspace */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من تفريغ ساحة العمل وبدء مشروع فارغ؟')) {
                  resetProject();
                  setIsTemplateModalOpen(false);
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl text-xs font-bold text-red-600 transition"
            >
              <RefreshCcw size={15} />
              <span>تفريغ وبدء مشروع مطبخ جديد فارغ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
