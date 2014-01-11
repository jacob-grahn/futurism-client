/**
 * puts you first
 */

angular.module('futurism')
	.filter('meFirst', function(_, account) {
		'use strict';

		return function(arr) {
			return _.sortBy(arr, function(val) {
				if(val === account._id || val._id === account._id || val.userId === account._id) {
					return -1;
				}
				return 1;
			});
		};

	});