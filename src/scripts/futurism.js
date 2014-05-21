angular
    .module('futurism', ['http-auth-interceptor', 'imageupload', 'ngRoute', 'ngResource', 'ngAnimate', 'truncate', 'ui.bootstrap'])
    .config(function($routeProvider, $locationProvider) {
        'use strict';
        
        $routeProvider.
            when('/card-builder', {
                templateUrl: 'views/card-builder.html',
                controller: 'CardBuilderCtrl'
            }).
            when('/card-selector/:userId', {
                templateUrl: 'views/card-selector.html',
                controller: 'CardSelectorCtrl'
            }).
            when('/credits', {
                templateUrl: 'views/credits.html',
                controller: 'CreditsCtrl'
            }).
            when('/deck-builder', {
                templateUrl: 'views/deck-builder.html',
                controller: 'DeckBuilderCtrl'
            }).
            when('/deck-selector/:userId', {
                templateUrl: 'views/deck-selector.html',
                controller: 'DeckSelectorCtrl'
            }).
            when('/error', {
                templateUrl: 'views/error.html',
                controller: 'ErrorCtrl'
            }).
            when('/t-machine', {
                templateUrl: 'views/store.html',
                controller: 'StoreCtrl'
            }).
            when('/game/:serverId/:gameId', {
                templateUrl: 'views/game.html',
                controller: 'GameCtrl'
            }).
            when('/loadup/deck/:serverId/:gameId/:deckSize/:futures', {
                templateUrl: 'views/loadup-deck.html',
                controller: 'LoadupDeckCtrl'
            }).
            when('/loadup/futures/:serverId/:gameId/:deckSize/:futures', {
                templateUrl: 'views/loadup-futures.html',
                controller: 'LoadupFuturesCtrl'
            }).
            when('/guilds/:guildId', {
                templateUrl: 'views/guild.html',
                controller: 'GuildCtrl'
            }).
            when('/guild-joiner', {
                templateUrl: 'views/guild-joiner.html',
                controller: 'GuildJoinerCtrl'
            }).
            when('/guild-list', {
                templateUrl: 'views/guild-list.html',
                controller: 'GuildListCtrl'
            }).
            when('/vids', {
                templateUrl: 'views/instructions.html',
                controller: 'InstructionsCtrl'
            }).
            when('/language', {
                templateUrl: 'views/language.html',
                controller: 'LanguageCtrl'
            }).
            when('/lobby', {
                templateUrl: 'views/lobby.html',
                controller: 'LobbyCtrl'
            }).
            when('/title', {
                templateUrl: 'views/title.html',
                controller: 'TitleCtrl'
            }).
            when('/', {
                templateUrl: 'views/title.html',
                controller: 'TitleCtrl'
            }).
            when('/record/:gameId', {
                templateUrl: 'views/game-record.html',
                controller: 'GameRecordCtrl'
            }).
            when('/summary/:gameId', {
                templateUrl: 'views/game-summary.html',
                controller: 'GameSummaryCtrl'
            }).
            when('/messages', {
                templateUrl: 'views/conversation-list.html',
                controller: 'ConversationListCtrl'
            }).
            when('/messages/:userId', {
                templateUrl: 'views/conversation.html',
                controller: 'ConversationCtrl'
            }).
            when('/users/:userId/bans', {
                templateUrl: 'views/bans.html',
                controller: 'BansCtrl'
            }).
            when('/reports', {
                templateUrl: 'views/reports.html',
                controller: 'ReportsCtrl'
            }).
            when('/mod-logs', {
                templateUrl: 'views/mod-log.html',
                controller: 'ModLogCtrl'
            }).
            otherwise({redirectTo: '/title'});

        $locationProvider.html5Mode(true);
    });