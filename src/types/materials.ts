export type MaterialCategoryType = 
  | 'wood-sheet' 
  | 'countertop' 
  | 'cladding-sheet' 
  | 'aluminium-profile' 
  | 'glass' 
  | 'fabric' 
  | 'veneer' 
  | 'edge-banding';

export interface CustomMaterialItem {
  id: string;
  name: string;
  nameEn?: string;
  category: MaterialCategoryType;
  supplier?: string;
  colorCode: string;
  
  // Sheet & Board Dimensions (in mm)
  sheetLength: number; // e.g. 2800 mm or 2440 mm
  sheetWidth: number;  // e.g. 2070 mm or 1220 mm
  thickness: number;   // e.g. 18 mm, 25 mm, 4 mm, 30 mm
  
  // Pricing
  price: number;       // Price in active project currency
  pricingUnit: 'لوح' | 'متر مربع م²' | 'متر طولي م.ط' | 'قطعة';
  wastePercentage: number; // e.g. 12%
  
  // Visuals & Rendering
  roughness?: number;
  metalness?: number;
  textureType?: 'matte' | 'gloss' | 'wood' | 'marble' | 'granite' | 'concrete' | 'tiles' | 'metal' | 'glass' | 'fabric';
  
  // System Flags
  isCustom?: boolean;
  notes?: string;
}
