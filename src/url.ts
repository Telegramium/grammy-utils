/**
 * Validates if a string is a valid URL
 * @param url The string to validate
 * @returns True if the string is a valid URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Creates a Telegram text message link with pre-filled text
 * @param username The Telegram username (without @)
 * @param text The text to pre-fill in the message
 * @returns The Telegram URL with text parameter and '+' replaced by '%20' (iOS compatibility fix)
 * @example
 * textMessageLink('durov', 'hello world') // Returns: 'https://t.me/durov?text=hello%20world'
 */
export function textMessageLink(username: string, text: string): string {
    const url = new URL(`https://t.me/${username}`);
    url.searchParams.set('text', text);
    // Replace '+' with '%20' in the URL (bug fix on iOS)
    return url.toString().replace(/\+/g, '%20');
}

