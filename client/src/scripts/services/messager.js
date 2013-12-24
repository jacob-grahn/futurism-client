angular.module('futurism')
	.factory('messager', function($timeout) {
		'use strict';
		var self = this;
		var messages = [];
		self.cur = null;


		self.addMessage = function(txt, type, interrupt) {
			var message = {txt: txt, type: type};
			if(interrupt) {
				self.cur = null;
				messages = [message];
			}
			else {
				messages.push(message);
			}
			self.showNext();
		};


		self.showNext = function() {
			if(!self.cur && messages.length > 0) {
				self.cur = messages.shift();
				$timeout(self.endShow, 3000);
			}
		};


		self.endShow = function() {
			self.cur = null;
			self.showNext();
		};


		self.clear = function() {
			self.cur = null;
			messages = [];
		};

		return self;

	});