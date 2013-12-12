'use strict';

angular.module('futurism', ['http-auth-interceptor', 'imageupload', 'ngRoute', 'ngResource', 'ui.bootstrap'])

	.config(function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/card-builder', {templateUrl: 'views/card-builder.html', controller: 'CardBuilderCtrl'}).
			when('/card-selector', {templateUrl: 'views/card-selector.html', controller: 'CardSelectorCtrl'}).
			when('/credits', {templateUrl: 'views/credits.html', controller: 'CreditsCtrl'}).
			when('/deck-builder', {templateUrl: 'views/deck-builder.html', controller: 'DeckBuilderCtrl'}).
			when('/deck-selector', {templateUrl: 'views/deck-selector.html', controller: 'DeckSelectorCtrl'}).
			when('/error', {templateUrl: 'views/error.html', controller: 'ErrorCtrl'}).
			when('/futures', {templateUrl: 'views/futures.html', controller: 'FuturesCtrl'}).
			when('/game/:gameId', {templateUrl: 'views/game.html', controller: 'GameCtrl'}).
			when('/game-pre-deck/:gameId/:maxPride', {templateUrl: 'views/game-pre-deck.html', controller: 'GamePreDeckCtrl'}).
			when('/guild', {templateUrl: 'views/guild.html', controller: 'GuildCtrl'}).
			when('/instructions', {templateUrl: 'views/instructions.html', controller: 'InstructionsCtrl'}).
			when('/language', {templateUrl: 'views/language.html', controller: 'LanguageCtrl'}).
			when('/lobby', {templateUrl: 'views/lobby.html', controller: 'LobbyCtrl'}).
			when('/title', {templateUrl: 'views/title.html', controller: 'TitleCtrl'}).
			otherwise({redirectTo: '/title'});

		$locationProvider.html5Mode(true).hashPrefix('#');
	})

	.run(function(autoLogin, session, errorHandler, $rootScope, lang) {
		autoLogin.activate();
		session.create(errorHandler.callback);
		$rootScope.lang = lang;
	});