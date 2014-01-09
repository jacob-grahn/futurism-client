(function() {
	'use strict';

	var RecordGoose = require('../../models/record');
	var _ = require('lodash');


	var recorder = function() {
		var self = this;

		self.users = [];
		self.actions = [];
		self.turns = 0;
		self.duration = 0;


		self.save = function(gameId, callback) {
			var doc = {
				_id: gameId,
				time: new Date,
				turns: self.turns,
				users: self.users,
				actions: self.actions
			};

			console.log('recorder::savingDoc', doc);
			RecordGoose.create({
				_id: gameId,
				time: new Date,
				turns: self.turns,
				users: self.users,
				actions: self.actions
			}, callback);
		};
	};

	module.exports = recorder;

}());