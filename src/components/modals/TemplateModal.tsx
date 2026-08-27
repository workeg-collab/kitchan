import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { SAMPLE_PROJECT_MODERN_L } from '../../constants/sampleProjects';
import { ProjectData } from '../../types';
import { saveAs } from 'file-saver';
import { X, LayoutTemplate, Sparkles, FolderOpen, Save, PlusCircle } from 'lucide-react';

export const TemplateModal: React.FC = () => {
  const { project, loadSampleProject, resetProject, setProject } = useProjectStore();
  const { isTemplateModalOpen, setIsTemplateModalOpen } = useUIStore();

  if (!isTemplateModalOpen) return null;

  const handleSaveJSON = () => {
    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    saveAs(blob, `${project.metadata.name.replace(/\s+/g, '_')}.kitchan.json`);
  };

  const handleLoadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as ProjectData;
        if (parsed && parsed.room && parsed.cabinets) {
          setProject(parsed);
          setIsTemplateModalOpen(false);
        }
      } catch (err) {
        alert('Invalid Kitchen CAD project file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <LayoutTemplate size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Project Management & Templates</h2>
              <p className="text-xs text-slate-400">Open pre-designed kitchen templates or manage CAD project files</p>
            </div>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Templates Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">Kitchen Layout Templates</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  loadSampleProject(SAMPLE_PROJECT_MODERN_L);
                  setIsTemplateModalOpen(false);
                }}
                className="p-4 bg-slate-950 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/60 rounded-xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition">Modern L-Shape</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-950 text-blue-400 rounded">Sample</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Complete L-kitchen with tall pantry, oven tower, under-window sink, induction cooktop and wall units.
                </p>
              </button>

              <button
                onClick={() => {
                  resetProject();
                  setIsTemplateModalOpen(false);
                }}
                className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 rounded-xl text-left transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Blank Room</span>
                  <PlusCircle size={14} className="text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Start fresh with an empty room to design your kitchen from scratch.
                </p>
              </button>
            </div>
          </div>

          {/* Project File IO */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">Project File Import & Export</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSaveJSON}
                className="flex items-center gap-3 p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
              >
                <Save size={18} className="text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">Save Project (.json)</div>
                  <div className="text-[10px] text-slate-400">Save structured CAD project to disk</div>
                </div>
              </button>

              <label className="flex items-center gap-3 p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left cursor-pointer transition">
                <FolderOpen size={18} className="text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-white">Load Project (.json)</div>
                  <div className="text-[10px] text-slate-400">Open existing saved kitchen</div>
                </div>
                <input type="file" accept=".json" onChange={handleLoadJSON} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
