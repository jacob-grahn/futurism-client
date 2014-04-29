angular.module('futurism')
    .controller('StoreCtrl', function($scope, shared, moustache) {
        'use strict';
        
        $scope.futures = shared.futures;
        $scope.fractures = 7;
        $scope.fracturesNeeded = 4;
        $scope.moustache = moustache;
    });