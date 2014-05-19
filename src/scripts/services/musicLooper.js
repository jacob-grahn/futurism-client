angular.module('futurism')
    .factory('musicLooper', function($rootScope, $location, sound) {
        'use strict';
        
        var playing = false;
        var titleVolume = 1;
        var menuVolume = 0.33;
        var fadeMs = 2000;
        var soundId;
        
        
        var song = sound.get('dissolve');
        
        
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
        
        
        var self = {
            
            start: function(targetVolume) {
                if(!playing) {
                    playing = true;
                    soundId = song.play();
                }
                song.fade(song.volume(), targetVolume, fadeMs);
            },
            
            stop: function() {
                if(playing) {
                    song.fade(song.volume(), 0, fadeMs, function() {
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