/* global describe, beforeEach, afterEach, it, expect */
'use strict';

var redisSession = require('../../../server/fns/redisSession');

describe('redisSession', function() {

	// connect to mock redis
	/*var redis = require("redis-mock");
	var client = redis.createClient();
	client.setex = function(key, life, value, cb) {
		client.set(key, value, cb);
	};*/

	// connect to redis for real
	var redis = require('redis');
	var client = redis.createClient();


	beforeEach(function(done) {
		client.flushdb();
		redisSession.connect(null, function() {
			done();
		});
	});


	afterEach(function() {
		redisSession.end();
	});


	it('should connect to a redis db if given proper credentials', function(done) {
		redisSession.connect(null, function(err) {
			expect(err).toBeFalsy();
			done();
		});
	});


	// this does work, but causes annoying address not found errors
	/*it('should return an error if it can not connect', function(done) {
		redisSession.connect('redis://user:pass@noredis.jiggmin.com:9678/', function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});*/


	it('should create a new session', function(done) {
		var userId = 'gcxf1231';
		redisSession.make(userId, {name:'Sue'}, function(err, result, token) {
			expect(err).toBe(null);
			expect(result).toBe('OK');
			expect(token).toBeTruthy();

			client.get(userId, function(err, doc) {
				expect(err).toBe(null);
				expect(JSON.parse(doc).token).toEqual(token);
				done();
			});
		});
	});


	describe('set', function() {
		it('should retrieve data from a session', function(done) {
			var token = 'abc-123';
			client.set('abc', JSON.stringify({token: token, name:'Billy'}), function(err, result) {
				expect(err).toBeFalsy();
				expect(result).toBe('OK');

				redisSession.get(token, function(err, result) {
					expect(err).toBe(null);
					expect(result.name).toBe('Billy');
					done();
				});
			});
		});


		it('should refuse a session if the token does not match', function(done) {
			var token = 'abc-123';
			client.set('abc', JSON.stringify({token: token, name:'Billy'}), function(err, result) {
				expect(err).toBeFalsy();
				expect(result).toBe('OK');

				redisSession.get('abc-456', function(err) {
					expect(err).toBeTruthy();
					done();
				});
			});
		});
	});


	describe('destroy', function() {

		it('should delete a session', function(done) {
			var token = 'abc-123';
			client.set('abc', JSON.stringify({token: token, name:'Billy'}), function(err, result) {
				expect(err).toBeFalsy();
				expect(result).toBe('OK');

				redisSession.destroy(token, function(err, result) {
					expect(err).toBe(null);
					expect(result).toBe(1);

					client.get('abc', function(err, doc) {
						expect(err).toBeFalsy();
						expect(doc).toBeFalsy();
						done();
					});
				});
			});
		});

		it('should not let you delete a session using an invalid token', function(done) {
			var token = 'abc-123';
			client.set('abc', JSON.stringify({token: token, name:'Billy'}), function(err, result) {
				expect(err).toBeFalsy();
				expect(result).toBe('OK');

				redisSession.destroy('abc-456', function(err) {
					expect(err).toBeTruthy();

					client.get('abc', function(err, doc) {
						expect(err).toBeFalsy();
						expect(JSON.parse(doc).name).toBe('Billy');
						done();
					});
				});
			});
		});
	});


});