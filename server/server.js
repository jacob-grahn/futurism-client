(function() {
	'use strict';

	//--- initialize
	var express = require('express');
	var expr = express();
	var httpServer = require('http').createServer(expr);
	var io = require('socket.io').listen(httpServer);


	//--- mongoose connect
	var mongoose = require('mongoose');
	require('./fns/mongoose/findByIdAndSave').attach(mongoose);
	require('./fns/mongoose/findOneAndSave').attach(mongoose);
	require('./fns/mongoose/validatedUpdate').attach(mongoose);
	mongoose.connect(process.env.MONGO_URI);


	//--- redis connect
	var redisSession = require('./fns/redisSession');
	redisSession.connect(process.env.REDIS_URI);


	//--- middleware
	expr.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));

	expr.use('/globe', require('./middleware/nocache'));
	expr.use('/globe', require('./middleware/proxy')(process.env.GLOBE_URI));
	expr.use('/api', require('./middleware/nocache'));
	expr.use('/api', require('./middleware/output'));
	/*expr.use('/api', express.urlencoded());
	expr.use('/api', express.json());*/
	expr.use('/api', express.bodyParser());
	expr.use('/api', require('./middleware/consolidateQuery'));


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
	require('./routes')(expr);


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
