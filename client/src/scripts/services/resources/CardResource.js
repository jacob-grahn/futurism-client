angular.module('futurism')
	.factory('CardResource', function($resource) {
		'use strict';

		var CardResource = $resource('/api/cards', {}, {

			save: {
				method: 'POST',
				transformRequest: function(request) {
					var formData = new FormData();
					for(var key in request) {
						if(request.hasOwnProperty(key) && key.charAt(0) !== '$') {
							var val = request[key];
							formData.append(key, val);
						}
					}
					return(formData);
				},
				headers: {
					'Content-Type': undefined
				}
			}
		});

		return CardResource;
	});