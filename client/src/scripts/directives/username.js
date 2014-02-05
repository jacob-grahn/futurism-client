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
				group: '@'
			},
			templateUrl: 'views/username.html',
			link: function(scope) {

				scope.showUser = function () {

					console.log('showUser', scope.id);

					var modalInstance = $modal.open({
						templateUrl: 'views/userModal.html',
						controller: 'UserModalCtrl',
						resolve: {
							userId: function () {
								return scope.id;
							}
						}
					});
				};
			}
		};

	});

