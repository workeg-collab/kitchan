import { UnitType, ProjectType, FurnitureCategory, CabinetType, ApplianceType, ArchitecturalElementType, DoorHinge, WardrobeDoorType, HandleType, CabinetItem, ApplianceItem, ArchitecturalElement, Wall, RoomConfig, CountertopConfig, PlinthConfig, BacksplashConfig, MaterialFinishes, ProjectMetadata, ActiveTab } from './index';

export type MaterialSystemType = 'wood' | 'aluminium' | 'cladding' | 'fibre' | 'khashmounium' | 'custom';

// --- Aluminium & Metal Profile Database Schema ---
export interface AluminiumProfileSector {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  system: MaterialSystemType;
  category: 'vertical-frame' | 'horizontal-frame' | 'door-frame' | 'shelf-support' | 'corner' | 'handle-gola' | 'sliding-track' | 'bottom-plinth' | 'back-support';
  width: number; // in mm
  height: number; // in mm
  thickness: number; // wall thickness e.g. 1.2mm, 1.5mm
  standardBarLength: number; // e.g. 6000mm
  weightKgPerMeter: number;
  pricePerMeter: number;
  sawKerfAllowance: number; // e.g. 4mm
  connectionDeduction: number; // e.g. 25mm per corner connector
  defaultCutAngleLeft: 90 | 45;
  defaultCutAngleRight: 90 | 45;
  color?: string;
  compatibleConnectors?: string[];
  description?: string;
}

// --- Linear Profile Cut Piece ---
export interface ProfileCutPiece {
  id: string;
  cabinetId: string;
  cabinetName: string;
  profileCode: string;
  profileName: string;
  category: AluminiumProfileSector['category'];
  length: number; // in mm
  quantity: number;
  cutAngleLeft: 90 | 45;
  cutAngleRight: 90 | 45;
  material: string;
  notes?: string;
}

// --- Infill / Cladding Sheet Piece ---
export interface InfillSheetPiece {
  id: string;
  cabinetId: string;
  cabinetName: string;
  partName: string; // e.g. "حشوة فايبر ضلفة", "شيت كلادينج جنب"
  quantity: number;
  length: number;
  width: number;
  thickness: number;
  material: string;
  notes?: string;
}

// --- Linear Bar Nesting Optimization Map ---
export interface BarNestingAllocation {
  barIndex: number;
  standardLength: number; // e.g. 6000mm
  profileCode: string;
  cuts: { pieceId: string; cabinetId: string; length: number; angle: string }[];
  totalCutLength: number;
  wasteLength: number;
  wastePercentage: number;
}

// --- Sheet 2D Nesting Optimization Map ---
export interface SheetNestingAllocation {
  sheetIndex: number;
  standardWidth: number;
  standardLength: number;
  materialName: string;
  panels: { panelId: string; cabinetId: string; partName: string; length: number; width: number }[];
  usedAreaM2: number;
  totalAreaM2: number;
  wastePercentage: number;
}

// --- Configurable Manufacturing System Template ---
export interface ManufacturingSystemTemplate {
  id: string;
  name: string;
  nameEn: string;
  systemType: MaterialSystemType;
  description: string;
  supportedCategories?: ProjectType[];
  
  // Board & Sheet Properties (for Wood/Cladding/Fibre)
  standardSheetWidth: number; // e.g. 2800 or 2440
  standardSheetLength: number; // e.g. 2070 or 1220
  primaryBoardThickness: number; // e.g. 18mm or 16mm
  backPanelThickness: number; // e.g. 6mm or 3mm
  claddingSheetThickness?: number; // e.g. 4mm Alubond
  sawKerf: number; // e.g. 3.5mm
  edgeBandingFront: number; // e.g. 1.0mm
  edgeBandingHidden: number; // e.g. 0.4mm
  doorReveal: number; // e.g. 3mm

  // Construction Rules
  carcassConstruction: 'sides-outside' | 'top-bottom-outside' | 'aluminium-box-frame';
  backPanelMount: 'grooved' | 'surface-mounted' | 'infill-channel';
  grooveDepth: number; // in mm
  grooveOffset: number; // in mm

  // Aluminium Profiles Configuration
  standardBarLength: number; // 6000mm
  verticalFrameProfileId?: string;
  horizontalFrameProfileId?: string;
  doorFrameProfileId?: string;
  shelfSupportProfileId?: string;
  cornerJointDeduction: number; // mm

  // Costing & Pricing
  pricePerSheet: number;
  pricePerProfileBar: number;
  costLaborPerMeter: number;
  wasteFactorPercentage: number; // e.g. 15%
}

// --- Complete Unified Project Manufacturing Output ---
export interface CompleteManufacturingPackage {
  systemTemplate: ManufacturingSystemTemplate;
  systemType: MaterialSystemType;
  
  // Wood / Sheet components (if applicable)
  woodPanels: {
    id: string;
    cabinetId: string;
    cabinetName: string;
    partName: string;
    quantity: number;
    length: number;
    width: number;
    thickness: number;
    material: string;
    edgeBanding: { top: boolean; bottom: boolean; left: boolean; right: boolean };
    notes?: string;
  }[];
  sheetNesting: SheetNestingAllocation[];
  totalSheetsRequired: number;

  // Aluminium / Profile components (if applicable)
  profileCuts: ProfileCutPiece[];
  barNesting: BarNestingAllocation[];
  totalBarsRequired: number;
  totalProfileMeters: number;

  // Infill / Cladding / Fiber panels
  infillPanels: InfillSheetPiece[];

  // Hardware & Accessories
  hardwareBOM: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    unitPrice?: number;
    description: string;
  }[];

  // Comprehensive Costing Breakdown
  costBreakdown: {
    rawMaterialsCost: number;
    profilesCost: number;
    infillsCost: number;
    hardwareCost: number;
    accessoriesCost: number;
    laborCost: number;
    wasteCost: number;
    manufacturingSubtotal: number;
    suggestedSellingPrice: number;
  };
}
