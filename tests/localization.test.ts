import { describe, it, expect } from 'vitest';
import { formatNumber, formatDate, formatRelativeTime, formatCurrency } from '../src/localization';

describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
        expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('should handle different locales', () => {
        expect(formatNumber(1234567, 'ru')).toContain('1');
        expect(formatNumber(1234567, 'en-US')).toBe('1,234,567');
    });

    it('should handle Telegram underscore format', () => {
        expect(formatNumber(1234567, 'en_US')).toBe('1,234,567');
    });

    it('should handle small numbers', () => {
        expect(formatNumber(123)).toBe('123');
    });
});

describe('formatDate', () => {
    it('should format dates', () => {
        const date = new Date('2024-01-15');
        const result = formatDate(date, 'en-US');
        expect(result).toBeTruthy();
    });

    it('should handle timestamps', () => {
        const timestamp = new Date('2024-01-15').getTime();
        const result = formatDate(timestamp, 'en-US');
        expect(result).toBeTruthy();
    });

    it('should handle date strings', () => {
        const result = formatDate('2024-01-15', 'en-US');
        expect(result).toBeTruthy();
    });
});

describe('formatRelativeTime', () => {
    it('should format relative time for past', () => {
        const past = new Date(Date.now() - 3600000); // 1 hour ago
        const result = formatRelativeTime(past, 'en');
        expect(result).toContain('hour');
    });

    it('should format relative time for future', () => {
        const future = new Date(Date.now() + 86400000); // 1 day from now
        const result = formatRelativeTime(future, 'en');
        expect(result).toBeTruthy();
    });
});

describe('formatCurrency', () => {
    it('should format USD currency', () => {
        const result = formatCurrency(1234.56, 'USD', 'en-US');
        expect(result).toContain('1,234.56');
        expect(result).toContain('$');
    });

    it('should format EUR currency', () => {
        const result = formatCurrency(1234.56, 'EUR', 'en-US');
        expect(result).toContain('1,234.56');
    });

    it('should use default USD and en-US', () => {
        const result = formatCurrency(1234.56);
        expect(result).toContain('1,234.56');
    });
});



