angular.module('futurism')
	.directive('chatDisplay', function(chat, lang, window, $) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			scope: {
				room: '@'
			},
			templateUrl: 'views/chat-display.html',

			link: function (scope, elem) {

				scope.chat = chat;
				scope.msgs = [];
				scope.lang = lang;

				var logElem = elem.find('.chat-log');


				var scrollToBottom = _.throttle(function() {

					var scrollTop = logElem[0].scrollHeight - logElem.height();
					logElem.animate({scrollTop: scrollTop}, 200);

				}, 200);


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


				scope.$watch('chat.receivedCount', function(newCount) {
					if(scope.chat) {

						if(newCount >= scope.chat.maxMsgs) {
							logElem[0].scrollTop = logElem[0].scrollHeight - logElem.height() - $('.chat-log li:first-child').height();
						}

						_.delay(scrollToBottom, 50);
						_.delay(scrollToBottom, 1000);
					}
				});


				scope.$watch('room', function(newRoom) {
					if(newRoom) {
						scope.chat.join(newRoom);
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