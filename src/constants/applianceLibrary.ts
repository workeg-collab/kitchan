import { ApplianceType } from '../types';

export interface ApplianceTemplate {
  type: ApplianceType;
  name: string;
  category: 'cooling' | 'cooking' | 'cleaning' | 'ventilation' | 'sinks';
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  defaultZ: number;
  clearanceSides: number;
  clearanceBack: number;
  clearanceTop: number;
  standardWidths: number[];
  icon: string;
  isBuiltIn?: boolean;
}

export const APPLIANCE_LIBRARY: ApplianceTemplate[] = [
  // --- REFRIGERATORS ---
  {
    type: 'fridge-freestanding',
    name: 'Freestanding Refrigerator',
    category: 'cooling',
    description: 'French door or bottom freezer freestanding fridge',
    defaultWidth: 900,
    defaultHeight: 1850,
    defaultDepth: 680,
    defaultZ: 0,
    clearanceSides: 50,
    clearanceBack: 50,
    clearanceTop: 100,
    standardWidths: [600, 700, 800, 900, 1000],
    icon: 'Refrigerator',
    isBuiltIn: false,
  },
  {
    type: 'fridge-builtin',
    name: 'Built-in Refrigerator',
    category: 'cooling',
    description: 'Integrated flush panel refrigerator',
    defaultWidth: 600,
    defaultHeight: 1780,
    defaultDepth: 550,
    defaultZ: 100,
    clearanceSides: 0,
    clearanceBack: 50,
    clearanceTop: 50,
    standardWidths: [600, 750, 900],
    icon: 'Refrigerator',
    isBuiltIn: true,
  },

  // --- COOKING ---
  {
    type: 'cooktop-induction',
    name: 'Induction / Gas Cooktop',
    category: 'cooking',
    description: 'Countertop drop-in 4-zone cooktop',
    defaultWidth: 600,
    defaultHeight: 50,
    defaultDepth: 520,
    defaultZ: 850, // On top of base cabinet
    clearanceSides: 50,
    clearanceBack: 50,
    clearanceTop: 650, // Minimum clearance to hood
    standardWidths: [600, 750, 800, 900],
    icon: 'Flame',
    isBuiltIn: true,
  },
  {
    type: 'cooker-range',
    name: 'Freestanding Range Cooker',
    category: 'cooking',
    description: 'Pro-style stove with integrated double oven and 5-6 burners',
    defaultWidth: 900,
    defaultHeight: 900,
    defaultDepth: 600,
    defaultZ: 0,
    clearanceSides: 5,
    clearanceBack: 20,
    clearanceTop: 750,
    standardWidths: [600, 900, 1000, 1200],
    icon: 'CookingPot',
    isBuiltIn: false,
  },
  {
    type: 'oven-builtin',
    name: 'Built-in Single Oven',
    category: 'cooking',
    description: 'Standard 60cm built-in electric convection oven',
    defaultWidth: 595,
    defaultHeight: 595,
    defaultDepth: 560,
    defaultZ: 100, // Or elevated in tall unit
    clearanceSides: 0,
    clearanceBack: 40,
    clearanceTop: 0,
    standardWidths: [600],
    icon: 'Flame',
    isBuiltIn: true,
  },
  {
    type: 'microwave-builtin',
    name: 'Built-in Microwave',
    category: 'cooking',
    description: 'Integrated compact combi microwave oven',
    defaultWidth: 595,
    defaultHeight: 385,
    defaultDepth: 400,
    defaultZ: 1400,
    clearanceSides: 0,
    clearanceBack: 30,
    clearanceTop: 0,
    standardWidths: [600],
    icon: 'Radio',
    isBuiltIn: true,
  },

  // --- CLEANING ---
  {
    type: 'dishwasher',
    name: 'Integrated Dishwasher',
    category: 'cleaning',
    description: '60cm standard fully integrated undercounter dishwasher',
    defaultWidth: 600,
    defaultHeight: 820,
    defaultDepth: 570,
    defaultZ: 0,
    clearanceSides: 0,
    clearanceBack: 30,
    clearanceTop: 0,
    standardWidths: [450, 600],
    icon: 'Sparkles',
    isBuiltIn: true,
  },
  {
    type: 'washing-machine',
    name: 'Front-load Washing Machine',
    category: 'cleaning',
    description: 'Undercounter or utility front loader',
    defaultWidth: 600,
    defaultHeight: 850,
    defaultDepth: 600,
    defaultZ: 0,
    clearanceSides: 10,
    clearanceBack: 40,
    clearanceTop: 10,
    standardWidths: [600],
    icon: 'Disc',
    isBuiltIn: false,
  },

  // --- VENTILATION ---
  {
    type: 'hood-wall',
    name: 'Wall Chimney Hood',
    category: 'ventilation',
    description: 'Stainless steel / black box wall extractor hood',
    defaultWidth: 900,
    defaultHeight: 650,
    defaultDepth: 500,
    defaultZ: 1550, // 650-750mm above cooktop
    clearanceSides: 0,
    clearanceBack: 0,
    clearanceTop: 0,
    standardWidths: [600, 900, 1200],
    icon: 'Fan',
    isBuiltIn: false,
  },
  {
    type: 'hood-integrated',
    name: 'Integrated Canopy Hood',
    category: 'ventilation',
    description: 'Concealed canopy hood built into wall cabinet',
    defaultWidth: 600,
    defaultHeight: 300,
    defaultDepth: 320,
    defaultZ: 1450,
    clearanceSides: 0,
    clearanceBack: 0,
    clearanceTop: 0,
    standardWidths: [600, 900],
    icon: 'Wind',
    isBuiltIn: true,
  },

  // --- SINKS ---
  {
    type: 'sink-single',
    name: 'Single Bowl Sink & Mixer',
    category: 'sinks',
    description: 'Undermount or drop-in single bowl with gooseneck faucet',
    defaultWidth: 550,
    defaultHeight: 200,
    defaultDepth: 450,
    defaultZ: 850,
    clearanceSides: 50,
    clearanceBack: 50,
    clearanceTop: 0,
    standardWidths: [450, 550, 600],
    icon: 'Droplets',
    isBuiltIn: true,
  },
  {
    type: 'sink-double',
    name: 'Double Bowl Sink & Mixer',
    category: 'sinks',
    description: 'Large double bowl sink with drainer area and mixer tap',
    defaultWidth: 860,
    defaultHeight: 220,
    defaultDepth: 500,
    defaultZ: 850,
    clearanceSides: 50,
    clearanceBack: 50,
    clearanceTop: 0,
    standardWidths: [800, 860, 1000, 1160],
    icon: 'Droplet',
    isBuiltIn: true,
  },
];
