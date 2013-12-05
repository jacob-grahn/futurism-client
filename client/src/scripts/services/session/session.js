angular.module('futurism')
	.factory('session', function($http, $location, async, websites, account) {
		'use strict';


		var sitesToTry = ['j', 'g'];
		var token = '';
		var tempCredentials;


		var getToken = function() {
			if(!token && typeof Storage !== 'undefined') {
				token = account.token = sessionStorage.getItem('token');
			}
			return token;
		};
		token = getToken();


		var setToken = function(tkn) {
			token = account.token = tkn;
			if(typeof Storage !== 'undefined') {
				sessionStorage.setItem('token', tkn);
			}
		};


		var create = function(callback) {
			async.series([
				_checkLogins,
				_authorizeLogin
			],
			function(error, arr) {
				var data = arr[1];
				if(error) {
					return callback(error);
				}

				account.loggedIn = true;
				account.userName = data.user_name;
				account.userId = data.user_id;
				account.avatar = data.avatar;
				account.site = data.site;
				account.token = data.token;
				account.group = data.group;

				setToken(data.token);

				return callback(null, data);
			});
		};


		var destroy = function(callback) {
			setToken(null);
			$http
				.delete('/api/token')
				.success(function(data) {callback(null, data);})
				.error(callback);
		};


		var _checkLogins = function(callback) {
			var i = 0;

			var checkNext = function() {
				if(i >= sitesToTry.length) {
					return callback('not logged into these sites: '+sitesToTry.join(','));
				}

				var site = sitesToTry[i];
				i++;

				var lookupFn = websites.lookup[site].loginFn;
				return lookupFn(checkResult);
			};

			var checkResult = function(error, tempCred) {
				if(error) {
					return checkNext();
				}
				tempCredentials = tempCred;
				return callback(null);
			};

			checkNext();
		};


		var _authorizeLogin = function(callback) {
			var strCred = encodeURIComponent(JSON.stringify(tempCredentials));
			$http
				.get('/api/token?user='+strCred)
				.success(function(data) {
					if(data.success) {
						return callback(null, data);
					}
					else {
						return callback(data.error);
					}
				})
				.error(callback);
		};


		return {
			create: create,
			destroy: destroy,
			getToken: getToken
		};

	});