(function() {
	'use strict';

	var mongoose = require("mongoose");
	var validate = require('mongoose-validator').validate;
	var sanitize = require('validator').sanitize;


	var RecordSchema = new mongoose.Schema({
		_id: {
			type: String,
			index: true,
			validate: validate('len', 1, 32)
		},
		time: {
			type: Date
		},
		turns: {
			type: Number
		},
		users: {
			type: Array
		},
		actions: {
			type: Array
		}
	});

	module.exports = mongoose.model('Record', RecordSchema);

}());