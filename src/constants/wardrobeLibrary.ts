import { WardrobeCategory, CabinetType, WardrobeDoorType } from '../types';

export interface WardrobeTemplate {
  category: WardrobeCategory;
  type: CabinetType;
  name: string;
  nameEn: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  defaultZ: number;
  doorCount: number;
  doorType: WardrobeDoorType;
  drawerCount: number;
  shelfCount: number;
  standardWidths: number[];
  icon: string;
  hasHangingRail?: boolean;
  hangingRailCount?: number;
  hasShoeShelves?: boolean;
  hasJewelryDrawer?: boolean;
  hasTrouserRack?: boolean;
  hasLaundryBasket?: boolean;
  slidingTracksCount?: number;
}

export const WARDROBE_LIBRARY: WardrobeTemplate[] = [
  // --- دواليب مفصلية (HINGED WARDROBES) ---
  {
    category: 'wardrobe',
    type: 'wardrobe-hinged-2d',
    name: 'دولاب ملابس مفصلي ضلفتين (علاقة + رف)',
    nameEn: '2-Door Hinged Wardrobe',
    description: 'دولاب ملابس قياسي ببابين مفصليين مع ماسورة تعليق ملابس ورف علوي للحقائب',
    defaultWidth: 1000,
    defaultHeight: 2400,
    defaultDepth: 600,
    defaultZ: 0,
    doorCount: 2,
    doorType: 'hinged',
    drawerCount: 0,
    shelfCount: 2,
    hasHangingRail: true,
    hangingRailCount: 1,
    standardWidths: [800, 900, 1000, 1200],
    icon: 'Columns2',
  },
  {
    category: 'wardrobe',
    type: 'wardrobe-hinged-3d',
    name: 'دولاب ملابس 3 ضلف مع أدراج سفلية',
    nameEn: '3-Door Wardrobe with Drawers',
    description: 'دولاب ملابس كبير 3 أبواب يجمع بين تعليق الفساتين والبدل، 3 أدراج ورفوف تنظيم',
    defaultWidth: 1500,
    defaultHeight: 2400,
    defaultDepth: 600,
    defaultZ: 0,
    doorCount: 3,
    doorType: 'hinged',
    drawerCount: 3,
    shelfCount: 4,
    hasHangingRail: true,
    hangingRailCount: 2,
    standardWidths: [1350, 1500, 1600, 1800],
    icon: 'Rows3',
  },

  // --- دواليب سحاب / جرار (SLIDING WARDROBES) ---
  {
    category: 'wardrobe',
    type: 'wardrobe-sliding-2d',
    name: 'دولاب جرار ضلفتين سحاب (مجري مزدوج)',
    nameEn: '2-Door Sliding Wardrobe',
    description: 'دولاب جرار لتوفير المساحة بضلفتين سحاب مع مجاري هيدروليك مانع صدمات',
    defaultWidth: 1800,
    defaultHeight: 2400,
    defaultDepth: 650,
    defaultZ: 0,
    doorCount: 2,
    doorType: 'sliding',
    drawerCount: 2,
    shelfCount: 4,
    hasHangingRail: true,
    hangingRailCount: 2,
    slidingTracksCount: 2,
    standardWidths: [1600, 1800, 2000, 2200],
    icon: 'ArrowRightLeft',
  },
  {
    category: 'wardrobe',
    type: 'wardrobe-sliding-3d',
    name: 'دولاب جرار 3 ضلف كبير (سقف إلى أرض)',
    nameEn: '3-Door Sliding Wardrobe (Floor-to-Ceiling)',
    description: 'دولاب جرار 3 ضلف كامل الارتفاع مع مرآة وسطية وتقسيم ثلاثي داخلي متكامل',
    defaultWidth: 2400,
    defaultHeight: 2600,
    defaultDepth: 650,
    defaultZ: 0,
    doorCount: 3,
    doorType: 'sliding',
    drawerCount: 4,
    shelfCount: 6,
    hasHangingRail: true,
    hangingRailCount: 3,
    slidingTracksCount: 3,
    standardWidths: [2200, 2400, 2700, 3000],
    icon: 'Columns3',
  },

  // --- دريسنج روم مفتوح (WALK-IN & OPEN DRESSING) ---
  {
    category: 'wardrobe',
    type: 'wardrobe-walkin-open',
    name: 'وحدة دريسنج مفتوحة بدون أبواب',
    nameEn: 'Walk-in Open Dressing Unit',
    description: 'شاسيه دريسنج مودرن مفتوح مع رفوف علوية، علاقة ملابس، وإضاءة LED جانبية',
    defaultWidth: 900,
    defaultHeight: 2400,
    defaultDepth: 550,
    defaultZ: 0,
    doorCount: 0,
    doorType: 'open',
    drawerCount: 0,
    shelfCount: 3,
    hasHangingRail: true,
    hangingRailCount: 1,
    standardWidths: [600, 800, 900, 1000, 1200],
    icon: 'LayoutPanelTop',
  },
  {
    category: 'wardrobe',
    type: 'wardrobe-corner-l',
    name: 'وحدة دريسنج ركنة زاوية L (90°)',
    nameEn: 'L-Corner Dressing Unit',
    description: 'وحدة زاوية لاستغلال أركان الغرفة مع ماسورة تعليق منحنية ورفوف عميقة',
    defaultWidth: 1000,
    defaultHeight: 2400,
    defaultDepth: 1000,
    defaultZ: 0,
    doorCount: 0,
    doorType: 'open',
    drawerCount: 0,
    shelfCount: 4,
    hasHangingRail: true,
    hangingRailCount: 2,
    standardWidths: [950, 1000, 1100],
    icon: 'CornerDownRight',
  },

  // --- وحدات داخلية وتخزين تخصصي (INTERNAL ACCESSORIES) ---
  {
    category: 'closet-internals',
    type: 'wardrobe-hanging-double',
    name: 'وحدة تعليق مزدوج (قمصان وجواكت)',
    nameEn: 'Double Hanging Rail Unit',
    description: 'مستويان لتعليق القمصان والبدل والجاكيتات لزيادة سعة التخزين للضعف',
    defaultWidth: 800,
    defaultHeight: 2400,
    defaultDepth: 550,
    defaultZ: 0,
    doorCount: 0,
    doorType: 'open',
    drawerCount: 0,
    shelfCount: 2,
    hasHangingRail: true,
    hangingRailCount: 2,
    standardWidths: [600, 800, 900, 1000],
    icon: 'Maximize2',
  },
  {
    category: 'closet-internals',
    type: 'wardrobe-shelves-drawers',
    name: 'برج أدراج ومطبق ملابس (4 أدراج)',
    nameEn: 'Tower with 4 Drawers & Shelves',
    description: 'برج تنظيمي مزود بـ 4 أدراج باستم هيدروليك مع 3 رفوف للملابس المطوية',
    defaultWidth: 600,
    defaultHeight: 2400,
    defaultDepth: 550,
    defaultZ: 0,
    doorCount: 0,
    doorType: 'open',
    drawerCount: 4,
    shelfCount: 4,
    hasHangingRail: false,
    standardWidths: [450, 500, 600, 800],
    icon: 'Rows4',
  },
  {
    category: 'accessories',
    type: 'wardrobe-shoe-rack',
    name: 'وحدة أرفف أحذية مائلة مخصصة',
    nameEn: 'Slanted Shoe Shelves Unit',
    description: 'أرفف أحذية مائلة مع حافة ألومنيوم مانعة للانزلاق تسع حتى 24 حذاء',
    defaultWidth: 800,
    defaultHeight: 2400,
    defaultDepth: 400,
    defaultZ: 0,
    doorCount: 0,
    doorType: 'open',
    drawerCount: 0,
    shelfCount: 8,
    hasShoeShelves: true,
    standardWidths: [600, 800, 900],
    icon: 'Grid',
  },
  {
    category: 'accessories',
    type: 'wardrobe-jewelry-vanity',
    name: 'جزيرة دريسنج مع درج إكسسوارات وساعات',
    nameEn: 'Dressing Island / Jewelry Vanity',
    description: 'جزيرة وسطية أو درج مقسم مخملي للساعات والمجوهرات والنظارات مع وش زجاجي',
    defaultWidth: 1000,
    defaultHeight: 900,
    defaultDepth: 600,
    defaultZ: 0,
    doorCount: 0,
    doorType: 'open',
    drawerCount: 4,
    shelfCount: 0,
    hasJewelryDrawer: true,
    standardWidths: [800, 1000, 1200, 1400],
    icon: 'Sparkles',
  },
];
