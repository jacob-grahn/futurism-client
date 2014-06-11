angular.module('futurism')
    .controller('GameEndModalCtrl', function ($scope, gameId, SummaryResource, me, _, window) {
        'use strict';
        
        var VICTORY = 'victory';
        var DEFEAT = 'defeat';
        var UNINVOLVED = 'uninvolved';
        
        var shareUrl = 'https://futurism.io/games/' + gameId + '/replay';
        
        $scope.shareUrl = shareUrl;
        $scope.gameId = gameId;
        
        
        $scope.summ = SummaryResource.get({gameId: $scope.gameId}, function() {
            var winners = _.filter($scope.summ.players, {team: $scope.summ.winningTeam});
            var inTheGame = _.filter($scope.summ.players, {_id: me.userId}).length > 0;
            var isWinner = _.filter(winners, {_id: me.userId}).length > 0;
            
            if(!inTheGame) {
                $scope.status = UNINVOLVED;
            }
            else if(inTheGame && !isWinner) {
                $scope.status = DEFEAT;
            }
            else {
                $scope.status = VICTORY;
            }
        });
        
        
        $scope.shareFacebook = function() {
            window.FB.ui({
                method: 'share',
                href: shareUrl,
            });
        };
        
        $scope.shareTwitter = function() {
            var url = 'https://twitter.com/share?url=' + shareUrl;
            window.open(url, '_blank');
        };
        
    });