'use strict';

var gameLookup = require('./gameLookup');


module.exports = {


	/**
	 * Allow socket to interface with game.js
	 * @param socket
	 */
	initSocket: function(socket) {

		/**
		 * Route an event to a player in a game
		 * @param eventName
		 * @param callback
		 */
		socket.onPlayer = function(eventName, callback) {
			socket.on(eventName, function(data) {

				// get the _id
				socket.get('account', function(err, account) {
					if(err) {
						return socket.emitError(err);
					}
					if(!account._id) {
						return socket.emitError('No _id is registered to this connection.');
					}

					// get the game
					var game = gameLookup.idToValue(data.gameId);
					if(!game) {
						return socket.emitError('game "'+data.gameId+'" was not found.');
					}

					// get the player in that game
					var player = game.idToPlayer(account._id);
					if(!player) {
						return socket.emitError('game "'+data.gameId+'" does not contain user "'+account._id+'".');
					}

					//everything worked
					var response = callback(data, game, player);
					if(!response) {
						return null;
					}

					//return the response to the socket
					return socket.emit(eventName, response);
				});
			});
		};


		/**
		 * Send in a deck selection
		 */
		socket.onPlayer('selectDeck', function(data, game, player) {
			game.loadup.selectDeck(player, data.deckId, function(err) {
				if(err) {
					return socket.emitError(err);
				}
				socket.emit('selectDeckResult', {result: 'success', deckId: data.deckId});
			});
		});


		/**
		 * Send in future selections
		 */
		socket.onPlayer('selectFutures', function(data, game, player) {
			game.loadup.selectFutures(player, data.futures, function(err) {
				if(err) {
					return socket.emitError(err);
				}
				socket.emit('selectFuturesResult', {result: 'success', futures: data.futures});
			});
		});


		/**
		 * Send in a card action
		 */
		socket.onPlayer('doAction', function(data, game, player) {
			var result = game.doAction(player, data.actionId, data.targets);
			if(result !== 'ok') {
				socket.emitError(result);
			}
		});


		/**
		 * Send in a voluntary turn end
		 */
		socket.onPlayer('endTurn', function(data, game, player) {
			return game.endTurn(player);
		});


		/**
		 * Send in a future
		 */
		socket.onPlayer('alterFuture', function(data, game, player) {
			return game.alterFuture(player, data.futureId);
		});


		/**
		 * Request a list of cards in your hand
		 */
		socket.onPlayer('hand', function(data, game, player) {
			return {
				hand: player.hand,
				futures: player.futures
			};
		});


		/**
		 * Forfeit a match
		 */
		socket.onPlayer('forfeit', function(data, game, player) {
			return game.forfeit(player);
		});


		/**
		 * Request an overview of the game
		 */
		socket.on('gameStatus', function(data) {
			var game = gameLookup.idToValue(data.gameId);
			if(!game) {
				return socket.emitError('game "'+data.gameId+'" not found.');
			}
			return socket.emit('gameStatus', game.getStatus());
		});
	}
};