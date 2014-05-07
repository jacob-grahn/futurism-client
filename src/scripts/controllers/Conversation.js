angular.module('futurism')
    .controller('ConversationCtrl', function($scope, $routeParams, $location, MessageResource, ConversationResource) {
        'use strict';
        
        var userId = $routeParams.userId;
        $scope.convo = ConversationResource.get({userId: $routeParams.userId});
        
        $scope.sendMessage = function() {
            var typedMessage = $scope.typedMessage;
            $scope.typedMessage = '';

            MessageResource.save({userId: userId, body: typedMessage}, function() {
                $location.url('messages');
            });
        };


        $scope.deleteConversation = function() {
            ConversationResource.delete({userId: userId}, function() {
                $location.url('messages');
            });
        };


        $scope.reportConversation = function() {
            ConversationResource.post({userId: userId, action: 'report'}, function() {
                $scope.deleteConversation();
            });
        };
    });