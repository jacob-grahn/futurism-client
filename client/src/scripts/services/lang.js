(function() {
	'use strict';

	angular.module('futurism').factory('lang', function($http, _, errorHandler) {

		var lang = {};
		lang.phrases = {};


		/**
		 * Similar to a recursive shallow copy, except a specific language is selected out
		 * {en: 'bla', fr: 'ble'} would be copied as 'ble' if the languageId was 'fr'
		 * @param {object} dest
		 * @param {object} source
		 * @param {string} languageId
		 */
		var copyPhrases = function(dest, source, languageId) {
			_.each(source, function(val, key) {
				if(typeof(val) === 'object') {
					if(lang.isPhraseObj(val)) {
						dest[key] = val[languageId] || val.en;
					}
					else {
						dest[key] = {};
						copyPhrases(dest[key], val, languageId);
					}
				}
			});
		};


		/**
		 * Returns true if an object contains a string
		 * @param {*} value
		 * @returns {boolean}
		 */
		lang.isPhraseObj = function(value) {
			var isPhrase = false;
			_.each(value, function(prop) {
				if(typeof prop === 'string') {
					isPhrase = true;
				}
			});
			return isPhrase;
		};


		/**
		 * Set the display language
		 * @param {string} languageId
		 */
		lang.setLang = function(languageId) {
			copyPhrases(lang, lang.phrases, languageId);
		};


		/**
		 * Load in the phrases.json file
		 */
		lang.init = function() {
			var onLoad = function(phraseData) {
				lang.phrases = phraseData;
				lang.setLang('en');
			};
			var onError = function() {
				errorHandler.handleError('Could not load language file.');
			};

			$http.get('data/abilities.json').success(onLoad).error(onError);
			$http.get('data/factions.json').success(onLoad).error(onError);
			$http.get('data/futures.json').success(onLoad).error(onError);
			$http.get('data/languages.json').success(onLoad).error(onError);
			$http.get('data/phrases.json').success(onLoad).error(onError);
		};


		return lang;

	});
}());