angular.module('futurism')
    .factory('fader', function(_) {
        'use strict';
        
        var fadeInterval = 150;        
        var fadingSounds = [];
        
        
        var step = function() {
            
            _.each(fadingSounds, function(sound) {
                if(!sound) {
                    return;
                }
                if(sound._fadeSteps <= 0) {
                    sound.setVolume(sound._targetVolume);
                    _.pull(fadingSounds, sound);
                    if(sound._fadeCallback) {
                        sound._fadeCallback();
                    }
                }
                else {
                    var volChange = (sound._targetVolume - sound.getVolume()) / sound._fadeSteps;
                    sound.setVolume(sound.getVolume() + volChange);
                    sound._fadeSteps--;
                }
            });
        };

        
        var self = {
            
            fade: function(sound, vol, time, callback) {
                sound._targetVolume = vol;
                sound._fadeSteps = time / fadeInterval;
                sound._fadeCallback = callback;
                
                if(fadingSounds.indexOf(sound) === -1) {
                    fadingSounds.push(sound);
                }
            }
        };
        
        
        var intervalId = setInterval(step, fadeInterval);
        
        
        return self;
    });