var mongoose = require('mongoose');

var StatsSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		index: true
	},
	elo: {
		type: Number,
		min: 0,
		max: 9999,
		default: 150
	},
	fame: {
		type: Number,
		min: 0,
		default: 0
	},
	fractures: {
		type: Number,
		min: 0,
		default: 5
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

var Stats = mongoose.model('Stats', StatsSchema);
module.exports = Stats;