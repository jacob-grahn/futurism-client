angular.module('futurism')
    .controller('CardSelectorCtrl', function ($scope, $location, $routeParams, CardResource, FavoriteCardResource, UserResource, cardInProgress, me, shared, _) {
        'use strict';

        var groups = shared.groups;

        $scope.me = me;
        $scope.userId = $routeParams.userId;
        $scope.user = UserResource.get({userId: $scope.userId});

        $scope.CardResource = CardResource;
        $scope.query = {userId: $scope.userId};
        $scope.cards = [];

        
        $scope.newCard = function() {
            cardInProgress.reset();
            $location.url('/card-builder');
        };

        
        $scope.selectCard = function (card) {
            if ($scope.userId === me.user._id) {
                cardInProgress.card = card;
                $location.url('/card-builder');
            }
        };

        
        $scope.reportCard = function (card) {
            var r = CardResource.save({
                userId: card.userId,
                cardId: card._id,
                action: 'report'
            }, function () {
                // say the report worked
            });
            return r.$promise;
        };

        
        $scope.deleteCard = function (card) {
            var r = CardResource.delete({
                userId: card.userId,
                cardId: card._id
            }, function () {
                _.pull($scope.cards, card);
            });
            return r.$promise;
        };
        
        
        $scope.addFavorite = function(card) {
            FavoriteCardResource.put({userId: me.userId, cardId: card._id}, function() {
                me.progress.favCards.push(card._id);
                me.progress.favCards = _.unique(me.progress.favCards);
            });
        };
        
        
        $scope.removeFavorite = function(card) {
            FavoriteCardResource.delete({userId: me.userId, cardId: card._id}, function() {
                _.pull(me.progress.favCards, card._id);
            });
        };
        
        
        $scope.canAddFavorite = function(card) {
            return me.progress.favCards && me.progress.favCards.indexOf(card._id) === -1 && card.share && card.userId !== me.userId;
        };
        
        
        $scope.canRemoveFavorite = function(card) {
            return me.progress.favCards && me.progress.favCards.indexOf(card._id) !== -1;
        };
        
        
        $scope.canEdit = function(card) {
            return me.userId === card.userId;
        };

        
        $scope.canReport = function () {
            if (me.user.group === groups.APPRENTICE || me.user.group === groups.MOD || me.user.group === groups.ADMIN) {
                return true;
            }
        };

        
        $scope.canDelete = function (card) {
            if (card.userId === me.user._id) {
                return true;
            }
            if (me.user.group === groups.MOD || me.user.group === groups.ADMIN) {
                return true;
            }
        };

    });