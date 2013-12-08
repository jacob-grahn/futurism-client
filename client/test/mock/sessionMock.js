(function() {
	'use strict';

	window.sessionMock = {
		create: function(callback) {
			return callback(null);
		},
		destroy: function(){

		},
		getToken: function() {
			return 'yaimatoken';
		}
	};

}());