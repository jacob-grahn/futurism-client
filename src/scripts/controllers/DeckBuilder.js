angular.module('futurism')
    .controller('DeckBuilderCtrl', function($scope, CardResource, FavoriteCardResource, PublicCardResource, DeckResource, deckInProgress, shared, me, _) {
        'use strict';

        var deck = deckInProgress.deck;
        $scope.deck = deck;
        $scope.deckFns = shared.deckFns;
        $scope.me = me;
        
        $scope.tabs = [
            {
                heading: 'myCards',
                resource: CardResource,
                query: {userId: me.userId},
                results: []
            },
            {
                heading: 'favoriteCards',
                resource: FavoriteCardResource,
                query: {userId: me.userId},
                results: []
            },
            {
                heading: 'popularCards',
                resource: PublicCardResource,
                query: {},
                results: []
            }
        ];
        
        
        $scope.$on('event:sessionChanged', function(srcScope, session) {
            $scope.tabs[0].query.userId = session._id;
            $scope.tabs[1].query.userId = session._id;
        });


        $scope.saveDeck = function() {
            var cardIds = [];
            var deck = $scope.deck;
            _.each(deck.cards, function(card) {
                cardIds.push(card._id);
            });

            var params = {
                name: deck.name,
                cards: cardIds,
                share: deck.share,
                userId: me.userId
            };
            
            var promise = DeckResource.save(params, function(storedDeck) {
                deck._id = storedDeck._id;
            }).$promise;

            return promise;
        };


        $scope.applyDefaults = function() {
            shared.deckFns.applyDefaults($scope.deck);
        };


        $scope.deleteDeck = function() {
            DeckResource.delete({deckId: $scope.deck._id});
            shared.deckFns.applyDefaults($scope.deck);
        };


        $scope.addCard = function(card) {
            deck.cards.push(angular.copy(card));
            $scope.sortDeck();
        };


        $scope.removeCard = function(card) {
            var index = deck.cards.indexOf(card);
            if(index !== -1) {
                deck.cards.splice(index, 1);
            }
            $scope.sortDeck();
        };


        $scope.sortDeck = function() {
            deck.cards.sort(function(a, b) {

                //sort pride descending
                if(a.pride !== b.pride) {
                    return b.pride - a.pride;
                }
                else {

                    //sort name descending
                    var nameA = a.name.toLowerCase();
                    var nameB = b.name.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    //default return value (no sorting)
                    return 0;
                }
            });
        };
    });