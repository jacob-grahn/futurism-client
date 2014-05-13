angular.module('futurism')
    .factory('matchups', function(socket, $rootScope, me, _, loadup, subscriber) {
        'use strict';

        var self = this;
        self.lobbyName = null;
        self.matchups = [];


        /**
         * start listening to lobby events
         */
        self.subscribe = function(lobbyName) {
            self.unsubscribe();
            self.lobbyName = lobbyName;
            socket.emit('allMatchups', {lobbyName: self.lobbyName});
            subscriber.subscribe(self.lobbyName);
        };


        /**
         * stop listening to lobby events
         */
        self.unsubscribe = function() {
            if(self.lobbyName) {
                subscriber.unsubscribe(self.lobbyName);
                self.leave();
                self.lobbyName = null;
            }
            self.clear();
        };


        /**
         * create a new matchup
         * @param {Object} rules
         */
        self.createMatchup = function(rules) {
            socket.emit('createMatchup', {lobbyName: self.lobbyName, rules: rules});
        };


        /**
         * join an existing matchup
         * @param matchupId
         */
        self.join = function(matchupId) {
            socket.emit('joinMatchup', {lobbyName: self.lobbyName, matchupId: matchupId});
        };


        /**
         * Leave whatever matchup you may be in
         */
        self.leave = function() {
            socket.emit('leaveMatchup', {lobbyName: self.lobbyName});
        };


        /**
         * remove all matchups
         */
        self.clear = function() {
            self.matchups = [];
        };


        /**
         * return a matchup with matchupId
         * @param {number} id
         * @returns {*}
         */
        self.idToMatchup = function(id) {
            for(var i=0; i<self.matchups.length; i++) {
                var matchup = self.matchups[i];
                if(matchup.id === id) {
                    return matchup;
                }
            }
        };


        /**
         * If you are in provided matchup, start the game
         */
        self.goIfMember = function(matchup, gameId) {
            _.each(matchup.accounts, function(user) {
                if(user._id === me.userId) {
                    loadup.startPrep(gameId, 1, matchup.rules);
                }
            });
        };


        /**
         * when a user creates a new matchup
         */
        socket.$on('createMatchup', function(matchup) {
            self.matchups.push(matchup);
        });


        /**
         * when a user joins a matchup
         */
        socket.$on('joinMatchup', function(data) {
            var matchup = self.idToMatchup(data.id);
            matchup.accounts.push(data.user);
        });


        /**
         * when a user leaves a matchup
         */
        socket.$on('leaveMatchup', function(data) {
            var matchup = self.idToMatchup(data.id);
            matchup.accounts = _.filter(matchup.accounts, function(account) {
                return account._id !== data.user._id;
            });
        });


        /**
         * when a matchup is complete and a game begins
         */
        socket.$on('startMatchup', function(data) {
            var matchup = self.idToMatchup(data.id);
            if(matchup) {
                matchup.starting = true;
                _.pull(self.matchups, matchup);
                self.goIfMember(matchup, data.gameId);
            }
        });


        /**
         * when a matchup is closed
         */
        socket.$on('removeMatchup', function(id) {
            var matchup = self.idToMatchup(id);
            _.pull(self.matchups, matchup);
        });


        /**
         * when first connecting, receive a full list of matchups
         */
        socket.$on('allMatchups', function(all) {
            self.clear();
            self.matchups = all;
        });


        /**
         * public interface
         */
        return self;
    });