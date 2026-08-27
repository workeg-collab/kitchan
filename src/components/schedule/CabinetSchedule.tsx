import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { formatDimension } from '../../utils/unitConversion';
import { exportCabinetScheduleCSV } from '../../utils/csvExporter';
import { saveAs } from 'file-saver';
import { 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  Check, 
  Plus 
} from 'lucide-react';

export const CabinetSchedule: React.FC = () => {
  const { project, updateCabinet, removeCabinet, setSelected } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const { cabinets, metadata } = project;
  const unit = metadata.unit;

  // Filter cabinets
  const filtered = cabinets.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.customNotes && c.customNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleExportCSV = () => {
    const csvContent = exportCabinetScheduleCSV(project);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${project.metadata.name}_Cabinet_Schedule.csv`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Header & Search Bar */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <FileSpreadsheet className="text-blue-400" size={22} />
            Automatic Cabinet Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time schedule of all kitchen units with dimensional specs, hardware and workshop notes
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by ID or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-56"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories ({cabinets.length})</option>
            <option value="base">Base Cabinets</option>
            <option value="wall">Wall Cabinets</option>
            <option value="tall">Tall Units</option>
            <option value="corner">Corner Units</option>
            <option value="custom">Custom Units</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
                <th className="py-3.5 px-4 font-bold">ID</th>
                <th className="py-3.5 px-4 font-bold">Cabinet Name</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Width</th>
                <th className="py-3.5 px-4 font-bold">Height</th>
                <th className="py-3.5 px-4 font-bold">Depth</th>
                <th className="py-3.5 px-4 font-bold">Elev (Z)</th>
                <th className="py-3.5 px-4 font-bold">Doors</th>
                <th className="py-3.5 px-4 font-bold">Drawers</th>
                <th className="py-3.5 px-4 font-bold">Shelves</th>
                <th className="py-3.5 px-4 font-bold">Wall</th>
                <th className="py-3.5 px-4 font-bold">Notes / Specs</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-slate-500">
                    No cabinets found. Add cabinets from the left library panel.
                  </td>
                </tr>
              ) : (
                filtered.map((cab) => {
                  const isEditing = editingId === cab.id;
                  let badgeColor = 'bg-blue-950 text-blue-400 border-blue-800';
                  if (cab.category === 'wall') badgeColor = 'bg-sky-950 text-sky-400 border-sky-800';
                  else if (cab.category === 'tall') badgeColor = 'bg-purple-950 text-purple-400 border-purple-800';
                  else if (cab.category === 'corner') badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-800';

                  return (
                    <tr
                      key={cab.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={`inline-block px-2.5 py-1 rounded-md border text-xs ${badgeColor}`}>
                          {cab.id}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-white">
                        {cab.name}
                      </td>

                      <td className="py-3 px-4 text-slate-400 capitalize">
                        {cab.category}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-200">
                        {formatDimension(cab.width, unit)}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-200">
                        {formatDimension(cab.height, unit)}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-200">
                        {formatDimension(cab.depth, unit)}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400">
                        {formatDimension(cab.z, unit)}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {cab.doorCount > 0 ? `${cab.doorCount} (${cab.doorHinge})` : '—'}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {cab.drawerCount > 0 ? cab.drawerCount : '—'}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {cab.shelfCount}
                      </td>

                      <td className="py-3 px-4 text-slate-400 uppercase font-mono">
                        {cab.wallId || 'Wall A'}
                      </td>

                      <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate">
                        {cab.customNotes || '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => setSelected(cab.id, 'cabinet')}
                            className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-600/30 rounded transition"
                            title="Inspect in 2D/3D"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => removeCabinet(cab.id)}
                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-600/30 rounded transition"
                            title="Delete Cabinet"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
