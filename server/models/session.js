var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
	_id: {
		type: String,
		validate: validate('len', 32, 64)
	},
	value: {
		type: Schema.Types.Mixed
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60
	}
});

var Session = mongoose.model('Session', SessionSchema);
module.exports = Session;