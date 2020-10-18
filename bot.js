const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const { SQLiteProvider } = require('discord.js-commando')
const sqlite = require('sqlite')
const Client = require('./client/client')

// load local env configuration
const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (const k in envConfig) {
    process.env[k] = envConfig[k]
}

const isDev = global.isDev = process.argv.includes('-dev')

// create discord bot
const client = global.client = new Client({
    commandPrefix: process.env.BOT_COMMAND_PREFIX,
    owner: process.env.BOT_OWNER_ID.split(','),
    invite: process.env.BOT_INVITE_URL,
    disableMentions: 'everyone',
    feeds: [
        {
            url: 'https://hytale.game/p/index.rss',
            icon: 'https://hytale.com/favicon.ico',
            tags: ['game', 'hytale'],
            languages: ['fr'],
            channels: []
        },
        {
            url: 'https://minecraft.fr/feed/',
            icon: 'https://mtxserv.com/build/manager-game/img/game/minecraft.png',
            tags: ['game', 'minecraft'],
            languages: ['fr'],
            channels: []
        },
        {
            url: 'https://gmod.facepunch.com/rss/blog',
            icon: 'https://mtxserv.com/build/manager-game/img/game/garry-s-mod.png',
            tags: ['game', 'gmod'],
            languages: ['en'],
            channels: []
        },
        {
            url: 'https://rust.facepunch.com/rss/blog',
            icon: 'https://mtxserv.com/build/manager-game/img/game/rust.png',
            tags: ['game', 'rust'],
            languages: ['en'],
            channels: []
        },
        {
            url: 'https://sandbox.facepunch.com/rss/news',
            icon: null,
            tags: ['game', 'sandbox'],
            languages: ['en'],
            channels: []
        },
        {
            url: 'https://survivetheark.com/index.php?/rss/3-ark-news.xml/',
            icon: 'https://mtxserv.com/build/manager-game/img/game/ark.png',
            tags: ['game', 'ark'],
            languages: ['en'],
            channels: []
        },
        {
            url: 'https://ark-france.fr/rss/1-flux-rss-news.xml/',
            icon: 'https://mtxserv.com/build/manager-game/img/game/ark.png',
            tags: ['game', 'ark'],
            languages: ['fr'],
            channels: []
        }
    ]
});

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const eventFunction = require(`./events/${file}`);
        if (eventFunction.disabled) return;

        const event = eventFunction.event || file.split('.')[0];
        const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
        const { once } = eventFunction;

        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args));
        } catch (error) {
            console.error(error.stack);
        }
    });
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['mtxserv', 'Main'],
        ['bot', 'Bot'],
        ['news', 'News'],
        ['admin', 'Admin'],
        ['howto', 'How-To'],
        ['partner', 'Partner'],
        ['ark', 'ARK Server'],
        ['gmod', 'GMod Server'],
        ['minecraft', 'Minecraft Server'],
        ['gameserver', 'Game Server'],
        ['gameserverstatus', 'Game Server Status'],
        ['convert', 'Conversion'],
        ['image', 'Image'],
        ['random', 'Random'],
        ['util', 'Util'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))
;

client.login(isDev ? process.env.BOT_TOKEN_DEV : process.env.BOT_TOKEN)
