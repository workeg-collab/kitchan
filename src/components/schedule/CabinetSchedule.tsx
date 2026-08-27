import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDimension } from '../../utils/unitConversion';
import { exportCabinetScheduleCSV } from '../../utils/csvExporter';
import { TRANSLATIONS } from '../../utils/i18n';
import { saveAs } from 'file-saver';
import { 
  Download, 
  Search, 
  Trash2, 
  Edit3, 
  FileSpreadsheet 
} from 'lucide-react';

export const CabinetSchedule: React.FC = () => {
  const { project, removeCabinet, setSelected } = useProjectStore();
  const { language } = useUIStore();
  const t = TRANSLATIONS[language];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { cabinets, metadata } = project;
  const unit = metadata.unit;

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
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Header & Search Bar (Light Theme) */}
      <div className="p-6 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet className="text-blue-600" size={22} />
            {t.schedule}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'ar' ? 'جدول كامل لجميع الكبائن والوحدات مع الأبعاد الدقيقة وملاحظات التصنيع' : 'Real-time schedule of all kitchen units with dimensional specs, hardware and workshop notes'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث بالرمز أو النوع...' : 'Search by ID or type...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 w-56"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">{t.all} ({cabinets.length})</option>
            <option value="base">{t.base}</option>
            <option value="wall">{t.wall_cat}</option>
            <option value="tall">{t.tall}</option>
            <option value="corner">{t.corner}</option>
            <option value="custom">{t.custom}</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <Download size={15} />
            <span>{t.exportCSV}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xl bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase tracking-wider font-mono text-[11px] border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold">ID</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'اسم الوحدة' : 'Cabinet Name'}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                <th className="py-3.5 px-4 font-bold">{t.width}</th>
                <th className="py-3.5 px-4 font-bold">{t.height}</th>
                <th className="py-3.5 px-4 font-bold">{t.depth}</th>
                <th className="py-3.5 px-4 font-bold">{t.posZ}</th>
                <th className="py-3.5 px-4 font-bold">{t.doors}</th>
                <th className="py-3.5 px-4 font-bold">{t.drawers}</th>
                <th className="py-3.5 px-4 font-bold">{t.shelves}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'الجدار' : 'Wall'}</th>
                <th className="py-3.5 px-4 font-bold">{t.notes}</th>
                <th className="py-3.5 px-4 font-bold text-right">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-slate-400 font-medium">
                    {language === 'ar' ? 'لا توجد وحدات بعد. أضف كبائن من القائمة الجانبية.' : 'No cabinets found. Add cabinets from the left library panel.'}
                  </td>
                </tr>
              ) : (
                filtered.map((cab) => {
                  let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (cab.category === 'wall') badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
                  else if (cab.category === 'tall') badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
                  else if (cab.category === 'corner') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                    <tr
                      key={cab.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={`inline-block px-2.5 py-1 rounded-md border text-xs ${badgeColor}`}>
                          {cab.id}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {cab.name}
                      </td>

                      <td className="py-3 px-4 text-slate-500 capitalize font-medium">
                        {cab.category}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {formatDimension(cab.width, unit)}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {formatDimension(cab.height, unit)}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {formatDimension(cab.depth, unit)}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        {formatDimension(cab.z, unit)}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {cab.doorCount > 0 ? `${cab.doorCount} (${cab.doorHinge})` : '—'}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {cab.drawerCount > 0 ? cab.drawerCount : '—'}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {cab.shelfCount}
                      </td>

                      <td className="py-3 px-4 text-slate-500 uppercase font-mono">
                        {cab.wallId || 'Wall A'}
                      </td>

                      <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">
                        {cab.customNotes || '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => setSelected(cab.id, 'cabinet')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Inspect"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => removeCabinet(cab.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
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
