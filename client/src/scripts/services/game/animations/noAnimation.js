angular.module('futurism')
	.factory('noAnimation', function(_, $rootScope) {
		'use strict';

		return {

			run: function(changes, callback) {
				_.delay(function() {
					$rootScope.$apply(function() {
						callback()
					});
				});
			}
		};
	});