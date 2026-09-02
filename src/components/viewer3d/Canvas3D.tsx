import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from './Cabinet3D';
import { Appliance3D } from './Appliance3D';
import { ArchElements3D } from './ArchElements3D';
import { Room3D } from './Room3D';
import { TRANSLATIONS } from '../../utils/i18n';
import { formatDimension } from '../../utils/unitConversion';
import { isItemOnWall } from '../../utils/cadGeometry';
import { FloatingCanvasToolbar } from '../layout/FloatingCanvasToolbar';
import { 
  DoorOpen, 
  RotateCw, 
  Copy, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Minus,
  Camera,
  Layers,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Download,
  Box
} from 'lucide-react';

interface CameraControllerProps {
  activeElevationWall: 'all' | 'wall-a' | 'wall-b' | 'wall-c' | 'wall-d';
  viewAngle3D: string;
  roomWidth: number;
  roomLength: number;
  ceilingHeight: number;
  zoomAction: { type: 'in' | 'out' | 'reset'; id: number } | null;
  controlsRef: React.RefObject<any>;
}

const CameraElevationController: React.FC<CameraControllerProps> = ({
  activeElevationWall,
  viewAngle3D,
  roomWidth,
  roomLength,
  ceilingHeight,
  zoomAction,
  controlsRef
}) => {
  const { camera } = useThree();

  const W = roomWidth / 1000;
  const L = roomLength / 1000;
  const H = ceilingHeight / 1000;
  const centerX = W / 2;
  const centerZ = L / 2;
  const centerY = H / 2;

  // Move camera smoothly when active elevation wall or viewAngle changes
  useEffect(() => {
    let targetPos: [number, number, number];
    let lookTarget: [number, number, number];

    if (activeElevationWall === 'wall-a') {
      lookTarget = [centerX, centerY, 0];
      const dist = Math.max(W, H) * 1.05 + 1.2;
      targetPos = [centerX, centerY, dist];
    } else if (activeElevationWall === 'wall-b') {
      lookTarget = [W, centerY, centerZ];
      const dist = Math.max(L, H) * 1.05 + 1.2;
      targetPos = [W - dist, centerY, centerZ];
    } else if (activeElevationWall === 'wall-c') {
      lookTarget = [centerX, centerY, L];
      const dist = Math.max(W, H) * 1.05 + 1.2;
      targetPos = [centerX, centerY, L - dist];
    } else if (activeElevationWall === 'wall-d') {
      lookTarget = [0, centerY, centerZ];
      const dist = Math.max(L, H) * 1.05 + 1.2;
      targetPos = [dist, centerY, centerZ];
    } else {
      lookTarget = [centerX, centerY * 0.7, centerZ];
      if (viewAngle3D === 'top') {
        targetPos = [centerX, 6.5, centerZ + 0.01];
      } else if (viewAngle3D === 'front') {
        targetPos = [centerX, centerY + 0.5, centerZ + 4.8];
      } else if (viewAngle3D === 'isometric') {
        targetPos = [centerX + 4.5, centerY + 3.5, centerZ + 4.5];
      } else if (viewAngle3D === 'left') {
        targetPos = [-3.5, centerY + 0.8, centerZ];
      } else if (viewAngle3D === 'right') {
        targetPos = [centerX * 2 + 3.5, centerY + 0.8, centerZ];
      } else {
        targetPos = [centerX + 3.2, centerY + 2.2, centerZ + 4.2];
      }
    }

    camera.position.set(...targetPos);
    if (controlsRef.current) {
      controlsRef.current.target.set(...lookTarget);
      controlsRef.current.update();
    }
  }, [activeElevationWall, viewAngle3D, W, L, H, centerX, centerY, centerZ]);

  // Handle on-screen Zoom In / Zoom Out
  useEffect(() => {
    if (!zoomAction || !controlsRef.current) return;
    const controls = controlsRef.current;
    const target = controls.target;

    if (zoomAction.type === 'in') {
      camera.position.lerp(target, 0.22);
    } else if (zoomAction.type === 'out') {
      const dir = new THREE.Vector3().subVectors(camera.position, target);
      camera.position.addScaledVector(dir, 0.28);
    }
    controls.update();
  }, [zoomAction]);

  return null;
};

export const Canvas3D: React.FC = () => {
  const { 
    project, 
    selectedId, 
    selectedType,
    setSelected, 
    clearSelection,
    updateCabinet,
    rotateCabinet,
    duplicateCabinet,
    removeCabinet,
    updateAppliance,
    rotateAppliance,
    duplicateAppliance,
    removeAppliance,
    addCabinet,
  } = useProjectStore();

  const {
    openDoors3D,
    viewAngle3D,
    activeElevationWall,
    setActiveElevationWall,
    isolateElevationWall,
    toggleIsolateElevationWall,
    unit,
    language,
  } = useUIStore();

  const t = TRANSLATIONS[language];
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, materials } = project;

  const centerX = room.width / 2000;
  const centerZ = room.length / 2000;
  const centerY = room.ceilingHeight / 2500;

  const controlsRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [zoomAction, setZoomAction] = useState<{ type: 'in' | 'out' | 'reset'; id: number } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isBatchCapturing, setIsBatchCapturing] = useState(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  const selectedCabinet = selectedType === 'cabinet' ? cabinets.find((c) => c.id === selectedId) : null;
  const selectedAppliance = selectedType === 'appliance' ? appliances.find((a) => a.id === selectedId) : null;

  // Global Keyboard Navigation in 3D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (selectedType === 'cabinet') rotateCabinet(selectedId, 90);
        if (selectedType === 'appliance') rotateAppliance(selectedId, 90);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedType === 'cabinet') removeCabinet(selectedId);
        if (selectedType === 'appliance') removeAppliance(selectedId);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (selectedType === 'cabinet') duplicateCabinet(selectedId);
        if (selectedType === 'appliance') duplicateAppliance(selectedId);
      } else if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedType]);

  // Handle Drag and Drop from Catalog into 3D View
  const handleDrop3D = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.type === 'cabinet' && data.template) {
        const template = data.template;
        addCabinet({
          name: template.name,
          category: template.category,
          type: template.type,
          projectType: project.metadata.projectType,
          width: data.width || template.defaultWidth,
          height: template.defaultHeight,
          depth: template.defaultDepth,
          x: Math.min(room.width / 2, 2000),
          y: 0,
          z: template.defaultZ,
          rotation: 0,
          wallId: 'wall-a',
          doorCount: template.doorCount,
          drawerCount: template.drawerCount,
          shelfCount: template.shelfCount,
          doorHinge: template.doorHinge || 'right',
          doorType: template.doorType,
          hasSinkCutout: template.hasSinkCutout,
          hasApplianceCavity: template.hasApplianceCavity,
          flipUpDoor: template.flipUpDoor,
          isCeilingUnit: template.isCeilingUnit,
        });
      }
    } catch (err) {
      console.warn('3D drop parse error:', err);
    }
  };

  // Nudge selected item along wall / axis
  const handleNudge = (deltaX: number, deltaY: number) => {
    if (selectedCabinet) {
      const newX = Math.max(0, Math.min(selectedCabinet.x + deltaX, room.width));
      const newY = Math.max(0, Math.min(selectedCabinet.y + deltaY, room.length));
      updateCabinet(selectedCabinet.id, { x: newX, y: newY });
    } else if (selectedAppliance) {
      const newX = Math.max(0, Math.min(selectedAppliance.x + deltaX, room.width));
      const newY = Math.max(0, Math.min(selectedAppliance.y + deltaY, room.length));
      updateAppliance(selectedAppliance.id, { x: newX, y: newY });
    }
  };

  // Single Wall Snapshot Capture
  const captureCurrentWallSnapshot = (wallNameLabel?: string) => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    setIsCapturing(true);
    setTimeout(() => {
      try {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;

        let wallTitle = wallNameLabel;
        if (!wallTitle) {
          if (activeElevationWall === 'wall-a') wallTitle = 'الجدار_أ_الخلفي';
          else if (activeElevationWall === 'wall-b') wallTitle = 'الجدار_ب_الأيمن';
          else if (activeElevationWall === 'wall-c') wallTitle = 'الجدار_ج_الأمامي';
          else if (activeElevationWall === 'wall-d') wallTitle = 'الجدار_د_الأيسر';
          else wallTitle = 'منظور_3D_شامل';
        }

        link.download = `${project.metadata.name || 'مشروع'}_مسقط_${wallTitle}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnapshotToast(`تم التقاط مسقط ${wallTitle.replace(/_/g, ' ')} بنجاح! 📸`);
        setTimeout(() => setSnapshotToast(null), 3000);
      } catch (err) {
        console.error('Snapshot capture error:', err);
      } finally {
        setIsCapturing(false);
      }
    }, 150);
  };

  // Batch Capture of All 4 Walls
  const captureAllFourWalls = async () => {
    setIsBatchCapturing(true);
    const originalWall = activeElevationWall;
    const walls: { id: 'wall-a' | 'wall-b' | 'wall-c' | 'wall-d'; label: string }[] = [
      { id: 'wall-a', label: 'الجدار_أ_الخلفي' },
      { id: 'wall-b', label: 'الجدار_ب_الأيمن' },
      { id: 'wall-c', label: 'الجدار_ج_الأمامي' },
      { id: 'wall-d', label: 'الجدار_د_الأيسر' }
    ];

    for (const w of walls) {
      setActiveElevationWall(w.id);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = canvasContainerRef.current?.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${project.metadata.name || 'مشروع'}_مسقط_${w.label}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    setActiveElevationWall(originalWall);
    setIsBatchCapturing(false);
    setSnapshotToast('تم التقاط مساقط الجدران الأربعة بالكامل وحفظها بنجاح! 📸✅');
    setTimeout(() => setSnapshotToast(null), 4000);
  };

  // Filter items when a single wall is isolated
  const isWallIsolated = activeElevationWall !== 'all' && isolateElevationWall;

  const visibleCabinets = isWallIsolated
    ? cabinets.filter((c) => isItemOnWall(c, activeElevationWall, room.width, room.length))
    : cabinets;

  const visibleAppliances = isWallIsolated
    ? appliances.filter((a) => isItemOnWall(a, activeElevationWall, room.width, room.length))
    : appliances;

  const visibleElements = isWallIsolated
    ? architecturalElements.filter((e) => isItemOnWall(e, activeElevationWall, room.width, room.length))
    : architecturalElements;

  return (
    <div 
      ref={canvasContainerRef}
      className="relative w-full h-full bg-slate-100 overflow-hidden select-none font-sans"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop3D}
    >
      {/* Sleek Floating Canvas Toolbar */}
      <FloatingCanvasToolbar mode="3d" />

      {/* Snapshot Toast Notification */}
      {snapshotToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <Check size={16} />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4-WALL ELEVATION & ISOLATION CONTROL BAR                                  */}
      {/* ========================================================================= */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl text-xs select-none max-w-[95vw]">
        {/* Wall Switcher Buttons */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveElevationWall('all')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition ${
              activeElevationWall === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="منظور ثلاثي الأبعاد شامل (جميع الجدران)"
          >
            <Box size={13} />
            <span>حر 3D</span>
          </button>

          <button
            onClick={() => setActiveElevationWall('wall-a')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
              activeElevationWall === 'wall-a'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="مسقط وواجهة الجدار أ (الخلفي)"
          >
            الجدار أ
          </button>

          <button
            onClick={() => setActiveElevationWall('wall-b')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
              activeElevationWall === 'wall-b'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="مسقط وواجهة الجدار ب (الأيمن)"
          >
            الجدار ب
          </button>

          <button
            onClick={() => setActiveElevationWall('wall-c')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
              activeElevationWall === 'wall-c'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="مسقط وواجهة الجدار ج (الأمامي المقابل للجدار أ)"
          >
            الجدار ج
          </button>

          <button
            onClick={() => setActiveElevationWall('wall-d')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
              activeElevationWall === 'wall-d'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="مسقط وواجهة الجدار د (الأيسر)"
          >
            الجدار د
          </button>
        </div>

        {/* Isolate Wall Toggle (Hides other walls & opposite cabinets) */}
        {activeElevationWall !== 'all' && (
          <button
            onClick={toggleIsolateElevationWall}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition border ${
              isolateElevationWall
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isolateElevationWall ? 'إلغاء عزل الجدار وإظهار باقي الجوانب' : 'إخفاء باقي الجوانب والجدران للتركيز التام على هذا الجدار'}
          >
            {isolateElevationWall ? <EyeOff size={14} className="text-amber-300" /> : <Eye size={14} />}
            <span>{isolateElevationWall ? 'إخفاء باقي الجوانب (مفعّل)' : 'عزل الجدار'}</span>
          </button>
        )}

        {/* Interactive Zoom Controls */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setZoomAction({ type: 'in', id: Date.now() })}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="تكبير (Zoom In)"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoomAction({ type: 'out', id: Date.now() })}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="تصغير (Zoom Out)"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => {
              const cur = activeElevationWall;
              setActiveElevationWall('all');
              setTimeout(() => setActiveElevationWall(cur), 50);
            }}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="إعادة ضبط زاوية الرؤية (Reset)"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Snapshot / Capture Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => captureCurrentWallSnapshot()}
            disabled={isCapturing || isBatchCapturing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl font-bold transition shadow-md shadow-emerald-600/30"
            title="التقاط صورة عالية الدقة لمسقط الجدار الحالي وحفظها على الكمبيوتر"
          >
            <Camera size={14} />
            <span>التقاط المسقط (PNG)</span>
          </button>

          <button
            onClick={captureAllFourWalls}
            disabled={isCapturing || isBatchCapturing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white rounded-xl font-bold transition shadow-md shadow-indigo-600/30"
            title="التقاط مساقط الجدران الأربعة دفعة واحدة وتنزيل صورها"
          >
            <Layers size={14} />
            <span className="hidden sm:inline">التقاط الـ 4 جدران</span>
          </button>
        </div>
      </div>

      {/* 3D FLOATING INTERACTIVE GIZMO / CONTROL HUD (WHEN OBJECT IS SELECTED) */}
      {(selectedCabinet || selectedAppliance) && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2 p-2 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl">
            {/* Item ID & Name Badge */}
            <div className="px-3 py-1 bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700">
              <span className="text-amber-400 font-mono">{selectedCabinet ? selectedCabinet.id : selectedAppliance?.id}</span>
              <span className="text-slate-200 truncate max-w-[140px]">{selectedCabinet ? selectedCabinet.name : selectedAppliance?.name}</span>
            </div>

            <div className="w-[1px] h-6 bg-slate-700" />

            {/* Quick Actions: Rotate, Nudge, Duplicate, Delete */}
            <button
              onClick={() => {
                if (selectedCabinet) rotateCabinet(selectedCabinet.id, 90);
                if (selectedAppliance) rotateAppliance(selectedAppliance.id, 90);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-blue-600 rounded-xl text-xs font-bold transition text-slate-200 hover:text-white"
              title="تدوير 90 درجة (R)"
            >
              <RotateCw size={14} />
              <span>تدوير 90°</span>
            </button>

            {/* Nudge Left / Right */}
            <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => handleNudge(-50, 0)}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                title="إزاحة 5 سم لليسار"
              >
                <ArrowRight size={14} />
              </button>
              <span className="text-[10px] text-slate-400 px-1 font-mono">تحريك</span>
              <button
                onClick={() => handleNudge(50, 0)}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                title="إزاحة 5 سم لليمين"
              >
                <ArrowLeft size={14} />
              </button>
            </div>

            {/* Quick Width Stepper in CM */}
            {selectedCabinet && (
              <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs">
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { width: Math.max(200, selectedCabinet.width - 50) })}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="إنقاص العرض 5 سم"
                >
                  <Minus size={13} />
                </button>
                <span className="text-[11px] font-bold text-amber-400 px-1.5 font-mono">
                  {formatDimension(selectedCabinet.width, unit)}
                </span>
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { width: Math.min(2400, selectedCabinet.width + 50) })}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="زيادة العرض 5 سم"
                >
                  <Plus size={13} />
                </button>
              </div>
            )}

            {/* Quick Height / Elevation Z Stepper */}
            {selectedCabinet && (
              <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs">
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { z: Math.max(0, selectedCabinet.z - 50) })}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="خفض المنسوب 5 سم"
                >
                  <Minus size={13} />
                </button>
                <span className="text-[11px] font-bold text-emerald-400 px-1.5 font-mono">
                  Z: {formatDimension(selectedCabinet.z, unit)}
                </span>
                <button
                  onClick={() => updateCabinet(selectedCabinet.id, { z: Math.min(room.ceilingHeight - 300, selectedCabinet.z + 50) })}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="رفع المنسوب 5 سم"
                >
                  <Plus size={13} />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                if (selectedCabinet) duplicateCabinet(selectedCabinet.id);
                if (selectedAppliance) duplicateAppliance(selectedAppliance.id);
              }}
              className="p-1.5 bg-slate-800 hover:bg-emerald-600 rounded-xl text-slate-300 hover:text-white transition"
              title="تكرار القطعة (Ctrl+D)"
            >
              <Copy size={15} />
            </button>

            <button
              onClick={() => {
                if (selectedCabinet) removeCabinet(selectedCabinet.id);
                if (selectedAppliance) removeAppliance(selectedAppliance.id);
              }}
              className="p-1.5 bg-slate-800 hover:bg-red-600 rounded-xl text-red-400 hover:text-white transition"
              title="حذف القطعة (Del)"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onPointerMissed={() => clearSelection()}
      >
        <color attach="background" args={['#f1f5f9']} />
        <PerspectiveCamera makeDefault position={[centerX + 3.2, centerY + 2.2, centerZ + 4.2]} fov={45} />
        
        <OrbitControls
          ref={controlsRef}
          target={[centerX, centerY * 0.7, centerZ]}
          enableDamping
          dampingFactor={0.08}
          minDistance={0.5}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2 + 0.05}
        />

        {/* Dynamic Camera Position Controller for Wall Elevations & Zooms */}
        <CameraElevationController
          activeElevationWall={activeElevationWall}
          viewAngle3D={viewAngle3D}
          roomWidth={room.width}
          roomLength={room.length}
          ceilingHeight={room.ceilingHeight}
          zoomAction={zoomAction}
          controlsRef={controlsRef}
        />

        {/* Bright Studio Lighting */}
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[centerX + 5, 7, centerZ + 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-5, 5, -4]} intensity={0.6} />
        <pointLight position={[centerX, room.ceilingHeight / 1000 - 0.2, centerZ]} intensity={1.2} color="#fffbeb" distance={10} />

        {/* Room Structure (passes isolated wall when active) */}
        <Room3D 
          room={room} 
          materials={materials} 
          backsplash={backsplash} 
          isolatedWallId={isWallIsolated ? activeElevationWall : 'all'} 
        />

        {/* Architectural Elements (Doors, Windows, Columns) */}
        <ArchElements3D
          elements={visibleElements}
          selectedId={selectedId}
          onSelect={(id) => setSelected(id, 'element')}
        />

        {/* Cabinets */}
        {visibleCabinets.map((cab) => (
          <Cabinet3D
            key={cab.id}
            cabinet={cab}
            materials={materials}
            countertop={countertop}
            plinth={plinth}
            isOpenDoors={openDoors3D}
            isSelected={selectedId === cab.id}
            onSelect={() => setSelected(cab.id, 'cabinet')}
          />
        ))}

        {/* Appliances */}
        {visibleAppliances.map((app) => (
          <Appliance3D
            key={app.id}
            appliance={app}
            isSelected={selectedId === app.id}
            onSelect={() => setSelected(app.id, 'appliance')}
          />
        ))}

        {/* Contact Shadow on Floor */}
        <ContactShadows
          position={[centerX, 0.001, centerZ]}
          opacity={0.5}
          scale={12}
          blur={1.6}
          far={3}
        />
      </Canvas>
    </div>
  );
};
