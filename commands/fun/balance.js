const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const getUser = require('@utils/getUser');
// Array of member IDs who have claimed their daily rewards in the last 24hrs
// Resets every 10 mins
let claimedCache = [];

const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 20 * 60 * 1000);
};

clearCache();

module.exports = class balanceCommand extends (
    Commando.Command
) {
    constructor(client) {
        super(client, {
            name: 'bal',
            aliases: ['balance'],
            group: 'fun',
            memberName: 'bal',
            description: 'Displays the balance of a user',
            format: "<user's @>",
            throttling: {
                usages: 3,
                duration: 10,
            },
            argsType: 'multiple',
        });
    }

    async run(message) {
        const target = message.mentions.users.first() || message.author;
        const targetId = target.id;
        const name = target.username;
        const result = await getUser(targetId, name)
        let desc = `coins:\t **${result.coinBalance}**`;
        desc += `\nvault:\t **${result.vaultCoins}/${result.vaultSize}**`;
        const embed = new Discord.MessageEmbed().setTitle(`${name}'s richness`).setDescription(desc);
        //message.channel.send(`<@${targetId}> has **${coins}** coins`);
        message.channel.send(embed);
    }
};
