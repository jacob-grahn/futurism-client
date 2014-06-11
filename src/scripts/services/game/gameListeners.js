angular.module('futurism')
    .factory('gameListeners', function($routeParams, socket, players, turn, board, state, hand, updateDelayer, autoTurnEnder, shared, sound, me, timer, _, subscriber, modals) {
        'use strict';
        var self = this;

        /**
         * Receive the game state
         */
        socket.$on('gameStatus', function(data) {
            players.list = data.players;
            board.fullUpdate(data.board);
            board.future = data.future || shared.futures.NORMAL;
            self.startTurn(data);
            timer.timeLeft = data.timeLeft;
        });


        /**
         * Receive a partial game state
         */
        socket.$on('gameUpdate', function(data) {
            var cause = data.cause;
            var changes = data.changes;
            changes.data = data.data;
            changes.cause = data.cause;
            
            timer.timeLeft = data.changes.timeLeft || timer.timeLeft;

            updateDelayer.add(cause, changes, function() {
                if(state.name !== state.TARGETING) {
                    state.toDefault();
                }

                _.merge(players.list, changes.players);
                board.partialUpdate(changes.board);
                autoTurnEnder.run();

                if(cause === shared.actions.SUMMON) {
                    hand.removeCid(changes.data.targetChain[1].cid);
                }

                if(cause === 'turn') {
                    self.startTurn(changes);
                }

                if(cause === shared.actions.FUTURE) {
                    board.future = changes.future;
                }
            });
        });


        /**
         * The game is over
         */
        socket.$on('gameOver', function(data) {
            updateDelayer.add('gameOver', null, function() {

                if(data.winners.indexOf(me.user._id) !== -1) {
                    sound.play('win');
                }
                /*else {
                    sound.play('loose');
                }*/

                //$location.url('/summary/' + $routeParams.gameId);
                
                modals.openGameEnd($routeParams.gameId);
            });
        });


        /**
         * Begin a new turn
         */
        self.startTurn = function(data) {
            turn.turnOwners = data.turnOwners || turn.turnOwners;
            turn.startTime = data.startTime || turn.startTime;
            if(turn.isMyTurn()) {
                hand.refresh();
                state.set(state.THINKING);
            }
            else {
                state.set(state.WAITING);
            }
        };


        /**
         * Start listening to a game
         * @param {string} gameId
         */
        self.subscribe = function(gameId) {
            subscriber.subscribe(gameId);
            socket.emit('gameStatus', {gameId: gameId});
        };


        /**
         * Stop listening to a game
         * @param {string} gameId
         */
        self.unsubscribe = function(gameId) {
            subscriber.unsubscribe(gameId);
        };



        return self;

    });