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

                sound._stop = sound.stop;
                sound.stop = function() {
                    sound._manuallyStopped = true;
                    return sound._stop();
                };

                sound._play = sound.play;
                sound.play = function() {
                    sound._play();
                    sound._manuallyStopped = false;
                    return sound;
                };
                
                sound.pos = function(val) {
                    if(val) {
                        sound.seekTo(val);
                        return val;
                    }
                    else {
                        //should be async...
                        sound.getCurrentPosition();
                        return sound.position;
                    }
                };
                
                return sound;
            },
            
            
            createWebSound: function(input) {
                var sound;
                if(_.isArray(input)) {
                    sound = new Howl({urls: input});
                }
                if(_.isObject(input)) {
                    sound = new Howl(input);
                }
                if(_.isString(input)) {
                    sound = new Howl({urls: [input]});
                }
                
                sound.getPos = function() {
                    return sound.pos() * 1000;
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
                        sounds[name] = self.createWebSound(['/sounds/' + name + '.ogg', '/sounds/'+ name + '.mp3']);
                    }
                });
            },
            
            
            streamUrl: function(url) {
                var sound;
                
                if(Media) {
                    if(_.isObject(url)) {
                        sound = self.createMediaSound(url.urls[0], null, null, function(status) {
                            if(status === Media.MEDIA_STOPPED) {
                                if(url.onend && !sound._manuallyStopped) {
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
                    sound = self.createWebSound(url);
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