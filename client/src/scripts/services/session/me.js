angular.module('futurism')

	.factory('me', function(UserResource, StatsResource) {
		'use strict';

		var me = {
			targetSite: 'j',
			loggedIn: false,
			userId: '',
			stats: {},
			user: {},

			setUserId: function(userId) {
				me.loggedIn = true;
				me.userId = userId;
				me.reload();
			},

			reload: function() {
				me.stats = StatsResource.save();
				me.user = UserResource.get({userId: me.userId});
			},

			clear: function() {
				me.loggedIn = false;
				me.stats = {};
				me.user = {};
			}
		};

		return me;
	});