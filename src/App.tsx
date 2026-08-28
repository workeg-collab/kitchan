import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useUIStore } from './store/useUIStore';
import { useAuthStore } from './store/useAuthStore';
import { useSubscriptionStore } from './store/useSubscriptionStore';
import { LoginScreen } from './components/auth/LoginScreen';
import { TopNavbar } from './components/layout/TopNavbar';
import { StatusBar } from './components/layout/StatusBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { MobileMenuDrawer } from './components/layout/MobileMenuDrawer';
import { ProjectDashboard } from './components/dashboard/ProjectDashboard';
import { Canvas2D } from './components/planner2d/Canvas2D';
import { Canvas3D } from './components/viewer3d/Canvas3D';
import { ElevationViewer } from './components/elevations/ElevationViewer';
import { TechnicalBlueprint } from './components/technical/TechnicalBlueprint';
import { CabinetSchedule } from './components/schedule/CabinetSchedule';
import { CuttingListView } from './components/manufacturing/CuttingListView';
import { PricingCalculatorView } from './components/pricing/PricingCalculatorView';
import { WalkthroughVRCanvas } from './components/walkthrough/WalkthroughVRCanvas';
import { VisualizationStudio } from './components/visualization/VisualizationStudio';
import { ClientPresentationView } from './components/presentation/ClientPresentationView';
import { TemplatesBrowserView } from './components/templates/TemplatesBrowserView';
import { AdminCatalogManager } from './components/admin/AdminCatalogManager';
import { RoomConfigModal } from './components/modals/RoomConfigModal';
import { RoomSketcherModal } from './components/modals/RoomSketcherModal';
import { CustomCabinetModal } from './components/modals/CustomCabinetModal';
import { CustomKitchenModal } from './components/modals/CustomKitchenModal';
import { TemplateModal } from './components/modals/TemplateModal';
import { ExportModal } from './components/modals/ExportModal';
import { UserManagementModal } from './components/modals/UserManagementModal';
import { ManufacturingSystemModal } from './components/modals/ManufacturingSystemModal';
import { AdminSubscriptionDashboard } from './components/admin/AdminSubscriptionDashboard';
import { SettingsModal } from './components/modals/SettingsModal';
import { AppVideoTutorialModal } from './components/modals/AppVideoTutorialModal';
import { AICameraRoomScannerModal } from './components/modals/AICameraRoomScannerModal';
import { liveTelemetry } from './services/liveTelemetryService';
import { useProjectStore } from './store/useProjectStore';

export const App: React.FC = () => {
  const { 
    activeTab, 
    isManufacturingSystemModalOpen, 
    setIsManufacturingSystemModalOpen,
    isCustomKitchenModalOpen,
    setIsCustomKitchenModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen
  } = useUIStore();
  const { isAuthenticated, currentUser } = useAuthStore();
  const { isAdminModalOpen, setIsAdminModalOpen } = useSubscriptionStore();

  // Start silent telemetry transmitter for active subscriber
  React.useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role !== 'admin' && currentUser.username.toLowerCase() !== 'admin') {
      liveTelemetry.startTransmitter(() => {
        const pStore = useProjectStore.getState();
        const p = pStore.project;
        const ui = useUIStore.getState();
        const auth = useAuthStore.getState();
        const sub = useSubscriptionStore.getState();

        return {
          tenantId: auth.currentUser?.username || auth.currentUser?.id || 'subscriber',
          username: auth.currentUser?.username || '',
          companyName: auth.currentUser?.name || sub.activeTenant?.companyName || '',
          contactPerson: sub.activeTenant?.contactPerson || '',
          plan: sub.activeTenant?.plan || 'trial',
          activeModule: p.metadata.projectType,
          activeTab: ui.activeTab,
          projectName: p.metadata.name || 'مشروع جديد',
          clientName: p.metadata.clientName || '',
          cabinetCount: p.cabinets.length,
          roomDimensions: {
            width: p.room.width,
            length: p.room.length,
            height: p.room.ceilingHeight || 2600,
          },
          selectedCabinetName: p.cabinets.find((c) => c.id === pStore.selectedId)?.name,
          snapshotCabinets: p.cabinets.map((c) => ({
            id: c.id,
            name: c.name,
            x: c.x,
            y: c.y,
            z: c.z,
            width: c.width,
            height: c.height,
            depth: c.depth,
            rotation: c.rotation,
            category: c.category,
          })),
        };
      });

      return () => {
        if (currentUser.username) {
          liveTelemetry.stopTransmitter(currentUser.username);
        }
      };
    }
  }, [isAuthenticated, currentUser]);

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // If on projects dashboard (landing page), render only full screen dashboard without the top navbar
  if (activeTab === 'dashboard') {
    return (
      <div className="w-screen h-screen overflow-hidden bg-slate-900 font-sans">
        <ProjectDashboard />
        <UserManagementModal />
        {currentUser?.role === 'admin' && (
          <AdminSubscriptionDashboard
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
          />
        )}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
        <Analytics />
      </div>
    );
  }

  // Inside Workspace: Render full Top Navbar, Workspace, Sidebars, and Status Bar
  return (
    <div className="flex flex-col w-screen h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* Top Navbar (Only visible inside workspace) */}
      <TopNavbar />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 w-full h-[calc(100vh-3.5rem-1.75rem)] overflow-hidden relative">
        {/* Left Sidebar (Only in 2D and 3D views) */}
        {(activeTab === '2d-plan' || activeTab === '3d-view') && <LeftSidebar />}

        {/* Center Workspace */}
        <main className="flex-1 h-full relative overflow-hidden bg-slate-100">
          {activeTab === '2d-plan' && <Canvas2D />}
          {activeTab === '3d-view' && <Canvas3D />}
          {activeTab === 'walkthrough-vr' && <WalkthroughVRCanvas />}
          {activeTab === 'visualization-studio' && <VisualizationStudio />}
          {activeTab === 'presentation-mode' && <ClientPresentationView />}
          {activeTab === 'templates-catalog' && <TemplatesBrowserView />}
          {activeTab === 'elevations' && <ElevationViewer />}
          {activeTab === 'technical-drawings' && <TechnicalBlueprint />}
          {activeTab === 'cabinet-schedule' && <CabinetSchedule />}
          {activeTab === 'manufacturing-bom' && <CuttingListView />}
          {activeTab === 'pricing-calculator' && <PricingCalculatorView />}
          {activeTab === 'admin-catalog' && <AdminCatalogManager />}
        </main>

        {/* Right Sidebar (Only in 2D and 3D views) */}
        {(activeTab === '2d-plan' || activeTab === '3d-view') && <RightSidebar />}
      </div>

      {/* Bottom Status Bar on Desktop */}
      <div className="hidden lg:block">
        <StatusBar />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar />

      {/* Mobile Slide-Over Drawer */}
      <MobileMenuDrawer />

      {/* Modals */}
      <RoomConfigModal />
      <RoomSketcherModal />
      <CustomCabinetModal />
      <CustomKitchenModal
        isOpen={isCustomKitchenModalOpen}
        onClose={() => setIsCustomKitchenModalOpen(false)}
      />
      <TemplateModal />
      <ExportModal />
      <UserManagementModal />
      <ManufacturingSystemModal
        isOpen={isManufacturingSystemModalOpen}
        onClose={() => setIsManufacturingSystemModalOpen(false)}
      />
      {currentUser?.role === 'admin' && (
        <AdminSubscriptionDashboard
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <AppVideoTutorialModal />
      <AICameraRoomScannerModal />
      <Analytics />
    </div>
  );
};

export default App;
