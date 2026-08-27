import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { 
  Settings, 
  X, 
  Check, 
  Building2, 
  Scissors, 
  DollarSign, 
} from 'lucide-react';

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    project, 
    updateMetadata, 
    updateManufacturing, 
    updateProjectPricing, 
    updatePlinth, 
  } = useProjectStore();

  const { unit, setUnit, language, setLanguage } = useUIStore();

  const [activeTab, setActiveTab] = useState<'general' | 'manufacturing' | 'pricing'>('general');

  // General State
  const [projectName, setProjectName] = useState(project.metadata.name);
  const [clientName, setClientName] = useState(project.metadata.clientName || '');
  const [designerName, setDesignerName] = useState(project.metadata.designerName || '');
  const [notes, setNotes] = useState(project.metadata.notes || '');

  // Manufacturing State
  const [boardThickness, setBoardThickness] = useState(project.manufacturing.boardThickness || 18);
  const [backPanelRecess, setBackPanelRecess] = useState(project.manufacturing.backPanelRecess || 15);
  const [edgeBandingFront, setEdgeBandingFront] = useState(project.manufacturing.edgeBandingFront || 2);
  const [constructionMethod, setConstructionMethod] = useState(project.manufacturing.constructionMethod || 'sides-full-height');
  const [plinthHeight, setPlinthHeight] = useState(project.plinth.height || 100);

  // Pricing State
  const [currency, setCurrency] = useState(project.pricing.currency || 'ج.م');
  const [priceBase, setPriceBase] = useState(project.pricing.pricePerLinearMeterBase || 3500);
  const [priceWall, setPriceWall] = useState(project.pricing.pricePerLinearMeterWall || 2800);
  const [priceTall, setPriceTall] = useState(project.pricing.pricePerLinearMeterTall || 4500);
  const [taxPercentage, setTaxPercentage] = useState(project.pricing.taxPercentage || 14);

  if (!isOpen) return null;

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save Metadata
    updateMetadata({
      name: projectName.trim() || 'مشروع جديد',
      clientName: clientName.trim(),
      designerName: designerName.trim(),
      notes: notes.trim(),
    });

    // 2. Save Manufacturing Settings
    updateManufacturing({
      boardThickness,
      backPanelRecess,
      edgeBandingFront,
      constructionMethod,
    });

    // 3. Save Plinth
    updatePlinth({ height: plinthHeight });

    // 4. Save Pricing
    updateProjectPricing({
      currency,
      pricePerLinearMeterBase: priceBase,
      pricePerLinearMeterWall: priceWall,
      pricePerLinearMeterTall: priceTall,
      taxPercentage,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in select-none font-sans">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-md">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                إعدادات المشروع وقواعد التصنيع (Project & Manufacturing Settings)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تخصيص بيانات العميل، سماكات الألواح، قواعد التجميع، والأسعار
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 size={15} />
            <span>عام وبيانات المشروع</span>
          </button>

          <button
            onClick={() => setActiveTab('manufacturing')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'manufacturing' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Scissors size={15} />
            <span>قواعد التصنيع والألواح</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'pricing' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <DollarSign size={15} />
            <span>الأسعار والعملة</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAll} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم المشروع *</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم العميل</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: أ / أحمد السيد"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المصمم / المهندس</label>
                  <input
                    type="text"
                    value={designerName}
                    onChange={(e) => setDesignerName(e.target.value)}
                    placeholder="مثال: م / كريم الدسوقي"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">وحدة القياس الافتراضية</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="cm">سنتيمتر (cm)</option>
                    <option value="mm">مليمتر (mm)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">لغة الواجهة</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="ar">العربية (Arabic)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات العقد والتنفيذ</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات خاصة بالمفصلات، الرخام، أو التوصيل والتركيب..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MANUFACTURING */}
          {activeTab === 'manufacturing' && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 text-blue-900">
                <strong className="font-bold block">ملاحظة هندسية:</strong>
                <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                  هذه الإعدادات تحدد المقاسات الصافية لتقطيع الألواح وتوزيع أشرطة الحرف ABS وحساب الهدر تلقائياً.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">سماكة ألواح الشاسيه الداخلي (مم)</label>
                  <select
                    value={boardThickness}
                    onChange={(e) => setBoardThickness(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 font-mono"
                  >
                    <option value={18}>18 مم (قياسي دولي)</option>
                    <option value={16}>16 مم</option>
                    <option value={15}>15 مم</option>
                    <option value={25}>25 مم (شاسيه ثقيل)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">سماكة قشاط الحرف ABS (مم)</label>
                  <select
                    value={edgeBandingFront}
                    onChange={(e) => setEdgeBandingFront(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 font-mono"
                  >
                    <option value={2}>2.0 مم (شريط سميك ناعم)</option>
                    <option value={1}>1.0 مم</option>
                    <option value={0.4}>0.4 مم (شريط رفيع)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">عمق تفريز الظهر (Recess Depth)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={backPanelRecess}
                    onChange={(e) => setBackPanelRecess(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ارتفاع الوزرة السفلية (Plinth/Legs)</label>
                  <input
                    type="number"
                    min={50}
                    max={200}
                    value={plinthHeight}
                    onChange={(e) => setPlinthHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">طريقة التجميع الهيكلي (Construction Method)</label>
                <select
                  value={constructionMethod}
                  onChange={(e) => setConstructionMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="sides-full-height">الجوانب بكامل الارتفاع (Sides Full Height)</option>
                  <option value="top-bottom-full-width">القاعدة والقمة بكامل العرض (Top/Bottom Full Width)</option>
                  <option value="aluminium-box-frame">شاسيه ألومنيوم مقفول (Aluminium Box Frame)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">عملة التسعير</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="ج.م">جنيه مصري (EGP)</option>
                  <option value="ر.س">ريال سعودي (SAR)</option>
                  <option value="د.إ">درهم إماراتي (AED)</option>
                  <option value="د.ك">دينار كويتي (KWD)</option>
                  <option value="$">دولار أمريكي (USD)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">سعر المتر السفلي</label>
                  <input
                    type="number"
                    min={0}
                    value={priceBase}
                    onChange={(e) => setPriceBase(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">سعر المتر العلوي</label>
                  <input
                    type="number"
                    min={0}
                    value={priceWall}
                    onChange={(e) => setPriceWall(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">سعر المتر الطولي</label>
                  <input
                    type="number"
                    min={0}
                    value={priceTall}
                    onChange={(e) => setPriceTall(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نسبة ضريبة القيمة المضافة % (VAT / Taxes)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/25 transition transform active:scale-95 flex items-center gap-2"
            >
              <Check size={16} />
              <span>حفظ وتطبيق الإعدادات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
