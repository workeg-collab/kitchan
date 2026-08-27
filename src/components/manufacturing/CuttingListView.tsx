import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { generateFullProjectBOM } from '../../utils/manufacturing';
import { exportCuttingListCSV, exportHardwareBOMCSV } from '../../utils/csvExporter';
import { saveAs } from 'file-saver';
import { 
  Scissors, 
  Layers, 
  Wrench, 
  Download, 
  Settings2, 
  Package, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';

export const CuttingListView: React.FC = () => {
  const { project, updateManufacturing } = useProjectStore();
  const { cabinets, manufacturing } = project;

  const [activeSubTab, setActiveSubTab] = useState<'panels' | 'hardware' | 'sheets'>('panels');
  const [boardType, setBoardType] = useState<number>(manufacturing.boardThickness);

  const bom = generateFullProjectBOM(cabinets, manufacturing);

  const handleThicknessChange = (t: number) => {
    setBoardType(t);
    updateManufacturing({ boardThickness: t });
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
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Controls & Summary Bar */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Scissors className="text-amber-400" size={22} />
            Manufacturing Details & Cutting List
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Exact panel breakout dimensions, edge-banding codes, board yield and Bill of Materials (BOM)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Material Board Thickness Selector */}
          <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 gap-2">
            <Settings2 size={15} className="text-slate-400" />
            <span className="text-xs text-slate-400">Board Thickness:</span>
            <div className="flex gap-1">
              {[16, 18, 19].map((thick) => (
                <button
                  key={thick}
                  onClick={() => handleThicknessChange(thick)}
                  className={`px-2 py-1 rounded text-xs font-bold transition ${
                    manufacturing.boardThickness === thick
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {thick}mm
                </button>
              ))}
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('panels')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeSubTab === 'panels' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cutting Panels ({bom.allPanels.length})
            </button>
            <button
              onClick={() => setActiveSubTab('hardware')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeSubTab === 'hardware' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hardware BOM ({bom.aggregatedHardware.length})
            </button>
            <button
              onClick={() => setActiveSubTab('sheets')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeSubTab === 'sheets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sheet Nesting Preview
            </button>
          </div>

          <button
            onClick={activeSubTab === 'hardware' ? handleDownloadHardwareCSV : handleDownloadPanelsCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-slate-900/40 border-b border-slate-800/80">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Total Panel Area</div>
          <div className="text-xl font-bold text-white mt-0.5">{bom.totalAreaM2} m²</div>
          <div className="text-[10px] text-slate-500 mt-1">{bom.allPanels.length} individual parts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Estimated Raw Sheets</div>
          <div className="text-xl font-bold text-amber-400 mt-0.5">
            {bom.sheetEstimates.sheetsNeeded} Sheets
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{bom.sheetEstimates.standardSheetSize}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Sheet Cutting Yield</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">
            {bom.sheetEstimates.efficiencyPercentage}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Incl. 15% saw kerf & trim</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Total Hardware Items</div>
          <div className="text-xl font-bold text-blue-400 mt-0.5">
            {bom.aggregatedHardware.reduce((acc, h) => acc + h.quantity, 0)} Pieces
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Hinges, slides, legs, fasteners</div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* PANELS SUBTAB */}
        {activeSubTab === 'panels' && (
          <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
                  <th className="py-3 px-4 font-bold">Cab ID</th>
                  <th className="py-3 px-4 font-bold">Cabinet Unit</th>
                  <th className="py-3 px-4 font-bold">Part Name</th>
                  <th className="py-3 px-4 font-bold text-center">Qty</th>
                  <th className="py-3 px-4 font-bold">Length (Grain)</th>
                  <th className="py-3 px-4 font-bold">Width</th>
                  <th className="py-3 px-4 font-bold">Thick</th>
                  <th className="py-3 px-4 font-bold">Material</th>
                  <th className="py-3 px-4 font-bold">Edge Banding (T / B / L / R)</th>
                  <th className="py-3 px-4 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {bom.allPanels.map((panel, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-400">
                      {panel.cabinetId}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 font-medium">
                      {panel.cabinetName}
                    </td>
                    <td className="py-2.5 px-4 text-white font-semibold">
                      {panel.partName}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-200">
                      {panel.quantity}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-amber-400">
                      {panel.length} mm
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-amber-400">
                      {panel.width} mm
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-400">
                      {panel.thickness} mm
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {panel.material}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">
                      <div className="flex gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.top ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-slate-600'}`}>T</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.bottom ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-slate-600'}`}>B</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.left ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-slate-600'}`}>L</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${panel.edgeBanding.right ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-slate-600'}`}>R</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {panel.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HARDWARE SUBTAB */}
        {activeSubTab === 'hardware' && (
          <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Hardware Component</th>
                  <th className="py-3 px-4 font-bold text-center">Total Quantity</th>
                  <th className="py-3 px-4 font-bold">Unit</th>
                  <th className="py-3 px-4 font-bold">Specifications / Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {bom.aggregatedHardware.map((hw, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono uppercase text-slate-400">
                      {hw.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {hw.name}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-400 text-sm">
                      {hw.quantity}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {hw.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {hw.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SHEET NESTING PREVIEW */}
        {activeSubTab === 'sheets' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white mb-2">Raw Board Cutting Diagram Simulation</h3>
              <p className="text-xs text-slate-400 mb-6">
                Visualization of parts nested onto 2800 x 2070 mm commercial melamine sheets with 4mm saw blade kerf allowance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: bom.sheetEstimates.sheetsNeeded }).map((_, sheetIdx) => (
                  <div key={sheetIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-amber-400">Sheet #{sheetIdx + 1} of {bom.sheetEstimates.sheetsNeeded}</span>
                      <span className="text-[11px] text-slate-400 font-mono">2800 x 2070 mm</span>
                    </div>

                    {/* Simulated visual nesting board */}
                    <div className="w-full aspect-[2.8/2.07] bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-2 relative overflow-hidden flex flex-wrap gap-1.5 content-start">
                      {bom.allPanels.slice(sheetIdx * 8, (sheetIdx + 1) * 8).map((p, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-blue-900/60 border border-blue-400/60 rounded p-1.5 flex flex-col justify-between"
                          style={{
                            width: `${Math.min(95, Math.max(22, (p.length / 2800) * 100))}%`,
                            height: `${Math.min(85, Math.max(25, (p.width / 2070) * 100))}%`,
                          }}
                        >
                          <span className="text-[9px] font-mono font-bold text-white truncate">{p.cabinetId} - {p.partName}</span>
                          <span className="text-[8px] font-mono text-blue-200">{p.length}x{p.width}</span>
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
