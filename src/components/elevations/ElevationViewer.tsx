import React, { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { WallElevationSVG } from './WallElevationSVG';
import { Ruler, Download, Printer, Layers } from 'lucide-react';

export const ElevationViewer: React.FC = () => {
  const { project } = useProjectStore();
  const { selectedElevationWallId, setSelectedElevationWallId, showDimensions2D, setShowDimensions2D } = useUIStore();
  const svgRef = useRef<SVGSVGElement | null>(null);

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
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Elevation Control Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Wall Elevation:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1">
            {room.walls.map((wall) => {
              const isSelected = wall.id === currentWall.id;
              return (
                <button
                  key={wall.id}
                  onClick={() => setSelectedElevationWallId(wall.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {wall.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDimensions2D(!showDimensions2D)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              showDimensions2D ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Ruler size={15} />
            <span>Dimension Chains</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700"
            title="Download Elevation as SVG Vector CAD file"
          >
            <Download size={15} />
            <span>Export SVG</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-6xl aspect-[16/10] bg-[#0a0f1d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
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
