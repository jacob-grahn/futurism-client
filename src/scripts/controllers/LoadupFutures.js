angular.module('futurism')
    .controller('LoadupFuturesCtrl', function($scope, shared, loadup, _) {
        'use strict';

        loadup.resumePrep();

        $scope.futureCount = loadup.rules.futures;
        $scope.futures = shared.futures;
        $scope.selectedFutures = loadup.selectedFutures;


        $scope.selectFuture = function(futureId) {
            loadup.selectFuture(futureId);
        };


        $scope.$watchCollection('selectedFutures', function() {
            $scope.selected = _.times(loadup.rules.futures, function(index) {
                return {future: $scope.selectedFutures[index]};
            });
        });
    });