const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const userSchema = mongoose.Schema({
	name: reqString,
    userId : reqString,
	hourlyClaimtTimestamp : {
        type: Number,
        default: 0,
    },
	dailyClaimTimestamp : {
        type: Number,
        default: 0,
    },
	weeklyClaimTimestamp : {
        type: Number,
        default: 0,
    },
	lastPlunderTimestamp : {
        type: Number,
        default: 0,
    },
	coinBalance : {
        type: Number,
        default: 500,
    },
	vaultCoins : {
        type: Number,
        default: 500,
    },
	vaultSize : {
        type: Number,
        default: 500,
    },
	items: {
        type: String,
        default: JSON.stringify({}),
    },
	userXP : {
        type: Number,
        default: 0,
    },
	userLevel : {
        type: Number,
        default: 0,
    },
	userHP : {
        type: Number,
        default: 0,
    },
	userAtk : {
        type: Number,
        default: 0,
    },
	userDef : {
        type: Number,
        default: 0,
    },
	itemCount : {
        type: Number,
        default: 0,
    },
	commandsCount : {
        type: Number,
        default: 0,
    },
	huntedCount : {
        type: Number,
        default: 0,
    },
	fishedCount : {
        type: Number,
        default: 0,
    },
	huntingBow : Boolean,
	fishingRod: Boolean,
	moodleUserId : String, 
	moodleAPIkey : String
  },
  {
	  timestamps: true,
  });

module.exports = mongoose.model('user', userSchema);
