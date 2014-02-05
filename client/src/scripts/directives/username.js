angular.module('futurism')
	.directive('username', function($modal) {
		'use strict';

		return {
			restrict: 'AE',
			replace: true,
			scope: {
				name: '@',
				id: '@',
				site: '@',
				group: '@',
				link: '@',
				size: '@'
			},
			templateUrl: 'views/username.html',
			link: function(scope) {

				scope.displaySize = scope.size || 'small';

				if(scope.displaySize === 'small') {
					scope.avatarWidth = 16;
					scope.avatarHeight = 16;
				}
				if(scope.displaySize === 'large') {
					scope.avatarWidth = 48;
					scope.avatarHeight = 48;
				}

				scope.showUser = function () {

					var link = scope.link || 'true';

					if(link === 'true') {
						$modal.open({
							templateUrl: 'views/userModal.html',
							controller: 'UserModalCtrl',
							resolve: {
								userId: function () {
									return scope.id;
								}
							}
						});
					}
				};
			}
		};

	});

