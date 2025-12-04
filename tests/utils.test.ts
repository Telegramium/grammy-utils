import { describe, expect, it, vi } from 'vitest';
import { chunk, pick, randomInt, retry, shuffle, sleep, truncate } from '../src/utils';
import { isValidUrl, textMessageLink } from '../src/url';

describe('sleep', () => {
    it('should resolve after the specified time', async () => {
        const start = Date.now();
        await sleep(100);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(90);
    });
});

describe('pick', () => {
    it('should return an element from the array', () => {
        const arr = [1, 2, 3, 4, 5];
        const result = pick(arr);
        expect(arr).toContain(result);
    });

    it('should work with string arrays', () => {
        const arr = ['a', 'b', 'c'];
        const result = pick(arr);
        expect(arr).toContain(result);
    });
});

describe('randomInt', () => {
    it('should return an integer within the range', () => {
        const result = randomInt(1, 5);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(5);
        expect(Number.isInteger(result)).toBe(true);
    });

    it('should handle same min and max', () => {
        expect(randomInt(5, 5)).toBe(5);
    });
});

describe('shuffle', () => {
    it('should return an array with the same length', () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffle(arr);
        expect(shuffled.length).toBe(arr.length);
    });

    it('should contain all original elements', () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffle(arr);
        expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not mutate the original array', () => {
        const arr = [1, 2, 3, 4, 5];
        const original = [...arr];
        shuffle(arr);
        expect(arr).toEqual(original);
    });
});

describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
        const arr = [1, 2, 3, 4, 5, 6, 7];
        const chunks = chunk(arr, 3);
        expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle empty array', () => {
        expect(chunk([], 3)).toEqual([]);
    });

    it('should handle size larger than array', () => {
        expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
});

describe('truncate', () => {
    it('should truncate string longer than maxLength', () => {
        expect(truncate('hello world', 5)).toBe('he...');
    });

    it('should not truncate string shorter than maxLength', () => {
        expect(truncate('hi', 5)).toBe('hi');
    });

    it('should use custom suffix', () => {
        expect(truncate('hello world', 5, '...')).toBe('he...');
        expect(truncate('hello world', 5, '>>')).toBe('hel>>');
    });
});

describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('http://example.com')).toBe(true);
        expect(isValidUrl('https://example.com/path?query=1')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
        expect(isValidUrl('not a url')).toBe(false);
        expect(isValidUrl('')).toBe(false);
    });
});

describe('retry', () => {
    it('should return result on first try', async () => {
        const fn = vi.fn().mockResolvedValue('success');
        const result = await retry(fn);
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
        const fn = vi.fn()
            .mockRejectedValueOnce(new Error('fail'))
            .mockResolvedValue('success');
        const result = await retry(fn, 3, 10);
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max retries', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('fail'));
        await expect(retry(fn, 2, 10)).rejects.toThrow('fail');
        expect(fn).toHaveBeenCalledTimes(3);
    });
});

describe('textMessageLink', () => {
    it('should create Telegram URL with text parameter', () => {
        const result = textMessageLink('durov', 'hello world');
        expect(result).toBe('https://t.me/durov?text=hello%20world');
    });

    it('should replace + with %20 in the URL', () => {
        const result = textMessageLink('durov', 'hello+world');
        expect(result).toBe('https://t.me/durov?text=hello%2Bworld');
        // Note: The + in the text itself gets encoded to %2B, but any + in the final URL gets replaced
        expect(result).not.toContain('+');
    });

    it('should handle special characters in text', () => {
        const result = textMessageLink('durov', 'hello & world');
        expect(result).toContain('https://t.me/durov');
        expect(result).toContain('text=');
        expect(result).not.toContain('+');
    });

    it('should work with different usernames', () => {
        const result = textMessageLink('testuser', 'test message');
        expect(result).toBe('https://t.me/testuser?text=test%20message');
    });

    it('should handle empty text', () => {
        const result = textMessageLink('durov', '');
        expect(result).toBe('https://t.me/durov?text=');
    });
});

