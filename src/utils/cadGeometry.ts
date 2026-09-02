import { CabinetItem, Wall, ApplianceItem, ArchitecturalElement } from '../types';

export interface SnapResult {
  x: number;
  y: number;
  rotation?: number;
  snappedToWall?: string;
  snappedToCabinet?: string;
  guideLines?: { x1: number; y1: number; x2: number; y2: number; label?: string }[];
}

export function snapToGrid(val: number, gridSize: number = 50): number {
  return Math.round(val / gridSize) * gridSize;
}

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  widthSpan: number;
  heightSpan: number;
  centerX: number;
  centerY: number;
}

/**
 * Calculates the exact 2D bounding box and center for any object given its anchor (x, y)
 * and its SVG rotation around (0, 0).
 */
export function getItemBoundingBox(
  x: number,
  y: number,
  width: number,
  depth: number,
  rotation: number = 0
): BoundingBox2D {
  const normRot = ((rotation % 360) + 360) % 360;
  let minX = x;
  let maxX = x + width;
  let minY = y;
  let maxY = y + depth;

  if (normRot === 90) {
    // Rotated 90° clockwise: +X goes to +Y, +Y goes to -X
    minX = x - depth;
    maxX = x;
    minY = y;
    maxY = y + width;
  } else if (normRot === 180) {
    // Rotated 180°: +X goes to -X, +Y goes to -Y
    minX = x - width;
    maxX = x;
    minY = y - depth;
    maxY = y;
  } else if (normRot === 270) {
    // Rotated 270°: +X goes to -Y, +Y goes to +X
    minX = x;
    maxX = x + depth;
    minY = y - width;
    maxY = y;
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    widthSpan: maxX - minX,
    heightSpan: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

export function getRotatedDimensions(width: number, depth: number, rotation: number): { w: number; d: number } {
  const norm = ((rotation % 360) + 360) % 360;
  if (norm === 90 || norm === 270) {
    return { w: depth, d: width };
  }
  return { w: width, d: depth };
}

/**
 * Smart Wall Snapping & Boundary Clamping
 * Ensures cabinets and appliances snap flush against walls and NEVER penetrate or stick out outside the walls.
 */
export function calculateSnap(
  currentX: number,
  currentY: number,
  width: number,
  depth: number,
  rotation: number,
  walls: Wall[],
  otherCabinets: CabinetItem[],
  gridSize: number = 50,
  snapThreshold: number = 75,
  roomWidth: number = 4000,
  roomLength: number = 3000
): SnapResult {
  let snapX = snapToGrid(currentX, gridSize);
  let snapY = snapToGrid(currentY, gridSize);
  let snappedWall: string | undefined;
  let snappedCab: string | undefined;
  const guideLines: { x1: number; y1: number; x2: number; y2: number; label?: string }[] = [];

  const normRot = ((rotation % 360) + 360) % 360;

  // 1. Magnetic Flush Snapping to the 4 Walls
  // -------------------------------------------------------------
  // Wall A (Top Wall, y = 0)
  if (normRot === 0) {
    if (Math.abs(snapY) < snapThreshold) {
      snapY = 0;
      snappedWall = 'wall-a';
      guideLines.push({ x1: 0, y1: 0, x2: roomWidth, y2: 0, label: 'جدار أ (الخلفي)' });
    }
  }

  // Wall B (Right Wall, x = roomWidth)
  if (normRot === 90) {
    if (Math.abs(snapX - roomWidth) < snapThreshold) {
      snapX = roomWidth;
      snappedWall = 'wall-b';
      guideLines.push({ x1: roomWidth, y1: 0, x2: roomWidth, y2: roomLength, label: 'جدار ب (الأيمن)' });
    }
  }

  // Wall C (Bottom Wall, y = roomLength)
  if (normRot === 180) {
    if (Math.abs(snapY - roomLength) < snapThreshold) {
      snapY = roomLength;
      snappedWall = 'wall-c';
      guideLines.push({ x1: 0, y1: roomLength, x2: roomWidth, y2: roomLength, label: 'جدار ج (الأمامي)' });
    }
  }

  // Wall D (Left Wall, x = 0)
  if (normRot === 270) {
    if (Math.abs(snapX) < snapThreshold) {
      snapX = 0;
      snappedWall = 'wall-d';
      guideLines.push({ x1: 0, y1: 0, x2: 0, y2: roomLength, label: 'جدار د (الأيسر)' });
    }
  }

  // 2. MAGNETIC CABINET-TO-CABINET FLUSH DOCKING (التصاق العلب ببعضها بدقة 0 مم)
  // -------------------------------------------------------------
  for (const cab of otherCabinets) {
    const cabRot = ((cab.rotation % 360) + 360) % 360;

    // A) Along Top Wall A (rot = 0, y = 0)
    if (normRot === 0 && cabRot === 0 && Math.abs(snapY - cab.y) < 40) {
      snapY = cab.y;
      // Snap to RIGHT of existing cabinet (cab.x + cab.width)
      if (Math.abs(snapX - (cab.x + cab.width)) < snapThreshold) {
        snapX = cab.x + cab.width;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX, y1: 0, x2: snapX, y2: depth + 80, label: `التصاق بـ ${cab.id} (0 مم)` });
      }
      // Snap to LEFT of existing cabinet (cab.x - width)
      else if (Math.abs((snapX + width) - cab.x) < snapThreshold) {
        snapX = cab.x - width;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX + width, y1: 0, x2: snapX + width, y2: depth + 80, label: `التصاق بـ ${cab.id} (0 مم)` });
      }
    }

    // B) Along Right Wall B (rot = 90, x = roomWidth)
    if (normRot === 90 && cabRot === 90 && Math.abs(snapX - cab.x) < 40) {
      snapX = cab.x;
      // Snap to BELOW existing cabinet (cab.y + cab.width)
      if (Math.abs(snapY - (cab.y + cab.width)) < snapThreshold) {
        snapY = cab.y + cab.width;
        snappedCab = cab.id;
        guideLines.push({ x1: roomWidth - depth - 80, y1: snapY, x2: roomWidth, y2: snapY, label: `التصاق بـ ${cab.id} (0 مم)` });
      }
      // Snap to ABOVE existing cabinet (cab.y - width)
      else if (Math.abs((snapY + width) - cab.y) < snapThreshold) {
        snapY = cab.y - width;
        snappedCab = cab.id;
        guideLines.push({ x1: roomWidth - depth - 80, y1: snapY + width, x2: roomWidth, y2: snapY + width, label: `التصاق بـ ${cab.id} (0 مم)` });
      }
    }

    // C) Along Bottom Wall C (rot = 180, y = roomLength)
    if (normRot === 180 && cabRot === 180 && Math.abs(snapY - cab.y) < 40) {
      snapY = cab.y;
      // Snap side-by-side along bottom wall
      if (Math.abs(snapX - (cab.x - cab.width)) < snapThreshold) {
        snapX = cab.x - cab.width;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX, y1: roomLength - depth - 80, x2: snapX, y2: roomLength, label: `التصاق بـ ${cab.id} (0 مم)` });
      } else if (Math.abs((snapX - width) - cab.x) < snapThreshold) {
        snapX = cab.x + width;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX - width, y1: roomLength - depth - 80, x2: snapX - width, y2: roomLength, label: `التصاق بـ ${cab.id} (0 مم)` });
      }
    }

    // D) Along Left Wall D (rot = 270, x = 0)
    if (normRot === 270 && cabRot === 270 && Math.abs(snapX - cab.x) < 40) {
      snapX = cab.x;
      if (Math.abs(snapY - (cab.y - cab.width)) < snapThreshold) {
        snapY = cab.y - cab.width;
        snappedCab = cab.id;
        guideLines.push({ x1: 0, y1: snapY, x2: depth + 80, y2: snapY, label: `التصاق بـ ${cab.id} (0 مم)` });
      } else if (Math.abs((snapY - width) - cab.y) < snapThreshold) {
        snapY = cab.y + width;
        snappedCab = cab.id;
        guideLines.push({ x1: 0, y1: snapY - width, x2: depth + 80, y2: snapY - width, label: `التصاق بـ ${cab.id} (0 مم)` });
      }
    }

    // E) Corner Unit Attachment (e.g. Corner unit on Wall A connecting to Wall B)
    if (cab.type === 'base-corner-l' && normRot === 90 && cabRot === 0) {
      // Wall B unit connecting to bottom face of corner unit on Wall A
      const cornerBottomY = cab.y + cab.depth;
      if (Math.abs(snapY - cornerBottomY) < snapThreshold) {
        snapY = cornerBottomY;
        snapX = roomWidth;
        snappedCab = cab.id;
        guideLines.push({ x1: roomWidth - depth - 80, y1: snapY, x2: roomWidth, y2: snapY, label: `التصاق بالركنة L` });
      }
    }
  }

  // 3. STRICT ROOM BOUNDARY CLAMPING
  // -------------------------------------------------------------
  // Prevent ANY part of the item from sticking outside the room boundaries [0, roomWidth] x [0, roomLength]
  const bbox = getItemBoundingBox(snapX, snapY, width, depth, rotation);

  if (bbox.minX < 0) {
    snapX += (0 - bbox.minX);
  }
  if (bbox.maxX > roomWidth) {
    snapX -= (bbox.maxX - roomWidth);
  }
  if (bbox.minY < 0) {
    snapY += (0 - bbox.minY);
  }
  if (bbox.maxY > roomLength) {
    snapY -= (bbox.maxY - roomLength);
  }

  return {
    x: snapX,
    y: snapY,
    snappedToWall: snappedWall,
    snappedToCabinet: snappedCab,
    guideLines,
  };
}

export function calculateAisleClearance(
  cabinets: CabinetItem[],
  roomWidth: number,
  roomLength: number
): { x1: number; y1: number; x2: number; y2: number; distance: number; label: string }[] {
  const aisles: { x1: number; y1: number; x2: number; y2: number; distance: number; label: string }[] = [];

  const baseCabs = cabinets.filter(c => c.category === 'base' || c.category === 'tall' || c.category === 'corner');
  
  for (let i = 0; i < baseCabs.length; i++) {
    for (let j = i + 1; j < baseCabs.length; j++) {
      const c1 = baseCabs[i];
      const c2 = baseCabs[j];

      // Opposite facing along Y axis
      if (c1.rotation === 0 && c2.rotation === 180) {
        const c1Bottom = c1.y + c1.depth;
        const c2Top = c2.y - c2.depth;
        const dist = c2Top - c1Bottom;

        if (dist > 300 && dist < 2500) {
          const overlapStart = Math.max(c1.x, c2.x - c2.width);
          const overlapEnd = Math.min(c1.x + c1.width, c2.x);
          if (overlapEnd > overlapStart) {
            const midX = (overlapStart + overlapEnd) / 2;
            aisles.push({
              x1: midX,
              y1: c1Bottom,
              x2: midX,
              y2: c2Top,
              distance: Math.round(dist),
              label: `${Math.round(dist)} mm`,
            });
          }
        }
      }
    }
  }

  return aisles;
}

/**
 * Determines whether an object (cabinet, appliance, architectural element)
 * belongs to a specific wall ('wall-a', 'wall-b', 'wall-c', 'wall-d')
 * based on its wallId or spatial position and rotation in the room.
 */
export function isItemOnWall(
  item: { x: number; y: number; width?: number; depth?: number; rotation: number; wallId?: string },
  wallId: string,
  roomWidth: number,
  roomLength: number
): boolean {
  if (item.wallId === wallId) return true;

  if (wallId === 'wall-a') {
    // Back wall at Y = 0
    return (item.y <= 350 || item.rotation === 0);
  }
  if (wallId === 'wall-b') {
    // Right wall at X = roomWidth
    return (item.x >= roomWidth - 950 || item.rotation === 90);
  }
  if (wallId === 'wall-c') {
    // Front wall at Y = roomLength
    return (item.y >= roomLength - 950 || item.rotation === 180);
  }
  if (wallId === 'wall-d') {
    // Left wall at X = 0
    return (item.x <= 350 || item.rotation === 270);
  }
  return false;
}
