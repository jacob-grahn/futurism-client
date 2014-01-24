var mongoose = require("mongoose");
var groups = require('../../shared/groups');
var isName = require('../validators/isName');


var UserSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		index: true
	},
	name: {
		type: String,
		validate: isName
	},
	site: {
		type: String,
		enum: ['j', 'g']
	},
	group: {
		type: String,
		enum: [groups.GUEST, groups.USER, groups.MOD, groups.ADMIN]
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
	fractures: {
		type: Number,
		min: 0,
		default: 5
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

var User = mongoose.model('User', UserSchema);
module.exports = User;