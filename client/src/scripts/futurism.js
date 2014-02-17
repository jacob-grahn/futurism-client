'use strict';

angular.module('futurism', ['http-auth-interceptor', 'imageupload', 'ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap'])

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
			when('/loadup/:gameId/:maxPride', {templateUrl: 'views/loadup.html', controller: 'LoadupCtrl'}).
			when('/guilds/:guildId', {templateUrl: 'views/guild.html', controller: 'GuildCtrl'}).
			when('/guild-joiner', {templateUrl: 'views/guild-joiner.html', controller: 'GuildJoinerCtrl'}).
			when('/instructions', {templateUrl: 'views/instructions.html', controller: 'InstructionsCtrl'}).
			when('/language', {templateUrl: 'views/language.html', controller: 'LanguageCtrl'}).
			when('/lobby', {templateUrl: 'views/lobby.html', controller: 'LobbyCtrl'}).
			when('/title', {templateUrl: 'views/title.html', controller: 'TitleCtrl'}).
			when('/record/:gameId', {templateUrl: 'views/game-record.html', controller: 'GameRecordCtrl'}).
			when('/summary/:gameId', {templateUrl: 'views/game-summary.html', controller: 'GameSummaryCtrl'}).
			when('/messages', {templateUrl: 'views/messages.html', controller: 'MessagesCtrl'}).
			otherwise({redirectTo: '/title'});

		$locationProvider.html5Mode(true);
	});