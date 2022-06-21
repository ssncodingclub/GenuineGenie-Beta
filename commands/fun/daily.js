const mongo = require('@root/database/mongo');
const userSchema = require('@schemas/userSchema');
const { Command } = require('discord.js-commando');

let claimedCache = [];

const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 20 * 60 * 1000);
};

module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily',
            group: 'fun',
            memberName: 'daily',
            description: 'get some fantastic daily rewards, coins, xp and what not?',
            examples: ['daily'],
        });
    }

    async run(message) {
        const { guild, member } = message;
        const { id } = member;
        const obj = {
            userId: id,
        };
        await mongo().then(async (mongoose) =>{
            try{
                const results = await userSchema.findOne(obj);
                if(results){
                    const then = new Date(results.dailyclaimtimestamp).getTime();
                    const now = new Date().getTime();

                    const diffTime = Math.abs(now - then);
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);
                    if (diffDays <= 1) {
                        claimedCache.push(id);
                        message.reply(`you have already claimed your **daily** rewards!`);
                        return;
                    }
                }
                var upd = {
					userId : id,
					dailyclaimtimestamp : new Date().getTime(),
				} 
                await userSchema.findOneAndUpdate(obj,upd, { new: true, upsert: true });

                // const coins = Math.floor(Math.random() * 500) + 500;
                // await updateCoins(message.author.id, coins);

                // const XP = Math.floor(Math.random() * 20) + 25;
                // await updateXP(message.author.id, XP, message);

                message.reply(`Daily Claimed`);
            } finally{

            }
        })
    }
};