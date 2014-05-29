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
                console.log('toggleMute', memory.long.get('muted'));
                memory.long.set('muted', !self.isMuted());
                console.log('toggleMute', memory.long.get('muted'));
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
                
                /*sound.pos = function(val) {
                    if(val) {
                        sound.seekTo(val);
                        return val;
                    }
                    else {
                        //should be async...
                        sound.getCurrentPosition();
                        return sound.position;
                    }
                };*/
                
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
                
                sound.getPosition = function() {
                    return sound.position;
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
                        sounds[name] = self.createMediaSound('/sounds/' + name + '.mp3');
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
                            if(onFinish) {
                                onFinish();
                            }
                            if(loop) {
                                sound.play();
                            }
                            else {
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