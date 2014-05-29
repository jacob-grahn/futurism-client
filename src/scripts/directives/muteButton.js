angular.module('futurism')
    .directive('muteButton', function(sound) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            template: "<a ng-class=\"{'mute-button': true, 'glyphicon': true, 'glyphicon-volume-off': sound.isMuted(), 'glyphicon-volume-up': !sound.isMuted()}\" ng-click=\"sound.toggleMute()\"></a>",
            
            link: function(scope) {
                scope.sound = sound;
            }
            
        };

    });