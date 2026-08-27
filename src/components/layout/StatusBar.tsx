import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension } from '../../utils/unitConversion';
import { generateFullProjectBOM } from '../../utils/manufacturing';

export const StatusBar: React.FC = () => {
  const { project, selectedId, selectedType } = useProjectStore();
  const { unit, zoom2D, activeTab, language } = useUIStore();
  const { room, cabinets, appliances, manufacturing } = project;

  const bom = generateFullProjectBOM(cabinets, manufacturing);

  return (
    <footer className="h-7 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500 select-none z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-800 font-bold">{language === 'ar' ? 'متصل' : 'ONLINE CAD'}</span>
        </div>

        <span className="text-slate-300">|</span>

        <span>
          {language === 'ar' ? 'الغرفة' : 'ROOM'}: {formatDimension(room.width, unit)} × {formatDimension(room.length, unit)} (H: {formatDimension(room.ceilingHeight, unit)})
        </span>

        <span className="text-slate-300">|</span>

        <span>
          {language === 'ar' ? 'الكبائن' : 'CABINETS'}: <strong className="text-blue-600 font-bold">{cabinets.length}</strong>
        </span>

        <span>
          {language === 'ar' ? 'الأجهزة' : 'APPLIANCES'}: <strong className="text-amber-600 font-bold">{appliances.length}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {selectedId && (
          <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {language === 'ar' ? 'المحدد' : 'SELECTED'}: {selectedId} ({selectedType})
          </span>
        )}

        <span className="text-slate-300">|</span>

        <span>
          {language === 'ar' ? 'مساحة المسطحات' : 'PANEL AREA'}: <strong className="text-slate-800 font-bold">{bom.totalAreaM2} m²</strong> ({bom.sheetEstimates.sheetsNeeded} {language === 'ar' ? 'ألواح' : 'SHEETS'})
        </span>

        {activeTab === '2d-plan' && (
          <>
            <span className="text-slate-300">|</span>
            <span>ZOOM: {Math.round(zoom2D * 100)}%</span>
          </>
        )}
      </div>
    </footer>
  );
};
