module.exports = function() {
	var redis = require("redis");
	var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {auth_pass:process.env.REDIS_PASS});
	return(redisClient);
};