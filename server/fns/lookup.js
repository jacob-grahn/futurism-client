(function() {
	'use strict';

	var _ = require('lodash');


	var Lookup = function() {

		var storage = {};


		/**
		 * Delete an item from storage
		 * If the item has a remove() function, call it
		 * @param id
		 */
		var deleteId = function(id) {
			var val = storage[id];
			if(val) {
				if(_.isFunction(val.remove) && !val.removing) {
					val.removing = true;
					val.remove();
					val.removed = true;
				}
				delete storage[id];
			}
		};


		return {


			/**
			 * Lookup a value using its id
			 * @param id
			 * @returns {*}
			 */
			idToValue: function(id) {
				return storage[id];
			},


			/**
			 * Delete an item from storage
			 * @param id
			 */
			deleteId: deleteId,


			/**
			 * Delete items that fail an iterator
			 * @param iterator
			 */
			purge: function(iterator) {
				_.each(storage, function(val, key) {
					var result = iterator(val);
					if(!result) {
						deleteId(key);
					}
				});
			},


			/**
			 * Return to a pristine state
			 */
			clear: function() {
				storage = {};
			},


			/**
			 * Save a value to storage
			 */
			store: function(id, val) {
				deleteId(val);
				storage[id] = val;
			},


			/**
			 * Create an array of all stored values
			 * Keys are ignored
			 * @returns {array}
			 */
			toArray: function() {
				var arr = _.map(storage, function(value) {
					return value;
				});
				return arr;
			}
		}
	};


	module.exports = Lookup;

}());