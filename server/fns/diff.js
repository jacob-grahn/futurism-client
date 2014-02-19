'use strict';

var _ = require('lodash');


/**
 * Return the difference between two objects
 * @param obj1
 * @param obj2
 * @returns {Object}
 */
var deepDiff = function(obj1, obj2) {

	if(obj1 !== null && obj2 === null) {
		return null;
	}

	var obj;

	if(_.isArray(obj2)) {
		obj = [];
	}
	else {
		obj = {};
	}

	// look for values in obj2 that do not match obj1
	_.each(obj2, function(val, key) {

		if(!obj1) {
			obj[key] = _.cloneDeep(obj2[key]);
			return;
		}

		if(typeof val === 'object') {
			var subDiff = deepDiff(obj1[key], obj2[key]);
			if(_.size(subDiff) > 0 || subDiff === null) {
				obj[key] = subDiff;
				return;
			}
		}

		else {
			if(obj1[key] !== obj2[key]) {
				obj[key] = obj2[key];
				return;
			}
		}
	});

	// look for values in obj1 that are not in obj2
	_.each(obj1, function(val, key) {
		if(typeof obj1[key] !== 'undefined' && typeof obj2[key] === 'undefined') {
			return obj[key] = null;
		}
	});

	return obj;
};

module.exports = deepDiff;