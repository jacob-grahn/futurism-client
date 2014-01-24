'use strict';

var _ = require('lodash');

/**
 * Essentially an upsert with validation
 * Mongoose only validates when save is called, so this fetches the data then saves it.
 * @param {mongoose.Model} Model
 * @param {Object} conditions
 * @param {Object} data
 * @param {Function} callback
 */
var findOneAndSave = function(Model, conditions, data, callback) {

	//--- defaults
	conditions = conditions || {};
	data = data || {};
	callback = callback || function(){};


	//--- load the document
	Model.findOne(conditions, function(err, document) {
		if(err) {
			return callback(err);
		}

		document = document || new Model();

		//--- make sure _id is not accidentally changed
		if(document._id) {
			delete data.id;
			delete data._id;
		}
		document = _.extend(document, data);
		document.updated = Date.now();

		//--- save the document
		return document.save(function(err, document) {
			if(err) {
				return callback(err);
			}
			return callback(null, document);
		});
	});
};


/**
 * Extends mongoose to make findOneAndSave accessible on every document
 * example: Card.findOneAndSave({_id:123, val:'bear'}, function(err, document){});
 * @param mongoose
 */
findOneAndSave.attach = function(mongoose) {
	mongoose.Model.findOneAndSave = function(conditions, data, callback) {
		findOneAndSave(this, conditions, data, callback);
	};
};


module.exports = findOneAndSave;