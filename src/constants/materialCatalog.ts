export interface MaterialOption {
  id: string;
  name: string;
  nameEn: string;
  category: 'front' | 'carcass' | 'countertop' | 'wall' | 'floor' | 'handle';
  color: string;
  roughness: number;
  metalness: number;
  textureType?: 'matte' | 'gloss' | 'wood' | 'marble' | 'granite' | 'concrete' | 'tiles' | 'metal';
}

export const FRONT_FINISHES: MaterialOption[] = [
  { id: 'matte-white', name: 'أبيض ألباين مطفي', nameEn: 'Matte Alpine White', category: 'front', color: '#f8fafc', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-anthracite', name: 'رمادي فحمي شاركول', nameEn: 'Matte Anthracite', category: 'front', color: '#27272a', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-sage', name: 'أخضر سيج نورديك هادئ', nameEn: 'Nordic Sage Green', category: 'front', color: '#65786a', roughness: 0.85, metalness: 0.02, textureType: 'matte' },
  { id: 'matte-navy', name: 'أزرق كحلي ملكي (Navy)', nameEn: 'Midnight Navy Blue', category: 'front', color: '#1e293b', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-cashmere', name: 'كشمير بيج دافئ', nameEn: 'Cashmere Warm Beige', category: 'front', color: '#d6cec4', roughness: 0.85, metalness: 0.02, textureType: 'matte' },
  { id: 'gloss-white', name: 'أبيض هاي جلوس لامع (UV)', nameEn: 'High Gloss Pure White', category: 'front', color: '#ffffff', roughness: 0.15, metalness: 0.2, textureType: 'gloss' },
  { id: 'gloss-black', name: 'أسود بيانو فخم لامع', nameEn: 'High Gloss Piano Black', category: 'front', color: '#09090b', roughness: 0.15, metalness: 0.3, textureType: 'gloss' },
  { id: 'wood-natural-oak', name: 'خشب قشرة أرو طبيعي (Oak)', nameEn: 'Natural Oak Wood', category: 'front', color: '#bfa076', roughness: 0.7, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-smoked-walnut', name: 'خشب جوز أمريكي مدخن (Walnut)', nameEn: 'Smoked Walnut', category: 'front', color: '#594433', roughness: 0.75, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-black-ash', name: 'خشب آش أسود معتق', nameEn: 'Black Stained Ash', category: 'front', color: '#262423', roughness: 0.8, metalness: 0.05, textureType: 'wood' },
];

export const CARCASS_FINISHES: MaterialOption[] = [
  { id: 'carcass-white', name: 'ميلامين أبيض 18 مم', nameEn: 'Standard White Melamine', category: 'carcass', color: '#f1f5f9', roughness: 0.6, metalness: 0.0 },
  { id: 'carcass-grey', name: 'ميلامين رمادي فاتح 18 مم', nameEn: 'Light Grey Melamine', category: 'carcass', color: '#cbd5e1', roughness: 0.6, metalness: 0.0 },
  { id: 'carcass-anthracite', name: 'ميلامين قماش أنثراسيت', nameEn: 'Anthracite Linen', category: 'carcass', color: '#334155', roughness: 0.7, metalness: 0.0 },
  { id: 'carcass-oak', name: 'ميلامين تجزيعة خشب أرو', nameEn: 'Natural Oak Melamine', category: 'carcass', color: '#bfa076', roughness: 0.7, metalness: 0.0 },
];

export const COUNTERTOP_MATERIALS: MaterialOption[] = [
  { id: 'quartz-calacatta', name: 'كوارتز كلكتا جولد إيطالي', nameEn: 'Calacatta Gold Quartz', category: 'countertop', color: '#f8fafc', roughness: 0.25, metalness: 0.1, textureType: 'marble' },
  { id: 'marble-carrara', name: 'رخام كرارة تركي فاخر', nameEn: 'White Carrara Marble', category: 'countertop', color: '#e2e8f0', roughness: 0.3, metalness: 0.1, textureType: 'marble' },
  { id: 'granite-nero', name: 'جرانيت نيرو ماركينا أسود', nameEn: 'Nero Marquina Granite', category: 'countertop', color: '#18181b', roughness: 0.3, metalness: 0.15, textureType: 'granite' },
  { id: 'concrete-grey', name: 'كونكريت رمادي مصقول', nameEn: 'Polished Industrial Concrete', category: 'countertop', color: '#71717a', roughness: 0.6, metalness: 0.05, textureType: 'concrete' },
  { id: 'wood-butcherblock', name: 'خشب بلوط ماسيف معالج', nameEn: 'Solid Oiled Oak Block', category: 'countertop', color: '#a67c52', roughness: 0.55, metalness: 0.0, textureType: 'wood' },
  { id: 'steel-brushed', name: 'ستانلس ستيل مطفي مصقول', nameEn: 'Brushed Stainless Steel', category: 'countertop', color: '#94a3b8', roughness: 0.35, metalness: 0.85, textureType: 'metal' },
];

export const FLOOR_MATERIALS: MaterialOption[] = [
  { id: 'floor-wood-oak', name: 'باركيه خشب أرو شيفرون', nameEn: 'Oak Chevron Parquet', category: 'floor', color: '#8c6843', roughness: 0.6, metalness: 0.05, textureType: 'wood' },
  { id: 'floor-tiles-grey', name: 'بورسلين رمادي حجر طبيعي', nameEn: 'Grey Stone Porcelain', category: 'floor', color: '#475569', roughness: 0.5, metalness: 0.05, textureType: 'tiles' },
  { id: 'floor-marble-white', name: 'رخام أبيض مصقول إسباني', nameEn: 'Polished White Marble', category: 'floor', color: '#f1f5f9', roughness: 0.2, metalness: 0.15, textureType: 'marble' },
];

export const WALL_COLORS: MaterialOption[] = [
  { id: 'wall-pure-white', name: 'دهان أوف وايت حريري', nameEn: 'Off-White Paint', category: 'wall', color: '#f8fafc', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-warm-greige', name: 'جريج دافئ (Greige)', nameEn: 'Warm Greige', category: 'wall', color: '#e5e0d8', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-cool-grey', name: 'رمادي حجري ناعم', nameEn: 'Pale Slate Grey', category: 'wall', color: '#d1d5db', roughness: 0.9, metalness: 0.0 },
];

export const HANDLE_OPTIONS = [
  { id: 'bar-black', name: 'مقبض مسطرة أسود مطفي', color: '#09090b' },
  { id: 'bar-brass', name: 'مقبض مسطرة نحاسي مصقول (Gold)', color: '#d97706' },
  { id: 'bar-chrome', name: 'مقبض كروم فضي لامع', color: '#e2e8f0' },
  { id: 'edge-pull', name: 'مقبض حرف L مدمج أعلى الضلفة', color: '#475569' },
  { id: 'knob', name: 'مقبض زرار دائري مودرن', color: '#0f172a' },
  { id: 'handleless', name: 'بدون مقبض (بروفايل جولا Gola Profile)', color: '#94a3b8' },
];
