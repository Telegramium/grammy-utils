import { describe, it, expect } from 'vitest';
import { parseCommands } from '../src/commands';

describe('parseCommands', () => {
    it('should parse commands from string', () => {
        const str = 'start - Start the bot\nhelp - Show help message';
        const result = parseCommands(str);
        expect(result).toEqual([
            { command: 'start', description: 'Start the bot' },
            { command: 'help', description: 'Show help message' },
        ]);
    });

    it('should handle single command', () => {
        const str = 'start - Start the bot';
        const result = parseCommands(str);
        expect(result).toEqual([
            { command: 'start', description: 'Start the bot' },
        ]);
    });

    it('should handle commands with multiple dashes in description', () => {
        const str = 'test - This is a - test description';
        const result = parseCommands(str);
        expect(result).toEqual([
            { command: 'test', description: 'This is a - test description' },
        ]);
    });

    it('should skip invalid lines', () => {
        const str = 'start - Start\ninvalid\nhelp - Help';
        const result = parseCommands(str);
        expect(result).toEqual([
            { command: 'start', description: 'Start' },
            { command: 'help', description: 'Help' },
        ]);
    });

    it('should handle empty string', () => {
        expect(parseCommands('')).toEqual([]);
    });

    it('should trim whitespace', () => {
        const str = '  start  -  Start the bot  ';
        const result = parseCommands(str);
        expect(result).toEqual([
            { command: 'start', description: 'Start the bot' },
        ]);
    });
});



