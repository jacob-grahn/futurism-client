angular.module('futurism')
    .controller('CreditsCtrl', function($scope, $http) {
        'use strict';

        $scope.software = [];
        $scope.testers = [];

        $http.get('data/betaTesters.json').success(function(res) {
            $scope.testers = res;
        });

        $http.get('data/software.json').success(function(res) {
            $scope.software = res;
        });

    });