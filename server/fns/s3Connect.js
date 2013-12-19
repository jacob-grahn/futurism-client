module.exports = function() {

	var AWS = require('aws-sdk');
	AWS.config.update({accessKeyId: process.env.S3_KEY, secretAccessKey: process.env.S3_SECRET_KEY});
	AWS.config.update({region: 'us-east-1'});

	var bucket = new AWS.S3({
		params: {
			Bucket: 'futurism-' + process.env.NODE_ENV
		}
	});

	return(bucket);

};