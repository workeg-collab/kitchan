import React, { useState, useRef, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useProjectStore } from '../../store/useProjectStore';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid, 
  Ruler, 
  DoorClosed, 
  DoorOpen,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Eye,
  EyeOff,
  Camera,
  Layers,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Box,
  Compass,
  Move,
  PencilRuler,
  Archive
} from 'lucide-react';

interface FloatingCanvasToolbarProps {
  mode: '2d' | '3d';
  onCaptureSnapshot?: () => void;
  onCaptureAllWalls?: () => void;
  isCapturing?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const FloatingCanvasToolbar: React.FC<FloatingCanvasToolbarProps> = ({ 
  mode,
  onCaptureSnapshot,
  onCaptureAllWalls,
  isCapturing = false,
  onZoomIn,
  onZoomOut,
  onResetZoom
}) => {
  const {
    zoom2D,
    setZoom2D,
    resetView2D,
    snapToGridEnabled,
    setSnapToGridEnabled,
    showDimensions2D,
    setShowDimensions2D,
    showDimensions3D,
    setShowDimensions3D,
    openDoors3D,
    toggleOpenDoors3D,
    viewAngle3D,
    setViewAngle3D,
    activeElevationWall,
    setActiveElevationWall,
    isolateElevationWall,
    toggleIsolateElevationWall,
    activeLeftCategory,
    setActiveLeftCategory,
    isRightPanelCollapsed,
    toggleRightPanel,
    drawingTool,
    setDrawingTool,
  } = useUIStore();

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dockSide, setDockSide] = useState<'bottom' | 'top'>('bottom');

  const toolbarRef = useRef<HTMLDivElement>(null);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!toolbarRef.current) return;
    setIsDragging(true);
    const rect = toolbarRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(16, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x));
      const newY = Math.max(70, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Touch Drag Handlers for Mobile / Tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!toolbarRef.current || e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = toolbarRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const touch = e.touches[0];
      const newX = Math.max(10, Math.min(window.innerWidth - 280, touch.clientX - dragOffset.x));
      const newY = Math.max(70, Math.min(window.innerHeight - 80, touch.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  // Dock toggle (Quick move to top or bottom away from drawing)
  const toggleDock = () => {
    setPosition(null); // Reset manual drag
    setDockSide((prev) => (prev === 'bottom' ? 'top' : 'bottom'));
  };

  // 2D Zoom actions
  const handle2DZoomIn = () => setZoom2D((prev) => Math.min(prev + 0.05, 1.0));
  const handle2DZoomOut = () => setZoom2D((prev) => Math.max(prev - 0.05, 0.08));

  // Style positioning: either user-dragged coordinates or smart docked position away from drawing
  const containerStyle: React.CSSProperties = position
    ? {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 30,
      }
    : dockSide === 'bottom'
    ? {
        position: 'absolute',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
      }
    : {
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
      };

  return (
    <div
      ref={toolbarRef}
      style={containerStyle}
      className={`font-sans select-none transition-shadow ${
        isDragging ? 'opacity-90 shadow-2xl scale-[1.02]' : 'opacity-100 shadow-xl shadow-slate-900/10'
      }`}
    >
      {/* Collapsed State: Minimal unobtrusive pill button */}
      {isCollapsed ? (
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl">
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-white"
            title="اسحب لتحريك الزر"
          >
            <GripVertical size={14} />
          </div>

          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-blue-600 rounded-xl text-xs font-bold transition text-slate-200 hover:text-white"
            title="إظهار شريط الأدوات"
          >
            <ChevronUp size={14} />
            <span>شريط الأدوات ({mode === '2d' ? '2D' : '3D'})</span>
          </button>
        </div>
      ) : (
        /* Expanded Full Toolbar */
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/95 text-slate-800 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl max-w-[95vw]">
          {/* 1. Drag Handle */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="px-1 py-1.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-800 rounded transition flex items-center"
            title="انقر واسحب لتحريك شريط الأدوات في أي مكان بعيداً عن الرسم"
          >
            <GripVertical size={16} />
          </div>

          {/* 2. Left Catalog Drawer Toggle */}
          <button
            onClick={() => setActiveLeftCategory(activeLeftCategory ? null : 'cabinets')}
            className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
              activeLeftCategory
                ? 'bg-purple-50 text-purple-600 border border-purple-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={activeLeftCategory ? 'إغلاق درج الكتالوج لتوسيع مساحة الرسم' : 'فتح درج الكتالوج والوحدات'}
          >
            {activeLeftCategory ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            <span className="hidden sm:inline text-[11px]">{activeLeftCategory ? 'إخفاء الكتالوج' : 'الكتالوج'}</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* ========================================================================= */}
          {/* 3. 2D SPECIFIC CONTROLS (NO DUPLICATE TAB SWITCHERS)                      */}
          {/* ========================================================================= */}
          {mode === '2d' && (
            <div className="flex items-center gap-1">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={handle2DZoomIn}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="تكبير (Zoom In)"
                >
                  <ZoomIn size={15} />
                </button>
                <span className="text-[11px] font-bold font-mono text-slate-600 px-1 min-w-[34px] text-center">
                  {Math.round(zoom2D * 100)}%
                </span>
                <button
                  onClick={handle2DZoomOut}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="تصغير (Zoom Out)"
                >
                  <ZoomOut size={15} />
                </button>
                <button
                  onClick={resetView2D}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="توسيط وملاءمة الشاشة (Fit to View)"
                >
                  <RotateCcw size={13} />
                </button>
              </div>

              {/* Snap to Grid */}
              <button
                onClick={() => setSnapToGridEnabled(!snapToGridEnabled)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  snapToGridEnabled
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                }`}
                title="المحاذاة للشبكة المغناطيسية (Snap to Grid)"
              >
                <Grid size={14} className={snapToGridEnabled ? 'text-amber-600' : 'text-slate-400'} />
                <span className="hidden md:inline">الشبكة</span>
              </button>

              {/* Dimensions */}
              <button
                onClick={() => setShowDimensions2D(!showDimensions2D)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  showDimensions2D
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                }`}
                title="إظهار خطوط الأبعاد والمسافات (Dimensions)"
              >
                <Ruler size={14} className={showDimensions2D ? 'text-emerald-600' : 'text-slate-400'} />
                <span className="hidden md:inline">الأبعاد</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              {/* Manual CAD Drawing Tools: Dressing & Shoe Cabinet */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setDrawingTool(drawingTool === 'dressing' ? 'none' : 'dressing')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    drawingTool === 'dressing'
                      ? 'bg-purple-600 text-white shadow-xs animate-pulse ring-2 ring-purple-300'
                      : 'text-purple-700 hover:bg-white hover:shadow-2xs'
                  }`}
                  title="رسم علبة دريسنج يدوياً: انقر واسحب المؤشر على المخطط لتحديد المقاس"
                >
                  <PencilRuler size={13} />
                  <span>رسم دريسنج يدوي</span>
                </button>

                <button
                  onClick={() => setDrawingTool(drawingTool === 'shoe-cabinet' ? 'none' : 'shoe-cabinet')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    drawingTool === 'shoe-cabinet'
                      ? 'bg-emerald-600 text-white shadow-xs animate-pulse ring-2 ring-emerald-300'
                      : 'text-emerald-700 hover:bg-white hover:shadow-2xs'
                  }`}
                  title="رسم جزامة يدوياً: انقر واسحب المؤشر على المخطط لتحديد المقاس"
                >
                  <Archive size={13} />
                  <span>رسم جزامة يدوي</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. 3D SPECIFIC CONTROLS (UNIFIED ELEVATION + ZOOM + SNAPSHOT)              */}
          {/* ========================================================================= */}
          {mode === '3d' && (
            <div className="flex flex-wrap items-center gap-1">
              {/* Wall Elevation & 3D Selector */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => {
                    setActiveElevationWall('all');
                    setViewAngle3D('perspective');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                    activeElevationWall === 'all' && viewAngle3D === 'perspective'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="منظور ثلاثي الأبعاد شامل"
                >
                  <Box size={13} />
                  <span>3D حر</span>
                </button>

                <button
                  onClick={() => setActiveElevationWall('wall-a')}
                  className={`px-2 py-1 rounded-lg transition ${
                    activeElevationWall === 'wall-a'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="واجهة ومسقط الجدار أ (الخلفي)"
                >
                  جدار أ
                </button>

                <button
                  onClick={() => setActiveElevationWall('wall-b')}
                  className={`px-2 py-1 rounded-lg transition ${
                    activeElevationWall === 'wall-b'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="واجهة ومسقط الجدار ب (الأيمن)"
                >
                  جدار ب
                </button>

                <button
                  onClick={() => setActiveElevationWall('wall-c')}
                  className={`px-2 py-1 rounded-lg transition ${
                    activeElevationWall === 'wall-c'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="واجهة ومسقط الجدار ج (الأمامي)"
                >
                  جدار ج
                </button>

                <button
                  onClick={() => setActiveElevationWall('wall-d')}
                  className={`px-2 py-1 rounded-lg transition ${
                    activeElevationWall === 'wall-d'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="واجهة ومسقط الجدار د (الأيسر)"
                >
                  جدار د
                </button>

                <button
                  onClick={() => {
                    setActiveElevationWall('all');
                    setViewAngle3D('top');
                  }}
                  className={`px-2 py-1 rounded-lg transition ${
                    activeElevationWall === 'all' && viewAngle3D === 'top'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="مسقط رأسي علوي"
                >
                  علوي
                </button>
              </div>

              {/* Isolate Wall Toggle (Only when a wall is selected) */}
              {activeElevationWall !== 'all' && (
                <button
                  onClick={toggleIsolateElevationWall}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                    isolateElevationWall
                      ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                  title={isolateElevationWall ? 'إلغاء عزل الجدار وإظهار باقي الجوانب' : 'إخفاء باقي الجوانب لإظهار هذا الجدار فقط'}
                >
                  {isolateElevationWall ? <EyeOff size={13} className="text-amber-300" /> : <Eye size={13} />}
                  <span className="hidden md:inline">{isolateElevationWall ? 'معزول' : 'عزل'}</span>
                </button>
              )}

              {/* 3D Zoom In / Out */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={onZoomIn}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="تكبير (Zoom In)"
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  onClick={onZoomOut}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="تصغير (Zoom Out)"
                >
                  <ZoomOut size={15} />
                </button>
                <button
                  onClick={onResetZoom}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="إعادة ضبط الزاوية"
                >
                  <RotateCcw size={13} />
                </button>
              </div>

              {/* Snapshots (PNG) */}
              {onCaptureSnapshot && (
                <button
                  onClick={onCaptureSnapshot}
                  disabled={isCapturing}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  title="التقاط صورة مسقط الجدار الحالي كملف PNG"
                >
                  <Camera size={14} />
                  <span className="hidden sm:inline">التقاط مسقط</span>
                </button>
              )}

              {onCaptureAllWalls && (
                <button
                  onClick={onCaptureAllWalls}
                  disabled={isCapturing}
                  className="flex items-center gap-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  title="التقاط مساقط الجدران الأربعة دفعة واحدة"
                >
                  <Layers size={14} />
                  <span className="hidden lg:inline">الـ 4 جدران</span>
                </button>
              )}

              {/* Open/Close Doors */}
              <button
                onClick={toggleOpenDoors3D}
                className={`p-1.5 rounded-xl transition border ${
                  openDoors3D
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
                title={openDoors3D ? 'إغلاق الضلف والأبواب' : 'فتح الضلف والأبواب للمعاينة الداخلية'}
              >
                {openDoors3D ? <DoorOpen size={15} /> : <DoorClosed size={15} />}
              </button>

              {/* 3D Dimensions */}
              <button
                onClick={() => setShowDimensions3D(!showDimensions3D)}
                className={`p-1.5 rounded-xl transition border ${
                  showDimensions3D
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                }`}
                title="إظهار الأبعاد ثلاثية الأبعاد (3D Dimensions)"
              >
                <Ruler size={15} />
              </button>
            </div>
          )}

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* 5. Right Properties Panel Toggle */}
          <button
            onClick={toggleRightPanel}
            className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
              !isRightPanelCollapsed
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={isRightPanelCollapsed ? 'إظهار لوحة الخصائص والتعديل' : 'إخفاء لوحة الخصائص لمساحة أكبر'}
          >
            <span className="hidden sm:inline text-[11px]">الخصائص</span>
            {isRightPanelCollapsed ? <PanelRightOpen size={15} /> : <PanelRightClose size={15} />}
          </button>

          {/* 6. Minimize / Collapse Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="طي شريط الأدوات مؤقتاً لتفريغ الشاشة بالكامل للرسم"
          >
            <ChevronDown size={15} />
          </button>

          {/* 7. Dock Position Toggle (Top / Bottom) */}
          <button
            onClick={toggleDock}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition hidden sm:flex"
            title={dockSide === 'bottom' ? 'نقل الشريط لأعلى الشاشة' : 'نقل الشريط لأسفل الشاشة'}
          >
            <Move size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
