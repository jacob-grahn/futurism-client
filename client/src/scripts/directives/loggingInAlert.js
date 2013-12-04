angular.module('futurism.directives', [])
	.directive('loggingInAlert', function() {
		'use strict';

		return {
			restrict: 'C',
			link: function(scope, elem, attrs) {
				var login = $('<div class="logging-in">Logging In...</div>');
				elem.append(login);
				login.hide();

				scope.$on('event:auth-loginRequired', function() {
					login.show();
				});
				scope.$on('event:auth-loginConfirmed', function() {
					login.hide();
				});
			}
		}

	});