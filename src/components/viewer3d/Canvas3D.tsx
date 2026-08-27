import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from './Cabinet3D';
import { Appliance3D } from './Appliance3D';
import { ArchElements3D } from './ArchElements3D';
import { Room3D } from './Room3D';
import { TRANSLATIONS } from '../../utils/i18n';
import { DoorOpen } from 'lucide-react';

export const Canvas3D: React.FC = () => {
  const { project, selectedId, setSelected, clearSelection } = useProjectStore();
  const {
    openDoors3D,
    toggleOpenDoors3D,
    viewAngle3D,
    setViewAngle3D,
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

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden select-none">
      {/* 3D Floating Control Toolbar (Light Mode) */}
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
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[centerX + 5, 7, centerZ + 6]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-5, 5, -4]} intensity={0.5} />
        <pointLight position={[centerX, room.ceilingHeight / 1000 - 0.2, centerZ]} intensity={1.0} color="#fffbeb" distance={10} />

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
