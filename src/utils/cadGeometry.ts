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

export function getRotatedDimensions(width: number, depth: number, rotation: number): { w: number; d: number } {
  const norm = ((rotation % 360) + 360) % 360;
  if (norm === 90 || norm === 270) {
    return { w: depth, d: width };
  }
  return { w: width, d: depth };
}

export function calculateSnap(
  currentX: number,
  currentY: number,
  width: number,
  depth: number,
  rotation: number,
  walls: Wall[],
  otherCabinets: CabinetItem[],
  gridSize: number = 50,
  snapThreshold: number = 60
): SnapResult {
  let snapX = snapToGrid(currentX, gridSize);
  let snapY = snapToGrid(currentY, gridSize);
  let snappedWall: string | undefined;
  let snappedCab: string | undefined;
  const guideLines: { x1: number; y1: number; x2: number; y2: number; label?: string }[] = [];

  const { w, d } = getRotatedDimensions(width, depth, rotation);

  // 1. Wall Snapping (Check proximity to 4 main walls)
  for (const wall of walls) {
    // Wall A (Top / Back wall at y = 0)
    if (wall.startY === 0 && wall.endY === 0) {
      if (Math.abs(currentY) < snapThreshold) {
        snapY = 0;
        snappedWall = wall.id;
      }
    }
    // Wall B (Right wall at x = roomWidth)
    if (wall.startX === wall.endX && wall.startX > 0) {
      if (Math.abs(currentX + w - wall.startX) < snapThreshold) {
        snapX = wall.startX - w;
        snappedWall = wall.id;
      }
    }
    // Wall C (Bottom wall at y = roomLength)
    if (wall.startY === wall.endY && wall.startY > 0) {
      if (Math.abs(currentY + d - wall.startY) < snapThreshold) {
        snapY = wall.startY - d;
        snappedWall = wall.id;
      }
    }
    // Wall D (Left wall at x = 0)
    if (wall.startX === 0 && wall.endX === 0) {
      if (Math.abs(currentX) < snapThreshold) {
        snapX = 0;
        snappedWall = wall.id;
      }
    }
  }

  // 2. Cabinet-to-Cabinet Snapping (Side-by-side flush attachment)
  for (const cab of otherCabinets) {
    const cabDim = getRotatedDimensions(cab.width, cab.depth, cab.rotation);
    
    // Check if side-by-side along X (same Y alignment)
    if (Math.abs(snapY - cab.y) < 30) {
      // Left of cab
      if (Math.abs(currentX + w - cab.x) < snapThreshold) {
        snapX = cab.x - w;
        snapY = cab.y;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX + w, y1: snapY - 100, x2: snapX + w, y2: snapY + d + 100, label: 'Flush' });
      }
      // Right of cab
      if (Math.abs(currentX - (cab.x + cabDim.w)) < snapThreshold) {
        snapX = cab.x + cabDim.w;
        snapY = cab.y;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX, y1: snapY - 100, x2: snapX, y2: snapY + d + 100, label: 'Flush' });
      }
    }

    // Check if side-by-side along Y (same X alignment)
    if (Math.abs(snapX - cab.x) < 30) {
      // Above cab
      if (Math.abs(currentY + d - cab.y) < snapThreshold) {
        snapY = cab.y - d;
        snapX = cab.x;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX - 100, y1: snapY + d, x2: snapX + w + 100, y2: snapY + d, label: 'Flush' });
      }
      // Below cab
      if (Math.abs(currentY - (cab.y + cabDim.d)) < snapThreshold) {
        snapY = cab.y + cabDim.d;
        snapX = cab.x;
        snappedCab = cab.id;
        guideLines.push({ x1: snapX - 100, y1: snapY, x2: snapX + w + 100, y2: snapY, label: 'Flush' });
      }
    }
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

  // Look for facing base cabinets
  const baseCabs = cabinets.filter(c => c.category === 'base' || c.category === 'tall' || c.category === 'corner');
  
  for (let i = 0; i < baseCabs.length; i++) {
    for (let j = i + 1; j < baseCabs.length; j++) {
      const c1 = baseCabs[i];
      const c2 = baseCabs[j];

      // Opposite facing along Y axis
      if (c1.rotation === 0 && c2.rotation === 180) {
        const c1Bottom = c1.y + c1.depth;
        const c2Top = c2.y;
        const dist = c2Top - c1Bottom;

        if (dist > 300 && dist < 2500) {
          // Check overlap in X
          const overlapStart = Math.max(c1.x, c2.x);
          const overlapEnd = Math.min(c1.x + c1.width, c2.x + c2.width);
          if (overlapEnd > overlapStart) {
            const midX = (overlapStart + overlapEnd) / 2;
            aisles.push({
              x1: midX,
              y1: c1Bottom,
              x2: midX,
              y2: c2Top,
              distance: dist,
              label: `Aisle: ${Math.round(dist)} mm`,
            });
          }
        }
      }
    }
  }

  return aisles;
}

export function getWallCabinets(wallId: string, cabinets: CabinetItem[]): CabinetItem[] {
  return cabinets.filter(c => c.wallId === wallId || inferCabinetWall(c) === wallId);
}

export function inferCabinetWall(cab: CabinetItem): string {
  if (cab.wallId) return cab.wallId;
  if (cab.rotation === 0) return 'wall-a';
  if (cab.rotation === 90) return 'wall-b';
  if (cab.rotation === 180) return 'wall-c';
  if (cab.rotation === 270) return 'wall-d';
  return 'wall-a';
}
