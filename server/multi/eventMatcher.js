'use strict';

var _ = require('lodash');
var lobby = require('./lobby');


var freq = 60 * 60 * 1000;
var duration = 3 * 1000;
var io;
var timeoutId;



var notifyTick = function() {
	timeoutId = _.delay(eventStartTick, freq * 0.25);
	notify();
};


var eventStartTick = function() {
	timeoutId = _.delay(eventEndTick, freq * 0.75);
	eventStart();
};


var eventEndTick = function() {
	timeoutId = _.delay(notifyTick, freq * 0.75);
	eventEnd();
};



var notify = function() {
	var time = new Date( new Date().getTime() + freq * 0.25 );
	io.sockets.emit('notify', {message: 'incomingFracture', data: {time: time}});
};


var eventStart = function() {
	io.sockets.emit('notify', {message: 'startFracture'});
};


var eventEnd = function() {
	io.sockets.emit('notify', {message: 'endFracture'});
};



var self = {

	init: function(_io_) {
		io = _io_;
		self.start();
	},


	start: function() {
		self.stop();
		timeoutId = _.delay(notifyTick, freq * 0.75);
	},


	stop: function() {
		clearTimeout(timeoutId);
	}
};

self.start();


module.exports = self;