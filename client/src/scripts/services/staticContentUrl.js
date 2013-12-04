angular.module('futurism')
	.factory('staticContentUrl', function() {
		var urlBase = location.href.substring(0, location.href.lastIndexOf("/")+1);
		var staticContentUrl;

		if(urlBase.indexOf('production') !== -1) {
			staticContentUrl = 'http://futurism-production.s3-website-us-east-1.amazonaws.com';
		}
		else if(urlBase.indexOf('staging') !== -1) {
			staticContentUrl = 'http://futurism-staging.s3-website-us-east-1.amazonaws.com';
		}
		else {
			staticContentUrl = 'http://futurism-development.s3-website-us-east-1.amazonaws.com';
		}

		return staticContentUrl;
	});