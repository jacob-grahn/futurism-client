angular.module('futurism')
    .factory('sound', function(window, _, memory) {
        'use strict';
        
        var Media = window.Media;
        var soundManager = window.soundManager;
        var sounds = {};
        

        var self = {
            
            
            init: function(callback) {
                if(Media) {
                    _.delay(function() {
                        self.applyMute();
                        callback();
                    });
                }
                else {
                    soundManager.setup({
                        url: 'https://cdn.jsdelivr.net/soundmanager2/2.97a.20131201/cors',
                        flashVersion: 9,
                        preferFlash: false,
                        onready: function() {
                            self.applyMute();
                            callback();
                        }
                    });
                }
            },
            
            
            isMuted: function() {
                return memory.long.get('muted') === 'true';
            },
            
            
            toggleMute: function() {
                memory.long.set('muted', !self.isMuted());
                self.applyMute();
            },
            
            
            applyMute: function() {
                if(self.isMuted()) {
                    if(Media) {
                        
                    }
                    else {
                        soundManager.mute();
                    }
                }
                else {
                    if(Media) {
                        
                    }
                    else {
                        soundManager.unmute();
                    }
                }
            },
            
            
            createMediaSound: function(url, mediaSuccess, mediaError, mediaStatus) {
                var sound;

                sound = new Media(url, mediaSuccess, mediaError, mediaStatus);
                
                sound._curVolume = 1;
                
                sound._setVolume = sound.setVolume;
                sound.setVolume = function(vol) {
                    sound._curVolume = vol;
                    sound._setVolume(vol);
                };
                
                sound.getVolume = function() {
                    return sound._curVolume;
                };
                
                sound._getCurrentPosition = sound.getCurrentPosition;
                sound.getCurrentPosition = function(callback) {
                    sound._getCurrentPosition(function(pos) {
                        return callback(pos * 1000);
                    });
                };
                
                sound.setPosition = function(pos) {
                    sound.seekTo(pos);
                };
                
                sound._stop = sound.stop;
                sound.stop = function() {
                    sound._manuallyStopped = true;
                    sound._stop();
                };
                
                sound._play = sound.play;
                sound.play = function() {
                    sound._manuallyStopped = false;
                    sound._play();
                    return sound;
                };
                
                return sound;
            },
            
            
            createWebSound: function(input) {                
                var sound = soundManager.createSound(input);
                
                sound.getVolume = function() {
                    return sound.volume / 100;
                };
                
                sound._setVolume = sound.setVolume;
                sound.setVolume = function(vol) {
                    sound._setVolume(vol * 100);
                };
                
                sound.getCurrentPosition = function(callback) {
                    return callback(sound.position);
                };
                
                return sound;
            },
            
            
            setupSounds: function(names) {
                
                _.each(names, function(name) {

                    if(sounds[name]) {
                        return 'sound aleady exists';
                    }

                    // Media is avialble in android app
                    if(Media) {
                        sounds[name] = self.createMediaSound('/sounds/' + name + '.ogg');
                    }

                    // soundManager is avilable on the web
                    else {
                        sounds[name] = self.createWebSound({id: name, url: '/sounds/' + name + '.ogg'});
                    }
                });
            },
            
            
            
            streamUrl: function(url, loop, onFinish) {
                var sound;
                
                if(Media) {
                    sound = self.createMediaSound(url, null, null, function(status) {
                        if(status === Media.MEDIA_STOPPED) {
                            if(onFinish && !sound._manuallyStopped) {
                                onFinish();
                            }
                            if(loop && !sound._manuallyStopped) {
                                sound.play();
                            }
                            if(!loop) {
                                sound.release();
                            }
                        }
                    });
                }
                
                else {
                    sound = self.createWebSound({
                        url: url,
                        autoPlay: true,
                        autoLoad: true,
                        multiShot: false,
                        stream: true,
                        loops: loop ? 99 : 0,
                        onfinish: onFinish
                    });
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
                instance.setVolume(vol || 1);
                return instance;
            }

        };
        
        
        return self;
    });