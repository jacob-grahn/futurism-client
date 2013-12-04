(function() {
	'use strict';

	var gameLookup = require('./gameLookup');


	module.exports = function(socket) {

		socket.on('gameStatus', function(data) {
			var game = gameLookup.idToGame(data.gameId);
			socket.emit('gameStatus', game.getGameStatus());
		});

		socket.on('gameAction', function(data) {
			socket.get('account', function(err, account) {
				var game = gameLookup.idToGame(data.gameId);
				var result = game.doAction(account, data.action, data.targetIds, data.srcTargetId);
				socket.emit('gameAction', result);
			});
		});

		socket.on('endTurn', function(data) {
			socket.get('account', function(err, account) {
				var game = gameLookup.idToGame(data.gameId);
				game.endTurn(account);
			});
		});

		socket.on('selectDeck', function(data) {
			socket.get('account', function(err, account) {
				var game = gameLookup.idToGame(data.gameId);
				game.selectDeck(account, data.deckId);
			});
		});

		socket.on('hand', function() {
			socket.get('account', function(err, account) {
				socket.emit('hand', account.hand);
			});
		});

		socket.on('quit', function(data) {
			socket.get('account', function(err, account) {
				var game = gameLookup.idToGame(data.gameId);
				game.selectDeck(account, data.deckId);
			});
		});
	};

}());