angular.module('futurism')
	.factory('SessionResource', function($resource) {
		'use strict';

		var SessionResource = $resource('/globe/sessions', {}, {
			post: {method: 'POST'}
		});

		return SessionResource;
	});