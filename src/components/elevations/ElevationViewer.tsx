import React, { useRef, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { WallElevationSVG } from './WallElevationSVG';
import { InternalElevationSVG } from './InternalElevationSVG';
import { TRANSLATIONS } from '../../utils/i18n';
import { isItemOnWall } from '../../utils/cadGeometry';
import { 
  Ruler, 
  Download, 
  Layers, 
  Columns, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Camera, 
  Box, 
  Check 
} from 'lucide-react';

export const ElevationViewer: React.FC = () => {
  const { project } = useProjectStore();
  const { 
    selectedElevationWallId, 
    setSelectedElevationWallId, 
    showDimensions2D, 
    setShowDimensions2D, 
    setActiveElevationWall,
    setActiveTab,
    language 
  } = useUIStore();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const t = TRANSLATIONS[language];

  const [elevationMode, setElevationMode] = useState<'external' | 'internal'>('external');
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { room, cabinets } = project;
  const currentWall = room.walls.find((w) => w.id === selectedElevationWallId) || room.walls[0];

  // SVG Export
  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.metadata.name}_${elevationMode === 'internal' ? 'Internal_Elevation' : currentWall.name.replace(/\s+/g, '_')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف فيكتور SVG بنجاح! 📐');
  };

  // High-Resolution PNG Snapshot
  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // Crisp 2x export
      canvas.width = (svgElement.clientWidth || 1600) * scale;
      canvas.height = (svgElement.clientHeight || 1000) * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        const wallName = elevationMode === 'internal' ? 'قطاع_داخلي' : currentWall.name.replace(/\s+/g, '_');
        link.download = `${project.metadata.name || 'مشروع'}_مسقط_${wallName}.png`;
        link.click();
        showToast('تم التقاط صورة المسقط وحفظها كملف PNG! 📸');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.max(0.4, Math.min(prev + delta, 2.5)));
    }
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (e.altKey || e.shiftKey || zoom > 1)) {
      setIsPanning(true);
      setStartPanPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPanPos.x,
        y: e.clientY - startPanPos.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Switch to 3D with this wall isolated
  const handleViewIn3D = (wallId: string) => {
    setActiveElevationWall(wallId as any);
    setActiveTab('3d-view');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden select-none font-sans relative">
      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Elevation Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-2.5 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher: External vs Internal */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-xs">
            <button
              onClick={() => setElevationMode('external')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                elevationMode === 'external' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns size={14} />
              <span>واجهات الجدران (External)</span>
            </button>
            <button
              onClick={() => setElevationMode('internal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                elevationMode === 'internal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>القطاع والتفصيل الداخلي (Internal)</span>
            </button>
          </div>

          {/* Wall Selector (Only in external mode) */}
          {elevationMode === 'external' && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono hidden sm:inline">الجدار:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 gap-1">
                {room.walls.map((wall) => {
                  const isSelected = wall.id === currentWall.id;
                  let wallLabel = wall.name;
                  if (language === 'ar') {
                    if (wall.id === 'wall-a') wallLabel = 'الجدار أ';
                    else if (wall.id === 'wall-b') wallLabel = 'الجدار ب';
                    else if (wall.id === 'wall-c') wallLabel = 'الجدار ج';
                    else if (wall.id === 'wall-d') wallLabel = 'الجدار د';
                  }

                  const wallCabinetCount = cabinets.filter((c) =>
                    isItemOnWall(c, wall.id, room.width, room.length)
                  ).length;

                  return (
                    <button
                      key={wall.id}
                      onClick={() => setSelectedElevationWallId(wall.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{wallLabel}</span>
                      {wallCabinetCount > 0 && (
                        <span className={`text-[10px] px-1 rounded font-mono ${
                          isSelected ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {wallCabinetCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Tools: Zoom, Dimensions & Export */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white text-slate-700 hover:text-blue-600 rounded-lg transition"
              title="تكبير المسقط"
            >
              <ZoomIn size={15} />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-600 px-1.5 min-w-[40px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white text-slate-700 hover:text-blue-600 rounded-lg transition"
              title="تصغير المسقط"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-white text-slate-700 hover:text-blue-600 rounded-lg transition"
              title="إعادة ضبط الحجم (100%)"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Toggle Dimensions */}
          <button
            onClick={() => setShowDimensions2D(!showDimensions2D)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              showDimensions2D ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Ruler size={15} />
            <span className="hidden sm:inline">{t.dimensions}</span>
          </button>

          {/* View in 3D Wall Isolation */}
          <button
            onClick={() => handleViewIn3D(currentWall.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition shadow-2xs"
            title="معاينة هذا الجدار في المنظور ثلاثي الأبعاد 3D مع عزل باقي الجوانب"
          >
            <Box size={14} className="text-purple-600" />
            <span className="hidden md:inline">عرض 3D معزول</span>
          </button>

          {/* Snapshot PNG */}
          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-600/20"
            title="التقاط وحفظ صورة المسقط بجودة عالية (PNG)"
          >
            <Camera size={14} />
            <span>التقاط المسقط (PNG)</span>
          </button>

          {/* Download SVG */}
          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200"
            title="تحميل المسقط كملف فيكتور كاد SVG"
          >
            <Download size={14} />
            <span className="hidden lg:inline">فيكتور SVG</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area with Zoom and Pan Container */}
      <div 
        ref={containerRef}
        className="flex-1 p-6 overflow-hidden flex items-center justify-center bg-slate-100 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="w-full max-w-6xl aspect-[16/10] bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {elevationMode === 'external' ? (
            <WallElevationSVG
              wall={currentWall}
              project={project}
              svgRef={svgRef}
              showDimensions={showDimensions2D}
            />
          ) : (
            <InternalElevationSVG
              project={project}
              svgRef={svgRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};
