angular.module('futurism')
    .controller('GameSummaryCtrl', function($scope, $routeParams, SummaryResource, me, rankCalc, _, modals) {
        'use strict';

        $scope.gameId = $routeParams.gameId;
        $scope.me = me;
        $scope.rankCalc = rankCalc;

        
        var makeCardDict = function(cards) {
            var dict = {};
            _.each(cards, function(card) {
                dict[card._id] = card;
            });
            return dict;
        };

        
        var fillCards = function(players, cards) {
            var cardDict = makeCardDict(cards);
            _.each(players, function(player) {
                _.each(player.deck.cards, function(cardId, index) {
                    player.deck.cards[index] = _.clone(cardDict[cardId]);
                });
            });
        };
        
        
        var iWonFracture = function(summary) {
            var ret = false;
            _.each(summary.users, function(user) {
                if(user._id === me.userId && user.fractures > user.oldFractures) {
                    ret = true;
                }
            });
            return ret;
        };
        
        
        $scope.summ = SummaryResource.get({gameId: $scope.gameId}, function() {
            fillCards($scope.summ.users, $scope.summ.cards);
            _.delay(function() {
                if(iWonFracture($scope.summ)) {
                    modals.openFracture();
                }
            }, 1000);
        });


    });