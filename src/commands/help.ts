import { AmethystCommand } from "amethystjs";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new AmethystCommand({
    name: 'help',
    description: "Display's help page",
    aliases: ['help-page', 'showhelp'],
    options: [
        {
            required: false,
            type: ApplicationCommandOptionType.String,
            name: 'command',
            autocomplete: true,
            description: "Command you want to see"
        },
        {
            required: false,
            name: 'types',
            description: "Command types you want to see",
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Messages',
                    value: 'msg'
                },
                {
                    name: 'Slash commands',
                    value: 'chatinput'
                },
                {
                    name: 'Both',
                    value: 'both'
                }
            ]
        }
    ]
})
.setMessageRun(({ message, options }) => {
    const first = (options.first ?? '').toLowerCase();
    const cmdsType = ['msg', 'message'].includes(first) ? 'message' : ['chatinput', 'slash', 'slashcommands'].includes(first) ? 'chatinput' : ['both', 'all'].includes(first) ? 'both' : 'both';

    let cmd: AmethystCommand;
    let type: 'none' | 'both' | 'msg' | 'slash' = 'none';

    if (options.first) {
        cmd = message.client.messageCommands.find(x => x.options.name === options.first.toLowerCase() || (x.options.aliases && x.options.aliases.includes(options.first.toLowerCase())));
        type = 'msg';
        const find = message.client.chatInputCommands.find(x => x.options.name === options.first.toLowerCase());

        if (!cmd) {
            cmd = find;
            type = 'slash';
        } else if (cmd && find) type = 'both';
    }
    if (cmd) {
        return message.reply({
            embeds: [ new EmbedBuilder()
                .setTitle(`Command ${cmd.options.name}`)
                .setDescription(`${cmd.options.description}`)
                .setFields(
                    {
                        name: 'Cooldown',
                        value: `${cmd.options.cooldown ?? message.client.configs.defaultCooldownTime} seconds`,
                        inline: true
                    },
                    {
                        name: 'Aliases',
                        value: `${cmd.options.aliases ? cmd.options.aliases.length > 0 ? cmd.options.aliases.join(' ') : 'No aliases' : 'No aliases'}`,
                        inline: true
                    },
                    {
                        name: 'Type',
                        value: type === 'both' ? 'Slash commands and message' : type === 'msg' ? 'Message' : type === 'slash' ? 'Slash commands' : 'None',
                        inline: true
                    }
                )
            ]
        })
    }

    const map = (commands: AmethystCommand[], embed: EmbedBuilder, type: 'msg' | 'chatinput'): EmbedBuilder => {
        embed.setDescription(commands.map(x => `\`${type === 'msg' ? message.client.configs.prefix : '/'}${x.options.name}\` : ${x.options.description}`).join('\n'));
        return embed;
    }
    const embed = (type: 'msg' | 'chatinput') => {
        return new EmbedBuilder()
            .setTitle(type === 'msg' ? 'Commands' : 'Slash commands')
            .setColor('Orange')
            .setTimestamp()
    }

    const embeds: EmbedBuilder[] = [];
    if (cmdsType === 'both') embeds.push(map(message.client.messageCommands, embed('msg'), 'msg'), map(message.client.chatInputCommands, embed('chatinput'), 'chatinput'));
    if (cmdsType === 'chatinput') embeds.push(map(message.client.chatInputCommands, embed('chatinput'), 'chatinput'));
    if (cmdsType === 'message') embeds.push(map(message.client.messageCommands, embed('msg'), 'msg'));

    message.reply({
        embeds
    });
})