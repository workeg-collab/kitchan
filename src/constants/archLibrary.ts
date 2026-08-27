import { ArchitecturalElementType } from '../types';

export interface ArchitecturalTemplate {
  type: ArchitecturalElementType;
  name: string;
  nameAr: string;
  category: 'doors' | 'windows' | 'structural';
  description: string;
  descriptionAr: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  defaultZ: number; // Elevation from floor
  icon: string;
  openingDirection?: 'inward-left' | 'inward-right' | 'outward-left' | 'outward-right' | 'sliding';
}

export const ARCHITECTURAL_LIBRARY: ArchitecturalTemplate[] = [
  // --- DOORS ---
  {
    type: 'door',
    name: 'Standard Single Door',
    nameAr: 'باب داخلي مفرد',
    category: 'doors',
    description: 'Standard 90cm interior door with 90° opening swing arc',
    descriptionAr: 'باب داخلي قياسي 90 سم مع قوس فتح بزاوية 90 درجة',
    defaultWidth: 900,
    defaultHeight: 2100,
    defaultDepth: 150,
    defaultZ: 0,
    icon: 'DoorClosed',
    openingDirection: 'inward-left',
  },
  {
    type: 'door',
    name: 'Double French Glass Doors',
    nameAr: 'باب فرنسي زجاجي مزدوج',
    category: 'doors',
    description: '150cm dual swing French patio doors with glass panels',
    descriptionAr: 'باب مزدوج بعرض 150 سم مع ألواح زجاجية وإطارات خشبية',
    defaultWidth: 1500,
    defaultHeight: 2100,
    defaultDepth: 150,
    defaultZ: 0,
    icon: 'Columns2',
    openingDirection: 'inward-left',
  },
  {
    type: 'door',
    name: 'Sliding Glass Patio Door',
    nameAr: 'باب سحاب زجاجي (بلكونة)',
    category: 'doors',
    description: '180cm 2-panel sliding glass terrace door',
    descriptionAr: 'باب سحاب ضلفتين زجاجية بإطار ألومنيوم بعرض 180 سم',
    defaultWidth: 1800,
    defaultHeight: 2100,
    defaultDepth: 150,
    defaultZ: 0,
    icon: 'PanelLeft',
    openingDirection: 'sliding',
  },
  {
    type: 'door',
    name: 'Pocket Sliding Door',
    nameAr: 'باب جرار داخل الجدار (Pocket)',
    category: 'doors',
    description: 'Space-saving sliding door recessed inside wall cavity',
    descriptionAr: 'باب جرار مدمج داخل تجويف الجدار لتوفير المساحة',
    defaultWidth: 800,
    defaultHeight: 2100,
    defaultDepth: 150,
    defaultZ: 0,
    icon: 'ArrowRightLeft',
    openingDirection: 'sliding',
  },

  // --- WINDOWS ---
  {
    type: 'window',
    name: 'Single Casement Window',
    nameAr: 'نافذة مفردة قياسية',
    category: 'windows',
    description: '90cm width window with 95cm sill height above floor',
    descriptionAr: 'نافذة مفردة بعرض 90 سم وارتفاع جلسة 95 سم عن الأرض',
    defaultWidth: 900,
    defaultHeight: 1100,
    defaultDepth: 150,
    defaultZ: 950,
    icon: 'AppWindow',
  },
  {
    type: 'window',
    name: 'Double Casement Window',
    nameAr: 'نافذة مزدوجة',
    category: 'windows',
    description: '120cm wide double window with center mullion',
    descriptionAr: 'نافذة مزدوجة بعرض 120 سم مع قاطع أوسط وإطار خردوات',
    defaultWidth: 1200,
    defaultHeight: 1100,
    defaultDepth: 150,
    defaultZ: 950,
    icon: 'Grid',
  },
  {
    type: 'window',
    name: 'Wide Kitchen Sink Window',
    nameAr: 'نافذة مطبخ عريضة فوق الحوض',
    category: 'windows',
    description: '180cm panoramic kitchen window with natural daylight',
    descriptionAr: 'نافذة عريضة بانورامية بعرض 180 سم مثالية فوق الحوض',
    defaultWidth: 1800,
    defaultHeight: 1100,
    defaultDepth: 150,
    defaultZ: 950,
    icon: 'Maximize2',
  },

  // --- STRUCTURAL & OBSTACLES ---
  {
    type: 'column',
    name: 'Structural Concrete Column',
    nameAr: 'عمود خرساني إنشائي',
    category: 'structural',
    description: '400x400mm load-bearing pillar with hatch cross',
    descriptionAr: 'عمود إنشائي حامل 40×40 سم يمتد لكامل ارتفاع السقف',
    defaultWidth: 400,
    defaultHeight: 2600,
    defaultDepth: 400,
    defaultZ: 0,
    icon: 'Box',
  },
  {
    type: 'beam',
    name: 'Ceiling Drop Beam / Soffit',
    nameAr: 'كمرة ساقطة / جسر بالسقف',
    category: 'structural',
    description: 'Overhead structural drop beam with clearance line',
    descriptionAr: 'كمرة ساقطة بالسقف لتحديد الارتفاع الصافي للكبائن العلوية',
    defaultWidth: 2000,
    defaultHeight: 300,
    defaultDepth: 300,
    defaultZ: 2300,
    icon: 'Minus',
  },
  {
    type: 'pipe',
    name: 'Plumbing / Gas Pipe Riser',
    nameAr: 'ماسورة سباكة / غاز رأسية',
    category: 'structural',
    description: '⌀160mm service pipe with mandatory safety setback',
    descriptionAr: 'ماسورة تمديدات رأسية بقطر 16 سم مع مسافة أمان',
    defaultWidth: 160,
    defaultHeight: 800,
    defaultDepth: 160,
    defaultZ: 0,
    icon: 'CircleDot',
  },
];
