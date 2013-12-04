angular.module('futurism')
	.factory('account', function() {
		'use strict';

		return {
			targetSite: 'j',
			loggedIn: false,
			site: null,
			userName: null,
			userId: null,
			avatar: null,
			token: null,
			group: null
		};

	});