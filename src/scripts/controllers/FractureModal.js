angular.module('futurism')
    .controller('FractureModalCtrl', function($scope) {
        'use strict';
        $scope.fractureId = Math.floor(Math.random()*3);
    });