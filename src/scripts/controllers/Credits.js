angular.module('futurism')
    .controller('CreditsCtrl', function($scope, $http) {
        'use strict';

        $scope.software = [];
        $scope.testers = [];
        $scope.languages = {};

        $http.get('data/languages.json').success(function(res) {
            $scope.languages = res;
        });
        
        $http.get('data/betaTesters.json').success(function(res) {
            $scope.testers = res;
        });

        $http.get('data/software.json').success(function(res) {
            $scope.software = res;
        });

    });