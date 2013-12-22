var _ = require('lodash');

/**
 * Essentially an upsert with validation
 * Mongoose only validates when save is called, so this fetches the data then saves it.
 * @param {mongoose.Model} Model
 * @param {object} data
 * @param {function} callback
 */
module.exports = function(Model, data, callback) {
	'use strict';

	//--- defaults
	data = data || {};
	callback = callback || function(){};

	//--- get the id
	var id = data._id || data.id;
	data._id = id;
	if(typeof id === 'undefined') {
		return callback('an id is required');
	}

	//--- load the card
	Model.findById(id, function(err, document) {
		if(err) {
			return callback(err);
		}
		document = document || new Model();
		document = _.extend(document, data);
		document.updated = Date.now();
		document._id = id;

		//--- save the card
		document.save(function(err, document) {
			if(err) {
				return callback(err);
			}
			return callback(null, document);
		});
	});

};


/**
 * Doesn't work with mockgoose
 * Extends mongoose to make the findByIdAndSave function easy to access
 * example: Card.findByIdAndSave({_id:123, val:'bear'}, function(err, document){});
 * @param {object} data
 * @param {function} callback
 */
/*var mongoose = require('mongoose');
mongoose.Model.findByIdAndSave = function(data, callback) {
	module.exports(this, data, callback);
};*/