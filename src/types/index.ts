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

export type ProjectType = 'kitchen' | 'dressing' | 'bedroom' | 'library' | 'living' | 'office' | 'bathroom';

export type CabinetCategory = 'base' | 'wall' | 'tall' | 'corner' | 'island' | 'custom';

// Dressing / Wardrobe Types
export type WardrobeCategory = 'wardrobe' | 'closet-internals' | 'shoe-cabinet' | 'accessories' | 'custom';
export type WardrobeDoorType = 'hinged' | 'sliding' | 'folding' | 'open' | 'glass-frame' | 'fixed';

// Bedroom Types
export type BedroomCategory = 'bed' | 'nightstand' | 'dresser' | 'tv-unit' | 'bench' | 'custom';
export type BedType = 'single' | 'double' | 'queen' | 'king' | 'storage-hydraulic' | 'platform' | 'upholstered' | 'wooden';

// Library Types
export type LibraryCategory = 'library-full' | 'library-wall' | 'bookshelf' | 'tv-media' | 'display' | 'floating' | 'media-console' | 'tv-wall' | 'custom';

// Living, Office, Bathroom, & Custom Categories
export type LivingCategory = 'sofa' | 'coffee-table' | 'dining-table' | 'tv-wall' | 'credenza' | 'wall-panel' | 'accent' | 'custom';
export type OfficeCategory = 'office-desk' | 'office-chair' | 'filing-cabinet' | 'custom';
export type BathroomCategory = 'vanity-basin' | 'mirror-cabinet' | 'custom';

export type FurnitureCategory = 
  | CabinetCategory 
  | WardrobeCategory 
  | BedroomCategory 
  | LibraryCategory 
  | LivingCategory 
  | OfficeCategory 
  | BathroomCategory;

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
  | 'base-cooktop-housing'
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
  | 'wall-lift-up-blum'
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
  | 'tall-double-oven-microwave'
  | 'wall-dish-rack'
  | 'base-waterproof-sink'
  | 'base-gola-c'
  | 'base-filler-panel'
  | 'wall-filler-panel'
  | 'base-blind-magic-corner'
  | 'wall-corner-bifold'
  | 'custom-box'
  // Wardrobe / Dressing types
  | 'wardrobe-hinged-2d'
  | 'wardrobe-hinged-3d'
  | 'wardrobe-sliding-2d'
  | 'wardrobe-sliding-3d'
  | 'wardrobe-walkin-open'
  | 'wardrobe-corner-l'
  | 'wardrobe-corner-open'
  | 'wardrobe-corner-mirror-45'
  | 'wardrobe-corner-carousel'
  | 'wardrobe-corner-glass'
  | 'wardrobe-hanging-long'
  | 'wardrobe-hanging-double'
  | 'wardrobe-double-hanging'
  | 'wardrobe-tall-hanging'
  | 'wardrobe-shelves-drawers'
  | 'wardrobe-shoe-rack'
  | 'wardrobe-jewelry-vanity'
  | 'wardrobe-trouser-rack'
  | 'wardrobe-laundry-hamper'
  | 'wardrobe-bags-vitrine'
  | 'wardrobe-glass-vitrine'
  | 'wardrobe-glass-doors'
  | 'wardrobe-island-accessories'
  | 'dressing-jewelry-island'
  | 'dressing-carcass-custom'
  // Shoe Cabinet Types (الجزامات)
  | 'shoe-cabinet-drop-down'
  | 'shoe-cabinet-tall'
  | 'shoe-cabinet-bench'
  | 'shoe-cabinet-louvered'
  | 'shoe-cabinet-custom'
  // Bedroom types
  | 'bed-single'
  | 'bed-double'
  | 'bed-queen'
  | 'bed-king'
  | 'bed-king-upholstered'
  | 'bed-king-floating'
  | 'bed-storage-hydraulic'
  | 'bedroom-nightstand'
  | 'nightstand-2drawers'
  | 'nightstand-floating'
  | 'bedroom-dresser-mirror'
  | 'dresser-6drawers'
  | 'dresser-6drawers-luxury'
  | 'dresser-floating-modern'
  | 'bedroom-tv-credenza'
  | 'bedroom-bench-ottoman'
  // Library & Media types
  | 'library-full-wall'
  | 'library-unit-standard'
  | 'library-bookshelf-open'
  | 'library-bookshelf-tall'
  | 'library-bookshelf-doors'
  | 'library-tv-center'
  | 'library-display-glass'
  | 'library-vitrine-tall'
  | 'library-floating-shelves'
  | 'library-shelf-floating'
  | 'living-tv-slat-wall'
  | 'living-credenza-floating'
  // Living & Dining types
  | 'living-sofa-3seat'
  | 'living-sofa-l-shape'
  | 'living-armchair'
  | 'living-coffee-table'
  | 'living-tv-slat-wall'
  | 'living-credenza-buffet'
  | 'dining-table-6seat'
  | 'dining-chair'
  // Office types
  | 'office-executive-desk'
  | 'office-chair'
  | 'office-storage-credenza'
  // Bathroom types
  | 'bathroom-vanity-single'
  | 'bathroom-vanity-double'
  | 'bathroom-mirror-led'
  // Decorative & Accents
  | 'accent-indoor-plant'
  | 'accent-pendant-light'
  | 'accent-slat-wall-panel';

export type ApplianceType =
  | 'fridge-freestanding'
  | 'fridge-builtin'
  | 'fridge-integrated'
  | 'refrigerator'
  | 'oven-builtin'
  | 'oven-single'
  | 'oven-double'
  | 'microwave-builtin'
  | 'cooktop'
  | 'cooktop-gas'
  | 'cooktop-induction'
  | 'cooker-range'
  | 'range-freestanding'
  | 'dishwasher'
  | 'dishwasher-integrated'
  | 'dishwasher-freestanding'
  | 'hood-wall'
  | 'hood-integrated'
  | 'range-hood-wall'
  | 'range-hood-island'
  | 'range-hood-integrated'
  | 'washing-machine'
  | 'dryer'
  | 'wine-cooler'
  | 'espresso-machine'
  | 'coffee-machine'
  | 'sink'
  | 'sink-single'
  | 'sink-double'
  | 'sink-single-bowl'
  | 'sink-double-bowl'
  | 'sink-with-drainer'
  | 'tv-screen'
  | 'soundbar'
  | 'led-strip';

export type ArchitecturalElementType =
  | 'door'
  | 'window'
  | 'column'
  | 'pillar'
  | 'beam'
  | 'recess'
  | 'pipe'
  | 'radiator'
  | 'pipe-gas'
  | 'pipe-water'
  | 'pipe-drain'
  | 'vent'
  | 'electrical-outlet'
  | 'water-inlet'
  | 'water-outlet';

export type DoorHinge = 'left' | 'right' | 'double' | 'top' | 'sliding' | 'folding' | 'none';
export type HandleType = 'bar-black' | 'bar-brass' | 'bar-chrome' | 'edge-pull' | 'knob' | 'handleless' | 'none' | string;

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
  doorHinge?: DoorHinge;
  doorType?: WardrobeDoorType;

  // Kitchen Carcass Detailing
  hasSinkCutout?: boolean;
  hasCooktopCutout?: boolean;
  hasApplianceCavity?: boolean;
  applianceCavityHeight?: number;
  applianceCavityZ?: number;
  isCeilingUnit?: boolean;
  flipUpDoor?: boolean;
  hasDishRack?: boolean; // صفاية أطباق ومطبق استانلس
  hasTopStretchers?: boolean; // عوارض علوية 10 سم بدلاً من السقف
  hasAluminumWaterproofBottom?: boolean; // قاع معزول ومصفح ألومنيوم للحوض
  hasGolaProfile?: boolean; // تفريز بروفايل جولا L / C
  golaType?: 'l-type' | 'c-type';
  backPanelType?: 'groove-6mm' | 'rebate-18mm' | 'flush-screwed'; // نوع الظهر
  hasCrownMolding?: boolean; // كورنيشة علوية
  hasLightPelmet?: boolean; // بانو إضاءة سفلي
  hasFillerPanel?: boolean; // فيلر تعويض جانبي
  fillerWidth?: number; // مقاس الفيلر
  assemblyType?: 'minifix' | 'confirmat' | 'brackets'; // نوع التجميع

  // Dressing Specific & Custom Carcass Detailing
  hasHangingRail?: boolean;
  hangingRailCount?: number;
  hasShoeShelves?: boolean;
  hasJewelryDrawer?: boolean;
  hasTrouserRack?: boolean;
  hasLaundryBasket?: boolean;
  slidingTracksCount?: number;
  isCustomDressingCarcass?: boolean;
  verticalPartitionsCount?: number; // عدد القواطع الرأسية (Gables) 1, 2, 3
  dressingHangingConfig?: 'long' | 'double' | 'hydraulic' | 'none';
  dressingDrawersCount?: number;
  hasVerticalLedProfile?: boolean;

  // Shoe Cabinet Specific Attributes (الجزامات وتفصيلها)
  isShoeCabinet?: boolean;
  shoeCabinetType?: 'drop-down' | 'tall-shelves' | 'bench-seating' | 'louvered-doors' | 'custom';
  shoeTiersCount?: number; // عدد الأدوار والقلابات (1, 2, 3, 4, 5)
  shoeShelfAngle?: number; // زاوية ميل الرف (0, 15, 30, 45)
  hasPaddedSeat?: boolean; // مقعد جلوس بف مبطن
  paddedSeatColor?: string; // لون قماش / جلد المقعد
  hasVentilationLouvers?: boolean; // فتحات تهوية أو ضلف شيش
  hasDropFlaps?: boolean; // قلابات أحذية هيدروليك

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
  hasIntegratedLed?: boolean;

  // Visual Overrides
  materialBody?: string;
  materialFront?: string;
  hasGlassDoors?: boolean;
  handleType?: HandleType;
  customNotes?: string;
  isCustom?: boolean;
  isOpen?: boolean;
}

export interface ApplianceItem {
  id: string;
  name: string;
  type: ApplianceType;
  category?: 'cooking' | 'cooling' | 'cleaning' | 'sanitary' | 'other' | string;
  brand?: string;
  model?: string;
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
  finish?: 'stainless' | 'black' | 'white' | 'integrated' | 'black-glass' | string;
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
  color?: string;
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
  color?: string;
}

export interface MaterialFinishes {
  frontFinish: string;
  frontColor: string;
  bodyColor: string;
  carcaseFinish?: string;
  plinthFinish?: string;
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

export type PricingMethod = 'linear' | 'square-fronts';

export interface PricingSettings {
  currency: string;
  pricingMethod: PricingMethod; // 'linear' (بالمتر الطولي) أو 'square-fronts' (بالمتر المربع لوش الوحدات)
  
  // Material Specification for Pricing (الخامة المحددة للتسعير: خشب، كلادينج، خشمونيوم، فايبر...)
  selectedMaterialType?: 'wood' | 'cladding' | 'khashmounium' | 'fibre' | 'acrylic' | 'polygloss' | 'hpl' | 'custom';
  materialSpecificationNotes?: string;
  
  // Square Meters (المتر المربع لوش الواجهات: العرض x الارتفاع)
  pricePerSquareMeterFronts: number; // سعر المتر المربع الموحد لوش الوحدات
  pricePerSquareMeterBaseFronts?: number; // سعر المتر المربع لوش الوحدات السفلية
  pricePerSquareMeterWallFronts?: number; // سعر المتر المربع لوش الوحدات العلوية
  pricePerSquareMeterTallFronts?: number; // سعر المتر المربع للدواليب الطولية
  useDetailedSquareMeterPricing?: boolean; // تفعيل سعر مخصص لكل تصنيف
  pricePerSquareMeterCarcass: number;
  
  // Linear Meters (المتر الطولي: العرض)
  pricePerLinearMeterBase: number;
  pricePerLinearMeterWall: number;
  pricePerLinearMeterTall: number;
  
  // Additional Add-ons
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

export interface DesignOption {
  id: string;
  name: string;
  description?: string;
  materials: MaterialFinishes;
  countertop?: CountertopConfig;
  plinth?: PlinthConfig;
  backsplash?: BacksplashConfig;
  previewImage?: string;
  isDefault?: boolean;
}

export type LightingPreset = 'daylight' | 'sunset' | 'night' | 'studio';
export type CameraAnglePreset = 'perspective' | 'wide' | 'eye-level' | 'macro-detail' | 'axonometric' | 'top-down';
export type RenderResolution = '1080p' | '2k' | '4k';

export interface RenderSnapshot {
  id: string;
  timestamp: string;
  imageUrl: string;
  angleName: string;
  lightingPreset: LightingPreset;
  resolution: RenderResolution;
  designOptionName?: string;
  isAiEnhanced?: boolean;
}

export interface DimensionAdaptationRule {
  targetWidth: number;
  targetLength: number;
  targetHeight: number;
  preserveIsland?: boolean;
  scaleMethod: 'modular-fit' | 'proportional' | 'fill-spacers';
}

export interface DimensionConflict {
  id: string;
  type: 'wall-overflow' | 'aisle-clearance' | 'door-collision' | 'appliance-mismatch' | 'corner-fit';
  severity: 'warning' | 'error';
  message: string;
  involvedCabinetId?: string;
  involvedCabinetName?: string;
  suggestedFix?: string;
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
  designOptions?: DesignOption[];
  activeDesignOptionId?: string;
  savedSnapshots?: RenderSnapshot[];
}

export type ActiveTab = 
  | '2d-plan' 
  | '3d-view' 
  | 'walkthrough-vr'
  | 'visualization-studio'
  | 'presentation-mode'
  | 'templates-catalog'
  | 'elevations' 
  | 'technical-drawings' 
  | 'cabinet-schedule' 
  | 'manufacturing-bom' 
  | 'pricing-calculator'
  | 'admin-catalog'
  | 'dashboard';
