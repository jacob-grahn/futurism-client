(function() {
	'use strict';

	var mongoose = require("mongoose");
	var validate = require('mongoose-validator').validate;
	var sanitize = require('validator').sanitize;


	var DeckSchema = new mongoose.Schema({
		_id: {
			type: String,
			index: true,
			validate: validate('len', 1, 25)
		},
		name: {
			type: String,
			required: true,
			trim: true,
			set: function(val) { return(sanitize(val).xss()); }
		},
		userId: {
			type: Number,
			required: true,
			set: Math.round,
			min: 0,
			ref: 'User'
		},
		cards: [{
			type: String,
			required: true,
			ref: 'Card',
			validate: validate('len', 10, 30)
		}],
		pride: {
			type: Number,
			min: 0,
			default: 0
		}
	});

	//check(deck.cards.length, 'card should be an array containing no more than 100 values').min(0).max(100);

	module.exports = mongoose.model('Deck', DeckSchema);

}());