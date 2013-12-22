angular.module('futurism')
	.factory('TokenResource', function($resource) {
		'use strict';

		var TokenResource = $resource('/api/tokens', {}, {
			update: {method: 'PUT'}
		});

		return TokenResource;
	});