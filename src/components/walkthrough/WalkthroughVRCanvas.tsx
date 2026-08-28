import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from '../viewer3d/Cabinet3D';
import { Appliance3D } from '../viewer3d/Appliance3D';
import { ArchElements3D } from '../viewer3d/ArchElements3D';
import { Room3D } from '../viewer3d/Room3D';
import { formatDimension } from '../../utils/unitConversion';
import { 
  Glasses, 
  Eye, 
  Move, 
  Maximize, 
  Minimize, 
  Sun, 
  Moon, 
  Layers, 
  Info, 
  Sparkles, 
  HelpCircle,
  Footprints,
  Compass
} from 'lucide-react';

// First-Person Walkthrough Engine inside R3F Canvas
const FirstPersonWalkthroughRig: React.FC<{
  roomWidth: number;
  roomLength: number;
  ceilingHeight: number;
  eyeHeight: number;
  isPointerLocked: boolean;
  onSelectCabinetInfo: (info: any) => void;
  movementInput: { forward: number; strafe: number };
}> = ({
  roomWidth,
  roomLength,
  ceilingHeight,
  eyeHeight,
  isPointerLocked,
  onSelectCabinetInfo,
  movementInput,
}) => {
  const { camera, gl } = useThree();
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  const minX = 0.4;
  const maxX = roomWidth / 1000 - 0.4;
  const minZ = 0.4;
  const maxZ = roomLength / 1000 - 0.4;

  // Initialize camera position in the center of the room at eye level
  useEffect(() => {
    camera.position.set(roomWidth / 2000, eyeHeight, roomLength / 2000 + 0.8);
    camera.rotation.set(0, 0, 0);
    euler.current.set(0, 0, 0, 'YXZ');
  }, [roomWidth, roomLength, eyeHeight, camera]);

  // Keyboard input listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Mouse move listener for looking around
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      euler.current.y -= movementX * 0.0022;
      euler.current.x -= movementY * 0.0022;
      euler.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [camera, gl]);

  // Frame update: Movement physics & room collision
  useFrame((_, delta) => {
    const speed = 2.4 * delta; // 2.4 meters per second

    let moveForward = 0;
    let moveStrafe = 0;

    if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) moveForward += 1;
    if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) moveForward -= 1;
    if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) moveStrafe -= 1;
    if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) moveStrafe += 1;

    // Add touch joystick input
    moveForward += movementInput.forward;
    moveStrafe += movementInput.strafe;

    if (moveForward !== 0 || moveStrafe !== 0) {
      const forwardVec = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forwardVec.y = 0;
      forwardVec.normalize();

      const sideVec = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      sideVec.y = 0;
      sideVec.normalize();

      const deltaMove = forwardVec.multiplyScalar(moveForward * speed).add(sideVec.multiplyScalar(moveStrafe * speed));

      const newPos = camera.position.clone().add(deltaMove);

      // Collision avoidance with room walls
      newPos.x = Math.max(minX, Math.min(maxX, newPos.x));
      newPos.z = Math.max(minZ, Math.min(maxZ, newPos.z));
      newPos.y = eyeHeight;

      camera.position.copy(newPos);
    }
  });

  return null;
};

export const WalkthroughVRCanvas: React.FC = () => {
  const { project, updateMaterials } = useProjectStore();
  const { unit } = useUIStore();
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, materials, designOptions } = project;

  const [eyeHeight, setEyeHeight] = useState(1.65); // 1.65m human eye level
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isStereoVRMode, setIsStereoVRMode] = useState(false);
  const [lightingMode, setLightingMode] = useState<'day' | 'night'>('day');
  const [inspectedCabinet, setInspectedCabinet] = useState<any | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Virtual touch joystick state
  const [touchMovement, setTouchMovement] = useState({ forward: 0, strafe: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const centerX = room.width / 2000;
  const centerZ = room.length / 2000;
  const centerY = room.ceilingHeight / 2500;

  // Pointer Lock handling for desktop look around
  const handleRequestPointerLock = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock();
    }
  };

  useEffect(() => {
    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === containerRef.current?.querySelector('canvas');
      setIsPointerLocked(isLocked);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  // WebXR Hardware Session Initializer
  const handleLaunchWebXR = async () => {
    if ('xr' in navigator && (navigator as any).xr) {
      try {
        const isSupported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        if (isSupported) {
          const session = await (navigator as any).xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
          });
          alert('تم بدء جلسة الواقع الافتراضي WebXR بنجاح على نظارتك!');
          return;
        }
      } catch (e) {
        console.warn('WebXR headset request error:', e);
      }
    }
    // Fallback to High-Quality 360 Gyro / Stereoscopic Mode
    setIsStereoVRMode(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 text-white overflow-hidden select-none font-sans"
    >
      {/* 1. TOP FLOATING IMMERSIVE WALKTHROUGH HUD */}
      <div className="absolute top-4 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Badges */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-bold">
            <Footprints size={15} />
            <span>جولة التجول الافتراضي (First-Person Walkthrough)</span>
          </div>

          <div className="w-[1px] h-5 bg-slate-800" />

          {/* Eye Height Slider */}
          <div className="flex items-center gap-1.5 px-2 text-xs text-slate-300 font-mono">
            <span>ارتفاع النظر:</span>
            <span className="font-bold text-amber-400">{Math.round(eyeHeight * 100)} سم</span>
          </div>
        </div>

        {/* Right Controls: WebXR, Lighting, Option Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Design Options Switcher */}
          {designOptions && designOptions.length > 0 && (
            <div className="flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800 gap-1 text-xs font-bold">
              {designOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (opt.materials) updateMaterials(opt.materials);
                  }}
                  className="px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
                >
                  {opt.name.split(':')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Day / Night Lighting */}
          <button
            onClick={() => setLightingMode(lightingMode === 'day' ? 'night' : 'day')}
            className="p-2.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-amber-400 rounded-2xl border border-slate-800 shadow-xl transition"
            title="تبديل الإضاءة (نهاري / ليلي)"
          >
            {lightingMode === 'day' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* WebXR VR Headset Button */}
          <button
            onClick={handleLaunchWebXR}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black shadow-xl shadow-purple-600/30 transition transform active:scale-95 cursor-pointer border border-purple-400/30"
            title="تشغيل تجربة الواقع الافتراضي VR"
          >
            <Glasses size={18} />
            <span>دخول وضع الـ VR (WebXR)</span>
          </button>
        </div>
      </div>

      {/* 2. CLICK-TO-ENTER WALKTHROUGH PROMPT (IF NOT POINTER LOCKED) */}
      {!isPointerLocked && !isStereoVRMode && (
        <div
          onClick={handleRequestPointerLock}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] cursor-pointer transition"
        >
          <div className="p-6 bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl max-w-md text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-lg">
              <Eye size={32} />
            </div>

            <div>
              <h3 className="text-base font-black text-white">انقر هنا للدخول والتحرك داخل الغرفة</h3>
              <p className="text-xs text-slate-400 mt-1">
                استخدم أزرار <strong>W, A, S, D</strong> أو الأسهم للتحرك، وحرك الماوس للنظر في أي اتجاه 360°
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
              <div className="p-2 bg-slate-800/80 rounded-xl">W / S : تقدم للخلف والأمام</div>
              <div className="p-2 bg-slate-800/80 rounded-xl">A / D : تحرك يميناً ويساراً</div>
            </div>

            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition">
              بدء الجولة الافتراضية
            </button>
          </div>
        </div>
      )}

      {/* 3. CENTER RETICLE / CROSSHAIR */}
      {isPointerLocked && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
        </div>
      )}

      {/* 4. CABINET INSPECTION HUD OVERLAY */}
      {inspectedCabinet && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 p-4 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl text-xs text-white max-w-sm w-full animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-amber-400">{inspectedCabinet.name}</span>
            <button onClick={() => setInspectedCabinet(null)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px] text-slate-300">
            <div>العرض: {formatDimension(inspectedCabinet.width, unit)}</div>
            <div>الارتفاع: {formatDimension(inspectedCabinet.height, unit)}</div>
            <div>العمق: {formatDimension(inspectedCabinet.depth, unit)}</div>
          </div>
        </div>
      )}

      {/* 5. THE 3D WALKTHROUGH CANVAS */}
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <color attach="background" args={[lightingMode === 'night' ? '#0b1120' : '#f1f5f9']} />
        <PerspectiveCamera makeDefault fov={70} near={0.1} far={50} />

        {/* Lighting */}
        {lightingMode === 'day' ? (
          <>
            <ambientLight intensity={0.9} />
            <directionalLight
              position={[centerX + 5, 8, centerZ + 5]}
              intensity={1.8}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
          </>
        ) : (
          <>
            <ambientLight intensity={0.2} color="#1e293b" />
            <pointLight position={[centerX, room.ceilingHeight / 1000 - 0.2, centerZ]} intensity={2.5} color="#ffb703" distance={10} />
          </>
        )}

        {/* Walkthrough Rig */}
        <FirstPersonWalkthroughRig
          roomWidth={room.width}
          roomLength={room.length}
          ceilingHeight={room.ceilingHeight}
          eyeHeight={eyeHeight}
          isPointerLocked={isPointerLocked}
          onSelectCabinetInfo={setInspectedCabinet}
          movementInput={touchMovement}
        />

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
            onSelect={() => setInspectedCabinet(cab)}
          />
        ))}

        {/* Appliances */}
        {appliances.map((app) => (
          <Appliance3D key={app.id} appliance={app} />
        ))}

        {/* Floor Shadows */}
        <ContactShadows
          position={[centerX, 0.001, centerZ]}
          opacity={0.45}
          scale={14}
          blur={1.6}
          far={3}
        />
      </Canvas>
    </div>
  );
};
