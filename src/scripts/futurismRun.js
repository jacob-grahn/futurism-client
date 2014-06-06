angular.module('futurism')
    .run(function(autoLogin, $rootScope, lang, unread, notificationListener, socketErrors, _, langUrl, sound, musicLooper) {
        'use strict';
        
        autoLogin.activate();
        //session.renew();
        langUrl.init();
        
        sound.init(function() {
            musicLooper.init();
            sound.setupSounds([
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
        });
        
        
        lang.loadData('data/phrases.json');
        $rootScope.lang = lang;
        
        _.delay(function() {
            unread.start();
        }, 4000);
        
        notificationListener.add('Welcome to Futurism!');
        socketErrors();
        
        FastClick.attach(document.body);
    });