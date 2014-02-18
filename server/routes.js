'use strict';

module.exports = function(expr) {

	var lobbies = require('./routes/lobbies');

	var continueSession = require('./middleware/continueSession');
	var checkLogin = require('./middleware/checkLogin');
	var checkMod = require('./middleware/checkMod');

	expr.post('/api/canonCards', continueSession, checkMod, require('./routes/canonCardsPost'));
	expr.delete('/api/cards/:cardId', continueSession, checkLogin, require('./routes/cardsDelete'));
	expr.get('/api/cards', continueSession, checkLogin, require('./routes/cardsGet'));
	expr.post('/api/cards', continueSession, checkLogin, require('./routes/cardsPost'));
	expr.delete('/api/decks', continueSession, checkLogin, require('./routes/decksDelete'));
	expr.get('/api/decks', continueSession, checkLogin, require('./routes/decksGet'));
	expr.post('/api/decks', continueSession, checkLogin, require('./routes/decksPost'));

	expr.get('/api/lobbies', continueSession, lobbies.getList);
	expr.get('/api/lobbies/:lobbyId', continueSession, lobbies.get);
	expr.post('/api/lobbies', continueSession, lobbies.post);

	expr.get('/api/tests', continueSession, require('./routes/testsGet'));
	expr.get('/api/records/:gameId', continueSession, require('./routes/recordsGet'));

	var stats = require('./routes/stats');
	expr.post('/api/stats', continueSession, checkLogin, stats.post);
	expr.get('/api/stats/:userId', stats.get);

	expr.get('/api/summaries/:gameId', require('./routes/summariesGet'));

	expr.get(/^(?!\/api)((?!\.).)*$/i, require('./routes/indexGet')); //--- this ridiculous regex matches any string that does not start with '/api' and does not contain a period.

};