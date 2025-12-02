/**
 * Formats a number with thousand separators
 * @param num The number to format
 * @param locale The locale to use (default: 'en-US'). Supports BCP 47 language tags (e.g., 'en-US', 'ru-RU'), ISO 639-1 language codes (e.g., 'en', 'ru'), or Telegram format (e.g., 'en_US', 'ru_RU')
 * @returns The formatted number string
 * @example
 * formatNumber(1234567) // Returns: "1,234,567"
 * formatNumber(1234567, 'ru') // Returns: "1 234 567" (Russian formatting)
 * formatNumber(1234567, 'en_US') // Returns: "1,234,567" (Telegram format)
 * formatNumber(1234567, 'en-US') // Returns: "1,234,567"
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
    // Convert Telegram's underscore format (en_US) to BCP 47 format (en-US)
    const normalizedLocale = locale.replace(/_/g, '-');
    return num.toLocaleString(normalizedLocale);
}

/**
 * Formats a date according to the specified locale
 * @param date The date to format (Date object, timestamp, or date string)
 * @param locale The locale to use (default: 'en-US'). Supports BCP 47 language tags or Telegram format
 * @param options Intl.DateTimeFormatOptions for custom formatting
 * @returns The formatted date string
 * @example
 * formatDate(new Date(), 'en') // Returns: "12/2/2024" (US format)
 * formatDate(new Date(), 'ru') // Returns: "02.12.2024" (Russian format)
 * formatDate(new Date(), 'en', { dateStyle: 'full' }) // Returns: "Monday, December 2, 2024"
 */
export function formatDate(
    date: Date | number | string,
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions
): string {
    const normalizedLocale = locale.replace(/_/g, '-');
    const dateObj = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(normalizedLocale, options).format(dateObj);
}

/**
 * Formats a date as relative time (e.g., "2 hours ago", "in 3 days")
 * @param date The date to format (Date object, timestamp, or date string)
 * @param locale The locale to use (default: 'en-US'). Supports BCP 47 language tags or Telegram format
 * @returns The relative time string
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000), 'en') // Returns: "1 hour ago"
 * formatRelativeTime(new Date(Date.now() + 86400000), 'ru') // Returns: "через 1 день"
 */
export function formatRelativeTime(
    date: Date | number | string,
    locale: string = 'en-US'
): string {
    const normalizedLocale = locale.replace(/_/g, '-');
    const dateObj = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
    const rtf = new Intl.RelativeTimeFormat(normalizedLocale, { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

    const intervals = [
        { unit: 'year' as const, seconds: 31536000 },
        { unit: 'month' as const, seconds: 2592000 },
        { unit: 'week' as const, seconds: 604800 },
        { unit: 'day' as const, seconds: 86400 },
        { unit: 'hour' as const, seconds: 3600 },
        { unit: 'minute' as const, seconds: 60 },
        { unit: 'second' as const, seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
        if (count >= 1) {
            return rtf.format(diffInSeconds > 0 ? count : -count, interval.unit);
        }
    }

    return rtf.format(0, 'second');
}

/**
 * Formats a currency value according to the specified locale and currency
 * @param amount The amount to format
 * @param currency The currency code (e.g., 'USD', 'EUR', 'RUB')
 * @param locale The locale to use (default: 'en-US'). Supports BCP 47 language tags or Telegram format
 * @returns The formatted currency string
 * @example
 * formatCurrency(1234.56, 'USD', 'en') // Returns: "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'ru') // Returns: "1 234,56 €"
 * formatCurrency(1234.56, 'RUB', 'ru') // Returns: "1 234,56 ₽"
 */
export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    const normalizedLocale = locale.replace(/_/g, '-');
    return new Intl.NumberFormat(normalizedLocale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
