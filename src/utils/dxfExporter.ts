import { ProjectData } from '../types';

export function generateDXF(project: ProjectData): string {
  const { room, cabinets, appliances } = project;
  const lines: string[] = [];

  // DXF Header
  lines.push('0', 'SECTION', '2', 'HEADER', '9', '$ACADVER', '1', 'AC1009', '0', 'ENDSEC');

  // DXF Tables / Layers
  lines.push('0', 'SECTION', '2', 'TABLES');
  lines.push('0', 'TABLE', '2', 'LAYER', '70', '5');
  // Layer: WALLS (Color 7: White)
  lines.push('0', 'LAYER', '2', 'WALLS', '70', '0', '62', '7', '6', 'CONTINUOUS');
  // Layer: BASE_CABINETS (Color 1: Red)
  lines.push('0', 'LAYER', '2', 'BASE_CABINETS', '70', '0', '62', '1', '6', 'CONTINUOUS');
  // Layer: WALL_CABINETS (Color 4: Cyan)
  lines.push('0', 'LAYER', '2', 'WALL_CABINETS', '70', '0', '62', '4', '6', 'DASHED');
  // Layer: TALL_CABINETS (Color 3: Green)
  lines.push('0', 'LAYER', '2', 'TALL_CABINETS', '70', '0', '62', '3', '6', 'CONTINUOUS');
  // Layer: APPLIANCES (Color 2: Yellow)
  lines.push('0', 'LAYER', '2', 'APPLIANCES', '70', '0', '62', '2', '6', 'CONTINUOUS');
  // Layer: DIMENSIONS (Color 6: Magenta)
  lines.push('0', 'LAYER', '2', 'DIMENSIONS', '70', '0', '62', '6', '6', 'CONTINUOUS');
  // Layer: TEXT (Color 7: White)
  lines.push('0', 'LAYER', '2', 'TEXT', '70', '0', '62', '7', '6', 'CONTINUOUS');
  lines.push('0', 'ENDTAB', '0', 'ENDSEC');

  // DXF Entities
  lines.push('0', 'SECTION', '2', 'ENTITIES');

  // Helper to add a line entity
  function addLine(layer: string, x1: number, y1: number, x2: number, y2: number) {
    // Invert Y so DXF matches CAD Cartesian coordinate standard
    const cadY1 = -y1;
    const cadY2 = -y2;
    lines.push('0', 'LINE', '8', layer, '10', x1.toFixed(2), '20', cadY1.toFixed(2), '30', '0.0', '11', x2.toFixed(2), '21', cadY2.toFixed(2), '31', '0.0');
  }

  // Helper to add a rectangle
  function addRect(layer: string, x: number, y: number, w: number, h: number) {
    addLine(layer, x, y, x + w, y);
    addLine(layer, x + w, y, x + w, y + h);
    addLine(layer, x + w, y + h, x, y + h);
    addLine(layer, x, y + h, x, y);
  }

  // Helper to add text
  function addText(layer: string, text: string, x: number, y: number, height: number = 60) {
    const cadY = -y;
    lines.push('0', 'TEXT', '8', layer, '10', x.toFixed(2), '20', cadY.toFixed(2), '30', '0.0', '40', height.toFixed(2), '1', text);
  }

  // 1. Draw Walls
  room.walls.forEach(wall => {
    addLine('WALLS', wall.startX, wall.startY, wall.endX, wall.endY);
  });

  // Room Dimensions Label
  addText('DIMENSIONS', `ROOM: ${room.width} x ${room.length} mm (H=${room.ceilingHeight}mm)`, room.width / 2 - 400, room.length / 2, 80);

  // 2. Draw Cabinets
  cabinets.forEach(cab => {
    let layer = 'BASE_CABINETS';
    if (cab.category === 'wall') layer = 'WALL_CABINETS';
    else if (cab.category === 'tall') layer = 'TALL_CABINETS';

    let w = cab.width;
    let d = cab.depth;
    if (cab.rotation === 90 || cab.rotation === 270) {
      w = cab.depth;
      d = cab.width;
    }

    addRect(layer, cab.x, cab.y, w, d);
    // Draw ID and Dimension text inside cabinet
    addText('TEXT', `${cab.id}: ${cab.width}x${cab.height}`, cab.x + 20, cab.y + d / 2, 40);
  });

  // 3. Draw Appliances
  appliances.forEach(app => {
    let w = app.width;
    let d = app.depth;
    if (app.rotation === 90 || app.rotation === 270) {
      w = app.depth;
      d = app.width;
    }
    addRect('APPLIANCES', app.x, app.y, w, d);
    addText('APPLIANCES', `${app.id}: ${app.name}`, app.x + 10, app.y + d / 2, 35);
  });

  // DXF Footer
  lines.push('0', 'ENDSEC', '0', 'EOF');

  return lines.join('\n');
}
