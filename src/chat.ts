import type { Context } from 'grammy';

/**
 * Extracts block/unblock status from my_chat_member update
 * @param ctx The context from my_chat_member update
 * @returns Object with isBlocked and hasUnblocked boolean values (both false if not applicable)
 * @example
 * bot.on('my_chat_member', (ctx) => {
 *   const status = getBlockStatus(ctx);
 *   if (status.isBlocked) {
 *     // Handle block
 *   }
 *   if (status.hasUnblocked) {
 *     // Handle unblock
 *   }
 * })
 */
export function getBlockStatus(ctx: Context): {
    isBlocked: boolean;
    hasUnblocked: boolean;
} {
    if (!ctx.myChatMember) {
        return { isBlocked: false, hasUnblocked: false };
    }

    const { old_chat_member, new_chat_member } = ctx.myChatMember;

    // Check if the user has blocked or stopped the bot
    // This happens when status changes from 'member' to 'kicked' or 'left'
    const isBlocked =
        old_chat_member.status === 'member' &&
        (new_chat_member.status === 'kicked' || new_chat_member.status === 'left');

    // Check if the user has unblocked or restarted the bot
    const hasUnblocked =
        (old_chat_member.status === 'kicked' || old_chat_member.status === 'left') &&
        new_chat_member.status === 'member';

    return { isBlocked, hasUnblocked };
}
