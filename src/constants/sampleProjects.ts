import { ProjectData } from '../types';
import { 
  DEFAULT_MANUFACTURING_SETTINGS, 
  DEFAULT_COUNTERTOP_CONFIG, 
  DEFAULT_PLINTH_CONFIG, 
  DEFAULT_BACKSPLASH_CONFIG, 
  DEFAULT_MATERIAL_FINISHES,
  DEFAULT_PRICING_SETTINGS
} from './standards';

// 1. KITCHEN TEMPLATE
export const SAMPLE_PROJECT_KITCHEN: ProjectData = {
  metadata: {
    id: 'proj-kitchen-01',
    name: 'مطبخ مودرن حرف L مع برج أفران وثلاجة',
    projectType: 'kitchen',
    materialSystem: 'wood',
    clientName: 'أ / أحمد ومريم السيد',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-27',
    notes: 'مطبخ مودرن بدون مقابض، أسطح رخام كوارتز كلكتا جولد إيطالي، مع برج أفران وثلاجة بيلت إن متكاملة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4200,
    length: 3600,
    ceilingHeight: 2600,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (الخلفي)', startX: 0, startY: 0, endX: 4200, endY: 0, thickness: 150, height: 2600 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن)', startX: 4200, startY: 0, endX: 4200, endY: 3600, thickness: 150, height: 2600 },
      { id: 'wall-c', name: 'الجدار ج (الأمامي)', startX: 4200, startY: 3600, endX: 0, endY: 3600, thickness: 150, height: 2600 },
      { id: 'wall-d', name: 'الجدار د (الأيسر)', startX: 0, startY: 3600, endX: 0, endY: 0, thickness: 150, height: 2600 },
    ],
    elements: [
      { id: 'win-01', name: 'نافذة المطبخ فوق الحوض', type: 'window', x: 1800, y: 0, z: 950, width: 1200, height: 1100, depth: 150, rotation: 0, wallId: 'wall-a' },
      { id: 'door-01', name: 'باب التراس', type: 'door', x: 3500, y: 3600, z: 0, width: 900, height: 2100, depth: 150, rotation: 180, wallId: 'wall-c', openingDirection: 'inward-left' },
    ],
  },
  cabinets: [
    { id: 'T01', name: 'دولاب ثلاجة مدمجة', category: 'tall', type: 'tall-fridge-housing', projectType: 'kitchen', width: 600, height: 2050, depth: 580, x: 0, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 2, drawerCount: 0, doorHinge: 'right' },
    { id: 'T02', name: 'برج أفران وميكروويف مدمج', category: 'tall', type: 'tall-oven-tower', projectType: 'kitchen', width: 600, height: 2050, depth: 580, x: 600, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 2, drawerCount: 1, doorHinge: 'right', hasApplianceCavity: true },
    { id: 'B01', name: 'سفلي 3 أدراج (معالق وحلل)', category: 'base', type: 'base-drawers-3', projectType: 'kitchen', width: 600, height: 720, depth: 560, x: 1200, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 3, doorHinge: 'none' },
    { id: 'B02', name: 'وحدة حوض غسيل', category: 'base', type: 'base-sink', projectType: 'kitchen', width: 800, height: 720, depth: 560, x: 1800, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasSinkCutout: true },
    { id: 'B03', name: 'غسالة صحون مدمجة', category: 'base', type: 'base-single-door', projectType: 'kitchen', width: 600, height: 720, depth: 560, x: 2600, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 1, drawerCount: 0, doorHinge: 'right' },
    { id: 'B04', name: 'وحدة ركنة زاوية L (90°)', category: 'corner', type: 'base-corner-l', projectType: 'kitchen', width: 900, height: 720, depth: 900, x: 3200, y: 0, z: 100, rotation: 0, wallId: 'wall-a', shelfCount: 1, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
    { id: 'B05', name: 'سفلي مسطح طهي وبوتجاز', category: 'base', type: 'base-drawers-2', projectType: 'kitchen', width: 900, height: 720, depth: 560, x: 4200 - 560, y: 900, z: 100, rotation: 90, wallId: 'wall-b', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'W01', name: 'علوي بابين مدمج بالشفاط', category: 'wall', type: 'wall-double-door', projectType: 'kitchen', width: 900, height: 720, depth: 350, x: 4200 - 350, y: 900, z: 1450, rotation: 90, wallId: 'wall-b', shelfCount: 2, doorCount: 2, drawerCount: 0, doorHinge: 'double' },
  ],
  appliances: [
    { id: 'A01', name: 'حوض ساقط بالرخام', type: 'sink-single', width: 600, height: 200, depth: 450, x: 1900, y: 100, z: 850, rotation: 0, wallId: 'wall-a' },
    { id: 'A02', name: 'مسطح طهي بلت إن', type: 'cooktop-induction', width: 800, height: 50, depth: 520, x: 4200 - 500, y: 950, z: 850, rotation: 90, wallId: 'wall-b' },
    { id: 'A03', name: 'فرن بلت إن كهربائي', type: 'oven-builtin', width: 595, height: 595, depth: 560, x: 600, y: 10, z: 880, rotation: 0, wallId: 'wall-a', finish: 'black' },
  ],
  architecturalElements: [],
  countertop: DEFAULT_COUNTERTOP_CONFIG,
  plinth: DEFAULT_PLINTH_CONFIG,
  backsplash: DEFAULT_BACKSPLASH_CONFIG,
  materials: DEFAULT_MATERIAL_FINISHES,
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: DEFAULT_PRICING_SETTINGS,
};

// 2. DRESSING ROOM TEMPLATE
export const SAMPLE_PROJECT_DRESSING: ProjectData = {
  metadata: {
    id: 'proj-dressing-01',
    name: 'غرفة ملابس ودريسنج روم ماستر (Walk-in)',
    projectType: 'dressing',
    materialSystem: 'wood',
    clientName: 'د / سارة القاضي',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-27',
    notes: 'دريسنج روم مفتوح مع جزيرة إكسسوارات وساعات، أرفف أحذية مائلة، ووحدات تعليق مزدوج مع إضاءة بروفايل ليد.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 3800,
    length: 3200,
    ceilingHeight: 2700,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (الخلفي)', startX: 0, startY: 0, endX: 3800, endY: 0, thickness: 150, height: 2700 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن)', startX: 3800, startY: 0, endX: 3800, endY: 3200, thickness: 150, height: 2700 },
      { id: 'wall-c', name: 'الجدار ج (الأمامي)', startX: 3800, startY: 3200, endX: 0, endY: 3200, thickness: 150, height: 2700 },
      { id: 'wall-d', name: 'الجدار د (الأيسر)', startX: 0, startY: 3200, endX: 0, endY: 0, thickness: 150, height: 2700 },
    ],
    elements: [
      { id: 'door-dr', name: 'باب الدريسنج الزجاجي', type: 'door', x: 1500, y: 3200, z: 0, width: 900, height: 2100, depth: 150, rotation: 180, wallId: 'wall-c', openingDirection: 'inward-left' },
    ],
  },
  cabinets: [
    { id: 'WD01', name: 'وحدة تعليق طويل للفساتين والعبايات', category: 'wardrobe', type: 'wardrobe-walkin-open', projectType: 'dressing', width: 1000, height: 2600, depth: 550, x: 0, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasHangingRail: true, hangingRailCount: 1 },
    { id: 'WD02', name: 'وحدة تعليق مزدوج (قمصان وبدل)', category: 'closet-internals', type: 'wardrobe-hanging-double', projectType: 'dressing', width: 900, height: 2600, depth: 550, x: 1000, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 2, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasHangingRail: true, hangingRailCount: 2 },
    { id: 'WD03', name: 'برج أدراج ومطبق ملابس', category: 'closet-internals', type: 'wardrobe-shelves-drawers', projectType: 'dressing', width: 800, height: 2600, depth: 550, x: 1900, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 4, doorCount: 0, drawerCount: 4, doorHinge: 'none', doorType: 'open' },
    { id: 'WD04', name: 'وحدة أرفف أحذية مائلة مخصصة', category: 'accessories', type: 'wardrobe-shoe-rack', projectType: 'dressing', width: 800, height: 2600, depth: 400, x: 2700, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 8, doorCount: 0, drawerCount: 0, doorHinge: 'none', doorType: 'open', hasShoeShelves: true },
    { id: 'WD05', name: 'جزيرة دريسنج مع درج إكسسوارات وساعات', category: 'accessories', type: 'wardrobe-jewelry-vanity', projectType: 'dressing', width: 1200, height: 900, depth: 700, x: 1300, y: 1500, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 6, doorHinge: 'none', doorType: 'open', hasJewelryDrawer: true },
  ],
  appliances: [],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, enabled: false },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 60 },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: false },
  materials: { ...DEFAULT_MATERIAL_FINISHES, frontFinish: 'خشب جوز أمريكي مدخن (Walnut)', bodyColor: '#594433' },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: { ...DEFAULT_PRICING_SETTINGS, pricePerLinearMeterTall: 4800 },
};

// 3. BEDROOM TEMPLATE
export const SAMPLE_PROJECT_BEDROOM: ProjectData = {
  metadata: {
    id: 'proj-bedroom-01',
    name: 'غرفة نوم رئيسية ماستر (Master Suite)',
    projectType: 'bedroom',
    materialSystem: 'wood',
    clientName: 'م / عمر طارق',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-27',
    notes: 'غرفة نوم تضم سرير كينج ماستر مع ظهر مبطن، 2 كومودينو جانبي، تسريحة 6 أدراج مع مرآة، ووحدة تلفزيون كونسول.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 4800,
    length: 4200,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (الخلفي - جدار السرير)', startX: 0, startY: 0, endX: 4800, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن - التسريحة)', startX: 4800, startY: 0, endX: 4800, endY: 4200, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار ج (الأمامي - التلفزيون)', startX: 4800, startY: 4200, endX: 0, endY: 4200, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار د (الأيسر - المدخل)', startX: 0, startY: 4200, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'win-bd', name: 'نافذة غرفة النوم البانورامية', type: 'window', x: 2800, y: 0, z: 950, width: 1200, height: 1200, depth: 150, rotation: 0, wallId: 'wall-a' },
      { id: 'door-bd', name: 'باب غرفة النوم', type: 'door', x: 400, y: 4200, z: 0, width: 900, height: 2100, depth: 150, rotation: 180, wallId: 'wall-c', openingDirection: 'inward-left' },
    ],
  },
  cabinets: [
    { id: 'BD01', name: 'سرير كينج ماستر (180×200 سم)', category: 'bed', type: 'bed-king', projectType: 'bedroom', width: 1900, height: 1100, depth: 2150, x: 900, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0, doorHinge: 'none', mattressWidth: 1800, mattressLength: 2000, headboardHeight: 1100, headboardThickness: 100 },
    { id: 'BD02', name: 'كومودينو يسار السرير', category: 'nightstand', type: 'bedroom-nightstand', projectType: 'bedroom', width: 500, height: 500, depth: 450, x: 350, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'BD03', name: 'كومودينو يمين السرير', category: 'nightstand', type: 'bedroom-nightstand', projectType: 'bedroom', width: 500, height: 500, depth: 450, x: 2850, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 2, doorHinge: 'none' },
    { id: 'BD04', name: 'بانكيت مبطن نهاية السرير', category: 'bench', type: 'bedroom-bench-ottoman', projectType: 'bedroom', width: 1500, height: 450, depth: 450, x: 1100, y: 2200, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 0, doorCount: 0, drawerCount: 0, doorHinge: 'none' },
    { id: 'BD05', name: 'تسريحة دريسير 6 أدراج مع مرآة', category: 'dresser', type: 'bedroom-dresser-mirror', projectType: 'bedroom', width: 1400, height: 850, depth: 500, x: 4800 - 500, y: 1200, z: 0, rotation: 90, wallId: 'wall-b', shelfCount: 0, doorCount: 0, drawerCount: 6, doorHinge: 'none', hasMirror: true, mirrorHeight: 900 },
    { id: 'BD06', name: 'وحدة تلفزيون وكونسول معلقة', category: 'tv-unit', type: 'bedroom-tv-credenza', projectType: 'bedroom', width: 1800, height: 400, depth: 350, x: 1400, y: 4200 - 350, z: 450, rotation: 180, wallId: 'wall-c', shelfCount: 1, doorCount: 2, drawerCount: 1, doorHinge: 'double' },
  ],
  appliances: [
    { id: 'TV01', name: 'شاشة تلفزيون 55 بوصة', type: 'tv-screen', width: 1250, height: 720, depth: 60, x: 1675, y: 4200 - 50, z: 950, rotation: 180, wallId: 'wall-c' }
  ],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, enabled: false },
  plinth: { ...DEFAULT_PLINTH_CONFIG, enabled: false },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: false },
  materials: { ...DEFAULT_MATERIAL_FINISHES, frontFinish: 'كشمير بيج دافئ', bodyColor: '#d6cec4' },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: { ...DEFAULT_PRICING_SETTINGS, pricePerLinearMeterBase: 3800 },
};

// 4. LIBRARY & TV MEDIA WALL TEMPLATE
export const SAMPLE_PROJECT_LIBRARY: ProjectData = {
  metadata: {
    id: 'proj-library-01',
    name: 'مكتبة جدارية متكاملة ووحدة شاشة تلفزيون 65 بوصة',
    projectType: 'library',
    materialSystem: 'wood',
    clientName: 'المستشار / ياسر إبراهيم',
    designerName: 'استوديو كيتشن كاد برو',
    date: '2026-08-27',
    notes: 'مكتبة كتب كاملة الارتفاع مع قواطع رأسية، تجويف شاشة 65 بوصة مع ساوند بار، فيترينة تحف بضلف زجاج، وإضاءة ليد مدمجة.',
    unit: 'cm',
  },
  room: {
    shape: 'rectangular',
    width: 5000,
    length: 3800,
    ceilingHeight: 2800,
    wallThickness: 150,
    walls: [
      { id: 'wall-a', name: 'الجدار أ (جدار المكتبة والشاشة)', startX: 0, startY: 0, endX: 5000, endY: 0, thickness: 150, height: 2800 },
      { id: 'wall-b', name: 'الجدار ب (الأيمن)', startX: 5000, startY: 0, endX: 5000, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-c', name: 'الجدار ج (الأمامي - منطقة الجلوس)', startX: 5000, startY: 3800, endX: 0, endY: 3800, thickness: 150, height: 2800 },
      { id: 'wall-d', name: 'الجدار د (الأيسر)', startX: 0, startY: 3800, endX: 0, endY: 0, thickness: 150, height: 2800 },
    ],
    elements: [
      { id: 'door-lib', name: 'باب الصالون', type: 'door', x: 500, y: 3800, z: 0, width: 900, height: 2100, depth: 150, rotation: 180, wallId: 'wall-c', openingDirection: 'inward-left' },
    ],
  },
  cabinets: [
    { id: 'LIB01', name: 'فيترينة عرض تحف بضلف زجاج وفريم ألومنيوم', category: 'display', type: 'library-display-glass', projectType: 'library', width: 900, height: 2600, depth: 400, x: 200, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 5, doorCount: 2, drawerCount: 0, doorHinge: 'double', hasGlassDoors: true, hasIntegratedLed: true },
    { id: 'LIB02', name: 'مكتبة تلفزيون مودرن مع تجويف شاشة 65 بوصة', category: 'tv-media', type: 'library-tv-center', projectType: 'library', width: 2800, height: 2600, depth: 450, x: 1100, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 10, doorCount: 4, drawerCount: 2, doorHinge: 'double', hasTvCavity: true, tvWidth: 1500, tvHeight: 900, tvDepth: 300, verticalDividersCount: 2, hasIntegratedLed: true },
    { id: 'LIB03', name: 'مكتبة كتب مفتوحة عمودية (5 رفوف)', category: 'bookshelf', type: 'library-bookshelf-open', projectType: 'library', width: 900, height: 2600, depth: 350, x: 3900, y: 0, z: 0, rotation: 0, wallId: 'wall-a', shelfCount: 6, doorCount: 0, drawerCount: 0, doorHinge: 'none', verticalDividersCount: 1 },
  ],
  appliances: [
    { id: 'TV02', name: 'شاشة تلفزيون 65 بوصة 4K OLED', type: 'tv-screen', width: 1450, height: 830, depth: 50, x: 1775, y: 50, z: 850, rotation: 0, wallId: 'wall-a' }
  ],
  architecturalElements: [],
  countertop: { ...DEFAULT_COUNTERTOP_CONFIG, enabled: false },
  plinth: { ...DEFAULT_PLINTH_CONFIG, height: 50 },
  backsplash: { ...DEFAULT_BACKSPLASH_CONFIG, enabled: false },
  materials: { ...DEFAULT_MATERIAL_FINISHES, frontFinish: 'خشب قشرة أرو طبيعي (Oak)', bodyColor: '#bfa076' },
  manufacturing: DEFAULT_MANUFACTURING_SETTINGS,
  pricing: { ...DEFAULT_PRICING_SETTINGS, pricePerLinearMeterTall: 4200 },
};

export const SAMPLE_PROJECT_MODERN_L = SAMPLE_PROJECT_KITCHEN;
