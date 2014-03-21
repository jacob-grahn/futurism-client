angular.module('futurism')
	.factory('unread', function($timeout, UnreadResource, session) {
		'use strict';


		/**
		 * Private
		 */
		var freq = 1000 * 60; // one minute
		var promise;

		var doneWaiting = function() {
			promise = $timeout(doneWaiting, freq);
			unread.refresh();
		};


		/**
		 * Public
		 */
		var unread = {

			count: 0,

			start: function() {
				unread.stop();
				doneWaiting();
			},

			stop: function() {
				$timeout.cancel(promise);
			},

			refresh: function() {
				if(session.active) {
					var newCount = UnreadResource.get({}, function() {
						unread.count = Number(newCount[0]);
					});
				}
			}
		};

		return unread;
	});