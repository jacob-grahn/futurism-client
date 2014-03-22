angular.module('futurism')
	.factory('session', function($location, $rootScope, websites, SessionResource, memory, _) {
		'use strict';

		var self = this;
		var active = false;
		var sitesToTry = ['j'];
		var tempCredentials;


		self.makeNew = _.throttle(function(callback) {
			if(!callback) {
				callback = defaultCallback;
			}

			checkLogins(function(err) {
				if(err) {
					tempCredentials = {site: 'g'};
				}

				createSession(function(err, data) {
					if(err) {
						return callback(err);
					}

					active = true;
					setToken(data.token);
					self.data = data;
					$rootScope.$broadcast('event:sessionChange', self.data);
					return callback(null, data);
				});
			});
		}, 5000);


		self.destroy = function() {
			SessionResource.delete({token: self.getToken()});
			setToken(null);
			active = false;
			self._id = null;
			self.data = {};
			$rootScope.$broadcast('event:sessionChange', self.data);
		};


		self.renew = _.throttle(function(callback) {
			var token = self.getToken();

			if(!callback) {
				callback = defaultCallback;
			}

			if(!token) {
				return self.makeNew(callback);
			}

			loadSession(token, function(err, data) {
				if(err) {
					return self.makeNew(callback);
				}

				active = true;
				self.data = data;
				$rootScope.$broadcast('event:sessionChange', self.data);

				return callback(null, data);
			});

		}, 5000, {leading: true, trailing: false});


		self.getToken = function() {
			var token = memory.short.get('token');
			if(token === 'null') {
				token = null;
			}
			return token;
		};


		var setToken = function(newToken) {
			memory.short.set('token', newToken);
		};


		var checkLogins = function(callback) {
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


		var createSession = function(callback) {
			SessionResource.post(tempCredentials,

				function(data) {
					if(data.error) {
						return callback(data.error);
					}
					return callback(null, data);
				},

				function(errResponse) {
					return callback(errResponse.data);
				});
		};


		var loadSession = function(token, callback) {
			SessionResource.get({token: token},

				function(data) {
					if(data.error) {
						return callback(data.error);
					}
					return callback(null, data);
				},

				function(errResponse) {
					return callback(errResponse.data);
				});
		};


		var defaultCallback = function(err) {
			if(err.error) {
				err = err.error;
			}

			if(err.ban) {
				$location.url('/users/'+err._id+'/bans');
			}
		};


		return self;
	});