import { LibraryCategory, CabinetType } from '../types';

export interface LibraryTemplate {
  category: LibraryCategory;
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
  tvWidth?: number;
  tvHeight?: number;
  tvDepth?: number;
  verticalDividersCount?: number;
  hasGlassDoors?: boolean;
  hasIntegratedLed?: boolean;
}

export const LIBRARY_LIBRARY: LibraryTemplate[] = [
  // --- مكتبات حائطية كاملة (FULL WALL LIBRARIES) ---
  {
    category: 'library-full',
    type: 'library-full-wall',
    name: 'مكتبة جدارية كاملة مع قواطع رأسية (سقف إلى أرض)',
    nameEn: 'Full Height Wall Library System',
    description: 'مكتبة كتب متكاملة بكامل ارتفاع الجدار مع 4 قواطع رأسية و 16 خانة للكتب والتحف',
    defaultWidth: 2400,
    defaultHeight: 2600,
    defaultDepth: 350,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 16,
    verticalDividersCount: 3,
    standardWidths: [1800, 2400, 3000, 3600],
    icon: 'BookOpen',
  },

  // --- مكتبات شاشة وتلفزيون (TV MEDIA WALL UNITS) ---
  {
    category: 'tv-media',
    type: 'library-tv-center',
    name: 'مكتبة تلفزيون مودرن مع تجويف شاشة 65 بوصة وأرفف',
    nameEn: 'Modern TV Wall Library Unit (65" TV Slot)',
    description: 'وحدة جدارية متكاملة تضم مكان شاشة التلفزيون، ساوند بار، كبائن سفلية مغلقة، وأرفف كتب',
    defaultWidth: 2800,
    defaultHeight: 2400,
    defaultDepth: 400,
    defaultZ: 0,
    doorCount: 4,
    drawerCount: 2,
    shelfCount: 8,
    hasTvCavity: true,
    tvWidth: 1500,
    tvHeight: 900,
    tvDepth: 300,
    verticalDividersCount: 2,
    hasIntegratedLed: true,
    standardWidths: [2400, 2800, 3200, 3600],
    icon: 'Tv',
  },

  // --- دواليب كتب وأرفف (BOOKSHELVES) ---
  {
    category: 'bookshelf',
    type: 'library-bookshelf-open',
    name: 'مكتبة كتب مفتوحة عمودية (5 رفوف)',
    nameEn: 'Open Vertical Bookshelf',
    description: 'مكتبة كتب قائمة عمودية بعرض 90 سم مع 5 رفوف قابلة لتعديل الارتفاع',
    defaultWidth: 900,
    defaultHeight: 2100,
    defaultDepth: 320,
    defaultZ: 0,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 5,
    standardWidths: [600, 800, 900, 1000],
    icon: 'Columns2',
  },
  {
    category: 'bookshelf',
    type: 'library-bookshelf-doors',
    name: 'مكتبة كتب مختلطة (كبائن سفلية + أرفف مفتوحة)',
    nameEn: 'Bookshelf with Lower Storage Doors',
    description: 'مكتبة تجمع بين التخزين المغلق السفلي بالدواليب وعرض الكتب بالرفوف العلوية',
    defaultWidth: 1000,
    defaultHeight: 2200,
    defaultDepth: 400,
    defaultZ: 0,
    doorCount: 2,
    drawerCount: 0,
    shelfCount: 4,
    standardWidths: [800, 1000, 1200],
    icon: 'Rows3',
  },

  // --- فيترينات ودواليب عرض زجاج (DISPLAY UNITS) ---
  {
    category: 'display',
    type: 'library-display-glass',
    name: 'فيترينة عرض تحف بضلف زجاج وفريم ألومنيوم',
    nameEn: 'Glass Display Cabinet / Curio',
    description: 'دولاب عرض فاخر بأبواب زجاجية شفافة مع إضاءة سبوت LED ومفصلات خفية',
    defaultWidth: 900,
    defaultHeight: 2200,
    defaultDepth: 380,
    defaultZ: 0,
    doorCount: 2,
    drawerCount: 0,
    shelfCount: 4,
    hasGlassDoors: true,
    hasIntegratedLed: true,
    standardWidths: [600, 800, 900, 1000],
    icon: 'AppWindow',
  },

  // --- أرفف طائرة جدارية (FLOATING SHELVES) ---
  {
    category: 'floating',
    type: 'library-floating-shelves',
    name: 'طقم أرفف جدارية طائرة خفية التثبيت (3 أرفف)',
    nameEn: 'Set of 3 Heavy Duty Floating Shelves',
    description: 'أرفف خشبية سميكة 36 مم بتثبيت خفي حديدي داخل الجدار بدون كوابيل ظاهرة',
    defaultWidth: 1200,
    defaultHeight: 36,
    defaultDepth: 250,
    defaultZ: 1200,
    doorCount: 0,
    drawerCount: 0,
    shelfCount: 1,
    standardWidths: [800, 1000, 1200, 1500],
    icon: 'Minus',
  },
];
