import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useProjectStore } from '../../store/useProjectStore';
import { 
  Compass, 
  Box, 
  Layers, 
  Calculator, 
  Menu, 
  Plus, 
  Camera, 
  Shirt, 
  BedDouble, 
  BookOpen
} from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeLeftCategory, 
    toggleLeftCategory, 
    setIsMobileMenuOpen,
    setIsCameraScannerOpen
  } = useUIStore();

  const { project } = useProjectStore();
  const projectType = project.metadata.projectType || 'kitchen';

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl py-1 px-3 flex items-center justify-around font-sans select-none safe-area-pb">
      {/* 1. 2D Plan */}
      <button
        onClick={() => setActiveTab('2d-plan')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[56px] ${
          activeTab === '2d-plan'
            ? 'text-blue-600 font-black'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <div className={`p-1 rounded-xl transition ${activeTab === '2d-plan' ? 'bg-blue-50 shadow-xs' : ''}`}>
          <Compass size={20} />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">مخطط 2D</span>
      </button>

      {/* 2. 3D View */}
      <button
        onClick={() => setActiveTab('3d-view')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[56px] ${
          activeTab === '3d-view'
            ? 'text-purple-600 font-black'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <div className={`p-1 rounded-xl transition ${activeTab === '3d-view' ? 'bg-purple-50 shadow-xs' : ''}`}>
          <Box size={20} />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">منظور 3D</span>
      </button>

      {/* 3. Center Special Action: Camera Scanner 📷 or Catalog */}
      <button
        onClick={() => {
          if (activeTab === '2d-plan' || activeTab === '3d-view') {
            toggleLeftCategory('cabinets');
          } else {
            setActiveTab('2d-plan');
            toggleLeftCategory('cabinets');
          }
        }}
        className={`flex flex-col items-center justify-center -mt-4 p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 border-2 border-white transition transform active:scale-95`}
        title="إضافة وتصفح الكبائن والوحدات"
      >
        <Plus size={22} strokeWidth={2.5} />
        <span className="text-[9px] font-bold mt-0.5 leading-none">
          {projectType === 'dressing' ? 'الخزائن' : projectType === 'bedroom' ? 'السرائر' : projectType === 'library' ? 'المكتبات' : 'الكبائن'}
        </span>
      </button>

      {/* 4. Pricing / Costing */}
      <button
        onClick={() => setActiveTab('pricing-calculator')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[56px] ${
          activeTab === 'pricing-calculator'
            ? 'text-emerald-600 font-black'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <div className={`p-1 rounded-xl transition ${activeTab === 'pricing-calculator' ? 'bg-emerald-50 shadow-xs' : ''}`}>
          <Calculator size={20} />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">الأسعار</span>
      </button>

      {/* 5. More Menu (Opens Mobile Drawer) */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[56px] text-slate-500 hover:text-slate-900 font-medium"
      >
        <div className="p-1 rounded-xl">
          <Menu size={20} />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">القائمة</span>
      </button>
    </nav>
  );
};
