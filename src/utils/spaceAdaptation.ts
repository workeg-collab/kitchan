import { ProjectData, CabinetItem, ApplianceItem, DimensionConflict, Wall } from '../types';
import { getItemBoundingBox } from './cadGeometry';

export interface SpaceAdaptationResult {
  adaptedProject: ProjectData;
  conflicts: DimensionConflict[];
  summary: {
    originalWidth: number;
    originalLength: number;
    originalHeight: number;
    targetWidth: number;
    targetLength: number;
    targetHeight: number;
    deltaWidth: number;
    deltaLength: number;
    deltaHeight: number;
    adjustedCabinetsCount: number;
  };
}

const STANDARD_CABINET_WIDTHS = [150, 200, 300, 350, 400, 450, 500, 600, 800, 900, 1000, 1200];

/**
 * Snap a dimension to the nearest standard cabinet manufacturing width
 */
export function snapToStandardWidth(width: number): number {
  let closest = STANDARD_CABINET_WIDTHS[0];
  let minDiff = Math.abs(width - closest);
  for (const sw of STANDARD_CABINET_WIDTHS) {
    const diff = Math.abs(width - sw);
    if (diff < minDiff) {
      minDiff = diff;
      closest = sw;
    }
  }
  return closest;
}

/**
 * Intelligently adapt a project template to custom room dimensions
 */
export function adaptProjectToSpace(
  originalProject: ProjectData,
  targetWidth: number,
  targetLength: number,
  targetHeight: number,
  preserveIsland: boolean = true
): SpaceAdaptationResult {
  const cloned: ProjectData = JSON.parse(JSON.stringify(originalProject));
  const origW = cloned.room.width;
  const origL = cloned.room.length;
  const origH = cloned.room.ceilingHeight || 2600;
  const wallThickness = cloned.room.wallThickness || 150;

  const scaleX = origW > 0 ? targetWidth / origW : 1;
  const scaleY = origL > 0 ? targetLength / origL : 1;
  const scaleZ = origH > 0 ? targetHeight / origH : 1;

  // 1. Update Room Dimensions & Walls
  const newWalls: Wall[] = [
    { id: 'wall-a', name: 'الجدار أ (الخلفي)', startX: 0, startY: 0, endX: targetWidth, endY: 0, thickness: wallThickness, height: targetHeight },
    { id: 'wall-b', name: 'الجدار ب (الأيمن)', startX: targetWidth, startY: 0, endX: targetWidth, endY: targetLength, thickness: wallThickness, height: targetHeight },
    { id: 'wall-c', name: 'الجدار ج (الأمامي)', startX: targetWidth, startY: targetLength, endX: 0, endY: targetLength, thickness: wallThickness, height: targetHeight },
    { id: 'wall-d', name: 'الجدار د (الأيسر)', startX: 0, startY: targetLength, endX: 0, endY: 0, thickness: wallThickness, height: targetHeight },
  ];

  cloned.room.width = targetWidth;
  cloned.room.length = targetLength;
  cloned.room.ceilingHeight = targetHeight;
  cloned.room.walls = newWalls;

  let adjustedCount = 0;
  const conflicts: DimensionConflict[] = [];

  // 2. Classify and Adapt Cabinets
  // Group cabinets by wall affiliation or coordinate anchor
  const adaptedCabinets: CabinetItem[] = cloned.cabinets.map((cab) => {
    let newX = cab.x;
    let newY = cab.y;
    let newZ = cab.z;
    let newWidth = cab.width;
    let newHeight = cab.height;
    let newDepth = cab.depth;

    const isIsland = cab.category === 'island' || cab.type === 'base-island-cabinet';
    const isCorner = cab.category === 'corner' || cab.type.includes('corner');
    const isTall = cab.category === 'tall' || cab.category === 'wardrobe';
    const isBed = cab.category === 'bed';

    // A) Wall A Attachments (y approx 0)
    if (cab.y < 300 && !isIsland) {
      if (isCorner && cab.x > origW / 2) {
        // Corner attached to Wall A & Wall B (Right Corner)
        newX = targetWidth - cab.width;
      } else if (!isCorner) {
        // Proportional shift along Wall A
        newX = cab.x * scaleX;
        // If modular unit (not corner / tall tower), adapt width slightly
        if (!isTall && !isBed && cab.width >= 450) {
          const scaledW = cab.width * scaleX;
          newWidth = Math.max(300, Math.min(1200, Math.round(scaledW / 50) * 50));
        }
      }
    }

    // B) Wall B Attachments (x approx origW)
    else if (cab.x > origW - 800 && !isIsland) {
      newX = targetWidth;
      newY = cab.y * scaleY;
      if (!isTall && cab.width >= 450) {
        newWidth = Math.max(300, Math.min(1200, Math.round((cab.width * scaleY) / 50) * 50));
      }
    }

    // C) Wall C Attachments (y approx origL)
    else if (cab.y > origL - 800 && !isIsland) {
      newY = targetLength;
      newX = cab.x * scaleX;
    }

    // D) Wall D Attachments (x approx 0)
    else if (cab.x < 300 && !isIsland) {
      newX = 0;
      newY = cab.y * scaleY;
    }

    // E) Central Islands & Independent Units
    else if (isIsland) {
      if (preserveIsland) {
        // Center island in available room clearance
        newX = (targetWidth - cab.width) / 2;
        newY = (targetLength - cab.depth) / 2;
      } else {
        newX = cab.x * scaleX;
        newY = cab.y * scaleY;
      }
    } else {
      newX = cab.x * scaleX;
      newY = cab.y * scaleY;
    }

    // F) Height adjustments if ceiling height changed
    if (isTall && targetHeight < 2400 && newHeight > targetHeight - 100) {
      newHeight = targetHeight - 100;
      conflicts.push({
        id: `conf-height-${cab.id}`,
        type: 'wall-overflow',
        severity: 'warning',
        message: `تم تخفيض ارتفاع الدولاب ${cab.name} ليناسب سقف الغرفة (${targetHeight} مم)`,
        involvedCabinetId: cab.id,
        involvedCabinetName: cab.name,
        suggestedFix: 'تم ضبط الارتفاع تلقائياً',
      });
    }

    // Ensure within bounding box
    const bbox = getItemBoundingBox(newX, newY, newWidth, newDepth, cab.rotation);
    if (bbox.maxX > targetWidth) {
      newX = Math.max(0, newX - (bbox.maxX - targetWidth));
    }
    if (bbox.maxY > targetLength) {
      newY = Math.max(0, newY - (bbox.maxY - targetLength));
    }

    if (newX !== cab.x || newY !== cab.y || newWidth !== cab.width || newHeight !== cab.height) {
      adjustedCount++;
    }

    return {
      ...cab,
      x: Math.round(newX),
      y: Math.round(newY),
      z: Math.round(newZ),
      width: Math.round(newWidth),
      height: Math.round(newHeight),
      depth: Math.round(newDepth),
    };
  });

  // 3. Adapt Appliances
  const adaptedAppliances: ApplianceItem[] = cloned.appliances.map((app) => {
    let newX = app.x * scaleX;
    let newY = app.y * scaleY;

    if (app.x > origW - 800) newX = targetWidth;
    if (app.y > origL - 800) newY = targetLength;

    return {
      ...app,
      x: Math.round(newX),
      y: Math.round(newY),
    };
  });

  // 4. Clearance & Conflict Checking
  // Check for island aisle clearances (Minimum standard aisle is 900mm)
  const islandUnits = adaptedCabinets.filter((c) => c.category === 'island');
  const baseUnits = adaptedCabinets.filter((c) => c.category === 'base' || c.category === 'tall');

  islandUnits.forEach((island) => {
    const islandBox = getItemBoundingBox(island.x, island.y, island.width, island.depth, island.rotation);
    
    // Check distance to Wall A base cabinets
    const minClearanceTop = islandBox.minY - 600; // Assuming 600mm base unit depth
    const minClearanceBottom = targetLength - islandBox.maxY;
    const minClearanceLeft = islandBox.minX;
    const minClearanceRight = targetWidth - islandBox.maxX;

    if (minClearanceTop < 800 || minClearanceBottom < 800 || minClearanceLeft < 800 || minClearanceRight < 800) {
      conflicts.push({
        id: `conf-clearance-${island.id}`,
        type: 'aisle-clearance',
        severity: 'warning',
        message: `المسافة حول الجزيرة (${Math.round(Math.min(minClearanceTop, minClearanceLeft))} مم) أقل من الحد الأدنى الموصى به لحرية الحركة (900 مم)`,
        involvedCabinetId: island.id,
        involvedCabinetName: island.name,
        suggestedFix: 'تصغير أبعاد الجزيرة أو تحويلها إلى شبه جزيرة (Peninsula) متصلة بالجدار',
      });
    }
  });

  // Check total run along Wall A vs Wall A Width
  const wallACabinets = adaptedCabinets.filter((c) => c.y < 200 && c.rotation === 0);
  const totalWallAWidth = wallACabinets.reduce((sum, c) => sum + c.width, 0);
  if (totalWallAWidth > targetWidth + 50) {
    conflicts.push({
      id: 'conf-wall-a-overflow',
      type: 'wall-overflow',
      severity: 'error',
      message: `مجموع عروض وحدات الجدار أ (${totalWallAWidth} مم) يتجاوز عرض الجدار الجديد (${targetWidth} مم) بمقدار ${Math.round(totalWallAWidth - targetWidth)} مم`,
      suggestedFix: 'إزالة إحدى الوحدات الفرعية أو تقليص عروض الوحدات المعيارية',
    });
  }

  cloned.cabinets = adaptedCabinets;
  cloned.appliances = adaptedAppliances;

  return {
    adaptedProject: cloned,
    conflicts,
    summary: {
      originalWidth: origW,
      originalLength: origL,
      originalHeight: origH,
      targetWidth,
      targetLength,
      targetHeight,
      deltaWidth: targetWidth - origW,
      deltaLength: targetLength - origL,
      deltaHeight: targetHeight - origH,
      adjustedCabinetsCount: adjustedCount,
    },
  };
}
