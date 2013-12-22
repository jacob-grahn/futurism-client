angular.module('futurism')
	.factory('account', function() {
		'use strict';

		return {
			targetSite: 'j',
			loggedIn: false
		};

	});