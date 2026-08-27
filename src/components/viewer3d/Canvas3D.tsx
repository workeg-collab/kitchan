import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Float } from '@react-three/drei';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from './Cabinet3D';
import { Appliance3D } from './Appliance3D';
import { ArchElements3D } from './ArchElements3D';
import { Room3D } from './Room3D';
import { 
  Eye, 
  DoorOpen, 
  Camera, 
  Rotate3d, 
  Layers, 
  SunMedium, 
  Maximize2 
} from 'lucide-react';

export const Canvas3D: React.FC = () => {
  const { project, selectedId, setSelected, clearSelection } = useProjectStore();
  const {
    openDoors3D,
    toggleOpenDoors3D,
    viewAngle3D,
    setViewAngle3D,
  } = useUIStore();

  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, materials } = project;

  // Center of the room in 3D (meters)
  const centerX = room.width / 2000;
  const centerZ = room.length / 2000;
  const centerY = room.ceilingHeight / 2500;

  // Camera presets based on viewAngle3D
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
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* 3D Floating Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl">
        {/* Preset Angles */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-lg border border-slate-800 gap-1 text-xs">
          <button
            onClick={() => setViewAngle3D('perspective')}
            className={`px-2.5 py-1.5 rounded-md font-semibold transition ${
              viewAngle3D === 'perspective' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Perspective
          </button>
          <button
            onClick={() => setViewAngle3D('isometric')}
            className={`px-2.5 py-1.5 rounded-md font-semibold transition ${
              viewAngle3D === 'isometric' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Isometric
          </button>
          <button
            onClick={() => setViewAngle3D('top')}
            className={`px-2.5 py-1.5 rounded-md font-semibold transition ${
              viewAngle3D === 'top' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top 3D
          </button>
          <button
            onClick={() => setViewAngle3D('front')}
            className={`px-2.5 py-1.5 rounded-md font-semibold transition ${
              viewAngle3D === 'front' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Front
          </button>
        </div>

        <div className="w-[1px] h-6 bg-slate-800 mx-1" />

        {/* Door Animation Toggle */}
        <button
          onClick={toggleOpenDoors3D}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            openDoors3D
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Open / Close all cabinet doors and drawers"
        >
          <DoorOpen size={16} />
          <span>{openDoors3D ? 'Close Doors' : 'Open Doors'}</span>
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onPointerMissed={() => clearSelection()}
      >
        <PerspectiveCamera makeDefault position={camPos} fov={45} />
        <OrbitControls
          target={[centerX, centerY * 0.7, centerZ]}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2 + 0.05} // Prevent going under floor
        />

        {/* Lighting Rig */}
        <ambientLight intensity={0.65} />
        {/* Warm key light */}
        <directionalLight
          position={[centerX + 4, 6, centerZ + 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        {/* Soft fill light */}
        <directionalLight position={[-4, 4, -3]} intensity={0.4} />
        {/* Interior ceiling spot */}
        <pointLight position={[centerX, room.ceilingHeight / 1000 - 0.2, centerZ]} intensity={0.8} color="#fffbeb" distance={8} />

        {/* Room Structure */}
        <Room3D room={room} materials={materials} backsplash={backsplash} />

        {/* Architectural Elements */}
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

        {/* Soft ground contact shadow */}
        <ContactShadows
          position={[centerX, 0.001, centerZ]}
          opacity={0.6}
          scale={12}
          blur={1.8}
          far={3}
        />
      </Canvas>
    </div>
  );
};
