angular.module('futurism')
    .factory('loadup', function($location, $routeParams, errorHandler, socket) {

        var confirmedDeckId = null;
        var confirmedFutures = null;

        socket.$on('selectDeckResult', function(data) {
            confirmedDeckId = data.deckId;
            self.gotoNextPage();
        });


        socket.$on('selectFuturesResult', function(data) {
            confirmedFutures = data.futures;
            self.gotoNextPage();
        });


        var self = {

            gameId: '',
            serverId: 0,
            rules: {},
            selectedFutures: [],

            startPrep: function(_gameId_, _serverId_, _rules_) {
                self.gameId = _gameId_;
                self.serverId = _serverId_;
                self.rules = _rules_;
                self.selectedFutures = [];
                confirmedDeckId = null;
                confirmedFutures = null;
                socket.connect(self.serverId);
                self.gotoNextPage();
            },

            resumePrep: function() {
                self.gameId = $routeParams.gameId;
                self.serverId = $routeParams.serverId;
                self.rules.deckSize = Number($routeParams.deckSize);
                self.rules.futures = Number($routeParams.futures);
                socket.connect(self.serverId);
            },

            selectDeck: function(deckId) {
                socket.emit('selectDeck', {gameId: self.gameId, deckId: deckId});
            },

            selectFutures: function(futures) {
                socket.emit('selectFutures', {gameId: self.gameId, futures: futures});
            },

            selectFuture: function(futureId) {
                if(self.selectedFutures.length < self.rules.futures) {
                    self.selectedFutures.push(futureId);
                }
                if(self.selectedFutures.length === self.rules.futures) {
                    self.selectFutures(self.selectedFutures);
                }
            },

            gotoNextPage: function() {
                if(!confirmedDeckId) {
                    return $location.url('/loadup/deck/' + self.serverId + '/' + self.gameId + '/' + self.rules.deckSize + '/' + self.rules.futures);
                }
                if(self.rules.futures > 0 && confirmedDeckId && !confirmedFutures) {
                    return $location.url('/loadup/futures/' + self.serverId + '/' + self.gameId + '/' + self.rules.deckSize + '/' + self.rules.futures);
                }
                if((self.rules.futures === 0 && confirmedDeckId) || (self.rules.futures > 0 && confirmedDeckId && confirmedFutures)) {
                    return $location.url('/game/' + self.serverId + '/' + self.gameId);
                }
            }

        };


        return self;
    });