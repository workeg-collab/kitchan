import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProjectData } from '../types';
import { generateFullProjectBOM } from './manufacturing';
import { formatDimension } from './unitConversion';

export interface PDFExportOptions {
  project: ProjectData;
  render3DImage?: string;
  plan2DImage?: string;
  elevationImages?: { wallId: string; wallName: string; imageData: string }[];
}

export async function exportTechnicalPDF({
  project,
  render3DImage,
  plan2DImage,
  elevationImages = [],
}: PDFExportOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4', // 297 x 210 mm
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;

  const { metadata, room, cabinets, appliances, manufacturing } = project;
  const unit = metadata.unit;

  // Helper for Title Block Border
  function drawTitleBlock(pageTitle: string, pageNum: number, totalPages: number) {
    // Outer CAD border
    doc.setDrawColor(30, 41, 59); // slate-800
    doc.setLineWidth(0.6);
    doc.rect(margin, margin, contentWidth, pageHeight - 2 * margin);

    // Inner subtle border
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.2);
    doc.rect(margin + 1.5, margin + 1.5, contentWidth - 3, pageHeight - 2 * margin - 3);

    // Header strip
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, margin, contentWidth, 14, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`KITCHEN CAD PRO — MANUFACTURING & TECHNICAL PACKAGE`, margin + 5, margin + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Sheet: ${pageTitle.toUpperCase()}`, margin + contentWidth - 85, margin + 9);

    // Bottom CAD Title Block (Engineering stamp)
    const stampHeight = 15;
    const stampY = pageHeight - margin - stampHeight;

    doc.setFillColor(248, 250, 252);
    doc.rect(margin, stampY, contentWidth, stampHeight, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.line(margin, stampY, margin + contentWidth, stampY);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`PROJECT: ${metadata.name}`, margin + 4, stampY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`CLIENT: ${metadata.clientName || 'N/A'}`, margin + 4, stampY + 11);

    doc.text(`DESIGNER: ${metadata.designerName || 'CAD Studio'}`, margin + 80, stampY + 5);
    doc.text(`DATE: ${metadata.date || new Date().toISOString().split('T')[0]}`, margin + 80, stampY + 11);

    doc.text(`ROOM: ${formatDimension(room.width, unit)} x ${formatDimension(room.length, unit)} (H: ${formatDimension(room.ceilingHeight, unit)})`, margin + 150, stampY + 5);
    doc.text(`MATERIAL: ${manufacturing.boardThickness}mm Board / ${project.materials.frontFinish}`, margin + 150, stampY + 11);

    doc.setFont('helvetica', 'bold');
    doc.text(`PAGE ${pageNum} OF ${totalPages}`, margin + contentWidth - 28, stampY + 8);
  }

  // --- PAGE 1: PROJECT COVER & 3D RENDERING ---
  drawTitleBlock('01 / Project Summary & 3D Overview', 1, 5 + elevationImages.length);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(metadata.name, margin + 8, margin + 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Technical Kitchen Manufacturing Package & Architectural Drawings`, margin + 8, margin + 32);

  // Left Info Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 8, margin + 38, 85, 125, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('PROJECT SPECIFICATIONS', margin + 12, margin + 46);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const specs = [
    `Room Dimensions: ${formatDimension(room.width, unit)} x ${formatDimension(room.length, unit)}`,
    `Ceiling Height: ${formatDimension(room.ceilingHeight, unit)}`,
    `Total Cabinets: ${cabinets.length} units`,
    `Total Appliances: ${appliances.length} units`,
    `Front Finish: ${project.materials.frontFinish}`,
    `Carcass Material: Melamine ${manufacturing.boardThickness}mm`,
    `Countertop: ${project.materials.countertopMaterial} (${project.countertop.thickness}mm)`,
    `Plinth Height: ${project.plinth.height}mm (Setback: ${project.plinth.setback}mm)`,
    `Backsplash: ${project.backsplash.height}mm high`,
    `Board Thickness: ${manufacturing.boardThickness}mm`,
    `Back Recess: ${manufacturing.backPanelRecess}mm`,
    `Door Reveal Gap: ${manufacturing.doorReveal}mm`,
  ];

  let yOffset = margin + 54;
  specs.forEach(s => {
    doc.text(`• ${s}`, margin + 12, yOffset);
    yOffset += 7;
  });

  if (metadata.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Notes / Instructions:', margin + 12, yOffset + 4);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(metadata.notes, 77);
    doc.text(splitNotes, margin + 12, yOffset + 10);
  }

  // Right Side: 3D Render Image or Placeholder
  if (render3DImage) {
    try {
      doc.addImage(render3DImage, 'PNG', margin + 100, margin + 38, 165, 125);
    } catch {
      // Draw fallback box
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin + 100, margin + 38, 165, 125);
      doc.text('3D Render View', margin + 170, margin + 100);
    }
  } else {
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin + 100, margin + 38, 165, 125, 2, 2, 'FD');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('3D PERSPECTIVE VISUALIZATION', margin + 145, margin + 100);
  }

  // --- PAGE 2: 2D FLOOR PLAN ---
  doc.addPage();
  drawTitleBlock('02 / Dimensioned 2D Floor Plan', 2, 5 + elevationImages.length);

  if (plan2DImage) {
    try {
      doc.addImage(plan2DImage, 'PNG', margin + 8, margin + 20, contentWidth - 16, 155);
    } catch {
      doc.text('Floor Plan Diagram', margin + 120, margin + 100);
    }
  } else {
    doc.setFillColor(248, 250, 252);
    doc.rect(margin + 8, margin + 20, contentWidth - 16, 155, 'F');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text('Floor Plan Top View with Architectural Dimension Strings', margin + 95, margin + 95);
  }

  // --- ELEVATION PAGES ---
  let currentPage = 3;
  elevationImages.forEach((elev) => {
    doc.addPage();
    drawTitleBlock(`03 / ${elev.wallName} Elevation`, currentPage, 5 + elevationImages.length);

    try {
      doc.addImage(elev.imageData, 'PNG', margin + 8, margin + 20, contentWidth - 16, 155);
    } catch {
      doc.text(`${elev.wallName} Elevation View`, margin + 110, margin + 100);
    }
    currentPage++;
  });

  // --- PAGE: CABINET SCHEDULE ---
  doc.addPage();
  drawTitleBlock('04 / Cabinet & Appliance Schedule', currentPage, 5 + elevationImages.length);
  currentPage++;

  // Cabinet Table
  const cabTableRows = cabinets.map(c => [
    c.id,
    c.name,
    c.category.toUpperCase(),
    formatDimension(c.width, unit),
    formatDimension(c.height, unit),
    formatDimension(c.depth, unit),
    formatDimension(c.z, unit),
    c.doorCount.toString(),
    c.drawerCount.toString(),
    c.shelfCount.toString(),
    c.wallId || 'Wall A',
    c.customNotes || '—',
  ]);

  autoTable(doc, {
    startY: margin + 20,
    margin: { left: margin + 4, right: margin + 4 },
    head: [['ID', 'Cabinet Type', 'Cat', 'W', 'H', 'D', 'Elev (Z)', 'Doors', 'Drawers', 'Shelves', 'Wall', 'Notes']],
    body: cabTableRows,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // --- PAGE: MANUFACTURING CUTTING LIST & BOM ---
  doc.addPage();
  drawTitleBlock('05 / Manufacturing Cutting List & BOM', currentPage, 5 + elevationImages.length);

  const { allPanels, aggregatedHardware, totalAreaM2, sheetEstimates } = generateFullProjectBOM(cabinets, manufacturing);

  // Summary Banner
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Panel Area: ${totalAreaM2} m²   |   Estimated Raw Sheets (${sheetEstimates.standardSheetSize}): ${sheetEstimates.sheetsNeeded} sheets (${sheetEstimates.efficiencyPercentage}% efficiency)`, margin + 5, margin + 20);

  // Panel Cutting List Table
  const panelRows = allPanels.slice(0, 28).map(p => [
    p.cabinetId,
    p.partName,
    p.quantity.toString(),
    `${p.length} mm`,
    `${p.width} mm`,
    `${p.thickness} mm`,
    p.material,
    `${p.edgeBanding.top ? 'T ' : ''}${p.edgeBanding.bottom ? 'B ' : ''}${p.edgeBanding.left ? 'L ' : ''}${p.edgeBanding.right ? 'R' : ''}` || 'None',
  ]);

  autoTable(doc, {
    startY: margin + 24,
    margin: { left: margin + 4, right: margin + 4 },
    tableWidth: 170,
    head: [['Cab ID', 'Part Name', 'Qty', 'Length', 'Width', 'Thick', 'Material', 'Edge Banding']],
    body: panelRows,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
  });

  // Aggregated Hardware Table on the right
  const hwRows = aggregatedHardware.map(h => [
    h.name,
    `${h.quantity} ${h.unit}`,
    h.description,
  ]);

  autoTable(doc, {
    startY: margin + 24,
    margin: { left: margin + 180, right: margin + 4 },
    tableWidth: contentWidth - 180,
    head: [['Hardware Item', 'Qty', 'Description']],
    body: hwRows,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [51, 65, 85], textColor: 255 },
  });

  // Save the document
  const fileName = `${metadata.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Technical_Package.pdf`;
  doc.save(fileName);
}
