(function() {
	'use strict';

	var _ = require('lodash');


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

		_.each(obj2, function(val, key) {

			if(typeof val === 'object') {
				var subDiff = deepDiff(obj1[key], obj2[key]);
				console.log('subDiff', subDiff);
				if(_.size(subDiff) > 0 || subDiff === null) {
					console.log('accepted');
					obj[key] = subDiff;
				}
			}

			else {
				if(obj1[key] !== obj2[key]) {
					obj[key] = obj2[key];
				}
			}
		});

		return obj;
	};

	module.exports = deepDiff;

}());