const mTxServCommand = require('../mTxServCommand.js')
const GameSoftwareApi = require('../../api/GameSoftwareApi')
const Discord = require('discord.js')

module.exports = class GameSoftwareMohistCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'mohist',
            group: 'minecraft',
            memberName: 'mohist',
            description: 'Show Mohist version.',
            clientPermissions: ['SEND_MESSAGES'],
        });
    }

    async run(msg) {
        const userLang = this.getLangOfMember(msg.member);
        const lang = require(`../../languages/${userLang}.json`);
        const baseUrl = userLang == 'fr' ? 'https://mtxserv.com/fr/minecraft-versions': 'https://mtxserv.com/minecraft-versions';

        const query = 'Mohist';
        const api = new GameSoftwareApi()
        const results = await api.search('minecraft', query)
        const softwares = Object.values(results);

        if (!softwares.length) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`:mag: ${lang['software_search']['search']} *${query}*`)
                .setColor('RED')
                .addField(lang['software_search']['no_result'], `${lang['how_to']['check']} <${baseUrl}>`)
            ;

            return msg.say({
                embed
            });
        }

        const embed = api.generateSoftwareEmbed(softwares[0], userLang, baseUrl)

        return msg.say({
            embed
        });
    }
};