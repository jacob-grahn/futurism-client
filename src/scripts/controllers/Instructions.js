angular.module('futurism')
    .controller('InstructionsCtrl', function($scope, $sce) {
        'use strict';
        $scope.vids = [
            {
                title: 'Making Cards and Decks',
                desc: 'by Nedron',
                url: $sce.trustAsResourceUrl('https://www.youtube.com/embed/oQJWb3dQJ9Q')
            },
            {
                title: 'Basic Gameplay',
                desc: 'by Nedron',
                url: $sce.trustAsResourceUrl('https://www.youtube.com/embed/qiZmwdJJFXQ')
            },
            {
                title: 'Be Futuristic',
                desc: 'necessary information',
                url: $sce.trustAsResourceUrl('https://www.youtube.com/embed/kOIj7AgonHM')
            }
        ];
    });