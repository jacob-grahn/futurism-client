'use strict';

module.exports = function(expr) {

	var checkLogin = require('./middleware/checkLogin');
	var checkMod = require('./middleware/checkMod');

	expr.post('/api/canonCards', checkMod, require('./routes/canonCardsPost'));
	expr.delete('/api/cards', checkLogin, require('./routes/cardsDelete'));
	expr.get('/api/cards', checkLogin, require('./routes/cardsGet'));
	expr.post('/api/cards', checkLogin, require('./routes/cardsPost'));
	expr.delete('/api/decks', checkLogin, require('./routes/decksDelete'));
	expr.get('/api/decks', checkLogin, require('./routes/decksGet'));
	expr.post('/api/decks', checkLogin, require('./routes/decksPost'));
	expr.get('/api/tests', require('./routes/testsGet'));
	expr.get('/api/records/:gameId', require('./routes/recordsGet'));
	expr.get('/api/summaries/:gameId', require('./routes/summariesGet'));
	expr.get(/^(?!\/api)((?!\.).)*$/i, require('./routes/indexGet')); //--- this ridiculous regex matches any string that does not start with '/api' and does not contain a period.

};