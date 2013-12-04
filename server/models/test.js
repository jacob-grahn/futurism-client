var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TestSchema = new Schema({
	_id: {
		type: Schema.Types.Mixed
	},
	value: {
		type: Schema.Types.Mixed
	},
	updated: {
		type: Date
	}
});

var Test = mongoose.model('Test', TestSchema);
module.exports = Test;