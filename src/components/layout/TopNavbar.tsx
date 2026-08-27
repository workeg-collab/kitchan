import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { ActiveTab } from '../../types';
import { 
  Compass, 
  Box, 
  Layers, 
  FileText, 
  FileSpreadsheet, 
  Scissors, 
  RotateCcw, 
  RotateCw, 
  Download, 
  FolderOpen, 
  PlusCircle, 
  Settings, 
  Check, 
  Sparkles,
  LayoutTemplate
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const { project, updateMetadata, undo, redo, canUndo, canRedo, resetProject } = useProjectStore();
  const {
    activeTab,
    setActiveTab,
    unit,
    toggleUnit,
    setIsRoomModalOpen,
    setIsExportModalOpen,
    setIsTemplateModalOpen,
  } = useUIStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.metadata.name);

  const handleSaveTitle = () => {
    updateMetadata({ name: tempTitle.trim() || 'Untitled Kitchen Project' });
    setIsEditingTitle(false);
  };

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: '2d-plan', label: '2D Floor Plan', icon: <Compass size={16} /> },
    { id: '3d-view', label: '3D Real-Time View', icon: <Box size={16} /> },
    { id: 'elevations', label: 'Wall Elevations', icon: <Layers size={16} /> },
    { id: 'technical-drawings', label: 'Technical Blueprint', icon: <FileText size={16} /> },
    { id: 'cabinet-schedule', label: 'Cabinet Schedule', icon: <FileSpreadsheet size={16} /> },
    { id: 'manufacturing-bom', label: 'Manufacturing & BOM', icon: <Scissors size={16} /> },
  ];

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 select-none z-30 relative">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-mono font-black text-white text-base tracking-tighter">KC</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden md:inline">
            KITCHEN<span className="text-blue-400">CAD</span> PRO
          </span>
        </div>

        <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Project Title Quick Edit */}
        {isEditingTitle ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="px-2.5 py-1 bg-slate-950 border border-blue-500 rounded-md text-xs text-white focus:outline-none w-48 font-medium"
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
            className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition max-w-[200px] truncate"
            title="Click to rename project"
          >
            {project.metadata.name}
          </button>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition ${
              canUndo ? 'hover:text-white hover:bg-slate-800' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition ${
              canRedo ? 'hover:text-white hover:bg-slate-800' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 shadow-inner">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
        {/* Unit Toggle mm / cm */}
        <button
          onClick={toggleUnit}
          className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono font-bold text-slate-300 hover:border-slate-700 transition"
          title="Switch dimensional unit between mm and cm"
        >
          <span className={`px-2 py-1 rounded ${unit === 'mm' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>mm</span>
          <span className={`px-2 py-1 rounded ${unit === 'cm' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>cm</span>
        </button>

        {/* Room Wizard */}
        <button
          onClick={() => setIsRoomModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700"
          title="Setup room dimensions, walls and architectural obstacles"
        >
          <Settings size={14} />
          <span className="hidden xl:inline">Room Setup</span>
        </button>

        {/* Templates */}
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700"
          title="Load pre-configured sample kitchen layout"
        >
          <LayoutTemplate size={14} />
          <span className="hidden xl:inline">Templates</span>
        </button>

        {/* Export Technical Package Modal */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/25 transition"
        >
          <Download size={15} />
          <span>Export Package</span>
        </button>
      </div>
    </header>
  );
};
