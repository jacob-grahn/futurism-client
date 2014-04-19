angular.module('futurism')
    .controller('ErrorCtrl', function($scope, errorHandler) {
        'use strict';

        $scope.errorMessage = '';
        $scope.stack = [];

        var err = errorHandler.getLastError();
        if(err.stack) {
            $scope.errorMessage = err.message;
            $scope.stack = err.stack.split('\n');
        }
        else if(_.isString(err)) {
            $scope.errorMessage = err;
        }
        else {
            $scope.errorMessage = JSON.stringify(err, null, 2);;
        }

    });