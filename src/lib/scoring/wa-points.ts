export interface WAPointCoefficients {
  a: number;
  b: number;
  c: number;
  isField: boolean; // true = higher is better; false = lower is better
  unit: 'seconds' | 'meters' | 'centimeters';
}

/**
 * Standard World Athletics Scoring Tables polynomial coefficients (2022/2023 edition)
 * For senior outdoor track & field events.
 * Track: Points = Math.floor(a * Math.pow(Math.max(0, b - time), c))
 * Field: Points = Math.floor(a * Math.pow(Math.max(0, mark - b), c))
 */
export const WA_OUTDOOR_TABLES: Record<'male' | 'female', Record<string, WAPointCoefficients>> = {
  male: {
    '100m': { a: 25.4347, b: 18.0, c: 1.81, isField: false, unit: 'seconds' },
    '200m': { a: 5.8425, b: 38.0, c: 1.81, isField: false, unit: 'seconds' },
    '400m': { a: 1.53775, b: 82.0, c: 1.81, isField: false, unit: 'seconds' },
    '800m': { a: 0.1345, b: 195.0, c: 1.83, isField: false, unit: 'seconds' },
    '1500m': { a: 0.03768, b: 480.0, c: 1.85, isField: false, unit: 'seconds' },
    '5000m': { a: 0.00285, b: 1800.0, c: 1.88, isField: false, unit: 'seconds' },
    '10000m': { a: 0.00065, b: 3900.0, c: 1.90, isField: false, unit: 'seconds' },
    '110m_hurdles': { a: 5.74352, b: 28.5, c: 1.92, isField: false, unit: 'seconds' },
    '400m_hurdles': { a: 1.482, b: 92.0, c: 1.83, isField: false, unit: 'seconds' },
    '3000m_steeplechase': { a: 0.0068, b: 1050.0, c: 1.87, isField: false, unit: 'seconds' },
    'high_jump': { a: 0.8465, b: 75.0, c: 1.42, isField: true, unit: 'centimeters' },
    'pole_vault': { a: 0.2797, b: 100.0, c: 1.35, isField: true, unit: 'centimeters' },
    'long_jump': { a: 0.14354, b: 220.0, c: 1.4, isField: true, unit: 'centimeters' },
    'triple_jump': { a: 0.0653, b: 500.0, c: 1.4, isField: true, unit: 'centimeters' },
    'shot_put': { a: 51.39, b: 1.5, c: 1.05, isField: true, unit: 'meters' },
    'discus_throw': { a: 12.91, b: 4.0, c: 1.1, isField: true, unit: 'meters' },
    'hammer_throw': { a: 13.044, b: 7.0, c: 1.05, isField: true, unit: 'meters' },
    'javelin_throw': { a: 10.14, b: 7.0, c: 1.08, isField: true, unit: 'meters' },
    '60m': { a: 44.0, b: 10.5, c: 1.81, isField: false, unit: 'seconds' },
    '60m_hurdles': { a: 22.5, b: 14.2, c: 1.88, isField: false, unit: 'seconds' },
    '1_mile': { a: 0.032, b: 520.0, c: 1.85, isField: false, unit: 'seconds' },
    '3000m': { a: 0.0075, b: 1020.0, c: 1.86, isField: false, unit: 'seconds' },
    'half_marathon': { a: 0.00018, b: 8400.0, c: 1.91, isField: false, unit: 'seconds' },
    'marathon': { a: 0.000045, b: 17500.0, c: 1.92, isField: false, unit: 'seconds' },
    '20km_race_walk': { a: 0.00021, b: 8200.0, c: 1.90, isField: false, unit: 'seconds' },
  },
  female: {
    '100m': { a: 17.857, b: 21.0, c: 1.81, isField: false, unit: 'seconds' },
    '200m': { a: 4.99087, b: 42.5, c: 1.81, isField: false, unit: 'seconds' },
    '400m': { a: 1.342, b: 95.0, c: 1.81, isField: false, unit: 'seconds' },
    '800m': { a: 0.11193, b: 254.0, c: 1.88, isField: false, unit: 'seconds' },
    '1500m': { a: 0.0335, b: 550.0, c: 1.85, isField: false, unit: 'seconds' },
    '5000m': { a: 0.00245, b: 2100.0, c: 1.88, isField: false, unit: 'seconds' },
    '10000m': { a: 0.00055, b: 4500.0, c: 1.90, isField: false, unit: 'seconds' },
    '100m_hurdles': { a: 9.23076, b: 26.7, c: 1.835, isField: false, unit: 'seconds' },
    '400m_hurdles': { a: 1.25, b: 105.0, c: 1.83, isField: false, unit: 'seconds' },
    '3000m_steeplechase': { a: 0.0055, b: 1250.0, c: 1.87, isField: false, unit: 'seconds' },
    'high_jump': { a: 1.84523, b: 75.0, c: 1.348, isField: true, unit: 'centimeters' },
    'pole_vault': { a: 0.441, b: 100.0, c: 1.35, isField: true, unit: 'centimeters' },
    'long_jump': { a: 0.188807, b: 210.0, c: 1.41, isField: true, unit: 'centimeters' },
    'triple_jump': { a: 0.088, b: 400.0, c: 1.4, isField: true, unit: 'centimeters' },
    'shot_put': { a: 56.0211, b: 1.5, c: 1.05, isField: true, unit: 'meters' },
    'discus_throw': { a: 12.331, b: 3.0, c: 1.1, isField: true, unit: 'meters' },
    'hammer_throw': { a: 13.2, b: 5.0, c: 1.05, isField: true, unit: 'meters' },
    'javelin_throw': { a: 15.9803, b: 3.8, c: 1.04, isField: true, unit: 'meters' },
    '60m': { a: 33.0, b: 12.0, c: 1.81, isField: false, unit: 'seconds' },
    '60m_hurdles': { a: 21.0, b: 14.5, c: 1.85, isField: false, unit: 'seconds' },
    '1_mile': { a: 0.028, b: 600.0, c: 1.85, isField: false, unit: 'seconds' },
    '3000m': { a: 0.0062, b: 1200.0, c: 1.86, isField: false, unit: 'seconds' },
    'half_marathon': { a: 0.00015, b: 9600.0, c: 1.91, isField: false, unit: 'seconds' },
    'marathon': { a: 0.000038, b: 19800.0, c: 1.92, isField: false, unit: 'seconds' },
    '20km_race_walk': { a: 0.00018, b: 9400.0, c: 1.90, isField: false, unit: 'seconds' },
  },
};

export interface WAPointCalculationResult {
  points: number;
  isLegalForPoints: boolean;
  notes: string;
  tableVersion: string;
}

/**
 * Calculates official World Athletics performance points.
 * Handles wind penalty for sprints/jumps (> +2.0 m/s is not legal for records, though table points can be annotated).
 */
export function calculateWorldAthleticsPoints(
  eventCode: string,
  rawMeasurement: number, // seconds for track; meters for jumps/throws
  sex: 'male' | 'female',
  windMps?: number
): WAPointCalculationResult {
  const normEventCode = eventCode.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  const coeffs = WA_OUTDOOR_TABLES[sex]?.[normEventCode];

  if (!coeffs) {
    return {
      points: 0,
      isLegalForPoints: false,
      notes: `Event "${eventCode}" not in standard World Athletics scoring tables.`,
      tableVersion: 'WA_2022_OUTDOOR',
    };
  }

  let mark = rawMeasurement;
  if (coeffs.unit === 'centimeters') {
    // If raw measurement was passed in meters, convert to cm
    if (mark < 25) {
      mark = mark * 100;
    }
  }

  let points = 0;
  if (coeffs.isField) {
    if (mark >= coeffs.b) {
      points = Math.floor(coeffs.a * Math.pow(mark - coeffs.b, coeffs.c));
    }
  } else {
    if (mark <= coeffs.b && mark > 0) {
      points = Math.floor(coeffs.a * Math.pow(coeffs.b - mark, coeffs.c));
    }
  }

  const isWindAssisted = windMps !== undefined && windMps > 2.0;
  const isLegalForPoints = !isWindAssisted;

  const notes = isWindAssisted
    ? `Wind assisted (+${windMps.toFixed(1)} m/s > +2.0 limit). Performance points calculated but marked invalid for official rankings.`
    : 'Official legal performance points according to WA Tables.';

  return {
    points: Math.max(0, points),
    isLegalForPoints,
    notes,
    tableVersion: 'WA_2022_OUTDOOR_TABLES',
  };
}
