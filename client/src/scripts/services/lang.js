(function() {
	'use strict';

	angular.module('futurism').factory('lang', function($http, _, errorHandler) {

		var lang = {};
		var phrases = {};

		lang.setLang = function(str) {
			_.each(phrases, function(phraseGroup, groupKey) {
				_.each(phraseGroup, function(phrase, phraseKey) {
					lang[groupKey] = lang[groupKey] || {};
					lang[groupKey][phraseKey] = phrases[groupKey][phraseKey][str] || phrases[groupKey][phraseKey].en;
				});
			});
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