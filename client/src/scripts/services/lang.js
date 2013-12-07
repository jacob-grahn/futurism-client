(function() {
	'use strict';

	angular.module('futurism').factory('lang', function($http, _, errorHandler) {

		var lang = {};
		var phrases = {};

		var copyNest = function(dest, source, str) {
			_.each(source, function(val, key) {
				if(typeof(val) === 'object') {
					var ch = val[str] || val['en'] || val['ko']; //shoud match any language...
					if(typeof ch === 'string') {
						dest[key] = ch;
					}
					else {
						dest[key] = {};
						copyNest(dest[key], val, str);
					}
				}
			});
		};

		lang.setLang = function(str) {
			copyNest(lang, phrases, str);
		};

		$http.get('data/phrases.json')
			.success(function(phraseData) {
				phrases = phraseData;
				lang.setLang('en');
			})
			.error(function() {
				errorHandler.handleError('Could not load language file.');
			});

		return lang;

	});
}());