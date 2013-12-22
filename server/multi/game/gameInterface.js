(function() {
	'use strict';

	var gameLookup = require('./gameLookup');


	module.exports = function(socket) {


		/**
		 * Route an event to a player in a game
		 * @param eventName
		 * @param callback
		 */
		socket.onPlayer = function(eventName, callback) {
			socket.on(eventName, function(data) {

				// get the _id
				socket.get('_id', function(err, _id) {
					if(err) {
						return socket.emitError(err);
					}
					if(!_id) {
						return socket.emitError('No _id is registered to this connection.');
					}

					// get the game
					var game = gameLookup.idToGame(data.gameId);
					if(!game) {
						return socket.emitError('game "'+data.gameId+'" was not found.');
					}

					// get the player in that game
					var player = game.idToPlayer(_id);
					if(!player) {
						return socket.emitError('game "'+data.gameId+'" does not contain user "'+_id+'".');
					}

					//everything worked
					var response = callback(data, game, player);

					//return the response to the socket
					if(response) {
						socket.emit(eventName, response);
					}
				});
			});
		};


		/**
		 * Send in a deck selection
		 */
		socket.onPlayer('selectDeck', function(data, game, player) {
			game.loadup.selectDeck(player, data.deckId, function(err) {
				socket.emitError(err);
			});
		});


		/**
		 * Send in a card action
		 */
		socket.onPlayer('action', function(data, game, player) {
			return game.action(player, data.actorId, data.actionId, data.targets);
		});


		/**
		 * Send in a voluntary turn end
		 */
		socket.onPlayer('endTurn', function(data, game, player) {
			return game.endTurn(player);
		});


		/**
		 * Send in a card placement
		 */
		socket.onPlayer('placeCard', function(data, game, player) {
			return game.placeCard(player, data.actorId);
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
			return socket.emit(player.hand);
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
			var game = gameLookup.idToGame(data.gameId);
			if(!game) {
				return socket.emitError('game "'+data.gameId+'" not found.');
			}
			return socket.emit('gameStatus', game.getGameStatus());
		});
	};

}());