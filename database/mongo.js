const mongoose = require('mongoose');
const { mongoURL } = require('../config.json');

module.exports = async () => {
   mongoose.connect(encodeURI(mongoURL), {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
   });
   return mongoose;
};
