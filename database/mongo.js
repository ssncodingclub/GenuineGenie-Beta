const mongoose = require('mongoose');
//const { mongoURL } = require('../config.json');
const mongoURL = process.env.mongoURL;

module.exports = async () => {
   mongoose.connect(encodeURI(mongoURL), {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
   });
   return mongoose;
};
