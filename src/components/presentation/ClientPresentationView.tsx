import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from '../viewer3d/Cabinet3D';
import { Appliance3D } from '../viewer3d/Appliance3D';
import { ArchElements3D } from '../viewer3d/ArchElements3D';
import { Room3D } from '../viewer3d/Room3D';
import { formatDimension } from '../../utils/unitConversion';
import { isItemOnWall } from '../../utils/cadGeometry';
import { 
  Play, 
  Pause, 
  Sun, 
  Moon, 
  Sunset, 
  Sparkles, 
  Maximize, 
  Minimize, 
  Camera, 
  Footprints, 
  Check, 
  FileText,
  DoorOpen,
  DoorClosed,
  ArrowRight,
  Box,
  LampDesk
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PresentationCameraControllerProps {
  activeWall: 'all' | 'wall-a' | 'wall-b' | 'wall-c' | 'wall-d';
  roomWidth: number;
  roomLength: number;
  ceilingHeight: number;
  controlsRef: React.RefObject<any>;
}

const PresentationCameraController: React.FC<PresentationCameraControllerProps> = ({
  activeWall,
  roomWidth,
  roomLength,
  ceilingHeight,
  controlsRef,
}) => {
  const { camera } = useThree();

  const W = roomWidth / 1000;
  const L = roomLength / 1000;
  const H = ceilingHeight / 1000;
  const centerX = W / 2;
  const centerZ = L / 2;
  const centerY = H / 2;

  useEffect(() => {
    let targetPos: [number, number, number];
    let lookTarget: [number, number, number];

    if (activeWall === 'wall-a') {
      lookTarget = [centerX, centerY, 0];
      const dist = Math.max(W, H) * 1.1 + 1.2;
      targetPos = [centerX, centerY, dist];
    } else if (activeWall === 'wall-b') {
      lookTarget = [W, centerY, centerZ];
      const dist = Math.max(L, H) * 1.1 + 1.2;
      targetPos = [W - dist, centerY, centerZ];
    } else if (activeWall === 'wall-c') {
      lookTarget = [centerX, centerY, L];
      const dist = Math.max(W, H) * 1.1 + 1.2;
      targetPos = [centerX, centerY, L - dist];
    } else if (activeWall === 'wall-d') {
      lookTarget = [0, centerY, centerZ];
      const dist = Math.max(L, H) * 1.1 + 1.2;
      targetPos = [dist, centerY, centerZ];
    } else {
      lookTarget = [centerX, centerY * 0.7, centerZ];
      targetPos = [centerX + 3.4, centerY + 2.0, centerZ + 4.2];
    }

    camera.position.set(...targetPos);
    if (controlsRef.current) {
      controlsRef.current.target.set(...lookTarget);
      controlsRef.current.update();
    }
  }, [activeWall, W, L, H, centerX, centerY, centerZ]);

  return null;
};

export const ClientPresentationView: React.FC = () => {
  const { project, updateMaterials } = useProjectStore();
  const { unit, setActiveTab } = useUIStore();
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, materials, designOptions } = project;

  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [lighting, setLighting] = useState<'day' | 'sunset' | 'night' | 'studio'>('day');
  const [activeOptionId, setActiveOptionId] = useState<string>(designOptions?.[0]?.id || 'default');
  const [showMaterialsCard, setShowMaterialsCard] = useState(true);
  const [openDoors, setOpenDoors] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeWall, setActiveWall] = useState<'all' | 'wall-a' | 'wall-b' | 'wall-c' | 'wall-d'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const centerX = room.width / 2000;
  const centerZ = room.length / 2000;
  const centerY = room.ceilingHeight / 2500;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectOption = (optId: string) => {
    setActiveOptionId(optId);
    const selected = designOptions?.find((o) => o.id === optId);
    if (selected && selected.materials) {
      updateMaterials(selected.materials);
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Snapshot PNG
  const handleCaptureSnapshot = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${project.metadata.name || 'مشروع'}_معاينة_العميل.png`;
    link.click();
    showToast('تم حفظ لقطة المعاينة بنجاح 📸');
  };

  // Generate Clean Client Presentation PDF
  const handleExportClientPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    // Header Banner
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 297, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(project.metadata.name || 'مشروع التصميم الداخلي', 15, 15);

    doc.setFontSize(9);
    doc.text(`العميل: ${project.metadata.clientName || 'العميل الفاضل'}  |  التاريخ: ${project.metadata.date || new Date().toISOString().split('T')[0]}`, 190, 15);

    // Project Info Summary Table
    const infoData = [
      ['نوع المشروع', project.metadata.projectType.toUpperCase()],
      ['أبعاد الغرفة', `${formatDimension(room.width, unit)} × ${formatDimension(room.length, unit)} (ارتفاع: ${formatDimension(room.ceilingHeight, unit)})`],
      ['تشطيب الضلف والواجهات', materials.frontFinish || 'تشطيب عصري'],
      ['خامة السطح والرخام', countertop.material || 'رخام كوارتز كلكتا'],
      ['إجمالي عدد الوحدات', `${cabinets.length} وحدة`],
      ['ملاحظات المصمم', project.metadata.notes || 'تصميم مخصص حسب أبعاد ومواصفات العميل'],
    ];

    (doc as any).autoTable({
      startY: 32,
      head: [['البند والمواصفة', 'التفاصيل والخيارات المعتمدة']],
      body: infoData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
    });

    doc.save(`${project.metadata.name}_Client_Presentation.pdf`);
    showToast('تم استخراج تقرير PDF المعتمد بنجاح! 📄');
  };

  // Filter items if a single wall is selected
  const isWallIsolated = activeWall !== 'all';
  const visibleCabinets = isWallIsolated
    ? cabinets.filter((c) => isItemOnWall(c, activeWall, room.width, room.length))
    : cabinets;

  const visibleAppliances = isWallIsolated
    ? appliances.filter((a) => isItemOnWall(a, activeWall, room.width, room.length))
    : appliances;

  const visibleElements = isWallIsolated
    ? architecturalElements.filter((e) => isItemOnWall(e, activeWall, room.width, room.length))
    : architecturalElements;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 text-white overflow-hidden select-none font-sans flex flex-col"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Floating Header & Presentation Controls Bar */}
      <div className="absolute top-4 inset-x-4 md:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Project Title & Back to 3D */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-2xl">
          <button
            onClick={() => setActiveTab('3d-view')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
            title="العودة لبيئة العمل والتعديل"
          >
            <ArrowRight size={14} />
            <span>الرجوع للمصمم</span>
          </button>

          <div className="h-4 w-px bg-slate-700" />

          <div>
            <h1 className="text-xs md:text-sm font-black text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>{project.metadata.name || 'معاينة العميل'}</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              العميل: {project.metadata.clientName || 'العميل الفاضل'} | {formatDimension(room.width, unit)} × {formatDimension(room.length, unit)}
            </p>
          </div>
        </div>

        {/* Presentation Controls Bar */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 md:gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          {/* Wall Perspective / Elevation Buttons */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setActiveWall('all');
                setIsAutoSpin(true);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeWall === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="منظور شامل لجميع الجوانب"
            >
              <Box size={13} />
              <span className="hidden sm:inline">شامل</span>
            </button>
            <button
              onClick={() => {
                setActiveWall('wall-a');
                setIsAutoSpin(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                activeWall === 'wall-a' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="واجهة الجدار أ (الخلفي مع عزل باقي الجوانب)"
            >
              جدار أ
            </button>
            <button
              onClick={() => {
                setActiveWall('wall-b');
                setIsAutoSpin(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                activeWall === 'wall-b' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="واجهة الجدار ب (الأيمن مع عزل باقي الجوانب)"
            >
              جدار ب
            </button>
            <button
              onClick={() => {
                setActiveWall('wall-c');
                setIsAutoSpin(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                activeWall === 'wall-c' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="واجهة الجدار ج (الأمامي مع عزل باقي الجوانب)"
            >
              جدار ج
            </button>
            <button
              onClick={() => {
                setActiveWall('wall-d');
                setIsAutoSpin(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                activeWall === 'wall-d' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="واجهة الجدار د (الأيسر مع عزل باقي الجوانب)"
            >
              جدار د
            </button>
          </div>

          {/* Design Options (Option A / B / C) */}
          {designOptions && designOptions.length > 0 && (
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl gap-1 text-xs font-bold">
              {designOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`px-2.5 py-1.5 rounded-lg transition ${
                    activeOptionId === opt.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.name.split(':')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Lighting Presets */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl gap-1 text-xs">
            <button
              onClick={() => setLighting('day')}
              className={`p-1.5 rounded-lg transition ${lighting === 'day' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="نهاري مشرق"
            >
              <Sun size={15} />
            </button>
            <button
              onClick={() => setLighting('sunset')}
              className={`p-1.5 rounded-lg transition ${lighting === 'sunset' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="غروب دافئ"
            >
              <Sunset size={15} />
            </button>
            <button
              onClick={() => setLighting('night')}
              className={`p-1.5 rounded-lg transition ${lighting === 'night' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="ليلي بإضاءة ليد وسبوتات"
            >
              <Moon size={15} />
            </button>
            <button
              onClick={() => setLighting('studio')}
              className={`p-1.5 rounded-lg transition ${lighting === 'studio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="إضاءة استوديو ناصعة"
            >
              <LampDesk size={15} />
            </button>
          </div>

          {/* Open/Close Doors Reveal */}
          <button
            onClick={() => setOpenDoors(!openDoors)}
            className={`p-2 rounded-xl transition ${openDoors ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title={openDoors ? 'إغلاق الضلف والأدراج' : 'فتح الضلف والأدراج لإبهار العميل بالتقسيم الداخلي'}
          >
            {openDoors ? <DoorOpen size={16} /> : <DoorClosed size={16} />}
          </button>

          {/* Auto-Spin Toggle */}
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`p-2 rounded-xl transition ${isAutoSpin ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title="دوران تلقائي 360°"
          >
            {isAutoSpin ? <Pause size={15} /> : <Play size={15} />}
          </button>

          {/* Jump into Walkthrough VR */}
          <button
            onClick={() => setActiveTab('walkthrough-vr')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            title="جولة واقعية داخل المطبخ بالكيبورد والماوس"
          >
            <Footprints size={14} />
            <span className="hidden sm:inline">تجول بالداخل</span>
          </button>

          {/* Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl transition"
            title="التقاط لقطة شاشة عالية الدقة"
          >
            <Camera size={16} />
          </button>

          {/* Export Client Spec PDF */}
          <button
            onClick={handleExportClientPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md"
            title="استخراج وطباعة تقرير معتمد للعميل"
          >
            <FileText size={14} />
            <span className="hidden md:inline">تقرير العميل (PDF)</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      {/* Floating Materials & Specs Card (Bottom-Left) */}
      {showMaterialsCard && (
        <div className="absolute bottom-6 left-6 z-20 p-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl max-w-sm w-full space-y-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>مواصفات وخامات التصميم المعتمد</span>
            </span>
            <button onClick={() => setShowMaterialsCard(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">تشطيب الواجهات:</span>
              <span className="font-bold text-white truncate max-w-[170px]">{materials.frontFinish || 'تشطيب عصري فاخر'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">الرخام / السطح:</span>
              <span className="font-bold text-white truncate max-w-[170px]">{countertop.material || 'رخام كوارتز كلكتا'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">نوع المقابض:</span>
              <span className="font-bold text-white">{materials.handleStyle || 'مقبض بروفايل مدمج'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">عدد الوحدات:</span>
              <span className="font-bold font-mono text-amber-400">{cabinets.length} وحدة</span>
            </div>
          </div>
        </div>
      )}

      {/* The 3D Canvas */}
      <div className="w-full h-full relative">
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
          <color attach="background" args={[lighting === 'night' ? '#090d16' : lighting === 'sunset' ? '#2d1b18' : lighting === 'studio' ? '#1e293b' : '#0f172a']} />
          <PerspectiveCamera makeDefault position={[centerX + 3.4, centerY + 2.0, centerZ + 4.2]} fov={45} />
          
          <OrbitControls
            ref={controlsRef}
            target={[centerX, centerY * 0.7, centerZ]}
            autoRotate={isAutoSpin && activeWall === 'all'}
            autoRotateSpeed={0.8}
            enableDamping
            dampingFactor={0.08}
            minDistance={0.8}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2 + 0.05}
          />

          {/* Dynamic Camera Positioning for Wall Elevations */}
          <PresentationCameraController
            activeWall={activeWall}
            roomWidth={room.width}
            roomLength={room.length}
            ceilingHeight={room.ceilingHeight}
            controlsRef={controlsRef}
          />

          {/* Lighting */}
          {lighting === 'day' && (
            <>
              <ambientLight intensity={0.9} />
              <directionalLight position={[centerX + 5, 8, centerZ + 5]} intensity={1.8} castShadow />
              <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            </>
          )}
          {lighting === 'sunset' && (
            <>
              <ambientLight intensity={0.6} color="#ffd1aa" />
              <directionalLight position={[centerX + 7, 4, centerZ + 4]} intensity={2.2} color="#ff8c42" castShadow />
            </>
          )}
          {lighting === 'night' && (
            <>
              <ambientLight intensity={0.2} color="#1e293b" />
              <pointLight position={[centerX, room.ceilingHeight / 1000 - 0.2, centerZ]} intensity={2.5} color="#ffb703" distance={10} />
            </>
          )}
          {lighting === 'studio' && (
            <>
              <ambientLight intensity={1.2} />
              <directionalLight position={[centerX + 4, 8, centerZ + 4]} intensity={2.0} />
              <directionalLight position={[centerX - 4, 8, centerZ - 4]} intensity={1.0} />
            </>
          )}

          {/* Room Structure (passes isolated wall when active) */}
          <Room3D 
            room={room} 
            materials={materials} 
            backsplash={backsplash} 
            isolatedWallId={isWallIsolated ? activeWall : 'all'} 
          />

          {/* Architectural Elements */}
          <ArchElements3D elements={visibleElements} />

          {/* Cabinets */}
          {visibleCabinets.map((cab) => (
            <Cabinet3D
              key={cab.id}
              cabinet={cab}
              materials={materials}
              countertop={countertop}
              plinth={plinth}
              isOpenDoors={openDoors}
            />
          ))}

          {/* Appliances */}
          {visibleAppliances.map((app) => (
            <Appliance3D key={app.id} appliance={app} />
          ))}

          {/* Floor Shadow */}
          <ContactShadows
            position={[centerX, 0.001, centerZ]}
            opacity={0.5}
            scale={14}
            blur={1.6}
            far={3.2}
          />
        </Canvas>
      </div>
    </div>
  );
};
