const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const guildSchema = mongoose.Schema({
    serverid : reqString,
	prefix : {type:String, default: "rub"},
	welcomechannelid : String,
	welcomechanneltext : String,
	verificationchannelid : String, 
	verificationroleid : String,
	thankschannelid : String,
	suggestionschannelid : String,
	roleclaimchannelid : String,
	roleclaimemojirolemapping : [String],
	modlogchannelid : String,
	mutedusers : [String],
	moderatorroleid : String,
  },
  {
	  timestamps: true,
  });

module.exports = mongoose.model('guild', guildSchema);
