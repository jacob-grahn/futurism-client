angular.module('futurism')
	.factory('rallyAnimation', function(_) {
		'use strict';

		var rlly = {

			run: function(changes, callback) {
				console.log('rallyAnimation animating', changes);
				_.delay(function() {
					console.log('rallyAnimation done');
					callback();
				}, 4000)
			}
		};

		return rlly;
	});