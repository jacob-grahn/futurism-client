angular.module('futurism')
	.directive('chatDisplay', ['Chat', function(Chat) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			scope: {
				room: '@'
			},
			templateUrl: 'views/chat-display.html',

			link: function (scope, elem, attrs) {

				var chat = Chat(scope.room);
				chat.subscribe();
				scope.chat = chat;

				scope.sendMessage = function() {
					if(scope.typedMessage) {
						chat.send(scope.typedMessage);
						scope.typedMessage = null;
					}
				};

				scope.$on('$destroy', function() {
					chat.unsubscribe();
				});
			}
		}

	}]);