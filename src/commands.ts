import type { BotCommand } from 'grammy/types';

/**
 * Parses a string into an array of BotCommand objects
 * @param str The string to parse (format: "command - description")
 * @returns Array of BotCommand objects
 * @example
 * parseCommands('start - Start the bot\nhelp - Show help message')
 * // Returns: [{ command: 'start', description: 'Start the bot' }, { command: 'help', description: 'Show help message' }]
 */
export function parseCommands(str: string): BotCommand[] {
    const commands: BotCommand[] = [];

    for (const line of str.split('\n')) {
        const [command, ...descriptionArr] = line.split('-');

        if (!command || descriptionArr.length === 0) {
            continue;
        }

        const description = descriptionArr.join('-');

        commands.push({
            command: command.trim(),
            description: description.trim(),
        });
    }

    return commands;
}




