const mongo = require('@root/database/mongo');
const userSchema = require('@schemas/userschema');

module.exports = async (userId, delta) => {
    return await mongo().then(async (mongoose) => {
        try {
            let result = await userSchema
                .findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            vaultCoins: +delta,
                            coinBalance: -delta,
                        },
                    }
                )
                .exec();
            return result;
        } finally {
            //mongoose.connection.close();
        }
    });
};
