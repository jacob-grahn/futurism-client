(function() {
	'use strict';

	var fns = {

		/**
		 * Remove all instances of val from arr
		 * @param {Array} arr
		 * @param {*} val
		 * @returns {Array}
		 */
		removeFromArray: function(arr, val) {
			var index = arr.indexOf(val);
			while(index !== -1) {
				arr.splice(index, 1);
				index = arr.indexOf(val);
			}
			return arr;
		},

		/**
		 * Remove matches where func returns true
		 * @param arr
		 * @param func
		 * @returns {Array}
		 */
		removeFromArrayFunc: function(arr, func) {
			for(var i=0; i<arr.length; i++) {
				if(func(arr[i])) {
					arr.splice(i, 1);
				}
			}
			return arr;
		}
	};

	if (typeof module !== 'undefined') {
		module.exports = fns;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.fns = fns;
	}
}());