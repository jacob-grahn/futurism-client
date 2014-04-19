angular.module('futurism')
    .controller('ModLogCtrl', function($scope, ModLogResource) {
        'use strict';

        $scope.query = {sort: {_id: -1}};
        $scope.ModLogResource = ModLogResource;
        $scope.logs = [];


    });