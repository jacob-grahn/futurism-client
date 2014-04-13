'use strict';

var _ = require('lodash');
var Recorder = require('../Recorder');


var self = {


	activate: function(game) {
		game.recorder = new Recorder();
		game.eventEmitter.on(game.END, self.saveRecord);
	},


	deactivate: function(game) {
		game.eventEmitter.removeListener(game.END, self.saveRecord);
	},


	/**
	* save a record of this game
	*/
	saveRecord: function(game) {
		game.recorder.users = game.players;
		game.recorder.save(game._id, function(err, doc) {
			if(err) {
				game.emit('error', err);
			}
	});
}

};

module.exports = self;