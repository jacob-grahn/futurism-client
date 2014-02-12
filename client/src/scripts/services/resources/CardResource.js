angular.module('futurism')
	.factory('CardResource', function($resource, formTransformer) {
		'use strict';

		var CardResource = $resource('/api/cards/:cardId', {userId:'@_id'}, {

			save: {
				method: 'POST',
				transformRequest: formTransformer,
				headers: {
					'Content-Type': undefined
				}
			}
		});

		return CardResource;
	});