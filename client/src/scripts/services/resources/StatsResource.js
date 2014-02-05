angular.module('futurism')
	.factory('StatsResource', function($resource) {
		'use strict';
		return $resource('/api/stats/:userId', {}, {});
	});