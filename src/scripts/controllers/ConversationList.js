angular.module('futurism')
    .controller('ConversationListCtrl', function($scope, $location, ConversationResource, me, unread) {
        'use strict';

        $scope.me = me;
        
        $scope.ConversationResource = ConversationResource;
        $scope.query = {};
        $scope.convos = [];


        $scope.selectConvo = function(convo) {
            unread.unreadCount = 0;
            var userId = $scope.getOtherUserId(convo);
            $location.url('messages/' + userId);
        };


        $scope.getOtherUserId = function(message) {
            if(message.toUser._id === me.userId) {
                return message.fromUser._id;
            }
            else {
                return message.toUser._id;
            }
        };
    });