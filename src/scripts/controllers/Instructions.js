angular.module('futurism')
    .controller('InstructionsCtrl', function($scope, $sce) {
        'use strict';
        $scope.vids = [
            {
                title: 'How to be Futuristic',
                desc: 'wash your hair in space',
                url: $sce.trustAsResourceUrl('https://www.youtube.com/embed/kOIj7AgonHM')
            }
        ];
    });