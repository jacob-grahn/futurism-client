angular.module('futurism')
    .factory('sound', function(window, _) {
        'use strict';
        
        var Media = window.Media;
        var Howl = window.Howl;
        var sounds = {};
        

        var self = {
            
            
            createMediaSound: function(url, mediaSuccess, mediaError, mediaStatus) {
                var sound;

                sound = new Media(url, mediaSuccess, mediaError, mediaStatus);
                sound._curVolume = 1;
                sound._fadeSteps = 0;
                sound._fadeChangePerStep = 0;
                sound._fadeTo = 0;
                sound._fadeInterval = 100;

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

                sound._pause = sound.pause;
                sound.pause = function() {
                    console.log('sound.pause', sound);
                    return sound._pause();
                };

                sound._stop = sound.stop;
                sound.stop = function() {
                    console.log('sound.stop', sound);
                    return sound._stop();
                };

                sound._play = sound.play;
                sound.play = function() {
                    sound._play();
                    return sound;
                };
                
                return sound;
            },
            
            
            setupSounds: function(names) {
                
                _.each(names, function(name) {

                    if(sounds[name]) {
                        return 'sound aleady exists';
                    }

                    // Media is avialble in android app
                    // set it up to mimic the api of Howl
                    if(Media) {
                        sounds[name] = self.createMediaSound('/sounds/' + name + '.mp3');
                    }

                    // Howl is avilable on the website
                    else {
                        sounds[name] = new Howl({
                            urls: ['/sounds/' + name + '.ogg', '/sounds/'+ name + '.mp3']
                        });
                    }
                });
            },
            
            
            streamUrl: function(url) {
                var sound;
                
                if(Media) {
                    if(_.isObject(url)) {
                        sound = self.createMediaSound(url.urls[0], null, null, function(status) {
                            console.log('media event', url, status);
                            if(status === Media.MEDIA_STOPPED) {
                                if(url.onend) {
                                    url.onend();
                                }
                                sound.release();
                            }
                        });
                    }
                    else {
                        sound = new Media(url);
                    }
                }
                
                else {
                    if(_.isObject(url)) {
                        sound = new Howl(url);
                    }
                    else {
                        sound = new Howl({
                            urls: [url]
                        });
                    }
                }
                
                var instance = sound.play();
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
                instance.volume(vol || 1);
                return instance;
            }

        };
        
        
        return self;
    });