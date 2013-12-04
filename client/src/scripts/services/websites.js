angular.module('futurism')
	.factory('websites', ['$http', function($http) {
		'use strict';


		var checkJiggLogin = function(callback) {
			$http
				.jsonp('https://jiggmin.com/-who-am-i.php?callback=JSON_CALLBACK')
				.success(function(data) {
					if(data.logged_in) {
						data.site = 'j';
						return callback(null, data);
					}
					else {
						return callback('not logged into jiggmin.com');
					}
				})
				.error(callback);
		};


		var checkGuestLogin = function(callback) {
			$http
				.jsonp('https://guestville.jiggmin.com/guest-login.php?callback=JSON_CALLBACK')
				.success(
				function(data) {
					if(data.success) {
						data.site = 'g';
						return callback(null, data);
					}
					else {
						return callback('not logged into guestville..?');
					}
				})
				.error(callback);
		};


		var lookup = {
			a: {
				name: 'armor games',
				loginFn: null,
				icon: '/images/sites/a.png'
			},
			f: {
				name: 'facebook',
				loginFn: null,
				icon: '/images/sites/f.png'
			},
			n: {
				name: 'newgrounds',
				loginFn: null,
				icon: '/images/sites/n.png'
			},
			j: {
				name: 'jiggmin',
				loginFn: checkJiggLogin,
				icon: '/images/sites/j.png'
			},
			g: {
				name: 'guestville',
				loginFn: checkGuestLogin,
				icon: '/images/sites/g.png'
			}
		};


		return {
			checkJiggLogin: checkJiggLogin,
			checkGuestLogin: checkGuestLogin,
			lookup: lookup
		};

	}]);