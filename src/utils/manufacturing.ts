import { CabinetItem, ManufacturingSettings, CuttingPanel, HardwareItem } from '../types';

export interface CabinetBreakout {
  cabinet: CabinetItem;
  panels: CuttingPanel[];
  hardware: HardwareItem[];
  totalAreaM2: number;
}

export function generateCabinetBreakout(
  cab: CabinetItem,
  settings: ManufacturingSettings,
  materialName: string = 'ميلامين 18 مم'
): CabinetBreakout {
  const { boardThickness, backPanelThickness, backPanelRecess, doorReveal, shelfSetback } = settings;
  const W = cab.width;
  const H = cab.height;
  const D = cab.depth;

  const panels: CuttingPanel[] = [];
  const hardware: HardwareItem[] = [];

  // 1. جوانب الشاسيه (جنب يسار ويمين)
  panels.push({
    id: `${cab.id}-SIDE-L`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'جنب شاسيه يسار',
    quantity: 1,
    length: H,
    width: D,
    thickness: boardThickness,
    material: cab.materialBody || materialName,
    edgeBanding: { top: false, bottom: false, left: false, right: true },
  });

  panels.push({
    id: `${cab.id}-SIDE-R`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'جنب شاسيه يمين',
    quantity: 1,
    length: H,
    width: D,
    thickness: boardThickness,
    material: cab.materialBody || materialName,
    edgeBanding: { top: false, bottom: false, left: false, right: true },
  });

  // 2. قاع الشاسيه
  const internalWidth = W - 2 * boardThickness;
  panels.push({
    id: `${cab.id}-BOT`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'قاع شاسيه سفلي',
    quantity: 1,
    length: internalWidth,
    width: D,
    thickness: boardThickness,
    material: cab.materialBody || materialName,
    edgeBanding: { top: false, bottom: false, left: false, right: true },
  });

  // 3. سقف الوحدة أو عوارض الربط
  if (cab.category === 'base' || cab.type === 'base-sink') {
    panels.push({
      id: `${cab.id}-TOP-RAIL-F`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: 'عارضة تثبيت علوية أمامية',
      quantity: 1,
      length: internalWidth,
      width: 100,
      thickness: boardThickness,
      material: cab.materialBody || materialName,
      edgeBanding: { top: false, bottom: false, left: false, right: true },
    });
    panels.push({
      id: `${cab.id}-TOP-RAIL-B`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: 'عارضة تثبيت علوية خلفية',
      quantity: 1,
      length: internalWidth,
      width: 100,
      thickness: boardThickness,
      material: cab.materialBody || materialName,
      edgeBanding: { top: false, bottom: false, left: false, right: false },
    });
  } else {
    panels.push({
      id: `${cab.id}-TOP`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: 'سقف شاسيه علوي',
      quantity: 1,
      length: internalWidth,
      width: D,
      thickness: boardThickness,
      material: cab.materialBody || materialName,
      edgeBanding: { top: false, bottom: false, left: false, right: true },
    });
  }

  // 4. ظهر الوحدة المحفور
  const backHeight = H - 2 * boardThickness + 16;
  const backWidth = internalWidth + 16;
  panels.push({
    id: `${cab.id}-BACK`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'ظهر شاسيه (مفحور 6 مم)',
    quantity: 1,
    length: backHeight,
    width: backWidth,
    thickness: backPanelThickness,
    material: 'أبلكاش / MDF أبيض 6 مم',
    edgeBanding: { top: false, bottom: false, left: false, right: false },
    notes: `مفحور على بعد ${backPanelRecess} مم`,
  });

  // 5. رفوف داخلية
  if (cab.shelfCount > 0) {
    const shelfDepth = D - backPanelRecess - backPanelThickness - shelfSetback;
    const shelfWidth = internalWidth - 2;
    panels.push({
      id: `${cab.id}-SHELF`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: 'رف داخلي متحرك',
      quantity: cab.shelfCount,
      length: shelfWidth,
      width: Math.max(shelfDepth, 150),
      thickness: boardThickness,
      material: cab.materialBody || materialName,
      edgeBanding: { top: false, bottom: false, left: false, right: true },
    });

    hardware.push({
      id: `${cab.id}-HW-PINS`,
      name: 'كوابيل وعصافير رفوف 5 مم نيكل',
      category: 'shelf-pin',
      quantity: cab.shelfCount * 4,
      unit: 'قطعة',
      description: 'كوابيل تثبيت الرفوف المعدنية',
    });
  }

  // 6. ضلف الأبواب
  if (cab.doorCount > 0) {
    const doorHeight = H - doorReveal;
    const doorWidth = cab.doorCount === 1 
      ? W - doorReveal 
      : Math.round((W - (cab.doorCount + 1) * doorReveal) / cab.doorCount);

    panels.push({
      id: `${cab.id}-DOOR`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: cab.doorCount === 1 ? 'ضلفة باب واجهة' : `ضلفة باب واجهة (1 من ${cab.doorCount})`,
      quantity: cab.doorCount,
      length: doorHeight,
      width: doorWidth,
      thickness: boardThickness,
      material: cab.materialFront || 'خامة الواجهة',
      edgeBanding: { top: true, bottom: true, left: true, right: true },
    });

    let hingesPerDoor = 2;
    if (H > 1600) hingesPerDoor = 4;
    else if (H > 900) hingesPerDoor = 3;

    hardware.push({
      id: `${cab.id}-HW-HINGE`,
      name: 'مفصلة سوفت كلوز هيدروليك 110° + كعب',
      category: 'hinge',
      quantity: cab.doorCount * hingesPerDoor,
      unit: 'قطعة',
      description: 'مفصلات باستم هيدروليك غلق هادئ',
    });

    if (cab.handleType && cab.handleType !== 'handleless' && cab.handleType !== 'none') {
      hardware.push({
        id: `${cab.id}-HW-HANDLE`,
        name: `مقبض (${cab.handleType})`,
        category: 'handle',
        quantity: cab.doorCount,
        unit: 'قطعة',
        description: 'مقبض سحب للضلفة مع مسامير M4',
      });
    }
  }

  // 7. الأدراج
  if (cab.drawerCount > 0) {
    const availableHeight = H - (cab.drawerCount + 1) * doorReveal;
    const drawerHeights: number[] = [];

    if (cab.drawerCount === 2) {
      const dh = Math.round(availableHeight / 2);
      drawerHeights.push(dh, dh);
    } else if (cab.drawerCount === 3) {
      const topH = 140;
      const remH = Math.round((availableHeight - topH) / 2);
      drawerHeights.push(topH, remH, remH);
    } else if (cab.drawerCount === 4) {
      const dh = Math.round(availableHeight / 4);
      drawerHeights.push(dh, dh, dh, dh);
    }

    drawerHeights.forEach((dh, idx) => {
      panels.push({
        id: `${cab.id}-DRW-FRONT-${idx + 1}`,
        cabinetId: cab.id,
        cabinetName: cab.name,
        partName: `وش درج واجهة #${idx + 1}`,
        quantity: 1,
        length: dh,
        width: W - doorReveal,
        thickness: boardThickness,
        material: cab.materialFront || 'خامة الواجهة',
        edgeBanding: { top: true, bottom: true, left: true, right: true },
      });
    });

    hardware.push({
      id: `${cab.id}-HW-SLIDES`,
      name: 'طقم مجاري درج باستم سوفت كلوز سفلية (50 سم)',
      category: 'slide',
      quantity: cab.drawerCount,
      unit: 'طقم',
      description: 'مجاري هيدروليك سحب كامل حمولة 40 كجم',
    });

    if (cab.handleType && cab.handleType !== 'handleless' && cab.handleType !== 'none') {
      hardware.push({
        id: `${cab.id}-HW-DRW-HANDLE`,
        name: `مقبض درج (${cab.handleType})`,
        category: 'handle',
        quantity: cab.drawerCount,
        unit: 'قطعة',
        description: 'مقبض سحب للدرج',
      });
    }
  }

  // 8. أرجل الوزرة
  if (cab.category === 'base' || cab.category === 'tall' || cab.category === 'corner') {
    hardware.push({
      id: `${cab.id}-HW-LEGS`,
      name: 'أرجل مطبخ بلاستيك رجلاش قابلة للتعديل (10-15 سم)',
      category: 'leg',
      quantity: 4,
      unit: 'قطعة',
      description: 'أرجل ليفل مع كلبس تثبيت الوزرة',
    });
  }

  hardware.push({
    id: `${cab.id}-HW-SCREWS`,
    name: 'مسامير تجميع شاسيه كونفرمات 7×50 مم',
    category: 'screw',
    quantity: 16,
    unit: 'قطعة',
    description: 'مسامير ربط وتجميع الألواح',
  });

  const totalAreaM2 = panels.reduce((acc, p) => {
    return acc + (p.length * p.width * p.quantity) / 1000000;
  }, 0);

  return {
    cabinet: cab,
    panels,
    hardware,
    totalAreaM2: Number(totalAreaM2.toFixed(3)),
  };
}

export function generateFullProjectBOM(
  cabinets: CabinetItem[],
  settings: ManufacturingSettings
): {
  allPanels: CuttingPanel[];
  aggregatedHardware: { name: string; category: string; quantity: number; unit: string; description: string }[];
  totalAreaM2: number;
  sheetEstimates: { standardSheetSize: string; sheetsNeeded: number; sheetAreaM2: number; efficiencyPercentage: number };
} {
  const allPanels: CuttingPanel[] = [];
  const hwMap = new Map<string, { name: string; category: string; quantity: number; unit: string; description: string }>();
  let totalAreaM2 = 0;

  cabinets.forEach(cab => {
    const breakout = generateCabinetBreakout(cab, settings);
    allPanels.push(...breakout.panels);
    totalAreaM2 += breakout.totalAreaM2;

    breakout.hardware.forEach(hw => {
      const key = `${hw.name}__${hw.unit}`;
      const existing = hwMap.get(key);
      if (existing) {
        existing.quantity += hw.quantity;
      } else {
        hwMap.set(key, { ...hw });
      }
    });
  });

  const standardSheetAreaM2 = (2800 * 2070) / 1000000; // ~5.8 m²
  const wasteFactor = 1.15;
  const sheetsNeeded = Math.max(1, Math.ceil((totalAreaM2 * wasteFactor) / standardSheetAreaM2));

  return {
    allPanels,
    aggregatedHardware: Array.from(hwMap.values()),
    totalAreaM2: Number(totalAreaM2.toFixed(2)),
    sheetEstimates: {
      standardSheetSize: '2800 × 2070 × 18 مم',
      sheetsNeeded,
      sheetAreaM2: Number(standardSheetAreaM2.toFixed(2)),
      efficiencyPercentage: Math.min(92, Math.round((totalAreaM2 / (sheetsNeeded * standardSheetAreaM2)) * 100)),
    },
  };
}
