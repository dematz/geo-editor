import { describe, it, expect } from 'vitest';
import { snapToGrid } from '../snap';

describe('snapToGrid', () => {
  it('snaps to 4 decimal places by default', () => {
    const result = snapToGrid(-74.07213456, 4.71189234);
    expect(result.lng).toBe(-74.0721);
    expect(result.lat).toBe(4.7119);
  });

  it('snaps to custom precision', () => {
    const result = snapToGrid(-74.07213456, 4.71189234, { precision: 2 });
    expect(result.lng).toBe(-74.07);
    expect(result.lat).toBe(4.71);
  });

  it('does not alter already-snapped coordinates', () => {
    const result = snapToGrid(-74.0721, 4.7119);
    expect(result.lng).toBe(-74.0721);
    expect(result.lat).toBe(4.7119);
  });

  it('handles negative coordinates correctly', () => {
    const result = snapToGrid(-33.45691, -70.64831);
    expect(result.lng).toBe(-33.4569);
    expect(result.lat).toBe(-70.6483);
  });
});
