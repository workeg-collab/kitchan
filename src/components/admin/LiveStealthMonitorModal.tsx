import React, { useEffect, useState } from 'react';
import { liveTelemetry, LiveSubscriberSession } from '../../services/liveTelemetryService';
import { 
  Eye, 
  Activity, 
  X, 
  Layers, 
  Box, 
  Compass, 
  ShieldAlert, 
  Clock, 
  Maximize2, 
  Sparkles, 
  Radio,
  CheckCircle2,
  RefreshCw,
  EyeOff
} from 'lucide-react';

interface Props {
  session: LiveSubscriberSession | null;
  onClose: () => void;
}

export const LiveStealthMonitorModal: React.FC<Props> = ({ session: initialSession, onClose }) => {
  const [liveSession, setLiveSession] = useState<LiveSubscriberSession | null>(initialSession);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!initialSession) return;
    setLiveSession(initialSession);

    // Subscribe to live continuous updates for this specific tenant
    const unsubscribe = liveTelemetry.subscribeToSessions((sessions) => {
      const match = sessions.find((s) => s.tenantId === initialSession.tenantId);
      if (match) {
        setLiveSession(match);
      }
    });

    return () => unsubscribe();
  }, [initialSession]);

  if (!liveSession) return null;

  const roomW = liveSession.roomDimensions?.width || 4000;
  const roomL = liveSession.roomDimensions?.length || 3000;
  const cabinets = liveSession.snapshotCabinets || [];

  // Coordinate scaling for 2D Live Canvas Mirror
  const canvasWidth = 600;
  const canvasHeight = 450;
  const scale = Math.min((canvasWidth - 60) / roomW, (canvasHeight - 60) / roomL) * zoom;
  const offsetX = (canvasWidth - roomW * scale) / 2;
  const offsetY = (canvasHeight - roomL * scale) / 2;

  const tabLabels: Record<string, string> = {
    'dashboard': 'صفحة الأقسام الرئيسية',
    '2d-plan': 'المخطط الأفقي 2D',
    '3d-view': 'المنظور ثلاثي الأبعاد 3D',
    'elevations': 'المساقط الرأسية للواجهات',
    'technical': 'المخطط الهندسي التنفيذي',
    'schedule': 'جدول بنود وتوصيف الوحدات',
    'cutting-list': 'جدول تفصيل وتكسير الألواح',
  };

  const moduleLabels: Record<string, string> = {
    'kitchen': 'مطابخ (Kitchens)',
    'dressing': 'دريسينج روم (Dressing)',
    'bedroom': 'غرف نوم (Bedrooms)',
    'library': 'مكتبات ووحدات TV',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none font-sans animate-in fade-in">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Header with Stealth Indicator */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Eye size={22} className="animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  بث الشاشة الحي: {liveSession.companyName || liveSession.username}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                  🔴 بث حي مباشر (Live Sync)
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                @{liveSession.username} • المسئول: {liveSession.contactPerson || 'غير محدد'} • الباقة: {liveSession.plan}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stealth Mode Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <ShieldAlert size={14} className="text-purple-400" />
              <span>مراقبة سرية صامتة (بدون أي إشعار للمشترك)</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content: Split Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 overflow-y-auto">
          {/* Left / Center 2 Columns: Live Canvas Mirror */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-blue-400" />
                <span className="font-bold text-slate-200">
                  معاينة ساحة العمل المباشرة ({cabinets.length} وحدة مضافة)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded-md">
                  الغرفة: {roomW / 10} × {roomL / 10} سم
                </span>
                <button
                  onClick={() => setZoom((z) => (z === 1 ? 1.25 : 1))}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md text-[11px] font-bold text-slate-300"
                >
                  {zoom === 1 ? 'تكبير +' : 'تصغير -'}
                </button>
              </div>
            </div>

            {/* Simulated Live Visualizer Canvas */}
            <div className="relative w-full h-[380px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-2 shadow-inner">
              {/* CAD Grid lines */}
              <div className="absolute inset-0 bg-cad-grid opacity-30 pointer-events-none" />

              <svg width={canvasWidth} height={canvasHeight} className="relative z-10 transition-all duration-300">
                {/* Room Outline */}
                <rect
                  x={offsetX}
                  y={offsetY}
                  width={roomW * scale}
                  height={roomL * scale}
                  fill="#0f172a"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  rx="6"
                  opacity="0.85"
                />

                {/* Wall thickness outline */}
                <rect
                  x={offsetX - 8}
                  y={offsetY - 8}
                  width={roomW * scale + 16}
                  height={roomL * scale + 16}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  rx="8"
                />

                {/* Live Cabinets Rendered */}
                {cabinets.map((c, idx) => {
                  const x = offsetX + (c.x || 0) * scale;
                  const y = offsetY + (c.y || 0) * scale;
                  const w = (c.width || 600) * scale;
                  const h = (c.depth || 600) * scale;

                  const isSelected = liveSession.selectedCabinetName === c.name;

                  return (
                    <g key={c.id || idx} transform={`rotate(${c.rotation || 0} ${x + w / 2} ${y + h / 2})`}>
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        fill={
                          isSelected
                            ? '#2563eb'
                            : c.category === 'base'
                            ? '#1e3a8a'
                            : c.category === 'wall'
                            ? '#065f46'
                            : '#6b21a8'
                        }
                        stroke={isSelected ? '#60a5fa' : '#ffffff'}
                        strokeWidth={isSelected ? '2.5' : '1'}
                        rx="3"
                        opacity="0.9"
                      />
                      {/* Cabinet Label */}
                      <text
                        x={x + w / 2}
                        y={y + h / 2 + 3}
                        fontSize="9"
                        fill="#ffffff"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {c.width ? `${c.width / 10}cm` : c.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Status pill overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>القسم النشط: <strong>{moduleLabels[liveSession.activeModule] || liveSession.activeModule}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry Metrics & Activity Stream */}
          <div className="flex flex-col space-y-4">
            {/* Active Status Card */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Radio size={14} className="text-emerald-400" />
                <span>المؤشرات الحية للنشاط</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">الصفحة / التاب المفتوح:</span>
                  <span className="font-bold text-blue-400">{tabLabels[liveSession.activeTab] || liveSession.activeTab}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">المشروع الحالي:</span>
                  <span className="font-bold text-slate-200">{liveSession.projectName}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">العميل المستهدف:</span>
                  <span className="font-bold text-slate-300">{liveSession.clientName || 'غير مسجل'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">إجمالي قطع التصميم:</span>
                  <span className="font-bold text-emerald-400 font-mono">{cabinets.length} وحدة</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">آخر ظهور ونبضة:</span>
                  <span className="font-mono text-slate-300">
                    {Math.max(1, Math.floor((Date.now() - liveSession.lastPing) / 1000))} ثوانٍ مضت
                  </span>
                </div>
              </div>
            </div>

            {/* Live Last Action Box */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Activity size={14} className="text-amber-400" />
                <span>آخر حركة قام بها المشترك:</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span>{liveSession.lastAction || 'تصفح ساحة العمل وتعديل المقاسات'}</span>
              </div>
            </div>

            {/* Stealth Security Assurance */}
            <div className="p-3.5 bg-purple-950/30 border border-purple-800/30 rounded-2xl text-[11px] text-purple-300 leading-relaxed">
              <div className="font-bold mb-1 flex items-center gap-1 text-purple-200">
                <EyeOff size={13} />
                <span>ضمان الخصوصية والسرية:</span>
              </div>
              البث يتم برمجياً بدون أي اتصال مباشر يعرض تنبيهاً على شاشة المشترك. يمكنك متابعة طريقة عمل المشتركين وجودة استخدامهم للأداة بكل أمان.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
