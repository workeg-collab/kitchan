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
  { id: 'matte-white', name: 'أبيض ألباين ناصع مطفي', nameEn: 'Matte Alpine Pure White', category: 'front', color: '#f8fafc', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-cashmere', name: 'كشمير بيج دافئ (Warm Cashmere)', nameEn: 'Cashmere Warm Beige', category: 'front', color: '#d6cec4', roughness: 0.85, metalness: 0.02, textureType: 'matte' },
  { id: 'matte-greige', name: 'رمادي جريج عصري (Modern Greige)', nameEn: 'Modern Warm Greige', category: 'front', color: '#b5aca1', roughness: 0.82, metalness: 0.02, textureType: 'matte' },
  { id: 'matte-anthracite', name: 'رمادي فحمي شاركول (Anthracite)', nameEn: 'Matte Anthracite', category: 'front', color: '#27272a', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-sage', name: 'أخضر سيج نورديك هادئ (Nordic Sage)', nameEn: 'Nordic Sage Green', category: 'front', color: '#65786a', roughness: 0.85, metalness: 0.02, textureType: 'matte' },
  { id: 'matte-forest-green', name: 'أخضر زمردي ملكي (Forest Emerald)', nameEn: 'Deep Forest Green', category: 'front', color: '#1b4332', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-navy', name: 'أزرق كحلي ملكي (Midnight Navy)', nameEn: 'Midnight Navy Blue', category: 'front', color: '#1e293b', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-terracotta', name: 'تيراكوتا طيني دافئ (Terracotta)', nameEn: 'Warm Terracotta Clay', category: 'front', color: '#a0522d', roughness: 0.85, metalness: 0.02, textureType: 'matte' },
  { id: 'gloss-white', name: 'أبيض هاي جلوس لامع بيور (UV Lacquer)', nameEn: 'High Gloss Pure White', category: 'front', color: '#ffffff', roughness: 0.12, metalness: 0.2, textureType: 'gloss' },
  { id: 'gloss-black', name: 'أسود بيانو فخم لامع عاكس', nameEn: 'High Gloss Piano Black', category: 'front', color: '#09090b', roughness: 0.12, metalness: 0.3, textureType: 'gloss' },
  { id: 'gloss-taupe', name: 'توب رمادي لامع عصري', nameEn: 'High Gloss Modern Taupe', category: 'front', color: '#8d8070', roughness: 0.15, metalness: 0.2, textureType: 'gloss' },
  { id: 'wood-natural-oak', name: 'خشب قشرة أرو طبيعي هادئ (Natural Oak)', nameEn: 'Natural Oak Wood', category: 'front', color: '#bfa076', roughness: 0.7, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-smoked-walnut', name: 'خشب جوز أمريكي مدخن فاخر (Smoked Walnut)', nameEn: 'Smoked American Walnut', category: 'front', color: '#594433', roughness: 0.75, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-black-ash', name: 'خشب آش أسود معتق فاخر (Black Ash)', nameEn: 'Black Stained Ash Wood', category: 'front', color: '#262423', roughness: 0.8, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-warm-teak', name: 'خشب تيك طبيعي استوائي (Warm Teak)', nameEn: 'Warm Honey Teak Wood', category: 'front', color: '#a2622d', roughness: 0.72, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-bleached-birch', name: 'خشب بتولا إسكندنافي مبيض (Bleached Birch)', nameEn: 'Nordic Bleached Birch', category: 'front', color: '#d8cbb8', roughness: 0.7, metalness: 0.05, textureType: 'wood' },
];

export const CARCASS_FINISHES: MaterialOption[] = [
  { id: 'carcass-white', name: 'ميلامين أبيض سوبر ناصع 18 مم', nameEn: 'Standard White Melamine', category: 'carcass', color: '#f1f5f9', roughness: 0.6, metalness: 0.0 },
  { id: 'carcass-grey', name: 'ميلامين رمادي فاتح 18 مم', nameEn: 'Light Grey Melamine', category: 'carcass', color: '#cbd5e1', roughness: 0.6, metalness: 0.0 },
  { id: 'carcass-anthracite', name: 'ميلامين نسيج قماش أنثراسيت فاخر', nameEn: 'Anthracite Woven Texture', category: 'carcass', color: '#334155', roughness: 0.7, metalness: 0.0 },
  { id: 'carcass-oak', name: 'ميلامين تجزيعة خشب أرو طبيعي', nameEn: 'Natural Oak Melamine', category: 'carcass', color: '#bfa076', roughness: 0.7, metalness: 0.0 },
  { id: 'carcass-walnut', name: 'ميلامين جوز أمريكي غامق', nameEn: 'Dark Walnut Melamine', category: 'carcass', color: '#594433', roughness: 0.7, metalness: 0.0 },
];

export const COUNTERTOP_MATERIALS: MaterialOption[] = [
  { id: 'quartz-calacatta', name: 'كوارتز كلكتا جولد إيطالي بعروق ذهبية', nameEn: 'Calacatta Gold Italian Quartz', category: 'countertop', color: '#f8fafc', roughness: 0.22, metalness: 0.12, textureType: 'marble' },
  { id: 'marble-carrara', name: 'رخام كرارة تركي أبيض بعروق رمادية', nameEn: 'White Carrara Classic Marble', category: 'countertop', color: '#e2e8f0', roughness: 0.28, metalness: 0.1, textureType: 'marble' },
  { id: 'granite-nero', name: 'جرانيت نيرو ماركينا أسود ملكي', nameEn: 'Nero Marquina Black Granite', category: 'countertop', color: '#18181b', roughness: 0.25, metalness: 0.15, textureType: 'granite' },
  { id: 'marble-emperador', name: 'رخام إمبرادور بني إسباني دافئ', nameEn: 'Emperador Dark Spanish Marble', category: 'countertop', color: '#4a3728', roughness: 0.3, metalness: 0.1, textureType: 'marble' },
  { id: 'terrazzo-venice', name: 'تيرازو فينيسيا إيطالي مرقط عصري', nameEn: 'Venetian Multi Terrazzo', category: 'countertop', color: '#e5e2dc', roughness: 0.4, metalness: 0.08, textureType: 'marble' },
  { id: 'concrete-grey', name: 'كونكريت رمادي مصقول إندستريال', nameEn: 'Polished Industrial Concrete', category: 'countertop', color: '#71717a', roughness: 0.58, metalness: 0.05, textureType: 'concrete' },
  { id: 'wood-butcherblock', name: 'خشب بلوط ماسيف معالج بالزيوت الطبيعية', nameEn: 'Solid Oiled Oak Block', category: 'countertop', color: '#a67c52', roughness: 0.55, metalness: 0.0, textureType: 'wood' },
  { id: 'steel-brushed', name: 'ستانلس ستيل مطفي مصقول ضد البصمات', nameEn: 'Brushed Anti-fingerprint Stainless Steel', category: 'countertop', color: '#94a3b8', roughness: 0.32, metalness: 0.88, textureType: 'metal' },
];

export const FLOOR_MATERIALS: MaterialOption[] = [
  { id: 'floor-wood-oak', name: 'باركيه خشب أرو شيفرون (Chevron Oak)', nameEn: 'Oak Chevron Parquet', category: 'floor', color: '#8c6843', roughness: 0.58, metalness: 0.05, textureType: 'wood' },
  { id: 'floor-wood-walnut', name: 'باركيه خشب جوز أمريكي عريض', nameEn: 'Smoked Walnut Wide Plank', category: 'floor', color: '#4e3825', roughness: 0.6, metalness: 0.05, textureType: 'wood' },
  { id: 'floor-tiles-grey', name: 'بورسلين رمادي حجر طبيعي مات (60×120)', nameEn: 'Grey Slate Natural Stone Tile', category: 'floor', color: '#475569', roughness: 0.5, metalness: 0.05, textureType: 'tiles' },
  { id: 'floor-marble-white', name: 'رخام أبيض كلكتا مصقول إسباني فخم', nameEn: 'Polished Calacatta White Marble', category: 'floor', color: '#f1f5f9', roughness: 0.18, metalness: 0.18, textureType: 'marble' },
  { id: 'floor-microcement', name: 'ميكروسيمنت بيج ناعم سلس بدون فواصل', nameEn: 'Seamless Warm Greige Microcement', category: 'floor', color: '#d1c7b7', roughness: 0.5, metalness: 0.02, textureType: 'concrete' },
];

export const WALL_COLORS: MaterialOption[] = [
  { id: 'wall-pure-white', name: 'دهان أوف وايت حريري ناصع', nameEn: 'Silk Off-White Paint', category: 'wall', color: '#f8fafc', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-warm-greige', name: 'جريج دافئ حريري ناعم (Greige)', nameEn: 'Warm Silk Greige', category: 'wall', color: '#e5e0d8', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-cool-grey', name: 'رمادي حجري ناعم (Pale Slate)', nameEn: 'Pale Slate Grey', category: 'wall', color: '#d1d5db', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-slat-wood', name: 'تجليد بانوهات خشبية رأسية (Wood Slats)', nameEn: 'Vertical Wood Slat Paneling', category: 'wall', color: '#9b714b', roughness: 0.65, metalness: 0.05, textureType: 'wood' },
  { id: 'wall-charcoal-accent', name: 'جدار ديكوري رمادي غامق فحم', nameEn: 'Charcoal Accent Wall', category: 'wall', color: '#1e293b', roughness: 0.88, metalness: 0.0 },
];

export const HANDLE_OPTIONS = [
  { id: 'bar-black', name: 'مقبض مسطرة أسود مطفي فاخر', color: '#09090b' },
  { id: 'bar-brass', name: 'مقبض مسطرة نحاسي مصقول مطفي (Brushed Gold)', color: '#d97706' },
  { id: 'bar-chrome', name: 'مقبض كروم فضي لامع كلاسيك', color: '#e2e8f0' },
  { id: 'edge-pull', name: 'مقبض إيدج حرف L مدمج أعلى الضلفة', color: '#475569' },
  { id: 'knob', name: 'مقبض زرار دائري مودرن مينيمال', color: '#0f172a' },
  { id: 'handleless', name: 'بدون مقبض (بروفايل جولا Gola Profile)', color: '#94a3b8' },
];

export const GLASS_OPTIONS = [
  { id: 'glass-clear', name: 'زجاج شفاف كريستالي فائق النقاء', color: '#ffffff', opacity: 0.3, transmission: 0.9 },
  { id: 'glass-smoked', name: 'زجاج رمادي فوميه مدخن فاخر', color: '#334155', opacity: 0.65, transmission: 0.5 },
  { id: 'glass-bronze', name: 'زجاج برونزي عسلي دافئ', color: '#78350f', opacity: 0.6, transmission: 0.55 },
  { id: 'glass-fluted', name: 'زجاج مضلع ريبد (Fluted / Reeded)', color: '#e2e8f0', opacity: 0.7, transmission: 0.6 },
];

export const FABRIC_OPTIONS = [
  { id: 'fabric-boucle-cream', name: 'قماش بوكليه كريمي فاخر (Boucle)', color: '#f5f0eb', roughness: 0.95 },
  { id: 'fabric-velvet-emerald', name: 'قماش مخملي قطيفة أخضر زمردي', color: '#1b4332', roughness: 0.8 },
  { id: 'fabric-velvet-navy', name: 'قماش مخملي كحلي ملكي', color: '#1e293b', roughness: 0.8 },
  { id: 'fabric-linen-grey', name: 'كتان طبيعي رمادي ناعم', color: '#94a3b8', roughness: 0.9 },
  { id: 'fabric-leather-cognac', name: 'جلد طبيعي بني كونياك كلاسيك', color: '#78350f', roughness: 0.45 },
];
