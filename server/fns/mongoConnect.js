module.exports = {
	connect: function(callback) {
		MongoClient = require('mongodb').MongoClient;
		MongoClient.connect(module.exports.getConnectAddr(), callback);
	},
	getConnectAddr: function() {
		return 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_HOST + '/futurism';
	}
};