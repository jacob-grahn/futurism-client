angular.module('futurism')
    .controller('GameCtrl', function($scope, $routeParams, socket, gameListeners, players, turn, board, state, hand, targeter, errorHandler, shared, me, timer) {
        'use strict';

        $scope.actions = shared.actions;
        $scope.board = board;
        $scope.players = players;
        $scope.turn = turn;
        $scope.state = state;
        $scope.targeter = targeter;
        $scope.gameId = $routeParams.gameId;
        $scope.chatId = $scope.gameId.replace('game', 'chat');
        $scope.me = me;
        $scope.timer = timer;


        var connectToGame = function() {
            socket.connect($routeParams.serverId);
            gameListeners.subscribe($scope.gameId);
        };


        // wait to start the game until after your login has been sorted out
        if(me.user._id) {
            connectToGame();
        }
        else {
            var removeListener = $scope.$on('event:me:user:updated', function() {
                connectToGame();
                removeListener();
            });
        }
        
        
        $scope.forfeit = function() {
            socket.emit('forfeit', {gameId: $scope.gameId});
        };
        
        
        $scope.endTurn = function() {
            socket.emit('endTurn', {gameId: $scope.gameId});
        };


        /**
         * clean up
         */
        $scope.$on('$destroy', function() {
            gameListeners.unsubscribe($scope.gameId);
            board.clear();
        });


        /**
         * play a card from your hand
         * @param card
         * @returns {boolean}
         */
        $scope.pickCardFromHand = function(card) {
            if(card.pride > players.findMe().pride) {
                errorHandler.show('You do not have enough pride to play this card');
                return false;
            }
            if(hand.cards.indexOf(card) === -1) {
                errorHandler.show('This card is not in your hand');
                return false;
            }

            // a commander can summon itself
            if(card.commander) {
                targeter.selectAction(shared.actions.SUMMON, {card: card, player: players.findMe()});
                targeter.onCooldown = false;
            }

            targeter.selectTarget({card: card, player: players.findMe()});

            return true;
        };
        
        
        /**
         *
         */
        $scope.canPlayCard = function(card) {
            return card.commander || targeter.isValidTarget({card: card, player: players.findMe()});
        };


        /**
         *
         */
        $scope.pickFutureFromHand = function(futureId) {
            return targeter.selectTarget({future: futureId});
        };


        /**
         *
         */
        $scope.shouldShowHand = function() {
            if(!turn.isMyTurn()) {
                return false;
            }

            // show hand if there is no commander on the board
            if(!board.playerHasCommander(me.user._id) && state.name !== state.TARGETING && state.name !== state.PENDING) {
                return true;
            }

            // show hand if summon is being used
            if(state.name === state.TARGETING && state.data.actionId === shared.actions.SUMMON && state.data.targets.length === 1) {
                return true;
            }
            
            // default to false
            return false;
        };


        /**
         *
         */
        $scope.shouldShowFutures = function() {
            if(turn.isMyTurn()) {

                // show hand if future is being used
                if(state.name === state.TARGETING && state.data.actionId === shared.actions.FUTURE && state.data.targets.length === 1) {
                    return true;
                }

            }

            return false;
        };


        /**
         *
         */
        $scope.closeHand = function() {
            state.toDefault();
        };

    });