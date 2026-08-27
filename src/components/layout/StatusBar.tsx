import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension } from '../../utils/unitConversion';
import { generateFullProjectBOM } from '../../utils/manufacturing';

export const StatusBar: React.FC = () => {
  const { project, selectedId, selectedType } = useProjectStore();
  const { unit, zoom2D, activeTab } = useUIStore();
  const { room, cabinets, appliances, manufacturing } = project;

  const bom = generateFullProjectBOM(cabinets, manufacturing);

  return (
    <footer className="h-7 bg-slate-950 border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-semibold">ONLINE CAD</span>
        </div>

        <span className="text-slate-700">|</span>

        <span>
          ROOM: {formatDimension(room.width, unit)} x {formatDimension(room.length, unit)} (H: {formatDimension(room.ceilingHeight, unit)})
        </span>

        <span className="text-slate-700">|</span>

        <span>
          CABINETS: <strong className="text-blue-400">{cabinets.length}</strong>
        </span>

        <span>
          APPLIANCES: <strong className="text-amber-400">{appliances.length}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {selectedId && (
          <span className="text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-cyan-800/50">
            SELECTED: {selectedId} ({selectedType})
          </span>
        )}

        <span className="text-slate-700">|</span>

        <span>
          PANEL AREA: <strong className="text-slate-200">{bom.totalAreaM2} m²</strong> ({bom.sheetEstimates.sheetsNeeded} SHEETS)
        </span>

        {activeTab === '2d-plan' && (
          <>
            <span className="text-slate-700">|</span>
            <span>ZOOM: {Math.round(zoom2D * 100)}%</span>
          </>
        )}
      </div>
    </footer>
  );
};
