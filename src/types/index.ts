export type UnitType = 'mm' | 'cm';

export type CabinetCategory = 'base' | 'wall' | 'tall' | 'corner' | 'custom';

export type CabinetType = 
  | 'base-single-door'
  | 'base-double-door'
  | 'base-drawers-2'
  | 'base-drawers-3'
  | 'base-drawers-4'
  | 'base-sink'
  | 'base-corner-l'
  | 'base-corner-blind'
  | 'base-open-shelf'
  | 'wall-single-door'
  | 'wall-double-door'
  | 'wall-lift-up'
  | 'wall-open-shelf'
  | 'wall-corner'
  | 'tall-pantry'
  | 'tall-oven-tower'
  | 'tall-microwave-tower'
  | 'tall-fridge-housing'
  | 'tall-utility'
  | 'custom-box';

export type ApplianceType =
  | 'fridge-freestanding'
  | 'fridge-builtin'
  | 'cooktop-induction'
  | 'cooker-range'
  | 'oven-builtin'
  | 'microwave-builtin'
  | 'dishwasher'
  | 'washing-machine'
  | 'hood-wall'
  | 'hood-integrated'
  | 'sink-single'
  | 'sink-double';

export type ArchitecturalElementType =
  | 'door'
  | 'window'
  | 'column'
  | 'beam'
  | 'recess'
  | 'pipe';

export type DoorHinge = 'left' | 'right' | 'double' | 'top' | 'none';
export type HandleType = 'bar-black' | 'bar-brass' | 'bar-chrome' | 'edge-pull' | 'knob' | 'handleless' | 'none';

export interface CabinetItem {
  id: string; // e.g. B01, W01, T01
  name: string;
  category: CabinetCategory;
  type: CabinetType;
  // Dimensions in millimeters (mm)
  width: number;
  height: number;
  depth: number;
  // Position in millimeters (mm)
  x: number; // Center or Top-Left in 2D
  y: number; // 2D layout Y
  z: number; // Elevation from floor (0 for base/tall, e.g. 1400 for wall)
  rotation: number; // 0, 90, 180, 270 (degrees)
  wallId?: string; // e.g. 'wall-a', 'wall-b'
  
  // Cabinet internals
  shelfCount: number;
  doorCount: number;
  drawerCount: number;
  doorHinge: DoorHinge;
  hasSinkCutout?: boolean;
  hasApplianceCavity?: boolean;
  applianceCavityHeight?: number;
  applianceCavityZ?: number;
  
  // Customization & finishes
  materialFront?: string;
  materialBody?: string;
  handleType?: HandleType;
  customNotes?: string;
  isCustom?: boolean;
  
  // Door opening state (for 3D visualization)
  isOpen?: boolean;
}

export interface ApplianceItem {
  id: string; // e.g. A01
  name: string;
  type: ApplianceType;
  width: number;
  height: number;
  depth: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
  wallId?: string;
  clearanceSides?: number;
  clearanceBack?: number;
  clearanceTop?: number;
  finish?: 'stainless' | 'black' | 'white' | 'integrated';
  customNotes?: string;
}

export interface ArchitecturalElement {
  id: string;
  name: string;
  type: ArchitecturalElementType;
  x: number;
  y: number;
  z: number; // Elevation (for windows, beams)
  width: number;
  height: number;
  depth: number;
  rotation: number;
  wallId?: string;
  openingDirection?: 'inward-left' | 'inward-right' | 'outward-left' | 'outward-right' | 'sliding';
}

export interface Wall {
  id: string;
  name: string; // 'Wall A', 'Wall B', etc.
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  thickness: number; // Default 150mm
  height: number; // Default 2600mm
  color?: string;
}

export interface RoomConfig {
  shape: 'rectangular' | 'l-shape' | 'u-shape' | 'custom';
  width: number; // X span (e.g. 4000 mm)
  length: number; // Y span (e.g. 3500 mm)
  ceilingHeight: number; // Z span (e.g. 2600 mm)
  wallThickness: number; // e.g. 150 mm
  walls: Wall[];
  elements: ArchitecturalElement[];
}

export interface CountertopConfig {
  enabled: boolean;
  thickness: number; // e.g. 30 mm
  depth: number; // e.g. 620 mm
  overhangFront: number; // e.g. 20 mm
  overhangSides: number; // e.g. 10 mm
  material: string; // 'marble-carrara', 'quartz-white', etc.
  edgeProfile: 'square' | 'beveled' | 'bullnose';
}

export interface PlinthConfig {
  enabled: boolean;
  height: number; // e.g. 100 mm or 150 mm
  setback: number; // e.g. 50 mm
  material: string;
}

export interface BacksplashConfig {
  enabled: boolean;
  height: number; // e.g. 600 mm
  thickness: number; // e.g. 15 mm
  material: string;
}

export interface MaterialFinishes {
  frontFinish: string;
  frontColor: string;
  bodyColor: string;
  countertopMaterial: string;
  countertopColor: string;
  backsplashMaterial: string;
  backsplashColor: string;
  wallColor: string;
  floorMaterial: string;
  floorColor: string;
  handleStyle: HandleType;
  handleColor: string;
}

export interface ManufacturingSettings {
  boardThickness: number; // 16, 18, or 19 mm
  backPanelThickness: number; // 3, 6, or 18 mm
  backPanelRecess: number; // 10 mm
  edgeBandingFront: number; // 1 mm or 2 mm
  edgeBandingHidden: number; // 0.4 mm
  doorReveal: number; // 3 mm
  drawerSlideLoss: number; // 25 mm total
  shelfSetback: number; // 20 mm
}

export interface CuttingPanel {
  id: string;
  cabinetId: string;
  cabinetName: string;
  partName: string; // 'Left Side', 'Right Side', 'Bottom', 'Top Rail', 'Shelf', 'Door Front', 'Drawer Front', 'Back'
  quantity: number;
  length: number; // mm (Grain direction)
  width: number; // mm
  thickness: number; // mm
  material: string;
  edgeBanding: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
  notes?: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  category: 'hinge' | 'slide' | 'handle' | 'leg' | 'bracket' | 'screw' | 'shelf-pin';
  quantity: number;
  unit: string;
  description: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  clientName: string;
  designerName: string;
  date: string;
  notes: string;
  unit: UnitType;
}

export interface ProjectData {
  metadata: ProjectMetadata;
  room: RoomConfig;
  cabinets: CabinetItem[];
  appliances: ApplianceItem[];
  architecturalElements: ArchitecturalElement[];
  countertop: CountertopConfig;
  plinth: PlinthConfig;
  backsplash: BacksplashConfig;
  materials: MaterialFinishes;
  manufacturing: ManufacturingSettings;
}

export type ActiveTab = 
  | '2d-plan' 
  | '3d-view' 
  | 'elevations' 
  | 'technical-drawings' 
  | 'cabinet-schedule' 
  | 'manufacturing-bom' 
  | 'export-package';
