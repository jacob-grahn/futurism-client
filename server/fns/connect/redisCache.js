module.exports = {
	store: require('./redisConnect')(),
	pub: require('./redisConnect')(),
	sub:  require('./redisConnect')()
};