import { ManufacturingSettings, CountertopConfig, PlinthConfig, BacksplashConfig, MaterialFinishes } from '../types';

export const DEFAULT_MANUFACTURING_SETTINGS: ManufacturingSettings = {
  boardThickness: 18, // standard 18mm MFC/MDF
  backPanelThickness: 6, // 6mm grooved back
  backPanelRecess: 15, // 15mm service void behind back
  edgeBandingFront: 1.0, // 1mm ABS impact edge
  edgeBandingHidden: 0.4, // 0.4mm melamine edge
  doorReveal: 3, // 3mm gap between doors/drawers
  drawerSlideLoss: 25, // deduction for undermount/side-mount drawer slides
  shelfSetback: 20, // 20mm setback from front edge
};

export const DEFAULT_COUNTERTOP_CONFIG: CountertopConfig = {
  enabled: true,
  thickness: 30, // 30mm standard quartz/granite
  depth: 620, // 600mm cabinet + 20mm front overhang
  overhangFront: 20,
  overhangSides: 10,
  material: 'quartz-calacatta',
  edgeProfile: 'square',
};

export const DEFAULT_PLINTH_CONFIG: PlinthConfig = {
  enabled: true,
  height: 100, // 100mm plinth
  setback: 50, // 50mm setback
  material: 'matte-anthracite',
};

export const DEFAULT_BACKSPLASH_CONFIG: BacksplashConfig = {
  enabled: true,
  height: 600, // 600mm splash zone
  thickness: 15,
  material: 'quartz-calacatta',
};

export const DEFAULT_MATERIAL_FINISHES: MaterialFinishes = {
  frontFinish: 'matte-white',
  frontColor: '#f8fafc',
  bodyColor: '#cbd5e1',
  countertopMaterial: 'quartz-calacatta',
  countertopColor: '#f8fafc',
  backsplashMaterial: 'quartz-calacatta',
  backsplashColor: '#f8fafc',
  wallColor: '#f1f5f9',
  floorMaterial: 'floor-wood-oak',
  floorColor: '#8c6843',
  handleStyle: 'bar-black',
  handleColor: '#09090b',
};

export const STANDARD_CARCASE_HEIGHTS = [720, 780, 840];
export const STANDARD_BASE_DEPTHS = [560, 580, 600];
export const STANDARD_WALL_DEPTHS = [320, 350, 380];
export const STANDARD_TALL_HEIGHTS = [1950, 2050, 2150, 2300];
export const STANDARD_PLINTH_HEIGHTS = [80, 100, 120, 150];
