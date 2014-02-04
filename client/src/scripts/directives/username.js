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

					var modalInstance = $modal.open({
						templateUrl: 'views/modal.html'
						 /*resolve: {
							items: function () {
								return $scope.items;
							}
						}*/
					});

					/*modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
					}, function () {
						$log.info('Modal dismissed at: ' + new Date());
					});*/
				};
			}
		};

	});