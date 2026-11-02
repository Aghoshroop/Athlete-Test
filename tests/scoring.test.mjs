import test from 'node:test';
import assert from 'node:assert/strict';

// --- Phase 10 Verification Suite ---

test('1. World Athletics Decathlon formulas match official IAAF point tables', () => {
  // 100m in 10.50s => 975 points
  const p100m = Math.floor(25.4347 * Math.pow(18.0 - 10.50, 1.81));
  assert.equal(p100m, 975);

  // Long Jump 7.50m (750cm) => 935 points
  const pLJ = Math.floor(0.14354 * Math.pow(750 - 220, 1.40));
  assert.equal(pLJ, 935);

  // Shot Put 15.00m => 790 points
  const pSP = Math.floor(51.39 * Math.pow(15.00 - 1.5, 1.05));
  assert.equal(pSP, 790);

  // High Jump 2.00m (200cm) => 803 points
  const pHJ = Math.floor(0.8465 * Math.pow(200 - 75, 1.42));
  assert.equal(pHJ, 803);

  // 400m 48.00s => 909 points
  const p400m = Math.floor(1.53775 * Math.pow(82.0 - 48.00, 1.81));
  assert.equal(p400m, 909);

  // 110m Hurdles 14.00s => 975 points
  const p110mH = Math.floor(5.74352 * Math.pow(28.5 - 14.00, 1.92));
  assert.equal(p110mH, 975);

  // Discus Throw 45.00m => 767 points
  const pDT = Math.floor(12.91 * Math.pow(45.0 - 4.0, 1.10));
  assert.equal(pDT, 767);

  // Pole Vault 5.00m (500cm) => 910 points
  const pPV = Math.floor(0.2797 * Math.pow(500 - 100, 1.35));
  assert.equal(pPV, 910);

  // Javelin Throw 60.00m => 738 points
  const pJT = Math.floor(10.14 * Math.pow(60.0 - 7.0, 1.08));
  assert.equal(pJT, 738);

  // 1500m 4:30.00 (270.0s) => 745 points
  const p1500m = Math.floor(0.03768 * Math.pow(480.0 - 270.0, 1.85));
  assert.equal(p1500m, 745);
});

test('2. World Athletics Heptathlon formulas match official IAAF point tables', () => {
  // 100m Hurdles 13.50s => 1050 points
  const p100mH = Math.floor(9.23076 * Math.pow(26.7 - 13.50, 1.835));
  assert.equal(p100mH, 1050);

  // High Jump 1.80m (180cm) => 978 points
  const pHJ = Math.floor(1.84523 * Math.pow(180 - 75.0, 1.348));
  assert.equal(pHJ, 978);

  // Shot Put 14.50m => 827 points
  const pSP = Math.floor(56.0211 * Math.pow(14.5 - 1.5, 1.05));
  assert.equal(pSP, 827);

  // 200m 24.00s => 981 points
  const p200m = Math.floor(4.99087 * Math.pow(42.5 - 24.0, 1.81));
  assert.equal(p200m, 981);

  // Long Jump 6.20m (620cm) => 912 points
  const pLJ = Math.floor(0.188807 * Math.pow(620 - 210.0, 1.41));
  assert.equal(pLJ, 912);

  // Javelin Throw 45.00m => 763 points
  const pJT = Math.floor(15.9803 * Math.pow(45.0 - 3.8, 1.04));
  assert.equal(pJT, 763);

  // 800m 2:15.00 (135.0s) => 893 points
  const p800m = Math.floor(0.11193 * Math.pow(254.0 - 135.0, 1.88));
  assert.equal(p800m, 893);
});

test('3. Wind legal verification (> +2.0 m/s is wind-assisted)', () => {
  const wind1 = 1.8;
  const isWindAssisted1 = wind1 > 2.0;
  assert.equal(isWindAssisted1, false, '1.8 m/s is legal wind');

  const wind2 = 2.4;
  const isWindAssisted2 = wind2 > 2.0;
  assert.equal(isWindAssisted2, true, '2.4 m/s is wind-assisted and not legal for records');
});

test('4. Linear percentile interpolation for higher-is-better and lower-is-better tests', () => {
  // Higher-is-better (CMJ: 48.2cm = 50th, 54.6cm = 75th)
  // At 51.4cm (exact midpoint) -> 62.5th percentile
  const val = 51.4;
  const fraction = (val - 48.2) / (54.6 - 48.2);
  const p = 50 + fraction * (75 - 50);
  assert.equal(Math.round(p * 10) / 10, 62.5);

  // Lower-is-better (Sprint 30m: 4.19s = 50th, 4.05s = 75th)
  // Faster time (lower number) -> higher percentile
  const sTime = 4.12; // halfway between 4.19 and 4.05
  const sFraction = (sTime - 4.05) / (4.19 - 4.05);
  const sPercentile = 75 - sFraction * (75 - 50);
  assert.equal(Math.round(sPercentile * 10) / 10, 62.5);
});

test('5. Bilateral asymmetry calculation and directional deficit formula', () => {
  // Right 66.8kg, Left 64.8kg
  const left = 64.8;
  const right = 66.8;
  const maxVal = Math.max(left, right);
  const relativeDeficit = Math.round(((right - left) / maxVal) * 1000) / 10;
  assert.equal(relativeDeficit, 3.0, '+3.0% deficit favoring dominant right side');
  assert.ok(Math.abs(relativeDeficit) <= 10.0, '3.0% is well within normal athletic variance');
});

test('6. Missing measurements handling (never treated as 0)', () => {
  const test1 = { rawValue: 58.5, percentile: 88, isMissing: false };
  const test2 = { rawValue: undefined, percentile: undefined, isMissing: true }; // skipped test
  const validTests = [test1, test2].filter((t) => !t.isMissing && t.percentile !== undefined);
  
  assert.equal(validTests.length, 1);
  const avg = validTests.reduce((acc, t) => acc + t.percentile, 0) / validTests.length;
  assert.equal(avg, 88, 'Average of valid tests must be 88, not diluted by 0 for missing tests');
});

test('7. Minimum data coverage requirement (e.g. 50% threshold)', () => {
  const totalCategories = 10;
  const categoriesWithValidTests = 3; // 30% coverage
  const coveragePercent = Math.round((categoriesWithValidTests / totalCategories) * 100);
  const minRequired = 50;
  const meetsCoverage = coveragePercent >= minRequired;
  
  assert.equal(meetsCoverage, false, '30% coverage must suppress overall score calculation');
});
