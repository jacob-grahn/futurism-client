angular.module('futurism')
    .controller('LoadupFuturesCtrl', function($scope, shared, loadup, _, me) {
        'use strict';

        loadup.resumePrep();

        $scope.futureCount = loadup.rules.futures;
        $scope.futures = shared.futures;
        $scope.selectedFutures = loadup.selectedFutures;


        $scope.selectFuture = function(futureId) {
            if($scope.iHaveFuture(futureId)) {
                loadup.selectFuture(futureId);
            }
        };


        $scope.$watchCollection('selectedFutures', function() {
            $scope.selected = _.times(loadup.rules.futures, function(index) {
                return {future: $scope.selectedFutures[index]};
            });
        });
        
        
        $scope.iHaveFuture = function(futureId) {
            if(me.progress && me.progress.futures) {
                return me.progress.futures.indexOf(futureId) !== -1;
            }
            else {
                return false;
            }
        };
    });