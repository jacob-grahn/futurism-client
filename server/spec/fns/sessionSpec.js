describe('session', function() {

	var redis = require("redis-mock");
	var session = require('../../fns/session');
	var client = redis.createClient();
	var token;

	client.setex = function(key, life, value, cb) {
		client.set(key, value, cb);
	};
	session.setRedis(client);


	it('should create a new session', function(done) {
		session.make({name:'Sue'}, function(err, result) {
			expect(err).toBe(null);
			expect(result.result).toBe('OK');
			token = result.token;
			done();
		});
	});


	it('should retrieve data from that session', function(done) {
		session.get(token, function(err, result) {
			expect(err).toBe(null);
			expect(result.name).toBe('Sue');
			done();
		});
	});


	it('should delete data', function(done) {
		session.destroy(token, function(err, result) {
			expect(err).toBe(null);
			expect(result).toBe(1);
			done();
		})
	});

});