import { describe, it, expect } from 'vitest';
import { getBlockStatus } from '../src/chat';
import { Bot, Context } from 'grammy';

describe('getBlockStatus', () => {
    const createMockContext = (update: any): Context => {
        const bot = new Bot('test-token', {
            botInfo: { id: 1, is_bot: true, first_name: 'Test' } as any,
        });
        return new Context(update, bot.api, bot.botInfo);
    };

    it('should return isBlocked=true when bot is kicked', () => {
        const ctx = createMockContext({
            update_id: 1,
            my_chat_member: {
                chat: { id: 123, type: 'private' },
                from: { id: 456, is_bot: false, first_name: 'Test' },
                date: Date.now(),
                old_chat_member: { status: 'member', user: { id: 1, is_bot: true } },
                new_chat_member: { status: 'kicked', user: { id: 1, is_bot: true } },
            },
        });

        const status = getBlockStatus(ctx);
        expect(status).toEqual({ isBlocked: true, hasUnblocked: false });
    });

    it('should return hasUnblocked=true when bot is added back', () => {
        const ctx = createMockContext({
            update_id: 1,
            my_chat_member: {
                chat: { id: 123, type: 'private' },
                from: { id: 456, is_bot: false, first_name: 'Test' },
                date: Date.now(),
                old_chat_member: { status: 'kicked', user: { id: 1, is_bot: true } },
                new_chat_member: { status: 'member', user: { id: 1, is_bot: true } },
            },
        });

        const status = getBlockStatus(ctx);
        expect(status).toEqual({ isBlocked: false, hasUnblocked: true });
    });

    it('should return both false for role changes', () => {
        const ctx = createMockContext({
            update_id: 1,
            my_chat_member: {
                chat: { id: 123, type: 'group' },
                from: { id: 456, is_bot: false, first_name: 'Test' },
                date: Date.now(),
                old_chat_member: { status: 'member', user: { id: 1, is_bot: true } },
                new_chat_member: { status: 'administrator', user: { id: 1, is_bot: true } },
            },
        });

        const status = getBlockStatus(ctx);
        expect(status).toEqual({ isBlocked: false, hasUnblocked: false });
    });

    it('should return both false when myChatMember is missing', () => {
        const ctx = createMockContext({
            update_id: 1,
            message: { text: 'test' },
        });

        const status = getBlockStatus(ctx);
        expect(status).toEqual({ isBlocked: false, hasUnblocked: false });
    });
});

