angular.module('futurism')
    .controller('BansCtrl', function($scope, $routeParams, UserResource) {
        'use strict';

        var userId = $routeParams.userId;
        $scope.user = UserResource.get({userId: userId, bans: true});
    });