import { create } from 'zustand';
import { ActiveTab, UnitType } from '../types';
import { Language } from '../utils/i18n';

interface UIState {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;

  unit: UnitType;
  setUnit: (unit: UnitType) => void;
  toggleUnit: () => void;

  // 2D Controls
  zoom2D: number;
  setZoom2D: (zoom: number | ((prev: number) => number)) => void;
  pan2D: { x: number; y: number };
  setPan2D: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetView2D: () => void;

  // Snapping & Guides
  snapToGridEnabled: boolean;
  setSnapToGridEnabled: (enabled: boolean) => void;
  gridSize: number; // in mm
  setGridSize: (size: number) => void;
  snapToWallEnabled: boolean;
  setSnapToWallEnabled: (enabled: boolean) => void;
  snapToCabinetEnabled: boolean;
  setSnapToCabinetEnabled: (enabled: boolean) => void;

  // Overlays & Visual toggles
  showDimensions2D: boolean;
  setShowDimensions2D: (show: boolean) => void;
  showAisleClearance: boolean;
  setShowAisleClearance: (show: boolean) => void;
  showCabinetLabels: boolean;
  setShowCabinetLabels: (show: boolean) => void;
  showWallDimensions: boolean;
  setShowWallDimensions: (show: boolean) => void;

  // 3D Visual Controls
  openDoors3D: boolean;
  setOpenDoors3D: (open: boolean) => void;
  toggleOpenDoors3D: () => void;
  viewAngle3D: 'perspective' | 'top' | 'front' | 'isometric' | 'left' | 'right';
  setViewAngle3D: (angle: 'perspective' | 'top' | 'front' | 'isometric' | 'left' | 'right') => void;
  showDimensions3D: boolean;
  setShowDimensions3D: (show: boolean) => void;

  // Elevation View
  selectedElevationWallId: string;
  setSelectedElevationWallId: (wallId: string) => void;

  // Modals
  isRoomModalOpen: boolean;
  setIsRoomModalOpen: (open: boolean) => void;
  isRoomSketcherOpen: boolean;
  setIsRoomSketcherOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isCustomCabinetModalOpen: boolean;
  setIsCustomCabinetModalOpen: (open: boolean) => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (open: boolean) => void;
}

const savedLang = (localStorage.getItem('kitchan_lang') as Language) || 'ar';
if (typeof document !== 'undefined') {
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = savedLang;
}

export const useUIStore = create<UIState>((set) => ({
  // Default to Dashboard immediately after login
  activeTab: 'dashboard',
  setActiveTab: (activeTab) => set({ activeTab }),

  language: savedLang,
  setLanguage: (language) => {
    localStorage.setItem('kitchan_lang', language);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
    set({ language });
  },
  toggleLanguage: () => {
    set((state) => {
      const nextLang = state.language === 'en' ? 'ar' : 'en';
      localStorage.setItem('kitchan_lang', nextLang);
      if (typeof document !== 'undefined') {
        document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = nextLang;
      }
      return { language: nextLang };
    });
  },

  unit: 'cm',
  setUnit: (unit) => set({ unit }),
  toggleUnit: () => set((state) => ({ unit: state.unit === 'mm' ? 'cm' : 'mm' })),

  zoom2D: 0.22,
  setZoom2D: (zoom) => set((state) => ({
    zoom2D: typeof zoom === 'function' ? zoom(state.zoom2D) : zoom,
  })),
  pan2D: { x: 140, y: 110 },
  setPan2D: (pan) => set((state) => ({
    pan2D: typeof pan === 'function' ? pan(state.pan2D) : pan,
  })),
  resetView2D: () => set({ zoom2D: 0.22, pan2D: { x: 140, y: 110 } }),

  snapToGridEnabled: true,
  setSnapToGridEnabled: (snapToGridEnabled) => set({ snapToGridEnabled }),
  gridSize: 50,
  setGridSize: (gridSize) => set({ gridSize }),
  snapToWallEnabled: true,
  setSnapToWallEnabled: (snapToWallEnabled) => set({ snapToWallEnabled }),
  snapToCabinetEnabled: true,
  setSnapToCabinetEnabled: (snapToCabinetEnabled) => set({ snapToCabinetEnabled }),

  showDimensions2D: true,
  setShowDimensions2D: (showDimensions2D) => set({ showDimensions2D }),
  showAisleClearance: true,
  setShowAisleClearance: (showAisleClearance) => set({ showAisleClearance }),
  showCabinetLabels: true,
  setShowCabinetLabels: (showCabinetLabels) => set({ showCabinetLabels }),
  showWallDimensions: true,
  setShowWallDimensions: (showWallDimensions) => set({ showWallDimensions }),

  openDoors3D: false,
  setOpenDoors3D: (openDoors3D) => set({ openDoors3D }),
  toggleOpenDoors3D: () => set((state) => ({ openDoors3D: !state.openDoors3D })),
  viewAngle3D: 'perspective',
  setViewAngle3D: (viewAngle3D) => set({ viewAngle3D }),
  showDimensions3D: false,
  setShowDimensions3D: (showDimensions3D) => set({ showDimensions3D }),

  selectedElevationWallId: 'wall-a',
  setSelectedElevationWallId: (selectedElevationWallId) => set({ selectedElevationWallId }),

  isRoomModalOpen: false,
  setIsRoomModalOpen: (isRoomModalOpen) => set({ isRoomModalOpen }),
  isRoomSketcherOpen: false,
  setIsRoomSketcherOpen: (isRoomSketcherOpen) => set({ isRoomSketcherOpen }),
  isExportModalOpen: false,
  setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
  isCustomCabinetModalOpen: false,
  setIsCustomCabinetModalOpen: (isCustomCabinetModalOpen) => set({ isCustomCabinetModalOpen }),
  isTemplateModalOpen: false,
  setIsTemplateModalOpen: (isTemplateModalOpen) => set({ isTemplateModalOpen }),
}));
