angular.module('futurism')
    .factory('sound', function(window, _) {
        'use strict';
        
        var Howl = window.Howl;
        var sounds = {};
        

        var self = {
            
            
            setupSounds: function(names) {
                _.each(names, function(name) {
                    if(sounds[name]) {
                        return 'sound already exists';
                    }
                    var sound = new Howl({
                        urls: ['/sounds/' + name + '.ogg', '/sounds/'+ name + '.mp3']
                    });
                    sounds[name] = sound;
                });
            },
            
            
            get: function(soundId) {
                if(!sounds[soundId]) {
                    self.setupSounds([soundId]);
                }
                return sounds[soundId];
            },

            
            play: function(soundId, vol) {
                var sound = self.get(soundId);
                var instance = sound.play();
                sound.volume(vol || 1);
                return instance;
            }

        };
        
        
        return self;
    });