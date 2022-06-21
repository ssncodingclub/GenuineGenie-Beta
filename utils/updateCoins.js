const userSchema = require('@schemas/userSchema');

module.exports = async (userId, delta) => {
    return await userSchema
        .findOneAndUpdate(
            {
                userId,
            },
            {
                $inc: {
                    coinBalance: delta,
                },
            }
        )
        .exec();
};
