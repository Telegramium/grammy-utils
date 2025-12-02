import { Composer, type Context } from 'grammy';

/**
 * Middleware composer with utility commands for debugging and bot management
 */
export const debugCommands = new Composer<Context>();

// Clear keyboard from the screen
debugCommands.command(
    [
        'resetkb',
        'resetkeyboard',
        'clearkb',
        'clearkeyboard',
        'removekb',
        'removekeyboard',
    ],
    async (ctx) =>
        ctx.reply('🗑 Keyboard has been removed!', {
            reply_markup: {
                remove_keyboard: true,
            },
        })
);

// Ping ms
debugCommands.command('ping', async (ctx) => {
    const start = Date.now();
    const pong = await ctx.reply('🏓 Pong!');
    const end = Date.now();
    await ctx.api.editMessageText(
        pong.chat.id,
        pong.message_id,
        `${pong.text}\n<blockquote>⏱ <b>${end - start}ms</b></blockquote>`,
        { parse_mode: 'HTML' }
    );
});

// User's id
debugCommands.command('myid', async (ctx) => {
    if (!ctx.from) return;
    await ctx.reply(`<b>Your ID:</b> <code>${ctx.from.id}</code>`, {
        parse_mode: 'HTML',
    });
});

// Chat's id
debugCommands.command('chatid', async (ctx) => {
    if (ctx.chat.type === 'private') {
        await ctx.reply(
            '⚠️ This command only works in groups and channels'
        );
        return;
    }
    await ctx.reply(`<b>Chat ID:</b> <code>${ctx.chat.id}</code>`, {
        parse_mode: 'HTML',
    });
});

// User object dump
debugCommands.command(['dumpuser', 'userdump'], async (ctx) => {
    if (!ctx.from) return;
    await ctx.reply(`<pre>${JSON.stringify(ctx.from, null, 2)}</pre>`, {
        parse_mode: 'HTML',
    });
});

// Chat object dump
debugCommands.command(['dumpchat', 'chatdump'], async (ctx) => {
    await ctx.reply(`<pre>${JSON.stringify(ctx.chat, null, 2)}</pre>`, {
        parse_mode: 'HTML',
    });
});

// Bot object dump
debugCommands.command(['dumpbot', 'botdump'], async (ctx) => {
    const botInfo = ctx.me;
    await ctx.reply(`<pre>${JSON.stringify(botInfo, null, 2)}</pre>`, {
        parse_mode: 'HTML',
    });
});

// Reply message object dump
debugCommands.command(['dumpreply', 'replydump']).filter(
    (ctx) => !!ctx.msg.reply_to_message,
    async (ctx) => {
        const reply = ctx.msg.reply_to_message;
        if (!reply) return;
        await ctx.reply(`<pre>${JSON.stringify(reply, null, 2)}</pre>`, {
            parse_mode: 'HTML',
        });

        // If contains a file, get the file info
        const file = reply.document || reply.photo?.[0] || reply.video;
        if (file) {
            try {
                const fileInfo = await ctx.api.getFile(file.file_id);
                await ctx.reply(
                    `<b>File info:</b>\n<pre>${JSON.stringify(fileInfo, null, 2)}</pre>`,
                    {
                        parse_mode: 'HTML',
                    }
                );
            } catch {
                await ctx.reply(`❌ Could not get file info.`);
            }
        }
    }
);

// List all bot commands
debugCommands.command(['getcommands', 'listcommands'], async (ctx) => {
    const commands = await ctx.api.getMyCommands();
    const commandList = commands
        .map((cmd) => `<b>/${cmd.command}</b> — ${cmd.description}`)
        .join('\n');

    await ctx.reply(`<blockquote>${commandList}</blockquote>`, {
        parse_mode: 'HTML',
    });
});

// Get chat member count
debugCommands.command(['membercount', 'chatsize'], async (ctx) => {
    if (ctx.chat.type === 'private') {
        await ctx.reply(
            '⚠️ This command only works in groups and channels'
        );
        return;
    }
    try {
        const count = await ctx.api.getChatMemberCount(ctx.chat.id);
        await ctx.reply(`👥 This chat has <b>${count}</b> members`, {
            parse_mode: 'HTML',
        });
    } catch {
        await ctx.reply('❌ Could not get member count');
    }
});

// Get chat permissions
debugCommands.command(['permissions', 'chatperms'], async (ctx) => {
    if (ctx.chat.type === 'private') {
        await ctx.reply('⚠️ This command only works in groups');
        return;
    }
    try {
        const chat = await ctx.api.getChat(ctx.chat.id);
        if (!('permissions' in chat) || !chat.permissions) {
            await ctx.reply('❌ Could not get chat permissions');
            return;
        }
        await ctx.reply(
            `<b>Chat Permissions:</b>\n<pre>${JSON.stringify(chat.permissions, null, 2)}</pre>`,
            { parse_mode: 'HTML' }
        );
    } catch {
        await ctx.reply('❌ Could not get chat permissions');
    }
});




