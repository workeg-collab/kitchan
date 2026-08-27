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
  hasSinkCutout?: boolean;
  hasApplianceCavity?: boolean;
  applianceCavityHeight?: number;
  applianceCavityZ?: number;
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
  boardThickness: number;
  backPanelThickness: number;
  backPanelRecess: number;
  edgeBandingFront: number;
  edgeBandingHidden: number;
  doorReveal: number;
  drawerSlideLoss: number;
  shelfSetback: number;
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
  category: 'hinge' | 'slide' | 'handle' | 'leg' | 'bracket' | 'screw' | 'shelf-pin';
  quantity: number;
  unit: string;
  description: string;
}

export interface PricingSettings {
  currency: string; // 'ج.م' | 'ر.س' | 'د.إ' | '$'
  pricePerSquareMeterFronts: number; // سعر متر الواجهات مسطح م²
  pricePerSquareMeterCarcass: number; // سعر المتر المربع لخشب الشاسيه م²
  pricePerLinearMeterBase: number; // سعر المتر الطولي للوحدات السفلية
  pricePerLinearMeterWall: number; // سعر المتر الطولي للوحدات العلوية
  pricePerLinearMeterTall: number; // سعر المتر الطولي للوحدات الطولية
  pricePerSquareMeterCountertop: number; // سعر متر الرخام / الكوارتز م²
  accessoriesCost: number; // تكلفة إكسسوارات ثابتة
  installationCostPercentage: number; // نسبة المصنعية والتركيب (مثلاً 10%)
  taxPercentage: number; // نسبة الضريبة إن وجدت
  discountAmount: number; // خصم
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
  | 'export-package';
