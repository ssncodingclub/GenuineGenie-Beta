const mongo = require("@root/database/mongo");
const userSchema = require("@schemas/userSchema");
const addUser = require("./addUser");

module.exports = async (userId, name) => {
  const obj = {
    userId: userId,
  };
  let  res = await mongo().then(async (mongoose) => {
    let res = await userSchema.findOne(obj);
    if (res == undefined) {
      res = await addUser(name, userId);
    }
    return res;
  });
  return res
};
