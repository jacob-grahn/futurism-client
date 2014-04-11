var shuffleCards = require('../../../../../server/multi/game/effects/shuffleCards');

describe('effects/shuffleCards', function() {

	it('should rearrange the cards in all players decks', function() {
		var player1 = {_id:1, cards:[1,2,3,4,5,6,7,8,9]};
		var player2 = {_id:2, cards:[1,2,3,4,5,6,7,8,9]};

		var game = {
			players: [player1, player2]
		};

		shuffleCards.shuffleCards(game);

		expect(player1.cards.length).toBe(9);
		expect(player1.cards).not.toEqual([1,2,3,4,5,6,7,8,9]);
		expect(player2.cards).not.toEqual([1,2,3,4,5,6,7,8,9]);
	});
});

