angular.module('futurism')
    .controller('MessageModalCtrl', function($scope, toUserId, MessageResource, UserResource) {
        'use strict';

        $scope.user = UserResource.get({userId: toUserId});
        $scope.body = '';


        $scope.send = function(body) {
            if(body) {
                MessageResource.save({userId: toUserId, body: body});
                $scope.$dismiss('send');
            }
        };
    });