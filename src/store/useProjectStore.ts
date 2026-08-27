import { create } from 'zustand';
import { 
  ProjectData, 
  CabinetItem, 
  ApplianceItem, 
  ArchitecturalElement, 
  Wall, 
  CountertopConfig, 
  PlinthConfig, 
  BacksplashConfig, 
  MaterialFinishes, 
  ManufacturingSettings, 
  PricingSettings,
  ProjectType,
  MaterialSystemType
} from '../types';
import { 
  DEFAULT_MANUFACTURING_SETTINGS, 
  DEFAULT_COUNTERTOP_CONFIG, 
  DEFAULT_PLINTH_CONFIG, 
  DEFAULT_BACKSPLASH_CONFIG, 
  DEFAULT_MATERIAL_FINISHES,
  DEFAULT_PRICING_SETTINGS
} from '../constants/standards';
import { SAMPLE_PROJECT_MODERN_L } from '../constants/sampleProjects';

interface ProjectState {
  project: ProjectData;
  history: ProjectData[];
  future: ProjectData[];
  canUndo: boolean;
  canRedo: boolean;

  // Selected Object in 2D / 3D Canvas
  selectedId: string | null;
  selectedType: 'cabinet' | 'appliance' | 'element' | null;

  // Actions
  setSelected: (id: string | null, type: 'cabinet' | 'appliance' | 'element' | null) => void;
  clearSelection: () => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  setProject: (project: ProjectData) => void;
  updateMetadata: (meta: Partial<ProjectData['metadata']>) => void;
  resetProject: () => void;
  loadSampleProject: (template?: ProjectData) => void;

  // Room
  updateRoomDimensions: (width: number, length: number, ceilingHeight: number, wallThickness?: number) => void;

  // Cabinets CRUD
  addCabinet: (cabinet: Omit<CabinetItem, 'id'> & { id?: string }) => CabinetItem;
  updateCabinet: (id: string, data: Partial<CabinetItem>) => void;
  removeCabinet: (id: string) => void;
  duplicateCabinet: (id: string) => CabinetItem | null;
  rotateCabinet: (id: string, angleDelta?: number) => void;

  // Appliances CRUD
  addAppliance: (appliance: Omit<ApplianceItem, 'id'> & { id?: string }) => ApplianceItem;
  updateAppliance: (id: string, data: Partial<ApplianceItem>) => void;
  removeAppliance: (id: string) => void;
  duplicateAppliance: (id: string) => ApplianceItem | null;
  rotateAppliance: (id: string, angleDelta?: number) => void;

  // Architectural Elements
  addElement: (element: Omit<ArchitecturalElement, 'id'> & { id?: string }) => ArchitecturalElement;
  updateElement: (id: string, data: Partial<ArchitecturalElement>) => void;
  removeElement: (id: string) => void;

  // Global Configs
  updateCountertop: (data: Partial<CountertopConfig>) => void;
  updatePlinth: (data: Partial<PlinthConfig>) => void;
  updateBacksplash: (data: Partial<BacksplashConfig>) => void;
  updateMaterials: (data: Partial<MaterialFinishes>) => void;
  updateManufacturing: (data: Partial<ManufacturingSettings>) => void;
  updateProjectPricing: (data: Partial<PricingSettings>) => void;

  // Auto ID Generators
  getNextCabinetId: (category: CabinetItem['category']) => string;
  getNextApplianceId: () => string;
  getNextElementId: (type: ArchitecturalElement['type']) => string;
}

const STORAGE_KEY = 'kitchan_cad_project_v2';

function loadInitialProject(): ProjectData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.metadata && parsed.room && parsed.cabinets) {
        if (!parsed.pricing) parsed.pricing = DEFAULT_PRICING_SETTINGS;
        if (!parsed.architecturalElements || parsed.architecturalElements.length === 0) {
          parsed.architecturalElements = parsed.room.elements || [];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load project from localStorage:', e);
  }
  return SAMPLE_PROJECT_MODERN_L;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: loadInitialProject(),
  history: [],
  future: [],
  canUndo: false,
  canRedo: false,

  selectedId: null,
  selectedType: null,

  setSelected: (id, type) => set({ selectedId: id, selectedType: type }),
  clearSelection: () => set({ selectedId: null, selectedType: null }),

  pushHistory: () => {
    const current = get().project;
    set((state) => {
      const newHistory = [...state.history.slice(-25), JSON.parse(JSON.stringify(current))];
      return {
        history: newHistory,
        future: [],
        canUndo: newHistory.length > 0,
        canRedo: false,
      };
    });
  },

  undo: () => {
    const { history, project, future } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const newFuture = [JSON.parse(JSON.stringify(project)), ...future];

    set({
      project: previous,
      history: newHistory,
      future: newFuture,
      canUndo: newHistory.length > 0,
      canRedo: true,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(previous));
  },

  redo: () => {
    const { history, project, future } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);
    const newHistory = [...history, JSON.parse(JSON.stringify(project))];

    set({
      project: next,
      history: newHistory,
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  setProject: (project) => {
    get().pushHistory();
    if (!project.pricing) project.pricing = DEFAULT_PRICING_SETTINGS;
    if (!project.architecturalElements || project.architecturalElements.length === 0) {
      project.architecturalElements = project.room.elements || [];
    }
    project.room.elements = project.architecturalElements;
    set({ project });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  },

  updateMetadata: (meta) => {
    set((state) => {
      const updated = {
        ...state.project,
        metadata: { ...state.project.metadata, ...meta },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  resetProject: () => {
    get().pushHistory();
    const blank: ProjectData = {
      metadata: {
        id: `proj-${Date.now()}`,
        name: 'تصميم مطبخ جديد',
        projectType: 'kitchen',
        materialSystem: 'wood',
        clientName: '',
        designerName: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        unit: 'cm',
      },
      room: {
        shape: 'rectangular',
        width: 4000,
        length: 3000,
        ceilingHeight: 2600,
        wallThickness: 150,
        walls: [
          { id: 'wall-a', name: 'الجدار أ (الخلفي)', startX: 0, startY: 0, endX: 4000, endY: 0, thickness: 150, height: 2600 },
          { id: 'wall-b', name: 'الجدار ب (الأيمن)', startX: 4000, startY: 0, endX: 4000, endY: 3000, thickness: 150, height: 2600 },
          { id: 'wall-c', name: 'الجدار ج (الأمامي)', startX: 4000, startY: 3000, endX: 0, endY: 3000, thickness: 150, height: 2600 },
          { id: 'wall-d', name: 'الجدار د (الأيسر)', startX: 0, startY: 3000, endX: 0, endY: 0, thickness: 150, height: 2600 },
        ],
        elements: [],
      },
      cabinets: [],
      appliances: [],
      architecturalElements: [],
      countertop: DEFAULT_COUNTERTOP_CONFIG,
      plinth: DEFAULT_PLINTH_CONFIG,
      backsplash: DEFAULT_BACKSPLASH_CONFIG,
      materials: DEFAULT_MATERIAL_FINISHES,
      manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
      pricing: DEFAULT_PRICING_SETTINGS,
    };
    set({ project: blank, selectedId: null, selectedType: null });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blank));
  },

  loadSampleProject: (template = SAMPLE_PROJECT_MODERN_L) => {
    get().pushHistory();
    const cloned = JSON.parse(JSON.stringify(template));
    if (!cloned.architecturalElements || cloned.architecturalElements.length === 0) {
      cloned.architecturalElements = cloned.room?.elements || [];
    }
    if (cloned.room) {
      cloned.room.elements = cloned.architecturalElements;
    }
    set({ project: cloned, selectedId: null, selectedType: null });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cloned));
  },

  updateRoomDimensions: (width, length, ceilingHeight, wallThickness = 150) => {
    get().pushHistory();
    set((state) => {
      const walls: Wall[] = [
        { id: 'wall-a', name: 'الجدار أ (الخلفي)', startX: 0, startY: 0, endX: width, endY: 0, thickness: wallThickness, height: ceilingHeight },
        { id: 'wall-b', name: 'الجدار ب (الأيمن)', startX: width, startY: 0, endX: width, endY: length, thickness: wallThickness, height: ceilingHeight },
        { id: 'wall-c', name: 'الجدار ج (الأمامي)', startX: width, startY: length, endX: 0, endY: length, thickness: wallThickness, height: ceilingHeight },
        { id: 'wall-d', name: 'الجدار د (الأيسر)', startX: 0, startY: length, endX: 0, endY: 0, thickness: wallThickness, height: ceilingHeight },
      ];

      const updated = {
        ...state.project,
        room: {
          ...state.project.room,
          width,
          length,
          ceilingHeight,
          wallThickness,
          walls,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  // --- Cabinets CRUD ---
  addCabinet: (cabData) => {
    get().pushHistory();
    const id = cabData.id || get().getNextCabinetId(cabData.category);
    const newCabinet: CabinetItem = {
      ...cabData,
      id,
    };

    set((state) => {
      const updatedCabinets = [...state.project.cabinets, newCabinet];
      const updated = { ...state.project, cabinets: updatedCabinets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated, selectedId: id, selectedType: 'cabinet' };
    });

    return newCabinet;
  },

  updateCabinet: (id, data) => {
    set((state) => {
      const updatedCabinets = state.project.cabinets.map((c) => (c.id === id ? { ...c, ...data } : c));
      const updated = { ...state.project, cabinets: updatedCabinets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  removeCabinet: (id) => {
    get().pushHistory();
    set((state) => {
      const updatedCabinets = state.project.cabinets.filter((c) => c.id !== id);
      const updated = { ...state.project, cabinets: updatedCabinets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return {
        project: updated,
        selectedId: state.selectedId === id ? null : state.selectedId,
        selectedType: state.selectedId === id ? null : state.selectedType,
      };
    });
  },

  duplicateCabinet: (id) => {
    const cabinet = get().project.cabinets.find((c) => c.id === id);
    if (!cabinet) return null;
    get().pushHistory();

    const newId = get().getNextCabinetId(cabinet.category);
    const duplicated: CabinetItem = {
      ...cabinet,
      id: newId,
      name: `${cabinet.name} (نسخة)`,
      x: cabinet.x + 100,
      y: cabinet.y + 50,
    };

    set((state) => {
      const updated = { ...state.project, cabinets: [...state.project.cabinets, duplicated] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated, selectedId: newId, selectedType: 'cabinet' };
    });

    return duplicated;
  },

  rotateCabinet: (id, angleDelta = 90) => {
    get().pushHistory();
    set((state) => {
      const updatedCabinets = state.project.cabinets.map((c) => {
        if (c.id !== id) return c;
        const newRot = (c.rotation + angleDelta) % 360;
        return { ...c, rotation: newRot };
      });
      const updated = { ...state.project, cabinets: updatedCabinets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  // --- Appliances CRUD ---
  addAppliance: (appData) => {
    get().pushHistory();
    const id = appData.id || get().getNextApplianceId();
    const newApp: ApplianceItem = {
      ...appData,
      id,
    };

    set((state) => {
      const updatedAppliances = [...state.project.appliances, newApp];
      const updated = { ...state.project, appliances: updatedAppliances };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated, selectedId: id, selectedType: 'appliance' };
    });

    return newApp;
  },

  updateAppliance: (id, data) => {
    set((state) => {
      const updatedAppliances = state.project.appliances.map((a) => (a.id === id ? { ...a, ...data } : a));
      const updated = { ...state.project, appliances: updatedAppliances };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  removeAppliance: (id) => {
    get().pushHistory();
    set((state) => {
      const updatedAppliances = state.project.appliances.filter((a) => a.id !== id);
      const updated = { ...state.project, appliances: updatedAppliances };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return {
        project: updated,
        selectedId: state.selectedId === id ? null : state.selectedId,
        selectedType: state.selectedId === id ? null : state.selectedType,
      };
    });
  },

  duplicateAppliance: (id) => {
    const app = get().project.appliances.find((a) => a.id === id);
    if (!app) return null;
    get().pushHistory();

    const newId = get().getNextApplianceId();
    const duplicated: ApplianceItem = {
      ...app,
      id: newId,
      name: `${app.name} (نسخة)`,
      x: app.x + 100,
      y: app.y + 50,
    };

    set((state) => {
      const updated = { ...state.project, appliances: [...state.project.appliances, duplicated] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated, selectedId: newId, selectedType: 'appliance' };
    });

    return duplicated;
  },

  rotateAppliance: (id, angleDelta = 90) => {
    get().pushHistory();
    set((state) => {
      const updatedAppliances = state.project.appliances.map((a) => {
        if (a.id !== id) return a;
        const newRot = (a.rotation + angleDelta) % 360;
        return { ...a, rotation: newRot };
      });
      const updated = { ...state.project, appliances: updatedAppliances };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  // --- Architectural Elements (Doors, Windows, Columns, Beams, Pipes) ---
  addElement: (elData) => {
    get().pushHistory();
    const id = elData.id || get().getNextElementId(elData.type);
    const newEl: ArchitecturalElement = {
      ...elData,
      id,
    };

    set((state) => {
      const updatedElements = [...state.project.architecturalElements, newEl];
      const updated = { 
        ...state.project, 
        architecturalElements: updatedElements,
        room: {
          ...state.project.room,
          elements: updatedElements
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated, selectedId: id, selectedType: 'element' };
    });

    return newEl;
  },

  updateElement: (id, data) => {
    set((state) => {
      const updatedElements = state.project.architecturalElements.map((e) => (e.id === id ? { ...e, ...data } : e));
      const updated = { 
        ...state.project, 
        architecturalElements: updatedElements,
        room: {
          ...state.project.room,
          elements: updatedElements
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  removeElement: (id) => {
    get().pushHistory();
    set((state) => {
      const updatedElements = state.project.architecturalElements.filter((e) => e.id !== id);
      const updated = { 
        ...state.project, 
        architecturalElements: updatedElements,
        room: {
          ...state.project.room,
          elements: updatedElements
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return {
        project: updated,
        selectedId: state.selectedId === id ? null : state.selectedId,
        selectedType: state.selectedId === id ? null : state.selectedType,
      };
    });
  },

  updateCountertop: (data) => {
    set((state) => {
      const updated = {
        ...state.project,
        countertop: { ...state.project.countertop, ...data },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  updatePlinth: (data) => {
    set((state) => {
      const updated = {
        ...state.project,
        plinth: { ...state.project.plinth, ...data },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  updateBacksplash: (data) => {
    set((state) => {
      const updated = {
        ...state.project,
        backsplash: { ...state.project.backsplash, ...data },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  updateMaterials: (data) => {
    set((state) => {
      const updated = {
        ...state.project,
        materials: { ...state.project.materials, ...data },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  updateManufacturing: (data) => {
    set((state) => {
      const updated = {
        ...state.project,
        manufacturing: { ...state.project.manufacturing, ...data },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  updateProjectPricing: (data) => {
    set((state) => {
      const updated = {
        ...state.project,
        pricing: { ...state.project.pricing, ...data },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { project: updated };
    });
  },

  getNextCabinetId: (category) => {
    const cabs = get().project.cabinets;
    let prefix = 'B';
    if (category === 'wall') prefix = 'W';
    if (category === 'tall') prefix = 'T';
    if (category === 'corner') prefix = 'C';
    if (category === 'wardrobe' || category === 'closet-internals') prefix = 'WD';
    if (category === 'bed' || category === 'nightstand' || category === 'dresser') prefix = 'BD';
    if (category === 'library-full' || category === 'bookshelf' || category === 'tv-media') prefix = 'LIB';

    const matching = cabs.filter((c) => c.id.startsWith(prefix));
    const nextNum = matching.length + 1;
    return `${prefix}${nextNum.toString().padStart(2, '0')}`;
  },

  getNextApplianceId: () => {
    const apps = get().project.appliances;
    return `A${(apps.length + 1).toString().padStart(2, '0')}`;
  },

  getNextElementId: (type) => {
    const els = get().project.architecturalElements;
    let prefix = 'E';
    if (type === 'door') prefix = 'DR';
    if (type === 'window') prefix = 'WN';
    if (type === 'column') prefix = 'COL';
    if (type === 'beam') prefix = 'BM';
    if (type === 'pipe') prefix = 'PIP';

    const matching = els.filter((e) => e.id.startsWith(prefix));
    return `${prefix}${(matching.length + 1).toString().padStart(2, '0')}`;
  },
}));
