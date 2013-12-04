(function() {
	'use strict';

	module.exports = function(req, res, next) {
		try {
			next();
		}
		catch(err) {
			var retErr;
			if(err.stack) {
				retErr = {
					type: err.toString(),
					stack: err.stack
				}
			}
			else {
				retErr = err;
			}
			res.apiOut(retErr, null);
		}
	}

}());