import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { ProjectData } from '../../types';
import { adaptProjectToSpace, SpaceAdaptationResult } from '../../utils/spaceAdaptation';
import { formatDimension } from '../../utils/unitConversion';
import { 
  Maximize2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Layers, 
  Ruler,
  Sliders,
  Check
} from 'lucide-react';

interface SpaceAdaptationModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateProject: ProjectData | null;
  onApplyAdapted: (adapted: ProjectData) => void;
}

export const SpaceAdaptationModal: React.FC<SpaceAdaptationModalProps> = ({
  isOpen,
  onClose,
  templateProject,
  onApplyAdapted,
}) => {
  const { unit } = useUIStore();

  const [targetWidth, setTargetWidth] = useState(4000);
  const [targetLength, setTargetLength] = useState(3000);
  const [targetHeight, setTargetHeight] = useState(2700);
  const [preserveIsland, setPreserveIsland] = useState(true);
  const [customerName, setCustomerName] = useState('');

  const [adaptationResult, setAdaptationResult] = useState<SpaceAdaptationResult | null>(null);

  useEffect(() => {
    if (templateProject) {
      setTargetWidth(templateProject.room.width);
      setTargetLength(templateProject.room.length);
      setTargetHeight(templateProject.room.ceilingHeight || 2700);
      setCustomerName(`${templateProject.metadata.name} (مشروع العميل)`);
    }
  }, [templateProject]);

  useEffect(() => {
    if (templateProject) {
      const result = adaptProjectToSpace(
        templateProject,
        targetWidth,
        targetLength,
        targetHeight,
        preserveIsland
      );
      setAdaptationResult(result);
    }
  }, [templateProject, targetWidth, targetLength, targetHeight, preserveIsland]);

  if (!isOpen || !templateProject || !adaptationResult) return null;

  const { conflicts, summary } = adaptationResult;
  const errorConflicts = conflicts.filter((c) => c.severity === 'error');
  const warningConflicts = conflicts.filter((c) => c.severity === 'warning');

  const handleConfirm = () => {
    const finalProject = JSON.parse(JSON.stringify(adaptationResult.adaptedProject));
    finalProject.metadata.id = `proj-${Date.now()}`;
    finalProject.metadata.name = customerName.trim() || templateProject.metadata.name;
    finalProject.metadata.date = new Date().toISOString().split('T')[0];
    onApplyAdapted(finalProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none font-sans">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
              <Maximize2 size={22} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                مواءمة التصميم الجاهز مع أبعاد غرفة العميل
              </h2>
              <p className="text-xs text-slate-500">
                تكييف وتوزيع الدواليب والأجهزة أوتوماتيكياً حسب المساحة الفعلية المتاحة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Project Title / Copy Name */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم مشروع العميل الجديد</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              placeholder="مثال: مطبخ فيلا المهندس أحمد"
            />
          </div>

          {/* Dimension Comparison Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Ruler size={15} className="text-blue-600" />
                <span>أبعاد الغرفة الأصلية vs أبعاد العميل الفعلية</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">الوحدة الحالية: {unit}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Width */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600">العرض الرئيسي (Width)</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="100"
                    min="1500"
                    max="12000"
                    value={unit === 'cm' ? targetWidth / 10 : targetWidth}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTargetWidth(unit === 'cm' ? val * 10 : val);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs font-mono text-slate-500">{unit}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  الأصلي: {formatDimension(summary.originalWidth, unit)}
                </div>
              </div>

              {/* Length */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600">العمق / الطول (Length)</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="100"
                    min="1500"
                    max="12000"
                    value={unit === 'cm' ? targetLength / 10 : targetLength}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTargetLength(unit === 'cm' ? val * 10 : val);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs font-mono text-slate-500">{unit}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  الأصلي: {formatDimension(summary.originalLength, unit)}
                </div>
              </div>

              {/* Ceiling Height */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600">ارتفاع السقف (Height)</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="50"
                    min="2000"
                    max="4500"
                    value={unit === 'cm' ? targetHeight / 10 : targetHeight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTargetHeight(unit === 'cm' ? val * 10 : val);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs font-mono text-slate-500">{unit}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  الأصلي: {formatDimension(summary.originalHeight, unit)}
                </div>
              </div>
            </div>
          </div>

          {/* Adaptation Summary Bar */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <span>تم ضبط ومواءمة <strong>{summary.adjustedCabinetsCount}</strong> وحدة لتلائم المقاسات الجديدة</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>ΔW: {summary.deltaWidth > 0 ? `+${summary.deltaWidth / 10}` : summary.deltaWidth / 10} سم</span>
              <span>ΔL: {summary.deltaLength > 0 ? `+${summary.deltaLength / 10}` : summary.deltaLength / 10} سم</span>
            </div>
          </div>

          {/* Conflict & Clearance Diagnostics */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-500" />
              <span>فحص التعارضات وممرات الحركة (Clearance & Collision Check)</span>
            </h4>

            {conflicts.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>جميع الوحدات متطابقة تماماً مع مقاسات الغرفة وتوفر مساحات حركة قياسية ممتازة!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {conflicts.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                      c.severity === 'error'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <AlertTriangle size={16} className={c.severity === 'error' ? 'text-red-600 shrink-0 mt-0.5' : 'text-amber-600 shrink-0 mt-0.5'} />
                    <div className="space-y-0.5">
                      <div className="font-bold">{c.message}</div>
                      {c.suggestedFix && (
                        <div className="text-[11px] opacity-80">💡 مقترح الحل: {c.suggestedFix}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
          >
            إلغاء
          </button>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/20 transition transform active:scale-95"
          >
            <Check size={16} />
            <span>تطبيق والمتابعة لساحة العمل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
