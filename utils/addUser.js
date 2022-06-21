const mongo = require('@root/database/mongo');
const userSchema = require('@schemas/userSchema');

module.exports = async(name,userId) => {
    return await new userSchema({name, userId})
}