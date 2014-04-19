angular.module('futurism')
    .directive('musicPlayer', function(window, memory) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/music-player.html',


            link: function (scope, elem, attrs) {
                var SC = window.SC;
                var widget = SC.Widget('soundcloud-player');


                var playNextSong = function() {


                    widget.getSounds(function(sounds) {
                        var nextIndex = Math.floor(Math.random() * sounds.length);
                        widget.skip(nextIndex);
                        widget.play();
                    });
                };


                // autoplay on load
                widget.bind(SC.Widget.Events.READY, function() {
                    if(memory.long.get('playmusic') !== 'no') {
                        playNextSong();
                    }
                });

                // play next song on finish
                widget.bind(SC.Widget.Events.FINISH, function() {
                    playNextSong();
                });

                // set the volume constantly, as it doesn't work otherwise
                widget.bind(SC.Widget.Events.PLAY_PROGRESS, function() {
                    widget.setVolume(60);
                });

                // turn off autoplay if pause is clicked
                widget.bind(SC.Widget.Events.PAUSE, function() {
                    memory.long.set('playmusic', 'no');
                });

                // turn on autoplay if play is clicked
                widget.bind(SC.Widget.Events.PLAY, function() {
                    memory.long.set('playmusic', 'yes');
                });


                /*scope.$on('$destroy', function() {
                    widget.unbind(SC.Widget.Events.READY, playNextSong);
                });*/
            }
        };

    });