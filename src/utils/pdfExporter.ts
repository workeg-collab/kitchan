import jsPDF from 'jspdf';
import { ProjectData, CabinetItem } from '../types';
import { generateFullProjectBOM } from './manufacturing';

export interface PDFExportOptions {
  project: ProjectData;
  render3DImage?: string;
}

/**
 * High-End Multi-Page Architectural PDF Dossier with:
 * 1. 3D Render & Project Specifications Cover Sheet
 * 2. 2D Architectural Floor Plan with CM dimensions
 * 3. Side-by-Side Live Wall Elevations (Wall A, B, C, D) showing cabinet sequences
 * 4. Individual Cabinet Workshop Cut Sheets with individual facade illustrations and CM dimensions
 * 5. Cutting List Table & Pricing Quotation Summary
 */
export async function exportTechnicalPDF({
  project,
  render3DImage,
}: PDFExportOptions): Promise<void> {
  const { metadata, room, cabinets, appliances, manufacturing, materials, pricing, plinth, countertop } = project;
  const { allPanels, aggregatedHardware, sheetEstimates } = generateFullProjectBOM(cabinets, manufacturing);
  const totalBoardCount = sheetEstimates.sheetsNeeded;

  const toCm = (mm: number) => ((mm || 0) / 10).toFixed(1) + ' سم';

  // Canvas sheet dimensions (A4 Landscape 1920x1358 px)
  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1358;

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Preload 3D image if provided
  let loaded3DImg: HTMLImageElement | null = null;
  if (render3DImage && render3DImage.startsWith('data:image')) {
    try {
      loaded3DImg = await new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = render3DImage;
      });
    } catch {
      loaded3DImg = null;
    }
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Helper for Title Block & Sheet Frame
  const drawSheetFrame = (sheetTitle: string, pageNum: number, totalPages: number) => {
    // 1. White Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Outer Architectural Borders
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, CANVAS_WIDTH - 60, CANVAS_HEIGHT - 60);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, CANVAS_WIDTH - 72, CANVAS_HEIGHT - 72);

    // 3. Top Blue Header Bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, 30, CANVAS_WIDTH - 60, 80);

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Cairo", "Tajawal", "Segoe UI", sans-serif';
    ctx.fillText(metadata.name || 'مشروع كيتشن كاد', CANVAS_WIDTH - 60, 78);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Cairo", "Tajawal", "Segoe UI", sans-serif';
    ctx.fillText(`الملف الفني الهندسي الشامل وقوائم التصنيع — ${metadata.projectType === 'kitchen' ? 'مطابخ' : 'دريسينج وأثاث'}`, CANVAS_WIDTH - 60, 103);

    // Left Brand in English
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText('KITCHEN CAD PRO ENTERPRISE', 60, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`Sheet: ${sheetTitle}`, 60, 100);

    // 4. Bottom Title Block (Engineering Stamp)
    const stampY = CANVAS_HEIGHT - 95;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(30, stampY, CANVAS_WIDTH - 60, 65);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, stampY);
    ctx.lineTo(CANVAS_WIDTH - 30, stampY);
    ctx.stroke();

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px "Cairo", "Tajawal", sans-serif';
    ctx.fillText(`العميل: ${metadata.clientName || 'غير محدد'}`, CANVAS_WIDTH - 60, stampY + 28);
    ctx.fillText(`المصمم: ${metadata.designerName || 'استوديو كيتشن كاد'}`, CANVAS_WIDTH - 60, stampY + 54);

    ctx.fillText(`أبعاد الغرفة: ${toCm(room.width)} × ${toCm(room.length)} (ارتفاع: ${toCm(room.ceilingHeight)})`, CANVAS_WIDTH - 480, stampY + 28);
    ctx.fillText(`التاريخ: ${metadata.date || new Date().toISOString().split('T')[0]}`, CANVAS_WIDTH - 480, stampY + 54);

    ctx.fillText(`الخامة: ألواح ${manufacturing.boardThickness}مم / ${materials.frontFinish || 'أبيض مطفي'}`, CANVAS_WIDTH - 960, stampY + 28);
    ctx.fillText(`الوزرة: ${toCm(plinth.height)} / الرخام: ${materials.countertopMaterial || 'رخام'} (${countertop.thickness}مم)`, CANVAS_WIDTH - 960, stampY + 54);

    // Page Number
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillText(`PAGE ${pageNum} OF ${totalPages}`, 60, stampY + 40);
  };

  // Helper to draw an individual Cabinet Facade Illustration
  const drawCabinetFacade = (
    c: CabinetItem,
    boxX: number,
    boxY: number,
    boxW: number,
    boxH: number
  ) => {
    const isWall = c.category === 'wall';
    const isTall = c.category === 'tall';
    const isLoft = c.isCeilingUnit || c.flipUpDoor || c.type.includes('loft');
    const isFlap = c.flipUpDoor || c.doorHinge === 'top' || c.type.includes('lift-up') || c.type.includes('aventos');

    // 1. Cabinet Outer Box
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = isLoft ? '#d97706' : isTall ? '#312e81' : isWall ? '#0284c7' : '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // 2. Plinth if base or tall
    if (c.category === 'base' || isTall) {
      const plinthH = Math.max(12, boxH * 0.12);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(boxX, boxY + boxH - plinthH, boxW, plinthH);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY + boxH - plinthH, boxW, plinthH);
    }

    // 3. Countertop if base
    if (c.category === 'base') {
      const ctH = Math.max(8, boxH * 0.06);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(boxX - 4, boxY - ctH, boxW + 8, ctH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX - 4, boxY - ctH, boxW + 8, ctH);
    }

    // 4. Drawers or Doors Facade Drawing
    const usableH = c.category === 'base' || isTall ? boxH * 0.88 : boxH;

    if (c.drawerCount > 0 && !isFlap) {
      const drwH = usableH / c.drawerCount;
      for (let i = 0; i < c.drawerCount; i++) {
        const dy = boxY + i * drwH;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX + 4, dy + 4, boxW - 8, drwH - 8);

        // Handle
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(boxX + boxW / 2 - boxW * 0.2, dy + drwH / 2 - 2, boxW * 0.4, 4);
      }
    } else if (isFlap) {
      // Flap Door: Upward triangle swing symbol
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(boxX + 6, boxY + usableH - 6);
      ctx.lineTo(boxX + boxW / 2, boxY + 8);
      ctx.lineTo(boxX + boxW - 6, boxY + usableH - 6);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bottom Pull Handle
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(boxX + boxW * 0.25, boxY + usableH - 12, boxW * 0.5, 4);

      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 11px "Cairo", sans-serif';
      ctx.fillText('قلاب ⮝', boxX + boxW / 2, boxY + usableH / 2 + 10);
    } else if (c.doorCount === 1) {
      // Single Door Swing Triangle
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      if (c.doorHinge === 'left') {
        ctx.moveTo(boxX + 6, boxY + 6);
        ctx.lineTo(boxX + boxW - 6, boxY + usableH / 2);
        ctx.lineTo(boxX + 6, boxY + usableH - 6);
      } else {
        ctx.moveTo(boxX + boxW - 6, boxY + 6);
        ctx.lineTo(boxX + 6, boxY + usableH / 2);
        ctx.lineTo(boxX + boxW - 6, boxY + usableH - 6);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Handle
      ctx.fillStyle = '#0f172a';
      const handleX = c.doorHinge === 'left' ? boxX + boxW - 14 : boxX + 10;
      ctx.fillRect(handleX, boxY + usableH / 2 - 14, 4, 28);
    } else if (c.doorCount === 2) {
      // Double Door
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(boxX + boxW / 2, boxY);
      ctx.lineTo(boxX + boxW / 2, boxY + usableH);
      ctx.stroke();

      // Left & Right swing triangles
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      // Left door
      ctx.moveTo(boxX + 4, boxY + 4);
      ctx.lineTo(boxX + boxW / 2 - 4, boxY + usableH / 2);
      ctx.lineTo(boxX + 4, boxY + usableH - 4);
      // Right door
      ctx.moveTo(boxX + boxW - 4, boxY + 4);
      ctx.lineTo(boxX + boxW / 2 + 4, boxY + usableH / 2);
      ctx.lineTo(boxX + boxW - 4, boxY + usableH - 4);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dual Handles
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(boxX + boxW / 2 - 10, boxY + usableH / 2 - 14, 3, 28);
      ctx.fillRect(boxX + boxW / 2 + 7, boxY + usableH / 2 - 14, 3, 28);
    }

    // Glass Vitrine Diagonals
    if (c.hasGlassDoors || c.type === 'wall-glass-vitrine') {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(boxX + 8, boxY + 8);
      ctx.lineTo(boxX + boxW - 8, boxY + usableH - 8);
      ctx.moveTo(boxX + boxW - 8, boxY + 8);
      ctx.lineTo(boxX + 8, boxY + usableH - 8);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Sink Cutout Symbol
    if (c.hasSinkCutout) {
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(boxX + boxW * 0.2, boxY + usableH * 0.2, boxW * 0.6, usableH * 0.5);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(boxX + boxW * 0.2, boxY + usableH * 0.2, boxW * 0.6, usableH * 0.5);
    }

    // Appliance Cavity (Oven)
    if (c.hasApplianceCavity) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX + boxW * 0.1, boxY + usableH * 0.25, boxW * 0.8, usableH * 0.5);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(boxX + boxW * 0.1, boxY + usableH * 0.25, boxW * 0.8, usableH * 0.5);
    }
  };

  const TOTAL_PAGES = 5;

  // =========================================================================
  // PAGE 1: COVER & 3D RENDERING + SPECIFICATIONS
  // =========================================================================
  drawSheetFrame('01 / Project Overview & 3D Render', 1, TOTAL_PAGES);

  // 3D Perspective Box (Left Side)
  const renderBoxX = 60;
  const renderBoxY = 140;
  const renderBoxW = 1000;
  const renderBoxH = CANVAS_HEIGHT - 260;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(renderBoxX, renderBoxY, renderBoxW, renderBoxH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(renderBoxX, renderBoxY, renderBoxW, renderBoxH);

  if (loaded3DImg) {
    try {
      ctx.drawImage(loaded3DImg, renderBoxX + 10, renderBoxY + 10, renderBoxW - 20, renderBoxH - 20);
    } catch {
      // fallback
    }
  } else {
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.fillText('منظور ثلاثي الأبعاد للمشروع (3D Render)', renderBoxX + renderBoxW / 2, renderBoxY + renderBoxH / 2);
  }

  // Specifications Box (Right Side)
  const specBoxX = 1090;
  const specBoxY = 140;
  const specBoxW = CANVAS_WIDTH - specBoxX - 60;
  const specBoxH = CANVAS_HEIGHT - 260;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(specBoxX, specBoxY, specBoxW, specBoxH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(specBoxX, specBoxY, specBoxW, specBoxH);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(specBoxX, specBoxY, specBoxW, 50);
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Cairo", sans-serif';
  ctx.fillText('المواصفات الفنية وبيانات العقد', specBoxX + specBoxW - 20, specBoxY + 33);

  const specsList = [
    { label: 'اسم العميل:', val: metadata.clientName || 'غير محدد' },
    { label: 'المهندس / المصمم:', val: metadata.designerName || 'استوديو كيتشن كاد' },
    { label: 'أبعاد الفراغ الصافية:', val: `${toCm(room.width)} × ${toCm(room.length)} (ارتفاع: ${toCm(room.ceilingHeight)})` },
    { label: 'تشطيب الضلف الأمامية:', val: materials.frontFinish || 'أبيض مطفي' },
    { label: 'شاسيه العلب الداخلي:', val: `كونتر / MDF سماكة ${manufacturing.boardThickness || 18} مم` },
    { label: 'قشاط الحرف ABS:', val: `${manufacturing.edgeBandingFront || 2} مم ناعم حراري` },
    { label: 'سطح العمل (الرخام):', val: `${materials.countertopMaterial || 'رخام'} (${countertop.thickness || 40} مم)` },
    { label: 'ارتفاع الوزرة السفلية:', val: `${toCm(plinth.height || 100)}` },
    { label: 'إجمالي عدد الكبائن:', val: `${cabinets.length} كابينة تصنيعية` },
    { label: 'عدد الألواح التقديري:', val: `${totalBoardCount} لوح خام` },
  ];

  let specRowY = specBoxY + 85;
  specsList.forEach((s) => {
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px "Cairo", sans-serif';
    ctx.fillText(s.label, specBoxX + specBoxW - 20, specRowY);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px "Cairo", sans-serif';
    ctx.fillText(s.val, specBoxX + specBoxW - 240, specRowY);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(specBoxX + 20, specRowY + 12);
    ctx.lineTo(specBoxX + specBoxW - 20, specRowY + 12);
    ctx.stroke();

    specRowY += 46;
  });

  if (metadata.notes) {
    ctx.fillStyle = '#92400e';
    ctx.font = '14px "Cairo", sans-serif';
    ctx.fillText(`ملاحظات: ${metadata.notes}`, specBoxX + specBoxW - 20, specBoxY + specBoxH - 30);
  }

  doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);

  // =========================================================================
  // PAGE 2: 2D ARCHITECTURAL FLOOR PLAN WITH CENTIMETER DIMENSIONS
  // =========================================================================
  drawSheetFrame('02 / 2D Architectural Floor Plan (المسقط الأفقي)', 2, TOTAL_PAGES);

  const planBoxX = 160;
  const planBoxY = 180;
  const planBoxW = CANVAS_WIDTH - 320;
  const planBoxH = CANVAS_HEIGHT - 320;

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 16;
  ctx.strokeRect(planBoxX, planBoxY, planBoxW, planBoxH);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(planBoxX, planBoxY, planBoxW, planBoxH);

  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 22px "Cairo", sans-serif';
  ctx.fillText(`الجدار الخلفي أ — [ ${toCm(room.width)} ]`, planBoxX + planBoxW / 2, planBoxY - 25);
  ctx.fillText(`الجدار الأمامي ج — [ ${toCm(room.width)} ]`, planBoxX + planBoxW / 2, planBoxY + planBoxH + 40);

  ctx.save();
  ctx.translate(planBoxX + planBoxW + 40, planBoxY + planBoxH / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillText(`الجدار الأيمن ب — [ ${toCm(room.length)} ]`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(planBoxX - 40, planBoxY + planBoxH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`الجدار الأيسر د — [ ${toCm(room.length)} ]`, 0, 0);
  ctx.restore();

  cabinets.forEach((c) => {
    const leftPx = planBoxX + (c.x / room.width) * planBoxW;
    const topPx = planBoxY + (c.y / room.length) * planBoxH;
    const widthPx = Math.max(30, (c.width / room.width) * planBoxW);
    const depthPx = Math.max(30, (c.depth / room.length) * planBoxH);

    const isWall = c.category === 'wall';
    const isTall = c.category === 'tall';
    const isLoft = c.isCeilingUnit || c.flipUpDoor || c.type.includes('loft');

    ctx.fillStyle = isLoft ? '#78350f' : isTall ? '#312e81' : isWall ? '#0369a1' : '#1e293b';
    ctx.fillRect(leftPx, topPx, widthPx, depthPx);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(leftPx, topPx, widthPx, depthPx);

    ctx.direction = 'ltr';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(c.id, leftPx + widthPx / 2, topPx + depthPx / 2 - 4);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(toCm(c.width), leftPx + widthPx / 2, topPx + depthPx / 2 + 14);
  });

  doc.addPage('a4', 'landscape');
  doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);

  // =========================================================================
  // PAGE 3: SIDE-BY-SIDE WALL ELEVATIONS (واجهات الجدران وترتيب الوحدات)
  // =========================================================================
  drawSheetFrame('03 / Wall Elevations & Side-by-Side Sequence (واجهات الجدران وترتيب الوحدات)', 3, TOTAL_PAGES);

  // Split into Wall A (Top Half) and Wall B (Bottom Half)
  const wallElevations = [
    {
      id: 'wall-a',
      name: 'الجدار أ (الخلفي)',
      length: room.width,
      cabinets: cabinets.filter((c) => c.wallId === 'wall-a' || c.rotation === 0 || c.y <= 100),
      startY: 140,
      height: 480,
    },
    {
      id: 'wall-b',
      name: 'الجدار ب (الأيمن)',
      length: room.length,
      cabinets: cabinets.filter((c) => c.wallId === 'wall-b' || c.rotation === 90 || c.x >= room.width - 700),
      startY: 680,
      height: 480,
    },
  ];

  wallElevations.forEach((wall) => {
    const eBoxX = 60;
    const eBoxY = wall.startY;
    const eBoxW = CANVAS_WIDTH - 120;
    const eBoxH = wall.height;

    // Header strip for this wall
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(eBoxX, eBoxY, eBoxW, 36);
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Cairo", sans-serif';
    ctx.fillText(`${wall.name} — الطول الإجمالي: ${toCm(wall.length)} (ارتفاع السقف: ${toCm(room.ceilingHeight)})`, eBoxX + eBoxW - 16, eBoxY + 24);

    // Wall Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(eBoxX, eBoxY + 36, eBoxW, eBoxH - 36);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(eBoxX, eBoxY + 36, eBoxW, eBoxH - 36);

    // Floor Line
    const floorY = eBoxY + eBoxH - 30;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(eBoxX, floorY);
    ctx.lineTo(eBoxX + eBoxW, floorY);
    ctx.stroke();

    // Scale Factor: Map wall.length (mm) to available pixel width
    const scaleFactor = (eBoxW - 80) / wall.length;
    const scaleH = (eBoxH - 120) / room.ceilingHeight;

    // Draw Cabinets arranged side-by-side on this wall
    wall.cabinets.forEach((c) => {
      // Relative offset along wall
      const relX = wall.id === 'wall-a' ? c.x : c.y;
      const cabPxX = eBoxX + 40 + relX * scaleFactor;
      const cabPxW = Math.max(30, c.width * scaleFactor);
      const cabPxH = Math.max(30, c.height * scaleH);
      const cabPxY = floorY - (c.z + c.height) * scaleH;

      // Draw Facade for this unit
      drawCabinetFacade(c, cabPxX, cabPxY, cabPxW, cabPxH);

      // Dimension Label above cabinet
      ctx.direction = 'ltr';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(c.id, cabPxX + cabPxW / 2, cabPxY - 8);

      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(toCm(c.width), cabPxX + cabPxW / 2, cabPxY + cabPxH + 16);
    });
  });

  doc.addPage('a4', 'landscape');
  doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);

  // =========================================================================
  // PAGE 4: INDIVIDUAL CABINET WORKSHOP CARDS (صور ومقاسات كل كابينة منفردة)
  // =========================================================================
  drawSheetFrame('04 / Individual Cabinet Workshop Cards (صور ومقاسات كل كابينة منفردة)', 4, TOTAL_PAGES);

  const cardW = 420;
  const cardH = 260;
  const gapX = 30;
  const gapY = 30;
  const startX = 60;
  const startY = 150;

  const displayCabinets = cabinets.slice(0, 8);

  displayCabinets.forEach((c, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    const isWall = c.category === 'wall';
    const isTall = c.category === 'tall';
    const isLoft = c.isCeilingUnit || c.flipUpDoor || c.type.includes('loft');
    const headerBg = isLoft ? '#d97706' : isTall ? '#4338ca' : isWall ? '#0284c7' : '#0f172a';

    // Card Box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, cardW, cardH);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cardW, cardH);

    // Card Header
    ctx.fillStyle = headerBg;
    ctx.fillRect(x, y, cardW, 38);

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Cairo", sans-serif';
    ctx.fillText(`${c.id} - ${c.name}`, x + cardW - 12, y + 25);

    // Mini Live 2D/3D Facade Drawing of this specific cabinet
    const drawBoxW = 90;
    const drawBoxH = 130;
    const drawBoxX = x + cardW - drawBoxW - 14;
    const drawBoxY = y + 50;
    drawCabinetFacade(c, drawBoxX, drawBoxY, drawBoxW, drawBoxH);

    // Dimensions in CM (Center Column)
    const dimX = x + cardW - drawBoxW - 30;
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.font = 'bold 12px "Cairo", sans-serif';

    const dims = [
      { l: 'العرض (W):', v: toCm(c.width) },
      { l: 'الارتفاع (H):', v: toCm(c.height) },
      { l: 'العمق (D):', v: toCm(c.depth) },
      { l: 'المنسوب (Z):', v: toCm(c.z) },
    ];

    let dY = y + 68;
    dims.forEach((d) => {
      ctx.fillStyle = '#64748b';
      ctx.fillText(d.l, dimX, dY);
      ctx.fillStyle = '#2563eb';
      ctx.fillText(d.v, dimX - 80, dY);
      dY += 24;
    });

    // Specifications List
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#334155';
    ctx.font = '12.5px "Cairo", sans-serif';
    let lineY = y + 195;

    ctx.fillText(`• الضلف: ${c.doorCount} ${c.flipUpDoor ? '(قلاب باكم هيدروليك ⮝)' : `(مفصلات ${c.doorHinge || 'عادية'})`}`, x + cardW - 14, lineY);
    lineY += 22;

    ctx.fillText(`• الأدراج: ${c.drawerCount > 0 ? `${c.drawerCount} أدراج سحاب تاندوم` : 'بدون أدراج'}`, x + cardW - 14, lineY);
    lineY += 22;

    ctx.fillText(`• الرفوف: ${c.shelfCount} رف داخلي`, x + cardW - 14, lineY);
  });

  doc.addPage('a4', 'landscape');
  doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);

  // =========================================================================
  // PAGE 5: CUTTING LIST & QUOTATION SUMMARY (جدول التقطيع والتسعير)
  // =========================================================================
  drawSheetFrame('05 / Cutting List & Quotation Summary (جدول التقطيع والتسعير)', 5, TOTAL_PAGES);

  // Table Box (Left)
  const tblX = 60;
  const tblY = 140;
  const tblW = 1180;
  const tblH = CANVAS_HEIGHT - 260;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(tblX, tblY, tblW, tblH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(tblX, tblY, tblW, tblH);

  // Table Header Row
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(tblX, tblY, tblW, 45);

  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Cairo", sans-serif';

  ctx.fillText('الكود', tblX + tblW - 30, tblY + 30);
  ctx.fillText('اسم القطعة', tblX + tblW - 160, tblY + 30);
  ctx.fillText('العدد', tblX + tblW - 460, tblY + 30);
  ctx.fillText('الطول (سم)', tblX + tblW - 600, tblY + 30);
  ctx.fillText('العرض (سم)', tblX + tblW - 760, tblY + 30);
  ctx.fillText('السمك', tblX + tblW - 920, tblY + 30);
  ctx.fillText('القشاط ABS', tblX + tblW - 1060, tblY + 30);

  // Table Data Rows
  const displayPanels = allPanels.slice(0, 16);
  let rowY = tblY + 45;

  displayPanels.forEach((p, i) => {
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(tblX, rowY, tblW, 36);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.strokeRect(tblX, rowY, tblW, 36);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px "Cairo", sans-serif';
    ctx.fillText(p.cabinetId, tblX + tblW - 30, rowY + 24);

    ctx.fillStyle = '#334155';
    ctx.font = '14px "Cairo", sans-serif';
    ctx.fillText(p.partName, tblX + tblW - 160, rowY + 24);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(String(p.quantity), tblX + tblW - 450, rowY + 24);

    ctx.fillStyle = '#0f172a';
    ctx.fillText(toCm(p.length), tblX + tblW - 600, rowY + 24);
    ctx.fillText(toCm(p.width), tblX + tblW - 760, rowY + 24);

    ctx.fillStyle = '#64748b';
    ctx.fillText(`${p.thickness} مم`, tblX + tblW - 910, rowY + 24);

    ctx.fillStyle = '#0f172a';
    ctx.fillText(p.edgeBanding.top || p.edgeBanding.bottom ? 'نعم (2مم)' : '-', tblX + tblW - 1050, rowY + 24);

    rowY += 36;
  });

  // Quotation & Hardware Summary Card (Right Side)
  const qBoxX = 1270;
  const qBoxY = 140;
  const qBoxW = CANVAS_WIDTH - qBoxX - 60;
  const qBoxH = CANVAS_HEIGHT - 260;

  ctx.fillStyle = '#eff6ff';
  ctx.fillRect(qBoxX, qBoxY, qBoxW, qBoxH);
  ctx.strokeStyle = '#bfdbfe';
  ctx.lineWidth = 2;
  ctx.strokeRect(qBoxX, qBoxY, qBoxW, qBoxH);

  // Quotation Header
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(qBoxX, qBoxY, qBoxW, 50);
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Cairo", sans-serif';
  ctx.fillText('عرض السعر التقديري والمفصلات', qBoxX + qBoxW - 20, qBoxY + 33);

  // Hardware Items
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 16px "Cairo", sans-serif';
  ctx.fillText('حصر الإكسسوارات والمفصلات:', qBoxX + qBoxW - 20, qBoxY + 80);

  ctx.font = '14px "Cairo", sans-serif';
  ctx.fillStyle = '#334155';
  let hwY = qBoxY + 110;
  aggregatedHardware.slice(0, 5).forEach((h) => {
    ctx.fillText(`• ${h.name}: ${h.quantity} ${h.unit}`, qBoxX + qBoxW - 20, hwY);
    hwY += 28;
  });

  // Pricing Totals
  const baseMeters = (cabinets.filter((c) => c.category === 'base').reduce((acc, c) => acc + c.width, 0) / 1000).toFixed(2);
  const wallMeters = (cabinets.filter((c) => c.category === 'wall').reduce((acc, c) => acc + c.width, 0) / 1000).toFixed(2);
  const priceBase = pricing.pricePerLinearMeterBase || 3500;
  const priceWall = pricing.pricePerLinearMeterWall || 2800;
  const totalAmount = Number(baseMeters) * priceBase + Number(wallMeters) * priceWall;

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 16px "Cairo", sans-serif';
  ctx.fillText('حساب الأمتار والتكلفة:', qBoxX + qBoxW - 20, hwY + 30);

  ctx.font = '14px "Cairo", sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText(`• أمتار سفلي: ${baseMeters} م × ${priceBase} ${pricing.currency || 'ج.م'}`, qBoxX + qBoxW - 20, hwY + 60);
  ctx.fillText(`• أمتار علوي: ${wallMeters} م × ${priceWall} ${pricing.currency || 'ج.م'}`, qBoxX + qBoxW - 20, hwY + 90);

  // Total Pill Box
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(qBoxX + 20, qBoxY + qBoxH - 80, qBoxW - 40, 60);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Cairo", sans-serif';
  ctx.fillText(`الإجمالي التقديري: ${totalAmount.toLocaleString()} ${pricing.currency || 'ج.م'}`, qBoxX + qBoxW - 40, qBoxY + qBoxH - 42);

  // Add Page 5
  doc.addPage('a4', 'landscape');
  doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);

  // Save the PDF file
  const filename = `${(metadata.name || 'مشروع').replace(/\s+/g, '_')}_ملف_التصنيع_الشامل.pdf`;
  doc.save(filename);
}
