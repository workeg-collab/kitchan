import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from './Cabinet3D';
import { Appliance3D } from './Appliance3D';
import { ArchElements3D } from './ArchElements3D';
import { Room3D } from './Room3D';
import { TRANSLATIONS } from '../../utils/i18n';
import { formatDimension } from '../../utils/unitConversion';
import { calculateSnap } from '../../utils/cadGeometry';
import { 
  DoorOpen, 
  RotateCw, 
  Copy, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Move, 
  Maximize2, 
  Plus, 
  Minus,
  Sparkles,
  Magnet
} from 'lucide-react';

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
    addAppliance
  } = useProjectStore();

  const {
    openDoors3D,
    toggleOpenDoors3D,
    viewAngle3D,
    setViewAngle3D,
    unit,
    language,
  } = useUIStore();

  const t = TRANSLATIONS[language];
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, materials } = project;

  const centerX = room.width / 2000;
  const centerZ = room.length / 2000;
  const centerY = room.ceilingHeight / 2500;

  let camPos: [number, number, number] = [centerX + 3.2, centerY + 2.2, centerZ + 4.2];
  if (viewAngle3D === 'top') {
    camPos = [centerX, 6.5, centerZ + 0.01];
  } else if (viewAngle3D === 'front') {
    camPos = [centerX, centerY + 0.5, centerZ + 4.8];
  } else if (viewAngle3D === 'isometric') {
    camPos = [centerX + 4.5, centerY + 3.5, centerZ + 4.5];
  } else if (viewAngle3D === 'left') {
    camPos = [-3.5, centerY + 0.8, centerZ];
  } else if (viewAngle3D === 'right') {
    camPos = [centerX * 2 + 3.5, centerY + 0.8, centerZ];
  }

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

  return (
    <div 
      className="relative w-full h-full bg-slate-100 overflow-hidden select-none"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop3D}
    >
      {/* 3D Floating Camera & Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 p-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg">
        {/* Preset Angles */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1 text-xs">
          <button
            onClick={() => setViewAngle3D('perspective')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              viewAngle3D === 'perspective' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.perspective}
          </button>
          <button
            onClick={() => setViewAngle3D('isometric')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              viewAngle3D === 'isometric' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.isometric}
          </button>
          <button
            onClick={() => setViewAngle3D('top')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              viewAngle3D === 'top' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.top3D}
          </button>
          <button
            onClick={() => setViewAngle3D('front')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              viewAngle3D === 'front' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.front}
          </button>
        </div>

        <div className="w-[1px] h-6 bg-slate-200 mx-1" />

        {/* Door Animation Toggle */}
        <button
          onClick={toggleOpenDoors3D}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            openDoors3D
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
          title="Open / Close all cabinet doors and drawers"
        >
          <DoorOpen size={16} />
          <span>{openDoors3D ? t.closeDoors : t.openDoors}</span>
        </button>
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
        <PerspectiveCamera makeDefault position={camPos} fov={45} />
        <OrbitControls
          target={[centerX, centerY * 0.7, centerZ]}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2 + 0.05}
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

        {/* Room Structure */}
        <Room3D room={room} materials={materials} backsplash={backsplash} />

        {/* Architectural Elements (Doors, Windows, Columns) */}
        <ArchElements3D
          elements={architecturalElements}
          selectedId={selectedId}
          onSelect={(id) => setSelected(id, 'element')}
        />

        {/* Cabinets */}
        {cabinets.map((cab) => (
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
        {appliances.map((app) => (
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
