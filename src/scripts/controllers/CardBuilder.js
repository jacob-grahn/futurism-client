angular.module('futurism')
    .controller('CardBuilderCtrl', function($scope, shared, cardInProgress, dataUrlToBlob, CardResource, me, _) {
        'use strict';

        $scope.me = me;

        var factions = shared.factions;
        var cardFns = shared.cardFns;

        var objToArr = function(obj) {
            var arr = [];
            _.each(obj, function(value, abilityId) {
                if(value) {
                    arr.push(abilityId);
                }
            });
            return arr;
        };


        var arrToObj = function(arr) {
            var obj = {};
            _.each(arr, function(abilityId) {
                obj[abilityId] = true;
            });
            return obj;
        };


        var updatePride = function() {
            $scope.card.pride = cardFns.calcPride($scope.card);
        };


        $scope.saveCard = function() {
            $scope.card.imageUrl = null;
            $scope.card.userId = me.user._id;

            if($scope.uppedImage) {
                $scope.card.image = dataUrlToBlob($scope.uppedImage.resized.dataURL);
            }
            else {
                $scope.card.image = null;
            }

            var newCard = CardResource.save($scope.card, function() {
                $scope.uppedImage = null;
            });

            return newCard.$promise;
        };


        $scope.applyDefaults = function() {
            cardFns.applyDefaults($scope.card);
            $scope.abilityObj = {};
        };


        $scope.uppedImage = null;
        $scope.card = cardInProgress.card;
        $scope.factions = factions;
        $scope.abilityObj = arrToObj($scope.card.abilities);


        $scope.$watch('card.faction', function() {
            _.each($scope.abilityObj, function(value, key) {
                var abil = factions.abilityLookup[key];
                if(abil.id !== 'move' && abil.faction !== $scope.card.faction) {
                    $scope.abilityObj[key] = false;
                }
            });
        });


        $scope.$watchCollection('abilityObj', function() {
            $scope.card.abilities = objToArr($scope.abilityObj);
            updatePride();
        });


        $scope.$watchCollection('[card.attack, card.health]', updatePride);


        $scope.$watch('uppedImage', function() {
            if($scope.uppedImage) {
                $scope.card.imageUrl = $scope.uppedImage.resized.dataURL;
                $scope.card.hasImage = false;
            }
        });

    });