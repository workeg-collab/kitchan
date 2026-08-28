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
// 1. KITCHENS COLLECTION (مجموعة المطابخ الجاهزة)
// =========================================================================

// 1.1 LUXURY ISLAND VILLA KITCHEN (5.4m x 4.2m)
export const PROJECT_KITCHEN_LUXURY_ISLAND: ProjectData = {
  metadata: {
    id: 'proj-kitchen-island-01',
    name: 'مطبخ فيلا فاخر مع جزيرة رخام كلكتا وجلسة بار (Luxury Island Villa)',
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
      { id: 'wall-c', name: 'الجدار ج (المفتوح على الصالون)', startX: 5400, startY: 4200, endX: 0, endY: 4200, thickness: 150, height: 2800 },
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
  designOptions: [
    {
      id: 'opt-1-walnut',
      name: 'الخيار أ: خشب جوز أمريكي مدخن مع كلكتا جولد',
      description: 'طراز عصري فاخر ودافئ مع عروق رخام ذهبية وإضاءة خافتة',
      materials: {
        ...DEFAULT_MATERIAL_FINISHES,
        frontFinish: 'خشب جوز أمريكي مدخن (Smoked Walnut)',
        frontColor: '#4a3728',
        bodyColor: '#1e293b',
        countertopColor: '#fbfbfb',
        handleStyle: 'بروفايل جولا أسود خفي',
      },
    },
    {
      id: 'opt-2-anthracite',
      name: 'الخيار ب: أنثراسيت سوبر مات مع خشب أرو طبيعي',
      description: 'طراز مودرن مونوكروم ذو طابع أوروبي جريء ومقاوم للبصمات',
      materials: {
        ...DEFAULT_MATERIAL_FINISHES,
        frontFinish: 'أنثراسيت سوبر مات ناعم (Anthracite Soft Touch)',
        frontColor: '#1e232a',
        bodyColor: '#0f172a',
        countertopColor: '#e2e8f0',
        handleStyle: 'مقابض خطية مدمجة سوداء',
      },
    },
    {
      id: 'opt-3-cashmere',
      name: 'الخيار ج: كاشمير بيج دافئ مع بروفايل برونز نحاسي',
      description: 'ألوان ناعمة مريحة للعين مع لمسات نحاسية وإضاءة ليد دافئة',
      materials: {
        ...DEFAULT_MATERIAL_FINISHES,
        frontFinish: 'كاشمير بيج مطفي (Warm Cashmere Velvet)',
        frontColor: '#cfc4b6',
        bodyColor: '#334155',
        countertopColor: '#ffffff',
        handleStyle: 'بروفايل جولا نحاسي برونز',
      },
    },
  ],
};

// 1.2 CLASSIC SHAKER U-SHAPE KITCHEN (4.8m x 3.6m)
export const PROJECT_KITCHEN_CLASSIC_SHAKER: ProjectData = {
  metadata: {
    id: 'proj-kitchen-classic-shaker-01',
    name: 'مطبخ كلاسيك شيكر أبيض مع بانترى وأفران مدمجة (Classic Shaker U-Shape)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'فيلا الربيع',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مطبخ حرف U كلاسيكي فاخر بأبواب شيكر فريم وكورنيشة سقفية ورخام كرارة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4800,
    length: 3600,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'w1', name: 'الجدار أ', startX: 0, startY: 0, endX: 4800, endY: 0, thickness: 150, height: 2800 },
      { id: 'w2', name: 'الجدار ب', startX: 4800, startY: 0, endX: 4800, endY: 3600, thickness: 150, height: 2800 },
      { id: 'w3', name: 'الجدار ج', startX: 4800, startY: 3600, endX: 0, endY: 3600, thickness: 150, height: 2800 },
      { id: 'w4', name: 'الجدار د', startX: 0, startY: 3600, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'win-sh', name: 'نافذة كلاسيك مقسمة', type: 'window', x: 1800, y: 0, z: 1000, width: 1400, height: 1200, depth: 150, rotation: 0, wallId: 'w1' },
    ],
  },
  cabinets: [
    { id: 'SH-T1', name: 'برج ثلاجة شيكر أبيض', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 700, height: 2400, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 2, doorCount: 2, drawerCount: 0 },
    { id: 'SH-T2', name: 'برج أفران كلاسيك مع أدراج', category: 'tall', type: 'tall-oven-tower', projectType: 'kitchen', width: 600, height: 2400, depth: 600, x: 700, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 2, doorCount: 2, drawerCount: 2 },
    { id: 'SH-B1', name: 'وحدة حوض كلاسيك ساقط', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 2000, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 2, drawerCount: 0 },
    { id: 'SH-B2', name: 'سفلي أدراج 3 أدراج شيكر', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 800, height: 720, depth: 580, x: 2900, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 0, drawerCount: 3 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'رخام كرارة أبيض إيطالي', thickness: 40, color: '#f8fafc' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'أبيض شيكر كلاسيك مطفي (Classic White Shaker)',
    frontColor: '#f1f5f9',
    handleStyle: 'مقابض كوب نحاسية كلاسيكية (Brass Cup Pulls)',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 1.3 MODERN L-SHAPE CASHMERE KITCHEN (4.2m x 3.2m)
export const PROJECT_KITCHEN_MODERN_L_CASHMERE: ProjectData = {
  metadata: {
    id: 'proj-kitchen-l-cashmere-01',
    name: 'مطبخ مودرن حرف L كاشمير مع ليد بانل (Modern L-Shape Cashmere)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'شقة المهندسين',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مطبخ حرف L ناعم وأنيق للمساحات المتوسطة مع إضاءة ليد مخفية ولمسات برونز.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4200,
    length: 3200,
    ceilingHeight: 2700,
    wallThickness: 150,
    walls: [
      { id: 'w1', name: 'جدار أ', startX: 0, startY: 0, endX: 4200, endY: 0, thickness: 150, height: 2700 },
      { id: 'w2', name: 'جدار ب', startX: 4200, startY: 0, endX: 4200, endY: 3200, thickness: 150, height: 2700 },
      { id: 'w3', name: 'جدار ج', startX: 4200, startY: 3200, endX: 0, endY: 3200, thickness: 150, height: 2700 },
      { id: 'w4', name: 'جدار د', startX: 0, startY: 3200, endX: 0, endY: 0, thickness: 150, height: 2700 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'LC-T1', name: 'دولاب ثلاجة بيلت إن', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 700, height: 2400, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 2, doorCount: 2, drawerCount: 0 },
    { id: 'LC-B1', name: 'سفلي أدراج حلل', category: 'base', type: 'base-drawers-2', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 700, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'LC-B2', name: 'سفلي حوض ساقط', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 1600, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 2, drawerCount: 0 },
    { id: 'LC-W1', name: 'علوي قلاب هيدروليك', category: 'wall', type: 'wall-lift-up-blum', projectType: 'kitchen', width: 900, height: 720, depth: 350, x: 1600, y: 0, z: 1520, rotation: 0, wallId: 'w1', shelfCount: 1, doorCount: 1, drawerCount: 0, flipUpDoor: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'كوارتز بيج كاشمير ناعم', thickness: 30, color: '#f5efe6' },
  plinth: DEFAULT_PLINTH_CONFIG,
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'كاشمير بيج سوبر مات (Warm Cashmere Soft-Touch)',
    frontColor: '#d6cbbe',
    bodyColor: '#334155',
    handleStyle: 'بروفايل جولا نحاسي مدمج',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 1.4 COMPACT PARALLEL GALLEY KITCHEN (3.6m x 2.4m)
export const PROJECT_KITCHEN_PARALLEL_GALLEY: ProjectData = {
  metadata: {
    id: 'proj-kitchen-parallel-01',
    name: 'مطبخ متوازي للشقق العصرية (Urban Parallel Galley Kitchen)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'شقة العاصمة الإدارية',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مطبخ متوازي ذكي بصفين متقابلين للمساحات الضيقة مع استغلال أمثل لمثلث الحركة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 3600,
    length: 2400,
    ceilingHeight: 2700,
    wallThickness: 150,
    walls: [
      { id: 'w1', name: 'جدار الطبخ والأبراج', startX: 0, startY: 0, endX: 3600, endY: 0, thickness: 150, height: 2700 },
      { id: 'w2', name: 'جدار النافذة', startX: 3600, startY: 0, endX: 3600, endY: 2400, thickness: 150, height: 2700 },
      { id: 'w3', name: 'جدار الحوض والتحضير', startX: 3600, startY: 2400, endX: 0, endY: 2400, thickness: 150, height: 2700 },
      { id: 'w4', name: 'جدار الباب', startX: 0, startY: 2400, endX: 0, endY: 0, thickness: 150, height: 2700 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'PG-T1', name: 'دولاب ثلاجة بيلت إن', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 600, height: 2300, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 2, doorCount: 2, drawerCount: 0 },
    { id: 'PG-B1', name: 'سفلي مسطح طباخ وأدراج', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 600, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 0, drawerCount: 3 },
    { id: 'PG-B2', name: 'سفلي حوض غسيل', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 800, height: 720, depth: 580, x: 800, y: 1820, z: 100, rotation: 180, wallId: 'w3', shelfCount: 0, doorCount: 2, drawerCount: 0 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'كوارتز رمادي ناعم', thickness: 30, color: '#e2e8f0' },
  plinth: DEFAULT_PLINTH_CONFIG,
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'رمادي أنثراسيت سوبر مات (Anthracite Matte)',
    frontColor: '#2b2d42',
    bodyColor: '#1e293b',
    handleStyle: 'مقابض بلت-إن مدمجة',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 2. DRESSING ROOMS COLLECTION (مجموعة غرف الملابس والدريسينج)
// =========================================================================

// 2.1 ROYAL MASTER U-DRESSING SUITE (4.4m x 3.8m)
export const PROJECT_DRESSING_MASTER_U: ProjectData = {
  metadata: {
    id: 'proj-dressing-master-u-01',
    name: 'غرفة ملابس ماستر ملكية حرف U مع جزيرة وساعات (Royal Master U-Dressing)',
    projectType: 'dressing',
    materialSystem: 'wood',
    clientName: 'جناح الماستر - فيلا الشيخ زايد',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'غرفة دريسينج متكاملة فاخرة حرف U بأبواب زجاج فوميه مضيء، جزيرة ساعات ومجوهرات، ووحدات تعليق بناطيل وفساتين طويلة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4400,
    length: 3800,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'w-dr-a', name: 'جدار الخزائن الرئيسي', startX: 0, startY: 0, endX: 4400, endY: 0, thickness: 150, height: 2800 },
      { id: 'w-dr-b', name: 'جدار الفيترينات الأيمن', startX: 4400, startY: 0, endX: 4400, endY: 3800, thickness: 150, height: 2800 },
      { id: 'w-dr-c', name: 'جدار المدخل', startX: 4400, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 2800 },
      { id: 'w-dr-d', name: 'جدار الأحذية والحقائب الأيسر', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'door-dr', name: 'باب سلايدنج زجاجي فاخر', type: 'door', x: 1800, y: 3800, z: 0, width: 1000, height: 2400, depth: 150, rotation: 180, wallId: 'w-dr-c' },
    ],
  },
  cabinets: [
    { id: 'DR01', name: 'دولاب تعليق فساتين وبدلات طويلة', category: 'wardrobe', type: 'wardrobe-double-hanging', projectType: 'dressing', width: 1000, height: 2600, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'w-dr-a', shelfCount: 2, doorCount: 2, drawerCount: 0, hasHangingRail: true },
    { id: 'DR02', name: 'فيترينة زجاج فوميه بإضاءة سنسور', category: 'wardrobe', type: 'wardrobe-glass-vitrine', projectType: 'dressing', width: 900, height: 2600, depth: 600, x: 1000, y: 0, z: 100, rotation: 0, wallId: 'w-dr-a', shelfCount: 5, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
    { id: 'DR03', name: 'وحدة أدراج مجوهرات وساعات داخلية', category: 'wardrobe', type: 'wardrobe-shelves-drawers', projectType: 'dressing', width: 900, height: 2600, depth: 600, x: 1900, y: 0, z: 100, rotation: 0, wallId: 'w-dr-a', shelfCount: 3, doorCount: 2, drawerCount: 4 },
    { id: 'DR04', name: 'برج حقائب يد وأحذية مضيء', category: 'wardrobe', type: 'wardrobe-glass-vitrine', projectType: 'dressing', width: 900, height: 2600, depth: 600, x: 2800, y: 0, z: 100, rotation: 0, wallId: 'w-dr-a', shelfCount: 6, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
    { id: 'IS-DR', name: 'جزيرة مجوهرات وإكسسوارات بسطح زجاجي', category: 'accessories', type: 'dressing-jewelry-island', projectType: 'dressing', width: 1400, height: 900, depth: 800, x: 1500, y: 1500, z: 100, rotation: 0, wallId: 'w-dr-a', shelfCount: 0, doorCount: 0, drawerCount: 8, hasGlassDoors: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'رخام أسود نيرو ماركينا', thickness: 30, color: '#1a1a1a' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب جوز طبيعي مع زجاج أسود عاكس فوميه (Smoked Glass & Walnut)',
    frontColor: '#3d2b1f',
    bodyColor: '#1e293b',
    handleStyle: 'بروفايل مقبض خفي أسود إيطالي',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 2.2 SMOKED GLASS SLIDING WARDROBE (3.8m x 2.8m)
export const PROJECT_DRESSING_GLASS_SLIDING: ProjectData = {
  metadata: {
    id: 'proj-dressing-glass-sliding-01',
    name: 'دريسنج زجاج أسود عاكس فوميه وسلايدنج إيطالي مع ليد (Smoked Glass Sliding)',
    projectType: 'dressing',
    materialSystem: 'wood',
    clientName: 'برج النيل',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'دولاب ملابس سحاب إيطالي بأبواب زجاج فوميه عاكس ومقاطع ألومنيوم سوداء نحيفة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 3800,
    length: 2800,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'w1', name: 'جدار الخزانة', startX: 0, startY: 0, endX: 3800, endY: 0, thickness: 150, height: 2800 },
      { id: 'w2', name: 'جدار أيمـن', startX: 3800, startY: 0, endX: 3800, endY: 2800, thickness: 150, height: 2800 },
      { id: 'w3', name: 'جدار أمامي', startX: 3800, startY: 2800, endX: 0, endY: 2800, thickness: 150, height: 2800 },
      { id: 'w4', name: 'جدار أيسـر', startX: 0, startY: 2800, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'GS-01', name: 'دولاب تعليق ملابس زجاج فوميه', category: 'wardrobe', type: 'wardrobe-glass-vitrine', projectType: 'dressing', width: 1200, height: 2600, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 2, doorCount: 2, drawerCount: 0, hasGlassDoors: true, hasHangingRail: true },
    { id: 'GS-02', name: 'دولاب أرفف وأدراج داخلية مبطنة مخمل', category: 'wardrobe', type: 'wardrobe-shelves-drawers', projectType: 'dressing', width: 1000, height: 2600, depth: 600, x: 1200, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 4, doorCount: 2, drawerCount: 4, hasGlassDoors: true },
    { id: 'GS-03', name: 'برج أحذية وحقائب بإضاءة ليد رأسية', category: 'wardrobe', type: 'wardrobe-glass-vitrine', projectType: 'dressing', width: 1000, height: 2600, depth: 600, x: 2200, y: 0, z: 100, rotation: 0, wallId: 'w1', shelfCount: 6, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: DEFAULT_PLINTH_CONFIG,
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'زجاج أسود فوميه عاكس مع إطارات ألومنيوم (Smoked Glass Profile)',
    frontColor: '#1e293b',
    bodyColor: '#0f172a',
    handleStyle: 'مقبض بروفايل ألومنيوم أسود مدمج',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 3. BEDROOMS COLLECTION (مجموعة غرف النوم الفاخرة)
// =========================================================================

// 3.1 MASTER KING UPHOLSTERED SUITE (5.0m x 4.2m)
export const PROJECT_BEDROOM_MASTER_KING: ProjectData = {
  metadata: {
    id: 'proj-bedroom-master-king-01',
    name: 'غرفة نوم ماستر ملكية مع ظهر سرير مبطن وتسريحة بانورامية (Master King Suite)',
    projectType: 'bedroom',
    materialSystem: 'wood',
    clientName: 'فيلا الرحاب',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'غرفة نوم ماستر بسرير كينج 180×200 سم مع ظهر سرير قماش بوكليه ممتد، كومودينو معلق، وتسريحة بمرايا مضيئة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 5000,
    length: 4200,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'w-bed-a', name: 'جدار السرير الرئيسي والبانوهات', startX: 0, startY: 0, endX: 5000, endY: 0, thickness: 150, height: 2800 },
      { id: 'w-bed-b', name: 'جدار التسريحة والمكتب', startX: 5000, startY: 0, endX: 5000, endY: 4200, thickness: 150, height: 2800 },
      { id: 'w-bed-c', name: 'جدار الشاشة والمدخل', startX: 5000, startY: 4200, endX: 0, endY: 4200, thickness: 150, height: 2800 },
      { id: 'w-bed-d', name: 'جدار النوافذ والستائر', startX: 0, startY: 4200, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'win-bed', name: 'نافذة بانورامية كبيرة', type: 'window', x: 1500, y: 4200, z: 800, width: 2000, height: 1600, depth: 150, rotation: 180, wallId: 'w-bed-c' },
    ],
  },
  cabinets: [
    { id: 'BED-01', name: 'سرير كينج ماستر 180×200 سم بظهر مبطن', category: 'bed', type: 'bed-king-upholstered', projectType: 'bedroom', width: 2000, height: 1200, depth: 2150, x: 1500, y: 0, z: 0, rotation: 0, wallId: 'w-bed-a', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'NS-L', name: 'كومودينو معلق أيسر بدرجين ولد', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 550, height: 450, depth: 400, x: 850, y: 0, z: 150, rotation: 0, wallId: 'w-bed-a', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'NS-R', name: 'كومودينو معلق أيمن بدرجين ولد', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 550, height: 450, depth: 400, x: 3600, y: 0, z: 150, rotation: 0, wallId: 'w-bed-a', shelfCount: 0, doorCount: 0, drawerCount: 2 },
    { id: 'DRS-01', name: 'تسريحة ماستر 6 أدراج بسطح كوارتز ومرايا LED', category: 'dresser', type: 'dresser-6drawers', projectType: 'bedroom', width: 1400, height: 850, depth: 500, x: 5000, y: 1200, z: 0, rotation: -90, wallId: 'w-bed-b', shelfCount: 0, doorCount: 0, drawerCount: 6 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'رخام كلكتا جولد ناعم', thickness: 20, color: '#fbfbfb' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 60 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'قماش بوكليه بيج عاجي مع خشب أرو طبيعي (Ivory Boucle & Natural Oak)',
    frontColor: '#f1ebe1',
    bodyColor: '#2d241e',
    handleStyle: 'مقابض ذهبية نحاسية مطفية (Brushed Brass)',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 3.2 JAPANDI MINIMAL PLATFORM BEDROOM (4.4m x 3.6m)
export const PROJECT_BEDROOM_JAPANDI_MINIMAL: ProjectData = {
  metadata: {
    id: 'proj-bedroom-japandi-01',
    name: 'غرفة نوم جاباندي مينيمال بسرير منخفض وبانوهات خشب طبيعي (Japandi Minimal)',
    projectType: 'bedroom',
    materialSystem: 'wood',
    clientName: 'شقة جاردن سيتي',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'طراز جاباندي هادئ وبسيط يجمع بين الخشب الطبيعي الفاتح والخطوط المينيمال المريحة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4400,
    length: 3600,
    ceilingHeight: 2700,
    wallThickness: 150,
    walls: [
      { id: 'w1', name: 'جدار السرير', startX: 0, startY: 0, endX: 4400, endY: 0, thickness: 150, height: 2700 },
      { id: 'w2', name: 'جدار جانبي', startX: 4400, startY: 0, endX: 4400, endY: 3600, thickness: 150, height: 2700 },
      { id: 'w3', name: 'جدار مقابل', startX: 4400, startY: 3600, endX: 0, endY: 3600, thickness: 150, height: 2700 },
      { id: 'w4', name: 'جدار المدخل', startX: 0, startY: 3600, endX: 0, endY: 0, thickness: 150, height: 2700 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'JP-BED', name: 'سرير منصة جاباندي منخفض 180×200', category: 'bed', type: 'bed-king-upholstered', projectType: 'bedroom', width: 2100, height: 800, depth: 2200, x: 1150, y: 0, z: 0, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'JP-NS1', name: 'كومودينو جاباندي عائم أيسر', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 500, height: 300, depth: 400, x: 550, y: 0, z: 150, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 0, drawerCount: 1 },
    { id: 'JP-NS2', name: 'كومودينو جاباندي عائم أيمن', category: 'nightstand', type: 'nightstand-2drawers', projectType: 'bedroom', width: 500, height: 300, depth: 400, x: 3350, y: 0, z: 150, rotation: 0, wallId: 'w1', shelfCount: 0, doorCount: 0, drawerCount: 1 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: DEFAULT_PLINTH_CONFIG,
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب أرو طبيعي ياباني فاتح (Light Japanese Oak)',
    frontColor: '#dfd2be',
    bodyColor: '#3a342c',
    handleStyle: 'بدون مقابض بنظام الدفع للفتح (Push-to-Open)',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 4. LIBRARIES & TV UNITS COLLECTION (مجموعة المكتبات ووحدات الشاشات)
// =========================================================================

// 4.1 FLOOR-TO-CEILING 75" TV WALL LIBRARY (5.0m x 3.8m)
export const PROJECT_LIBRARY_FULL_WALL: ProjectData = {
  metadata: {
    id: 'proj-library-full-wall-01',
    name: 'مكتبة جدارية كاملة مع تجويف شاشة 75 بوصة ووحدات أرفف فخمة (Full Wall Library)',
    projectType: 'library',
    materialSystem: 'wood',
    clientName: 'فيلا النرجس',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مكتبة جدارية سقفية مع شاشة تلفزيون 75 بوصة غاطسة، أرفف كتب مضيئة، وخزائن سفلية مغلقة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 5000,
    length: 3800,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'w1', name: 'جدار المكتبة والشاشة الرئيسي', startX: 0, startY: 0, endX: 5000, endY: 0, thickness: 150, height: 2800 },
      { id: 'w2', name: 'الجدار الأيمن', startX: 5000, startY: 0, endX: 5000, endY: 3800, thickness: 150, height: 2800 },
      { id: 'w3', name: 'جدار الجلسة', startX: 5000, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 2800 },
      { id: 'w4', name: 'الجدار الأيسر', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [],
  },
  cabinets: [
    { id: 'LIB-TV', name: 'وحدة شاشة تلفزيون 75 بوصة مع بانوهات خشب مضلعة', category: 'tv-media', type: 'living-tv-slat-wall', projectType: 'library', width: 2000, height: 2600, depth: 450, x: 1500, y: 0, z: 0, rotation: 0, wallId: 'w1', shelfCount: 2, doorCount: 2, drawerCount: 3 },
    { id: 'LIB-L', name: 'برج مكتبة كتب وعرض تحف أيسر بإضاءة ليد', category: 'bookshelf', type: 'library-unit-standard', projectType: 'library', width: 1200, height: 2600, depth: 380, x: 300, y: 0, z: 0, rotation: 0, wallId: 'w1', shelfCount: 5, doorCount: 2, drawerCount: 0 },
    { id: 'LIB-R', name: 'برج فيترينة زجاجية وتحف أيمن', category: 'display', type: 'library-unit-standard', projectType: 'library', width: 1200, height: 2600, depth: 380, x: 3500, y: 0, z: 0, rotation: 0, wallId: 'w1', shelfCount: 5, doorCount: 2, drawerCount: 0, hasGlassDoors: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 80 },
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب أرو أمريكي رمادي مع بانوهات مضلعة (American Grey Oak Slats)',
    frontColor: '#5c544d',
    bodyColor: '#1e293b',
    handleStyle: 'نظام ضغط Push-to-open خفي',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 5. LIVING & DINING COLLECTION (مجموعة الصالون وغرف المعيشة والسفرة)
// =========================================================================

// 5.1 OPEN LUXURY LIVING & DINING SUITE (6.0m x 4.5m)
export const PROJECT_LIVING_LUXURY_OPEN: ProjectData = {
  metadata: {
    id: 'proj-living-luxury-01',
    name: 'صالون ومعيشة مودرن مع جدار شاشة مضلع وطاولة طعام 6 مقاعد (Open Living & Dining)',
    projectType: 'living',
    materialSystem: 'wood',
    clientName: 'بنتهاوس القطامية',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'صالون مودرن فاخر مفتوح على السفرة مع كنب ركنة L، طاولة قهوة رخامية، وجدار شاشة TV خشب مضلع.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 6000,
    length: 4500,
    ceilingHeight: 2850,
    wallThickness: 150,
    walls: [
      { id: 'w-lv-1', name: 'جدار الشاشة والبانوهات الرئيسي', startX: 0, startY: 0, endX: 6000, endY: 0, thickness: 150, height: 2850 },
      { id: 'w-lv-2', name: 'جدار النوافذ البانورامية', startX: 6000, startY: 0, endX: 6000, endY: 4500, thickness: 150, height: 2850 },
      { id: 'w-lv-3', name: 'الجدار الخلفي للسفرة', startX: 6000, startY: 4500, endX: 0, endY: 4500, thickness: 150, height: 2850 },
      { id: 'w-lv-4', name: 'جدار المدخل والصالون', startX: 0, startY: 4500, endX: 0, endY: 0, thickness: 150, height: 2850 },
    ],
    elements: [
      { id: 'win-lv', name: 'نافذة بانورامية كبيرة مطله على الحديقة', type: 'window', x: 1200, y: 4500, z: 500, width: 2800, height: 2100, depth: 150, rotation: 180, wallId: 'w-lv-3' },
    ],
  },
  cabinets: [
    { id: 'LV-TV', name: 'جدارية شاشة تلفزيون 75 بوصة ببانوهات خشب مضلعة', category: 'tv-wall', type: 'living-tv-slat-wall', projectType: 'living', width: 2400, height: 2600, depth: 400, x: 1800, y: 0, z: 0, rotation: 0, wallId: 'w-lv-1', shelfCount: 1, doorCount: 0, drawerCount: 3 },
    { id: 'LV-SOFA', name: 'كنب ركنة مودرن فاخر حرف L قماش بوكليه', category: 'sofa', type: 'living-sofa-l-shape', projectType: 'living', width: 2800, height: 850, depth: 1800, x: 1600, y: 2500, z: 0, rotation: 180, wallId: 'w-lv-1', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'LV-CTABLE', name: 'طاولة قهوة مستطيلة رخام كلكتا وقاعدة معدن', category: 'coffee-table', type: 'living-coffee-table', projectType: 'living', width: 1200, height: 420, depth: 700, x: 2400, y: 1600, z: 0, rotation: 0, wallId: 'w-lv-1', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'LV-DINING', name: 'طاولة طعام سفرة مودرن 6 كراسي رخام وخشب', category: 'dining-table', type: 'dining-table-6seat', projectType: 'living', width: 1800, height: 760, depth: 900, x: 4400, y: 1800, z: 0, rotation: 90, wallId: 'w-lv-1', shelfCount: 0, doorCount: 0, drawerCount: 0 },
    { id: 'LV-PLANT', name: 'نبتة مونستيرا استوائية داخلية بوعاء سيراميك', category: 'accent', type: 'accent-indoor-plant', projectType: 'living', width: 450, height: 1400, depth: 450, x: 600, y: 200, z: 0, rotation: 0, wallId: 'w-lv-1', shelfCount: 0, doorCount: 0, drawerCount: 0 },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, material: 'رخام كلكتا جولد ناعم', thickness: 30, color: '#fcfcfc' },
  plinth: DEFAULT_PLINTH_CONFIG,
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب جوز طبيعي وقماش بوكليه رمادي لؤلؤي (Walnut & Pearl Boucle)',
    frontColor: '#3a2d24',
    bodyColor: '#1e293b',
    handleStyle: 'بروفايل أسود مدمج',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 6. MASTER REGISTRY OF ALL READY-MADE COMPLETE PROJECTS
// =========================================================================
export interface ReadyProjectTemplate {
  id: string;
  category: ProjectType;
  name: string;
  style: string;
  dimensions: string;
  cabinetCount: number;
  data: ProjectData;
  previewThumbnail: string;
  tags: string[];
}

export const ALL_SAMPLE_PROJECTS: ReadyProjectTemplate[] = [
  // --- KITCHENS ---
  {
    id: 'proj-kitchen-island-01',
    category: 'kitchen',
    name: 'مطبخ فيلا فاخر مع جزيرة رخام كلكتا وجلسة بار',
    style: 'Luxury Island Villa',
    dimensions: '5.4m × 4.2m',
    cabinetCount: 11,
    data: PROJECT_KITCHEN_LUXURY_ISLAND,
    previewThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tags: ['Island', 'Smoked Walnut', 'Calacatta Gold', 'Tall Towers', 'Luxury'],
  },
  {
    id: 'proj-kitchen-classic-shaker-01',
    category: 'kitchen',
    name: 'مطبخ كلاسيك شيكر أبيض مع بانترى وأفران مدمجة',
    style: 'Classic Shaker',
    dimensions: '4.8m × 3.6m',
    cabinetCount: 8,
    data: PROJECT_KITCHEN_CLASSIC_SHAKER,
    previewThumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    tags: ['U-Shape', 'Classic Shaker', 'White Matte', 'Carrara Marble', 'Brass Pulls'],
  },
  {
    id: 'proj-kitchen-l-cashmere-01',
    category: 'kitchen',
    name: 'مطبخ مودرن حرف L كاشمير مع ليد بانل وإضاءة خافتة',
    style: 'Modern Cashmere',
    dimensions: '4.2m × 3.2m',
    cabinetCount: 7,
    data: PROJECT_KITCHEN_MODERN_L_CASHMERE,
    previewThumbnail: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    tags: ['L-Shape', 'Warm Cashmere', 'Bronze Gola', 'LED Strip', 'Minimal'],
  },
  {
    id: 'proj-kitchen-parallel-01',
    category: 'kitchen',
    name: 'مطبخ متوازي ذكي للشقق العصرية مساحات محددة',
    style: 'Urban Parallel Galley',
    dimensions: '3.6m × 2.4m',
    cabinetCount: 6,
    data: PROJECT_KITCHEN_PARALLEL_GALLEY,
    previewThumbnail: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
    tags: ['Parallel Galley', 'Compact Kitchen', 'Anthracite Matte', 'Smart Storage'],
  },
  {
    id: 'proj-kitchen-default-l',
    category: 'kitchen',
    name: 'مطبخ حرف L متكامل قياسي مع أجهزة كاملة',
    style: 'Standard Modern L',
    dimensions: '4.2m × 3.6m',
    cabinetCount: 8,
    data: SAMPLE_PROJECT_KITCHEN,
    previewThumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    tags: ['L-Shape', 'Modern White & Oak', 'Integrated Appliances', 'Standard'],
  },

  // --- DRESSING ROOMS ---
  {
    id: 'proj-dressing-master-u-01',
    category: 'dressing',
    name: 'غرفة ملابس ماستر ملكية حرف U مع جزيرة وساعات',
    style: 'Royal Master Suite',
    dimensions: '4.4m × 3.8m',
    cabinetCount: 10,
    data: PROJECT_DRESSING_MASTER_U,
    previewThumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    tags: ['U-Shape Dressing', 'Jewelry Island', 'Smoked Glass Vitrine', 'Sensor LED'],
  },
  {
    id: 'proj-dressing-glass-sliding-01',
    category: 'dressing',
    name: 'دريسنج زجاج أسود عاكس فوميه وسلايدنج إيطالي مع ليد',
    style: 'Smoked Glass Sliding',
    dimensions: '3.8m × 2.8m',
    cabinetCount: 6,
    data: PROJECT_DRESSING_GLASS_SLIDING,
    previewThumbnail: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80',
    tags: ['Sliding Glass', 'Smoked Black', 'Shoe Towers', 'Italian Track'],
  },
  {
    id: 'proj-dressing-default-l',
    category: 'dressing',
    name: 'غرفة ملابس ودريسنج روم ماستر حرف L مع جزيرة',
    style: 'Modern Walk-in L',
    dimensions: '3.8m × 3.2m',
    cabinetCount: 7,
    data: SAMPLE_PROJECT_DRESSING,
    previewThumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    tags: ['L-Shape Dressing', 'Jewelry Island', 'Shoe Tower', 'Walk-in'],
  },

  // --- BEDROOMS ---
  {
    id: 'proj-bedroom-master-king-01',
    category: 'bedroom',
    name: 'غرفة نوم ماستر ملكية مع سرير كينج مبطن وتسريحة بانورامية',
    style: 'Luxury King Suite',
    dimensions: '5.0m × 4.2m',
    cabinetCount: 6,
    data: PROJECT_BEDROOM_MASTER_KING,
    previewThumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    tags: ['King Suite', 'Boucle Upholstery', 'Warm Cashmere', 'Floating Nightstands'],
  },
  {
    id: 'proj-bedroom-japandi-01',
    category: 'bedroom',
    name: 'غرفة نوم جاباندي مينيمال بسرير منخفض وبانوهات خشب طبيعي',
    style: 'Japandi Minimal',
    dimensions: '4.4m × 3.6m',
    cabinetCount: 5,
    data: PROJECT_BEDROOM_JAPANDI_MINIMAL,
    previewThumbnail: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    tags: ['Japandi Minimal', 'Platform Bed', 'Light Oak', 'Peaceful'],
  },
  {
    id: 'proj-bedroom-default-master',
    category: 'bedroom',
    name: 'غرفة نوم رئيسية ماستر مع تسريحة ووحدة تلفزيون',
    style: 'Contemporary Master',
    dimensions: '4.8m × 4.2m',
    cabinetCount: 6,
    data: SAMPLE_PROJECT_BEDROOM,
    previewThumbnail: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    tags: ['Master King Bed', 'Upholstered Headboard', 'Dresser & Mirror', 'TV Credenza'],
  },

  // --- LIBRARIES & TV UNITS ---
  {
    id: 'proj-library-full-wall-01',
    category: 'library',
    name: 'مكتبة جدارية كاملة مع تجويف شاشة 75 بوصة ووحدات أرفف فخمة',
    style: 'Full Wall Media Library',
    dimensions: '5.0m × 3.8m',
    cabinetCount: 5,
    data: PROJECT_LIBRARY_FULL_WALL,
    previewThumbnail: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80',
    tags: ['Full Wall Library', '75" TV Cavity', 'Glass Display', 'Oak Wood Slats'],
  },
  {
    id: 'proj-library-default',
    category: 'library',
    name: 'مكتبة جدارية متكاملة ووحدة شاشة تلفزيون 65 بوصة',
    style: 'Modern Media Center',
    dimensions: '5.0m × 3.8m',
    cabinetCount: 4,
    data: SAMPLE_PROJECT_LIBRARY,
    previewThumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    tags: ['Full Wall Library', '65" TV Cavity', 'Glass Display', 'Oak Wood'],
  },

  // --- LIVING & DINING ---
  {
    id: 'proj-living-luxury-01',
    category: 'living',
    name: 'صالون ومعيشة مودرن مع جدار شاشة مضلع وطاولة طعام 6 مقاعد',
    style: 'Open Concept Living & Dining',
    dimensions: '6.0m × 4.5m',
    cabinetCount: 6,
    data: PROJECT_LIVING_LUXURY_OPEN,
    previewThumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    tags: ['Open Living & Dining', 'Wood Slat Wall', 'Marble Coffee Table', 'Sectional Sofa'],
  },
];
