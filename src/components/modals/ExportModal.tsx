import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { exportTechnicalPDF } from '../../utils/pdfExporter';
import { generateDXF } from '../../utils/dxfExporter';
import { exportCabinetScheduleCSV, exportCuttingListCSV } from '../../utils/csvExporter';
import { TRANSLATIONS } from '../../utils/i18n';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import { 
  X, 
  Download, 
  Layers, 
  FileSpreadsheet, 
  FileText, 
  Loader2 
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { project, updateMetadata } = useProjectStore();
  const { isExportModalOpen, setIsExportModalOpen, language } = useUIStore();
  const t = TRANSLATIONS[language];

  const [clientName, setClientName] = useState(project.metadata.clientName);
  const [designerName, setDesignerName] = useState(project.metadata.designerName);
  const [notes, setNotes] = useState(project.metadata.notes);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  if (!isExportModalOpen) return null;

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    updateMetadata({ clientName, designerName, notes });

    try {
      let render3DImage: string | undefined;
      const canvas3D = document.querySelector('canvas') as HTMLCanvasElement | null;
      if (canvas3D) {
        try {
          render3DImage = canvas3D.toDataURL('image/png');
        } catch (e) {
          console.warn('Could not capture 3D canvas directly:', e);
        }
      }

      await exportTechnicalPDF({
        project: {
          ...project,
          metadata: { ...project.metadata, clientName, designerName, notes },
        },
        render3DImage,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      setIsExportModalOpen(false);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportDXF = () => {
    const dxfString = generateDXF(project);
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    saveAs(blob, `${project.metadata.name.replace(/\s+/g, '_')}_AutoCAD.dxf`);
  };

  const handleExportScheduleCSV = () => {
    const csv = exportCabinetScheduleCSV(project);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${project.metadata.name}_Cabinet_Schedule.csv`);
  };

  const handleExportCuttingCSV = () => {
    const csv = exportCuttingListCSV(project);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${project.metadata.name}_Cutting_List.csv`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.exportModalTitle}</h2>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'توليد ملفات PDF الفنية وجداول التقطيع وملفات الأوتوكاد' : 'Generate complete architectural drawings and workshop documents'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Metadata Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              {language === 'ar' ? 'بيانات ترويسة المخطط' : 'Drawing Title Block Info'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 font-semibold">{t.clientName}</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Miller Residence"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-semibold">{t.designerName}</label>
                <input
                  type="text"
                  placeholder="e.g. KitchenCAD Studio"
                  value={designerName}
                  onChange={(e) => setDesignerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-semibold">{t.notes}</label>
              <textarea
                rows={2}
                placeholder="Special hardware, handleless profiles, edge banding specifications..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Primary PDF Package */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 relative overflow-hidden shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">
                  {language === 'ar' ? 'الموصى به للورش والمصانع' : 'RECOMMENDED'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{t.generatePDF}</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md">
                  {language === 'ar'
                    ? 'كتيب شامل يحتوي على ريندر 3D، المخطط الأفقي 2D، واجهات الجدران (A, B, C, D)، جدول الكبائن، وجدول تقطيع الألواح.'
                    : 'Includes 3D visual render, dimensioned 2D floor plan, wall elevations (A, B, C, D), cabinet schedule, and cutting list.'}
                </p>
              </div>

              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition shrink-0"
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{language === 'ar' ? 'جارٍ توليد PDF...' : 'Compiling PDF...'}</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>{language === 'ar' ? 'توليد الكتيب الفني' : 'Generate PDF'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alternative CAD & CSV Formats */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
              {language === 'ar' ? 'صيغ وبيانات للتصنيع والماكينات (CNC & CAD)' : 'CAD & Manufacturing Formats'}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleExportDXF}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition group shadow-xs"
              >
                <Layers size={18} className="text-cyan-600 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-slate-900">{t.downloadDXF}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{language === 'ar' ? 'طبقات فيكتور للأوتوكاد' : '2D CAD vector layers'}</div>
              </button>

              <button
                onClick={handleExportCuttingCSV}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition group shadow-xs"
              >
                <FileSpreadsheet size={18} className="text-emerald-600 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-slate-900">Cutting List (.CSV)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{language === 'ar' ? 'جدول التقطيع للماكينات' : 'Panel breakout for CNC'}</div>
              </button>

              <button
                onClick={handleExportScheduleCSV}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition group shadow-xs"
              >
                <FileText size={18} className="text-amber-600 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-slate-900">Schedule (.CSV)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{language === 'ar' ? 'جدول الكبائن إكسل' : 'Full cabinet schedule'}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
