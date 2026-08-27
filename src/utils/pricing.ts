import { CabinetItem, CountertopConfig, PricingSettings, ManufacturingSettings } from '../types';
import { generateFullProjectBOM } from './manufacturing';

export interface KitchenMeterageSummary {
  // Linear Meters (الأمتار الطولية)
  baseLinearM: number;
  wallLinearM: number;
  tallLinearM: number;
  totalLinearM: number;

  // Square Meters (الأمتار المربعة المسطحة)
  frontsAreaM2: number; // مسطح الواجهات والأبواب
  countertopAreaM2: number; // مسطح الرخام / الكاونترتوب
  backsplashAreaM2: number; // مسطح الوزرة وحائط الباكسبلاش
  totalWoodPanelsAreaM2: number; // إجمالي مسطحات الخشب والألواح
  roomFloorAreaM2: number; // مساحة أرضية الغرفة

  // Calculated Pricing (التسعير المالي)
  baseCost: number;
  wallCost: number;
  tallCost: number;
  frontsCost: number;
  countertopCost: number;
  accessoriesCost: number;
  installationCost: number;
  subtotal: number;
  discount: number;
  tax: number;
  finalTotal: number;
}

export function calculateKitchenMeterageAndPrice(
  cabinets: CabinetItem[],
  room: { width: number; length: number },
  countertop: CountertopConfig,
  manufacturing: ManufacturingSettings,
  pricing: PricingSettings
): KitchenMeterageSummary {
  let baseWidthMm = 0;
  let wallWidthMm = 0;
  let tallWidthMm = 0;
  let frontsAreaMm2 = 0;
  let countertopAreaMm2 = 0;

  cabinets.forEach((cab) => {
    const W = cab.width;
    const H = cab.height;
    const D = cab.depth;

    if (cab.category === 'base' || cab.category === 'corner') {
      baseWidthMm += W;
      // Countertop calculation per base cabinet
      if (countertop.enabled) {
        countertopAreaMm2 += W * (D + countertop.overhangFront);
      }
    } else if (cab.category === 'wall') {
      wallWidthMm += W;
    } else if (cab.category === 'tall') {
      tallWidthMm += W;
    }

    // Door and Drawer front surface area
    if (cab.doorCount > 0 || cab.drawerCount > 0) {
      frontsAreaMm2 += W * H;
    }
  });

  const baseLinearM = Number((baseWidthMm / 1000).toFixed(2));
  const wallLinearM = Number((wallWidthMm / 1000).toFixed(2));
  const tallLinearM = Number((tallWidthMm / 1000).toFixed(2));
  const totalLinearM = Number((baseLinearM + wallLinearM + tallLinearM).toFixed(2));

  const frontsAreaM2 = Number((frontsAreaMm2 / 1000000).toFixed(2));
  const countertopAreaM2 = Number((countertopAreaMm2 / 1000000).toFixed(2));
  const backsplashAreaM2 = Number(((baseWidthMm * 600) / 1000000).toFixed(2)); // standard 60cm splash
  const roomFloorAreaM2 = Number(((room.width * room.length) / 1000000).toFixed(2));

  const { totalAreaM2: totalWoodPanelsAreaM2 } = generateFullProjectBOM(cabinets, manufacturing);

  // Financial Cost Calculations
  // Linear meter pricing
  const baseCost = baseLinearM * (pricing.pricePerLinearMeterBase || 0);
  const wallCost = wallLinearM * (pricing.pricePerLinearMeterWall || 0);
  const tallCost = tallLinearM * (pricing.pricePerLinearMeterTall || 0);

  // Surface meter pricing option (for fronts)
  const frontsCost = frontsAreaM2 * (pricing.pricePerSquareMeterFronts || 0);
  const countertopCost = countertopAreaM2 * (pricing.pricePerSquareMeterCountertop || 0);

  // Combined Subtotal: Linear units + Countertop OR Fronts + Carcass
  const unitsSubtotal = (baseCost + wallCost + tallCost) > 0 
    ? (baseCost + wallCost + tallCost) 
    : (frontsCost + (totalWoodPanelsAreaM2 * (pricing.pricePerSquareMeterCarcass || 0)));

  const accessoriesCost = pricing.accessoriesCost || 0;
  const rawSubtotal = unitsSubtotal + countertopCost + accessoriesCost;

  const installationCost = (rawSubtotal * (pricing.installationCostPercentage || 0)) / 100;
  const subtotalWithInstall = rawSubtotal + installationCost;

  const discount = pricing.discountAmount || 0;
  const taxableAmount = Math.max(0, subtotalWithInstall - discount);
  const tax = (taxableAmount * (pricing.taxPercentage || 0)) / 100;
  const finalTotal = Math.round(taxableAmount + tax);

  return {
    baseLinearM,
    wallLinearM,
    tallLinearM,
    totalLinearM,
    frontsAreaM2,
    countertopAreaM2,
    backsplashAreaM2,
    totalWoodPanelsAreaM2,
    roomFloorAreaM2,
    baseCost: Math.round(baseCost),
    wallCost: Math.round(wallCost),
    tallCost: Math.round(tallCost),
    frontsCost: Math.round(frontsCost),
    countertopCost: Math.round(countertopCost),
    accessoriesCost: Math.round(accessoriesCost),
    installationCost: Math.round(installationCost),
    subtotal: Math.round(subtotalWithInstall),
    discount: Math.round(discount),
    tax: Math.round(tax),
    finalTotal,
  };
}
