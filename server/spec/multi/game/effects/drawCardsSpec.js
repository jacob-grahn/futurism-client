var drawCards = require('../../../../../server/multi/game/effects/drawCards');

describe('effects/drawCards', function() {


	it('should fill hand up to limit defined in rules', function() {

		var card1 = {_id: 1};
		var card2 = {_id: 2};
		var card3 = {_id: 3};

		var player = {_id: 1, hand: [], cards: [card1, card2, card3]};

		var game = {
			turnOwners: [player],
			rules: {
				handSize: 2
			}
		};

		drawCards.drawCards(game);

		expect(player.cards).toEqual([card1]);
		expect(player.hand).toEqual([card3, card2]);
	});


	it('should stop filling hand when the deck runs out', function() {
		var card1 = {_id: 1};
		var card2 = {_id: 2};
		var card3 = {_id: 3};

		var player = {_id: 1, hand: [], cards: [card1, card2, card3]};

		var game = {
			turnOwners: [player],
			rules: {
				handSize: 5
			}
		};

		drawCards.drawCards(game);

		expect(player.cards).toEqual([]);
		expect(player.hand).toEqual([card3, card2, card1]);
	});
});
