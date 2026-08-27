export interface MaterialOption {
  id: string;
  name: string;
  category: 'front' | 'carcass' | 'countertop' | 'wall' | 'floor' | 'handle';
  color: string;
  roughness: number;
  metalness: number;
  textureType?: 'matte' | 'gloss' | 'wood' | 'marble' | 'granite' | 'concrete' | 'tiles' | 'metal';
  previewClass?: string;
}

export const FRONT_FINISHES: MaterialOption[] = [
  { id: 'matte-white', name: 'Matte Alpine White', category: 'front', color: '#f8fafc', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-anthracite', name: 'Matte Anthracite Charcoal', category: 'front', color: '#27272a', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-sage', name: 'Nordic Sage Green', category: 'front', color: '#65786a', roughness: 0.85, metalness: 0.02, textureType: 'matte' },
  { id: 'matte-navy', name: 'Midnight Navy Blue', category: 'front', color: '#1e293b', roughness: 0.8, metalness: 0.05, textureType: 'matte' },
  { id: 'matte-cashmere', name: 'Cashmere Warm Beige', category: 'front', color: '#d6cec4', roughness: 0.85, metalness: 0.02, textureType: 'matte' },
  { id: 'gloss-white', name: 'High Gloss Pure White', category: 'front', color: '#ffffff', roughness: 0.15, metalness: 0.2, textureType: 'gloss' },
  { id: 'gloss-black', name: 'High Gloss Piano Black', category: 'front', color: '#09090b', roughness: 0.15, metalness: 0.3, textureType: 'gloss' },
  { id: 'wood-natural-oak', name: 'Natural Scandinavian Oak', category: 'front', color: '#bfa076', roughness: 0.7, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-smoked-walnut', name: 'Smoked American Walnut', category: 'front', color: '#594433', roughness: 0.75, metalness: 0.05, textureType: 'wood' },
  { id: 'wood-black-ash', name: 'Black Stained Ash', category: 'front', color: '#262423', roughness: 0.8, metalness: 0.05, textureType: 'wood' },
];

export const CARCASS_FINISHES: MaterialOption[] = [
  { id: 'carcass-white', name: 'Standard White Melamine', category: 'carcass', color: '#f1f5f9', roughness: 0.6, metalness: 0.0 },
  { id: 'carcass-grey', name: 'Light Grey Melamine', category: 'carcass', color: '#cbd5e1', roughness: 0.6, metalness: 0.0 },
  { id: 'carcass-anthracite', name: 'Anthracite Linen', category: 'carcass', color: '#334155', roughness: 0.7, metalness: 0.0 },
  { id: 'carcass-oak', name: 'Natural Oak Melamine', category: 'carcass', color: '#bfa076', roughness: 0.7, metalness: 0.0 },
];

export const COUNTERTOP_MATERIALS: MaterialOption[] = [
  { id: 'quartz-calacatta', name: 'Calacatta Gold Quartz', category: 'countertop', color: '#f8fafc', roughness: 0.25, metalness: 0.1, textureType: 'marble' },
  { id: 'marble-carrara', name: 'White Carrara Marble', category: 'countertop', color: '#e2e8f0', roughness: 0.3, metalness: 0.1, textureType: 'marble' },
  { id: 'granite-nero', name: 'Nero Marquina Black Granite', category: 'countertop', color: '#18181b', roughness: 0.3, metalness: 0.15, textureType: 'granite' },
  { id: 'concrete-grey', name: 'Polished Industrial Concrete', category: 'countertop', color: '#71717a', roughness: 0.6, metalness: 0.05, textureType: 'concrete' },
  { id: 'wood-butcherblock', name: 'Solid Oiled Oak Block', category: 'countertop', color: '#a67c52', roughness: 0.55, metalness: 0.0, textureType: 'wood' },
  { id: 'steel-brushed', name: 'Brushed Stainless Steel', category: 'countertop', color: '#94a3b8', roughness: 0.35, metalness: 0.85, textureType: 'metal' },
];

export const FLOOR_MATERIALS: MaterialOption[] = [
  { id: 'floor-wood-oak', name: 'Oak Chevron Parquet', category: 'floor', color: '#8c6843', roughness: 0.6, metalness: 0.05, textureType: 'wood' },
  { id: 'floor-tiles-grey', name: 'Large Format Grey Stone', category: 'floor', color: '#475569', roughness: 0.5, metalness: 0.05, textureType: 'tiles' },
  { id: 'floor-concrete', name: 'Polished Loft Concrete', category: 'floor', color: '#64748b', roughness: 0.45, metalness: 0.1, textureType: 'concrete' },
  { id: 'floor-marble-white', name: 'Polished White Marble Tile', category: 'floor', color: '#f1f5f9', roughness: 0.2, metalness: 0.15, textureType: 'marble' },
];

export const WALL_COLORS: MaterialOption[] = [
  { id: 'wall-pure-white', name: 'Off-White Paint', category: 'wall', color: '#f8fafc', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-warm-greige', name: 'Warm Greige', category: 'wall', color: '#e5e0d8', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-cool-grey', name: 'Modern Pale Slate', category: 'wall', color: '#d1d5db', roughness: 0.9, metalness: 0.0 },
  { id: 'wall-dark-graphite', name: 'Dark Graphite Accent', category: 'wall', color: '#1e293b', roughness: 0.9, metalness: 0.0 },
];

export const HANDLE_OPTIONS = [
  { id: 'bar-black', name: 'Matte Black Bar Handle', color: '#09090b', icon: 'Minus' },
  { id: 'bar-brass', name: 'Brushed Brass Bar Handle', color: '#d97706', icon: 'Minus' },
  { id: 'bar-chrome', name: 'Polished Chrome Handle', color: '#e2e8f0', icon: 'Minus' },
  { id: 'edge-pull', name: 'Slim Edge Profile Pull', color: '#475569', icon: 'CornerDownLeft' },
  { id: 'knob', name: 'Minimalist Round Knob', color: '#0f172a', icon: 'Circle' },
  { id: 'handleless', name: 'Integrated J-Pull / Handleless (Gola)', color: '#94a3b8', icon: 'Square' },
];
