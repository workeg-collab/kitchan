import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { exportTechnicalPDF } from '../../utils/pdfExporter';
import { generateDXF } from '../../utils/dxfExporter';
import { exportCabinetScheduleCSV, exportCuttingListCSV, exportHardwareBOMCSV } from '../../utils/csvExporter';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import { 
  X, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  Loader2, 
  Sparkles 
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { project, updateMetadata } = useProjectStore();
  const { isExportModalOpen, setIsExportModalOpen } = useUIStore();

  const [clientName, setClientName] = useState(project.metadata.clientName);
  const [designerName, setDesignerName] = useState(project.metadata.designerName);
  const [notes, setNotes] = useState(project.metadata.notes);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  if (!isExportModalOpen) return null;

  // Handle PDF Export
  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    updateMetadata({ clientName, designerName, notes });

    try {
      // 1. Capture 3D Canvas Snapshot if available
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

  // Handle DXF Export
  const handleExportDXF = () => {
    const dxfString = generateDXF(project);
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    saveAs(blob, `${project.metadata.name.replace(/\s+/g, '_')}_AutoCAD.dxf`);
  };

  // Handle CSV Exports
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold">Export Manufacturing & Technical Package</h2>
              <p className="text-xs text-slate-400">Generate complete architectural drawings and workshop documents</p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Document Metadata Form */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Drawing Title Block Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Client / Project Owner</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe Residence"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Designer / Studio</label>
                <input
                  type="text"
                  placeholder="e.g. KitchenCAD Pro"
                  value={designerName}
                  onChange={(e) => setDesignerName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Production Notes</label>
              <textarea
                rows={2}
                placeholder="Special hardware, handleless profiles, edge banding specifications..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Primary Export: PDF Technical Booklet */}
          <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-5 rounded-2xl border border-blue-500/40 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-900/60 px-2 py-0.5 rounded">
                  RECOMMENDED
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">Complete Technical PDF Package</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Includes 3D visual render, dimensioned 2D floor plan, wall elevations (A, B, C, D), cabinet schedule, and workshop cutting list.
                </p>
              </div>

              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xl shadow-blue-600/40 transition shrink-0"
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Compiling PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Generate PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alternative Vector & Data Exports */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">CAD & Manufacturing Formats</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* DXF */}
              <button
                onClick={handleExportDXF}
                className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group"
              >
                <Layers size={18} className="text-cyan-400 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-white">AutoCAD (.DXF)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">2D CAD vector layers</div>
              </button>

              {/* Cutting List CSV */}
              <button
                onClick={handleExportCuttingCSV}
                className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group"
              >
                <FileSpreadsheet size={18} className="text-emerald-400 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-white">Cutting List (.CSV)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Panel breakout for CNC</div>
              </button>

              {/* Schedule CSV */}
              <button
                onClick={handleExportScheduleCSV}
                className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group"
              >
                <FileText size={18} className="text-amber-400 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-white">Schedule (.CSV)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Full cabinet schedule</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
