import React from 'react';
import { useUIStore } from './store/useUIStore';
import { TopNavbar } from './components/layout/TopNavbar';
import { StatusBar } from './components/layout/StatusBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { Canvas2D } from './components/planner2d/Canvas2D';
import { Canvas3D } from './components/viewer3d/Canvas3D';
import { ElevationViewer } from './components/elevations/ElevationViewer';
import { TechnicalBlueprint } from './components/technical/TechnicalBlueprint';
import { CabinetSchedule } from './components/schedule/CabinetSchedule';
import { CuttingListView } from './components/manufacturing/CuttingListView';
import { RoomConfigModal } from './components/modals/RoomConfigModal';
import { CustomCabinetModal } from './components/modals/CustomCabinetModal';
import { TemplateModal } from './components/modals/TemplateModal';
import { ExportModal } from './components/modals/ExportModal';

export const App: React.FC = () => {
  const { activeTab } = useUIStore();

  return (
    <div className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 w-full h-[calc(100vh-3.5rem-1.75rem)] overflow-hidden relative">
        {/* Left Sidebar (Only visible in 2D and 3D views) */}
        {(activeTab === '2d-plan' || activeTab === '3d-view') && <LeftSidebar />}

        {/* Center Workspace */}
        <main className="flex-1 h-full relative overflow-hidden bg-slate-950">
          {activeTab === '2d-plan' && <Canvas2D />}
          {activeTab === '3d-view' && <Canvas3D />}
          {activeTab === 'elevations' && <ElevationViewer />}
          {activeTab === 'technical-drawings' && <TechnicalBlueprint />}
          {activeTab === 'cabinet-schedule' && <CabinetSchedule />}
          {activeTab === 'manufacturing-bom' && <CuttingListView />}
        </main>

        {/* Right Sidebar (Only visible in 2D and 3D views) */}
        {(activeTab === '2d-plan' || activeTab === '3d-view') && <RightSidebar />}
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Modals */}
      <RoomConfigModal />
      <CustomCabinetModal />
      <TemplateModal />
      <ExportModal />
    </div>
  );
};

export default App;
