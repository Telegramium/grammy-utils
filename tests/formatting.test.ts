import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeHtmlTags } from '../src/formatting';

describe('escapeHtml', () => {
    it('should escape HTML characters', () => {
        expect(escapeHtml('<script>alert("xss")</script>')).toBe(
            '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
        );
    });

    it('should escape ampersand', () => {
        expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    it('should escape single quotes', () => {
        expect(escapeHtml("It's working")).toBe('It&#039;s working');
    });

    it('should handle empty string', () => {
        expect(escapeHtml('')).toBe('');
    });
});

describe('sanitizeHtmlTags', () => {
    it('should keep allowed Telegram tags', () => {
        const html = '<b>bold</b> <i>italic</i> <u>underline</u>';
        expect(sanitizeHtmlTags(html)).toBe('<b>bold</b> <i>italic</i> <u>underline</u>');
    });

    it('should remove disallowed tags', () => {
        const html = '<script>alert("xss")</script><b>bold</b>';
        expect(sanitizeHtmlTags(html)).toBe('<b>bold</b>');
    });

    it('should transform strong to b', () => {
        expect(sanitizeHtmlTags('<strong>bold</strong>')).toBe('<b>bold</b>');
    });

    it('should transform em to i', () => {
        expect(sanitizeHtmlTags('<em>italic</em>')).toBe('<i>italic</i>');
    });

    it('should keep allowed attributes', () => {
        const html = '<a href="https://example.com">link</a>';
        expect(sanitizeHtmlTags(html)).toContain('href="https://example.com"');
    });

    it('should remove disallowed attributes', () => {
        const html = '<a onclick="alert(1)" href="https://example.com">link</a>';
        const result = sanitizeHtmlTags(html);
        expect(result).not.toContain('onclick');
        expect(result).toContain('href');
    });

    it('should handle tg:// links', () => {
        const html = '<a href="tg://user?id=123">mention</a>';
        expect(sanitizeHtmlTags(html)).toContain('tg://user?id=123');
    });

    it('should replace br tags with newlines', () => {
        const html = 'Line 1<br>Line 2<br/>Line 3<BR />Line 4';
        const result = sanitizeHtmlTags(html);
        expect(result).toBe('Line 1\nLine 2\nLine 3\nLine 4');
    });

    it('should replace br tags with newlines while preserving other tags', () => {
        const html = '<b>Bold</b><br><i>Italic</i>';
        const result = sanitizeHtmlTags(html);
        expect(result).toBe('<b>Bold</b>\n<i>Italic</i>');
    });
});

