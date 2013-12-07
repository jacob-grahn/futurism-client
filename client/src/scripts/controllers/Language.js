angular.module('futurism')
	.controller('LanguageCtrl', function($scope, $location, lang) {
		'use strict';

		$scope.lang = lang;

		$scope.languages = [
			{
				short: 'en',
				long: 'English'
			},
			{
				short: 'ko',
				long: '한국어'
			},
			{
				short: 'ct',
				long: 'MeeEeeow'
			}
		];
	});