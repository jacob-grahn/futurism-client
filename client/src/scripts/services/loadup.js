angular.module('futurism')
	.factory('loadup', function($location, errorHandler, socket) {

		var confirmedDeckId = null;
		var confirmedFutures = null;

		socket.$on('selectDeckResult', function(data) {
			confirmedDeckId = data.deckId;
			self.proceedIfDone();
		});


		socket.$on('selectFuturesResult', function(data) {
			confirmedFutures = data.futures;
			self.proceedIfDone();
		});


		var self = {

			gameId: '',
			serverId: 0,
			rules: {},

			startPrep: function(_gameId_, _serverId_, _rules_) {
				self.gameId = _gameId_;
				self.serverId = _serverId_;
				self.rules = _rules_;
				confirmedDeckId = null;
				confirmedFutures = null;
				socket.connect(self.serverId);
			},

			selectDeck: function(deckId) {
				socket.emit('selectDeck', {gameId: self.gameId, deckId: deckId});
			},

			selectFutures: function(futures) {
				if(futures.length !== rules.futures) {
					errorHandler.show('Pick ' + rules.futures + 'futures');
				}
			},

			proceedIfDone: function() {
				if((self.rules.futures === 0 && confirmedDeckId) || (self.rules.futures > 0 && confirmedDeckId && confirmedFutures)) {
					$location.url('/game/' + self.serverId + '/' + self.gameId);
				}
			}

		};


		return self;
	});