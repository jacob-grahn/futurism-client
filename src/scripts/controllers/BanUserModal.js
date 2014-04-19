angular.module('futurism')
    .controller('BanUserModalCtrl', function($scope, userId, UserResource, BanResource) {
        'use strict';

        $scope.user = UserResource.get({userId: userId});


        /**
         * ban a user
         */
        $scope.ban = function(reason) {
            BanResource.save({userId: userId, reason: reason, type: 'ban'});
            $scope.$dismiss('ban');
        };


        /**
         * silence a user
         */
        $scope.silence = function(reason) {
            BanResource.save({userId: userId, reason: reason, type: 'silence'});
            $scope.$dismiss('silence');
        };
    });