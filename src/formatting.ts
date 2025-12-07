import sanitizeHtml from 'sanitize-html';

/**
 * Escapes HTML characters in a string
 * @param text The string to escape
 * @returns The escaped string
 */
export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Sanitizes HTML tags, keeping only allowed Telegram formatting tags
 * @param text The text to sanitize
 * @returns The sanitized text
 */
export function sanitizeHtmlTags(text: string): string {
    // Replace <br> and <br/> tags with newlines before sanitizing
    const textWithNewlines = text.replace(/<br\s*\/?>/gi, '\n');

    return sanitizeHtml(textWithNewlines, {
        allowedTags: ['b', 'i', 'u', 's', 'tg-spoiler', 'a', 'code', 'pre', 'blockquote'],
        allowedAttributes: {
            a: ['href'],
            code: ['class'],
            blockquote: ['expandable'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel', 'tg'],
        transformTags: {
            strong: 'b',
            em: 'i',
            ins: 'u',
            strike: 's',
            del: 's',
            a: (tagName, attribs) => {
                // Ensure href is present and valid
                if (!attribs.href) {
                    return { tagName: 'span', attribs: {} };
                }
                return { tagName, attribs };
            },
        },
    });
}

/**
 * Removes all HTML tags from text, returning plain text content
 * @param text The text to clean
 * @returns The text with all HTML tags removed
 */
export function cleanHtmlTags(text: string): string {
    // Replace <br> and <br/> tags with newlines before cleaning
    const textWithNewlines = text.replace(/<br\s*\/?>/gi, '\n');

    // Remove all HTML tags by sanitizing with no allowed tags
    const cleaned = sanitizeHtml(textWithNewlines, {
        allowedTags: [],
        allowedAttributes: {},
    });

    // Decode HTML entities to get plain text
    return cleaned
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ');
}
