import { describe, it, expect } from 'vitest';
import { calculateComponentWeight, calculateComponentCost } from './costing-calculator';

describe('Costing Calculator', () => {
  it('should calculate component weight correctly', () => {
    // Formula: (Length * Width * GSM * panelCount * fabricFactor) / 10000
    // (10 * 10 * 100 * 1 * 1) / 10000 = 1 gram
    expect(calculateComponentWeight(10, 10, 100, 1, 1)).toBe(1);
    // (20 * 50 * 200 * 2 * 1) / 10000 = 40 grams
    expect(calculateComponentWeight(20, 50, 200, 2, 1)).toBe(40);
  });

  it('should return 0 for invalid inputs', () => {
    expect(calculateComponentWeight(0, 10, 100, 1, 1)).toBe(0);
    expect(calculateComponentWeight(10, -5, 100, 1, 1)).toBe(0);
  });

  it('should calculate component cost correctly', () => {
    // Formula: (WeightGrams / 1000) * PricePerKg
    // (500g / 1000) * 10 => 0.5 * 10 = 5
    expect(calculateComponentCost(500, 10)).toBe(5);
  });
});
