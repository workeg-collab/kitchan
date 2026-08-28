import { ProjectData, ArchitecturalElement, DesignOption } from '../types';
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
    // Wall A Tall Towers
    { id: 'T01', name: 'دولاب ثلاجة بيلت إن فخم', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 700, height: 2400, depth: 600, x: 0, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'right' },
    { id: 'T02', name: 'برج أفران وميكروويف بيلت إن', category: 'tall', type: 'tall-oven-tower', projectType: 'kitchen', width: 600, height: 2400, depth: 600, x: 700, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 1, doorHinge: 'right', hasApplianceCavity: true },
    { id: 'T03', name: 'بانترى تخزين مؤن سحاب (Pantry)', category: 'tall', type: 'tall-pantry-pullout', projectType: 'kitchen', width: 450, height: 2400, depth: 600, x: 1300, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 5, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    
    // Wall A Main Prep Base Units
    { id: 'B01', name: 'سفلي أدراج تخزين حلل عريضة', category: 'base', type: 'base-drawers-2', projectType: 'kitchen', width: 800, height: 720, depth: 580, x: 1750, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'B02', name: 'وحدة حوض غسيل ساقط تحت الرخام', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 2550, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'B03', name: 'غسالة صحون مدمجة بالكامل', category: 'base', type: 'base-single-door', projectType: 'kitchen', width: 600, height: 720, depth: 580, x: 3450, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    { id: 'B04', name: 'سفلي ترولي بهارات وزيوت سحاب', category: 'base', type: 'base-spice-pullout', projectType: 'kitchen', width: 350, height: 720, depth: 580, x: 4050, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    { id: 'B05', name: 'سفلي 3 أدراج معالق وتنظيم', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 600, height: 720, depth: 580, x: 4400, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },

    // Wall A Upper Vitrines
    { id: 'W01', name: 'علوي زجاج فوميه فخم مع ليد مخفي', category: 'wall', type: 'wall-glass-vitrine', projectType: 'kitchen', width: 900, height: 800, depth: 360, x: 1750, y: 0, z: 1550, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasGlassDoors: true, hasIntegratedLed: true },
    { id: 'W02', name: 'علوي ضلف قلاب هيدروليك أفينتوس', category: 'wall', type: 'wall-lift-up', projectType: 'kitchen', width: 900, height: 800, depth: 360, x: 3450, y: 0, z: 1550, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 1, drawerCount: 0, doorHinge: 'top', flipUpDoor: true },
    { id: 'W03', name: 'علوي زجاج فوميه مضيء', category: 'wall', type: 'wall-glass-vitrine', projectType: 'kitchen', width: 950, height: 800, depth: 360, x: 4350, y: 0, z: 1550, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasGlassDoors: true, hasIntegratedLed: true },

    // Central Island Units
    { id: 'IS01', name: 'جزيرة سفلي مسطح طهي 90 سم بلت إن', category: 'island', type: 'base-island-cabinet', projectType: 'kitchen', width: 1000, height: 720, depth: 900, x: 2200, y: 1900, z: 100, rotation: 0, shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'IS02', name: 'جزيرة سفلي أدراج تقديم وصحون', category: 'island', type: 'base-island-cabinet', projectType: 'kitchen', width: 1000, height: 720, depth: 900, x: 3200, y: 1900, z: 100, rotation: 0, shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
  ],
  appliances: [
    { id: 'A01', name: 'حوض ساقط رخام أسود جرانيت', type: 'sink-double', width: 850, height: 220, depth: 480, x: 2575, y: 50, z: 850, rotation: 0, wallId: 'wall-a', finish: 'black' },
    { id: 'A02', name: 'مسطح حث كهرومغناطيسي 5 عيون على الجزيرة', type: 'cooktop-induction', width: 900, height: 50, depth: 520, x: 2250, y: 2090, z: 850, rotation: 0 },
    { id: 'A03', name: 'فرن بلت إن رقمي 60 سم', type: 'oven-builtin', width: 595, height: 595, depth: 560, x: 700, y: 10, z: 950, rotation: 0, wallId: 'wall-a', finish: 'black' },
    { id: 'A04', name: 'ميكروويف بلت إن شاشة لمس', type: 'microwave-builtin', width: 595, height: 380, depth: 400, x: 700, y: 10, z: 1600, rotation: 0, wallId: 'wall-a', finish: 'black' },
    { id: 'A05', name: 'شفاط جزيرة إيلاند معلق ستانلس أسود', type: 'hood-wall', width: 900, height: 600, depth: 500, x: 2250, y: 2090, z: 1800, rotation: 0, finish: 'black' },
  ],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, thickness: 40, overhangFront: 40, material: 'كوارتز كلكتا جولد إيطالي' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100, material: 'أسود مطفي' },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, height: 650, material: 'كوارتز كلكتا جولد إيطالي' },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب جوز أمريكي مدخن (Smoked Walnut)',
    frontColor: '#594433',
    bodyColor: '#27272a',
    countertopColor: '#f8fafc',
    backsplashColor: '#f8fafc',
    floorColor: '#475569',
    handleStyle: 'handleless',
    handleColor: '#d97706',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: { ...DEFAULT_PRICING_SETTINGS, pricePerLinearMeterTall: 5500, pricePerLinearMeterBase: 4200 },
  designOptions: [
    {
      id: 'opt-a',
      name: 'Option A: Smoked Walnut & Calacatta Gold',
      description: 'جوز أمريكي مدخن فاخر مع كوارتز كلكتا جولد وبروفايل جولا نحاسي',
      materials: {
        frontFinish: 'خشب جوز أمريكي مدخن (Smoked Walnut)',
        frontColor: '#594433',
        bodyColor: '#27272a',
        countertopMaterial: 'كوارتز كلكتا جولد إيطالي',
        countertopColor: '#f8fafc',
        backsplashMaterial: 'كوارتز كلكتا جولد إيطالي',
        backsplashColor: '#f8fafc',
        wallColor: '#f8fafc',
        floorMaterial: 'بورسلين رمادي حجر طبيعي',
        floorColor: '#475569',
        handleStyle: 'handleless',
        handleColor: '#d97706',
      },
      isDefault: true,
    },
    {
      id: 'opt-b',
      name: 'Option B: Matte Anthracite & Natural Oak',
      description: 'رمادي فحمي سوبر مات مع خشب أرو طبيعي دافئ وجرانيت نيرو ماركينا أسود',
      materials: {
        frontFinish: 'رمادي فحمي شاركول (Anthracite)',
        frontColor: '#27272a',
        bodyColor: '#18181b',
        countertopMaterial: 'جرانيت نيرو ماركينا أسود',
        countertopColor: '#18181b',
        backsplashMaterial: 'جرانيت نيرو ماركينا أسود',
        backsplashColor: '#18181b',
        wallColor: '#e5e0d8',
        floorMaterial: 'باركيه خشب أرو شيفرون',
        floorColor: '#8c6843',
        handleStyle: 'bar-black',
        handleColor: '#09090b',
      },
    },
    {
      id: 'opt-c',
      name: 'Option C: Warm Cashmere & Carrara White',
      description: 'كشمير بيج هادئ مع رخام كرارة أبيض كلاسيكي ومقابض نحاس مصقول',
      materials: {
        frontFinish: 'كشمير بيج دافئ (Warm Cashmere)',
        frontColor: '#d6cec4',
        bodyColor: '#cbd5e1',
        countertopMaterial: 'رخام كرارة تركي فاخر',
        countertopColor: '#e2e8f0',
        backsplashMaterial: 'رخام كرارة تركي فاخر',
        backsplashColor: '#e2e8f0',
        wallColor: '#f8fafc',
        floorMaterial: 'رخام أبيض كلكتا مصقول',
        floorColor: '#f1f5f9',
        handleStyle: 'bar-brass',
        handleColor: '#d97706',
      },
    },
  ],
};

// 1.2 COMPACT PARALLEL GALLEY KITCHEN (3.2m x 2.4m)
export const PROJECT_KITCHEN_COMPACT_GALLEY: ProjectData = {
  metadata: {
    id: 'proj-kitchen-galley-01',
    name: 'مطبخ متوازي مدمج للشقق العصرية (Compact Galley Kitchen)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'شقة مودرن جاردينيا',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'استغلال مثالي للمساحات الضيقة بنظام خطين متوازيين مع مثلث حركة مريح وسعة تخزين رأسية كاملة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 3200,
    length: 2400,
    ceilingHeight: 2600,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (خط الطهي والتحضير)', startX: 0, startY: 0, endX: 3200, endY: 0, thickness: 150, height: 2600 },
      { id: 'wall-b', name: 'الجدار ب (النافذة)', startX: 3200, startY: 0, endX: 3200, endY: 2400, thickness: 150, height: 2600 },
      { id: 'wall-c', name: 'الجدار ج (خط الحوض والثلاجة)', startX: 3200, startY: 2400, endX: 0, endY: 2400, thickness: 150, height: 2600 },
      { id: 'wall-d', name: 'الجدار د (المدخل)', startX: 0, startY: 2400, endX: 0, endY: 0, thickness: 150, height: 2600 },
    ],
    elements: [
      { id: 'win-g', name: 'نافذة تهوية المطبخ', type: 'window', x: 3200, y: 800, z: 1000, width: 800, height: 1000, depth: 150, rotation: 90, wallId: 'wall-b' },
      { id: 'door-g', name: 'باب المطبخ السحاب', type: 'door', x: 0, y: 800, z: 0, width: 800, height: 2100, depth: 150, rotation: 270, wallId: 'wall-d' },
    ],
  },
  cabinets: [
    // Wall A (Cook Line)
    { id: 'B01', name: 'سفلي أدراج بهارات وأواني', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 600, height: 720, depth: 560, x: 200, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'B02', name: 'سفلي مسطح طهي 4 عيون', category: 'base', type: 'base-drawers-2', projectType: 'kitchen', width: 800, height: 720, depth: 560, x: 800, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'B03', name: 'سفلي تخزين بابين', category: 'base', type: 'base-double-door', projectType: 'kitchen', width: 800, height: 720, depth: 560, x: 1600, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
    { id: 'T01', name: 'برج أفران ومؤن مدمج', category: 'tall', type: 'tall-oven-tower', projectType: 'kitchen', width: 600, height: 2100, depth: 580, x: 2400, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 1, doorHinge: 'right', hasApplianceCavity: true },

    // Wall A Wall Cabinets
    { id: 'W01', name: 'علوي بابين مدمج الشفاط', category: 'wall', type: 'wall-double-door', projectType: 'kitchen', width: 800, height: 720, depth: 340, x: 800, y: 0, z: 1450, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
    { id: 'W02', name: 'علوي أرفف تخزين أكواب', category: 'wall', type: 'wall-double-door', projectType: 'kitchen', width: 800, height: 720, depth: 340, x: 1600, y: 0, z: 1450, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double' },

    // Wall C (Sink & Fridge Line)
    { id: 'T02', name: 'دولاب ثلاجة مدمجة', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 650, height: 2100, depth: 580, x: 850, y: 2400, z: 100, rotation: 180, wallId: 'wall-c', shelfCount: 1, doorCount: 2, drawerCount: 0, doorHinge: 'left' },
    { id: 'B04', name: 'سفلي حوض غسيل ستانلس', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 560, x: 1750, y: 2400, z: 100, rotation: 180, wallId: 'wall-c', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'B05', name: 'غسالة صحون مدمجة 45 سم', category: 'base', type: 'base-single-door', projectType: 'kitchen', width: 450, height: 720, depth: 560, x: 2200, y: 2400, z: 100, rotation: 180, wallId: 'wall-c', shelfCount: 0, doorCount: 1, drawerCount: 0, doorHinge: 'left' },
  ],
  appliances: [
    { id: 'A01', name: 'مسطح غاز 4 عيون بلت إن', type: 'cooktop-induction', width: 600, height: 50, depth: 520, x: 900, y: 20, z: 850, rotation: 0, wallId: 'wall-a' },
    { id: 'A02', name: 'فرن كهربائي مدمج', type: 'oven-builtin', width: 595, height: 595, depth: 560, x: 2400, y: 10, z: 900, rotation: 0, wallId: 'wall-a' },
    { id: 'A03', name: 'حوض غسيل ستانلس مدمج', type: 'sink-single', width: 600, height: 200, depth: 450, x: 1900, y: 2350, z: 850, rotation: 180, wallId: 'wall-c' },
  ],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: DEFAULT_PLINTH_CONFIG,
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'أبيض ألباين ناصع مطفي',
    frontColor: '#f8fafc',
    bodyColor: '#cbd5e1',
    countertopColor: '#e2e8f0',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 1.3 CLASSIC SHAKER U-SHAPE KITCHEN (4.5m x 3.8m)
export const PROJECT_KITCHEN_SHAKER_U: ProjectData = {
  metadata: {
    id: 'proj-kitchen-shaker-u-01',
    name: 'مطبخ كلاسيك شيكر حرف U مع كورنيش وبانترى (Classic Shaker U-Shape)',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'أ / محمود عبد العال',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'تصميم كلاسيك شيكر أمريكي بحرف U متصل مع تجليد بانوهات، مسطح طهي عريض وشفاط كلاسيك معتق.',
    unit: 'cm',
  },
  room: {
    shape: 'u-shape',
    width: 4500,
    length: 3800,
    ceilingHeight: 2750,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (الرئيسي - الطهي)', startX: 0, startY: 0, endX: 4500, endY: 0, thickness: 150, height: 2750 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن - الأبراج)', startX: 4500, startY: 0, endX: 4500, endY: 3800, thickness: 150, height: 2750 },
      { id: 'wall-c', name: 'الجدار ج (المدخل)', startX: 4500, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 2750 },
      { id: 'wall-d', name: 'الجدار د (الأيسر - الحوض والنافذة)', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 2750 },
    ],
    elements: [
      { id: 'win-shk', name: 'نافذة كلاسيك مقسمة', type: 'window', x: 0, y: 1600, z: 950, width: 1200, height: 1100, depth: 150, rotation: 270, wallId: 'wall-d' },
    ],
  },
  cabinets: [
    // Corner Units connecting the U
    { id: 'C01', name: 'ركنة زاوية شيكر L يسار', category: 'corner', type: 'base-corner-l', projectType: 'kitchen', width: 900, height: 720, depth: 900, x: 0, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
    { id: 'C02', name: 'ركنة زاوية شيكر L يمين', category: 'corner', type: 'base-corner-l', projectType: 'kitchen', width: 900, height: 720, depth: 900, x: 3600, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 2, drawerCount: 0, doorHinge: 'double' },

    // Wall A Center Range Cooktop
    { id: 'B01', name: 'سفلي بوتجاز ومسطح 90 سم', category: 'base', type: 'base-drawers-2', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 1800, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'B02', name: 'سفلي أدراج توابل 45 سم', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 450, height: 720, depth: 580, x: 1350, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'B03', name: 'سفلي أدراج توابل 45 سم', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 450, height: 720, depth: 580, x: 2700, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'B04', name: 'سفلي تخزين بابين شيكر', category: 'base', type: 'base-double-door', projectType: 'kitchen', width: 450, height: 720, depth: 580, x: 900, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    { id: 'B05', name: 'سفلي تخزين بابين شيكر', category: 'base', type: 'base-double-door', projectType: 'kitchen', width: 450, height: 720, depth: 580, x: 3150, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 1, drawerCount: 0, doorHinge: 'left' },

    // Wall D (Sink Line)
    { id: 'B06', name: 'وحدة حوض شيكر فارم هاوس مزدوج', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 900, height: 720, depth: 580, x: 0, y: 1600, z: 100, rotation: 270, wallId: 'wall-d', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'B07', name: 'غسالة صحون مدمجة', category: 'base', type: 'base-single-door', projectType: 'kitchen', width: 600, height: 720, depth: 580, x: 0, y: 2500, z: 100, rotation: 270, wallId: 'wall-d', shelfCount: 0, doorCount: 1, drawerCount: 0, doorHinge: 'right' },

    // Wall B (Tall Pantry Line)
    { id: 'T01', name: 'برج أفران وميكروويف شيكر', category: 'tall', type: 'tall-oven-tower', projectType: 'kitchen', width: 600, height: 2300, depth: 600, x: 4500, y: 900, z: 100, rotation: 90, wallId: 'wall-b', shelfCount: 2, doorCount: 2, drawerCount: 1, doorHinge: 'left', hasApplianceCavity: true },
    { id: 'T02', name: 'دولاب ثلاجة بيلت إن شيكر', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 700, height: 2300, depth: 600, x: 4500, y: 1500, z: 100, rotation: 90, wallId: 'wall-b', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'left' },
    { id: 'T03', name: 'دولاب بانترى مؤن شيكر واسع', category: 'tall', type: 'tall-pantry', projectType: 'kitchen', width: 600, height: 2300, depth: 600, x: 4500, y: 2200, z: 100, rotation: 90, wallId: 'wall-b', shelfCount: 5, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
  ],
  appliances: [
    { id: 'A01', name: 'مسطح طهي غاز 90 سم شيكر', type: 'cooktop-induction', width: 900, height: 50, depth: 520, x: 1800, y: 20, z: 850, rotation: 0, wallId: 'wall-a' },
    { id: 'A02', name: 'حوض فارم هاوس رخام أبيض كلاسيك', type: 'sink-double', width: 850, height: 250, depth: 500, x: 20, y: 1650, z: 850, rotation: 270, wallId: 'wall-d' },
  ],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, thickness: 40, material: 'رخام كرارة تركي فاخر' },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 100 },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, height: 600 },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'أخضر سيج نورديك هادئ (Nordic Sage)',
    frontColor: '#65786a',
    bodyColor: '#f1f5f9',
    countertopColor: '#e2e8f0',
    handleStyle: 'bar-brass',
    handleColor: '#d97706',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 2. DRESSING ROOMS COLLECTION (مجموعة غرف الملابس الجاهزة)
// =========================================================================

// 2.1 MASTER U-SHAPED WALK-IN DRESSING SUITE (4.4m x 3.8m)
export const PROJECT_DRESSING_MASTER_U: ProjectData = {
  metadata: {
    id: 'proj-dressing-master-u',
    name: 'غرفة ملابس ماستر ملكية حرف U مع جزيرة وساعات (Master U-Walk-in)',
    projectType: 'dressing',
    materialSystem: 'wood',
    clientName: 'جناح فيلا الندى',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'غرفة ملابس فاخرة بحرف U متصل تضم فيترينات زجاج فوميه مضاءة، أرفف أحذية مائلة، ماسورات تعليق بدل وفساتين، وجزيرة ساعات وإكسسوارات.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4400,
    length: 3800,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (الخلفي - التعليق الرئيسي)', startX: 0, startY: 0, endX: 4400, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن - الأحذية والبناطيل)', startX: 4400, startY: 0, endX: 4400, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار ج (المدخل)', startX: 4400, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار د (الأيسر - الفساتين والفيترينات)', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'door-dr-m', name: 'باب دريسنج زجاج سحاب فوميه', type: 'door', x: 1750, y: 3800, z: 0, width: 900, height: 2400, depth: 150, rotation: 180, wallId: 'wall-c' },
    ],
  },
  cabinets: [
    // Wall A (Back Center Wall)
    { id: 'WD01', name: 'دولاب ركنة L زاوية مفتوحة يسار', category: 'wardrobe', type: 'wardrobe-corner-open', projectType: 'dressing', width: 1000, height: 2700, depth: 1000, x: 0, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 4, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasHangingRail: true },
    { id: 'WD02', name: 'وحدة تعليق مزدوج للبدل والقمصان', category: 'closet-internals', type: 'wardrobe-hanging-double', projectType: 'dressing', width: 1000, height: 2700, depth: 580, x: 1000, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasHangingRail: true, hangingRailCount: 2 },
    { id: 'WD03', name: 'برج أدراج مجوهرات ومطبق ملابس', category: 'closet-internals', type: 'wardrobe-shelves-drawers', projectType: 'dressing', width: 900, height: 2700, depth: 580, x: 2000, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 4, doorCount: 0, drawerCount: 4, doorHinge: 'none', doorType: 'open', hasJewelryDrawer: true },
    { id: 'WD04', name: 'وحدة تعليق طويل للعبايات والفساتين', category: 'wardrobe', type: 'wardrobe-walkin-open', projectType: 'dressing', width: 1000, height: 2700, depth: 580, x: 2900, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasHangingRail: true, hangingRailCount: 1 },
    { id: 'WD05', name: 'دولاب ركنة L زاوية مفتوحة يمين', category: 'wardrobe', type: 'wardrobe-corner-open', projectType: 'dressing', width: 1000, height: 2700, depth: 1000, x: 3900, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 4, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasHangingRail: true },

    // Wall B (Right Wall - Shoes & Trousers)
    { id: 'WD06', name: 'فيترينة أحذية مائلة مع حاجز ستانلس وليد', category: 'accessories', type: 'wardrobe-shoe-rack', projectType: 'dressing', width: 900, height: 2700, depth: 450, x: 4400, y: 1000, z: 0, rotation: 90, wallId: 'wall-b', shelfCount: 8, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasShoeShelves: true, hasIntegratedLed: true },
    { id: 'WD07', name: 'وحدة حامل بناطيل وسلال غسيل هيدروليك', category: 'accessories', type: 'wardrobe-trouser-rack', projectType: 'dressing', width: 800, height: 2700, depth: 550, x: 4400, y: 1900, z: 0, rotation: 90, wallId: 'wall-b', shelfCount: 3, doorCount: 0, drawerCount: 2, doorHinge: 'none', doorType: 'open', hasTrouserRack: true },

    // Wall D (Left Wall - Glass Vitrines)
    { id: 'WD08', name: 'فيترينة حقائب وشنط بضلف زجاج فوميه وفريم أسود', category: 'wardrobe', type: 'wardrobe-glass-doors', projectType: 'dressing', width: 900, height: 2700, depth: 550, x: 0, y: 1000, z: 0, rotation: 270, wallId: 'wall-d', shelfCount: 5, doorCount: 2, drawerCount: 0, doorHinge: 'double', doorType: 'glass-frame', hasGlassDoors: true, hasIntegratedLed: true },
    { id: 'WD09', name: 'فيترينة عبايات بضلف زجاج ليد مخفي', category: 'wardrobe', type: 'wardrobe-glass-doors', projectType: 'dressing', width: 900, height: 2700, depth: 550, x: 0, y: 1900, z: 0, rotation: 270, wallId: 'wall-d', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double', doorType: 'glass-frame', hasGlassDoors: true, hasIntegratedLed: true },

    // Central Island
    { id: 'WD10', name: 'جزيرة دريسنج مركزية مع درج إكسسوارات وساعات وسطح زجاج', category: 'accessories', type: 'wardrobe-jewelry-vanity', projectType: 'dressing', width: 1400, height: 900, depth: 800, x: 1500, y: 1600, z: 0, rotation: 0, shelfCount: 0, doorCount: 0, drawerCount: 8, doorHinge: 'none', doorType: 'open', hasJewelryDrawer: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, enabled: false },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 60 },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: false },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب جوز أمريكي مدخن فاخر (Smoked Walnut)',
    frontColor: '#594433',
    bodyColor: '#27272a',
    floorColor: '#8c6843',
    wallColor: '#e5e0d8',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: { ...DEFAULT_PRICING_SETTINGS, pricePerLinearMeterTall: 5200 },
};

// =========================================================================
// 3. BEDROOMS COLLECTION (مجموعة غرف النوم الجاهزة)
// =========================================================================

// 3.1 MASTER KING LUXURY SUITE (5.0m x 4.2m)
export const PROJECT_BEDROOM_MASTER_KING: ProjectData = {
  metadata: {
    id: 'proj-bedroom-master-king-01',
    name: 'غرفة نوم ماستر ملكية مع ظهر سرير مبطن وتسريحة بانورامية',
    projectType: 'bedroom',
    materialSystem: 'wood',
    clientName: 'د / إبراهيم خليل',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'غرفة نوم رئيسية فاخرة بسرير كينج 190 سم مع ظهر مبطن قماش بوكليه، كومودينو معلق، تسريحة دريسير عريضة ووحدة تلفزيون جدارية.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 5000,
    length: 4200,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (جدار السرير الرئيسي)', startX: 0, startY: 0, endX: 5000, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن - التسريحة والنافذة)', startX: 5000, startY: 0, endX: 5000, endY: 4200, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار ج (الأمامي - التلفزيون)', startX: 5000, startY: 4200, endX: 0, endY: 4200, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار د (الأيسر - المدخل)', startX: 0, startY: 4200, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'win-bd-m', name: 'نافذة بانورامية كبيرة', type: 'window', x: 5000, y: 2200, z: 900, width: 1400, height: 1300, depth: 150, rotation: 90, wallId: 'wall-b' },
      { id: 'door-bd-m', name: 'باب الغرفة الرئيسي', type: 'door', x: 400, y: 4200, z: 0, width: 900, height: 2200, depth: 150, rotation: 180, wallId: 'wall-c' },
    ],
  },
  cabinets: [
    { id: 'BD01', name: 'سرير كينج ماستر مبطن (190×200 سم)', category: 'bed', type: 'bed-king', projectType: 'bedroom', width: 2000, height: 1200, depth: 2200, x: 1500, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0, doorHinge: 'none', mattressWidth: 1900, mattressLength: 2000, headboardHeight: 1200, headboardThickness: 120 },
    { id: 'BD02', name: 'كومودينو يسار السرير مع درجين مخفيين', category: 'nightstand', type: 'bedroom-nightstand', projectType: 'bedroom', width: 550, height: 500, depth: 450, x: 850, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'BD03', name: 'كومودينو يمين السرير مع درجين مخفيين', category: 'nightstand', type: 'bedroom-nightstand', projectType: 'bedroom', width: 550, height: 500, depth: 450, x: 3600, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'BD04', name: 'بانكيت فخم مبطن بوكليه نهاية السرير', category: 'bench', type: 'bedroom-bench-ottoman', projectType: 'bedroom', width: 1600, height: 460, depth: 450, x: 1700, y: 2300, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0, doorHinge: 'none' },
    { id: 'BD05', name: 'تسريحة دريسير عريضة 6 أدراج مع مرآة بيضاوية ليد', category: 'dresser', type: 'bedroom-dresser-mirror', projectType: 'bedroom', width: 1600, height: 850, depth: 500, x: 5000, y: 800, z: 0, rotation: 90, wallId: 'wall-b', shelfCount: 0, doorCount: 0, drawerCount: 6, doorHinge: 'none', hasMirror: true, mirrorHeight: 950 },
    { id: 'BD06', name: 'وحدة كونسول شاشة تلفزيون معلقة', category: 'tv-unit', type: 'bedroom-tv-credenza', projectType: 'bedroom', width: 2200, height: 420, depth: 360, x: 3400, y: 4200, z: 450, rotation: 180, wallId: 'wall-c', shelfCount: 1, doorCount: 2, drawerCount: 2, doorHinge: 'double' },
  ],
  appliances: [
    { id: 'TV01', name: 'شاشة تلفزيون 65 بوصة 4K OLED', type: 'tv-screen', width: 1450, height: 830, depth: 50, x: 3025, y: 4200, z: 950, rotation: 180, wallId: 'wall-c' },
  ],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, enabled: false },
  plinth: { ...DEFAULT_PLINTH_CONFIG, enabled: false },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: false },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'كشمير بيج دافئ (Warm Cashmere)',
    frontColor: '#d6cec4',
    bodyColor: '#bfa076',
    wallColor: '#f8fafc',
    floorColor: '#8c6843',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 4. LIVING ROOM & OPEN SPACES (مجموعة غرف المعيشة والصالون)
// =========================================================================

// 4.1 LUXURY OPEN LIVING & DINING SUITE (6.0m x 4.5m)
export const PROJECT_LIVING_LUXURY_OPEN: ProjectData = {
  metadata: {
    id: 'proj-living-luxury-01',
    name: 'صالون ومعيشة مودرن مع جدار شاشة خشب مضلع وطاولة طعام 6 مقاعد',
    projectType: 'living',
    materialSystem: 'wood',
    clientName: 'أ / تامر حسني',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-28',
    notes: 'مساحة معيشة مفتوحة راقية تضم كنب ركنة وثلاثي، طاولة قهوة رخام، جدار تلفزيون كامل الارتفاع مع بانوهات خشب وسيعة، وطاولة طعام فخمة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 6000,
    length: 4500,
    ceilingHeight: 2850,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (جدار الشاشة الرئيسي)', startX: 0, startY: 0, endX: 6000, endY: 0, thickness: 150, height: 2850 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن - منطقة الطعام)', startX: 6000, startY: 0, endX: 6000, endY: 4500, thickness: 150, height: 2850 },
      { id: 'wall-c', name: 'الجدار ج (الأمامي - النوافذ والتراس)', startX: 6000, startY: 4500, endX: 0, endY: 4500, thickness: 150, height: 2850 },
      { id: 'wall-d', name: 'الجدار د (الأيسر - المدخل)', startX: 0, startY: 4500, endX: 0, endY: 0, thickness: 150, height: 2850 },
    ],
    elements: [
      { id: 'win-liv', name: 'نافذة تراس زجاج سحاب بانورامية', type: 'window', x: 2500, y: 4500, z: 0, width: 2500, height: 2400, depth: 150, rotation: 180, wallId: 'wall-c' },
    ],
  },
  cabinets: [
    { id: 'LV01', name: 'جدار شاشة متكامل مع بانوهات خشب وسيعة ووحدة كونسول معلقة', category: 'tv-wall', type: 'living-tv-slat-wall', projectType: 'living', width: 2800, height: 2800, depth: 400, x: 600, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 2, doorHinge: 'double', hasTvCavity: true, hasIntegratedLed: true },
    { id: 'LV02', name: 'بوفيه / كونسول صالون مودرن 4 أبواب مع رخام علوي', category: 'credenza', type: 'living-credenza-buffet', projectType: 'living', width: 1800, height: 850, depth: 450, x: 3800, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 4, drawerCount: 0, doorHinge: 'double' },
    { id: 'LV03', name: 'كنبة مودرن 3 مقاعد فخمة', category: 'sofa', type: 'living-sofa-3seat', projectType: 'living', width: 2400, height: 800, depth: 950, x: 800, y: 2800, z: 0, rotation: 180, wallId: 'wall-c', shelfCount: 0, doorCount: 0, drawerCount: 0, doorHinge: 'none' },
    { id: 'LV04', name: 'طاولة قهوة صالون رخام كوارتز كلكتا مزدوجة', category: 'coffee-table', type: 'living-coffee-table', projectType: 'living', width: 1200, height: 450, depth: 700, x: 1400, y: 1600, z: 0, rotation: 0, shelfCount: 1, doorCount: 0, drawerCount: 0, doorHinge: 'none' },
    { id: 'LV05', name: 'طاولة سفرة وطعام 6 مقاعد خشب أرو ورخام', category: 'dining-table', type: 'dining-table-6seat', projectType: 'living', width: 2000, height: 760, depth: 950, x: 4200, y: 2200, z: 0, rotation: 0, shelfCount: 0, doorCount: 0, drawerCount: 0, doorHinge: 'none' },
    { id: 'LV06', name: 'نبتة زينة داخلية استوائية في أصيص فخاري', category: 'accent', type: 'accent-indoor-plant', projectType: 'living', width: 500, height: 1500, depth: 500, x: 100, y: 100, z: 0, rotation: 0, shelfCount: 0, doorCount: 0, drawerCount: 0, doorHinge: 'none' },
  ],
  appliances: [
    { id: 'TV01', name: 'شاشة تلفزيون ذكية 75 بوصة 4K OLED', type: 'tv-screen', width: 1680, height: 960, depth: 60, x: 1160, y: 50, z: 850, rotation: 0, wallId: 'wall-a' },
  ],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, enabled: false },
  plinth: { ...DEFAULT_PLINTH_CONFIG, enabled: false },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: false },
  materials: {
    ...DEFAULT_MATERIAL_FINISHES,
    frontFinish: 'خشب جوز أمريكي مدخن فاخر (Smoked Walnut)',
    frontColor: '#594433',
    bodyColor: '#27272a',
    wallColor: '#f8fafc',
    floorColor: '#8c6843',
  },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// =========================================================================
// 5. MASTER TEMPLATES REGISTRY (كتالوج القوالب المكتملة)
// =========================================================================

export const ALL_SAMPLE_PROJECTS: {
  id: string;
  category: string;
  name: string;
  style: string;
  dimensions: string;
  cabinetCount: number;
  data: ProjectData;
  previewThumbnail: string;
  tags: string[];
}[] = [
  // Kitchens
  {
    id: 'proj-kitchen-01',
    category: 'kitchen',
    name: 'مطبخ مودرن حرف L مع برج أفران وثلاجة',
    style: 'Modern Minimal',
    dimensions: '4.2m × 3.6m',
    cabinetCount: 8,
    data: SAMPLE_PROJECT_KITCHEN,
    previewThumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    tags: ['L-Shape', 'Modern', 'Built-in Tower', 'Calacatta Quartz'],
  },
  {
    id: 'proj-kitchen-island-01',
    category: 'kitchen',
    name: 'مطبخ فيلا فاخر مع جزيرة رخام كلكتا وجلسة بار',
    style: 'Luxury Modern',
    dimensions: '5.4m × 4.2m',
    cabinetCount: 10,
    data: PROJECT_KITCHEN_LUXURY_ISLAND,
    previewThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tags: ['Island', 'Luxury Villa', 'Smoked Walnut', 'LED Vitrine'],
  },
  {
    id: 'proj-kitchen-galley-01',
    category: 'kitchen',
    name: 'مطبخ متوازي مدمج للشقق العصرية',
    style: 'Urban Galley',
    dimensions: '3.2m × 2.4m',
    cabinetCount: 7,
    data: PROJECT_KITCHEN_COMPACT_GALLEY,
    previewThumbnail: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    tags: ['Parallel / Galley', 'Compact', 'Matte White', 'High Efficiency'],
  },
  {
    id: 'proj-kitchen-shaker-u-01',
    category: 'kitchen',
    name: 'مطبخ كلاسيك شيكر حرف U مع كورنيش وبانترى',
    style: 'Classic Shaker',
    dimensions: '4.5m × 3.8m',
    cabinetCount: 10,
    data: PROJECT_KITCHEN_SHAKER_U,
    previewThumbnail: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    tags: ['U-Shape', 'Classic Shaker', 'Sage Green', 'Carrara Marble'],
  },

  // Dressing Rooms
  {
    id: 'proj-dressing-01',
    category: 'dressing',
    name: 'غرفة ملابس ودريسنج روم ماستر حرف L',
    style: 'Modern Walk-in',
    dimensions: '3.8m × 3.2m',
    cabinetCount: 7,
    data: SAMPLE_PROJECT_DRESSING,
    previewThumbnail: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80',
    tags: ['L-Shape Dressing', 'Jewelry Island', 'Shoe Tower', 'Walk-in'],
  },
  {
    id: 'proj-dressing-master-u',
    category: 'dressing',
    name: 'غرفة ملابس ماستر ملكية حرف U مع جزيرة وساعات',
    style: 'Luxury Master',
    dimensions: '4.4m × 3.8m',
    cabinetCount: 10,
    data: PROJECT_DRESSING_MASTER_U,
    previewThumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    tags: ['U-Shape Dressing', 'Luxury Glass Vitrine', 'Jewelry Island', 'Smoked Walnut'],
  },

  // Bedrooms
  {
    id: 'proj-bedroom-01',
    category: 'bedroom',
    name: 'غرفة نوم رئيسية ماستر مع تسريحة ووحدة تلفزيون',
    style: 'Contemporary Master',
    dimensions: '4.8m × 4.2m',
    cabinetCount: 6,
    data: SAMPLE_PROJECT_BEDROOM,
    previewThumbnail: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    tags: ['Master King Bed', 'Upholstered Headboard', 'Dresser & Mirror', 'TV Credenza'],
  },
  {
    id: 'proj-bedroom-master-king-01',
    category: 'bedroom',
    name: 'غرفة نوم ماستر ملكية مع ظهر سرير مبطن وتسريحة بانورامية',
    style: 'Luxury Suite',
    dimensions: '5.0m × 4.2m',
    cabinetCount: 6,
    data: PROJECT_BEDROOM_MASTER_KING,
    previewThumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    tags: ['King Suite', 'Boucle Upholstery', 'Warm Cashmere', 'Floating Nightstands'],
  },

  // Libraries & TV Units
  {
    id: 'proj-library-01',
    category: 'library',
    name: 'مكتبة جدارية متكاملة ووحدة شاشة تلفزيون 65 بوصة',
    style: 'Modern Media Center',
    dimensions: '5.0m × 3.8m',
    cabinetCount: 3,
    data: SAMPLE_PROJECT_LIBRARY,
    previewThumbnail: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80',
    tags: ['Full Wall Library', '65" TV Cavity', 'Glass Display', 'Oak Wood'],
  },

  // Living & Dining
  {
    id: 'proj-living-luxury-01',
    category: 'living',
    name: 'صالون ومعيشة مودرن مع جدار شاشة خشب مضلع وطاولة طعام 6 مقاعد',
    style: 'Open Concept Living',
    dimensions: '6.0m × 4.5m',
    cabinetCount: 6,
    data: PROJECT_LIVING_LUXURY_OPEN,
    previewThumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    tags: ['Open Living & Dining', 'Wood Slat Wall', 'Marble Coffee Table', 'Sectional Sofa'],
  },
];
