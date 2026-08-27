import { BedroomCategory, CabinetType, BedType } from '../types';

export interface BedroomTemplate {
  category: BedroomCategory;
  type: CabinetType;
  bedType?: BedType;
  name: string;
  nameEn: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  defaultZ: number;
  doorCount: number;
  drawerCount: number;
  shelfCount: number;
  standardWidths: number[];
  icon: string;
  mattressWidth?: number;
  mattressLength?: number;
  headboardHeight?: number;
  headboardThickness?: number;
  hasHydraulicStorage?: boolean;
  hasMirror?: boolean;
  mirrorHeight?: number;
}

export const BEDROOM_LIBRARY: BedroomTemplate[] = [
  // --- أسرّة (BEDS) ---
  {
    category: 'bed',
    type: 'bed-king',
    bedType: 'king',
    name: 'سرير كينج ماستر (180×200 سم)',
    nameEn: 'King Size Master Bed (180x200)',
    description: 'سرير كينج مع ظهر مبطن فخم (Headboard) وشاسيه خشب ماسيف مع موالح دعم',
    defaultWidth: 1900,
    defaultHeight: 1100,
    defaultDepth: 2150,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    mattressWidth: 1800,
    mattressLength: 2000,
    headboardHeight: 1100,
    headboardThickness: 100,
    standardWidths: [1800, 1900, 2000],
    icon: 'BedDouble',
  },
  {
    category: 'bed',
    type: 'bed-queen',
    bedType: 'queen',
    name: 'سرير كوين (160×200 سم)',
    nameEn: 'Queen Size Bed (160x200)',
    description: 'سرير كوين قياسي 160 سم مثالي لغرف النوم الرئيسية والمتوسطة',
    defaultWidth: 1700,
    defaultHeight: 1000,
    defaultDepth: 2150,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    mattressWidth: 1600,
    mattressLength: 2000,
    headboardHeight: 1000,
    headboardThickness: 80,
    standardWidths: [1600, 1700],
    icon: 'BedDouble',
  },
  {
    category: 'bed',
    type: 'bed-single',
    bedType: 'single',
    name: 'سرير فردي مفرد (120×200 سم)',
    nameEn: 'Single Bed (120x200)',
    description: 'سرير فردي مريح لغرف الشباب والأطفال مع ظهر خشب مودرن',
    defaultWidth: 1280,
    defaultHeight: 950,
    defaultDepth: 2100,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    mattressWidth: 1200,
    mattressLength: 2000,
    headboardHeight: 950,
    headboardThickness: 60,
    standardWidths: [1000, 1200, 1400],
    icon: 'BedSingle',
  },
  {
    category: 'bed',
    type: 'bed-storage-hydraulic',
    bedType: 'storage-hydraulic',
    name: 'سرير سحارة باستم هيدروليك للتخزين',
    nameEn: 'Hydraulic Storage Lift Bed',
    description: 'سرير مزود بآلية رفع باستم هيدروليك قوية لتخزين المفارش والبطاطين تحته',
    defaultWidth: 1700,
    defaultHeight: 1050,
    defaultDepth: 2150,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    mattressWidth: 1600,
    mattressLength: 2000,
    headboardHeight: 1050,
    headboardThickness: 80,
    hasHydraulicStorage: true,
    standardWidths: [1600, 1800],
    icon: 'Layers',
  },

  // --- كومودينو / طاولات جانبية (NIGHTSTANDS) ---
  {
    category: 'nightstand',
    type: 'bedroom-nightstand',
    name: 'كومودينو درجين جانبي للسرير',
    nameEn: '2-Drawer Nightstand',
    description: 'كومودينو بجانب السرير بدرجين سوفت كلوز ومكان لأباجورة الإضاءة',
    defaultWidth: 500,
    defaultHeight: 500,
    defaultDepth: 450,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 2,
    shelfCount: 0,
    standardWidths: [450, 500, 550, 600],
    icon: 'Square',
  },

  // --- تسريحة ودريسير مع مرآة (DRESSER & VANITY) ---
  {
    category: 'dresser',
    type: 'bedroom-dresser-mirror',
    name: 'تسريحة دريسير 6 أدراج مع مرآة بإضاءة LED',
    nameEn: '6-Drawer Dresser with Vanity Mirror',
    description: 'تسريحة عريضة بـ 6 أدراج واسعة للمكياج والمقتنيات مع مرآة رأسية أنيقة',
    defaultWidth: 1400,
    defaultHeight: 850,
    defaultDepth: 500,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 6,
    shelfCount: 0,
    hasMirror: true,
    mirrorHeight: 900,
    standardWidths: [1200, 1400, 1600],
    icon: 'Sparkles',
  },

  // --- وحدة تلفزيون غرفة النوم (BEDROOM TV CREDENZA) ---
  {
    category: 'tv-unit',
    type: 'bedroom-tv-credenza',
    name: 'وحدة تلفزيون وكونسول مودرن معلقة',
    nameEn: 'Floating Bedroom TV Console',
    description: 'وحدة تلفزيون جدارية معلقة بأبواب قلاب ومسار تمرير كابلات خفي',
    defaultWidth: 1600,
    defaultHeight: 400,
    defaultDepth: 350,
    defaultZ: 400,
    doorCount: 2,
    drawerCount: 1,
    shelfCount: 1,
    standardWidths: [1400, 1600, 1800, 2000],
    icon: 'Tv',
  },

  // --- بانكيت / بنش نهاية السرير (BENCH & OTTOMAN) ---
  {
    category: 'bench',
    type: 'bedroom-bench-ottoman',
    name: 'بانكيت مبطن نهاية السرير مع صندوق تخزين',
    nameEn: 'Bed End Storage Bench / Ottoman',
    description: 'مقعد جلوس مبطن يوضع أمام السرير مع سحارة تخزين داخلية',
    defaultWidth: 1400,
    defaultHeight: 450,
    defaultDepth: 450,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    standardWidths: [1200, 1400, 1600],
    icon: 'Minus',
  },
];
