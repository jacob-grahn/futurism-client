angular.module('futurism')
    .controller('LanguageCtrl', function($scope, $http) {
        'use strict';
        
        $scope.languages = {};
            
        $http.get('data/languages.json').success(function(res) {
            $scope.languages = res;
        });
    });