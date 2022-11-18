import { AmethystClient } from "amethystjs";
import { Partials } from "discord.js";

export const client = new AmethystClient({
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    partials: [Partials.Channel, Partials.Message]
}, {
    token: process.env.token,
    prefix: '!',
    strictPrefix: false,
    botName: 'amethyst',
    botNameWorksAsPrefix: true,
    mentionWorksAsPrefix: true,
    commandsFolder: './dist/commands',
    eventsFolder: './dist/events',
    autocompleteListenersFolder: './dist/autocompletes',
    debug: true
});

client.start({});