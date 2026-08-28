import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from '../viewer3d/Cabinet3D';
import { Appliance3D } from '../viewer3d/Appliance3D';
import { ArchElements3D } from '../viewer3d/ArchElements3D';
import { Room3D } from '../viewer3d/Room3D';
import { formatDimension } from '../../utils/unitConversion';
import { 
  Play, 
  Pause, 
  Sun, 
  Moon, 
  Sunset, 
  Sparkles, 
  Maximize, 
  Download, 
  Layers, 
  Footprints, 
  Glasses, 
  Split, 
  Check, 
  Eye,
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const ClientPresentationView: React.FC = () => {
  const { project, updateMaterials } = useProjectStore();
  const { unit, setActiveTab } = useUIStore();
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, materials, designOptions } = project;

  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [lighting, setLighting] = useState<'day' | 'sunset' | 'night' | 'studio'>('day');
  const [activeOptionId, setActiveOptionId] = useState<string>(designOptions?.[0]?.id || 'default');
  const [showMaterialsCard, setShowMaterialsCard] = useState(true);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  const centerX = room.width / 2000;
  const centerZ = room.length / 2000;
  const centerY = room.ceilingHeight / 2500;

  const handleSelectOption = (optId: string) => {
    setActiveOptionId(optId);
    const selected = designOptions?.find((o) => o.id === optId);
    if (selected && selected.materials) {
      updateMaterials(selected.materials);
    }
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
    doc.text(`العميل: ${project.metadata.clientName || 'العميل الفاضل'}  |  التاريخ: ${project.metadata.date}`, 200, 15);

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
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white overflow-hidden select-none font-sans flex flex-col">
      {/* Top Floating Discreet Header */}
      <div className="absolute top-4 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Project Title & Client Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <div>
            <h1 className="text-sm font-black text-white">{project.metadata.name}</h1>
            <p className="text-[11px] text-slate-400 font-mono">
              العميل: {project.metadata.clientName || 'العميل'} | {formatDimension(room.width, unit)} × {formatDimension(room.length, unit)}
            </p>
          </div>
        </div>

        {/* Presentation Controls Bar */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          {/* Design Options (Option A / B / C) */}
          {designOptions && designOptions.length > 0 && (
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl gap-1 text-xs font-bold">
              {designOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`px-3 py-1.5 rounded-lg transition ${
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
              title="ليلي بإضاءة ليد"
            >
              <Moon size={15} />
            </button>
          </div>

          {/* Auto-Spin Toggle */}
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`p-2 rounded-xl transition ${isAutoSpin ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title="دوران تلقائي 360°"
          >
            {isAutoSpin ? <Pause size={15} /> : <Play size={15} />}
          </button>

          {/* Jump into 1-Click Walkthrough */}
          <button
            onClick={() => setActiveTab('walkthrough-vr')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
          >
            <Footprints size={14} />
            <span>تجول بالداخل</span>
          </button>

          {/* Export Client Spec PDF */}
          <button
            onClick={handleExportClientPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            <FileText size={14} />
            <span>تقرير العميل (PDF)</span>
          </button>
        </div>
      </div>

      {/* Floating Materials & Specs Card (Bottom-Left) */}
      {showMaterialsCard && (
        <div className="absolute bottom-6 left-6 z-20 p-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl max-w-sm w-full space-y-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>مواصفات وخامات التصميم</span>
            </span>
            <button onClick={() => setShowMaterialsCard(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">تشطيب الواجهات:</span>
              <span className="font-bold text-white truncate max-w-[170px]">{materials.frontFinish}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">الرخام / السطح:</span>
              <span className="font-bold text-white truncate max-w-[170px]">{countertop.material || 'رخام كوارتز كلكتا'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">نوع المقابض:</span>
              <span className="font-bold text-white">{materials.handleStyle}</span>
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
          <color attach="background" args={[lighting === 'night' ? '#090d16' : lighting === 'sunset' ? '#2d1b18' : '#0f172a']} />
          <PerspectiveCamera makeDefault position={[centerX + 3.4, centerY + 2.0, centerZ + 4.2]} fov={45} />
          <OrbitControls
            target={[centerX, centerY * 0.7, centerZ]}
            autoRotate={isAutoSpin}
            autoRotateSpeed={0.8}
            enableDamping
            dampingFactor={0.08}
            minDistance={1.2}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2 + 0.05}
          />

          {/* Lighting */}
          {lighting === 'day' && (
            <>
              <ambientLight intensity={0.85} />
              <directionalLight position={[centerX + 5, 8, centerZ + 5]} intensity={1.8} castShadow />
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

          {/* Room Structure */}
          <Room3D room={room} materials={materials} backsplash={backsplash} />

          {/* Architectural Elements */}
          <ArchElements3D elements={architecturalElements} />

          {/* Cabinets */}
          {cabinets.map((cab) => (
            <Cabinet3D
              key={cab.id}
              cabinet={cab}
              materials={materials}
              countertop={countertop}
              plinth={plinth}
              isOpenDoors={false}
            />
          ))}

          {/* Appliances */}
          {appliances.map((app) => (
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
