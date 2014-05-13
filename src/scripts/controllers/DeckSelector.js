angular.module('futurism')
    .controller('DeckSelectorCtrl', function($scope, $location, $routeParams, deckInProgress, DeckResource, FavoriteDeckResource, me, _, shared) {
        'use strict';

        $scope.DeckResource = DeckResource;
        $scope.query = {userId: $routeParams.userId};
        $scope.decks = [];

        $scope.me = me;

        
        $scope.select = function(deck) {
            deckInProgress.deck = DeckResource.get({deckId: deck._id, userId: $routeParams.userId});
            $location.url('/deck-builder');
        };
        
        
        $scope.newDeck = function() {
            deckInProgress.reset();
            $location.url('/deck-builder');
        };
        
        
        $scope.deleteDeck = function(deck) {
            var r = DeckResource.delete({
                userId: deck.userId,
                deckId: deck._id
            }, function () {
                _.pull($scope.decks, deck);
            });
            return r.$promise;
        };
        
        
        $scope.addFavorite = function(deck) {
            FavoriteDeckResource.put({userId: me.userId, deckId: deck._id}, function() {
                me.stats.favDecks.push(deck._id);
                me.stats.favDecks = _.unique(me.stats.favDecks);
            });
        };
        
        
        $scope.removeFavorite = function(deck) {
            FavoriteDeckResource.delete({userId: me.userId, deckId: deck._id}, function() {
                _.pull(me.stats.favDecks, deck._id);
            });
        };
        
        
        $scope.canEdit = function(deck) {
            return deck.userId === me.userId;
        };
        
        
        $scope.canDelete = function(deck) {
            return me.user.group === shared.groups.MOD || me.user.group === shared.groups.ADMIN || deck.user._id === me.user._id;
        };
        
        
        $scope.canAddFavorite = function(deck) {
            return me.stats.favDecks.indexOf(deck._id) === -1;
        };
        
        
        $scope.canRemoveFavorite = function(deck) {
            return me.stats.favDecks.indexOf(deck._id) !== -1;
        };
    });