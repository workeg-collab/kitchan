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
  materialName: string = 'Melamine 18mm'
): CabinetBreakout {
  const { boardThickness, backPanelThickness, backPanelRecess, doorReveal, shelfSetback } = settings;
  const W = cab.width;
  const H = cab.height;
  const D = cab.depth;

  const panels: CuttingPanel[] = [];
  const hardware: HardwareItem[] = [];

  // 1. Carcase Sides (Left and Right Gable)
  panels.push({
    id: `${cab.id}-SIDE-L`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'Left Side Panel',
    quantity: 1,
    length: H,
    width: D,
    thickness: boardThickness,
    material: cab.materialBody || materialName,
    edgeBanding: { top: false, bottom: false, left: false, right: true }, // Front edge banded
  });

  panels.push({
    id: `${cab.id}-SIDE-R`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'Right Side Panel',
    quantity: 1,
    length: H,
    width: D,
    thickness: boardThickness,
    material: cab.materialBody || materialName,
    edgeBanding: { top: false, bottom: false, left: false, right: true },
  });

  // 2. Carcase Bottom Panel
  const internalWidth = W - 2 * boardThickness;
  panels.push({
    id: `${cab.id}-BOT`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'Bottom Panel',
    quantity: 1,
    length: internalWidth,
    width: D,
    thickness: boardThickness,
    material: cab.materialBody || materialName,
    edgeBanding: { top: false, bottom: false, left: false, right: true },
  });

  // 3. Top Panel / Top Rails
  if (cab.category === 'base' || cab.type === 'base-sink') {
    // Base cabinets usually have 2 top stretcher rails (e.g. 100mm wide)
    panels.push({
      id: `${cab.id}-TOP-RAIL-F`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: 'Front Top Stretcher Rail',
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
      partName: 'Rear Top Stretcher Rail',
      quantity: 1,
      length: internalWidth,
      width: 100,
      thickness: boardThickness,
      material: cab.materialBody || materialName,
      edgeBanding: { top: false, bottom: false, left: false, right: false },
    });
  } else {
    // Wall and Tall units have full solid top panel
    panels.push({
      id: `${cab.id}-TOP`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: 'Top Panel',
      quantity: 1,
      length: internalWidth,
      width: D,
      thickness: boardThickness,
      material: cab.materialBody || materialName,
      edgeBanding: { top: false, bottom: false, left: false, right: true },
    });
  }

  // 4. Back Panel (Grooved 6mm or 3mm back, inset by recess)
  const backHeight = H - 2 * boardThickness + 16; // 8mm groove top and bottom
  const backWidth = internalWidth + 16; // 8mm groove each side
  panels.push({
    id: `${cab.id}-BACK`,
    cabinetId: cab.id,
    cabinetName: cab.name,
    partName: 'Back Panel (Grooved)',
    quantity: 1,
    length: backHeight,
    width: backWidth,
    thickness: backPanelThickness,
    material: 'HDF White Backing',
    edgeBanding: { top: false, bottom: false, left: false, right: false },
    notes: `Recessed ${backPanelRecess}mm from rear`,
  });

  // 5. Internal Shelves
  if (cab.shelfCount > 0) {
    const shelfDepth = D - backPanelRecess - backPanelThickness - shelfSetback;
    const shelfWidth = internalWidth - 2; // 1mm play on each side
    panels.push({
      id: `${cab.id}-SHELF`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: 'Adjustable Shelf',
      quantity: cab.shelfCount,
      length: shelfWidth,
      width: Math.max(shelfDepth, 150),
      thickness: boardThickness,
      material: cab.materialBody || materialName,
      edgeBanding: { top: false, bottom: false, left: false, right: true },
    });

    // Hardware: Shelf pins (4 per shelf)
    hardware.push({
      id: `${cab.id}-HW-PINS`,
      name: '5mm Metal Shelf Pins',
      category: 'shelf-pin',
      quantity: cab.shelfCount * 4,
      unit: 'pcs',
      description: 'Nickel-plated shelf support pins',
    });
  }

  // 6. Door Fronts
  if (cab.doorCount > 0) {
    const doorHeight = H - doorReveal;
    const doorWidth = cab.doorCount === 1 
      ? W - doorReveal 
      : Math.round((W - (cab.doorCount + 1) * doorReveal) / cab.doorCount);

    panels.push({
      id: `${cab.id}-DOOR`,
      cabinetId: cab.id,
      cabinetName: cab.name,
      partName: cab.doorCount === 1 ? 'Door Front' : `Door Front (1 of ${cab.doorCount})`,
      quantity: cab.doorCount,
      length: doorHeight,
      width: doorWidth,
      thickness: boardThickness,
      material: cab.materialFront || 'Front Finish',
      edgeBanding: { top: true, bottom: true, left: true, right: true }, // All 4 edges banded
    });

    // Hinges: 2 hinges for H <= 900mm, 3 for H <= 1600mm, 4 for H > 1600mm
    let hingesPerDoor = 2;
    if (H > 1600) hingesPerDoor = 4;
    else if (H > 900) hingesPerDoor = 3;

    hardware.push({
      id: `${cab.id}-HW-HINGE`,
      name: '110° Soft-Close Concealed Hinge + Baseplate',
      category: 'hinge',
      quantity: cab.doorCount * hingesPerDoor,
      unit: 'pcs',
      description: 'Clip-on soft-close 35mm cup hinges',
    });

    if (cab.handleType && cab.handleType !== 'handleless' && cab.handleType !== 'none') {
      hardware.push({
        id: `${cab.id}-HW-HANDLE`,
        name: `Handle (${cab.handleType})`,
        category: 'handle',
        quantity: cab.doorCount,
        unit: 'pcs',
        description: 'Cabinet pull handle with M4 fixing bolts',
      });
    }
  }

  // 7. Drawers
  if (cab.drawerCount > 0) {
    const availableHeight = H - (cab.drawerCount + 1) * doorReveal;
    const drawerHeights: number[] = [];

    if (cab.drawerCount === 2) {
      // 2 equal deep drawers
      const dh = Math.round(availableHeight / 2);
      drawerHeights.push(dh, dh);
    } else if (cab.drawerCount === 3) {
      // 1 shallow top (e.g. 140mm) + 2 equal deep
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
        partName: `Drawer Front #${idx + 1}`,
        quantity: 1,
        length: dh,
        width: W - doorReveal,
        thickness: boardThickness,
        material: cab.materialFront || 'Front Finish',
        edgeBanding: { top: true, bottom: true, left: true, right: true },
      });
    });

    // Drawer Slides
    hardware.push({
      id: `${cab.id}-HW-SLIDES`,
      name: 'Soft-Close Full Extension Drawer Slides (500mm)',
      category: 'slide',
      quantity: cab.drawerCount,
      unit: 'pairs',
      description: 'Undermount synchronized 40kg soft-close runners',
    });

    if (cab.handleType && cab.handleType !== 'handleless' && cab.handleType !== 'none') {
      hardware.push({
        id: `${cab.id}-HW-DRW-HANDLE`,
        name: `Handle (${cab.handleType})`,
        category: 'handle',
        quantity: cab.drawerCount,
        unit: 'pcs',
        description: 'Drawer pull handle',
      });
    }
  }

  // 8. Base Plinth Legs
  if (cab.category === 'base' || cab.category === 'tall' || cab.category === 'corner') {
    hardware.push({
      id: `${cab.id}-HW-LEGS`,
      name: 'Adjustable Kitchen Plinth Legs (100-150mm)',
      category: 'leg',
      quantity: 4,
      unit: 'pcs',
      description: 'Heavy duty levelling feet with plinth clip',
    });
  }

  // Hardware: Carcase assembly screws & cams
  hardware.push({
    id: `${cab.id}-HW-SCREWS`,
    name: 'Confirmat Assembly Screws 7x50mm',
    category: 'screw',
    quantity: 16,
    unit: 'pcs',
    description: 'Carcase connecting screws',
  });

  // Calculate total panel area in m²
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

  // Sheet estimate for standard 2800 x 2070 mm (5.796 m²) panel with 15% kerf/waste factor
  const standardSheetAreaM2 = (2800 * 2070) / 1000000; // ~5.8 m²
  const wasteFactor = 1.15;
  const sheetsNeeded = Math.max(1, Math.ceil((totalAreaM2 * wasteFactor) / standardSheetAreaM2));

  return {
    allPanels,
    aggregatedHardware: Array.from(hwMap.values()),
    totalAreaM2: Number(totalAreaM2.toFixed(2)),
    sheetEstimates: {
      standardSheetSize: '2800 x 2070 x 18 mm',
      sheetsNeeded,
      sheetAreaM2: Number(standardSheetAreaM2.toFixed(2)),
      efficiencyPercentage: Math.min(92, Math.round((totalAreaM2 / (sheetsNeeded * standardSheetAreaM2)) * 100)),
    },
  };
}
