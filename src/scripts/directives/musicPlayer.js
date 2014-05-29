angular.module('futurism')
    .directive('musicPlayer', function ($sce, window, memory, _, $) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/music-player.html',


            link: function (scope) {

                var $window = $(window);
                var widget;
                var startTrack = Math.ceil(Math.random() * 20);
                var SC = window.SC;
                var url = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/27086694&amp;color=ff5500&amp;auto_play=false&amp;hide_related=true&amp;show_artwork=true&amp;start_track=' + startTrack;
                var trustedUrl = $sce.trustAsResourceUrl(url);


                var shouldPlay = function () {
                    return memory.long.get('playmusic') !== 'no';
                };


                var onClick = function () {
                    if (shouldPlay) {
                        widget.play();
                    } 
                    else {
                        $window.unbind('click', onClick);
                    }
                };


                var onProgress = function () {
                    widget.setVolume(80);
                    $window.unbind('click', onClick);
                    widget.unbind(SC.Widget.Events.PLAY_PROGRESS, onProgress);
                };


                scope.url = trustedUrl;

                _.delay(function () {
                    widget = SC.Widget('soundcloud-player');

                    var playNextSong = function () {
                        widget.getSounds(function (sounds) {
                            var nextIndex = Math.floor(Math.random() * sounds.length);
                            widget.skip(nextIndex);
                            widget.play();
                        });
                    };


                    // autoplay on load
                    widget.bind(SC.Widget.Events.READY, function () {
                        if (memory.long.get('playmusic') !== 'no') {
                            playNextSong();
                        }
                    });

                    // play next song on finish
                    widget.bind(SC.Widget.Events.FINISH, function () {
                        playNextSong();
                    });

                    // set the volume constantly, as it doesn't work otherwise
                    widget.bind(SC.Widget.Events.PLAY_PROGRESS, onProgress);

                    // turn off autoplay if pause is clicked
                    widget.bind(SC.Widget.Events.PAUSE, function () {
                        memory.long.set('playmusic', 'no');
                    });

                    // turn on autoplay if play is clicked
                    widget.bind(SC.Widget.Events.PLAY, function () {
                        memory.long.set('playmusic', 'yes');
                    });


                    $window.bind('click', onClick);


                    scope.$on('$destroy', function () {
                        widget.unbind(SC.Widget.Events.READY, playNextSong);
                        widget.unbind(SC.Widget.Events.PLAY_PROGRESS, onProgress);
                        $window.unbind('click', onClick);
                    });

                });
            }
        };

    });