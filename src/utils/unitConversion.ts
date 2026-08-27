import { UnitType } from '../types';

export function formatDimension(valueInMm: number, unit: UnitType, includeUnit = true): string {
  if (unit === 'cm') {
    const valInCm = (valueInMm / 10).toFixed(1).replace(/\.0$/, '');
    return includeUnit ? `${valInCm} cm` : valInCm;
  }
  const valInMm = Math.round(valueInMm).toString();
  return includeUnit ? `${valInMm} mm` : valInMm;
}

export function parseDimension(valueString: string, unit: UnitType): number {
  const clean = valueString.trim().replace(/[^\d.-]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  if (unit === 'cm') {
    return Math.round(num * 10);
  }
  return Math.round(num);
}

export function convertMmToUnit(valueInMm: number, unit: UnitType): number {
  if (unit === 'cm') return Number((valueInMm / 10).toFixed(1));
  return Math.round(valueInMm);
}

export function convertUnitToMm(valueInUnit: number, unit: UnitType): number {
  if (unit === 'cm') return Math.round(valueInUnit * 10);
  return Math.round(valueInUnit);
}
