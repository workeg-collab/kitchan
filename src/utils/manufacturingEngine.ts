import { CabinetItem } from '../types';
import { 
  ManufacturingSystemTemplate, 
  CompleteManufacturingPackage, 
  ProfileCutPiece, 
  InfillSheetPiece, 
  BarNestingAllocation, 
  SheetNestingAllocation 
} from '../types/manufacturingSystems';
import { ALUMINIUM_PROFILE_DATABASE } from '../constants/aluminiumProfiles';
import { PRESET_MANUFACTURING_TEMPLATES } from '../constants/manufacturingTemplates';

/**
 * 1D Linear Bar Nesting Optimizer
 * Packs linear profile cuts into standard 6000mm bars using First-Fit-Decreasing algorithm
 */
function optimizeLinearProfileBars(
  cuts: ProfileCutPiece[],
  standardBarLength: number = 6000,
  sawKerf: number = 4
): { nesting: BarNestingAllocation[]; totalBars: number; totalMeters: number } {
  // Flatten all individual cut pieces
  const pieces: { pieceId: string; cabinetId: string; profileCode: string; length: number; angle: string }[] = [];
  let totalLengthSum = 0;

  cuts.forEach((cut) => {
    for (let i = 0; i < cut.quantity; i++) {
      pieces.push({
        pieceId: cut.id,
        cabinetId: cut.cabinetId,
        profileCode: cut.profileCode,
        length: cut.length,
        angle: `${cut.cutAngleLeft}°/${cut.cutAngleRight}°`,
      });
      totalLengthSum += cut.length;
    }
  });

  // Sort descending
  pieces.sort((a, b) => b.length - a.length);

  const bars: BarNestingAllocation[] = [];

  pieces.forEach((piece) => {
    // Find first bar with enough space
    let placed = false;
    for (const bar of bars) {
      if (bar.profileCode === piece.profileCode) {
        const remainingSpace = bar.standardLength - (bar.totalCutLength + (bar.cuts.length > 0 ? sawKerf : 0));
        if (remainingSpace >= piece.length) {
          bar.cuts.push(piece);
          bar.totalCutLength += piece.length + (bar.cuts.length > 1 ? sawKerf : 0);
          bar.wasteLength = Math.max(0, bar.standardLength - bar.totalCutLength);
          bar.wastePercentage = Math.round((bar.wasteLength / bar.standardLength) * 100);
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      // Open a new 6000mm bar
      bars.push({
        barIndex: bars.length + 1,
        standardLength: standardBarLength,
        profileCode: piece.profileCode,
        cuts: [piece],
        totalCutLength: piece.length,
        wasteLength: standardBarLength - piece.length,
        wastePercentage: Math.round(((standardBarLength - piece.length) / standardBarLength) * 100),
      });
    }
  });

  return {
    nesting: bars,
    totalBars: bars.length,
    totalMeters: Number((totalLengthSum / 1000).toFixed(2)),
  };
}

/**
 * 2D Sheet Nesting Calculator (for Wood / Cladding / Fiber)
 */
function optimizeSheetMaterials(
  panels: { id: string; cabinetId: string; partName: string; length: number; width: number; quantity: number }[],
  sheetWidth: number = 2800,
  sheetLength: number = 2070,
  materialName: string = 'لوح شيت',
  wasteAllowance: number = 1.15
): { nesting: SheetNestingAllocation[]; totalSheets: number; totalAreaM2: number } {
  let totalUsedAreaM2 = 0;
  const flatPanels: { panelId: string; cabinetId: string; partName: string; length: number; width: number }[] = [];

  panels.forEach((p) => {
    for (let i = 0; i < p.quantity; i++) {
      flatPanels.push({
        panelId: p.id,
        cabinetId: p.cabinetId,
        partName: p.partName,
        length: p.length,
        width: p.width,
      });
      totalUsedAreaM2 += (p.length * p.width) / 1000000;
    }
  });

  const singleSheetAreaM2 = (sheetWidth * sheetLength) / 1000000;
  const totalSheetsNeeded = Math.max(1, Math.ceil((totalUsedAreaM2 * wasteAllowance) / singleSheetAreaM2));

  const nesting: SheetNestingAllocation[] = [];
  const panelsPerSheet = Math.max(1, Math.ceil(flatPanels.length / totalSheetsNeeded));

  for (let s = 0; s < totalSheetsNeeded; s++) {
    const sheetPanels = flatPanels.slice(s * panelsPerSheet, (s + 1) * panelsPerSheet);
    const sheetUsedArea = sheetPanels.reduce((acc, sp) => acc + (sp.length * sp.width) / 1000000, 0);

    nesting.push({
      sheetIndex: s + 1,
      standardWidth: sheetWidth,
      standardLength: sheetLength,
      materialName,
      panels: sheetPanels,
      usedAreaM2: Number(sheetUsedArea.toFixed(2)),
      totalAreaM2: Number(singleSheetAreaM2.toFixed(2)),
      wastePercentage: Math.max(8, Math.round(((singleSheetAreaM2 - sheetUsedArea) / singleSheetAreaM2) * 100)),
    });
  }

  return {
    nesting,
    totalSheets: totalSheetsNeeded,
    totalAreaM2: Number(totalUsedAreaM2.toFixed(2)),
  };
}

/**
 * Universal Material-Based Manufacturing Engine
 * Generates exact components, profile cutting angles, and BOM based on the selected material system
 */
export function calculateUnifiedManufacturingPackage(
  cabinets: CabinetItem[],
  template?: ManufacturingSystemTemplate
): CompleteManufacturingPackage {
  const activeTemplate = template || PRESET_MANUFACTURING_TEMPLATES[0];
  const sysType = activeTemplate.systemType;

  const woodPanels: CompleteManufacturingPackage['woodPanels'] = [];
  const profileCuts: ProfileCutPiece[] = [];
  const infillPanels: InfillSheetPiece[] = [];
  const hwMap = new Map<string, { id: string; name: string; category: string; quantity: number; unit: string; unitPrice: number; description: string }>();

  function addHw(name: string, category: string, qty: number, unit: string = 'قطعة', unitPrice: number = 10, desc: string = '') {
    const key = `${name}_${unit}`;
    const existing = hwMap.get(key);
    if (existing) {
      existing.quantity += qty;
    } else {
      hwMap.set(key, { id: `hw-${hwMap.size + 1}`, name, category, quantity: qty, unit, unitPrice, description: desc });
    }
  }

  // Process Each Cabinet Through The Selected Material Engine
  cabinets.forEach((cab) => {
    const CW = cab.width;
    const CH = cab.height;
    const CD = cab.depth;
    const BT = activeTemplate.primaryBoardThickness;

    // --- A. WOOD-BASED MANUFACTURING ENGINE ---
    if (sysType === 'wood') {
      const isSidesOutside = activeTemplate.carcassConstruction === 'sides-outside';
      const internalWidth = isSidesOutside ? CW - 2 * BT : CW;
      const internalHeight = isSidesOutside ? CH : CH - 2 * BT;

      const isBed = cab.category === 'bed' || cab.type.startsWith('bed-');
      const isTable = cab.category === 'coffee-table' || cab.category === 'dining-table';
      const isTvWall = cab.category === 'tv-wall' || cab.type === 'living-tv-slat-wall';

      if (isBed) {
        // 1. BED HEADBOARD & FRAME COMPONENTS
        woodPanels.push({
          id: `${cab.id}-HEADBOARD`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'ظهر سرير ماستر رئيسي (Headboard Panel)',
          quantity: 1,
          length: CW,
          width: CH,
          thickness: BT,
          material: cab.materialFront || 'خشب مبطن بوكليه / قشرة 18 مم',
          edgeBanding: { top: true, bottom: true, left: true, right: true },
        });

        woodPanels.push({
          id: `${cab.id}-SIDE-L`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'جنب شاسيه سرير يسار (Left Bed Rail)',
          quantity: 1,
          length: CD,
          width: 320,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: true, bottom: false, left: false, right: false },
        });

        woodPanels.push({
          id: `${cab.id}-SIDE-R`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'جنب شاسيه سرير يمين (Right Bed Rail)',
          quantity: 1,
          length: CD,
          width: 320,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: true, bottom: false, left: false, right: false },
        });

        woodPanels.push({
          id: `${cab.id}-FOOTBOARD`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'عارضة قدم السرير الأمامية (Bed Footboard)',
          quantity: 1,
          length: CW,
          width: 320,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: true, bottom: false, left: false, right: false },
        });

        woodPanels.push({
          id: `${cab.id}-SLAT-BASE`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'شاسيه حمل المرتبة (Mattress Support Platform)',
          quantity: 1,
          length: CD - 60,
          width: CW - 60,
          thickness: BT,
          material: 'كونتر / MDF 18 مم',
          edgeBanding: { top: false, bottom: false, left: false, right: false },
        });

        addHw('زوايا تجميع أسرّة حديد ثقيلة مع مسامير زنك', 'hardware', 4, 'طقم', 45, 'زوايا تثبيت أركان السرير');
        if (cab.hasHydraulicStorage || cab.type.includes('hydraulic')) {
          addHw('ميكانيزم هيدروليك رفع السرير 1200N', 'hardware', 1, 'طقم', 380, 'بساتم رفع سحارة التخزين');
        }
      } else if (isTable) {
        // 2. TABLETOP & FRAME RAILS
        woodPanels.push({
          id: `${cab.id}-TABLETOP`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'قرصة سطح الطاولة العلوية (Tabletop Panel)',
          quantity: 1,
          length: CW,
          width: CD,
          thickness: BT,
          material: cab.materialFront || 'رخام / خشب معالج 25 مم',
          edgeBanding: { top: true, bottom: true, left: true, right: true },
        });

        woodPanels.push({
          id: `${cab.id}-RAILS`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'عوارض شاسيه تثبيت الأرجل (Subframe Rails)',
          quantity: 2,
          length: CW - 120,
          width: 90,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: false, bottom: false, left: false, right: false },
        });

        addHw('أرجل معدنية مدهونة إلكتروستاتيك أسود', 'legs', 4, 'قطعة', 85, 'أرجل الطاولة');
      } else if (isTvWall) {
        // 3. TV WALL & MEDIA CREDENZA
        woodPanels.push({
          id: `${cab.id}-BACKPANEL`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'لوح تجليد الجدار الحامل للشاشة (TV Wall Backing)',
          quantity: 1,
          length: CW,
          width: CH,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: true, bottom: true, left: true, right: true },
        });

        woodPanels.push({
          id: `${cab.id}-CREDENZA-TOP`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'قرصة كونسول الشاشة السفلي المعلق',
          quantity: 1,
          length: Math.round(CW * 0.9),
          width: CD,
          thickness: BT,
          material: cab.materialFront || 'خشب أرو 18 مم',
          edgeBanding: { top: true, bottom: true, left: true, right: true },
        });

        addHw('حوامل تعليق كونسول مخفية ثقيلة (Camar Hanging Brackets)', 'hardware', 2, 'طقم', 65, 'تثبيت الوحدة المعلقة');
      } else {
        // 4. STANDARD CARCASE CABINET (KITCHEN / DRESSING / WARDROBE / NIGHTSTAND)
        const isSidesOutside = activeTemplate.carcassConstruction === 'sides-outside';
        const internalWidth = isSidesOutside ? CW - 2 * BT : CW;
        const internalHeight = isSidesOutside ? CH : CH - 2 * BT;

        // Side Left & Right Panels
        woodPanels.push({
          id: `${cab.id}-SIDE-L`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: cab.category === 'wardrobe' ? 'قاطع دولاب رأسي يسار (Gable Left)' : 'جنب شاسيه يسار',
          quantity: 1,
          length: isSidesOutside ? CH : internalHeight,
          width: CD,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: false, bottom: false, left: false, right: true },
        });
        woodPanels.push({
          id: `${cab.id}-SIDE-R`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: cab.category === 'wardrobe' ? 'قاطع دولاب رأسي يمين (Gable Right)' : 'جنب شاسيه يمين',
          quantity: 1,
          length: isSidesOutside ? CH : internalHeight,
          width: CD,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: false, bottom: false, left: false, right: true },
        });

        // Bottom Panel
        woodPanels.push({
          id: `${cab.id}-BOT`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: cab.category === 'wardrobe' ? 'قاع دولاب سفلي' : 'قاع شاسيه سفلي',
          quantity: 1,
          length: internalWidth,
          width: CD,
          thickness: BT,
          material: cab.materialBody || 'ميلامين 18 مم',
          edgeBanding: { top: false, bottom: false, left: false, right: true },
        });

        // Top Panel / Stretchers
        if (cab.category === 'base') {
          woodPanels.push({
            id: `${cab.id}-TOP-RAIL-F`,
            cabinetId: cab.id,
            cabinetName: cab.name,
            partName: 'عارضة تثبيت أمامية',
            quantity: 1,
            length: internalWidth,
            width: 100,
            thickness: BT,
            material: cab.materialBody || 'ميلامين 18 مم',
            edgeBanding: { top: false, bottom: false, left: false, right: true },
          });
          woodPanels.push({
            id: `${cab.id}-TOP-RAIL-B`,
            cabinetId: cab.id,
            cabinetName: cab.name,
            partName: 'عارضة تثبيت خلفية',
            quantity: 1,
            length: internalWidth,
            width: 100,
            thickness: BT,
            material: cab.materialBody || 'ميلامين 18 مم',
            edgeBanding: { top: false, bottom: false, left: false, right: false },
          });
        } else {
          woodPanels.push({
            id: `${cab.id}-TOP`,
            cabinetId: cab.id,
            cabinetName: cab.name,
            partName: cab.category === 'wardrobe' ? 'سقف دولاب علوي' : 'سقف شاسيه علوي',
            quantity: 1,
            length: internalWidth,
            width: CD,
            thickness: BT,
            material: cab.materialBody || 'ميلامين 18 مم',
            edgeBanding: { top: false, bottom: false, left: false, right: true },
          });
        }
      }

      // Back Panel, Shelves, and Doors (For standard storage units and wardrobes)
      if (!isBed && !isTable) {
        const backW = internalWidth + (activeTemplate.backPanelMount === 'grooved' ? 16 : 0);
        const backH = (isSidesOutside ? CH - 2 * BT : internalHeight) + (activeTemplate.backPanelMount === 'grooved' ? 16 : 0);
        woodPanels.push({
          id: `${cab.id}-BACK`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: 'ظهر شاسيه (مفحور 6 مم)',
          quantity: 1,
          length: backH,
          width: backW,
          thickness: activeTemplate.backPanelThickness,
          material: 'MDF ظهر 6 مم',
          edgeBanding: { top: false, bottom: false, left: false, right: false },
        });

        // Shelves
        if (cab.shelfCount > 0) {
          woodPanels.push({
            id: `${cab.id}-SHELF`,
            cabinetId: cab.id,
            cabinetName: cab.name,
            partName: 'رف داخلي متحرك',
            quantity: cab.shelfCount,
            length: internalWidth - 2,
            width: CD - 40,
            thickness: BT,
            material: cab.materialBody || 'ميلامين 18 مم',
            edgeBanding: { top: false, bottom: false, left: false, right: true },
          });
          addHw('كوابيل رفوف نيكل 5 مم', 'shelf-pin', cab.shelfCount * 4, 'قطعة', 3, 'كوابيل تثبيت الرفوف');
        }

        // Door Fronts
        if (cab.doorCount > 0 && cab.doorType !== 'open') {
          const doorW = cab.doorCount === 1 ? CW - activeTemplate.doorReveal : Math.round((CW - (cab.doorCount + 1) * activeTemplate.doorReveal) / cab.doorCount);
          woodPanels.push({
            id: `${cab.id}-DOOR`,
            cabinetId: cab.id,
            cabinetName: cab.name,
            partName: `ضلفة باب واجهة (${cab.doorCount} ضلف)`,
            quantity: cab.doorCount,
            length: CH - activeTemplate.doorReveal,
            width: doorW,
            thickness: BT,
            material: cab.materialFront || 'خامة الواجهة',
            edgeBanding: { top: true, bottom: true, left: true, right: true },
          });
          addHw('مفصلات باستم هيدروليك سوفت كلوز 110°', 'hinge', cab.doorCount * (CH > 1500 ? 4 : 2), 'قطعة', 25, 'مفصلات غلق ناعم');
        }

        // Screws & Confirmat
        addHw('مسامير تجميع كونفرمات 7×50 مم', 'screw', 16, 'قطعة', 1.5, 'مسامير ربط الشاسيه');
        if (cab.category === 'base' || cab.category === 'tall') {
          addHw('أرجل مطبخ بلاستيك رجلاش 10 سم', 'leg', 4, 'قطعة', 15, 'أرجل تسوية وتثبيت الوزرة');
        }

        // Carcass & Signature Hardware Additions
        if (cab.hasDishRack) {
          addHw('مطبق تركي صفاية أطباق استانلس استيل 304 مع صينية مياه', 'accessories', 1, 'طقم', 450, 'صفاية أطباق ومطبق داخلي هيدروليك');
        }
        if (cab.hasAluminumWaterproofBottom) {
          addHw('لوح ألومنيوم مصفح عازل للمياه 1 مم لقاع الحوض', 'hardware', 1, 'لوح', 120, 'حماية قاع الحوض من تسريب المياه');
        }
        if (cab.hasGolaProfile) {
          addHw('بروفايل جولا ألومنيوم L/C شطف مخفي', 'handles', 1, 'متر', 180, 'مقبض بروفايل جولا للمطبخ المودرن');
        }
        if (cab.hasFillerPanel) {
          woodPanels.push({
            id: `${cab.id}-FILLER`,
            cabinetId: cab.id,
            cabinetName: cab.name,
            partName: 'بانوه فيلر تعويض جداري 7 سم',
            quantity: 1,
            length: CH,
            width: 70,
            thickness: BT,
            material: cab.materialFront || 'خامة الواجهة',
            edgeBanding: { top: true, bottom: true, left: true, right: true },
          });
        }

        // Shoe Cabinet (الجزامات) Specific Hardware & Panels
        if (cab.hasDropFlaps || cab.shoeCabinetType === 'drop-down' || cab.type === 'shoe-cabinet-drop-down') {
          const flaps = cab.shoeTiersCount || cab.shelfCount || 3;
          addHw('ميكانيزم قلاب جزامة هيدروليك متعدد الأدوار', 'accessories', flaps, 'طقم', 85, 'حوامل وقلابات بلاستيك/معدن للأحذية');
        }
        if (cab.hasPaddedSeat || cab.shoeCabinetType === 'bench-seating' || cab.type === 'shoe-cabinet-bench') {
          addHw('مقعد جلوس بف مبطن إسفنج عالي الكثافة مع تنجيد جلد', 'accessories', 1, 'قطعة', 350, 'وسادة مقعد جزامة كونسول مريحة');
        }
        if (cab.hasVentilationLouvers || cab.shoeCabinetType === 'louvered-doors') {
          addHw('هوايات تهوية دائرية ألومنيوم للأحذية', 'accessories', 4, 'قطعة', 15, 'فتحات تهوية صحية لمنع الروائح الكريهة');
        }

        // Dressing Vertical Partitions (قواطع رأسية للدريسينج)
        if (cab.verticalDividersCount && cab.verticalDividersCount > 0) {
          woodPanels.push({
            id: `${cab.id}-GABLES`,
            cabinetId: cab.id,
            cabinetName: cab.name,
            partName: 'قاطع رأسي داخلي (Gable Divider)',
            quantity: cab.verticalDividersCount,
            length: CH - 2 * BT,
            width: CD - 20,
            thickness: BT,
            material: cab.materialBody || 'خامة الشاسيه',
            edgeBanding: { top: false, bottom: false, left: false, right: true },
          });
        }

        // Hydraulic Pull-down rail
        if (cab.dressingHangingConfig === 'hydraulic') {
          addHw('ماسورة تعليق هيدروليك سحاب نزول (Servetto)', 'accessories', 1, 'طقم', 420, 'ماسورة سحاب للملابس العالية');
        }
      }
    }

    // --- B. ALUMINIUM / KHASHMOUNIUM / CLADDING / FIBRE ENGINES ---
    if (sysType === 'aluminium' || sysType === 'cladding' || sysType === 'khashmounium' || sysType === 'fibre') {
      const vertProfileCode = activeTemplate.verticalFrameProfileId || 'AL-TUBE-25';
      const horizProfileCode = activeTemplate.horizontalFrameProfileId || 'AL-TUBE-25';
      const doorProfileCode = activeTemplate.doorFrameProfileId || 'AL-DOOR-45';
      const PW = activeTemplate.cornerJointDeduction || 25; // Profile Width deduction

      // 1. 4x Vertical Frame Posts (قوائم الشاسيه الأربعة)
      profileCuts.push({
        id: `${cab.id}-PROF-VERT`,
        cabinetId: cab.id,
        cabinetName: cab.name,
        profileCode: vertProfileCode,
        profileName: `${vertProfileCode} - قوائم الشاسيه الرأسية`,
        category: 'vertical-frame',
        length: CH - 2 * PW,
        quantity: 4,
        cutAngleLeft: 90,
        cutAngleRight: 90,
        material: 'ألومنيوم مقوى',
        notes: 'قوائم الأركان الأربعة للشاسيه',
      });

      // 2. 4x Depth Crossbars (عوارض العمق الأربعة)
      profileCuts.push({
        id: `${cab.id}-PROF-DEPTH`,
        cabinetId: cab.id,
        cabinetName: cab.name,
        profileCode: horizProfileCode,
        profileName: `${horizProfileCode} - عوارض عمق الشاسيه`,
        category: 'horizontal-frame',
        length: CD - 2 * PW,
        quantity: 4,
        cutAngleLeft: 90,
        cutAngleRight: 90,
        material: 'ألومنيوم مقوى',
      });

      // 3. 4x Width Crossbars (عوارض العرض الأربعة)
      profileCuts.push({
        id: `${cab.id}-PROF-WIDTH`,
        cabinetId: cab.id,
        cabinetName: cab.name,
        profileCode: horizProfileCode,
        profileName: `${horizProfileCode} - عوارض عرض الشاسيه`,
        category: 'horizontal-frame',
        length: CW - 2 * PW,
        quantity: 4,
        cutAngleLeft: 90,
        cutAngleRight: 90,
        material: 'ألومنيوم مقوى',
      });

      // 4. Infill / Cladding Panels (ألواح التجليد والحشو الداخلي)
      const infillMat = sysType === 'cladding' ? 'شيت كلادينج 4 مم Alubond' : sysType === 'khashmounium' ? 'فايبر بتجزيعة خشب 4 مم' : 'فايبر جلاس عازل 4 مم';

      // Left & Right Side Infills
      infillPanels.push({
        id: `${cab.id}-INF-SIDE`,
        cabinetId: cab.id,
        cabinetName: cab.name,
        partName: 'شيت تجليد الجنبين (يمين ويسار)',
        quantity: 2,
        length: CH - 30,
        width: CD - 30,
        thickness: activeTemplate.primaryBoardThickness,
        material: infillMat,
      });

      // Bottom & Back Infills
      infillPanels.push({
        id: `${cab.id}-INF-BOT`,
        cabinetId: cab.id,
        cabinetName: cab.name,
        partName: 'حشوة قاع الشاسيه',
        quantity: 1,
        length: CW - 30,
        width: CD - 30,
        thickness: activeTemplate.primaryBoardThickness,
        material: infillMat,
      });
      infillPanels.push({
        id: `${cab.id}-INF-BACK`,
        cabinetId: cab.id,
        cabinetName: cab.name,
        partName: 'شيت ظهر الشاسيه',
        quantity: 1,
        length: CH - 30,
        width: CW - 30,
        thickness: activeTemplate.backPanelThickness,
        material: infillMat,
      });

      // 5. Door Mitre 45° Frame Cuts (فريمات الضلف المشطوفة 45 درجة)
      if (cab.doorCount > 0 && cab.doorType !== 'open') {
        const doorW = cab.doorCount === 1 ? CW - 6 : Math.round((CW - 10) / cab.doorCount);
        const doorH = CH - 6;

        // 2x Vertical Door Profiles (Left/Right) mitred 45°
        profileCuts.push({
          id: `${cab.id}-DOOR-VERT`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          profileCode: doorProfileCode,
          profileName: `${doorProfileCode} - قائم فريم الضلفة (شطف 45°)`,
          category: 'door-frame',
          length: doorH,
          quantity: cab.doorCount * 2,
          cutAngleLeft: 45,
          cutAngleRight: 45,
          material: sysType === 'khashmounium' ? 'خشمونيوم مضلع' : 'ألومنيوم',
          notes: 'قص مشطوف 45 درجة على الزاوية',
        });

        // 2x Horizontal Door Profiles (Top/Bottom) mitred 45°
        profileCuts.push({
          id: `${cab.id}-DOOR-HORIZ`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          profileCode: doorProfileCode,
          profileName: `${doorProfileCode} - عارضة فريم الضلفة (شطف 45°)`,
          category: 'door-frame',
          length: doorW,
          quantity: cab.doorCount * 2,
          cutAngleLeft: 45,
          cutAngleRight: 45,
          material: sysType === 'khashmounium' ? 'خشمونيوم مضلع' : 'ألومنيوم',
          notes: 'قص مشطوف 45 درجة على الزاوية',
        });

        // Infill for Doors
        infillPanels.push({
          id: `${cab.id}-DOOR-INF`,
          cabinetId: cab.id,
          cabinetName: cab.name,
          partName: `حشوة ضلفة داخلية (${cab.doorCount} ضلف)`,
          quantity: cab.doorCount,
          length: doorH - 70,
          width: doorW - 70,
          thickness: 4,
          material: infillMat,
        });

        addHw('جونيا زاوية تجميع ضلف ألومنيوم 45°', 'corner-bracket', cab.doorCount * 4, 'قطعة', 8, 'زوايا حديد تجميع فريم الضلفة');
        addHw('مفصلات ألوميتال كبس إيطالي', 'hinge', cab.doorCount * 2, 'قطعة', 35, 'مفصلات خاصة بقطاعات الألوميتال');
      }

      // Connectors & Accessories for Aluminium
      addHw('زوايا بلاستيك/ألومنيوم تجميع شاسيه 3 اتجاهات', 'corner-bracket', 8, 'قطعة', 12, 'كعوب تجميع زوايا الشاسيه');
      addHw('مسامير ريفيت برشام 4×12 مم ألومنيوم', 'screw', 32, 'قطعة', 0.5, 'تثبيت الشاسيه بالألواح');
    }
  });

  // Run 1D Linear Profile Optimization (if aluminium/cladding/khashmounium/fibre)
  const barOpt = optimizeLinearProfileBars(profileCuts, activeTemplate.standardBarLength || 6000, activeTemplate.sawKerf || 4);

  // Run 2D Sheet Nesting Optimization (if wood panels exist OR infills exist)
  const sheetTarget = sysType === 'wood' 
    ? woodPanels.map(p => ({ id: p.id, cabinetId: p.cabinetId, partName: p.partName, length: p.length, width: p.width, quantity: p.quantity }))
    : infillPanels.map(p => ({ id: p.id, cabinetId: p.cabinetId, partName: p.partName, length: p.length, width: p.width, quantity: p.quantity }));

  const sheetOpt = optimizeSheetMaterials(
    sheetTarget,
    activeTemplate.standardSheetWidth || 2800,
    activeTemplate.standardSheetLength || 2070,
    sysType === 'wood' ? 'لوح خشب ميلامين' : 'شيت كلادينج/فايبر',
    1 + (activeTemplate.wasteFactorPercentage || 12) / 100
  );

  // Calculate Costs
  const rawMaterialsCost = sheetOpt.totalSheets * (activeTemplate.pricePerSheet || 1500);
  const profilesCost = barOpt.totalBars * (activeTemplate.pricePerProfileBar || 600);
  const infillsCost = infillPanels.length * 120;
  const hardwareItemsList = Array.from(hwMap.values());
  const hardwareCost = hardwareItemsList.reduce((acc, h) => acc + h.quantity * (h.unitPrice || 10), 0);
  const totalMeters = barOpt.totalMeters > 0 ? barOpt.totalMeters : sheetOpt.totalAreaM2;
  const laborCost = Math.round(totalMeters * (activeTemplate.costLaborPerMeter || 350));
  const wasteCost = Math.round((rawMaterialsCost + profilesCost) * ((activeTemplate.wasteFactorPercentage || 12) / 100));
  const manufacturingSubtotal = rawMaterialsCost + profilesCost + infillsCost + hardwareCost + laborCost + wasteCost;
  const suggestedSellingPrice = Math.round(manufacturingSubtotal * 1.35); // 35% standard margin

  return {
    systemTemplate: activeTemplate,
    systemType: sysType,
    woodPanels,
    sheetNesting: sheetOpt.nesting,
    totalSheetsRequired: sheetOpt.totalSheets,
    profileCuts,
    barNesting: barOpt.nesting,
    totalBarsRequired: barOpt.totalBars,
    totalProfileMeters: barOpt.totalMeters,
    infillPanels,
    hardwareBOM: hardwareItemsList,
    costBreakdown: {
      rawMaterialsCost,
      profilesCost,
      infillsCost,
      hardwareCost,
      accessoriesCost: 800,
      laborCost,
      wasteCost,
      manufacturingSubtotal,
      suggestedSellingPrice,
    },
  };
}
