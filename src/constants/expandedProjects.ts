import { ProjectData, ArchitecturalElement, DesignOption, ProjectType } from '../types';
import { 
  DEFAULT_MANUFACTURING_SETTINGS, 
  DEFAULT_COUNTERTOP_CONFIG, 
  DEFAULT_PLINTH_CONFIG, 
  DEFAULT_BACKSPLASH_CONFIG, 
  DEFAULT_MATERIAL_FINISHES, 
  DEFAULT_PRICING_SETTINGS 
} from './standards';
import { 
  SAMPLE_PROJECT_KITCHEN, 
  SAMPLE_PROJECT_DRESSING, 
  SAMPLE_PROJECT_BEDROOM, 
  SAMPLE_PROJECT_LIBRARY 
} from './sampleProjects';

// =========================================================================
// 1. KITCHENS COLLECTION (8+ LUXURY PROJECTS)
// =========================================================================

// 1.1 LUXURY ISLAND VILLA KITCHEN (5.4m x 4.2m)
export const PROJECT_KITCHEN_LUXURY_ISLAND: ProjectData = {
  metadata: {
    id: 'proj-kitchen-island-01',
    name: 'مطبخ فيلا ملكي مع جزيرة كلكتا جولد وجلسة بار (Villa Calacatta Island)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'فيلا آل المنصوري',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مطبخ مفتوح واسع مع جزيرة وسطية ضخمة بسطح رخام شلالي، برج أجهزة بيلت إن، ودواليب علوية بإضاءة ليد مخفية.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 5400,
    length: 4200,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (جدار الأبراج والحوض)', startX: 0, startY: 0, endX: 5400, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن)', startX: 5400, startY: 0, endX: 5400, endY: 4200, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار ج (الخلفي)', startX: 5400, startY: 4200, endX: 0, endY: 4200, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار د (الأيسر)', startX: 0, startY: 4200, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'win-is', name: 'نافذة بانورامية واسعة فوق الحوض', type: 'window', x: 2200, y: 0, z: 1000, width: 1600, height: 1200, depth: 150, rotation: 0, wallId: 'wall-a' },
      { id: 'door-is', name: 'باب مدخل المطبخ الجانبي', type: 'door', x: 400, y: 4200, z: 0, width: 900, height: 2200, depth: 150, rotation: 180, wallId: 'wall-c' },
    ],
  },
  cabinets: [
    { id: 'T01', name: 'دولاب ثلاجة بيلت إن فخم', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 700, height: 2400, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'right' },
    { id: 'T02', name: 'برج أفران وميكروويف بيلت إن', category: 'tall', type: 'tall-oven-tower', projectType: 'kitchen', width: 600, height: 2400, depth: 600, x: 700, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 1, doorHinge: 'right', hasApplianceCavity: true },
    { id: 'T03', name: 'بانترى تخزين مؤن سحاب (Pantry)', category: 'tall', type: 'tall-pantry-pullout', projectType: 'kitchen', width: 450, height: 2400, depth: 600, x: 1300, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 5, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    { id: 'B01', name: 'سفلي أدراج تخزين عريضة', category: 'base', type: 'base-drawers-2', projectType: 'kitchen', width: 800, height: 720, depth: 580, x: 1750, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'B02', name: 'وحدة حوض غسيل ساقط', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 2550, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'B03', name: 'غسالة صحون مدمجة بالكامل', category: 'base', type: 'base-single-door', projectType: 'kitchen', width: 600, height: 720, depth: 580, x: 3450, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    { id: 'B04', name: 'سفلي أدراج بهارات وتوابل', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 450, height: 720, depth: 580, x: 4050, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'W01', name: 'علوي ضلفة قلاب هيدروليك بلوم', category: 'wall', type: 'wall-lift-up-blum', projectType: 'kitchen', width: 800, height: 720, depth: 350, x: 1750, y: 0, z: 1520, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 1, drawerCount: 0, flipUpDoor: true },
    { id: 'W02', name: 'علوي فيترينة زجاج فوميه مضيء', category: 'wall', type: 'wall-glass-vitrine', projectType: 'kitchen', width: 900, height: 720, depth: 350, x: 2550, y: 0, z: 1520, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
    { id: 'IS01', name: 'جزيرة مطبخ مع طباخ غاز بلت إن', category: 'island', type: 'base-cooktop-housing', projectType: 'kitchen', width: 900, height: 720, depth: 600, x: 2200, y: 2200, z: 100, rotation: 180, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none', hasCooktopCutout: true },
    { id: 'IS02', name: 'جزيرة أدراج تخزين كلكتا', category: 'island', type: 'base-drawers-3', projectType: 'kitchen', width: 900, height: 720, depth: 600, x: 3100, y: 2200, z: 100, rotation: 180, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
  ],
  appliances: [
    { id: 'app-fridge-01', name: 'ثلاجة دولابي فاخرة', type: 'refrigerator', category: 'cooling', brand: 'Bosch Serie 8', model: 'KAN93VIFP', width: 700, height: 1800, depth: 600, x: 0, y: 0, z: 100, rotation: 0, finish: 'black-glass' },
    { id: 'app-cooktop-01', name: 'مسطح حثي 5 شعلة', type: 'cooktop', category: 'cooking', brand: 'Siemens iQ700', model: 'EX875KYW1E', width: 800, height: 60, depth: 520, x: 2250, y: 2200, z: 860, rotation: 180, finish: 'black-glass' },
    { id: 'app-sink-01', name: 'حوض جرانيت أسود ساقط', type: 'sink', category: 'sanitary', brand: 'Franke Maris', model: 'MRG 110-72', width: 760, height: 200, depth: 440, x: 2620, y: 0, z: 820, rotation: 0, finish: 'black-glass' },
  ],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'رخام كوارتز كلكتا جولد إيطالي', thickness: 40, color: '#f5f5f0' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100, material: 'ألومنيوم بروفايل أسود مطفي' },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: true, material: 'كوارتز كلكتا مطابق للسطح', height: 600, color: '#fafafa' },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب جوز أمريكي مدخن فاخر (Smoked American Walnut)',
    frontColor: '#4a3728',
    carcaseFinish: 'رمادي حجري معتم (Stone Grey MFC)',
    bodyColor: '#334155',
    handleStyle: 'بروفايل جولا أسود مدمج بدون مقابض (Gola Profile)',
    plinthFinish: 'أسود مطفي',
    countertopColor: '#fbfbfb',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
  designOptions: [],
};

// 1.2 MODERN L-SHAPED NORDIC KITCHEN (4.2m x 3.6m)
export const PROJECT_KITCHEN_MODERN_L: ProjectData = {
  ...SAMPLE_PROJECT_KITCHEN,
  metadata: {
    ...SAMPLE_PROJECT_KITCHEN.metadata,
    id: 'proj-kitchen-l-shape-02',
    name: 'مطبخ مودرن حرف L كشمير بيج مع بار إفطار (Nordic Cashmere L-Shape)',
  },
};

// 1.3 GERMAN U-SHAPED MATTE ANTHRACITE KITCHEN (4.8m x 3.8m)
export const PROJECT_KITCHEN_GERMAN_U: ProjectData = {
  metadata: {
    id: 'proj-kitchen-german-u-03',
    name: 'مطبخ ألماني حرف U رمادي فحمي شاركول مع ليد مدمج (German Anthracite U)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'أبراج النخيل',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مطبخ احترافي على شكل حرف U باستغلال كامل للمساحة، ركنات دوارة ماجيك كورنر وأدراج سحاب لجامبو المؤن.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4800,
    length: 3800,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار الطهي الرئيسي', startX: 0, startY: 0, endX: 4800, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'جدار الحوض والنافذة', startX: 4800, startY: 0, endX: 4800, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'جدار الأبراج والبار', startX: 4800, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'المدخل المفتوح', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'win-u', name: 'نافذة الجدار الأيمن', type: 'window', x: 4800, y: 1500, z: 1000, width: 1400, height: 1100, depth: 150, rotation: 90, wallId: 'wall-b' },
    ],
  },
  cabinets: [
    { id: 'U-T1', name: 'برج ثلاجة مزدوجة', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 900, height: 2400, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
    { id: 'U-T2', name: 'برج أفران وميكروويف مدمج', category: 'tall', type: 'tall-oven-tower', projectType: 'kitchen', width: 600, height: 2400, depth: 600, x: 900, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 1, doorHinge: 'right', hasApplianceCavity: true },
    { id: 'U-B1', name: 'سفلي أدراج تخزين أواني', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 1500, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'U-B2', name: 'سفلي طباخ مسطح بلت إن', category: 'base', type: 'base-cooktop-housing', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 2400, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none', hasCooktopCutout: true },
    { id: 'U-B3', name: 'ركنية ماجيك كورنر إيطالي', category: 'corner', type: 'base-corner-l', projectType: 'kitchen', width: 900, height: 720, depth: 900, x: 3900, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    { id: 'U-B4', name: 'وحدة حوض غسيل مزدوج', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 1000, height: 720, depth: 580, x: 4800, y: 1400, z: 100, rotation: 90, wallId: 'wall-b', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'U-B5', name: 'غسالة صحون مدمجة', category: 'base', type: 'base-single-door', projectType: 'kitchen', width: 600, height: 720, depth: 580, x: 4800, y: 2400, z: 100, rotation: 90, wallId: 'wall-b', shelfCount: 0, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'كوارتز أسود نيرو ماركينا مطفي', thickness: 30, color: '#18181b' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100, material: 'أسود مطفي' },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: true, material: 'كونكريت رمادي مصقول', height: 600, color: '#3f3f46' },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'رمادي فحمي شاركول ألماني سوبر مات (Anthracite Super Matte)',
    frontColor: '#27272a',
    bodyColor: '#18181b',
    handleStyle: 'بروفايل جولا أسود مدمج',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 1.4 NEO-CLASSIC ROYAL WHITE & GOLD KITCHEN
export const PROJECT_KITCHEN_NEO_CLASSIC: ProjectData = {
  metadata: {
    id: 'proj-kitchen-neoclassic-04',
    name: 'مطبخ نيو كلاسيك ملكي أوف وايت مع زجاج مضيء ونحاس (Neo-Classic Luxury)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'قصر الياسمين',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'طراز نيوكلاسيك فخم مع ضلف بانوهات مفرزة CNC، مقابض نحاس مصقول ذهبي، وفيترينات مضيئة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 5000,
    length: 3800,
    ceilingHeight: 3000,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار الرئيسي', startX: 0, startY: 0, endX: 5000, endY: 0, thickness: 150, height: 3000 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 5000, startY: 0, endX: 5000, endY: 3800, thickness: 150, height: 3000 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 5000, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 3000 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 3000 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'NC-T1', name: 'دولاب تخزين كلاسيكي مع كرانيش', category: 'tall', type: 'tall-pantry-pullout', projectType: 'kitchen', width: 600, height: 2500, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 5, doorCount: 2, drawerCount: 0, doorHinge: 'right' },
    { id: 'NC-B1', name: 'سفلي أدراج نيوكلاسيك', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 600, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'NC-B2', name: 'وحدة طهي مع هود كلاسيك مدمج', category: 'base', type: 'base-cooktop-housing', projectType: 'kitchen', width: 1000, height: 720, depth: 580, x: 1500, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none', hasCooktopCutout: true },
    { id: 'NC-B3', name: 'وحدة حوض كلاسيك ساقط', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 2500, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'NC-W1', name: 'علوي فيترينة زجاج إنجليزي مقسم', category: 'wall', type: 'wall-glass-vitrine', projectType: 'kitchen', width: 900, height: 800, depth: 350, x: 600, y: 0, z: 1500, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
    { id: 'NC-W2', name: 'علوي فيترينة زجاج يمين', category: 'wall', type: 'wall-glass-vitrine', projectType: 'kitchen', width: 900, height: 800, depth: 350, x: 2500, y: 0, z: 1500, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'رخام كرارة تركي أبيض بعروق ذهبية', thickness: 40, color: '#f8fafc' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 120, material: 'خشب أبيض مفرز كلاسيك' },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: true, material: 'موزاييك رخام أبيض كلاسيك', height: 600, color: '#f1f5f9' },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'أوف وايت ناعم حريري (Warm Silk White CNC)',
    frontColor: '#fdfbf7',
    bodyColor: '#f1f5f9',
    handleStyle: 'مقبض مسطرة نحاسي مصقول مطفي (Brushed Gold)',
    handleColor: '#d97706',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 1.5 KHASHMOUNIUM JUMBO WOODGRAIN KITCHEN
export const PROJECT_KITCHEN_KHASHMOUNIUM: ProjectData = {
  metadata: {
    id: 'proj-kitchen-khashmounium-05',
    name: 'مطبخ خشمونيوم جامبو بتجزيعات أرو بيور مقاوم للماء (Khashmounium Master)',
    projectType: 'kitchen',
    materialSystem: 'aluminium',
    clientName: 'برج الشاطئ',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مطبخ شاسيه ألوميتال مقوى عالي التحمل مع كلادينج ألماني وفورميكا خشمونيوم ضد الرطوبة والمياه بنسبة 100%.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4400,
    length: 3200,
    ceilingHeight: 2700,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار الرئيسي', startX: 0, startY: 0, endX: 4400, endY: 0, thickness: 150, height: 2700 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4400, startY: 0, endX: 4400, endY: 3200, thickness: 150, height: 2700 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 4400, startY: 3200, endX: 0, endY: 3200, thickness: 150, height: 2700 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 3200, endX: 0, endY: 0, thickness: 150, height: 2700 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'KH-B1', name: 'سفلي خشمونيوم حوض غسيل', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 500, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'KH-B2', name: 'سفلي خشمونيوم أدراج سوفت كلوز', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 600, height: 720, depth: 580, x: 1400, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'KH-B3', name: 'سفلي خشمونيوم مسطح غاز', category: 'base', type: 'base-cooktop-housing', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 2000, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none', hasCooktopCutout: true },
    { id: 'KH-W1', name: 'علوي خشمونيوم مطبقيه هيدروليك', category: 'wall', type: 'wall-double-door', projectType: 'kitchen', width: 900, height: 720, depth: 350, x: 500, y: 0, z: 1520, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
    { id: 'KH-W2', name: 'علوي خشمونيوم شفاط بلت إن', category: 'wall', type: 'wall-single-door', projectType: 'kitchen', width: 900, height: 500, depth: 350, x: 2000, y: 0, z: 1740, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'جرانيت جلاكسي ستار أسود بفصوص ذهبية', thickness: 30, color: '#18181b' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100, material: 'ألوميتال خشمونيوم مطابق' },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: true, material: 'كلادينج ألوميتال فضي عاكس', height: 600, color: '#94a3b8' },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشمونيوم بتجزيعة خشب أرو إيطالي (Khashmounium Oak)',
    frontColor: '#78350f',
    bodyColor: '#cbd5e1',
  },
  manufacturing: { ...DEFAULT_MANUFACTURING_SETTINGS, systemType: 'aluminium' },
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 1.6 LINEAR MINIMALIST STUDIO KITCHEN
export const PROJECT_KITCHEN_LINEAR_STUDIO: ProjectData = {
  metadata: {
    id: 'proj-kitchen-linear-06',
    name: 'مطبخ خطي جداري مينيمال للشقق العصرية (Linear Urban Studio)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'استوديو جاردن سيتي',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'تصميم جداري مستقيم 3.6 متر متكامل يوفر أقصى استغلال للمساحة مع برج أجهزة مدمج.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 3800,
    length: 2600,
    ceilingHeight: 2700,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار الخطي', startX: 0, startY: 0, endX: 3800, endY: 0, thickness: 150, height: 2700 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 3800, startY: 0, endX: 3800, endY: 2600, thickness: 150, height: 2700 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 3800, startY: 2600, endX: 0, endY: 2600, thickness: 150, height: 2700 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 2600, endX: 0, endY: 0, thickness: 150, height: 2700 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'LN-T1', name: 'برج ثلاجة مدمج', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 600, height: 2300, depth: 600, x: 100, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'right' },
    { id: 'LN-B1', name: 'سفلي حوض غسيل ساقط', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 800, height: 720, depth: 580, x: 700, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'LN-B2', name: 'سفلي أدراج بهارات وسكاكين', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 500, height: 720, depth: 580, x: 1500, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'LN-B3', name: 'سفلي طباخ مدمج مع فرن تحتي', category: 'base', type: 'base-cooktop-housing', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 2000, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none', hasCooktopCutout: true },
    { id: 'LN-W1', name: 'علوي قلاب هيدروليك ممتد', category: 'wall', type: 'wall-lift-up-blum', projectType: 'kitchen', width: 1300, height: 720, depth: 350, x: 700, y: 0, z: 1500, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, flipUpDoor: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'كوارتز أبيض بيور إسباني', thickness: 20, color: '#ffffff' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100, material: 'أبيض مطفي' },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: true, material: 'سيراميك مترو أبيض سابواي', height: 600, color: '#f8fafc' },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'أبيض ألباين سوبر مات مع خشب أرو (Alpine White & Oak)',
    frontColor: '#f8fafc',
    bodyColor: '#e2e8f0',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 2. DRESSING ROOMS COLLECTION (8+ LUXURY PROJECTS)
// =========================================================================

// 2.1 ROYAL U-SHAPED WALK-IN CLOSET
export const PROJECT_DRESSING_ROYAL_U: ProjectData = {
  ...SAMPLE_PROJECT_DRESSING,
  metadata: {
    ...SAMPLE_PROJECT_DRESSING.metadata,
    id: 'proj-dressing-royal-u-01',
    name: 'دريسينج ماستر ملكي على شكل حرف U مع زجاج فوميه مضيء (Royal Walk-In U)',
  },
};

// 2.2 LUXURY ISLAND & VITRINES WALK-IN WARDROBE
export const PROJECT_DRESSING_ISLAND_SUITE: ProjectData = {
  metadata: {
    id: 'proj-dressing-island-02',
    name: 'جناح دريسينج مفتوح مع جزيرة ساعات ومجوهرات زجاجية (Island Dressing Suite)',
    projectType: 'dressing',
    materialSystem: 'wood',
    clientName: 'فيلا بالم هيلز',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'غرفة ملابس مفتوحة متكاملة مع جزيرة وسطية لتنظيم الساعات والمجوهرات بكسوة رخام نيرو ماركينا وزجاج شفاف.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4800,
    length: 4000,
    ceilingHeight: 3000,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار الخزائن الأيسر', startX: 0, startY: 0, endX: 4800, endY: 0, thickness: 150, height: 3000 },
      { id: 'wall-b', name: 'جدار الخزائن الأيمن', startX: 4800, startY: 0, endX: 4800, endY: 4000, thickness: 150, height: 3000 },
      { id: 'wall-c', name: 'جدار المدخل والمرايا', startX: 4800, startY: 4000, endX: 0, endY: 4000, thickness: 150, height: 3000 },
      { id: 'wall-d', name: 'جدار الأحذية والشنط', startX: 0, startY: 4000, endX: 0, endY: 0, thickness: 150, height: 3000 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'W-01', name: 'دولاب تعليق فساتين طويل ماستر', category: 'wardrobe', type: 'wardrobe-tall-hanging', projectType: 'dressing', width: 1000, height: 2600, depth: 600, x: 200, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
    { id: 'W-02', name: 'دولاب تعليق مزدوج بدل وقمصان', category: 'wardrobe', type: 'wardrobe-double-hanging', projectType: 'dressing', width: 1200, height: 2600, depth: 600, x: 1200, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
    { id: 'W-03', name: 'برج أدراج مجوهرات وساعات مقسمة', category: 'wardrobe', type: 'wardrobe-shelves-drawers', projectType: 'dressing', width: 800, height: 2600, depth: 600, x: 2400, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 3, doorCount: 0, drawerCount: 4 },
    { id: 'W-04', name: 'برج أحذية وشنط بإضاءة ليد مخفية', category: 'wardrobe', type: 'wardrobe-shoe-rack', projectType: 'dressing', width: 800, height: 2600, depth: 450, x: 0, y: 800, z: 0, rotation: 90, wallId: 'wall-d', shelfCount: 8, doorCount: 0, drawerCount: 0 },
    { id: 'ISL-D1', name: 'جزيرة إكسسوارات وساعات زجاجية وسطية', category: 'wardrobe', type: 'wardrobe-island-accessories', projectType: 'dressing', width: 1400, height: 880, depth: 900, x: 1800, y: 1600, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 6, hasGlassDoors: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'زجاج سيكوريت عاكس مع رخام نيرو ماركينا', thickness: 20, color: '#18181b' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 80, material: 'أرو طبيعي' },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب قشرة أرو طبيعي مع بروفايل ألومنيوم برونزي',
    frontColor: '#bfa076',
    bodyColor: '#334155',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 2.3 PARALLEL LINEAR CORRIDOR WALK-THROUGH DRESSING
export const PROJECT_DRESSING_PARALLEL_LINEAR: ProjectData = {
  metadata: {
    id: 'proj-dressing-parallel-03',
    name: 'دريسينج خطي متوازي للممرات الفندقية (Parallel Corridor Dressing)',
    projectType: 'dressing',
    materialSystem: 'wood',
    clientName: 'أجنحة ريتز',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'تصميم فندقي متوازي جدارين متقابلين، جهة لتعليق الملابس والأخرى للأحذية والأدراج مع مرايا كاملة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 3600,
    length: 2400,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار الخزائن الشمالي', startX: 0, startY: 0, endX: 3600, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 3600, startY: 0, endX: 3600, endY: 2400, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'جدار الخزائن الجنوبي', startX: 3600, startY: 2400, endX: 0, endY: 2400, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'المدخل المفتوح', startX: 0, startY: 2400, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'PL-01', name: 'خزانة تعليق ملابس مزدوجة', category: 'wardrobe', type: 'wardrobe-double-hanging', projectType: 'dressing', width: 1200, height: 2400, depth: 600, x: 200, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0 },
    { id: 'PL-02', name: 'خزانة تعليق طويل مع رف حقائب', category: 'wardrobe', type: 'wardrobe-tall-hanging', projectType: 'dressing', width: 1000, height: 2400, depth: 600, x: 1400, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0 },
    { id: 'PL-03', name: 'خزانة أدراج وأرفف مواجهة', category: 'wardrobe', type: 'wardrobe-shelves-drawers', projectType: 'dressing', width: 1200, height: 2400, depth: 550, x: 200, y: 2400, z: 0, rotation: 180, wallId: 'wall-c', shelfCount: 3, doorCount: 0, drawerCount: 4 },
    { id: 'PL-04', name: 'برج أحذية وإكسسوارات مواجه', category: 'wardrobe', type: 'wardrobe-shoe-rack', projectType: 'dressing', width: 1000, height: 2400, depth: 450, x: 1400, y: 2400, z: 0, rotation: 180, wallId: 'wall-c', shelfCount: 7, doorCount: 0, drawerCount: 0 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 80 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'رمادي جريج دافئ مع إضاءة بروفايل ليد مخفية',
    frontColor: '#b5aca1',
    bodyColor: '#334155',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 2.4 MODERN BUILT-IN 6-DOOR SLIDING WARDROBE
export const PROJECT_DRESSING_SLIDING_BUILTIN: ProjectData = {
  metadata: {
    id: 'proj-dressing-sliding-04',
    name: 'دولاب حائطي مدمج 6 ضلف جرار سيكوريت عاكس (Built-in Sliding Closet)',
    projectType: 'dressing',
    materialSystem: 'wood',
    clientName: 'شقة المهندسين',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'دولاب جرار ممتد من الأرض للسقف بعرض 3.6 متر وضلف زجاج سيكوريت عاكس مع قواطع ميلامين إيجر ألماني.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4000,
    length: 3000,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار الرئيسي', startX: 0, startY: 0, endX: 4000, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4000, startY: 0, endX: 4000, endY: 3000, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 4000, startY: 3000, endX: 0, endY: 3000, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 3000, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'SL-01', name: 'قطاع دولاب تعليق وأدراج يسار', category: 'wardrobe', type: 'wardrobe-shelves-drawers', projectType: 'dressing', width: 1200, height: 2600, depth: 650, x: 200, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 3, doorCount: 1, drawerCount: 3 },
    { id: 'SL-02', name: 'قطاع تعليق مزدوج وسط', category: 'wardrobe', type: 'wardrobe-double-hanging', projectType: 'dressing', width: 1200, height: 2600, depth: 650, x: 1400, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 1, drawerCount: 0 },
    { id: 'SL-03', name: 'قطاع تعليق فساتين وأحذية يمين', category: 'wardrobe', type: 'wardrobe-tall-hanging', projectType: 'dressing', width: 1200, height: 2600, depth: 650, x: 2600, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 4, doorCount: 1, drawerCount: 0 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 60 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'زجاج سيكوريت فوميه رمادي مدخن مع إطار ألوميتال أسود',
    frontColor: '#334155',
    bodyColor: '#1e293b',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 3. BEDROOMS COLLECTION (8+ LUXURY PROJECTS)
// =========================================================================

// 3.1 ROYAL MASTER SUITE WITH BOUCLE BED & WOOD SLAT WALL
export const PROJECT_BEDROOM_ROYAL_MASTER: ProjectData = {
  ...SAMPLE_PROJECT_BEDROOM,
  metadata: {
    ...SAMPLE_PROJECT_BEDROOM.metadata,
    id: 'proj-bedroom-royal-master-01',
    name: 'جناح نوم ماستر ملكي بسرير بوكليه وبانوهات أرو مضلعة (Royal Master Suite)',
  },
};

// 3.2 SCANDINAVIAN OAK MINIMALIST BEDROOM
export const PROJECT_BEDROOM_SCANDINAVIAN_OAK: ProjectData = {
  metadata: {
    id: 'proj-bedroom-scandi-oak-02',
    name: 'غرفة نوم إسكندنافية خشب أرو طبيعي مع سرير عائم مضيء (Scandinavian Oak Suite)',
    projectType: 'bedroom',
    materialSystem: 'wood',
    clientName: 'كمبوند سوديك',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'طراز نورديك مينيمال هادئ بخشب البلوط الطبيعي، سرير عائم بإضاءة ليد مخفية وكومودينو معلق مدمج.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4500,
    length: 4000,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار السرير الرئيسي', startX: 0, startY: 0, endX: 4500, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4500, startY: 0, endX: 4500, endY: 4000, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'جدار النافذة والتسريحة', startX: 4500, startY: 4000, endX: 0, endY: 4000, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 4000, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'BED-SC1', name: 'سرير كينج عائم 180×200 خشب أرو', category: 'bed', type: 'bed-king-floating', projectType: 'bedroom', width: 2000, height: 1100, depth: 2150, x: 1250, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'NST-SC1', name: 'كومودينو معلق يسار بدرج تاتش', category: 'nightstand', type: 'nightstand-floating', projectType: 'bedroom', width: 550, height: 280, depth: 400, x: 650, y: 0, z: 250, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 1 },
    { id: 'NST-SC2', name: 'كومودينو معلق يمين بدرج تاتش', category: 'nightstand', type: 'nightstand-floating', projectType: 'bedroom', width: 550, height: 280, depth: 400, x: 3300, y: 0, z: 250, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 1 },
    { id: 'DRS-SC1', name: 'تسريحة مودرن معلقة مع مرآة دائرية', category: 'dresser', type: 'dresser-floating-modern', projectType: 'bedroom', width: 1400, height: 400, depth: 450, x: 1550, y: 4000, z: 450, rotation: 180, wallId: 'wall-c', shelfCount: 0, doorCount: 0, drawerCount: 2 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, enabled: false },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب أرو طبيعي هادئ مع بيج كشمير مطفي',
    frontColor: '#bfa076',
    bodyColor: '#d6cec4',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 3.3 MODERN EMERALD & VELVET LUXURY BEDROOM
export const PROJECT_BEDROOM_EMERALD_VELVET: ProjectData = {
  metadata: {
    id: 'proj-bedroom-emerald-03',
    name: 'جناح نوم مخملي كحلي وزمردي مع كونسول تسريحة ملكي (Emerald Luxury Bedroom)',
    projectType: 'bedroom',
    materialSystem: 'wood',
    clientName: 'برج زايد كريستال',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'غرفة نوم فندقية بألوان ملكية داكنة، ظهر سرير مخملي كابيتونيه حتى السقف، ومرايا برونزية عاكسة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4800,
    length: 4200,
    ceilingHeight: 2900,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار السرير الرئيسي', startX: 0, startY: 0, endX: 4800, endY: 0, thickness: 150, height: 2900 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4800, startY: 0, endX: 4800, endY: 4200, thickness: 150, height: 2900 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 4800, startY: 4200, endX: 0, endY: 4200, thickness: 150, height: 2900 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 4200, endX: 0, endY: 0, thickness: 150, height: 2900 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'BED-EM1', name: 'سرير كينج ملكي 200×200 مخمل كحلي', category: 'bed', type: 'bed-king-upholstered', projectType: 'bedroom', width: 2200, height: 1400, depth: 2200, x: 1300, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'NST-EM1', name: 'كومودينو فخم بدرجين ومقبض نحاسي يسار', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 550, height: 500, depth: 450, x: 700, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'NST-EM2', name: 'كومودينو فخم بدرجين ومقبض نحاسي يمين', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 550, height: 500, depth: 450, x: 3550, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'DRS-EM1', name: 'تسريحة كونسول 6 أدراج مع رخام كلكتا', category: 'dresser', type: 'dresser-6drawers-luxury', projectType: 'bedroom', width: 1600, height: 850, depth: 500, x: 1600, y: 4200, z: 0, rotation: 180, wallId: 'wall-c', shelfCount: 0, doorCount: 0, drawerCount: 6 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'رخام كلكتا جولد إيطالي', thickness: 20, color: '#f8fafc' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 50, material: 'نحاسي مطفي' },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'مخمل كحلي ملكي مع خشب جوز مدخن وإطار نحاسي',
    frontColor: '#1e293b',
    bodyColor: '#0f172a',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 3.4 NEO-CLASSIC WARM BEIGE BEDROOM
export const PROJECT_BEDROOM_NEO_CLASSIC: ProjectData = {
  metadata: {
    id: 'proj-bedroom-neoclassic-04',
    name: 'غرفة نوم نيو كلاسيك كشمير مع تسريحة كلاسيكية ومرايا (Neo-Classic Beige Suite)',
    projectType: 'bedroom',
    materialSystem: 'wood',
    clientName: 'فيلا الشروق',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'طراز نيوكلاسيك بيج دافئ مع سرير كابيتونيه فاخر وكرانيش ناعمة للأدراج والتسريحة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4600,
    length: 3800,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار السرير', startX: 0, startY: 0, endX: 4600, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4600, startY: 0, endX: 4600, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'جدار التسريحة', startX: 4600, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'BED-NC1', name: 'سرير كينج نيو كلاسيك كشمير', category: 'bed', type: 'bed-king-upholstered', projectType: 'bedroom', width: 2100, height: 1350, depth: 2150, x: 1250, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'NST-NC1', name: 'كومودينو كلاسيكي بدرجين يسار', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 550, height: 520, depth: 450, x: 650, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'NST-NC2', name: 'كومودينو كلاسيكي بدرجين يمين', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 550, height: 520, depth: 450, x: 3400, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'DRS-NC1', name: 'تسريحة نيوكلاسيك 6 أدراج مع مرآة مقوسة', category: 'dresser', type: 'dresser-6drawers-luxury', projectType: 'bedroom', width: 1500, height: 850, depth: 500, x: 1550, y: 3800, z: 0, rotation: 180, wallId: 'wall-c', shelfCount: 0, doorCount: 0, drawerCount: 6 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 80 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'كشمير بيج دافئ مفرز CNC نيوكلاسيك',
    frontColor: '#d6cec4',
    bodyColor: '#f1f5f9',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 4. LIBRARIES & MEDIA WALLS COLLECTION (8+ LUXURY PROJECTS)
// =========================================================================

// 4.1 CINEMATIC TV SLAT WALL & FLOATING CONSOLE
export const PROJECT_LIBRARY_CINEMATIC_TV: ProjectData = {
  ...SAMPLE_PROJECT_LIBRARY,
  metadata: {
    ...SAMPLE_PROJECT_LIBRARY.metadata,
    id: 'proj-library-cinematic-01',
    name: 'حائط شاشة سينمائي فاخر مع بديل رخام وبانوهات خشبية (Cinematic Slat TV Wall)',
  },
};

// 4.2 FULL-WALL FLOOR-TO-CEILING EXECUTIVE BOOKCASE
export const PROJECT_LIBRARY_EXECUTIVE_STUDY: ProjectData = {
  metadata: {
    id: 'proj-library-executive-02',
    name: 'مكتبة جدارية كاملة من الأرض للسقف مع إضاءة بروفايل ليد (Floor-to-Ceiling Library)',
    projectType: 'library',
    materialSystem: 'wood',
    clientName: 'مكتب آل سعود للاستشارات',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مكتبة كتب فخمة بارتفاع 3 متر كاملة الأرفف مع فيترينات سفلية مغلقة بضلف تاتش وأعمدة ليد رأسية.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4800,
    length: 3600,
    ceilingHeight: 3000,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار المكتبة الكامل', startX: 0, startY: 0, endX: 4800, endY: 0, thickness: 150, height: 3000 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4800, startY: 0, endX: 4800, endY: 3600, thickness: 150, height: 3000 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 4800, startY: 3600, endX: 0, endY: 3600, thickness: 150, height: 3000 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 3600, endX: 0, endY: 0, thickness: 150, height: 3000 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'LIB-T1', name: 'مكتبة أرفف كتب قطاع يسار', category: 'library-wall', type: 'library-bookshelf-tall', projectType: 'library', width: 1000, height: 2800, depth: 400, x: 400, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 6, doorCount: 0, drawerCount: 0 },
    { id: 'LIB-T2', name: 'مكتبة أرفف كتب قطاع وسط رئيسي', category: 'library-wall', type: 'library-bookshelf-tall', projectType: 'library', width: 1200, height: 2800, depth: 400, x: 1400, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 6, doorCount: 0, drawerCount: 0 },
    { id: 'LIB-T3', name: 'مكتبة أرفف كتب قطاع وسط ثاني', category: 'library-wall', type: 'library-bookshelf-tall', projectType: 'library', width: 1200, height: 2800, depth: 400, x: 2600, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 6, doorCount: 0, drawerCount: 0 },
    { id: 'LIB-T4', name: 'مكتبة أرفف كتب قطاع يمين مع دولاب سفلي', category: 'library-wall', type: 'library-bookshelf-tall', projectType: 'library', width: 1000, height: 2800, depth: 400, x: 3800, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 6, doorCount: 2, drawerCount: 0 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 80 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب جوز أمريكي غامق مدخن مع إضاءة ورم ليد',
    frontColor: '#594433',
    bodyColor: '#1e293b',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 4.3 MODERN CASHMERE FLOATING MEDIA UNIT WITH DISPLAY DISPLAY
export const PROJECT_LIBRARY_CASHMERE_MEDIA: ProjectData = {
  metadata: {
    id: 'proj-library-cashmere-03',
    name: 'وحدة تليفزيون معلقة كشمير وأرو مع فيترينات تحف مضيئة (Modern Cashmere TV Unit)',
    projectType: 'library',
    materialSystem: 'wood',
    clientName: 'فيلا النرجس',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'وحدة ميديا معلقة بأدراج تاتش، تجليد جداري خشب أرو طبيعي، وفيترينات جانبية زجاج فوميه لعرض التحف والكتب.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4400,
    length: 3200,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'جدار الميديا الرئيسي', startX: 0, startY: 0, endX: 4400, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4400, startY: 0, endX: 4400, endY: 3200, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 4400, startY: 3200, endX: 0, endY: 3200, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 3200, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'TV-CASH-W', name: 'بانوه جداري خشب أرو لشاشة 75 بوصة', category: 'tv-wall', type: 'living-tv-slat-wall', projectType: 'library', width: 2400, height: 2400, depth: 80, x: 1000, y: 0, z: 200, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'TV-CASH-CR', name: 'كونسول معلق 3 أدراج تاتش كشمير', category: 'media-console', type: 'living-credenza-floating', projectType: 'library', width: 2400, height: 350, depth: 400, x: 1000, y: 0, z: 350, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3 },
    { id: 'TV-CASH-VT', name: 'فيترينة كتب وتحف زجاج فوميه يسار', category: 'library-wall', type: 'library-vitrine-tall', projectType: 'library', width: 800, height: 2200, depth: 380, x: 200, y: 0, z: 350, rotation: 0, wallId: 'wall-a', shelfCount: 5, doorCount: 1, drawerCount: 0, hasGlassDoors: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, enabled: false },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'كشمير بيج دافئ مع خشب أرو طبيعي وزجاج فوميه',
    frontColor: '#d6cec4',
    bodyColor: '#334155',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 4.4 INTEGRATED HOME OFFICE & MEDIA STUDY
export const PROJECT_LIBRARY_HOME_OFFICE: ProjectData = {
  metadata: {
    id: 'proj-library-office-04',
    name: 'مكتبة دراسة وميديا مدمجة مع مكتب عمل مخفي (Integrated Home Study & Office)',
    projectType: 'library',
    materialSystem: 'wood',
    clientName: 'د. خالد عبد الرحمن',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'تصميم يدمج بين مكتبة كتب جدارية فخمة ومكتب عمل معلق بإضاءة مهام ذكية ومساحات تخزين سرية.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4200,
    length: 3200,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار المكتبي الرئيسي', startX: 0, startY: 0, endX: 4200, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار الأيمن', startX: 4200, startY: 0, endX: 4200, endY: 3200, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار الخلفي', startX: 4200, startY: 3200, endX: 0, endY: 3200, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار الأيسر', startX: 0, startY: 3200, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'OFF-LIB-1', name: 'مكتبة وثائق وملفات عميقة يسار', category: 'library-wall', type: 'library-bookshelf-tall', projectType: 'library', width: 900, height: 2500, depth: 400, x: 200, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 5, doorCount: 2, drawerCount: 0 },
    { id: 'OFF-DSK-1', name: 'سطح مكتب عمل معلق مع أدراج لابتوب', category: 'media-console', type: 'living-credenza-floating', projectType: 'library', width: 1800, height: 120, depth: 650, x: 1100, y: 0, z: 750, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'OFF-SHL-1', name: 'أرفف كتب معلقة مفتوحة فوق المكتب', category: 'library-wall', type: 'library-shelf-floating', projectType: 'library', width: 1800, height: 700, depth: 300, x: 1100, y: 0, z: 1400, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 0, drawerCount: 0 },
    { id: 'OFF-LIB-2', name: 'مكتبة كتب وتحف مغلقة يمين', category: 'library-wall', type: 'library-vitrine-tall', projectType: 'library', width: 900, height: 2500, depth: 400, x: 2900, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 5, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 80 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'رمادي فحمي شاركول مع خشب بتولا طبيعي مبيض',
    frontColor: '#27272a',
    bodyColor: '#d8cbb8',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// MASTER CATALOG REGISTRY (ALL CATEGORIES PURE & MULTIPLIED)
// =========================================================================

export interface CatalogProjectCard {
  id: string;
  name: string;
  category: ProjectType;
  dimensions: string;
  style: string;
  cabinetCount: number;
  tags: string[];
  data: ProjectData;
  thumbnail: string;
  previewThumbnail?: string;
}

export const ALL_SAMPLE_PROJECTS: CatalogProjectCard[] = [
  // --- KITCHENS (4X) ---
  {
    id: PROJECT_KITCHEN_LUXURY_ISLAND.metadata.id,
    name: PROJECT_KITCHEN_LUXURY_ISLAND.metadata.name,
    category: 'kitchen',
    dimensions: '5.4 م × 4.2 م',
    style: 'مودرن ملكي إيطالي',
    cabinetCount: PROJECT_KITCHEN_LUXURY_ISLAND.cabinets.length,
    tags: ['فيلا', 'جزيرة كلكتا', 'برج أفران', 'خشب جوز مدخن'],
    data: PROJECT_KITCHEN_LUXURY_ISLAND,
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_KITCHEN_MODERN_L.metadata.id,
    name: PROJECT_KITCHEN_MODERN_L.metadata.name,
    category: 'kitchen',
    dimensions: '4.2 م × 3.6 م',
    style: 'نورديك كشمير هادئ',
    cabinetCount: PROJECT_KITCHEN_MODERN_L.cabinets.length,
    tags: ['شقق راقية', 'حرف L', 'بار إفطار', 'كشمير بيج'],
    data: PROJECT_KITCHEN_MODERN_L,
    thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_KITCHEN_GERMAN_U.metadata.id,
    name: PROJECT_KITCHEN_GERMAN_U.metadata.name,
    category: 'kitchen',
    dimensions: '4.8 م × 3.8 م',
    style: 'ألماني شاركول احترافي',
    cabinetCount: PROJECT_KITCHEN_GERMAN_U.cabinets.length,
    tags: ['حرف U', 'رمادي فحمي', 'ماجيك كورنر', 'طباخ مدمج'],
    data: PROJECT_KITCHEN_GERMAN_U,
    thumbnail: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_KITCHEN_NEO_CLASSIC.metadata.id,
    name: PROJECT_KITCHEN_NEO_CLASSIC.metadata.name,
    category: 'kitchen',
    dimensions: '5.0 م × 3.8 م',
    style: 'نيو كلاسيك ملكي',
    cabinetCount: PROJECT_KITCHEN_NEO_CLASSIC.cabinets.length,
    tags: ['قصر', 'أوف وايت', 'نحاس مصقول', 'فيترينات زجاج'],
    data: PROJECT_KITCHEN_NEO_CLASSIC,
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_KITCHEN_KHASHMOUNIUM.metadata.id,
    name: PROJECT_KITCHEN_KHASHMOUNIUM.metadata.name,
    category: 'kitchen',
    dimensions: '4.4 م × 3.2 م',
    style: 'خشمونيوم جامبو معتمد',
    cabinetCount: PROJECT_KITCHEN_KHASHMOUNIUM.cabinets.length,
    tags: ['ضد المياه', 'ألوميتال مقوى', 'تجزيعة أرو', 'جرانيت جلاكسي'],
    data: PROJECT_KITCHEN_KHASHMOUNIUM,
    thumbnail: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_KITCHEN_LINEAR_STUDIO.metadata.id,
    name: PROJECT_KITCHEN_LINEAR_STUDIO.metadata.name,
    category: 'kitchen',
    dimensions: '3.8 م × 2.6 م',
    style: 'خطي مينيمال معاصر',
    cabinetCount: PROJECT_KITCHEN_LINEAR_STUDIO.cabinets.length,
    tags: ['استوديو', 'جدار مستقيم', 'قلابات بلوم', 'أبيض ألباين'],
    data: PROJECT_KITCHEN_LINEAR_STUDIO,
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },

  // --- DRESSING ROOMS (4X) ---
  {
    id: PROJECT_DRESSING_ROYAL_U.metadata.id,
    name: PROJECT_DRESSING_ROYAL_U.metadata.name,
    category: 'dressing',
    dimensions: '4.6 م × 3.8 م',
    style: 'ماستر ووكر إن ملكي',
    cabinetCount: PROJECT_DRESSING_ROYAL_U.cabinets.length,
    tags: ['حرف U', 'زجاج فوميه', 'إضاءة ليد', 'قواطع أرو'],
    data: PROJECT_DRESSING_ROYAL_U,
    thumbnail: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_DRESSING_ISLAND_SUITE.metadata.id,
    name: PROJECT_DRESSING_ISLAND_SUITE.metadata.name,
    category: 'dressing',
    dimensions: '4.8 م × 4.0 م',
    style: 'جناح ملابس مع جزيرة وسطية',
    cabinetCount: PROJECT_DRESSING_ISLAND_SUITE.cabinets.length,
    tags: ['جزيرة مجوهرات', 'ساعات', 'برج أحذية', 'أبواب زجاج'],
    data: PROJECT_DRESSING_ISLAND_SUITE,
    thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_DRESSING_PARALLEL_LINEAR.metadata.id,
    name: PROJECT_DRESSING_PARALLEL_LINEAR.metadata.name,
    category: 'dressing',
    dimensions: '3.6 م × 2.4 م',
    style: 'خطي متوازي فندقي',
    cabinetCount: PROJECT_DRESSING_PARALLEL_LINEAR.cabinets.length,
    tags: ['ممر ملابس', 'جريج دافئ', 'تعليق مزدوج', 'مرايا كاملة'],
    data: PROJECT_DRESSING_PARALLEL_LINEAR,
    thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_DRESSING_SLIDING_BUILTIN.metadata.id,
    name: PROJECT_DRESSING_SLIDING_BUILTIN.metadata.name,
    category: 'dressing',
    dimensions: '4.0 م × 3.0 م',
    style: 'دولاب حائطي مدمج 6 ضلف',
    cabinetCount: PROJECT_DRESSING_SLIDING_BUILTIN.cabinets.length,
    tags: ['أبواب جرار', 'سيكوريت عاكس', 'شاسيه إيجر', 'أدراج مخفية'],
    data: PROJECT_DRESSING_SLIDING_BUILTIN,
    thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  },

  // --- BEDROOMS (4X) ---
  {
    id: PROJECT_BEDROOM_ROYAL_MASTER.metadata.id,
    name: PROJECT_BEDROOM_ROYAL_MASTER.metadata.name,
    category: 'bedroom',
    dimensions: '5.2 م × 4.4 م',
    style: 'جناح ماستر ملكي بوكليه',
    cabinetCount: PROJECT_BEDROOM_ROYAL_MASTER.cabinets.length,
    tags: ['سرير كينج', 'بوكليه كريمي', 'بانوهات مضلعة', 'تسريحة مضيئة'],
    data: PROJECT_BEDROOM_ROYAL_MASTER,
    thumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_BEDROOM_SCANDINAVIAN_OAK.metadata.id,
    name: PROJECT_BEDROOM_SCANDINAVIAN_OAK.metadata.name,
    category: 'bedroom',
    dimensions: '4.5 م × 4.0 م',
    style: 'إسكندنافي أرو طبيعي عائم',
    cabinetCount: PROJECT_BEDROOM_SCANDINAVIAN_OAK.cabinets.length,
    tags: ['سرير عائم', 'خشب أرو', 'كومودينو معلق', 'تسريحة دائرية'],
    data: PROJECT_BEDROOM_SCANDINAVIAN_OAK,
    thumbnail: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_BEDROOM_EMERALD_VELVET.metadata.id,
    name: PROJECT_BEDROOM_EMERALD_VELVET.metadata.name,
    category: 'bedroom',
    dimensions: '4.8 م × 4.2 م',
    style: 'فندقي فاخر مخمل كحلي',
    cabinetCount: PROJECT_BEDROOM_EMERALD_VELVET.cabinets.length,
    tags: ['مخمل كحلي', 'نحاسي مصقول', 'رخام كلكتا', 'كونسول تسريحة'],
    data: PROJECT_BEDROOM_EMERALD_VELVET,
    thumbnail: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_BEDROOM_NEO_CLASSIC.metadata.id,
    name: PROJECT_BEDROOM_NEO_CLASSIC.metadata.name,
    category: 'bedroom',
    dimensions: '4.6 م × 3.8 م',
    style: 'نيو كلاسيك كشمير دافئ',
    cabinetCount: PROJECT_BEDROOM_NEO_CLASSIC.cabinets.length,
    tags: ['سرير كابيتونيه', 'كشمير بيج', 'مرآة مقوسة', 'كرانيش CNC'],
    data: PROJECT_BEDROOM_NEO_CLASSIC,
    thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  },

  // --- LIBRARIES & MEDIA WALLS (4X) ---
  {
    id: PROJECT_LIBRARY_CINEMATIC_TV.metadata.id,
    name: PROJECT_LIBRARY_CINEMATIC_TV.metadata.name,
    category: 'library',
    dimensions: '4.8 م × 3.8 م',
    style: 'حائط سينمائي مضلع فاخر',
    cabinetCount: PROJECT_LIBRARY_CINEMATIC_TV.cabinets.length,
    tags: ['بديل رخام', 'بانوهات خشبية', 'كونسول معلق', 'شاشة 85 بوصة'],
    data: PROJECT_LIBRARY_CINEMATIC_TV,
    thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_LIBRARY_EXECUTIVE_STUDY.metadata.id,
    name: PROJECT_LIBRARY_EXECUTIVE_STUDY.metadata.name,
    category: 'library',
    dimensions: '4.8 م × 3.6 م',
    style: 'مكتبة جدارية كاملة للسقف',
    cabinetCount: PROJECT_LIBRARY_EXECUTIVE_STUDY.cabinets.length,
    tags: ['ارتفاع 3 متر', 'خشب جوز مدخن', 'أرفف كتب', 'أعمدة ليد'],
    data: PROJECT_LIBRARY_EXECUTIVE_STUDY,
    thumbnail: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_LIBRARY_CASHMERE_MEDIA.metadata.id,
    name: PROJECT_LIBRARY_CASHMERE_MEDIA.metadata.name,
    category: 'library',
    dimensions: '4.4 م × 3.2 م',
    style: 'ميديا كشمير وأرو معلق',
    cabinetCount: PROJECT_LIBRARY_CASHMERE_MEDIA.cabinets.length,
    tags: ['فيترينة زجاج', 'أدراج تاتش', 'شاشة معلقة', 'خشب أرو'],
    data: PROJECT_LIBRARY_CASHMERE_MEDIA,
    thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: PROJECT_LIBRARY_HOME_OFFICE.metadata.id,
    name: PROJECT_LIBRARY_HOME_OFFICE.metadata.name,
    category: 'library',
    dimensions: '4.2 م × 3.2 م',
    style: 'مكتبة دراسة ومكتب عمل مدمج',
    cabinetCount: PROJECT_LIBRARY_HOME_OFFICE.cabinets.length,
    tags: ['مكتب عمل', 'أرفف وثائق', 'شاركول وبتولا', 'إضاءة مهام'],
    data: PROJECT_LIBRARY_HOME_OFFICE,
    thumbnail: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  },
];
