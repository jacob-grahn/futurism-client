describe('gameLookup', function() {

	var gameLookup = require('../../../multi/game/gameLookup');


	it('should store and retrieve games by id', function() {
		var game = {gameId: '123', value: 'blah'};
		gameLookup.store(game.gameId, game);
		expect(gameLookup.idToValue('123')).toBe(game);
	});


	it('should delete an old game', function() {
		var game = {gameId: '123', startedAt: new Date() - (60*60*2000)};
		gameLookup.store(game.gameId, game);
		gameLookup.purgeOldGames();
		expect(gameLookup.idToValue('123')).toBe(undefined);
	});


	it('should not delete a new-ish game', function() {
		var game = {gameId: '123', startedAt: new Date()};
		gameLookup.store(game.gameId, game);
		gameLookup.purgeOldGames();
		expect(gameLookup.idToValue('123')).toBe(game);
	});
});