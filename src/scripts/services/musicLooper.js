angular.module('futurism')
    .factory('musicLooper', function($rootScope, $location, sound, fader) {
        'use strict';
        
        var song;
        var playing = false;
        var titleVolume = 1;
        var menuVolume = 0.33;
        var fadeMs = 2000;
        var soundId;
        
        
        var considerLocation = function() {
            var url = $location.url();
            if(url === '/' || url === '' || url.indexOf('/title') !== -1) {
                self.start(titleVolume);
            }
            else if(url.indexOf('/game') !== -1 || url.indexOf('/vids') !== -1) {
                self.stop();
            }
            else {
                self.start(menuVolume);
            }
        };
        
        
        var createSong = function() {
            song = sound.streamUrl('/sounds/dissolve.ogg', true, function() {
                if(playing) {
                    song.play();
                }
            });
            song.setVolume(0);
        };
        
        
        var self = {
            
            start: function(targetVolume) {
                if(!song) {
                    createSong();
                }
                if(!playing) {
                    playing = true;
                    soundId = song.play();
                }
                fader.fade(song, targetVolume, fadeMs);
            },
            
            stop: function() {
                if(playing) {
                    fader.fade(song, 0, fadeMs, function() {
                        playing = false;
                        song.pause();
                    });
                }
            },
            
            init: function() {
                considerLocation();
                $rootScope.$on('$routeChangeSuccess', considerLocation);
            }
        };
        
        return self;
    });