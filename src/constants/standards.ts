import { ManufacturingSettings, CountertopConfig, PlinthConfig, BacksplashConfig, MaterialFinishes, PricingSettings } from '../types';

export const DEFAULT_MANUFACTURING_SETTINGS: ManufacturingSettings = {
  systemType: 'wood',
  boardThickness: 18, // 18mm standard
  backPanelThickness: 6, // 6mm
  backPanelRecess: 15, // 15mm void
  edgeBandingFront: 1.0, // 1mm ABS
  edgeBandingHidden: 0.4, // 0.4mm
  doorReveal: 3, // 3mm
  drawerSlideLoss: 25,
  shelfSetback: 20,
  constructionMethod: 'sides-full-height',
  backPanelMount: 'grooved',
};

export const DEFAULT_COUNTERTOP_CONFIG: CountertopConfig = {
  enabled: true,
  thickness: 30,
  depth: 620,
  overhangFront: 20,
  overhangSides: 10,
  material: 'رخام كلكتا جولد / كوارتز أبيض',
  edgeProfile: 'square',
};

export const DEFAULT_PLINTH_CONFIG: PlinthConfig = {
  enabled: true,
  height: 100,
  setback: 50,
  material: 'رمادي فحمي مطفي',
};

export const DEFAULT_BACKSPLASH_CONFIG: BacksplashConfig = {
  enabled: true,
  height: 600,
  thickness: 15,
  material: 'رخام كلكتا جولد',
};

export const DEFAULT_MATERIAL_FINISHES: MaterialFinishes = {
  frontFinish: 'أبيض ألباين مطفي',
  frontColor: '#f8fafc',
  bodyColor: '#cbd5e1',
  countertopMaterial: 'رخام كلكتا جولد',
  countertopColor: '#f8fafc',
  backsplashMaterial: 'رخام كلكتا جولد',
  backsplashColor: '#f8fafc',
  wallColor: '#f1f5f9',
  floorMaterial: 'خشب باركيه أرو طبيعي',
  floorColor: '#8c6843',
  handleStyle: 'bar-black',
  handleColor: '#09090b',
};

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  currency: 'ج.م',
  pricingMethod: 'square-fronts',
  selectedMaterialType: 'wood',
  materialSpecificationNotes: 'خشب تركي إيجر MDF ملبوس HPL/أكريليك عالي الجودة مع شاسيه داخلي معتمد',
  pricePerSquareMeterFronts: 4200,
  pricePerSquareMeterBaseFronts: 4200,
  pricePerSquareMeterWallFronts: 3800,
  pricePerSquareMeterTallFronts: 4500,
  useDetailedSquareMeterPricing: false,
  pricePerSquareMeterCarcass: 850,
  pricePerLinearMeterBase: 3200,
  pricePerLinearMeterWall: 2600,
  pricePerLinearMeterTall: 5400,
  pricePerSquareMeterCountertop: 2400,
  accessoriesCost: 1500,
  installationCostPercentage: 10,
  taxPercentage: 0,
  discountAmount: 0,
};
