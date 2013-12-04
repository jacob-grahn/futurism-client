var mongoose = require("mongoose");
var validate = require('mongoose-validator').validate;
var groups = require('../../shared/groups');


var UserSchema = new mongoose.Schema({
	_id: {
		type: Number,
		index: true
	},
	name: {
		type: String,
		validate: validate('len', 1, 100)
	},
	site: {
		type: String,
		enum: ['j', 'g']
	},
	group: {
		type: String,
		validate: validate('isIn', [groups.GUEST, groups.USER, groups.MOD, groups.ADMIN])
	},
	elo: {
		type: Number,
		min: 0,
		max: 9999,
		default: 150
	},
	fame: {
		type: Number,
		min: 0,
		default: 0
	},
	rank: {
		type: Number,
		min: 0,
		default: 0
	},
	updated: {
		type: Date,
		default: Date.now
	},
	bannedUntil: {
		type: Date
	},
	silencedUntil: {
		type: Date
	}
});

var User = mongoose.model('User', UserSchema);
module.exports = User;