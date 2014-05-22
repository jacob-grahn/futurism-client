angular.module('futurism')
    .factory('sound', function(window, _) {
        'use strict';
        
        var Media = window.Media;
        var Howl = window.Howl;
        var sounds = {};
        

        var self = {
            
            
            setupSounds: function(names) {
                
                // Media is avialble in android app
                // set it up to mimic the api of Howl
                if(Media) {
                    _.each(names, function(name) {
                    
                        if(sounds[name]) {
                            return 'sound aleady exists';
                        }

                        var sound;

                        sound = new Media('/sounds/' + name + '.mp3');
                        sound._curVolume = 1;
                        sound._fadeSteps = 0;
                        sound._fadeChangePerStep = 0;
                        sound._fadeTo = 0;
                        sound._fadeInterval = 100;
                        
                        sound.pause = function() {
                            sound.stop();
                        };

                        sound.volume = function(vol) {
                            if(_.isNumber(vol)) {
                                sound._curVolume = vol;
                                sound.setVolume(vol);
                            }
                            return sound._curVolume;
                        };

                        sound.fade = function(startVol, endVol, time, callback) {
                            sound._fadeTo = endVol;
                            sound._fadeSteps = time / sound._fadeInterval;
                            sound._fadeChangePerStep = (endVol - startVol) / sound._fadeSteps;
                            sound._fadeStep();
                            if(callback) {
                                _.delay(callback, time);
                            }
                        };

                        sound._fadeStep = function() {
                            sound._fadeSteps--;
                            if(sound._fadeSteps <= 0) {
                                sound.volume(sound._fadeTo);
                            }
                            else {
                                sound.volume(sound.volume() + sound._fadeChangePerStep);
                                _.delay(sound._fadeStep, sound._fadeInterval);
                            }
                        };

                        sounds[name] = sound;
                    });
                }
                
                // Howl is avilable on the website
                else {
                    _.each(names, function(name) {
                        if(sounds[name]) {
                            return 'sound already exists';
                        }
                        var sound = new Howl({
                            urls: ['/sounds/' + name + '.ogg', '/sounds/'+ name + '.mp3']
                        });
                        sounds[name] = sound;
                    });
                }
            },
            
            
            streamUrl: function(url) {
                var sound;
                
                if(Media) {
                    if(url.url) {
                        url = url.url;
                    }
                    sound = new Media(url);
                }
                
                else {
                    if(url.url) {
                        sound = new Howl({
                            urls: [url.url],
                            format: url.format
                        });
                    }
                    else {
                        sound = new Howl({
                            urls: [url]
                        });
                    }
                }
                
                var instance = sound.play();
                console.log(url, instance);
                return instance;
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