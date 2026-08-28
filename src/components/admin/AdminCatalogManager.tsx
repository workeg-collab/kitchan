import React, { useState } from 'react';
import { ALL_SAMPLE_PROJECTS } from '../../constants/expandedProjects';
import { FRONT_FINISHES, COUNTERTOP_MATERIALS, MaterialOption } from '../../constants/materialCatalog';
import { CABINET_LIBRARY } from '../../constants/cabinetLibrary';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';
import { ProjectData } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  Check, 
  Layers, 
  Palette, 
  Box, 
  Sparkles, 
  Save,
  Search,
  Eye,
  Sliders
} from 'lucide-react';
import { saveAs } from 'file-saver';

export const AdminCatalogManager: React.FC = () => {
  const { project, setProject } = useProjectStore();
  const { setActiveTab } = useUIStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'templates' | 'materials' | 'blocks'>('templates');
  const [materialsList, setMaterialsList] = useState<MaterialOption[]>(FRONT_FINISHES);
  const [searchQuery, setSearchQuery] = useState('');

  // New Material Swatch Form State
  const [newMatName, setNewMatName] = useState('');
  const [newMatNameEn, setNewMatNameEn] = useState('');
  const [newMatColor, setNewMatColor] = useState('#bfa076');
  const [newMatRoughness, setNewMatRoughness] = useState(0.7);
  const [newMatMetalness, setNewMatMetalness] = useState(0.05);
  const [newMatCategory, setNewMatCategory] = useState<'front' | 'countertop' | 'floor'>('front');

  // New Project Template Form State
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('kitchen');
  const [templateStyle, setTemplateStyle] = useState('Modern Luxury');

  const handleAddNewMaterial = () => {
    if (!newMatName.trim()) return;

    const newMat: MaterialOption = {
      id: `mat-${Date.now()}`,
      name: newMatName.trim(),
      nameEn: newMatNameEn.trim() || newMatName.trim(),
      category: newMatCategory,
      color: newMatColor,
      roughness: newMatRoughness,
      metalness: newMatMetalness,
      textureType: 'wood',
    };

    setMaterialsList([newMat, ...materialsList]);
    setNewMatName('');
    setNewMatNameEn('');
    alert('تم إضافة الخامة واللون بنجاح إلى الكتالوج الرئيسي!');
  };

  const handleExportCatalogJSON = () => {
    const catalogData = {
      templates: ALL_SAMPLE_PROJECTS,
      materials: materialsList,
      version: '2.0',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(catalogData, null, 2)], { type: 'application/json' });
    saveAs(blob, 'kitchan_design_catalog_master.json');
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-900 text-white overflow-hidden select-none font-sans">
      {/* Admin Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sliders size={22} />
          </div>
          <div>
            <h1 className="text-base font-black text-white">لوحة الإدارة الشاملة للكتالوج والنماذج والخامات</h1>
            <p className="text-xs text-slate-400">إدارة وتوسيع مكتبة التصاميم والوحدات المعيارية بدون تعديل الكود</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCatalogJSON}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            <Download size={14} />
            <span>تصدير الكتالوج الكامل (.json)</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-2 flex items-center gap-2">
        <button
          onClick={() => setActiveAdminTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeAdminTab === 'templates' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={15} />
          <span>إدارة القوالب والمشاريع الجاهزة</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('materials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeAdminTab === 'materials' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette size={15} />
          <span>إدارة الخامات والألوان والأسطح</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('blocks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeAdminTab === 'blocks' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Box size={15} />
          <span>إدارة وحدات البلوكات المعيارية (3D Blocks)</span>
        </button>
      </div>

      {/* Tab 1: Templates Manager */}
      {activeAdminTab === 'templates' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">
              القوالب الجاهزة المسجلة بالنظام ({ALL_SAMPLE_PROJECTS.length})
            </h2>
            <button
              onClick={() => {
                // Save current project in workspace as a template
                const newTmpl = {
                  id: `proj-custom-${Date.now()}`,
                  category: project.metadata.projectType,
                  name: `${project.metadata.name} (قالب محفوظ)`,
                  style: 'Custom Studio',
                  dimensions: `${project.room.width / 1000}m × ${project.room.length / 1000}m`,
                  cabinetCount: project.cabinets.length,
                  data: project,
                  previewThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                  tags: ['Custom', 'User Template'],
                };
                ALL_SAMPLE_PROJECTS.unshift(newTmpl);
                alert('تم حفظ مشروع ساحة العمل الحالية كقالب جديد في الكتالوج!');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              <Plus size={15} />
              <span>حفظ المشروع الحالي كقالب جاهز</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_SAMPLE_PROJECTS.map((t) => (
              <div
                key={t.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-start justify-between gap-4 group hover:border-blue-500 transition"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-blue-900/60 text-blue-300 rounded text-[10px] font-bold font-mono">
                    {t.category.toUpperCase()} • {t.style}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">{t.name}</h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {t.dimensions} | {t.cabinetCount} وحدة
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setProject(t.data);
                      setActiveTab('3d-view');
                    }}
                    className="p-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-slate-300 hover:text-white transition"
                    title="تحميل في ساحة العمل"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Materials & Colors Manager */}
      {activeAdminTab === 'materials' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add New Material Form */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Plus size={16} className="text-purple-400" />
              <span>إضافة لون أو خامة جديدة (Create New Material Finish)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">اسم اللون / الخامة (عربي)</label>
                <input
                  type="text"
                  placeholder="مثال: أزرق بترولي مطفي فاخر"
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">الاسم بالإنجليزي (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Matte Petrol Navy"
                  value={newMatNameEn}
                  onChange={(e) => setNewMatNameEn(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">كود اللون (Color Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newMatColor}
                    onChange={(e) => setNewMatColor(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-700 cursor-pointer bg-slate-900"
                  />
                  <input
                    type="text"
                    value={newMatColor}
                    onChange={(e) => setNewMatColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">تصنيف الاستخدام</label>
                <select
                  value={newMatCategory}
                  onChange={(e) => setNewMatCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="front">واجهات وضلف (Fronts)</option>
                  <option value="countertop">أسطح ورخام (Countertops)</option>
                  <option value="floor">أرضيات وباركيه (Floors)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleAddNewMaterial}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                حفظ وإضافة الخامة للكتالوج
              </button>
            </div>
          </div>

          {/* Materials Swatches Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {materialsList.map((m) => (
              <div
                key={m.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2 hover:border-purple-500 transition"
              >
                <div
                  className="w-full aspect-video rounded-xl border border-slate-700 shadow-inner"
                  style={{ backgroundColor: m.color }}
                />
                <div>
                  <div className="text-xs font-bold text-white truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{m.nameEn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: 3D Blocks Manager */}
      {activeAdminTab === 'blocks' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">
              الوحدات المعيارية المسجلة في المكتبة ({CABINET_LIBRARY.length} وحدة)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CABINET_LIBRARY.map((b, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-emerald-500 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded text-[10px] font-bold font-mono">
                    {b.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    W:{b.defaultWidth} H:{b.defaultHeight}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{b.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
