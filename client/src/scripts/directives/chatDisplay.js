angular.module('futurism')
	.directive('chatDisplay', function(Chat, lang, window, $) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			scope: {
				room: '@'
			},
			templateUrl: 'views/chat-display.html',

			link: function (scope, elem) {

				scope.chat = null;
				scope.msgs = [];
				scope.lang = lang;


				var scrollToBottom = _.throttle(function() {
					var log = elem.find('.chat-log');
					var scrollHeight = log[0].scrollHeight - log.height() + 50;
					log.clearQueue();
					log.animate({scrollTop: scrollHeight}, 250);
				}, 500);


				scope.sendMessage = function() {
					if(scope.typedMessage) {
						scope.chat.send(scope.typedMessage);
						scope.typedMessage = null;
					}
				};


				scope.filter = function(str) {
					//zalgo filter
					str = str.replace(/[\u0300-\u036f\u0483-\u0489\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '');

					//newline filter
					str = str.replace(/\n\r/g, '');

					//all done!
					return str;
				};


				scope.$watch('chat.receivedCount', function(oldCount, newCount) {
					if(scope.chat) {
						if(newCount >= scope.chat.maxMsgs) {
							var log = elem.find('.chat-log');
							log[0].scrollTop -= 15;
						}
						scrollToBottom();
					}
				});


				scope.$watch('room', function(oldRoom, newRoom) {
					if(scope.chat) {
						scope.chat.unsubscribe();
						scope.msgs = [];
					}

					if(scope.room) {
						scope.chat = new Chat(scope.room);
						scope.chat.subscribe();
						scope.msgs = scope.chat.msgs;
					}
				});


				$(window).on('resize', scrollToBottom);


				scope.$on('$destroy', function() {
					$(window).off('resize', scrollToBottom);
					if(scope.chat) {
						scope.chat.unsubscribe();
					}
				});
			}
		};

	});