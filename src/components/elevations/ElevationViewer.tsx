import React, { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { WallElevationSVG } from './WallElevationSVG';
import { TRANSLATIONS } from '../../utils/i18n';
import { Ruler, Download } from 'lucide-react';

export const ElevationViewer: React.FC = () => {
  const { project } = useProjectStore();
  const { selectedElevationWallId, setSelectedElevationWallId, showDimensions2D, setShowDimensions2D, language } = useUIStore();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const t = TRANSLATIONS[language];

  const { room } = project;
  const currentWall = room.walls.find((w) => w.id === selectedElevationWallId) || room.walls[0];

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.metadata.name}_${currentWall.name.replace(/\s+/g, '_')}_Elevation.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Elevation Control Bar (Light Theme) */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            {language === 'ar' ? 'اختر واجهة الجدار:' : 'Select Wall Elevation:'}
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1">
            {room.walls.map((wall) => {
              const isSelected = wall.id === currentWall.id;
              let wallLabel = wall.name;
              if (language === 'ar') {
                if (wall.id === 'wall-a') wallLabel = 'الجدار أ (الخلفي)';
                else if (wall.id === 'wall-b') wallLabel = 'الجدار ب (الأيمن)';
                else if (wall.id === 'wall-c') wallLabel = 'الجدار ج (الأمامي)';
                else if (wall.id === 'wall-d') wallLabel = 'الجدار د (الأيسر)';
              }

              return (
                <button
                  key={wall.id}
                  onClick={() => setSelectedElevationWallId(wall.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    isSelected
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {wallLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDimensions2D(!showDimensions2D)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              showDimensions2D ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Ruler size={15} />
            <span>{t.dimensions}</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200"
            title="Download Elevation as SVG Vector CAD file"
          >
            <Download size={15} />
            <span>{language === 'ar' ? 'تحميل كملف فيكتور SVG' : 'Export SVG'}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-slate-100">
        <div className="w-full max-w-6xl aspect-[16/10] bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <WallElevationSVG
            wall={currentWall}
            project={project}
            svgRef={svgRef}
            showDimensions={showDimensions2D}
          />
        </div>
      </div>
    </div>
  );
};
