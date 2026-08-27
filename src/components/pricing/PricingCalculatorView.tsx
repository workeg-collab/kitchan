import React, { useRef } from 'react';
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
  Tag 
} from 'lucide-react';

export const PricingCalculatorView: React.FC = () => {
  const { project, updateProjectPricing } = useProjectStore();
  const printRef = useRef<HTMLDivElement>(null);

  const { cabinets, room, countertop, manufacturing, pricing, metadata } = project;

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

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-auto p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto mb-6 bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <Calculator className="text-blue-600" size={24} />
            حاسبة عدد أمتار المطبخ وعرض السعر التقديري
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            حساب دقيق لمسطحات الأبواب، الرخام، والأمتار الطولية مع حساب التكلفة الإجمالية بناءً على سعر المتر
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 gap-2">
            <span className="text-xs font-semibold text-slate-600">العملة:</span>
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

          <button
            onClick={handlePrintQuotation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
          >
            <Printer size={15} />
            <span>طباعة عرض السعر</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* 1. METERAGE SUMMARY CARDS (بطاقات قياس الأمتار بالمتر المسطح والطولي) */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
            أولاً: حصر كميات وأمتار المطبخ (متر مربع وطولي)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* مسطح الواجهات */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="text-[11px] text-slate-500 font-bold">مسطح الواجهات والأبواب</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{meterage.frontsAreaM2} م²</div>
              <div className="text-[10px] text-slate-400 mt-1">إجمالي مساحة ضلف الخشب والأدراج</div>
            </div>

            {/* مسطح الرخام */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="text-[11px] text-slate-500 font-bold">مسطح الرخام / الكوارتز</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{meterage.countertopAreaM2} م²</div>
              <div className="text-[10px] text-slate-400 mt-1">شامل الرفرفة الأمامية 2 سم</div>
            </div>

            {/* الأمتار الطولية السفلية */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="text-[11px] text-slate-500 font-bold">المتر الطولي (الوحدات السفلية)</div>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{meterage.baseLinearM} م.ط</div>
              <div className="text-[10px] text-slate-400 mt-1">طول كبائن الأرضي بالكامل</div>
            </div>

            {/* الأمتار الطولية العلوية */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="text-[11px] text-slate-500 font-bold">المتر الطولي (الوحدات العلوية)</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">{meterage.wallLinearM} م.ط</div>
              <div className="text-[10px] text-slate-400 mt-1">طول كبائن الحائط المعلقة</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">الأمتار الطولية للدواليب الطولية:</span>
              <strong className="text-slate-900 font-bold">{meterage.tallLinearM} م.ط</strong>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">إجمالي مسطحات ألواح الخشب:</span>
              <strong className="text-slate-900 font-bold">{meterage.totalWoodPanelsAreaM2} م²</strong>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">مساحة أرضية الغرفة:</span>
              <strong className="text-slate-900 font-bold">{meterage.roomFloorAreaM2} م²</strong>
            </div>
          </div>
        </div>

        {/* 2. PRICING PARAMETERS & QUOTATION (جدول إدخال أسعار المتر وحساب التكلفة) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Section (2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins size={18} className="text-amber-600" />
              تحديد أسعار المتر المربع والطولي
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* سعر المتر الطولي سفلي */}
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
                <span className="text-[10px] text-slate-400 mt-1 block">
                  الناتج: {meterage.baseLinearM} م.ط × {pricing.pricePerLinearMeterBase} = {meterage.baseCost.toLocaleString()} {pricing.currency}
                </span>
              </div>

              {/* سعر المتر الطولي علوي */}
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
                <span className="text-[10px] text-slate-400 mt-1 block">
                  الناتج: {meterage.wallLinearM} م.ط × {pricing.pricePerLinearMeterWall} = {meterage.wallCost.toLocaleString()} {pricing.currency}
                </span>
              </div>

              {/* سعر المتر الطولي للدواليب الطولية */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">
                  سعر المتر الطولي للدواليب الطولية ({pricing.currency} / م.ط)
                </label>
                <input
                  type="number"
                  value={pricing.pricePerLinearMeterTall}
                  onChange={(e) => updateProjectPricing({ pricePerLinearMeterTall: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  الناتج: {meterage.tallLinearM} م.ط × {pricing.pricePerLinearMeterTall} = {meterage.tallCost.toLocaleString()} {pricing.currency}
                </span>
              </div>

              {/* سعر المتر المربع للرخام */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">
                  سعر المتر المربع للرخام / الكوارتز ({pricing.currency} / م²)
                </label>
                <input
                  type="number"
                  value={pricing.pricePerSquareMeterCountertop}
                  onChange={(e) => updateProjectPricing({ pricePerSquareMeterCountertop: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
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
            </div>
          </div>

          {/* Quotation Final Summary Card (1 col) */}
          <div
            ref={printRef}
            className="bg-gradient-to-b from-white to-slate-50 p-6 rounded-3xl border-2 border-blue-600 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                    عرض سعر رسمي
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{metadata.name}</h4>
                  <p className="text-[11px] text-slate-500">العميل: {metadata.clientName || 'بدون اسم'}</p>
                </div>
              </div>

              {/* Price Breakdown List */}
              <div className="space-y-2.5 my-5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>الوحدات السفلية ({meterage.baseLinearM} م.ط):</span>
                  <strong className="text-slate-900 font-mono">{meterage.baseCost.toLocaleString()} {pricing.currency}</strong>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>الوحدات العلوية ({meterage.wallLinearM} م.ط):</span>
                  <strong className="text-slate-900 font-mono">{meterage.wallCost.toLocaleString()} {pricing.currency}</strong>
                </div>

                {meterage.tallCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>الدواليب الطولية ({meterage.tallLinearM} م.ط):</span>
                    <strong className="text-slate-900 font-mono">{meterage.tallCost.toLocaleString()} {pricing.currency}</strong>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>الرخام / الكوارتز ({meterage.countertopAreaM2} م²):</span>
                  <strong className="text-slate-900 font-mono">{meterage.countertopCost.toLocaleString()} {pricing.currency}</strong>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>الإكسسوارات والمفصلات:</span>
                  <strong className="text-slate-900 font-mono">{meterage.accessoriesCost.toLocaleString()} {pricing.currency}</strong>
                </div>

                {meterage.installationCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>المصنعية والتركيب ({pricing.installationCostPercentage}%):</span>
                    <strong className="text-slate-900 font-mono">{meterage.installationCost.toLocaleString()} {pricing.currency}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Total Grand Amount */}
            <div className="border-t-2 border-dashed border-slate-200 pt-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-bold text-slate-800">الإجمالي النهائي المطلوب:</span>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {meterage.finalTotal.toLocaleString()} {pricing.currency}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                يشمل تفصيل جميع الوحدات، مسطحات الرخام، والإكسسوارات المحددة بالمشروع.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
