import React, { useRef, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { calculateKitchenMeterageAndPrice } from '../../utils/pricing';
import { 
  Calculator, 
  Coins, 
  Ruler, 
  Layers, 
  FileText, 
  Printer, 
  Sparkles, 
  Percent, 
  Tag,
  CheckCircle2,
  Sliders,
  Table,
  Info,
  Square,
  ArrowRight
} from 'lucide-react';

export const PricingCalculatorView: React.FC = () => {
  const { project, updateProjectPricing } = useProjectStore();
  const printRef = useRef<HTMLDivElement>(null);

  const { cabinets, room, countertop, manufacturing, pricing, metadata } = project;

  const currentMethod = pricing.pricingMethod || 'square-fronts';
  const isSquareMode = currentMethod === 'square-fronts';

  const meterage = calculateKitchenMeterageAndPrice(
    cabinets,
    room,
    countertop,
    manufacturing,
    pricing
  );

  const handlePrintQuotation = () => {
    window.print();
  };

  const projectType = project.metadata.projectType || 'kitchen';

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-auto p-4 sm:p-6 font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER                                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between max-w-6xl w-full mx-auto mb-6 bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-xs gap-4">
        <div>
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
            <Calculator className="text-blue-600" size={24} />
            <span>حاسبة التكاليف وحصر المسطحات والمتر الطولي</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            حساب دقيق لوش الوحدات (العرض × الارتفاع) بالمتر المربع أو بالمتر الطولي مع تقرير أسعار تفصيلي
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Currency Selector */}
          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 gap-2">
            <span className="text-xs font-bold text-slate-600">العملة:</span>
            <select
              value={pricing.currency}
              onChange={(e) => updateProjectPricing({ currency: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="ج.م">جنيه مصري (ج.م)</option>
              <option value="ر.س">ريال سعودي (ر.س)</option>
              <option value="د.إ">درهم إماراتي (د.إ)</option>
              <option value="د.ك">دينار كويتي (د.ك)</option>
              <option value="$">دولار أمريكي ($)</option>
            </select>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrintQuotation}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
          >
            <Printer size={15} />
            <span>طباعة عرض السعر</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* ========================================================================= */}
        {/* 2. PRICING METHOD SELECTOR SWITCH (المتر المربع vs المتر الطولي)           */}
        {/* ========================================================================= */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins size={18} className="text-purple-600" />
              <h2 className="text-sm font-black text-slate-900">طريقة المحاسبة والتسعير الرئيسية</h2>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              الطريقة المطبقة حالياً: {isSquareMode ? 'المتر المربع لوش الوحدات' : 'المتر الطولي'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPTION A: SQUARE METER (FRONT FACE AREA: W x H) */}
            <div
              onClick={() => updateProjectPricing({ pricingMethod: 'square-fronts' })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                isSquareMode
                  ? 'border-purple-600 bg-purple-50/40 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${isSquareMode ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      م²
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">المحاسبة بالمتر المربع (لوش الوحدات)</h3>
                      <p className="text-[10px] text-purple-700 font-bold">العرض × الارتفاع فقط (بدون العمق)</p>
                    </div>
                  </div>
                  {isSquareMode && <CheckCircle2 className="text-purple-600" size={18} />}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mt-2 bg-white/80 p-2.5 rounded-xl border border-purple-100">
                  يتم حساب مساحة واجهة كل وحدة بضرب <strong>(عرض الوحدة × ارتفاعها)</strong> وجمع مسطح واجهات كل الوحدات معاً ليعطي <strong>إجمالي المتر المربع ({meterage.totalFrontsAreaM2} م²)</strong>، مع تجاهل العمق تماماً في الحساب.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">إجمالي مسطح وش الوحدات:</span>
                <span className="text-base font-black text-purple-700 font-mono">{meterage.totalFrontsAreaM2} م²</span>
              </div>
            </div>

            {/* OPTION B: LINEAR METER (LINEAR LENGTH: W) */}
            <div
              onClick={() => updateProjectPricing({ pricingMethod: 'linear' })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                !isSquareMode
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${!isSquareMode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      م.ط
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">المحاسبة بالمتر الطولي</h3>
                      <p className="text-[10px] text-blue-700 font-bold">مجموع أطوال الوحدات السفلية والعلوية</p>
                    </div>
                  </div>
                  {!isSquareMode && <CheckCircle2 className="text-blue-600" size={18} />}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mt-2 bg-white/80 p-2.5 rounded-xl border border-blue-100">
                  يتم حساب مجموع أطوال الكبائن السفلية والعلوية والدواليب الطولية بالمتر الطولي المستعرض، مع إمكانية تسعير كل مستوى (سفلي / علوي / طولي) بسعر مستقل.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">إجمالي الأمتار الطولية:</span>
                <span className="text-base font-black text-blue-700 font-mono">{meterage.totalLinearM} م.ط</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. METERAGE STATS CARDS                                                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* إجمالي المتر المربع لوش الوحدات */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="text-[11px] text-slate-500 font-bold">مسطح وش الوحدات (W × H)</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{meterage.totalFrontsAreaM2} م²</div>
            <div className="text-[10px] text-slate-400 mt-1">سفلي: {meterage.baseFrontsAreaM2}م² • علوي: {meterage.wallFrontsAreaM2}م²</div>
          </div>

          {/* إجمالي المتر الطولي */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="text-[11px] text-slate-500 font-bold">إجمالي الأمتار الطولية</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{meterage.totalLinearM} م.ط</div>
            <div className="text-[10px] text-slate-400 mt-1">سفلي: {meterage.baseLinearM}م.ط • علوي: {meterage.wallLinearM}م.ط</div>
          </div>

          {/* مسطح الرخام */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="text-[11px] text-slate-500 font-bold">مسطح الرخام / الكوارتز</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{meterage.countertopAreaM2} م²</div>
            <div className="text-[10px] text-slate-400 mt-1">طول المسطح: {meterage.countertopLinearM} م.ط</div>
          </div>

          {/* عدد الوحدات بالمشروع */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="text-[11px] text-slate-500 font-bold">عدد الوحدات والقطع</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{cabinets.length} وحدة</div>
            <div className="text-[10px] text-slate-400 mt-1">مساحة ألواح الخشب: {meterage.totalWoodPanelsAreaM2} م²</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. PRICING PARAMETERS & LIVE QUOTATION FORM                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* INPUTS COLUMN (2 COLS) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders size={18} className="text-blue-600" />
                <span>إعدادات أسعار المتر وتكاليف التشطيب</span>
              </h3>

              {isSquareMode && (
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pricing.useDetailedSquareMeterPricing || false}
                    onChange={(e) => updateProjectPricing({ useDetailedSquareMeterPricing: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>تخصيص سعر متر مربع لكل مستوى (سفلي / علوي / طولي)</span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* IF SQUARE MODE */}
              {isSquareMode && !pricing.useDetailedSquareMeterPricing && (
                <div className="sm:col-span-2 bg-purple-50/60 p-4 rounded-2xl border border-purple-200">
                  <label className="font-bold text-purple-900 block mb-1">
                    سعر المتر المربع الموحد لوش الوحدات ({pricing.currency} / م²)
                  </label>
                  <input
                    type="number"
                    value={pricing.pricePerSquareMeterFronts}
                    onChange={(e) => updateProjectPricing({ pricePerSquareMeterFronts: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 bg-white border border-purple-300 rounded-xl font-mono font-bold text-purple-900 text-sm focus:outline-none focus:border-purple-600 shadow-xs"
                  />
                  <span className="text-[11px] text-purple-700 font-bold mt-1.5 block">
                    الحسبة: {meterage.totalFrontsAreaM2} م² (إجمالي وش الوحدات) × {pricing.pricePerSquareMeterFronts} {pricing.currency} = {meterage.unitsCost.toLocaleString()} {pricing.currency}
                  </span>
                </div>
              )}

              {isSquareMode && pricing.useDetailedSquareMeterPricing && (
                <>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <label className="font-semibold text-slate-700 block mb-1">
                      سعر م² وش الوحدات السفلية ({pricing.currency} / م²)
                    </label>
                    <input
                      type="number"
                      value={pricing.pricePerSquareMeterBaseFronts ?? pricing.pricePerSquareMeterFronts}
                      onChange={(e) => updateProjectPricing({ pricePerSquareMeterBaseFronts: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      الناتج: {meterage.baseFrontsAreaM2} م² × {pricing.pricePerSquareMeterBaseFronts ?? pricing.pricePerSquareMeterFronts} = {meterage.baseCost.toLocaleString()} {pricing.currency}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <label className="font-semibold text-slate-700 block mb-1">
                      سعر م² وش الوحدات العلوية ({pricing.currency} / م²)
                    </label>
                    <input
                      type="number"
                      value={pricing.pricePerSquareMeterWallFronts ?? pricing.pricePerSquareMeterFronts}
                      onChange={(e) => updateProjectPricing({ pricePerSquareMeterWallFronts: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      الناتج: {meterage.wallFrontsAreaM2} م² × {pricing.pricePerSquareMeterWallFronts ?? pricing.pricePerSquareMeterFronts} = {meterage.wallCost.toLocaleString()} {pricing.currency}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      سعر م² وش الدواليب الطولية والخزائن ({pricing.currency} / م²)
                    </label>
                    <input
                      type="number"
                      value={pricing.pricePerSquareMeterTallFronts ?? pricing.pricePerSquareMeterFronts}
                      onChange={(e) => updateProjectPricing({ pricePerSquareMeterTallFronts: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      الناتج: {meterage.tallFrontsAreaM2} م² × {pricing.pricePerSquareMeterTallFronts ?? pricing.pricePerSquareMeterFronts} = {meterage.tallCost.toLocaleString()} {pricing.currency}
                    </span>
                  </div>
                </>
              )}

              {/* IF LINEAR MODE */}
              {!isSquareMode && (
                <>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <label className="font-semibold text-slate-700 block mb-1">
                      سعر المتر الطولي للوحدات السفلية ({pricing.currency} / م.ط)
                    </label>
                    <input
                      type="number"
                      value={pricing.pricePerLinearMeterBase}
                      onChange={(e) => updateProjectPricing({ pricePerLinearMeterBase: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      الناتج: {meterage.baseLinearM} م.ط × {pricing.pricePerLinearMeterBase} = {meterage.baseCost.toLocaleString()} {pricing.currency}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <label className="font-semibold text-slate-700 block mb-1">
                      سعر المتر الطولي للوحدات العلوية ({pricing.currency} / م.ط)
                    </label>
                    <input
                      type="number"
                      value={pricing.pricePerLinearMeterWall}
                      onChange={(e) => updateProjectPricing({ pricePerLinearMeterWall: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      الناتج: {meterage.wallLinearM} م.ط × {pricing.pricePerLinearMeterWall} = {meterage.wallCost.toLocaleString()} {pricing.currency}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      سعر المتر الطولي للدواليب الطولية ({pricing.currency} / م.ط)
                    </label>
                    <input
                      type="number"
                      value={pricing.pricePerLinearMeterTall}
                      onChange={(e) => updateProjectPricing({ pricePerLinearMeterTall: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      الناتج: {meterage.tallLinearM} م.ط × {pricing.pricePerLinearMeterTall} = {meterage.tallCost.toLocaleString()} {pricing.currency}
                    </span>
                  </div>
                </>
              )}

              {/* سعر المتر المربع للرخام / الكوارتز */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">
                  سعر المتر المربع للرخام / الكوارتز ({pricing.currency} / م²)
                </label>
                <input
                  type="number"
                  value={pricing.pricePerSquareMeterCountertop}
                  onChange={(e) => updateProjectPricing({ pricePerSquareMeterCountertop: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  الناتج: {meterage.countertopAreaM2} م² × {pricing.pricePerSquareMeterCountertop} = {meterage.countertopCost.toLocaleString()} {pricing.currency}
                </span>
              </div>

              {/* تكلفة الإكسسوارات والمفصلات */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">
                  تكلفة الإكسسوارات والمفصلات الهيدروليك ({pricing.currency})
                </label>
                <input
                  type="number"
                  value={pricing.accessoriesCost}
                  onChange={(e) => updateProjectPricing({ accessoriesCost: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* نسبة المصنعية والتركيب */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">
                  نسبة النقل والمصنعية والتركيب (%)
                </label>
                <input
                  type="number"
                  value={pricing.installationCostPercentage}
                  onChange={(e) => updateProjectPricing({ installationCostPercentage: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* قيمة الخصم */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">
                  خصم خاص للعميل ({pricing.currency})
                </label>
                <input
                  type="number"
                  value={pricing.discountAmount}
                  onChange={(e) => updateProjectPricing({ discountAmount: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* FINAL QUOTATION RECEIPT CARD (1 COL) */}
          <div
            ref={printRef}
            className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                    عرض سعر رسمي
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1.5">{metadata.name}</h4>
                  <p className="text-[11px] text-slate-500">العميل: {metadata.clientName || 'عميل نقدي'}</p>
                </div>
                <div className="text-left text-[11px] text-slate-400 font-mono">
                  {new Date().toLocaleDateString('ar-EG')}
                </div>
              </div>

              {/* Price Breakdown List */}
              <div className="space-y-3 my-5 text-xs">
                <div className="flex justify-between items-center text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800">الوحدات والخزائن:</span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {isSquareMode ? `مسطح وش: ${meterage.totalFrontsAreaM2} م²` : `أطوال: ${meterage.totalLinearM} م.ط`}
                    </span>
                  </div>
                  <strong className="text-slate-900 font-mono text-sm">{meterage.unitsCost.toLocaleString()} {pricing.currency}</strong>
                </div>

                {meterage.countertopCost > 0 && (
                  <div className="flex justify-between items-center text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <div>
                      <span className="font-bold text-slate-800">الرخام / الكوارتز:</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{meterage.countertopAreaM2} م²</span>
                    </div>
                    <strong className="text-slate-900 font-mono text-sm">{meterage.countertopCost.toLocaleString()} {pricing.currency}</strong>
                  </div>
                )}

                {meterage.accessoriesCost > 0 && (
                  <div className="flex justify-between items-center text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <span className="font-bold text-slate-800">الإكسسوارات والمفصلات:</span>
                    <strong className="text-slate-900 font-mono text-sm">{meterage.accessoriesCost.toLocaleString()} {pricing.currency}</strong>
                  </div>
                )}

                {meterage.installationCost > 0 && (
                  <div className="flex justify-between items-center text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <span className="font-bold text-slate-800">المصنعية والتركيب ({pricing.installationCostPercentage}%):</span>
                    <strong className="text-slate-900 font-mono text-sm">{meterage.installationCost.toLocaleString()} {pricing.currency}</strong>
                  </div>
                )}

                {meterage.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span className="font-bold">خصم خاص:</span>
                    <strong className="font-mono text-sm">-{meterage.discount.toLocaleString()} {pricing.currency}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Total Grand Amount */}
            <div className="border-t-2 border-dashed border-slate-300 pt-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-bold text-slate-800">الإجمالي النهائي المطلوب:</span>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {meterage.finalTotal.toLocaleString()} {pricing.currency}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                طريقة المحاسبة المعتمدة: <strong>{isSquareMode ? 'المتر المربع لوش الوحدات' : 'المتر الطولي'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. ITEMIZED CABINET-BY-CABINET BREAKDOWN TABLE (جدول حصر كل وحدة بالواجهة) */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Table size={18} className="text-purple-600" />
              <span>جدول تفصيل مسطحات وش الوحدات لكل قطعة (W × H) والتكلفة</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              إجمالي {meterage.breakdownItems.length} وحدة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">الكود</th>
                  <th className="py-2.5 px-3">اسم الوحدة</th>
                  <th className="py-2.5 px-3">النوع</th>
                  <th className="py-2.5 px-3 font-mono text-center">العرض (W)</th>
                  <th className="py-2.5 px-3 font-mono text-center">الارتفاع (H)</th>
                  <th className="py-2.5 px-3 font-mono text-center text-slate-400">العمق (D)</th>
                  <th className="py-2.5 px-3 font-mono text-center bg-purple-50 text-purple-800">
                    مسطح الوش (م² = W×H)
                  </th>
                  <th className="py-2.5 px-3 font-mono text-center bg-blue-50 text-blue-800">
                    المتر الطولي (م.ط)
                  </th>
                  <th className="py-2.5 px-3 font-mono text-left">التكلفة ({pricing.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meterage.breakdownItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-700">{item.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold text-slate-800">{item.widthMm / 10} سم</td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold text-slate-800">{item.heightMm / 10} سم</td>
                    <td className="py-2.5 px-3 font-mono text-center text-slate-400">{item.depthMm / 10} سم</td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold bg-purple-50/50 text-purple-900">
                      {item.faceAreaM2} م²
                    </td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold bg-blue-50/50 text-blue-900">
                      {item.linearM} م.ط
                    </td>
                    <td className="py-2.5 px-3 font-mono text-left font-bold text-slate-900">
                      {item.totalCost.toLocaleString()} {pricing.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs border-t-2 border-slate-900">
                  <td colSpan={3} className="py-3 px-3">المجموع الكلي:</td>
                  <td colSpan={3} className="py-3 px-3 text-center text-slate-300 font-mono">
                    {meterage.breakdownItems.length} قطعة
                  </td>
                  <td className="py-3 px-3 font-mono text-center text-amber-300 text-sm">
                    {meterage.totalFrontsAreaM2} م²
                  </td>
                  <td className="py-3 px-3 font-mono text-center text-cyan-300 text-sm">
                    {meterage.totalLinearM} م.ط
                  </td>
                  <td className="py-3 px-3 font-mono text-left text-white text-sm">
                    {meterage.unitsCost.toLocaleString()} {pricing.currency}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
