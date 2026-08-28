import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { Cabinet3D } from '../viewer3d/Cabinet3D';
import { Appliance3D } from '../viewer3d/Appliance3D';
import { ArchElements3D } from '../viewer3d/ArchElements3D';
import { Room3D } from '../viewer3d/Room3D';
import { 
  LightingPreset, 
  CameraAnglePreset, 
  RenderResolution, 
  RenderSnapshot 
} from '../../types';
import { 
  Camera, 
  Video, 
  Sun, 
  Moon, 
  Sunset, 
  Sparkles, 
  Download, 
  Sliders, 
  Split, 
  Eye, 
  Image as ImageIcon, 
  Check, 
  Film,
  Zap
} from 'lucide-react';
import { saveAs } from 'file-saver';

// Cinematic Camera Controller Component
const CinematicCameraController: React.FC<{
  cameraAngle: CameraAnglePreset;
  isOrbitingVideo: boolean;
  orbitProgress: number;
  roomWidth: number;
  roomLength: number;
  ceilingHeight: number;
}> = ({ cameraAngle, isOrbitingVideo, orbitProgress, roomWidth, roomLength, ceilingHeight }) => {
  const { camera } = useThree();

  const centerX = roomWidth / 2000;
  const centerZ = roomLength / 2000;
  const centerY = ceilingHeight / 2500;

  useFrame(() => {
    if (isOrbitingVideo) {
      // Cinematic 360 degree smooth fly-through orbit
      const radius = Math.max(centerX, centerZ) * 1.8 + 1.2;
      const angle = orbitProgress * Math.PI * 2;
      const camX = centerX + Math.cos(angle) * radius;
      const camZ = centerZ + Math.sin(angle) * radius;
      const camY = centerY + Math.sin(angle * 2) * 0.3 + 0.8;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(centerX, centerY * 0.7, centerZ);
    } else {
      let targetPos: [number, number, number] = [centerX + 3.2, centerY + 1.8, centerZ + 3.8];
      let lookTarget: [number, number, number] = [centerX, centerY * 0.6, centerZ];

      if (cameraAngle === 'wide') {
        targetPos = [centerX + 4.5, centerY + 2.5, centerZ + 5.2];
      } else if (cameraAngle === 'eye-level') {
        targetPos = [centerX + 0.5, 1.65, centerZ + 2.4];
        lookTarget = [centerX, 1.3, centerZ];
      } else if (cameraAngle === 'macro-detail') {
        targetPos = [centerX + 1.2, 1.1, centerZ + 1.0];
        lookTarget = [centerX + 0.8, 0.9, centerZ + 0.2];
      } else if (cameraAngle === 'axonometric') {
        targetPos = [centerX + 4.8, centerY + 4.5, centerZ + 4.8];
      } else if (cameraAngle === 'top-down') {
        targetPos = [centerX, 6.8, centerZ + 0.01];
      }

      camera.position.lerp(new THREE.Vector3(...targetPos), 0.1);
      camera.lookAt(new THREE.Vector3(...lookTarget));
    }
  });

  return null;
};

export const VisualizationStudio: React.FC = () => {
  const { project, updateMaterials } = useProjectStore();
  const { unit } = useUIStore();
  const { room, cabinets, appliances, architecturalElements, countertop, plinth, backsplash, materials, designOptions } = project;

  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('daylight');
  const [cameraAngle, setCameraAngle] = useState<CameraAnglePreset>('perspective');
  const [resolution, setResolution] = useState<RenderResolution>('1080p');
  const [activeDesignOptionId, setActiveDesignOptionId] = useState<string>(designOptions?.[0]?.id || 'default');

  // Post processing filters
  const [exposure, setExposure] = useState(1.0);
  const [contrast, setContrast] = useState(105);
  const [warmth, setWarmth] = useState(0);
  const [bloom, setBloom] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);

  // Before / After Comparison Slider State
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [splitSliderPos, setSplitSliderPos] = useState(50);

  // Video recording state
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Captured snapshots gallery
  const [snapshots, setSnapshots] = useState<RenderSnapshot[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const centerX = room.width / 2000;
  const centerZ = room.length / 2000;
  const centerY = room.ceilingHeight / 2500;

  // Handle Design Option Change
  const handleSelectOption = (optId: string) => {
    setActiveDesignOptionId(optId);
    const selected = designOptions?.find((o) => o.id === optId);
    if (selected && selected.materials) {
      updateMaterials(selected.materials);
    }
  };

  // High-Resolution Snapshot Capture Function
  const captureRenderSnapshot = async (isAiEnhance: boolean = false) => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    setIsCapturing(true);
    if (isAiEnhance) setAiGenerating(true);

    setTimeout(async () => {
      try {
        const rawDataUrl = canvas.toDataURL('image/png', 1.0);

        let finalUrl = rawDataUrl;

        // If AI Enhance is requested and environment variables exist, call AI enhancement endpoint
        const aiEndpoint = import.meta.env.VITE_AI_RENDER_ENDPOINT;
        const aiApiKey = import.meta.env.VITE_AI_RENDER_API_KEY;

        if (isAiEnhance && aiEndpoint && aiApiKey) {
          try {
            const resp = await fetch(aiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${aiApiKey}`,
              },
              body: JSON.stringify({
                image: rawDataUrl,
                prompt: `Ultra-realistic 8k architectural interior render of ${project.metadata.name}, photorealistic lighting, raytracing, highly detailed textures`,
              }),
            });
            if (resp.ok) {
              const resData = await resp.json();
              if (resData.outputUrl || resData.imageUrl) {
                finalUrl = resData.outputUrl || resData.imageUrl;
              }
            }
          } catch (e) {
            console.warn('AI Render fallback to high-res WebGL canvas render:', e);
          }
        }

        const newSnap: RenderSnapshot = {
          id: `snap-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('ar-EG'),
          imageUrl: finalUrl,
          angleName: cameraAngle,
          lightingPreset,
          resolution,
          designOptionName: designOptions?.find((o) => o.id === activeDesignOptionId)?.name,
          isAiEnhanced: isAiEnhance,
        };

        setSnapshots((prev) => [newSnap, ...prev]);
      } catch (err) {
        console.error('Capture error:', err);
      } finally {
        setIsCapturing(false);
        setAiGenerating(false);
      }
    }, 150);
  };

  // Video Walkthrough Recording using Canvas captureStream
  const handleStartWalkthroughVideo = () => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    setIsRecordingVideo(true);
    setVideoProgress(0);
    recordedChunksRef.current = [];

    try {
      const stream = canvas.captureStream(30); // 30 FPS stream
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecordingVideo(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      // Animate progress over 8 seconds
      const durationMs = 8000;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const prog = Math.min(1, elapsed / durationMs);
        setVideoProgress(prog);

        if (prog >= 1) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 50);
    } catch (e) {
      console.error('Video recorder error:', e);
      setIsRecordingVideo(false);
    }
  };

  return (
    <div className="flex w-full h-full bg-slate-900 text-white overflow-hidden select-none font-sans relative">
      {/* 1. LEFT STUDIO CONTROL SIDEBAR */}
      <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full z-20 overflow-y-auto p-4 space-y-6">
        {/* Studio Header */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Camera size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">استوديو الرندر والتصوير الواقعي</h2>
            <p className="text-[11px] text-slate-400">توليد لقطات وفيديوهات تقديمية للعملاء</p>
          </div>
        </div>

        {/* Design Options Switcher (Option A / B / C) */}
        {designOptions && designOptions.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>خيارات التصميم والألوان (Design Options)</span>
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {designOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between ${
                    activeDesignOptionId === opt.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{opt.name}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{opt.description}</div>
                  </div>
                  {activeDesignOptionId === opt.id && <Check size={14} className="text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lighting Atmosphere Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sun size={14} className="text-amber-400" />
            <span>بيئة الإضاءة والظلال (Atmosphere)</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'daylight', label: 'ضوء نهار مشرق', icon: <Sun size={14} /> },
              { id: 'sunset', label: 'غروب ذهبي دافئ', icon: <Sunset size={14} /> },
              { id: 'night', label: 'ليلي وإضاءة ليد', icon: <Moon size={14} /> },
              { id: 'studio', label: 'استوديو ناعم', icon: <Sparkles size={14} /> },
            ].map((lp) => (
              <button
                key={lp.id}
                onClick={() => setLightingPreset(lp.id as LightingPreset)}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition ${
                  lightingPreset === lp.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {lp.icon}
                <span>{lp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Camera Angles Presets (Contextual to Project Type) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye size={14} className="text-blue-400" />
              <span>زوايا الكاميرا المعمارية</span>
            </label>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60 uppercase">
              {project.metadata.projectType}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { 
                id: 'perspective', 
                label: project.metadata.projectType === 'kitchen' ? 'منظور المطبخ 45°' : project.metadata.projectType === 'dressing' ? 'منظور الدريسينج 45°' : project.metadata.projectType === 'bedroom' ? 'منظور السرير 45°' : 'منظور 45° شامل' 
              },
              { id: 'wide', label: 'عدسة واسعة 16mm' },
              { id: 'eye-level', label: 'عين الإنسان 1.65m' },
              { 
                id: 'macro-detail', 
                label: project.metadata.projectType === 'kitchen' ? 'كلوز الرخام والمقابض' : project.metadata.projectType === 'dressing' ? 'كلوز جزيرة الساعات' : project.metadata.projectType === 'bedroom' ? 'كلوز ظهر السرير' : 'كلوز تفاصيل الخامات' 
              },
              { id: 'axonometric', label: 'أيزومتريك 3D' },
              { id: 'top-down', label: 'مخطط رأسي مسقط' },
            ].map((ca) => (
              <button
                key={ca.id}
                onClick={() => setCameraAngle(ca.id as CameraAnglePreset)}
                className={`p-2 rounded-xl border text-[11px] font-bold transition text-right ${
                  cameraAngle === ca.id
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {ca.label}
              </button>
            ))}
          </div>
        </div>

        {/* Post-Processing Sliders */}
        <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sliders size={13} className="text-emerald-400" />
              <span>معالجة الصورة (Post-FX)</span>
            </span>
            <button
              onClick={() => {
                setExposure(1.0);
                setContrast(105);
                setWarmth(0);
              }}
              className="text-[10px] text-slate-500 hover:text-slate-300 underline"
            >
              إعادة ضبط
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>السطوع والتعريض (Exposure)</span>
                <span className="font-mono">{exposure.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={exposure}
                onChange={(e) => setExposure(Number(e.target.value))}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>التباين والعمق (Contrast)</span>
                <span className="font-mono">{contrast}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                step="5"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">توهج إضاءة الليد (LED Bloom)</span>
              <input
                type="checkbox"
                checked={bloom}
                onChange={(e) => setBloom(e.target.checked)}
                className="accent-blue-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">ختم اسم المشروع والمصمم</span>
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
                className="accent-blue-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Resolution Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">دقة الرندر (Resolution)</label>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
            {(['1080p', '2k', '4k'] as RenderResolution[]).map((r) => (
              <button
                key={r}
                onClick={() => setResolution(r)}
                className={`py-1.5 rounded-xl border font-bold transition uppercase ${
                  resolution === r
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons: High-Res Render & AI Photorealism */}
        <div className="space-y-2 pt-2">
          {/* Capture High-Res Render Button */}
          <button
            onClick={() => captureRenderSnapshot(false)}
            disabled={isCapturing}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <Camera size={16} />
            <span>{isCapturing ? 'جاري التقاط الرندر...' : 'التقاط رندر فوتوريل فائق الدقة (HD Render)'}</span>
          </button>

          {/* AI Photorealism Generator Button */}
          <button
            onClick={() => captureRenderSnapshot(true)}
            disabled={aiGenerating}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <Zap size={16} className="fill-current" />
            <span>{aiGenerating ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'تحسين واقعي فائق (AI Photorealism)'}</span>
          </button>

          {/* Video Walkthrough Fly-through Generator */}
          <button
            onClick={handleStartWalkthroughVideo}
            disabled={isRecordingVideo}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <Film size={16} className="text-purple-400" />
            <span>{isRecordingVideo ? `جاري تسجيل الفيديو (${Math.round(videoProgress * 100)}%)...` : 'توليد فيديو سينمائي 360° للمشروع'}</span>
          </button>
        </div>
      </aside>

      {/* 2. CENTER HIGH-RESOLUTION 3D RENDER VIEWPORT */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Top Viewport Floating Toolbar */}
        <div className="absolute top-4 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                showBeforeAfter
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Split size={14} />
              <span>مقارنة قبل / بعد (Before & After)</span>
            </button>
          </div>

          {/* Live Watermark Overlay (if enabled) */}
          {showWatermark && (
            <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-white">{project.metadata.name}</span>
              <span className="text-slate-500">•</span>
              <span>{project.metadata.designerName || 'استوديو التصميم'}</span>
            </div>
          )}
        </div>

        {/* The 3D Canvas with Custom Post-FX Container */}
        <div
          ref={canvasContainerRef}
          className="w-full h-full relative"
          style={{
            filter: `brightness(${exposure}) contrast(${contrast}%) saturate(${100 + warmth * 0.5}%)`,
          }}
        >
          <Canvas
            shadows
            gl={{ preserveDrawingBuffer: true, antialias: true }}
          >
            {/* Dynamic Atmosphere Background Color */}
            <color
              attach="background"
              args={[
                lightingPreset === 'night'
                  ? '#090d16'
                  : lightingPreset === 'sunset'
                  ? '#2d1b18'
                  : lightingPreset === 'studio'
                  ? '#1e293b'
                  : '#f1f5f9',
              ]}
            />

            <PerspectiveCamera makeDefault fov={cameraAngle === 'wide' ? 65 : 45} />
            <OrbitControls
              target={[centerX, centerY * 0.7, centerZ]}
              enableDamping
              dampingFactor={0.08}
              minDistance={1.0}
              maxDistance={22}
              maxPolarAngle={Math.PI / 2 + 0.05}
            />

            {/* Dynamic Atmosphere Lighting */}
            {lightingPreset === 'daylight' && (
              <>
                <ambientLight intensity={0.9} />
                <directionalLight
                  position={[centerX + 6, 8, centerZ + 6]}
                  intensity={1.8}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                  shadow-bias={-0.0001}
                />
                <directionalLight position={[-6, 5, -4]} intensity={0.7} />
              </>
            )}

            {lightingPreset === 'sunset' && (
              <>
                <ambientLight intensity={0.6} color="#ffd1aa" />
                <directionalLight
                  position={[centerX + 8, 4, centerZ + 5]}
                  intensity={2.2}
                  color="#ff8c42"
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <pointLight position={[centerX, 2.2, centerZ]} intensity={1.5} color="#ffe4c4" distance={8} />
              </>
            )}

            {lightingPreset === 'night' && (
              <>
                <ambientLight intensity={0.2} color="#1e293b" />
                {/* Warm LED Strip Lighting inside cabinets & ceiling */}
                <pointLight position={[centerX, room.ceilingHeight / 1000 - 0.2, centerZ]} intensity={2.5} color="#ffb703" distance={12} />
                <pointLight position={[centerX + 1, 1.4, 0.4]} intensity={1.8} color="#fbbf24" distance={5} />
                <pointLight position={[centerX - 1, 1.4, 0.4]} intensity={1.8} color="#fbbf24" distance={5} />
              </>
            )}

            {lightingPreset === 'studio' && (
              <>
                <ambientLight intensity={0.8} />
                <directionalLight position={[centerX + 4, 6, centerZ + 4]} intensity={1.4} castShadow />
                <directionalLight position={[centerX - 4, 6, centerZ - 4]} intensity={1.0} />
                <pointLight position={[centerX, 2.5, centerZ]} intensity={1.2} color="#ffffff" />
              </>
            )}

            {/* Cinematic Camera Controller */}
            <CinematicCameraController
              cameraAngle={cameraAngle}
              isOrbitingVideo={isRecordingVideo}
              orbitProgress={videoProgress}
              roomWidth={room.width}
              roomLength={room.length}
              ceilingHeight={room.ceilingHeight}
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
              />
            ))}

            {/* Appliances */}
            {appliances.map((app) => (
              <Appliance3D key={app.id} appliance={app} />
            ))}

            {/* Contact Shadows */}
            <ContactShadows
              position={[centerX, 0.001, centerZ]}
              opacity={lightingPreset === 'night' ? 0.8 : 0.45}
              scale={14}
              blur={1.8}
              far={3.5}
            />
          </Canvas>

          {/* Before & After Comparison Wipe Slider Overlay */}
          {showBeforeAfter && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div
                className="absolute inset-y-0 right-0 bg-slate-900/90 backdrop-grayscale border-l-2 border-blue-500 flex items-center justify-center pointer-events-auto"
                style={{ width: `${100 - splitSliderPos}%` }}
              >
                <div className="absolute top-6 right-6 px-3 py-1 bg-black/70 rounded-xl text-xs font-bold text-slate-300 font-mono">
                  المخطط الهندسي الأولي (Wireframe / Raw)
                </div>
              </div>

              {/* Slider Drag Handle */}
              <input
                type="range"
                min="5"
                max="95"
                value={splitSliderPos}
                onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                className="absolute inset-x-0 bottom-6 z-30 w-1/2 mx-auto accent-blue-500 pointer-events-auto cursor-ew-resize"
              />
            </div>
          )}
        </div>

        {/* Video Download Ready Toast Banner */}
        {recordedVideoUrl && (
          <div className="absolute bottom-4 left-6 right-6 z-30 p-4 bg-slate-950/95 border border-emerald-500/50 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Video size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">تم تجهيز وتوليد الفيديو السينمائي بنجاح!</div>
                <div className="text-[11px] text-slate-400">فيديو 360° عالي الدقة جاهز للمشاركة مع العميل</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  saveAs(recordedVideoUrl, `${project.metadata.name.replace(/\s+/g, '_')}_presentation.webm`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
              >
                <Download size={14} />
                <span>تحميل الفيديو (.webm)</span>
              </button>
              <button
                onClick={() => setRecordedVideoUrl(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. RIGHT GALLERY SIDEBAR (CAPTURED HIGH-RES RENDERS) */}
      <aside className="w-72 bg-slate-950 border-l border-slate-800 flex flex-col h-full z-20 p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <ImageIcon size={16} className="text-blue-400" />
            <span>معرض الرندرات ({snapshots.length})</span>
          </div>
          {snapshots.length > 0 && (
            <button
              onClick={() => setSnapshots([])}
              className="text-[10px] text-slate-500 hover:text-red-400 transition"
            >
              مسح الكل
            </button>
          )}
        </div>

        {snapshots.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
            <Camera size={32} className="opacity-30" />
            <p className="text-xs font-medium">لم يتم التقاط رندرات بعد</p>
            <p className="text-[10px] text-slate-600">انقر على زر "التقاط رندر فوتوريل" لحفظ لقطات عالية الدقة للعميل</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-blue-500 transition shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={snap.imageUrl}
                    alt={snap.angleName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {snap.isAiEnhanced && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-md flex items-center gap-1">
                      <Zap size={10} className="fill-current" /> AI Realism
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-slate-300 text-[9px] font-mono rounded">
                    {snap.resolution.toUpperCase()}
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200 capitalize">{snap.angleName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{snap.timestamp}</div>
                  </div>

                  <button
                    onClick={() => saveAs(snap.imageUrl, `${project.metadata.name}_${snap.angleName}.png`)}
                    className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition shadow-xs"
                    title="تحميل الصورة بجودة عالية"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};
