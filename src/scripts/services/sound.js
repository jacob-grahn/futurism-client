angular.module('futurism')
    .factory('sound', function(window, _) {
        'use strict';
        
        var Howl = window.Howl;
        var sounds = {};
        
        var setupSounds = function(names) {
            _.each(names, function(name) {
                sounds[name] = new Howl({
                    urls: ['sounds/' + name + '.ogg', 'sounds/'+ name + '.mp3']
                });
            });
        };
        
        setupSounds([
            'abomination',
            'attack-launch',
            'attack-ready',
            'bagem',
            'battle-cry',
            'bees',
            'delegate',
            'heal',
            'hero',
            'hit',
            'loose',
            'mate',
            'move',
            'network',
            'notif',
            'peace',
            'poison',
            'rebuild',
            'recharge',
            'seduce',
            'serum',
            'shield',
            'summon',
            'teleport',
            'transform',
            'trees',
            'turn',
            'win',
            'die',
            'future'
        ]);
        
        

        return {

            play: function(soundId, volume) {
                var instance = sounds[soundId].play();
                instance.volume(volume || 1);
                return instance;
            }

        };
    });