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

				var chat = new Chat(scope.room);

				chat.subscribe();
				scope.chat = chat;
				scope.lang = lang;


				var scrollToBottom = function() {
					var log = elem.find('.chat-log');
					var scrollHeight = log[0].scrollHeight - log.height() + 50;

					log.clearQueue();
					log.animate({scrollTop: scrollHeight}, 250);
				};


				scope.sendMessage = function() {
					if(scope.typedMessage) {
						chat.send(scope.typedMessage);
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


				scope.$watch('chat.getReceivedCount()', function(oldCount, newCount) {
					if(newCount >= chat.maxMsgs) {
						var log = elem.find('.chat-log');
						log[0].scrollTop -= 15;
					}
					scrollToBottom();
				});


				$(window).on('resize', scrollToBottom);


				scope.$on('$destroy', function() {
					$(window).off('resize', scrollToBottom);
					chat.unsubscribe();
				});
			}
		};

	});