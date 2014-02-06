angular.module('futurism')
	.controller('MessagesCtrl', function($scope, ConversationResource, MessageResource, me) {
		'use strict';

		$scope.selectedConvo = {};
		$scope.convos = ConversationResource.query();
		$scope.me = me;


		$scope.selectConvo = function(convo) {
			var userId = $scope.getForeignUserId(convo);
			$scope.selectedConvo = ConversationResource.query({userId: userId});
		};


		$scope.getForeignUserId = function(convo) {
			var message = convo[0];
			var userId;

			if(message.toUser._id === me.userId) {
				userId = message.fromUser._id;
			}
			else {
				userId = message.toUser._id;
			}

			return userId;
		};


		$scope.sendMessage = function() {
			if(!$scope.selectedConvo) {
				return false;
			}

			var userId = $scope.getForeignUserId($scope.selectedConvo);
			var typedMessage = $scope.typedMessage;
			$scope.typedMessage = '';

			MessageResource.save({userId: userId, body: typedMessage}, function() {
				$scope.selectConvo($scope.selectedConvo);
			});
		};
	});