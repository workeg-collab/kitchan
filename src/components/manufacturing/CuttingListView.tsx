import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { MaterialSystemType } from '../../types/manufacturingSystems';
import { PRESET_MANUFACTURING_TEMPLATES } from '../../constants/manufacturingTemplates';
import { calculateUnifiedManufacturingPackage } from '../../utils/manufacturingEngine';
import { formatDimension } from '../../utils/unitConversion';
import { TRANSLATIONS } from '../../utils/i18n';
import { 
  Scissors, 
  Download, 
  Layers, 
  FileSpreadsheet, 
  Maximize2, 
  Box, 
  Zap, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle,
  Columns
} from 'lucide-react';

export const CuttingListView: React.FC = () => {
  const { project, updateManufacturing } = useProjectStore();
  const { unit, language } = useUIStore();
  const t = TRANSLATIONS[language];

  const projectType = project.metadata.projectType || 'kitchen';

  // Filter templates strictly by current active category
  const relevantTemplates = PRESET_MANUFACTURING_TEMPLATES.filter((tmpl) => 
    !tmpl.supportedCategories || tmpl.supportedCategories.includes(projectType)
  );

  // Active Material System Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    relevantTemplates.find((t) => t.systemType === project.manufacturing.systemType)?.id || relevantTemplates[0]?.id || PRESET_MANUFACTURING_TEMPLATES[0].id
  );

  const activeTemplate = relevantTemplates.find((t) => t.id === selectedTemplateId) || relevantTemplates[0] || PRESET_MANUFACTURING_TEMPLATES[0];

  // Run the Unified Manufacturing Engine
  const mfgResult = calculateUnifiedManufacturingPackage(project.cabinets, activeTemplate);

  const handleSelectSystem = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = relevantTemplates.find((t) => t.id === tmplId);
    if (tmpl) {
      updateManufacturing({
        systemType: tmpl.systemType,
        boardThickness: tmpl.primaryBoardThickness,
        backPanelThickness: tmpl.backPanelThickness,
        constructionMethod: tmpl.carcassConstruction as any,
        backPanelMount: tmpl.backPanelMount as any,
      });
    }
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (mfgResult.systemType === 'wood') {
      csvContent += 'Item ID,Item Name,Part Name,Qty,Length (mm),Width (mm),Thickness (mm),Material,Edge Top,Edge Bottom,Edge Left,Edge Right\n';
      mfgResult.woodPanels.forEach((p) => {
        csvContent += `"${p.cabinetId}","${p.cabinetName}","${p.partName}",${p.quantity},${p.length},${p.width},${p.thickness},"${p.material}",${p.edgeBanding.top ? 1 : 0},${p.edgeBanding.bottom ? 1 : 0},${p.edgeBanding.left ? 1 : 0},${p.edgeBanding.right ? 1 : 0}\n`;
      });
    } else {
      csvContent += 'Item ID,Item Name,Profile Code,Profile Name,Qty,Cut Length (mm),Left Angle,Right Angle,Notes\n';
      mfgResult.profileCuts.forEach((p) => {
        csvContent += `"${p.cabinetId}","${p.cabinetName}","${p.profileCode}","${p.profileName}",${p.quantity},${p.length},${p.cutAngleLeft}°,${p.cutAngleRight}°,"${p.notes || ''}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${project.metadata.name}_Cutting_List_${projectType}_${activeTemplate.systemType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryTitle = () => {
    switch (projectType) {
      case 'bedroom':
        return {
          title: 'محرك تفصيل وتقطيع غرف النوم والأسرّة والتسريحات',
          sub: 'حساب مقاسات شاسيهات الأسرّة، قواطع الأدراج، الألواح، وشريط الـ ABS المانع للصدمات 2 مم',
          iconColor: 'bg-purple-50 text-purple-600',
        };
      case 'dressing':
        return {
          title: 'محرك تفصيل وتقطيع الدريسينج روم وخزائن الملابس',
          sub: 'حساب مقاسات القواطع الرأسية (Gables)، أرفف الأحذية، أدراج المجوهرات، وسكك السلايدنج',
          iconColor: 'bg-amber-50 text-amber-600',
        };
      case 'library':
        return {
          title: 'محرك تفصيل وتقطيع المكتبات ووحدات الشاشات الجدارية',
          sub: 'حساب مسطحات تجاويف الشاشات، أرفف الكتب، البانوهات الخشبية المضلعة، والتجميع المخفي',
          iconColor: 'bg-emerald-50 text-emerald-600',
        };
      case 'living':
        return {
          title: 'محرك تفصيل أثاث الصالون وغرف المعيشة والسفرة',
          sub: 'حساب مسطحات طاولات القهوة، السفرة، بوفيهات التقديم، ووحدات الحوائط',
          iconColor: 'bg-rose-50 text-rose-600',
        };
      default:
        return {
          title: 'محرك تصنيع وتقطيع المطابخ (خشب / ألوميتال / كلادينج / خشمونيوم)',
          sub: 'حساب دقيق للألواح والقطاعات وزوايا 45°/90° والشيتات وهالك القص لكافة أنظمة المطابخ',
          iconColor: 'bg-blue-50 text-blue-600',
        };
    }
  };

  const catInfo = getCategoryTitle();

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header & Material System Switcher */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${catInfo.iconColor}`}>
              <Scissors size={18} />
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              {catInfo.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {catInfo.sub}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 shadow-xs"
          >
            <Download size={14} />
            <span>{t.exportCSV}</span>
          </button>
        </div>
      </div>

      {/* Material Systems Category-Specific Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto">
        {relevantTemplates.map((tmpl) => {
          const isSelected = tmpl.id === selectedTemplateId;
          return (
            <button
              key={tmpl.id}
              onClick={() => handleSelectSystem(tmpl.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-700 hover:border-slate-300 border border-slate-200'
              }`}
            >
              <span>{tmpl.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mfgResult.systemType === 'wood' ? (
            <>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">عدد الألواح الخام (2800×2070)</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{mfgResult.totalSheetsRequired} لوح</div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">بما يشمل نسبة الهالك {activeTemplate.wasteFactorPercentage}%</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">إجمالي مساحة المسطحات</div>
                <div className="text-2xl font-black text-blue-600 mt-1">
                  {mfgResult.sheetNesting.reduce((acc, s) => acc + s.usedAreaM2, 0).toFixed(2)} م²
                </div>
                <div className="text-[11px] text-slate-500 mt-1">صافي مساحة القطع</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">إجمالي عدد القطع الخشبية</div>
                <div className="text-2xl font-black text-indigo-600 mt-1">
                  {mfgResult.woodPanels.reduce((acc, p) => acc + p.quantity, 0)} قطعة
                </div>
                <div className="text-[11px] text-slate-500 mt-1">شاسيه + ضلف + أرفف</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">تكلفة الخامات المصنعية التقريبية</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {mfgResult.costBreakdown.manufacturingSubtotal.toLocaleString()} {project.pricing.currency}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">ألواح + إكسسوارات + مصنعيات</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">أعواد الألوميتال (طول 6 متر)</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{mfgResult.totalBarsRequired} عود</div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">توزيع خطي مثالي (1D Nesting)</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">إجمالي أمتار القطاعات</div>
                <div className="text-2xl font-black text-blue-600 mt-1">{mfgResult.totalProfileMeters} متر طولي</div>
                <div className="text-[11px] text-slate-500 mt-1">قوائم + عوارض + فريمات</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">عدد شيتات الحشو والكلادينج</div>
                <div className="text-2xl font-black text-amber-600 mt-1">{mfgResult.totalSheetsRequired} شيت</div>
                <div className="text-[11px] text-slate-500 mt-1">حشوات الفايبر والكلادينج 4 مم</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 font-mono">تكلفة الخامات المصنعية التقريبية</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {mfgResult.costBreakdown.manufacturingSubtotal.toLocaleString()} {project.pricing.currency}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">قطاعات + شيتات + كعوب ومفصلات</div>
              </div>
            </>
          )}
        </div>

        {/* 1. CUTTING SCHEDULE TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-blue-600" />
              {mfgResult.systemType === 'wood' ? 'جدول تقطيع وتفصيل الألواح الخشبية' : 'جدول تقطيع قطاعات الألوميتال وزوايا الشطف (45° / 90°)'}
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">
              {mfgResult.systemType === 'wood' ? `${mfgResult.woodPanels.length} بند تقطيع` : `${mfgResult.profileCuts.length} بند قطاعات`}
            </span>
          </div>

          <div className="overflow-x-auto">
            {mfgResult.systemType === 'wood' ? (
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <tr>
                    <th className="px-4 py-3">كود الوحدة</th>
                    <th className="px-4 py-3">اسم القطعة</th>
                    <th className="px-4 py-3 text-center">العدد</th>
                    <th className="px-4 py-3">الطول (اتجاه الثمرة)</th>
                    <th className="px-4 py-3">العرض</th>
                    <th className="px-4 py-3">السماكة</th>
                    <th className="px-4 py-3">الخامة</th>
                    <th className="px-4 py-3 text-center">قشاط ABS (أعلى/أسفل/يسار/يمين)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {mfgResult.woodPanels.map((p, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition">
                      <td className="px-4 py-2.5 font-bold text-blue-600">{p.cabinetId}</td>
                      <td className="px-4 py-2.5 font-sans font-semibold text-slate-800">{p.partName}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-slate-900">{p.quantity}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{p.length} مم</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{p.width} مم</td>
                      <td className="px-4 py-2.5 text-slate-500">{p.thickness} مم</td>
                      <td className="px-4 py-2.5 font-sans text-slate-600">{p.material}</td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px]">
                          <span className={`px-1.5 py-0.5 rounded ${p.edgeBanding.top ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>T</span>
                          <span className={`px-1.5 py-0.5 rounded ${p.edgeBanding.bottom ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>B</span>
                          <span className={`px-1.5 py-0.5 rounded ${p.edgeBanding.left ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>L</span>
                          <span className={`px-1.5 py-0.5 rounded ${p.edgeBanding.right ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>R</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <tr>
                    <th className="px-4 py-3">كود الوحدة</th>
                    <th className="px-4 py-3">كود القطاع</th>
                    <th className="px-4 py-3">وصف القطاع وموضعه</th>
                    <th className="px-4 py-3 text-center">العدد</th>
                    <th className="px-4 py-3">طول القص (مم)</th>
                    <th className="px-4 py-3 text-center">زاوية اليسار</th>
                    <th className="px-4 py-3 text-center">زاوية اليمين</th>
                    <th className="px-4 py-3">ملاحظات التجميع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {mfgResult.profileCuts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/50 transition">
                      <td className="px-4 py-2.5 font-bold text-amber-600">{p.cabinetId}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{p.profileCode}</td>
                      <td className="px-4 py-2.5 font-sans font-semibold text-slate-800">{p.profileName}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-slate-900">{p.quantity}</td>
                      <td className="px-4 py-2.5 font-bold text-blue-600">{p.length} مم</td>
                      <td className="px-4 py-2.5 text-center font-bold text-slate-700">
                        <span className={`px-2 py-0.5 rounded ${p.cutAngleLeft === 45 ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-100'}`}>
                          {p.cutAngleLeft}°
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center font-bold text-slate-700">
                        <span className={`px-2 py-0.5 rounded ${p.cutAngleRight === 45 ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-100'}`}>
                          {p.cutAngleRight}°
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-sans text-[11px] text-slate-500">{p.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 2. LINEAR BAR NESTING OPTIMIZATION MAP (For Aluminium) */}
        {mfgResult.systemType !== 'wood' && mfgResult.barNesting.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Maximize2 size={16} className="text-amber-600" />
                مخطط توزيع ورص القطاعات على الأعواد الخام (Bar Nesting 6000mm)
              </h3>
              <span className="text-xs font-mono text-slate-500">
                إجمالي الأعواد المطلوبة: <strong className="text-slate-900">{mfgResult.totalBarsRequired} عود</strong>
              </span>
            </div>

            <div className="space-y-3">
              {mfgResult.barNesting.map((bar) => (
                <div key={bar.barIndex} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-slate-800">
                      عود #{bar.barIndex} — القطاع: <strong className="text-blue-600">{bar.profileCode}</strong> (6000 مم)
                    </span>
                    <span className="text-slate-500">
                      المستخدم: <strong className="text-slate-900">{bar.totalCutLength} مم</strong> | الهالك المتبقي: <strong className="text-amber-600">{bar.wasteLength} مم ({bar.wastePercentage}%)</strong>
                    </span>
                  </div>

                  {/* Visual Bar Allocation Bar */}
                  <div className="w-full h-8 bg-slate-200 rounded-xl overflow-hidden flex border border-slate-300">
                    {bar.cuts.map((cut, cIdx) => {
                      const widthPercent = (cut.length / bar.standardLength) * 100;
                      return (
                        <div
                          key={cIdx}
                          style={{ width: `${widthPercent}%` }}
                          className="h-full bg-blue-600 border-r border-white/40 flex items-center justify-center text-[10px] text-white font-mono font-bold truncate px-1"
                          title={`${cut.cabinetId}: ${cut.length}mm (${cut.angle})`}
                        >
                          {cut.length}
                        </div>
                      );
                    })}
                    {/* Waste Offcut */}
                    <div
                      style={{ width: `${(bar.wasteLength / bar.standardLength) * 100}%` }}
                      className="h-full bg-amber-200/80 flex items-center justify-center text-[10px] text-amber-800 font-mono font-bold"
                    >
                      متبقي
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. HARDWARE & ACCESSORIES BOM */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Box size={16} className="text-purple-600" />
              حصر الإكسسوارات والمفصلات والكعوب (Hardware & Connectors BOM)
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">{mfgResult.hardwareBOM.length} صنف إكسسوار</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                <tr>
                  <th className="px-4 py-3">كود الصنف</th>
                  <th className="px-4 py-3">اسم الصنف والإكسسوار</th>
                  <th className="px-4 py-3 text-center">الكمية</th>
                  <th className="px-4 py-3 text-center">الوحدة</th>
                  <th className="px-4 py-3">سعر الوحدة</th>
                  <th className="px-4 py-3">الإجمالي</th>
                  <th className="px-4 py-3">التفاصيل والاستخدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {mfgResult.hardwareBOM.map((hw, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/50 transition">
                    <td className="px-4 py-2.5 text-slate-400">{hw.id}</td>
                    <td className="px-4 py-2.5 font-sans font-bold text-slate-800">{hw.name}</td>
                    <td className="px-4 py-2.5 text-center font-extrabold text-purple-600">{hw.quantity}</td>
                    <td className="px-4 py-2.5 text-center text-slate-600">{hw.unit}</td>
                    <td className="px-4 py-2.5 text-slate-600">{hw.unitPrice} {project.pricing.currency}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">
                      {(hw.quantity * (hw.unitPrice || 0)).toLocaleString()} {project.pricing.currency}
                    </td>
                    <td className="px-4 py-2.5 font-sans text-slate-500">{hw.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
