import { 
  MaterialSystemType, 
  AluminiumProfileSector, 
  ProfileCutPiece, 
  InfillSheetPiece, 
  BarNestingAllocation, 
  SheetNestingAllocation, 
  ManufacturingSystemTemplate, 
  CompleteManufacturingPackage 
} from './manufacturingSystems';

export * from './manufacturingSystems';

export type UnitType = 'mm' | 'cm';

export type ProjectType = 'kitchen' | 'dressing' | 'bedroom' | 'library';

export type CabinetCategory = 'base' | 'wall' | 'tall' | 'corner' | 'custom';

// Dressing / Wardrobe Types
export type WardrobeCategory = 'wardrobe' | 'closet-internals' | 'accessories' | 'custom';
export type WardrobeDoorType = 'hinged' | 'sliding' | 'folding' | 'open';

// Bedroom Types
export type BedroomCategory = 'bed' | 'nightstand' | 'dresser' | 'tv-unit' | 'bench' | 'custom';
export type BedType = 'single' | 'double' | 'queen' | 'king' | 'storage-hydraulic' | 'platform' | 'upholstered' | 'wooden';

// Library Types
export type LibraryCategory = 'library-full' | 'bookshelf' | 'tv-media' | 'display' | 'floating' | 'custom';

export type FurnitureCategory = CabinetCategory | WardrobeCategory | BedroomCategory | LibraryCategory;

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
  | 'base-spice-pullout'
  | 'base-trash-pullout'
  | 'base-gola-l'
  | 'base-island-cabinet'
  | 'base-magic-corner'
  | 'base-carousel-corner'
  | 'wall-single-door'
  | 'wall-double-door'
  | 'wall-lift-up'
  | 'wall-open-shelf'
  | 'wall-open-shelves'
  | 'wall-corner'
  | 'wall-aventos-bi-fold'
  | 'wall-aventos-hf'
  | 'wall-glass-vitrine'
  | 'wall-loft-lift-up'
  | 'wall-loft-deep'
  | 'tall-pantry'
  | 'tall-pantry-pullout'
  | 'tall-cleaning-cabinet'
  | 'tall-oven-tower'
  | 'tall-microwave-tower'
  | 'tall-fridge-housing'
  | 'tall-utility'
  | 'custom-box'
  // Wardrobe / Dressing types
  | 'wardrobe-hinged-2d'
  | 'wardrobe-hinged-3d'
  | 'wardrobe-sliding-2d'
  | 'wardrobe-sliding-3d'
  | 'wardrobe-walkin-open'
  | 'wardrobe-corner-l'
  | 'wardrobe-hanging-long'
  | 'wardrobe-hanging-double'
  | 'wardrobe-shelves-drawers'
  | 'wardrobe-shoe-rack'
  | 'wardrobe-jewelry-vanity'
  | 'wardrobe-trouser-rack'
  | 'wardrobe-laundry-hamper'
  | 'wardrobe-bags-vitrine'
  | 'wardrobe-glass-doors'
  // Bedroom types
  | 'bed-single'
  | 'bed-double'
  | 'bed-queen'
  | 'bed-king'
  | 'bed-storage-hydraulic'
  | 'bedroom-nightstand'
  | 'bedroom-dresser-mirror'
  | 'bedroom-tv-credenza'
  | 'bedroom-bench-ottoman'
  // Library types
  | 'library-full-wall'
  | 'library-bookshelf-open'
  | 'library-bookshelf-doors'
  | 'library-tv-center'
  | 'library-display-glass'
  | 'library-floating-shelves';

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
  | 'sink-double'
  | 'tv-screen'
  | 'soundbar'
  | 'led-strip';

export type ArchitecturalElementType =
  | 'door'
  | 'window'
  | 'column'
  | 'beam'
  | 'recess'
  | 'pipe';

export type DoorHinge = 'left' | 'right' | 'double' | 'top' | 'sliding' | 'folding' | 'none';
export type HandleType = 'bar-black' | 'bar-brass' | 'bar-chrome' | 'edge-pull' | 'knob' | 'handleless' | 'none';

export interface CabinetItem {
  id: string; // e.g. B01, W01, T01, WD01, BD01, LIB01
  name: string;
  category: FurnitureCategory;
  type: CabinetType;
  projectType?: ProjectType;
  materialSystemOverride?: MaterialSystemType; // Override global project material
  width: number;
  height: number;
  depth: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
  wallId?: string;
  shelfCount: number;
  doorCount: number;
  drawerCount: number;
  doorHinge: DoorHinge;
  doorType?: WardrobeDoorType;

  // Kitchen Specific
  hasSinkCutout?: boolean;
  hasApplianceCavity?: boolean;
  applianceCavityHeight?: number;
  applianceCavityZ?: number;
  isCeilingUnit?: boolean;
  flipUpDoor?: boolean;

  // Dressing Specific
  hasHangingRail?: boolean;
  hangingRailCount?: number;
  hasShoeShelves?: boolean;
  hasJewelryDrawer?: boolean;
  hasTrouserRack?: boolean;
  hasLaundryBasket?: boolean;
  slidingTracksCount?: number;

  // Bedroom Specific
  bedSize?: 'single' | 'double' | 'queen' | 'king';
  mattressWidth?: number;
  mattressLength?: number;
  headboardHeight?: number;
  headboardThickness?: number;
  hasHydraulicStorage?: boolean;
  hasMirror?: boolean;
  mirrorHeight?: number;

  // Library & TV Specific
  hasTvCavity?: boolean;
  tvWidth?: number;
  tvHeight?: number;
  tvDepth?: number;
  verticalDividersCount?: number;
  hasGlassDoors?: boolean;
  hasIntegratedLed?: boolean;

  // Materials & Finish
  materialFront?: string;
  materialBody?: string;
  handleType?: HandleType;
  customNotes?: string;
  isCustom?: boolean;
  isOpen?: boolean;
}

export interface ApplianceItem {
  id: string;
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
  z: number;
  width: number;
  height: number;
  depth: number;
  rotation: number;
  wallId?: string;
  openingDirection?: 'inward-left' | 'inward-right' | 'outward-left' | 'outward-right' | 'sliding';
}

export interface Wall {
  id: string;
  name: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  thickness: number;
  height: number;
  color?: string;
}

export interface RoomConfig {
  shape: 'rectangular' | 'l-shape' | 'u-shape' | 'custom';
  width: number;
  length: number;
  ceilingHeight: number;
  wallThickness: number;
  walls: Wall[];
  elements: ArchitecturalElement[];
}

export interface CountertopConfig {
  enabled: boolean;
  thickness: number;
  depth: number;
  overhangFront: number;
  overhangSides: number;
  material: string;
  edgeProfile: 'square' | 'beveled' | 'bullnose';
}

export interface PlinthConfig {
  enabled: boolean;
  height: number;
  setback: number;
  material: string;
}

export interface BacksplashConfig {
  enabled: boolean;
  height: number;
  thickness: number;
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
  systemType: MaterialSystemType; // Wood, Aluminium, Cladding, Fibre, Khashmounium
  boardThickness: number;
  backPanelThickness: number;
  backPanelRecess: number;
  edgeBandingFront: number;
  edgeBandingHidden: number;
  doorReveal: number;
  drawerSlideLoss: number;
  shelfSetback: number;
  constructionMethod: 'sides-full-height' | 'top-bottom-full-width' | 'aluminium-box-frame';
  backPanelMount: 'grooved' | 'surface-mounted' | 'infill-channel';
}

export interface CuttingPanel {
  id: string;
  cabinetId: string;
  cabinetName: string;
  partName: string;
  quantity: number;
  length: number;
  width: number;
  thickness: number;
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
  category: 'hinge' | 'slide' | 'handle' | 'leg' | 'bracket' | 'screw' | 'shelf-pin' | 'rail' | 'hydraulic' | 'corner-bracket';
  quantity: number;
  unit: string;
  description: string;
}

export interface PricingSettings {
  currency: string;
  pricePerSquareMeterFronts: number;
  pricePerSquareMeterCarcass: number;
  pricePerLinearMeterBase: number;
  pricePerLinearMeterWall: number;
  pricePerLinearMeterTall: number;
  pricePerSquareMeterCountertop: number;
  accessoriesCost: number;
  installationCostPercentage: number;
  taxPercentage: number;
  discountAmount: number;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  projectType: ProjectType;
  materialSystem: MaterialSystemType;
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
  pricing: PricingSettings;
}

export type ActiveTab = 
  | '2d-plan' 
  | '3d-view' 
  | 'elevations' 
  | 'technical-drawings' 
  | 'cabinet-schedule' 
  | 'manufacturing-bom' 
  | 'pricing-calculator'
  | 'dashboard';
