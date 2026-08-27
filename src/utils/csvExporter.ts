import { ProjectData } from '../types';
import { generateFullProjectBOM } from './manufacturing';

/**
 * Exports Cabinet Schedule CSV with UTF-8 BOM (\uFEFF) for 100% Arabic support in Excel
 */
export function exportCabinetScheduleCSV(project: ProjectData): string {
  const BOM = '\uFEFF';
  const headers = [
    'كود الكابينة (ID)',
    'اسم الوحدة (Name)',
    'التصنيف (Category)',
    'النوع (Type)',
    'العرض (سم)',
    'الارتفاع (سم)',
    'العمق (سم)',
    'المنسوب من الأرض Z (سم)',
    'الجدار (Wall)',
    'عدد الضلف (Doors)',
    'عدد الأدراج (Drawers)',
    'عدد الرفوف (Shelves)',
    'طراز المفصلات (Hinges)',
    'أبواب قلابة (Lift-Up)',
    'تفريغ حوض (Sink Cutout)',
    'تجويف فرن (Appliance Cavity)',
    'ملاحظات التصنيع (Notes)'
  ];

  const rows = project.cabinets.map(c => [
    `"${c.id}"`,
    `"${c.name}"`,
    `"${c.category}"`,
    `"${c.type}"`,
    (c.width / 10).toFixed(1),
    (c.height / 10).toFixed(1),
    (c.depth / 10).toFixed(1),
    (c.z / 10).toFixed(1),
    `"${c.wallId || 'حر / وسط الغرفة'}"`,
    c.doorCount,
    c.drawerCount,
    c.shelfCount,
    `"${c.doorHinge || 'none'}"`,
    c.flipUpDoor ? 'نعم (قلاب)' : 'لا',
    c.hasSinkCutout ? 'نعم' : 'لا',
    c.hasApplianceCavity ? 'نعم' : 'لا',
    `"${(c.customNotes || '').replace(/"/g, '""')}"`
  ]);

  return BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

/**
 * Exports Panel Cutting List CSV with UTF-8 BOM (\uFEFF)
 */
export function exportCuttingListCSV(project: ProjectData): string {
  const BOM = '\uFEFF';
  const { allPanels } = generateFullProjectBOM(project.cabinets, project.manufacturing);
  
  const headers = [
    'كود الكابينة (Cabinet ID)',
    'اسم الوحدة (Cabinet Name)',
    'اسم القطعة (Part Name)',
    'العدد (Qty)',
    'الطول (سم)',
    'العرض (سم)',
    'السماكة (مم)',
    'الخامة (Material)',
    'قشاط علوي (Edge Top)',
    'قشاط سفلي (Edge Bottom)',
    'قشاط يمين (Edge Right)',
    'قشاط يسار (Edge Left)',
    'ملاحظات (Notes)'
  ];

  const rows = allPanels.map(p => [
    `"${p.cabinetId}"`,
    `"${p.cabinetName}"`,
    `"${p.partName}"`,
    p.quantity,
    (p.length / 10).toFixed(1),
    (p.width / 10).toFixed(1),
    p.thickness,
    `"${p.material}"`,
    p.edgeBanding.top ? 'نعم (2مم)' : '-',
    p.edgeBanding.bottom ? 'نعم (2مم)' : '-',
    p.edgeBanding.right ? 'نعم (2مم)' : '-',
    p.edgeBanding.left ? 'نعم (2مم)' : '-',
    `"${(p.notes || '').replace(/"/g, '""')}"`
  ]);

  return BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

/**
 * Exports Hardware & Accessories BOM CSV with UTF-8 BOM (\uFEFF)
 */
export function exportHardwareBOMCSV(project: ProjectData): string {
  const BOM = '\uFEFF';
  const { aggregatedHardware } = generateFullProjectBOM(project.cabinets, project.manufacturing);
  
  const headers = [
    'التصنيف (Category)',
    'اسم الإكسسوار / الهاردوير (Item Name)',
    'الكمية (Quantity)',
    'الوحدة (Unit)',
    'الوصف والمواصفات (Description)'
  ];

  const rows = aggregatedHardware.map(h => [
    `"${h.category}"`,
    `"${h.name}"`,
    h.quantity,
    `"${h.unit}"`,
    `"${h.description.replace(/"/g, '""')}"`
  ]);

  return BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}
