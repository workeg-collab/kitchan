import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useProjectStore } from '../../store/useProjectStore';
import { 
  Compass, 
  Box, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
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
  Camera,
  Layers
} from 'lucide-react';

interface FloatingCanvasToolbarProps {
  mode: '2d' | '3d';
}

export const FloatingCanvasToolbar: React.FC<FloatingCanvasToolbarProps> = ({ mode }) => {
  const {
    activeTab,
    setActiveTab,
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
    activeLeftCategory,
    setActiveLeftCategory,
    isRightPanelCollapsed,
    toggleRightPanel,
    isFullscreenCanvas,
    toggleFullscreenCanvas
  } = useUIStore();

  const { selectedId, clearSelection } = useProjectStore();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 font-sans select-none animate-in fade-in slide-in-from-top-2">
      {/* 1. Left Panel Drawer Toggle */}
      <button
        onClick={() => setActiveLeftCategory(activeLeftCategory ? null : 'cabinets')}
        className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
          activeLeftCategory
            ? 'bg-purple-50 text-purple-600 border border-purple-200'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        title={activeLeftCategory ? 'إغلاق درج الكتالوج لتوسيع مساحة الرسم' : 'فتح درج الكتالوج والوحدات'}
      >
        {activeLeftCategory ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        <span className="hidden sm:inline text-[11px]">{activeLeftCategory ? 'إخفاء الكتالوج' : 'الكتالوج'}</span>
      </button>

      <div className="h-5 w-px bg-slate-200 mx-0.5" />

      {/* 2. 2D / 3D Mode Pill Switch */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('2d-plan')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === '2d-plan'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="المخطط الهندسي ثنائي الأبعاد (2D Plan)"
        >
          <Compass size={14} />
          <span>مخطط 2D</span>
        </button>

        <button
          onClick={() => setActiveTab('3d-view')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === '3d-view'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="المنظور ثلاثي الأبعاد الواقعي (3D View)"
        >
          <Box size={14} />
          <span>منظور 3D</span>
        </button>
      </div>

      <div className="h-5 w-px bg-slate-200 mx-0.5" />

      {/* 3. 2D Specific Controls */}
      {mode === '2d' && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom2D((prev) => Math.min(prev + 0.05, 1.0))}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="تكبير (Zoom In)"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom2D((prev) => Math.max(prev - 0.05, 0.08))}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="تصغير (Zoom Out)"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetView2D}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="توسيط وملاءمة الشاشة (Fit to View)"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={() => setSnapToGridEnabled(!snapToGridEnabled)}
            className={`p-1.5 rounded-lg transition ${
              snapToGridEnabled ? 'bg-amber-50 text-amber-600 font-bold' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title="المحاذاة للشبكة المغناطيسية (Snap to Grid)"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setShowDimensions2D(!showDimensions2D)}
            className={`p-1.5 rounded-lg transition ${
              showDimensions2D ? 'bg-amber-50 text-amber-600 font-bold' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title="إظهار خطوط الأبعاد والمسافات (Dimensions)"
          >
            <Ruler size={16} />
          </button>
        </div>
      )}

      {/* 4. 3D Specific Camera Angle & Door Controls */}
      {mode === '3d' && (
        <div className="flex items-center gap-1">
          {/* Camera Angles Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => {
                useUIStore.getState().setActiveElevationWall('all');
                setViewAngle3D('perspective');
              }}
              className={`px-2 py-1 rounded transition ${
                viewAngle3D === 'perspective' && useUIStore.getState().activeElevationWall === 'all'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="منظور حر (Free Perspective)"
            >
              حر
            </button>
            <button
              onClick={() => {
                useUIStore.getState().setActiveElevationWall('all');
                setViewAngle3D('top');
              }}
              className={`px-2 py-1 rounded transition ${
                viewAngle3D === 'top' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="مسقط رأسي علوي (Top View)"
            >
              علوي
            </button>
            <button
              onClick={() => {
                useUIStore.getState().setActiveElevationWall('all');
                setViewAngle3D('front');
              }}
              className={`px-2 py-1 rounded transition ${
                viewAngle3D === 'front' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="واجهة أمامية (Front View)"
            >
              أمامي
            </button>
            <button
              onClick={() => {
                useUIStore.getState().setActiveElevationWall('all');
                setViewAngle3D('isometric');
              }}
              className={`px-2 py-1 rounded transition ${
                viewAngle3D === 'isometric' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="أيزومترك هندسي (Isometric 30°)"
            >
              أيزومترك
            </button>
          </div>

          {/* Open/Close Doors */}
          <button
            onClick={toggleOpenDoors3D}
            className={`p-1.5 rounded-lg transition ${
              openDoors3D ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={openDoors3D ? 'إغلاق الضلف والأبواب' : 'فتح الضلف والأبواب للمعاينة الداخلية'}
          >
            {openDoors3D ? <DoorOpen size={16} /> : <DoorClosed size={16} />}
          </button>

          {/* 3D Dimensions */}
          <button
            onClick={() => setShowDimensions3D(!showDimensions3D)}
            className={`p-1.5 rounded-lg transition ${
              showDimensions3D ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title="إظهار الأبعاد ثلاثية الأبعاد (3D Dimensions)"
          >
            <Ruler size={16} />
          </button>
        </div>
      )}

      <div className="h-5 w-px bg-slate-200 mx-0.5" />

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
        {isRightPanelCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
      </button>
    </div>
  );
};
