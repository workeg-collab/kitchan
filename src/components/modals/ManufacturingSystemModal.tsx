import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { MaterialSystemType, ManufacturingSystemTemplate } from '../../types/manufacturingSystems';
import { PRESET_MANUFACTURING_TEMPLATES } from '../../constants/manufacturingTemplates';
import { ALUMINIUM_PROFILE_DATABASE } from '../../constants/aluminiumProfiles';
import { X, Plus, Settings, Layers, Scissors, Shield, Check, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ManufacturingSystemModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { project, updateManufacturing } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'templates' | 'profiles' | 'custom-builder'>('templates');

  // Custom System Builder Form State
  const [systemName, setSystemName] = useState('');
  const [systemType, setSystemType] = useState<MaterialSystemType>('aluminium');
  const [standardBarLength, setStandardBarLength] = useState(6000);
  const [boardThickness, setBoardThickness] = useState(18);
  const [sawKerf, setSawKerf] = useState(4.0);
  const [cornerDeduction, setCornerDeduction] = useState(25);
  const [wasteFactor, setWasteFactor] = useState(10);
  const [costLabor, setCostLabor] = useState(400);

  if (!isOpen) return null;

  const handleApplySystem = (tmpl: ManufacturingSystemTemplate) => {
    updateManufacturing({
      systemType: tmpl.systemType,
      boardThickness: tmpl.primaryBoardThickness,
      backPanelThickness: tmpl.backPanelThickness,
      constructionMethod: tmpl.carcassConstruction as any,
      backPanelMount: tmpl.backPanelMount as any,
    });
    onClose();
  };

  const handleSaveCustomSystem = () => {
    if (!systemName.trim()) return;

    updateManufacturing({
      systemType,
      boardThickness,
      constructionMethod: systemType === 'wood' ? 'sides-full-height' : 'aluminium-box-frame',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none font-sans">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                أنظمة تصنيع كيتشن وتفصيل الألواح والقطاعات
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                اختر نظام التصنيع المطلوب وسيتم تطبيقه مباشرة على كافة المقاسات وقوائم التقطيع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'templates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            الأنظمة المعتمدة (Presets)
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'profiles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            قاعدة بيانات القطاعات والأعواد ({ALUMINIUM_PROFILE_DATABASE.length})
          </button>
          <button
            onClick={() => setActiveTab('custom-builder')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'custom-builder' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plus size={14} />
            <span>بناء نظام تصنيع مخصص</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PRESET TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_MANUFACTURING_TEMPLATES.map((tmpl) => {
                const isActive = project.manufacturing.systemType === tmpl.systemType;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleApplySystem(tmpl)}
                    className={`p-4 rounded-2xl cursor-pointer transition space-y-2.5 ${
                      isActive
                        ? 'bg-blue-50/70 border-2 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{tmpl.name}</h4>
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md mt-1 inline-block">
                          {tmpl.systemType}
                        </span>
                      </div>
                      {isActive ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs">
                          <Check size={14} />
                          <span>مفعّل حالياً</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplySystem(tmpl);
                          }}
                          className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-xl transition"
                        >
                          اختيار وتطبيق
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{tmpl.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono bg-white/80 p-2 rounded-xl border border-slate-200/60">
                      <div>طول العود: <strong className="text-slate-800">{tmpl.standardBarLength} مم</strong></div>
                      <div>سماكة اللوح: <strong className="text-slate-800">{tmpl.primaryBoardThickness} مم</strong></div>
                      <div>تخصيم الزوايا: <strong className="text-slate-800">{tmpl.cornerJointDeduction} مم</strong></div>
                      <div>سلاح المنشار: <strong className="text-slate-800">{tmpl.sawKerf} مم</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: PROFILE SECTORS DATABASE */}
          {activeTab === 'profiles' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                    <tr>
                      <th className="px-4 py-3">كود القطاع</th>
                      <th className="px-4 py-3">اسم ووصف القطاع</th>
                      <th className="px-4 py-3">النظام</th>
                      <th className="px-4 py-3">الأبعاد (عرض × ارتفاع)</th>
                      <th className="px-4 py-3">السماكة</th>
                      <th className="px-4 py-3">طول العود</th>
                      <th className="px-4 py-3">السعر/متر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {ALUMINIUM_PROFILE_DATABASE.map((prof) => (
                      <tr key={prof.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-2.5 font-bold text-blue-600">{prof.code}</td>
                        <td className="px-4 py-2.5 font-sans font-semibold text-slate-800">{prof.name}</td>
                        <td className="px-4 py-2.5 uppercase font-bold text-slate-500">{prof.system}</td>
                        <td className="px-4 py-2.5">{prof.width} × {prof.height} مم</td>
                        <td className="px-4 py-2.5">{prof.thickness} مم</td>
                        <td className="px-4 py-2.5">{prof.standardBarLength} مم</td>
                        <td className="px-4 py-2.5 font-bold text-emerald-600">{prof.pricePerMeter} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM SYSTEM BUILDER */}
          {activeTab === 'custom-builder' && (
            <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">إنشاء نظام تصنيع مخصص جديد</h4>
                <p className="text-xs text-slate-500 mt-0.5">حدد اسم النظام ونوع الخامة وقواعد التخصيم وسلاح المنشار</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">اسم نظام التصنيع المخصص *</label>
                  <input
                    type="text"
                    placeholder="مثال: نظام ألوميتال قطاع تكنو 2026"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">نوع الخامة الأساسية</label>
                    <select
                      value={systemType}
                      onChange={(e) => setSystemType(e.target.value as any)}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold"
                    >
                      <option value="aluminium">ألوميتال وقطاعات</option>
                      <option value="wood">أخشاب وميلامين MDF</option>
                      <option value="cladding">كلادينج وشاسيه معدني</option>
                      <option value="khashmounium">خشمونيوم مضلع</option>
                      <option value="fibre">فايبر جلاس عازل</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">طول العود الخام القياسي (مم)</label>
                    <input
                      type="number"
                      value={standardBarLength}
                      onChange={(e) => setStandardBarLength(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">سماكة اللوح/الحشوة (مم)</label>
                    <input
                      type="number"
                      value={boardThickness}
                      onChange={(e) => setBoardThickness(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">سماكة المنشار / Kerf (مم)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={sawKerf}
                      onChange={(e) => setSawKerf(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">تخصيم كعب التجميع (مم)</label>
                    <input
                      type="number"
                      value={cornerDeduction}
                      onChange={(e) => setCornerDeduction(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveCustomSystem}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
                >
                  <Save size={14} />
                  <span>حفظ وتفعيل النظام</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
