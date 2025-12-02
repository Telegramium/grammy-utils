import { describe, it, expect } from 'vitest';
import { convertStarsToUsd } from '../src/payments';

describe('convertStarsToUsd', () => {
    it('should convert 50 stars to 1 USD', () => {
        expect(convertStarsToUsd(50)).toBe(1);
    });

    it('should convert 100 stars to 2 USD', () => {
        expect(convertStarsToUsd(100)).toBe(2);
    });

    it('should convert 25 stars to 0.5 USD', () => {
        expect(convertStarsToUsd(25)).toBe(0.5);
    });

    it('should handle 0 stars', () => {
        expect(convertStarsToUsd(0)).toBe(0);
    });

    it('should round to 2 decimal places', () => {
        expect(convertStarsToUsd(1)).toBe(0.02);
        expect(convertStarsToUsd(33)).toBe(0.66);
    });
});
