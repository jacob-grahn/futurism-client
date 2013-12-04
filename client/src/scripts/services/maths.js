angular.module('futurism')
	.factory('maths', function() {
		return {
			RAD_DEG: 180 / Math.PI,
			DEG_RAD: Math.PI / 180
		}
	});