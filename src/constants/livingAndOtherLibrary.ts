import { FurnitureCategory, CabinetType } from '../types';

export interface LivingTemplate {
  category: FurnitureCategory;
  type: CabinetType;
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
  hasTvCavity?: boolean;
  hasIntegratedLed?: boolean;
  tag?: string;
}

export const LIVING_AND_OTHER_LIBRARY: LivingTemplate[] = [
  // =========================================================================
  // 1. غرف المعيشة والصالون (LIVING ROOM & SEATING)
  // =========================================================================
  {
    category: 'sofa',
    type: 'living-sofa-3seat',
    name: 'كنبة مودرن 3 مقاعد فخمة (Modern 3-Seater Sofa)',
    nameEn: 'Modern 3-Seater Minimalist Sofa',
    description: 'كنبة صالون بتصميم عصري ناعم مع وسائد مريحة وأرجل معدنية نحاسية أو سوداء',
    defaultWidth: 2200,
    defaultHeight: 800,
    defaultDepth: 950,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    standardWidths: [1800, 2000, 2200, 2400],
    icon: 'Armchair',
    tag: 'كنب معيشة',
  },
  {
    category: 'sofa',
    type: 'living-sofa-l-shape',
    name: 'كنبة ركنة مودرن حرف L واسعة (L-Shaped Sectional Sofa)',
    nameEn: 'L-Shaped Sectional Lounge Sofa',
    description: 'كنبة ركنة مريحة للاسترخاء ومشاهدة التلفزيون مع شيزلونج جانبي ممتد',
    defaultWidth: 2800,
    defaultHeight: 800,
    defaultDepth: 1700,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    standardWidths: [2600, 2800, 3200],
    icon: 'Armchair',
    tag: 'كنب ركنة L',
  },
  {
    category: 'coffee-table',
    type: 'living-coffee-table',
    name: 'طاولة قهوة صالون رخام كوارتز كلكتا مزدوجة',
    nameEn: 'Calacatta Marble Dual Coffee Table Set',
    description: 'طاولة وسط صالون بسطح رخامي فاخر وفريم معدني نحاسي أو أسود معاصر',
    defaultWidth: 1200,
    defaultHeight: 450,
    defaultDepth: 650,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 1,
    standardWidths: [1000, 1200, 1400],
    icon: 'Table',
    tag: 'طاولة وسط',
  },
  {
    category: 'tv-wall',
    type: 'living-tv-slat-wall',
    name: 'جدار شاشة متكامل مع بانوهات خشب وسيعة ووحدة كونسول معلقة',
    nameEn: 'Slat Wall Acoustic TV Panel & Floating Credenza',
    description: 'بانوهات خشبية رأسية كاملة الارتفاع مع إنارة ليد جانبية ووحدة أدراج معلقة',
    defaultWidth: 2600,
    defaultHeight: 2600,
    defaultDepth: 400,
    defaultZ: 0,
    doorCount: 2,
    drawerCount: 2,
    shelfCount: 2,
    standardWidths: [2000, 2400, 2600, 3000],
    icon: 'Tv',
    hasTvCavity: true,
    hasIntegratedLed: true,
    tag: 'جدار شاشة TV',
  },
  {
    category: 'credenza',
    type: 'living-credenza-buffet',
    name: 'بوفيه / كونسول صالون مودرن 4 أبواب مع رخام علوي',
    nameEn: 'Modern 4-Door Sideboard Buffet Credenza',
    description: 'وحدة تخزين صالون أنيقة بضلف خشب مضلعة وسطح رخام وإضاءة داخلية',
    defaultWidth: 1800,
    defaultHeight: 850,
    defaultDepth: 450,
    defaultZ: 0,
    doorCount: 4,
    drawerCount: 0,
    shelfCount: 2,
    standardWidths: [1500, 1800, 2000],
    icon: 'Layers',
    tag: 'بوفيه كونسول',
  },

  // =========================================================================
  // 2. طاولات الطعام (DINING)
  // =========================================================================
  {
    category: 'dining-table',
    type: 'dining-table-6seat',
    name: 'طاولة سفرة وطعام 6 مقاعد خشب أرو ورخام',
    nameEn: '6-Seater Luxury Dining Table',
    description: 'طاولة طعام بتصميم هندسي فخم مناسبة للغرف المفتوحة والتجمعات العائلية',
    defaultWidth: 2000,
    defaultHeight: 760,
    defaultDepth: 950,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    standardWidths: [1600, 1800, 2000, 2400],
    icon: 'Table',
    tag: 'طاولة طعام',
  },

  // =========================================================================
  // 3. المكاتب المنزلية والتجارية (HOME OFFICE)
  // =========================================================================
  {
    category: 'office-desk',
    type: 'office-executive-desk',
    name: 'مكتب تنفيذي مودرن مع وحدة أدراج جانبية متكاملة',
    nameEn: 'Executive Modern Desk with Credenza Unit',
    description: 'مكتب عمل منزلي فخم بسطح خشب جوز أمريكي أو أرو مع مخرج أسلاك وأدراج مخفية',
    defaultWidth: 1800,
    defaultHeight: 760,
    defaultDepth: 800,
    defaultZ: 0,
    doorCount: 1,
    drawerCount: 3,
    shelfCount: 1,
    standardWidths: [1400, 1600, 1800, 2000],
    icon: 'Laptop',
    tag: 'مكتب عمل',
  },

  // =========================================================================
  // 4. وحدات الحمام والديكور (BATHROOM & ACCENTS)
  // =========================================================================
  {
    category: 'vanity-basin',
    type: 'bathroom-vanity-double',
    name: 'وحدة حمام معلقة حوض مزدوج مع درجين كبار وسطح رخام',
    nameEn: 'Double Sink Floating Vanity Unit',
    description: 'وحدة حمام ماستر مقاومة للرطوبة والمياه مع أدراج ناعمة الإغلاق وساقط حوضين',
    defaultWidth: 1500,
    defaultHeight: 550,
    defaultDepth: 520,
    defaultZ: 350,
    doorCount: 0,
    drawerCount: 4,
    shelfCount: 0,
    standardWidths: [1200, 1400, 1500, 1800],
    icon: 'Square',
    tag: 'وحدة حمام',
  },
  {
    category: 'accent',
    type: 'accent-indoor-plant',
    name: 'نبتة زينة داخلية استوائية في أصيص فخاري عصري (Monstera)',
    nameEn: 'Potted Tropical Monstera Plant',
    description: 'عنصر ديكوري حيوي لإضفاء طابع واقعي وأنيق على رندرات الغرف وزوايا الصالون',
    defaultWidth: 500,
    defaultHeight: 1400,
    defaultDepth: 500,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 0,
    standardWidths: [400, 500, 600],
    icon: 'Sparkles',
    tag: 'نباتات زينة',
  },
];
