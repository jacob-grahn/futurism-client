angular.module('futurism')
	.controller('UserModalCtrl', function($scope, userId, UserResource, StatsResource, ApprenticeResource, ModeratorResource, $modal) {
		'use strict';

		$scope.user = UserResource.get({userId: userId});
		$scope.stats = StatsResource.get({userId: userId});


		/**
		 * Open another modal to send user a message
		 */
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
		};


		/**
		 * promote user to apprentice
		 */
		$scope.apprentice = function() {
			ApprenticeResource.put({userId: userId});
			$scope.$dismiss('apprentice');
		};


		/**
		 * demote an apprentice
		 */
		$scope.deApprentice = function() {
			ApprenticeResource.delete({userId: userId});
			$scope.$dismiss('deApprentice');
		};


		/**
		 * promote apprentice to moderator
		 */
		$scope.mod = function() {
			ModeratorResource.put({userId: userId});
			$scope.$dismiss('mod');
		};


		/**
		 * demote a moderator
		 */
		$scope.deMod = function() {
			ModeratorResource.delete({userId: userId});
			$scope.$dismiss('deMod');
		};
	});