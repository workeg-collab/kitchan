import { create } from 'zustand';
import { CustomMaterialItem } from '../types/materials';

export const INITIAL_DEFAULT_MATERIALS: CustomMaterialItem[] = [
  // --- 1. ALWAH KHASHAB & MELAMINE (WOOD / MFC / MDF) ---
  {
    id: 'mat-egger-white-18',
    name: 'إيجر ألماني أبيض ألباين سوبر مات W980 (18 مم)',
    nameEn: 'Egger Alpine White W980 SM 18mm',
    category: 'wood-sheet',
    supplier: 'Egger Germany',
    colorCode: '#f8fafc',
    sheetLength: 2800,
    sheetWidth: 2070,
    thickness: 18,
    price: 1850,
    pricingUnit: 'لوح',
    wastePercentage: 12,
    roughness: 0.85,
    metalness: 0.02,
    textureType: 'matte',
    notes: 'لوح إيجر ألماني مستورد شاسيه وضلف مقاوم للخدش',
  },
  {
    id: 'mat-egger-cashmere-18',
    name: 'إيجر كاشمير بيج دافئ U702 (18 مم)',
    nameEn: 'Egger Cashmere Grey U702 18mm',
    category: 'wood-sheet',
    supplier: 'Egger Germany',
    colorCode: '#d6cec4',
    sheetLength: 2800,
    sheetWidth: 2070,
    thickness: 18,
    price: 1950,
    pricingUnit: 'لوح',
    wastePercentage: 12,
    roughness: 0.85,
    metalness: 0.02,
    textureType: 'matte',
    notes: 'درجة كاشمير راقية للمطابخ والدريسينج المودرن',
  },
  {
    id: 'mat-egger-oak-18',
    name: 'إيجر أرو طبيعي جلادستون كود H3303 (18 مم)',
    nameEn: 'Egger Gladstone Oak H3303 18mm',
    category: 'wood-sheet',
    supplier: 'Egger Germany',
    colorCode: '#bfa076',
    sheetLength: 2800,
    sheetWidth: 2070,
    thickness: 18,
    price: 2150,
    pricingUnit: 'لوح',
    wastePercentage: 14,
    roughness: 0.72,
    metalness: 0.02,
    textureType: 'wood',
    notes: 'ملمس بارز خشب أرو طبيعي ثلاثي الأبعاد',
  },
  {
    id: 'mat-kronospan-walnut-18',
    name: 'كرونوسبان جوز أمريكي مدخن فاخر (18 مم)',
    nameEn: 'Kronospan Smoked Walnut 18mm',
    category: 'wood-sheet',
    supplier: 'Kronospan Austria',
    colorCode: '#594433',
    sheetLength: 2800,
    sheetWidth: 2070,
    thickness: 18,
    price: 2100,
    pricingUnit: 'لوح',
    wastePercentage: 14,
    roughness: 0.75,
    metalness: 0.02,
    textureType: 'wood',
    notes: 'تجزيعات جوز ملكية للأجنحة والمكتبات الفاخرة',
  },
  {
    id: 'mat-alvic-luxe-white-18',
    name: 'ألبيك لوكس إسباني أبيض هاي جلوس مرايا (18 مم)',
    nameEn: 'Alvic Luxe High Gloss Pure White 18mm',
    category: 'wood-sheet',
    supplier: 'Alvic Spain',
    colorCode: '#ffffff',
    sheetLength: 2750,
    sheetWidth: 1220,
    thickness: 18,
    price: 2650,
    pricingUnit: 'لوح',
    wastePercentage: 10,
    roughness: 0.08,
    metalness: 0.25,
    textureType: 'gloss',
    notes: 'طبقة لاكيه عالية اللمعان ومقاومة للبصمات والأشعة فوق البنفسجية',
  },
  {
    id: 'mat-blockboard-heavy-25',
    name: 'خشب كونتر إندونيسي عالي الكثافة لشاسيهات الأسرّة (25 مم)',
    nameEn: 'Indonesian Heavy Blockboard 25mm',
    category: 'wood-sheet',
    supplier: 'Indonesia Import',
    colorCode: '#c49a6c',
    sheetLength: 2440,
    sheetWidth: 1220,
    thickness: 25,
    price: 1750,
    pricingUnit: 'لوح',
    wastePercentage: 12,
    roughness: 0.8,
    metalness: 0.0,
    textureType: 'wood',
    notes: 'متانة فائقة لشاسيهات السرير والأرفف العريضة المقاومة للتقوس',
  },

  // --- 2. COUNTERTOPS & MARBLE & QUARTZ ---
  {
    id: 'mat-quartz-calacatta-gold',
    name: 'كوارتز كلكتا جولد إيطالي معالج بعروق ذهبية (20 مم)',
    nameEn: 'Italian Calacatta Gold Quartz 20mm',
    category: 'countertop',
    supplier: 'Silestone / Quartz Elite',
    colorCode: '#f8fafc',
    sheetLength: 3200,
    sheetWidth: 1600,
    thickness: 20,
    price: 3400,
    pricingUnit: 'متر مربع م²',
    wastePercentage: 10,
    roughness: 0.2,
    metalness: 0.15,
    textureType: 'marble',
    notes: 'مقاوم للبقع والحرارة والأحماض 100% مع ضمان 15 سنة',
  },
  {
    id: 'mat-marble-nero-marquina',
    name: 'رخام أسود نيرو ماركينا إسباني طبيعي (20 مم / 30 مم)',
    nameEn: 'Spanish Nero Marquina Black Marble 20mm',
    category: 'countertop',
    supplier: 'Levantina Spain',
    colorCode: '#18181b',
    sheetLength: 2900,
    sheetWidth: 1750,
    thickness: 20,
    price: 2900,
    pricingUnit: 'متر مربع م²',
    wastePercentage: 15,
    roughness: 0.25,
    metalness: 0.15,
    textureType: 'granite',
    notes: 'رخام طبيعي أسود كربوني فخم مع عروق بيضاء نقية',
  },
  {
    id: 'mat-marble-carrara-white',
    name: 'رخام كرارة تركي ناصع مع عروق رمادية (20 مم)',
    nameEn: 'Turkish Carrara Classic White Marble 20mm',
    category: 'countertop',
    supplier: 'Carrara Stone',
    colorCode: '#e2e8f0',
    sheetLength: 2800,
    sheetWidth: 1500,
    thickness: 20,
    price: 2400,
    pricingUnit: 'متر مربع م²',
    wastePercentage: 12,
    roughness: 0.28,
    metalness: 0.1,
    textureType: 'marble',
    notes: 'رخام كلاسيكي مناسب للمطابخ والتسريحات المودرن',
  },

  // --- 3. CLADDING & COMPOSITE PANELS (CLADDING SYSTEM) ---
  {
    id: 'mat-cladding-alubond-silver',
    name: 'شيت كلادينج ألوبوند فضي ميتاليك 4 مم (PVDF)',
    nameEn: 'Alubond Metallic Silver Cladding 4mm',
    category: 'cladding-sheet',
    supplier: 'Alubond USA / Gulf',
    colorCode: '#94a3b8',
    sheetLength: 2440,
    sheetWidth: 1220,
    thickness: 4,
    price: 850,
    pricingUnit: 'لوح',
    wastePercentage: 10,
    roughness: 0.35,
    metalness: 0.7,
    textureType: 'metal',
    notes: 'شيت ألومنيوم مركب مقاوم للحريق والمياه والرطوبة العالية',
  },
  {
    id: 'mat-cladding-alubond-black',
    name: 'شيت كلادينج ألوبوند أسود مطفي فاخر 4 مم',
    nameEn: 'Alubond Matte Black Cladding 4mm',
    category: 'cladding-sheet',
    supplier: 'Alubond USA',
    colorCode: '#1e293b',
    sheetLength: 2440,
    sheetWidth: 1220,
    thickness: 4,
    price: 890,
    pricingUnit: 'لوح',
    wastePercentage: 10,
    roughness: 0.5,
    metalness: 0.4,
    textureType: 'matte',
    notes: 'كلادينج أسود مطفي عازل للمطابخ الحديثة',
  },

  // --- 4. ALUMINIUM & KHASHMOUNIUM PROFILES ---
  {
    id: 'mat-alum-profile-tango',
    name: 'عود ألوميتال قطاع تانجو مطابخ معتمد (طول 6 متر)',
    nameEn: 'Aluminium Tango Kitchen Profile 6m Bar',
    category: 'aluminium-profile',
    supplier: 'Egypt Aluminium Co.',
    colorCode: '#475569',
    sheetLength: 6000,
    sheetWidth: 25,
    thickness: 1.5,
    price: 570,
    pricingUnit: 'متر طولي م.ط',
    wastePercentage: 8,
    roughness: 0.4,
    metalness: 0.85,
    textureType: 'metal',
    notes: 'قطاع شاسيه وضلف ألوميتال ثقيل 1.5 مم مدهون بودرة إلكتروستاتيك',
  },
  {
    id: 'mat-khashmounium-jumbo-6m',
    name: 'عود خشمونيوم قطاع جامبو بتجزيعة خشب طبيعي (طول 6 متر)',
    nameEn: 'Khashmounium Master Jumbo Woodgrain 6m Bar',
    category: 'aluminium-profile',
    supplier: 'Khashmounium Master',
    colorCode: '#78350f',
    sheetLength: 6000,
    sheetWidth: 35,
    thickness: 1.6,
    price: 1110,
    pricingUnit: 'متر طولي م.ط',
    wastePercentage: 8,
    roughness: 0.6,
    metalness: 0.3,
    textureType: 'wood',
    notes: 'قطاع خشمونيوم مكبوس بطبقة تجزيعة خشب أرو إيطالي',
  },

  // --- 5. GLASS & VITRINES ---
  {
    id: 'mat-glass-smoked-grey-6mm',
    name: 'لوح زجاج سيكوريت فوميه رمادي مدخن 6 مم',
    nameEn: 'Tempered Smoked Grey Glass 6mm',
    category: 'glass',
    supplier: 'Saint-Gobain Glass',
    colorCode: '#334155',
    sheetLength: 2440,
    sheetWidth: 1830,
    thickness: 6,
    price: 720,
    pricingUnit: 'متر مربع م²',
    wastePercentage: 8,
    roughness: 0.1,
    metalness: 0.2,
    textureType: 'glass',
    notes: 'زجاج سيكوريت عالي الفخامة للفيترينات والدريسينج روم',
  },
  {
    id: 'mat-glass-fluted-reeded-6mm',
    name: 'لوح زجاج مضلع ريبد عاكس (Fluted Glass) 6 مم',
    nameEn: 'Fluted Reeded Architecture Glass 6mm',
    category: 'glass',
    supplier: 'Artistic Glass Co.',
    colorCode: '#cbd5e1',
    sheetLength: 2440,
    sheetWidth: 1830,
    thickness: 6,
    price: 890,
    pricingUnit: 'متر مربع م²',
    wastePercentage: 10,
    roughness: 0.3,
    metalness: 0.1,
    textureType: 'glass',
    notes: 'زجاج مضلع ريبد يعطي خصوصية ولمسة جمالية مع إضاءة الليد',
  },

  // --- 6. FABRIC & BOUCLE (FOR BEDS & ACCENTS) ---
  {
    id: 'mat-fabric-boucle-cream',
    name: 'قماش بوكليه أوروبي كريمي فاخر مضاد للبقع (للسرائر)',
    nameEn: 'European Stain-Resistant Cream Boucle Fabric',
    category: 'fabric',
    supplier: 'Textile Prestige',
    colorCode: '#f5efe6',
    sheetLength: 3000,
    sheetWidth: 1400,
    thickness: 3,
    price: 480,
    pricingUnit: 'متر طولي م.ط',
    wastePercentage: 10,
    roughness: 0.95,
    metalness: 0.0,
    textureType: 'fabric',
    notes: 'قماش بوكليه ناعم جداً مخصص لتنجيد ظهر السرير والبانكيت',
  },
];

const STORAGE_KEY = 'kitchan_materials_database_v2';

interface MaterialsState {
  materials: CustomMaterialItem[];
  addMaterial: (material: Omit<CustomMaterialItem, 'id'> & { id?: string }) => CustomMaterialItem;
  updateMaterial: (id: string, updates: Partial<CustomMaterialItem>) => void;
  deleteMaterial: (id: string) => void;
  duplicateMaterial: (id: string) => CustomMaterialItem | null;
  resetToDefaults: () => void;
  getMaterialsByCategory: (category?: string) => CustomMaterialItem[];
  getMaterialById: (id: string) => CustomMaterialItem | undefined;
}

function loadSavedMaterials(): CustomMaterialItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load custom materials from localStorage', err);
  }
  return INITIAL_DEFAULT_MATERIALS;
}

export const useMaterialsStore = create<MaterialsState>((set, get) => ({
  materials: loadSavedMaterials(),

  addMaterial: (materialData) => {
    const id = materialData.id || `mat-custom-${Date.now()}`;
    const newMaterial: CustomMaterialItem = {
      ...materialData,
      id,
      isCustom: true,
    };

    set((state) => {
      const updated = [newMaterial, ...state.materials];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { materials: updated };
    });

    return newMaterial;
  },

  updateMaterial: (id, updates) => {
    set((state) => {
      const updated = state.materials.map((m) => (m.id === id ? { ...m, ...updates } : m));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { materials: updated };
    });
  },

  deleteMaterial: (id) => {
    set((state) => {
      const updated = state.materials.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { materials: updated };
    });
  },

  duplicateMaterial: (id) => {
    const item = get().materials.find((m) => m.id === id);
    if (!item) return null;

    const copy: CustomMaterialItem = {
      ...item,
      id: `mat-copy-${Date.now()}`,
      name: `${item.name} (نسخة مخصصة)`,
      isCustom: true,
    };

    set((state) => {
      const updated = [copy, ...state.materials];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { materials: updated };
    });

    return copy;
  },

  resetToDefaults: () => {
    set({ materials: INITIAL_DEFAULT_MATERIALS });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_MATERIALS));
  },

  getMaterialsByCategory: (category) => {
    const all = get().materials;
    if (!category || category === 'all') return all;
    return all.filter((m) => m.category === category);
  },

  getMaterialById: (id) => {
    return get().materials.find((m) => m.id === id);
  },
}));
