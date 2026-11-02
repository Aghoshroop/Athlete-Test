import { CombinedEventScoreSheet } from '@/types/athletics';

export interface CombinedEventFormula {
  code: string;
  name: string;
  unit: string;
  a: number;
  b: number;
  c: number;
  isField: boolean;
  convertMetersToCm: boolean;
  day: 1 | 2;
}

export const DECATHLON_EVENTS: CombinedEventFormula[] = [
  // Day 1
  { code: '100m', name: '100m Sprint', unit: 's', a: 25.4347, b: 18.0, c: 1.81, isField: false, convertMetersToCm: false, day: 1 },
  { code: 'long_jump', name: 'Long Jump', unit: 'm', a: 0.14354, b: 220.0, c: 1.4, isField: true, convertMetersToCm: true, day: 1 },
  { code: 'shot_put', name: 'Shot Put', unit: 'm', a: 51.39, b: 1.5, c: 1.05, isField: true, convertMetersToCm: false, day: 1 },
  { code: 'high_jump', name: 'High Jump', unit: 'm', a: 0.8465, b: 75.0, c: 1.42, isField: true, convertMetersToCm: true, day: 1 },
  { code: '400m', name: '400m Sprint', unit: 's', a: 1.53775, b: 82.0, c: 1.81, isField: false, convertMetersToCm: false, day: 1 },
  // Day 2
  { code: '110m_hurdles', name: '110m Hurdles', unit: 's', a: 5.74352, b: 28.5, c: 1.92, isField: false, convertMetersToCm: false, day: 2 },
  { code: 'discus_throw', name: 'Discus Throw', unit: 'm', a: 12.91, b: 4.0, c: 1.1, isField: true, convertMetersToCm: false, day: 2 },
  { code: 'pole_vault', name: 'Pole Vault', unit: 'm', a: 0.2797, b: 100.0, c: 1.35, isField: true, convertMetersToCm: true, day: 2 },
  { code: 'javelin_throw', name: 'Javelin Throw', unit: 'm', a: 10.14, b: 7.0, c: 1.08, isField: true, convertMetersToCm: false, day: 2 },
  { code: '1500m', name: '1500m Run', unit: 's', a: 0.03768, b: 480.0, c: 1.85, isField: false, convertMetersToCm: false, day: 2 },
];

export const HEPTATHLON_EVENTS: CombinedEventFormula[] = [
  // Day 1
  { code: '100m_hurdles', name: '100m Hurdles', unit: 's', a: 9.23076, b: 26.7, c: 1.835, isField: false, convertMetersToCm: false, day: 1 },
  { code: 'high_jump', name: 'High Jump', unit: 'm', a: 1.84523, b: 75.0, c: 1.348, isField: true, convertMetersToCm: true, day: 1 },
  { code: 'shot_put', name: 'Shot Put', unit: 'm', a: 56.0211, b: 1.5, c: 1.05, isField: true, convertMetersToCm: false, day: 1 },
  { code: '200m', name: '200m Sprint', unit: 's', a: 4.99087, b: 42.5, c: 1.81, isField: false, convertMetersToCm: false, day: 1 },
  // Day 2
  { code: 'long_jump', name: 'Long Jump', unit: 'm', a: 0.188807, b: 210.0, c: 1.41, isField: true, convertMetersToCm: true, day: 2 },
  { code: 'javelin_throw', name: 'Javelin Throw', unit: 'm', a: 15.9803, b: 3.8, c: 1.04, isField: true, convertMetersToCm: false, day: 2 },
  { code: '800m', name: '800m Run', unit: 's', a: 0.11193, b: 254.0, c: 1.88, isField: false, convertMetersToCm: false, day: 2 },
];

export function calculateDisciplinePoints(
  formula: CombinedEventFormula,
  rawMeasurement: number
): number {
  if (rawMeasurement <= 0 || isNaN(rawMeasurement)) return 0;

  let mark = rawMeasurement;
  if (formula.convertMetersToCm) {
    // If the input was in meters (e.g. 7.50m long jump, 2.05m high jump), convert to cm
    if (mark < 25) {
      mark = mark * 100;
    }
  }

  let points = 0;
  if (formula.isField) {
    if (mark > formula.b) {
      points = Math.floor(formula.a * Math.pow(mark - formula.b, formula.c));
    }
  } else {
    if (mark < formula.b) {
      points = Math.floor(formula.a * Math.pow(formula.b - mark, formula.c));
    }
  }

  return Math.max(0, points);
}

export function calculateCombinedEventScore(
  format: 'DEC' | 'HEP',
  results: Record<string, number>, // event code -> raw result
  athleteId: string = 'ath-1',
  competitionId: string = 'comp-1'
): CombinedEventScoreSheet {
  const formulas = format === 'DEC' ? DECATHLON_EVENTS : HEPTATHLON_EVENTS;

  let totalPoints = 0;
  let day1Points = 0;
  let day2Points = 0;

  const disciplines = formulas.map((f) => {
    const rawResult = results[f.code] ?? 0;
    const points = calculateDisciplinePoints(f, rawResult);
    totalPoints += points;
    if (f.day === 1) day1Points += points;
    else day2Points += points;

    return {
      eventId: f.code,
      eventName: f.name,
      rawResult,
      unit: f.unit,
      points,
      day: f.day,
    };
  });

  return {
    athleteId,
    competitionId,
    combinedEventCode: format,
    disciplines,
    totalPoints,
    day1Points,
    day2Points,
  };
}
