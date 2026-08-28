import { CabinetItem, CountertopConfig, PricingSettings, ManufacturingSettings, PricingMethod } from '../types';
import { generateFullProjectBOM } from './manufacturing';

export interface CabinetPricingBreakdownItem {
  id: string;
  name: string;
  category: CabinetItem['category'];
  materialName: string; // خامة الوحدة (خشب / كلادينج / خشمونيوم / ...)
  widthMm: number;
  heightMm: number;
  depthMm: number;
  faceAreaM2: number; // مسطح وش الوحدة بالمتر المربع = (W/1000) * (H/1000) - بدون العمق!
  linearM: number;    // الطول بالمتر الطولي = W/1000
  unitPrice: number;  // سعر المتر المطبق للوحدة
  totalCost: number;  // التكلفة الإجمالية للوحدة
}

export interface MaterialSpecificationSummary {
  materialType: string;
  materialNameAr: string;
  frontFinish: string;
  countertopMaterial: string;
  carcassType: string;
  hardwareSpec: string;
  notes: string;
}

export interface KitchenMeterageSummary {
  // Method
  pricingMethod: PricingMethod;

  // Material Specification (تفاصيل الخامات في عرض السعر)
  materialSpec: MaterialSpecificationSummary;

  // 1. Linear Meters (الأمتار الطولية: مجموع الأطوال W)
  baseLinearM: number;
  wallLinearM: number;
  tallLinearM: number;
  totalLinearM: number;

  // 2. Square Meters for Front Face (المتر المربع لوش الوحدات: العرض × الارتفاع فقط)
  baseFrontsAreaM2: number;
  wallFrontsAreaM2: number;
  tallFrontsAreaM2: number;
  totalFrontsAreaM2: number; // إجمالي المتر المربع لوش جميع الوحدات

  // 3. Countertop & Room Areas
  countertopAreaM2: number;
  countertopLinearM: number;
  backsplashAreaM2: number;
  totalWoodPanelsAreaM2: number;
  roomFloorAreaM2: number;

  // 4. Detailed Cabinet-by-Cabinet Items List
  breakdownItems: CabinetPricingBreakdownItem[];

  // 5. Financial Cost Breakdown (التسعير المالي)
  baseCost: number;
  wallCost: number;
  tallCost: number;
  unitsCost: number; // إجمالي تكلفة الوحدات بناءً على الطريقة المختارة
  countertopCost: number;
  accessoriesCost: number;
  installationCost: number;
  subtotal: number;
  discount: number;
  tax: number;
  finalTotal: number;
}

export function getMaterialTypeLabel(type: string): string {
  switch (type) {
    case 'wood':
      return 'خشب طبيعي / مسطحات MDF معالجة';
    case 'acrylic':
      return 'خشب أكريليك عالي اللمعان (High Gloss Acrylic)';
    case 'polygloss':
      return 'خشب بولي لاك / يو في لاك (Polygloss UV)';
    case 'hpl':
      return 'خشب مغطى بطبقات HPL المقاومة للخدش والحرارة';
    case 'cladding':
      return 'كلادينج ألوميتال Alubond (مقاوم للمياه والحريق 100%)';
    case 'khashmounium':
      return 'خشمونيوم دبل بتجزيعات خشبية وشاسيه مقوى';
    case 'fibre':
      return 'فايبر جلاس وكومباكت لامينيت (Compact Laminate)';
    default:
      return 'خشب مصنع عالي الجودة';
  }
}

export function calculateKitchenMeterageAndPrice(
  cabinets: CabinetItem[],
  room: { width: number; length: number },
  countertop: CountertopConfig,
  manufacturing: ManufacturingSettings,
  pricing: PricingSettings
): KitchenMeterageSummary {
  const method = pricing.pricingMethod || 'square-fronts';
  const isSquareMode = method === 'square-fronts';
  const matType = pricing.selectedMaterialType || manufacturing.systemType || 'wood';

  let baseWidthMm = 0;
  let wallWidthMm = 0;
  let tallWidthMm = 0;

  let baseFrontsMm2 = 0;
  let wallFrontsMm2 = 0;
  let tallFrontsMm2 = 0;

  let countertopAreaMm2 = 0;
  let countertopLengthMm = 0;

  const breakdownItems: CabinetPricingBreakdownItem[] = [];

  cabinets.forEach((cab) => {
    const W = cab.width;
    const H = cab.height;
    const D = cab.depth;

    // مساحة وش الوحدة بالمتر المربع = (العرض بالمتر) × (الارتفاع بالمتر) - لا علاقة للعمق بها!
    const faceM2 = Number(((W * H) / 1000000).toFixed(3));
    const linM = Number((W / 1000).toFixed(3));

    let applicableRate = 0;
    let unitCost = 0;

    const isBase = cab.category === 'base' || cab.category === 'corner' || cab.category === 'island' || cab.category === 'nightstand' || cab.category === 'dresser';
    const isWall = cab.category === 'wall' || cab.category === 'floating';
    const isTall = cab.category === 'tall' || cab.category === 'wardrobe' || cab.category === 'library-full' || cab.category === 'bed';

    if (isBase) {
      baseWidthMm += W;
      baseFrontsMm2 += W * H;

      if (countertop && countertop.enabled) {
        countertopLengthMm += W;
        countertopAreaMm2 += W * (D + (countertop.overhangFront || 20));
      }

      if (isSquareMode) {
        applicableRate = pricing.useDetailedSquareMeterPricing
          ? (pricing.pricePerSquareMeterBaseFronts ?? pricing.pricePerSquareMeterFronts)
          : pricing.pricePerSquareMeterFronts;
        unitCost = faceM2 * applicableRate;
      } else {
        applicableRate = pricing.pricePerLinearMeterBase || 0;
        unitCost = linM * applicableRate;
      }
    } else if (isWall) {
      wallWidthMm += W;
      wallFrontsMm2 += W * H;

      if (isSquareMode) {
        applicableRate = pricing.useDetailedSquareMeterPricing
          ? (pricing.pricePerSquareMeterWallFronts ?? pricing.pricePerSquareMeterFronts)
          : pricing.pricePerSquareMeterFronts;
        unitCost = faceM2 * applicableRate;
      } else {
        applicableRate = pricing.pricePerLinearMeterWall || 0;
        unitCost = linM * applicableRate;
      }
    } else {
      // Tall / Wardrobe / Custom
      tallWidthMm += W;
      tallFrontsMm2 += W * H;

      if (isSquareMode) {
        applicableRate = pricing.useDetailedSquareMeterPricing
          ? (pricing.pricePerSquareMeterTallFronts ?? pricing.pricePerSquareMeterFronts)
          : pricing.pricePerSquareMeterFronts;
        unitCost = faceM2 * applicableRate;
      } else {
        applicableRate = pricing.pricePerLinearMeterTall || 0;
        unitCost = linM * applicableRate;
      }
    }

    const itemMat = cab.materialSystemOverride 
      ? getMaterialTypeLabel(cab.materialSystemOverride)
      : getMaterialTypeLabel(matType);

    breakdownItems.push({
      id: cab.id,
      name: cab.name,
      category: cab.category,
      materialName: itemMat,
      widthMm: W,
      heightMm: H,
      depthMm: D,
      faceAreaM2: faceM2,
      linearM: linM,
      unitPrice: applicableRate,
      totalCost: Math.round(unitCost),
    });
  });

  // Summary Metrics
  const baseLinearM = Number((baseWidthMm / 1000).toFixed(2));
  const wallLinearM = Number((wallWidthMm / 1000).toFixed(2));
  const tallLinearM = Number((tallWidthMm / 1000).toFixed(2));
  const totalLinearM = Number((baseLinearM + wallLinearM + tallLinearM).toFixed(2));

  const baseFrontsAreaM2 = Number((baseFrontsMm2 / 1000000).toFixed(2));
  const wallFrontsAreaM2 = Number((wallFrontsMm2 / 1000000).toFixed(2));
  const tallFrontsAreaM2 = Number((tallFrontsMm2 / 1000000).toFixed(2));
  const totalFrontsAreaM2 = Number((baseFrontsAreaM2 + wallFrontsAreaM2 + tallFrontsAreaM2).toFixed(2));

  const countertopAreaM2 = Number((countertopAreaMm2 / 1000000).toFixed(2));
  const countertopLinearM = Number((countertopLengthMm / 1000).toFixed(2));
  const backsplashAreaM2 = Number(((baseWidthMm * 600) / 1000000).toFixed(2));
  const roomFloorAreaM2 = Number(((room.width * room.length) / 1000000).toFixed(2));

  const { totalAreaM2: totalWoodPanelsAreaM2 } = generateFullProjectBOM(cabinets, manufacturing);

  // Financial Costs Calculations
  let baseCost = 0;
  let wallCost = 0;
  let tallCost = 0;
  let unitsCost = 0;

  if (isSquareMode) {
    // المحاسبة بالمتر المربع لوش الوحدات
    if (pricing.useDetailedSquareMeterPricing) {
      baseCost = baseFrontsAreaM2 * (pricing.pricePerSquareMeterBaseFronts ?? pricing.pricePerSquareMeterFronts);
      wallCost = wallFrontsAreaM2 * (pricing.pricePerSquareMeterWallFronts ?? pricing.pricePerSquareMeterFronts);
      tallCost = tallFrontsAreaM2 * (pricing.pricePerSquareMeterTallFronts ?? pricing.pricePerSquareMeterFronts);
      unitsCost = baseCost + wallCost + tallCost;
    } else {
      unitsCost = totalFrontsAreaM2 * (pricing.pricePerSquareMeterFronts || 0);
      baseCost = baseFrontsAreaM2 * (pricing.pricePerSquareMeterFronts || 0);
      wallCost = wallFrontsAreaM2 * (pricing.pricePerSquareMeterFronts || 0);
      tallCost = tallFrontsAreaM2 * (pricing.pricePerSquareMeterFronts || 0);
    }
  } else {
    // المحاسبة بالمتر الطولي
    baseCost = baseLinearM * (pricing.pricePerLinearMeterBase || 0);
    wallCost = wallLinearM * (pricing.pricePerLinearMeterWall || 0);
    tallCost = tallLinearM * (pricing.pricePerLinearMeterTall || 0);
    unitsCost = baseCost + wallCost + tallCost;
  }

  const countertopCost = countertopAreaM2 * (pricing.pricePerSquareMeterCountertop || 0);
  const accessoriesCost = pricing.accessoriesCost || 0;
  const rawSubtotal = unitsCost + countertopCost + accessoriesCost;

  const installationCost = (rawSubtotal * (pricing.installationCostPercentage || 0)) / 100;
  const subtotalWithInstall = rawSubtotal + installationCost;

  const discount = pricing.discountAmount || 0;
  const taxableAmount = Math.max(0, subtotalWithInstall - discount);
  const tax = (taxableAmount * (pricing.taxPercentage || 0)) / 100;
  const finalTotal = Math.round(taxableAmount + tax);

  const materialSpec: MaterialSpecificationSummary = {
    materialType: matType,
    materialNameAr: getMaterialTypeLabel(matType),
    frontFinish: matType === 'cladding' ? 'شيت كلادينج ألوميتال دبل 4 مم معالج' : matType === 'khashmounium' ? 'خشمونيوم دبل تجزيعات خشبية' : 'ألواح MDF مكسوة HPL / أكريليك تركي',
    countertopMaterial: countertop?.material || 'رخام كلكتا جولد طبيعي / كوارتز',
    carcassType: matType === 'cladding' || matType === 'khashmounium' ? 'شاسيه ألوميتال مقوى مقاوم للمياه' : 'خشب شاسيه داخلي معالج 18 مم',
    hardwareSpec: 'مفصلات ومجاري أدراج هيدروليك سوفت كلوز بلوم',
    notes: pricing.materialSpecificationNotes || 'الخامة مطابقة للمواصفات القياسية للجودة والمتانة ومقاومة الرطوبة.',
  };

  return {
    pricingMethod: method,
    materialSpec,
    baseLinearM,
    wallLinearM,
    tallLinearM,
    totalLinearM,
    baseFrontsAreaM2,
    wallFrontsAreaM2,
    tallFrontsAreaM2,
    totalFrontsAreaM2,
    countertopAreaM2,
    countertopLinearM,
    backsplashAreaM2,
    totalWoodPanelsAreaM2,
    roomFloorAreaM2,
    breakdownItems,
    baseCost: Math.round(baseCost),
    wallCost: Math.round(wallCost),
    tallCost: Math.round(tallCost),
    unitsCost: Math.round(unitsCost),
    countertopCost: Math.round(countertopCost),
    accessoriesCost: Math.round(accessoriesCost),
    installationCost: Math.round(installationCost),
    subtotal: Math.round(subtotalWithInstall),
    discount: Math.round(discount),
    tax: Math.round(tax),
    finalTotal,
  };
}
