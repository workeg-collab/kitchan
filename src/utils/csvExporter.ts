import { ProjectData } from '../types';
import { generateFullProjectBOM } from './manufacturing';

export function exportCabinetScheduleCSV(project: ProjectData): string {
  const headers = ['Cabinet ID', 'Type', 'Category', 'Width (mm)', 'Height (mm)', 'Depth (mm)', 'Elevation Z (mm)', 'Doors', 'Drawers', 'Shelves', 'Wall', 'Hinge', 'Notes'];
  
  const rows = project.cabinets.map(c => [
    `"${c.id}"`,
    `"${c.name}"`,
    `"${c.category}"`,
    c.width,
    c.height,
    c.depth,
    c.z,
    c.doorCount,
    c.drawerCount,
    c.shelfCount,
    `"${c.wallId || 'Independent'}"`,
    `"${c.doorHinge}"`,
    `"${(c.customNotes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

export function exportCuttingListCSV(project: ProjectData): string {
  const { allPanels } = generateFullProjectBOM(project.cabinets, project.manufacturing);
  const headers = ['Cabinet ID', 'Cabinet Name', 'Part Name', 'Quantity', 'Length (mm)', 'Width (mm)', 'Thickness (mm)', 'Material', 'Edge Top', 'Edge Bottom', 'Edge Left', 'Edge Right', 'Notes'];

  const rows = allPanels.map(p => [
    `"${p.cabinetId}"`,
    `"${p.cabinetName}"`,
    `"${p.partName}"`,
    p.quantity,
    p.length,
    p.width,
    p.thickness,
    `"${p.material}"`,
    p.edgeBanding.top ? 'YES' : 'NO',
    p.edgeBanding.bottom ? 'YES' : 'NO',
    p.edgeBanding.left ? 'YES' : 'NO',
    p.edgeBanding.right ? 'YES' : 'NO',
    `"${(p.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

export function exportHardwareBOMCSV(project: ProjectData): string {
  const { aggregatedHardware } = generateFullProjectBOM(project.cabinets, project.manufacturing);
  const headers = ['Category', 'Hardware Item', 'Quantity', 'Unit', 'Description'];

  const rows = aggregatedHardware.map(h => [
    `"${h.category}"`,
    `"${h.name}"`,
    h.quantity,
    `"${h.unit}"`,
    `"${h.description.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}
