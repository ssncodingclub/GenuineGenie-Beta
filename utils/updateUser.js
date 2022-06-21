const mongo = require('@root/database/mongo');
const userSchema = require('@schemas/userSchema');

module.exports = async (userId, diff) => {
    return await mongo().then(async (mongoose) => {
        try {
            let result = await userSchema
                .findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $set: {
                            name: diff.name,
                            userId: diff.userId,
                            coinBalance: diff.coins,
                            vaultCoins: diff.vault_coins,
                            vaultSize: diff.vault_size,
                            huntingBow: diff.hunting_bow,
                            fishingRod: diff.fishing_rod,
                            commandsCount: diff.commands_issued,
                            userXP: diff.xp,
                            userLevel: diff.level,
                        },
                    },
                    {
                        new: true,
                    }
                )
                .exec();
            return result;
        } finally {
            //mongoose.connection.close();
        }
    });
};
