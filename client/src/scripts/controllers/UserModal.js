angular.module('futurism')
	.controller('UserModalCtrl', function($scope, userId, UserResource, StatsResource, $modal) {
		'use strict';

		$scope.user = UserResource.get({userId: userId});
		$scope.stats = StatsResource.get({userId: userId});

		$scope.message = function() {
			$modal.open({
				templateUrl: 'views/messageModal.html',
				controller: 'MessageModalCtrl',
				resolve: {
					toUserId: function () {
						return userId;
					}
				}
			});
			$scope.$dismiss('message');
		}
	});