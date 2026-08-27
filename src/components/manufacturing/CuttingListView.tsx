import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { generateFullProjectBOM } from '../../utils/manufacturing';
import { exportCuttingListCSV, exportHardwareBOMCSV } from '../../utils/csvExporter';
import { TRANSLATIONS } from '../../utils/i18n';
import { saveAs } from 'file-saver';
import { 
  Scissors, 
  Download, 
  Settings2 
} from 'lucide-react';

export const CuttingListView: React.FC = () => {
  const { project, updateManufacturing } = useProjectStore();
  const { language } = useUIStore();
  const t = TRANSLATIONS[language];
  const { cabinets, manufacturing } = project;

  const [activeSubTab, setActiveSubTab] = useState<'panels' | 'hardware' | 'sheets'>('panels');

  const bom = generateFullProjectBOM(cabinets, manufacturing);

  const handleThicknessChange = (thick: number) => {
    updateManufacturing({ boardThickness: thick });
  };

  const handleDownloadPanelsCSV = () => {
    const csv = exportCuttingListCSV(project);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${project.metadata.name}_Cutting_List.csv`);
  };

  const handleDownloadHardwareCSV = () => {
    const csv = exportHardwareBOMCSV(project);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${project.metadata.name}_Hardware_BOM.csv`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Controls & Summary Bar (Light Theme) */}
      <div className="p-6 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Scissors className="text-amber-600" size={22} />
            {t.manufacturing}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'ar' ? 'جدول تقطيع الخشب لجميع الجوانب والرفوف والأبواب، مع حساب كميات الإكسسوارات والمفصلات' : 'Exact panel breakout dimensions, edge-banding codes, board yield and Bill of Materials (BOM)'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Board Thickness Selector */}
          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 gap-2">
            <Settings2 size={15} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">{t.boardThickness}:</span>
            <div className="flex gap-1">
              {[16, 18, 19].map((thick) => (
                <button
                  key={thick}
                  onClick={() => handleThicknessChange(thick)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    manufacturing.boardThickness === thick
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {thick}mm
                </button>
              ))}
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('panels')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeSubTab === 'panels' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.cuttingList} ({bom.allPanels.length})
            </button>
            <button
              onClick={() => setActiveSubTab('hardware')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeSubTab === 'hardware' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.hardwareBOM} ({bom.aggregatedHardware.length})
            </button>
            <button
              onClick={() => setActiveSubTab('sheets')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeSubTab === 'sheets' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.sheetNesting}
            </button>
          </div>

          <button
            onClick={activeSubTab === 'hardware' ? handleDownloadHardwareCSV : handleDownloadPanelsCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <Download size={15} />
            <span>{t.exportCSV}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-white/60 border-b border-slate-200">
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-500 uppercase font-mono font-bold">{t.totalArea}</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{bom.totalAreaM2} m²</div>
          <div className="text-[10px] text-slate-400 mt-1">{bom.allPanels.length} {language === 'ar' ? 'قطعة خشبية' : 'individual parts'}</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-500 uppercase font-mono font-bold">{t.estimatedSheets}</div>
          <div className="text-xl font-bold text-amber-600 mt-0.5">
            {bom.sheetEstimates.sheetsNeeded} {language === 'ar' ? 'لوح' : 'Sheets'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{bom.sheetEstimates.standardSheetSize}</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-500 uppercase font-mono font-bold">{t.cuttingYield}</div>
          <div className="text-xl font-bold text-emerald-600 mt-0.5">
            {bom.sheetEstimates.efficiencyPercentage}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{language === 'ar' ? 'متضمناً سماكة سلاح المنشار' : 'Incl. saw kerf allowance'}</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-500 uppercase font-mono font-bold">{language === 'ar' ? 'إجمالي الإكسسوارات' : 'Hardware Parts'}</div>
          <div className="text-xl font-bold text-blue-600 mt-0.5">
            {bom.aggregatedHardware.reduce((acc, h) => acc + h.quantity, 0)} {language === 'ar' ? 'قطعة' : 'Pieces'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Hinges, slides, legs, fasteners</div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {activeSubTab === 'panels' && (
          <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xl bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase tracking-wider font-mono text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4 font-bold">Cab ID</th>
                  <th className="py-3 px-4 font-bold">{language === 'ar' ? 'الوحدة' : 'Cabinet'}</th>
                  <th className="py-3 px-4 font-bold">{t.partName}</th>
                  <th className="py-3 px-4 font-bold text-center">{t.quantity}</th>
                  <th className="py-3 px-4 font-bold">{t.grainLength}</th>
                  <th className="py-3 px-4 font-bold">{t.width}</th>
                  <th className="py-3 px-4 font-bold">{language === 'ar' ? 'السماكة' : 'Thick'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'ar' ? 'الخامة' : 'Material'}</th>
                  <th className="py-3 px-4 font-bold">{t.edgeBanding}</th>
                  <th className="py-3 px-4 font-bold">{t.notes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {bom.allPanels.map((panel, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                      {panel.cabinetId}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-medium">
                      {panel.cabinetName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-900 font-bold">
                      {panel.partName}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                      {panel.quantity}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-amber-600">
                      {panel.length} mm
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-amber-600">
                      {panel.width} mm
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">
                      {panel.thickness} mm
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">
                      {panel.material}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">
                      <div className="flex gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.top ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold' : 'text-slate-300'}`}>T</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.bottom ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold' : 'text-slate-300'}`}>B</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.left ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold' : 'text-slate-300'}`}>L</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.right ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold' : 'text-slate-300'}`}>R</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {panel.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'hardware' && (
          <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xl bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase tracking-wider font-mono text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4 font-bold">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'ar' ? 'نوع الإكسسوار / المفصلات' : 'Hardware Component'}</th>
                  <th className="py-3 px-4 font-bold text-center">{language === 'ar' ? 'العدد الإجمالي' : 'Total Quantity'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'ar' ? 'الوحدة' : 'Unit'}</th>
                  <th className="py-3 px-4 font-bold">{language === 'ar' ? 'المواصفات والاستخدام' : 'Specifications / Usage'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {bom.aggregatedHardware.map((hw, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono uppercase text-slate-500 font-bold">
                      {hw.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {hw.name}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-600 text-sm">
                      {hw.quantity}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {hw.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {hw.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'sheets' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {language === 'ar' ? 'محاكاة رص الألواح وتفصيل الخشب (Nesting)' : 'Raw Board Cutting Diagram Simulation'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {language === 'ar' ? 'معاينة توزيع ورص القطع على ألواح الميلامين والم دي إف مقاس 2800 × 2070 مم' : 'Visualization of parts nested onto 2800 x 2070 mm commercial sheets.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: bom.sheetEstimates.sheetsNeeded }).map((_, sheetIdx) => (
                  <div key={sheetIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-amber-700">
                        {language === 'ar' ? `اللوح رقم ${sheetIdx + 1} من ${bom.sheetEstimates.sheetsNeeded}` : `Sheet #${sheetIdx + 1} of ${bom.sheetEstimates.sheetsNeeded}`}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-bold">2800 x 2070 mm</span>
                    </div>

                    <div className="w-full aspect-[2.8/2.07] bg-white border-2 border-dashed border-slate-300 rounded-xl p-2 relative overflow-hidden flex flex-wrap gap-1.5 content-start">
                      {bom.allPanels.slice(sheetIdx * 8, (sheetIdx + 1) * 8).map((p, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-blue-50 border border-blue-300 rounded-lg p-1.5 flex flex-col justify-between shadow-xs"
                          style={{
                            width: `${Math.min(95, Math.max(22, (p.length / 2800) * 100))}%`,
                            height: `${Math.min(85, Math.max(25, (p.width / 2070) * 100))}%`,
                          }}
                        >
                          <span className="text-[9px] font-mono font-bold text-slate-900 truncate">{p.cabinetId} - {p.partName}</span>
                          <span className="text-[8px] font-mono font-bold text-blue-600">{p.length}x{p.width}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
