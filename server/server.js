(function() {
	'use strict';

	//--- initialize
	var express = require('express');
	var consolidateParams = require('./middleware/consolidateParams');
	var continueSession = require('./middleware/continueSession');
	var handleErrors = require('./middleware/handleErrors');
	var checkAuth = require('./middleware/checkAuth');
	var checkMod = require('./middleware/checkMod');
	var output = require('./middleware/output');
	var session = require('./fns/session');
	var expr = express();
	var httpServer = require('http').createServer(expr);
	var io = require('socket.io').listen(httpServer);


	//--- mongoose connect
	require('./fns/fndSave'); //extends mongoose
	var mongoose = require('mongoose');
	var mongoAddr = require('./fns/connect/mongoConnect').getConnectAddr();
	mongoose.connect(mongoAddr);


	//--- redis connect
	var redisCache = require('./fns/connect/redisCache');
	session.setRedis(redisCache.store);


	//--- middleware
	expr.use('/', handleErrors);
	expr.use('/api', output);
	expr.use('/api', express.bodyParser());
	expr.use('/api', consolidateParams);
	expr.use('/api', continueSession);


	//--- serve static files (more middleware, technically)
	if(process.env.NODE_ENV === 'development') {
		expr.use('/', express.static('./client/src'));
		expr.use('/', express.static('./.tmp'));
		expr.use('/', express.static('./shared'));
	}
	else {
		expr.use('/', express.static('../client/dist'));
	}


	//--- load routes
	expr.post('/api/canonCards', checkMod, require('./routes/canonCardsPost'));
	expr.delete('/api/cards', checkAuth, require('./routes/cardsDelete'));
	expr.get('/api/cards', checkAuth, require('./routes/cardsGet'));
	expr.post('/api/cards', checkAuth, require('./routes/cardsPost'));
	expr.delete('/api/decks', checkAuth, require('./routes/decksDelete'));
	expr.get('/api/decks', checkAuth, require('./routes/decksGet'));
	expr.post('/api/decks', checkAuth, require('./routes/decksPost'));
	expr.get(/^(?!\/api)((?!\.).)*$/i, require('./routes/indexGet')); //--- this ridiculous regex matches any string that does not start with '/api' and does not contain a period.
	expr.get('/api/tests', require('./routes/testsGet'));
	expr.delete('/api/token', require('./routes/tokensDelete'));
	expr.get('/api/token', require('./routes/tokensGet'));


	//--- load multi
	require('./multi/init')(io);


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
