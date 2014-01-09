(function() {
	'use strict';

	var mongoose = require("mongoose");
	var validate = require('mongoose-validator').validate;


	var RecordSchema = new mongoose.Schema({
		_id: {
			type: String,
			index: true,
			validate: validate('len', 3, 32)
		},
		time: {
			type: Date,
			default: Date.now
		},
		lastSeen: {
			type: Date,
			default: Date.now
		},
		turns: {
			type: Number,
			min: 0
		},
		duration: {
			type: Number,
			min: 0
		},
		users: [{
			_id: Number,
			name: String,
			site: String,
			group: String,
			elo: Number,
			oldElo: Number,
			fame: Number,
			oldFame: Number,
			fractures: Number,
			oldFractures: Number,
			deck: {
				name: String,
				cards: [String]
			}
		}],
		cards: [{
			_id: String,
			name: String,
			faction: String,
			attack: Number,
			health: Number,
			story: String,
			abilities: [String],
			hasImage: Boolean
		}],
		actions: [{
			id: String,
			p: Number,
			x: Number,
			y: Number
		}]
	});

	module.exports = mongoose.model('Record', RecordSchema);

}());