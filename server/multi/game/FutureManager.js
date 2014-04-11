'use strict';

var capitalism = require('./futures/capitalism');

module.exports = function(game) {

	var self = {

		curFuture: null,


		setFuture: function(futureId) {
			var future = self.idToFuture(futureId);

			if(self.curFuture) {
				self.curFuture.deactivate(game);
			}

			future.activate(game);
			self.curFuture = future;
		},


		idToFuture: function() {

		}

	};

	return self;

};