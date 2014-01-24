(function() {
	'use strict';

	//--- initialize
	var express = require('express');
	var continueSession = require('./middleware/continueSession');
	var handleErrors = require('./middleware/handleErrors');
	var checkLogin = require('./middleware/checkLogin');
	var checkMod = require('./middleware/checkMod');
	var output = require('./middleware/output');
	var expr = express();
	var httpServer = require('http').createServer(expr);
	var io = require('socket.io').listen(httpServer);


	//--- mongoose connect
	var mongoose = require('mongoose');
	require('./fns/mongoose/findByIdAndSave').attach(mongoose);
	require('./fns/mongoose/findOneAndSave').attach(mongoose);
	require('./fns/mongoose/validatedUpdate').attach(mongoose);
	mongoose.connect(process.env.MONGO_URI);


	//--- middleware
	expr.use('/', handleErrors);
	expr.use('/api', output);
	expr.use('/api', express.urlencoded());
	expr.use('/api', express.json());
	expr.use('/api', continueSession);


	//--- serve static files (more middleware, technically)
	if(process.env.NODE_ENV === 'development') {
		expr.use(require('connect-livereload')({port: 35729}));
		expr.use('/', express.static('./client/src'));
		expr.use('/', express.static('./.tmp'));
		expr.use('/', express.static('./shared'));
	}
	else {
		expr.use('/', express.static('../client/dist'));
	}


	//--- load routes
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


	//--- load multi
	var multiInit = require('./multi/init');
	var broadcast = require('./multi/broadcast');
	var Chat = require('./multi/chat');
	var Lobby = require('./multi/lobby');
	multiInit.listenForConnections(io);
	broadcast.setIo(io);
	Chat.safeCreate('chat-brutus');
	Lobby.createRoom('brutus');


	//--- last ditch error handler
	process.on('uncaughtException', function (err) {
		console.log('unhandled error', err, err.stack);
	});


	//--- listen for requests
	var port = process.env.PORT || 9000;
	console.log('NODE_ENV: ', process.env.NODE_ENV);
	console.log('Listening on port ' + port);
	httpServer.listen(port);

	module.exports = expr;

}());
