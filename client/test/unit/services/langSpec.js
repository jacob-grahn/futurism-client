/* global _, errorHandlerMock */

describe('service: lang', function() {
	'use strict';

	var lang, http;


	beforeEach(function() {

		//load the module
		module('futurism');

		//mock session so we don't get an unexpected and unrelated http request
		angular.mock.module("futurism", function ($provide) {
			$provide.value('session', window.sessionMock);
		});

		//inject
		inject(function($httpBackend, _lang_) {
			http = $httpBackend;
			lang = _lang_;
		});

		//create dummy data
		http.expectGET('data/phrases.json').
			respond({
				"title": {
					"play": {
						"en": "play",
						"ko": "놀이"
					},
					"credits": {
						"ko": "인정함"
					},
					"instructions": {
						"en": "instructions"
					}
				},
				"cardBuilder": {
					"one": {
						"en": "one",
						"ko": "hana"
					},
					"very": {
						"very": {
							"nested": {
								"value": {
									"en": "poop",
									"ko": "dul"
								}
							}
						}
					}
				}
			});

		//complete the http request
		http.flush();
	});


	it('should exist', function () {
		expect(lang).toBeTruthy();
	});


	it('should request phrases', function() {
		http.verifyNoOutstandingExpectation();
		http.verifyNoOutstandingRequest();
	});


	it('should determine weather an object contains phrases', function() {
		expect(lang.isPhraseObj({en: 'bla bla'})).toBe(true);
		expect(lang.isPhraseObj({en: {en:'bla bla'}})).toBe(false);
	});


	it('should default to english', function() {
		expect(lang.title.play).toBe('play');
		expect(lang.title.credits).toBe(undefined);
		expect(lang.cardBuilder.one).toBe('one');
	});


	it('should copy deeply nested values', function() {
		expect(lang.cardBuilder.very.very.nested.value).toBe('poop');
	});


	it('should switch to other languages, using english to fill the gaps', function() {
		lang.setLang('ko');
		expect(lang.title.play).toBe('놀이');
		expect(lang.title.instructions).toBe('instructions');
	});

});