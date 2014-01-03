(function() {
	'use strict';

	var _ = require('lodash');


	/**
	 * Return the difference between two objects
	 * @param obj1
	 * @param obj2
	 * @returns {Object}
	 */
	var deepDiff = function(obj1, obj2) {

		var obj;

		if(obj1 !== null && obj2 === null) {
			return null;
		}

		if(_.isArray(obj2)) {
			obj = [];
		}
		else {
			obj = {};
		}

		// look for values in obj2 that do not match obj1
		_.each(obj2, function(val, key) {

			if(typeof val === 'object') {

				if(!obj1) {
					obj[key] = _.cloneDeep(obj2[key]);
				}

				else {
					var subDiff = deepDiff(obj1[key], obj2[key]);
					if(_.size(subDiff) > 0 || subDiff === null) {
						obj[key] = subDiff;
					}
				}
			}

			else {
				if(obj1[key] !== obj2[key]) {
					obj[key] = obj2[key];
				}
			}
		});

		// look for values in obj1 that are not in obj2
		_.each(obj1, function(val, key) {
			if(typeof obj2[key] === 'undefined') {
				obj[key] = null;
			}
		});

		return obj;
	};

	module.exports = deepDiff;

}());