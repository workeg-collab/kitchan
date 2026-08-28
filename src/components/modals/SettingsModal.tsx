import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { useMaterialsStore } from '../../store/useMaterialsStore';
import { CustomMaterialItem, MaterialCategoryType } from '../../types/materials';
import { 
  Settings, 
  X, 
  Check, 
  Building2, 
  Scissors, 
  DollarSign, 
  Palette, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3, 
  RotateCcw, 
  Search, 
  Sparkles,
  Layers,
  Ruler
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
  const { 
    materials, 
    addMaterial, 
    updateMaterial, 
    deleteMaterial, 
    duplicateMaterial, 
    resetToDefaults 
  } = useMaterialsStore();

  const [activeTab, setActiveTab] = useState<'general' | 'manufacturing' | 'materials' | 'pricing'>('general');

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

  // Materials Tab State
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState<string>('all');
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CustomMaterialItem | null>(null);

  // New Material Form State
  const [newMatName, setNewMatName] = useState('');
  const [newMatNameEn, setNewMatNameEn] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<MaterialCategoryType>('wood-sheet');
  const [newMatLength, setNewMatLength] = useState(2800);
  const [newMatWidth, setNewMatWidth] = useState(2070);
  const [newMatThickness, setNewMatThickness] = useState(18);
  const [newMatPrice, setNewMatPrice] = useState(1800);
  const [newMatUnit, setNewMatUnit] = useState<'لوح' | 'متر مربع م²' | 'متر طولي م.ط' | 'قطعة'>('لوح');
  const [newMatColor, setNewMatColor] = useState('#d6cec4');
  const [newMatWaste, setNewMatWaste] = useState(12);
  const [newMatSupplier, setNewMatSupplier] = useState('');
  const [newMatNotes, setNewMatNotes] = useState('');

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

  const handleCreateNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    if (editingMaterial) {
      updateMaterial(editingMaterial.id, {
        name: newMatName.trim(),
        nameEn: newMatNameEn.trim(),
        category: newMatCategory,
        sheetLength: newMatLength,
        sheetWidth: newMatWidth,
        thickness: newMatThickness,
        price: newMatPrice,
        pricingUnit: newMatUnit,
        colorCode: newMatColor,
        wastePercentage: newMatWaste,
        supplier: newMatSupplier.trim(),
        notes: newMatNotes.trim(),
      });
      setEditingMaterial(null);
    } else {
      addMaterial({
        name: newMatName.trim(),
        nameEn: newMatNameEn.trim(),
        category: newMatCategory,
        sheetLength: newMatLength,
        sheetWidth: newMatWidth,
        thickness: newMatThickness,
        price: newMatPrice,
        pricingUnit: newMatUnit,
        colorCode: newMatColor,
        wastePercentage: newMatWaste,
        supplier: newMatSupplier.trim(),
        notes: newMatNotes.trim(),
      });
    }

    // Reset Form
    setNewMatName('');
    setNewMatNameEn('');
    setIsAddMaterialOpen(false);
  };

  const startEditMaterial = (mat: CustomMaterialItem) => {
    setEditingMaterial(mat);
    setNewMatName(mat.name);
    setNewMatNameEn(mat.nameEn || '');
    setNewMatCategory(mat.category);
    setNewMatLength(mat.sheetLength);
    setNewMatWidth(mat.sheetWidth);
    setNewMatThickness(mat.thickness);
    setNewMatPrice(mat.price);
    setNewMatUnit(mat.pricingUnit);
    setNewMatColor(mat.colorCode);
    setNewMatWaste(mat.wastePercentage);
    setNewMatSupplier(mat.supplier || '');
    setNewMatNotes(mat.notes || '');
    setIsAddMaterialOpen(true);
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
      (m.nameEn && m.nameEn.toLowerCase().includes(materialSearch.toLowerCase())) ||
      (m.supplier && m.supplier.toLowerCase().includes(materialSearch.toLowerCase()));
    
    if (materialCategoryFilter === 'all') return matchesSearch;
    return matchesSearch && m.category === materialCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in select-none font-sans">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-md">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                إعدادات المشروع، الخامات، وقواعد التصنيع (Settings & Materials)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تخصيص الخامات الجديدة، تعديل أسعار ومقاسات الألواح، وقواعد التقطيع والتسعير
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 size={15} />
            <span>عام وبيانات المشروع</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'materials' ? 'border-purple-600 text-purple-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Palette size={15} />
            <span>الخامات ومقاسات الألواح والتسعير ({materials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manufacturing')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manufacturing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Scissors size={15} />
            <span>قواعد التصنيع والتفريز</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pricing' ? 'border-emerald-600 text-emerald-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <DollarSign size={15} />
            <span>الأسعار والضرائب</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* ========================================================================= */}
          {/* TAB 1: GENERAL & METADATA                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المشروع / الغرفة</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم العميل (Client Name)</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: م. أحمد عبد الله"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المصمم / مهندس الديكور</label>
                  <input
                    type="text"
                    value={designerName}
                    onChange={(e) => setDesignerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

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

          {/* ========================================================================= */}
          {/* TAB 2: CUSTOM MATERIALS, SHEET SIZES & PRICING (طلب المستخدم الأساسي)      */}
          {/* ========================================================================= */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {/* Header Action Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-200">
                <div>
                  <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-600" />
                    كتالوج الخامات وتعديل الأسعار ومقاسات الألواح الخام
                  </h3>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    يمكنك إضافة أي خامة خشبية أو رخام أو كلادينج أو ألوميتال وتحديد طول وعرض وسمك اللوح وسعره ليُحسب مباشرة في التقطيع
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetToDefaults}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200 transition text-[11px]"
                    title="استعادة الخامات القياسية"
                  >
                    <RotateCcw size={13} />
                    <span>استعادة الافتراضي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingMaterial(null);
                      setNewMatName('');
                      setNewMatNameEn('');
                      setIsAddMaterialOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-md shadow-purple-600/20 transition text-xs"
                  >
                    <Plus size={15} />
                    <span>+ إضافة خامة جديدة</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Material Modal Form */}
              {isAddMaterialOpen && (
                <form onSubmit={handleCreateNewMaterial} className="bg-white p-5 rounded-2xl border-2 border-purple-300 shadow-lg space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Layers size={16} className="text-purple-600" />
                      {editingMaterial ? 'تعديل بيانات الخامة ومقاس اللوح' : 'إضافة خامة جديدة للكتالوج'}
                    </h4>
                    <button type="button" onClick={() => setIsAddMaterialOpen(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">اسم الخامة (بالعربي)</label>
                      <input
                        type="text"
                        required
                        value={newMatName}
                        onChange={(e) => setNewMatName(e.target.value)}
                        placeholder="مثال: إيجر ألماني بلوط هادئ H3303 (18 مم)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">التصنيف</label>
                      <select
                        value={newMatCategory}
                        onChange={(e) => setNewMatCategory(e.target.value as MaterialCategoryType)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                      >
                        <option value="wood-sheet">ألواح خشب وميلامين وMDF</option>
                        <option value="countertop">رخام وكوارتز وأسطح عمل</option>
                        <option value="cladding-sheet">شيتات كلادينج وفايبر</option>
                        <option value="aluminium-profile">قطاعات ألوميتال وخشمونيوم</option>
                        <option value="glass">زجاج وفيترينات</option>
                        <option value="fabric">أقمشة تنجيد وبوكليه</option>
                      </select>
                    </div>
                  </div>

                  {/* Sheet Dimensions & Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <Ruler size={13} className="text-purple-600" />
                        طول اللوح (مم)
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={10000}
                        value={newMatLength}
                        onChange={(e) => setNewMatLength(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">مثال: 2800 أو 2440</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <Ruler size={13} className="text-purple-600" />
                        عرض اللوح (مم)
                      </label>
                      <input
                        type="number"
                        min={50}
                        max={5000}
                        value={newMatWidth}
                        onChange={(e) => setNewMatWidth(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">مثال: 2070 أو 1220</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">السماكة (مم)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={newMatThickness}
                        onChange={(e) => setNewMatThickness(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">مثال: 18 أو 25 أو 4</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">نسبة الهالك %</label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={newMatWaste}
                        onChange={(e) => setNewMatWaste(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">المتوسط: 12% - 15%</span>
                    </div>
                  </div>

                  {/* Pricing and Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">السعر ({currency})</label>
                      <input
                        type="number"
                        min={0}
                        value={newMatPrice}
                        onChange={(e) => setNewMatPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">وحدة التسعير</label>
                      <select
                        value={newMatUnit}
                        onChange={(e) => setNewMatUnit(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                      >
                        <option value="لوح">لكل لوح خام كامل</option>
                        <option value="متر مربع م²">لكل متر مربع (م²)</option>
                        <option value="متر طولي م.ط">لكل متر طولي (م.ط)</option>
                        <option value="قطعة">لكل قطعة</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">اللون / المعاينة</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newMatColor}
                          onChange={(e) => setNewMatColor(e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={newMatColor}
                          onChange={(e) => setNewMatColor(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddMaterialOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-md shadow-purple-600/20 transition"
                    >
                      {editingMaterial ? 'حفظ التعديلات' : 'إضافة الخامة'}
                    </button>
                  </div>
                </form>
              )}

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'wood-sheet', label: 'ألواح الخشب وMDF' },
                    { id: 'countertop', label: 'الرخام والكوارتز' },
                    { id: 'cladding-sheet', label: 'الكلادينج' },
                    { id: 'aluminium-profile', label: 'الألوميتال' },
                    { id: 'glass', label: 'الزجاج' },
                    { id: 'fabric', label: 'الأقمشة' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setMaterialCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-[11px] ${
                        materialCategoryFilter === cat.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="بحث في الخامات أو الموردين..."
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Materials List & Quick Inline Editor */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="grid grid-cols-12 gap-2 bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-500 text-[11px]">
                  <span className="col-span-4">اسم الخامة والمعاينة</span>
                  <span className="col-span-2 text-center">أبعاد اللوح (طول×عرض)</span>
                  <span className="col-span-1 text-center">السماكة</span>
                  <span className="col-span-3 text-center">السعر ({currency}) / الوحدة</span>
                  <span className="col-span-2 text-left">إجراءات</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                  {filteredMaterials.map((mat) => (
                    <div key={mat.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-slate-50/80 transition text-xs">
                      {/* Name & Color */}
                      <div className="col-span-4 flex items-center gap-2.5">
                        <span
                          className="w-6 h-6 rounded-lg border border-slate-300 shrink-0 shadow-xs"
                          style={{ backgroundColor: mat.colorCode }}
                        />
                        <div className="min-w-0">
                          <strong className="text-slate-900 block truncate font-bold">{mat.name}</strong>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">
                            {mat.supplier || mat.category}
                          </span>
                        </div>
                      </div>

                      {/* Dimensions (Length x Width) */}
                      <div className="col-span-2 flex items-center justify-center gap-1 font-mono">
                        <input
                          type="number"
                          value={mat.sheetLength}
                          onChange={(e) => updateMaterial(mat.id, { sheetLength: Number(e.target.value) })}
                          className="w-14 px-1.5 py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-purple-500 rounded text-center text-slate-900 font-bold text-[11px]"
                          title="طول اللوح بالمللي"
                        />
                        <span className="text-slate-400">×</span>
                        <input
                          type="number"
                          value={mat.sheetWidth}
                          onChange={(e) => updateMaterial(mat.id, { sheetWidth: Number(e.target.value) })}
                          className="w-14 px-1.5 py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-purple-500 rounded text-center text-slate-900 font-bold text-[11px]"
                          title="عرض اللوح بالمللي"
                        />
                      </div>

                      {/* Thickness */}
                      <div className="col-span-1 text-center font-mono font-bold">
                        <input
                          type="number"
                          value={mat.thickness}
                          onChange={(e) => updateMaterial(mat.id, { thickness: Number(e.target.value) })}
                          className="w-12 px-1 py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-purple-500 rounded text-center text-slate-900 font-bold text-[11px]"
                          title="سماكة اللوح مم"
                        />
                      </div>

                      {/* Price & Unit */}
                      <div className="col-span-3 flex items-center justify-center gap-1.5">
                        <input
                          type="number"
                          value={mat.price}
                          onChange={(e) => updateMaterial(mat.id, { price: Number(e.target.value) })}
                          className="w-20 px-2 py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-purple-500 rounded-lg text-center font-mono font-black text-purple-700 text-xs"
                          title="تعديل السعر المباشر"
                        />
                        <span className="text-[10px] text-slate-500 font-semibold">{mat.pricingUnit}</span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEditMaterial(mat)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="تعديل تفاصيل كاملة"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateMaterial(mat.id)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="نسخ الخامة"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMaterial(mat.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف الخامة"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MANUFACTURING & ASSEMBLY RULES                                     */}
          {/* ========================================================================= */}
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
                  <label className="font-bold text-slate-700 block mb-1">سماكة ألواح الشاسيه الافتراضية (مم)</label>
                  <select
                    value={boardThickness}
                    onChange={(e) => setBoardThickness(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 font-mono"
                  >
                    <option value={18}>18 مم (قياسي دولي للأخشاب والميلامين)</option>
                    <option value={16}>16 مم</option>
                    <option value={15}>15 مم</option>
                    <option value={25}>25 مم (شاسيهات ثقيلة وأسرّة)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">سماكة قشاط الحرف ABS (مم)</label>
                  <select
                    value={edgeBandingFront}
                    onChange={(e) => setEdgeBandingFront(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 font-mono"
                  >
                    <option value={2}>2.0 مم (شريط سميك ناعم مانع للصدمات)</option>
                    <option value={1}>1.0 مم (شريط قياسي)</option>
                    <option value={0.4}>0.4 مم (شريط رفيع مخفي)</option>
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
                  <label className="font-bold text-slate-700 block mb-1">طريقة تجميع وتثبيت الشاسيه</label>
                  <select
                    value={constructionMethod}
                    onChange={(e) => setConstructionMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="sides-full-height">الجوانب بارتفاع كامل (Sides Outside)</option>
                    <option value="top-bottom-full-width">القاع والسقف بعرض كامل (Top/Bottom Outside)</option>
                    <option value="aluminium-box-frame">شاسيه ألوميتال علبة (Aluminium Frame)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PRICING & TAXATION                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">العملة المعتمدة</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="ج.م">جنيه مصري (ج.م)</option>
                    <option value="ر.س">ريال سعودي (ر.س)</option>
                    <option value="د.إ">درهم إماراتي (د.إ)</option>
                    <option value="د.ك">دينار كويتي (د.ك)</option>
                    <option value="$">دولار أمريكي ($)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">نسبة ضريبة القيمة المضافة (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">سعر المتر الطولي (سفلي / سرير)</label>
                  <input
                    type="number"
                    value={priceBase}
                    onChange={(e) => setPriceBase(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">سعر المتر الطولي (علوي / بانوهات)</label>
                  <input
                    type="number"
                    value={priceWall}
                    onChange={(e) => setPriceWall(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">سعر المتر الطولي (دواليب طولية)</label>
                  <input
                    type="number"
                    value={priceTall}
                    onChange={(e) => setPriceTall(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Save & Close */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition text-xs"
          >
            إغلاق
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition text-xs"
          >
            <Check size={16} />
            <span>حفظ وتطبيق جميع الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
