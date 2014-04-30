angular.module('futurism')
    .factory('sound', function(window) {
        'use strict';

        var Sound = window.createjs.Sound;
        var playWhenLoaded = {};
        
        Sound.addEventListener("fileload", function(event) {
            var soundId = event.id;
            if(playWhenLoaded[soundId]) {
                Sound.play(soundId);
            }
        });
                                        
        Sound.alternateExtensions = ['mp3'];
        Sound.registerSound('sounds/abomination.ogg', 'abomination');
        Sound.registerSound('sounds/attack-launch.ogg', 'attack-launch');
        Sound.registerSound('sounds/attack-ready.ogg', 'attack-ready');
        Sound.registerSound('sounds/bagem.ogg', 'bagem');
        Sound.registerSound('sounds/battle-cry.ogg', 'battle-cry');
        Sound.registerSound('sounds/bees.ogg', 'bees');
        Sound.registerSound('sounds/delegate.ogg', 'delegate');
        Sound.registerSound('sounds/heal.ogg', 'heal');
        Sound.registerSound('sounds/hero.ogg', 'hero');
        Sound.registerSound('sounds/hit.ogg', 'hit');
        Sound.registerSound('sounds/loose.ogg', 'loose');
        Sound.registerSound('sounds/mate.ogg', 'mate');
        Sound.registerSound('sounds/move.ogg', 'move');
        Sound.registerSound('sounds/network.ogg', 'network');
        Sound.registerSound('sounds/notif.ogg', 'notif');
        Sound.registerSound('sounds/peace.ogg', 'peace');
        Sound.registerSound('sounds/poison.ogg', 'poison');
        Sound.registerSound('sounds/rebuild.ogg', 'rebuild');
        Sound.registerSound('sounds/recharge.ogg', 'recharge');
        Sound.registerSound('sounds/seduce.ogg', 'seduce');
        Sound.registerSound('sounds/serum.ogg', 'serum');
        Sound.registerSound('sounds/shield.ogg', 'shield');
        Sound.registerSound('sounds/summon.ogg', 'summon');
        Sound.registerSound('sounds/teleport.ogg', 'teleport');
        Sound.registerSound('sounds/transform.ogg', 'transform');
        Sound.registerSound('sounds/trees.ogg', 'trees');
        Sound.registerSound('sounds/turn.ogg', 'turn');
        Sound.registerSound('sounds/win.ogg', 'win');
        Sound.registerSound('sounds/die.ogg', 'die');
        Sound.registerSound('sounds/future.ogg', 'future');
        
        

        return {

            play: function(soundId, volume) {
                var instance = Sound.play(soundId);
                instance.volume = volume || 1;
                if(instance.playState === 'playFailed') {
                    playWhenLoaded[soundId] = true;
                }
                return instance;
            }

        };
    });