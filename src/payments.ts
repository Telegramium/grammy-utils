/**
 * Converts Telegram Stars to USD
 * @param stars The number of Telegram Stars
 * @returns The equivalent amount in USD
 * @example
 * convertStarsToUsd(50) // Returns: 1
 * convertStarsToUsd(100) // Returns: 2
 * convertStarsToUsd(25) // Returns: 0.5
 */
export function convertStarsToUsd(stars: number): number {
    return Math.round((stars / 50) * 100) / 100;
}

/**
 * Converts USD to Telegram Stars
 * @param usd The amount in USD
 * @returns The equivalent number of Telegram Stars
 * @example
 * convertUsdToStars(1) // Returns: 50
 * convertUsdToStars(2) // Returns: 100
 * convertUsdToStars(0.5) // Returns: 25
 */

