import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProjectData } from '../types';
import { generateFullProjectBOM } from './manufacturing';

export interface PDFExportOptions {
  project: ProjectData;
  render3DImage?: string;
}

/**
 * Bulletproof Multi-Page Arabic Technical PDF Exporter with
 * 3D Render, 2D Floor Plan in Centimeters, Individual Cabinet Cut Sheets, and Cutting Lists.
 */
export async function exportTechnicalPDF({
  project,
  render3DImage,
}: PDFExportOptions): Promise<void> {
  const { metadata, room, cabinets, appliances, manufacturing, materials, pricing, plinth, countertop } = project;
  const { allPanels, aggregatedHardware, sheetEstimates } = generateFullProjectBOM(cabinets, manufacturing);
  const totalBoardCount = sheetEstimates.sheetsNeeded;

  // Helper to format mm to cm
  const toCm = (mm: number) => ((mm || 0) / 10).toFixed(1) + ' سم';

  // Create temporary container for high-res DOM rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '1122px';
  container.style.height = '793px';
  container.style.zIndex = '-9999';
  container.style.opacity = '1';
  container.style.pointerEvents = 'none';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = "'Cairo', 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.direction = 'rtl';
  container.style.color = '#0f172a';
  document.body.appendChild(container);

  // Initialize jsPDF (A4 Landscape 297x210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pagesHtml: string[] = [];

  // =========================================================================
  // PAGE 1: COVER, 3D RENDER & TECHNICAL SPECIFICATIONS
  // =========================================================================
  pagesHtml.push(`
    <div style="width: 1122px; height: 793px; padding: 32px; box-sizing: border-box; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; font-family: inherit; direction: rtl;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 14px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0;">${metadata.name || 'مشروع جديد'}</h1>
          <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">الملف الفني الهندسي الشامل وقوائم التصنيع — ${metadata.projectType === 'kitchen' ? 'تصميم وتصنيع المطابخ' : 'تصميم وتصنيع الأثاث والدريسينج'}</p>
        </div>
        <div style="text-align: left; font-size: 11px; color: #475569;">
          <div style="background: #eff6ff; color: #1d4ed8; font-weight: bold; padding: 4px 12px; border-radius: 8px; margin-bottom: 4px; display: inline-block;">KITCHEN CAD PRO</div>
          <div>التاريخ: ${metadata.date || new Date().toISOString().split('T')[0]}</div>
        </div>
      </div>

      <!-- Main Content: 3D Render + Specs Card -->
      <div style="display: flex; gap: 20px; margin-top: 14px; flex: 1;">
        <!-- 3D Perspective Image -->
        <div style="flex: 1.3; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column;">
          <div style="background: #0f172a; color: #ffffff; padding: 8px 14px; font-size: 11px; font-weight: bold; display: flex; justify-content: space-between;">
            <span>المنظور ثلاثي الأبعاد (3D Visualization)</span>
            <span style="color: #94a3b8;">معاينة شاملة</span>
          </div>
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px; background: #f1f5f9;">
            ${
              render3DImage && render3DImage.startsWith('data:image')
                ? `<img src="${render3DImage}" style="max-width: 100%; max-height: 380px; object-fit: contain; border-radius: 6px;" />`
                : `<div style="text-align: center; color: #64748b; font-size: 13px; font-weight: bold;">منظور ثلاثي الأبعاد للمشروع</div>`
            }
          </div>
        </div>

        <!-- Technical Specifications Table Card -->
        <div style="flex: 1; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-size: 13px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px;">
              المواصفات الفنية وبيانات العقد
            </h3>
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">اسم العميل:</td><td style="padding: 5px 0; font-weight: bold; color: #0f172a;">${metadata.clientName || 'غير محدد'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">المهندس / المصمم:</td><td style="padding: 5px 0; font-weight: bold; color: #0f172a;">${metadata.designerName || 'استوديو كيتشن كاد'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">أبعاد الغرفة:</td><td style="padding: 5px 0; font-weight: bold; color: #2563eb;">${toCm(room.width)} × ${toCm(room.length)} (ارتفاع: ${toCm(room.ceilingHeight)})</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">تشطيب الضلف:</td><td style="padding: 5px 0; font-weight: bold;">${materials.frontFinish || 'أبيض مطفي'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">شاسيه العلب:</td><td style="padding: 5px 0; font-weight: bold;">كونتر / MDF سماكة ${manufacturing.boardThickness || 18} مم</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">قشاط الحرف ABS:</td><td style="padding: 5px 0; font-weight: bold;">${manufacturing.edgeBandingFront || 2} مم ناعم حراري</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">سطح العمل:</td><td style="padding: 5px 0; font-weight: bold;">${materials.countertopMaterial || 'رخام / كوارتز'} (سماكة: ${countertop.thickness || 40} مم)</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 5px 0; color: #64748b; font-weight: bold;">ارتفاع الوزرة:</td><td style="padding: 5px 0; font-weight: bold;">${toCm(plinth.height || 100)}</td></tr>
              <tr><td style="padding: 5px 0; color: #64748b; font-weight: bold;">عدد الكبائن:</td><td style="padding: 5px 0; font-weight: 900; color: #16a34a;">${cabinets.length} وحدة تصنيعية</td></tr>
            </table>
          </div>

          ${
            metadata.notes
              ? `<div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 8px; font-size: 10px; color: #92400e; margin-top: 8px;">
                  <strong>ملاحظات:</strong> ${metadata.notes}
                </div>`
              : ''
          }
        </div>
      </div>

      <!-- Footer Stamp -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 8px; font-size: 10px; color: #64748b;">
        <span>نظام التصنيع: ${manufacturing.systemType || 'Wood Melamine'} — خلوص التجميع: ${manufacturing.doorReveal || 2} مم</span>
        <span style="font-weight: bold; color: #0f172a;">الصفحة 1 من 4</span>
      </div>
    </div>
  `);

  // =========================================================================
  // PAGE 2: 2D ARCHITECTURAL TOP PLAN WITH CM DIMENSIONS
  // =========================================================================
  pagesHtml.push(`
    <div style="width: 1122px; height: 793px; padding: 32px; box-sizing: border-box; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; font-family: inherit; direction: rtl;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 0;">المسقط الأفقي التنفيذي 2D (Floor Plan)</h2>
          <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">جميع المقاسات والأبعاد بالرسم بالسنتيمتر (cm) — توزيع الكبائن والفتحات المعمارية</p>
        </div>
        <div style="background: #f1f5f9; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; color: #334155;">
          أبعاد الغرفة: ${toCm(room.width)} × ${toCm(room.length)}
        </div>
      </div>

      <!-- 2D Plan Graphic Area -->
      <div style="flex: 1; margin: 14px 0; border: 1.5px solid #cbd5e1; border-radius: 10px; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
        <div style="width: 88%; height: 88%; position: relative; border: 6px solid #64748b; background: #ffffff; border-radius: 4px;">
          <!-- Wall Labels -->
          <div style="position: absolute; top: -24px; left: 50%; transform: translateX(-50%); font-weight: 900; font-size: 11px; color: #1e293b; background: #e2e8f0; padding: 1px 10px; border-radius: 4px;">الجدار الخلفي أ (${toCm(room.width)})</div>
          <div style="position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-weight: 900; font-size: 11px; color: #1e293b; background: #e2e8f0; padding: 1px 10px; border-radius: 4px;">الجدار الأمامي ج (${toCm(room.width)})</div>
          <div style="position: absolute; right: -24px; top: 50%; transform: translateY(-50%) rotate(90deg); font-weight: 900; font-size: 11px; color: #1e293b; background: #e2e8f0; padding: 1px 10px; border-radius: 4px;">الجدار الأيمن ب (${toCm(room.length)})</div>
          <div style="position: absolute; left: -24px; top: 50%; transform: translateY(-50%) rotate(-90deg); font-weight: 900; font-size: 11px; color: #1e293b; background: #e2e8f0; padding: 1px 10px; border-radius: 4px;">الجدار الأيسر د (${toCm(room.length)})</div>

          <!-- Cabinets placed on 2D map -->
          ${cabinets
            .map((c) => {
              const leftPercent = (c.x / room.width) * 100;
              const topPercent = (c.y / room.length) * 100;
              const widthPercent = (c.width / room.width) * 100;
              const depthPercent = (c.depth / room.length) * 100;
              const isWallUnit = c.category === 'wall';
              const isTall = c.category === 'tall';
              const bg = isTall ? '#312e81' : isWallUnit ? '#0369a1' : '#1e293b';

              return `
                <div style="position: absolute; left: ${Math.max(0, Math.min(leftPercent, 95))}%; top: ${Math.max(0, Math.min(topPercent, 95))}%; width: ${Math.min(widthPercent, 100)}%; height: ${Math.min(depthPercent, 100)}%; background: ${bg}; color: #ffffff; border: 1px solid #ffffff; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; border-radius: 2px;">
                  <span>${c.id}</span>
                  <span style="font-size: 7.5px; opacity: 0.85;">${toCm(c.width)}</span>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 8px; font-size: 10px; color: #64748b;">
        <span>المقاسات المعروضة على المسقط هي المقاسات الإجمالية الشاملة لسماكات الألواح والرخام</span>
        <span style="font-weight: bold; color: #0f172a;">الصفحة 2 من 4</span>
      </div>
    </div>
  `);

  // =========================================================================
  // PAGE 3: DETAILED CABINET WORKSHOP CUT SHEETS (تفصيلة كل كابينة)
  // =========================================================================
  const cabinetCardsHtml = cabinets
    .slice(0, 8)
    .map((c) => {
      const isWall = c.category === 'wall';
      const isTall = c.category === 'tall';
      const isLoft = c.isCeilingUnit || c.flipUpDoor || c.type.includes('loft');
      const badgeColor = isLoft ? '#d97706' : isTall ? '#4338ca' : isWall ? '#0284c7' : '#0f172a';

      return `
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
          <!-- Card Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
            <div style="font-weight: 900; font-size: 12px; color: #0f172a;">${c.id} - ${c.name}</div>
            <span style="background: ${badgeColor}; color: #ffffff; font-size: 8.5px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">${isLoft ? 'سقفي قلاب' : c.category}</span>
          </div>

          <!-- Dimension Badges in CM -->
          <div style="display: flex; gap: 4px; margin: 6px 0; background: #f8fafc; padding: 4px; border-radius: 6px; font-size: 9.5px; font-weight: bold; text-align: center;">
            <div style="flex: 1;"><span style="color: #64748b; display: block; font-size: 7.5px;">العرض</span><span style="color: #2563eb;">${toCm(c.width)}</span></div>
            <div style="flex: 1;"><span style="color: #64748b; display: block; font-size: 7.5px;">الارتفاع</span><span style="color: #2563eb;">${toCm(c.height)}</span></div>
            <div style="flex: 1;"><span style="color: #64748b; display: block; font-size: 7.5px;">العمق</span><span style="color: #2563eb;">${toCm(c.depth)}</span></div>
            <div style="flex: 1;"><span style="color: #64748b; display: block; font-size: 7.5px;">المنسوب</span><span style="color: #16a34a;">${toCm(c.z)}</span></div>
          </div>

          <!-- Specifications list -->
          <div style="font-size: 9.5px; color: #475569; line-height: 1.5;">
            <div>• <strong>الضلف:</strong> ${c.doorCount} ضلفة ${c.flipUpDoor ? '(قلاب هيدروليك ⮝)' : `(مفصلات ${c.doorHinge || 'عادية'})`}</div>
            <div>• <strong>الأدراج:</strong> ${c.drawerCount > 0 ? `${c.drawerCount} أدراج سحاب تاندوم` : 'بدون أدراج'}</div>
            <div>• <strong>الرفوف:</strong> ${c.shelfCount} رف داخلي</div>
            ${c.hasSinkCutout ? `<div style="color: #0284c7; font-weight: bold;">• تفريغ حوض وعزل رطوبة</div>` : ''}
            ${c.hasApplianceCavity ? `<div style="color: #ea580c; font-weight: bold;">• تجويف فرن/ميكروويف</div>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  pagesHtml.push(`
    <div style="width: 1122px; height: 793px; padding: 32px; box-sizing: border-box; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; font-family: inherit; direction: rtl;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 0;">بطاقات وتفاصيل كبائن المشروع (Cabinet Workshop Cut Sheets)</h2>
          <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">المقاسات الصافية بالسنتيمتر (cm) والتجهيزات الداخلية لكل كابينة على حدة للنجار والورشة</p>
        </div>
        <div style="background: #f1f5f9; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; color: #334155;">
          إجمالي الكبائن: ${cabinets.length}
        </div>
      </div>

      <!-- Grid of Cabinet Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 12px 0; flex: 1;">
        ${cabinetCardsHtml}
      </div>

      <!-- Footer Stamp -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 8px; font-size: 10px; color: #64748b;">
        <span>جميع المقاسات شاملة خلوصات فتح الضلف والأدراج 2 مم</span>
        <span style="font-weight: bold; color: #0f172a;">الصفحة 3 من 4</span>
      </div>
    </div>
  `);

  // =========================================================================
  // PAGE 4: CUTTING LIST & QUOTATION SUMMARY (جدول التقطيع والتسعير)
  // =========================================================================
  const panelsRowsHtml = allPanels
    .slice(0, 12)
    .map(
      (p, i) => `
      <tr style="border-bottom: 1px solid #f1f5f9; ${i % 2 === 0 ? 'background: #ffffff;' : 'background: #f8fafc;'}">
        <td style="padding: 5px 6px; font-weight: bold; color: #0f172a;">${p.cabinetId}</td>
        <td style="padding: 5px 6px; color: #334155;">${p.partName}</td>
        <td style="padding: 5px 6px; text-align: center; font-weight: 900; color: #2563eb;">${p.quantity}</td>
        <td style="padding: 5px 6px; text-align: center; font-weight: bold;">${toCm(p.length)}</td>
        <td style="padding: 5px 6px; text-align: center; font-weight: bold;">${toCm(p.width)}</td>
        <td style="padding: 5px 6px; text-align: center; color: #64748b;">${p.thickness} مم</td>
        <td style="padding: 5px 6px; text-align: center; font-size: 8.5px;">${p.edgeBanding.top || p.edgeBanding.bottom ? 'نعم (2مم)' : '-'}</td>
      </tr>
    `
    )
    .join('');

  pagesHtml.push(`
    <div style="width: 1122px; height: 793px; padding: 32px; box-sizing: border-box; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; font-family: inherit; direction: rtl;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 0;">جدول تقطيع الألواح وحصر التكاليف (Cutting List & Quotation)</h2>
          <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">قائمة أبعاد القطع للورشة وماكينات المنشار + ملخص التكلفة التقديرية للعميل</p>
        </div>
        <div style="background: #ecfdf5; color: #047857; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: bold;">
          عدد الألواح التقديري: ${totalBoardCount} لوح
        </div>
      </div>

      <!-- Split View: Table of Cutting Panels + Pricing Summary Card -->
      <div style="display: flex; gap: 16px; margin: 12px 0; flex: 1;">
        <!-- Cutting List Table -->
        <div style="flex: 1.6; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: #0f172a; color: #ffffff; font-weight: bold; text-align: right;">
                <th style="padding: 6px;">الكود</th>
                <th style="padding: 6px;">اسم القطعة</th>
                <th style="padding: 6px; text-align: center;">العدد</th>
                <th style="padding: 6px; text-align: center;">الطول</th>
                <th style="padding: 6px; text-align: center;">العرض</th>
                <th style="padding: 6px; text-align: center;">السمك</th>
                <th style="padding: 6px; text-align: center;">القشاط</th>
              </tr>
            </thead>
            <tbody>
              ${panelsRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- Right: Pricing & Hardware Summary -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
          <!-- Hardware Card -->
          <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px;">
            <h4 style="font-size: 11px; font-weight: 800; color: #1e293b; margin: 0 0 6px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
              حصر الإكسسوارات والمفصلات
            </h4>
            <div style="font-size: 10px; color: #334155; line-height: 1.6;">
              ${aggregatedHardware
                .slice(0, 5)
                .map((h) => `<div>• <strong>${h.name}:</strong> ${h.quantity} ${h.unit}</div>`)
                .join('')}
            </div>
          </div>

          <!-- Quotation Card -->
          <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h4 style="font-size: 12px; font-weight: 900; color: #1d4ed8; margin: 0 0 8px 0; border-bottom: 1px solid #bfdbfe; padding-bottom: 4px;">
                عرض السعر التقديري للمشروع
              </h4>
              <div style="font-size: 10px; color: #1e3a8a; line-height: 1.6;">
                <div style="display: flex; justify-content: space-between;"><span>أمتار الوحدات السفلية:</span><strong>${(cabinets.filter((c) => c.category === 'base').reduce((acc, c) => acc + c.width, 0) / 1000).toFixed(2)} متر</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>أمتار الوحدات العلوية والسقفية:</span><strong>${(cabinets.filter((c) => c.category === 'wall').reduce((acc, c) => acc + c.width, 0) / 1000).toFixed(2)} متر</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>سعر المتر المعتمد:</span><strong>${pricing.pricePerLinearMeterBase || 3500} ${pricing.currency || 'ج.م'}</strong></div>
              </div>
            </div>

            <div style="background: #1d4ed8; color: #ffffff; border-radius: 6px; padding: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; font-weight: bold;">الإجمالي الشامل (تقديري):</span>
              <span style="font-size: 14px; font-weight: 900;">${(
                (cabinets.filter((c) => c.category === 'base').reduce((acc, c) => acc + c.width, 0) / 1000) * (pricing.pricePerLinearMeterBase || 3500) +
                (cabinets.filter((c) => c.category === 'wall').reduce((acc, c) => acc + c.width, 0) / 1000) * (pricing.pricePerLinearMeterWall || 2800)
              ).toLocaleString()} ${pricing.currency || 'ج.م'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Stamp -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 8px; font-size: 10px; color: #64748b;">
        <span>تم استخراج هذا الملف الهندسي آلياً بواسطة منصة KitchenCAD Pro Enterprise</span>
        <span style="font-weight: bold; color: #0f172a;">الصفحة 4 من 4</span>
      </div>
    </div>
  `);

  try {
    // Render each HTML page to Canvas and add to jsPDF
    for (let i = 0; i < pagesHtml.length; i++) {
      container.innerHTML = pagesHtml[i];

      // Allow DOM repaint
      await new Promise((resolve) => setTimeout(resolve, 50));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 1122,
        height: 793,
        windowWidth: 1122,
        windowHeight: 793,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        doc.addPage('a4', 'landscape');
      }

      doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);
    }

    // Save the PDF
    const filename = `${(metadata.name || 'مشروع').replace(/\s+/g, '_')}_ملف_التصنيع_الشامل.pdf`;
    doc.save(filename);
  } finally {
    // Always cleanup container from DOM
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
