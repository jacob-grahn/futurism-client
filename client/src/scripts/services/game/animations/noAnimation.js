angular.module('futurism')
	.factory('noAnimation', function(_) {
		'use strict';

		return {

			run: function(changes, callback) {
				_.delay(function() {
					callback()
				});
			}
		};
	});