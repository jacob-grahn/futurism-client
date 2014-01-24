/* jshint maxparams: false */

'use strict';


/**
 * Call validate on data before submitting an update
 * example: validatedUpdate(Book, {_id:1}, {title:'It Could be Worse'}, {upsert: true}, function(err, numberAffected, raw) {});
 * @param Model
 * @param {Object} conditions
 * @param {Object} update
 * @param {Object} options
 * @param {Function} callback
 */
var validatedUpdate = function(Model, conditions, update, options, callback) {
	var doc = new Model(update);
	doc.validate(function(err) {
		if(err) {
			return callback(err);
		}
		return Model.update(conditions, update, options, callback);
	});
};


/**
 * Extends mongoose to make validatedUpdate accessible on every document
 * example: Card.validatedUpdate({_id:123}, {val:'bear'}, {multi: false}, function(err, numberAffected, raw){});
 * @param mongoose
 */
validatedUpdate.attach = function(mongoose) {
	mongoose.Model.validatedUpdate = function(conditions, update, options, callback) {
		validatedUpdate(this, conditions, update, options, callback);
	};
};


module.exports = validatedUpdate;