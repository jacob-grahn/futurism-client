describe('updateDelayer', function() {
    'use strict';

    var $timeout, $rootScope, updateDelayer;

    beforeEach(function() {

        //load the module
        module('futurism');

        //inject
        inject(function(_$timeout_, _$rootScope_, _updateDelayer_) {
            $timeout = _$timeout_;
            $rootScope = _$rootScope_;
            updateDelayer = _updateDelayer_;
        });

    });

    afterEach(function() {
    });


    it('should dispatch pre:anim, do the update, then dispatch post:anim event', function() {
        var seq = [];

        $rootScope.$on('pre:test', function() {
            seq.push('first');
        });
        $rootScope.$on('post:test', function() {
            seq.push('third');
        });
        updateDelayer.add('test', {change: 123}, function() {
            seq.push('second');
        });

        expect(seq).toEqual(['first', 'second', 'third']);
    });


    it('should callback immediately if no animDelay event was fired', function() {
        var immediate = false;
        updateDelayer.add('test', {}, function() {
            immediate = true;
        });
        expect(immediate).toBe(true);
    });



    it('should return task in callback', function() {
        updateDelayer.add('test', {id: 3}, function(task) {
            expect(task.name).toEqual('test');
            expect(task.changes).toEqual({id: 3});
        });
    });


    it('should delay 10ms if animDelay is fired during pre:anim event', function() {
        $rootScope.$on('pre:test', function(scope, changes, delayer) {
            delayer.delay = 10;
        });

        var delayed = false;
        updateDelayer.add('test', {}, function() {
            expect(delayed).toBe(true);
        });

        delayed = true;
        $timeout.flush();
    });


    it('should delay 10ms if animDelay is fired during post:anim event', function() {
        $rootScope.$on('post:test', function(scope, changes, delayer) {
            delayer.delay = 10;
        });

        var delayed = false;
        updateDelayer.add('test', {}, function() {
            expect(delayed).toBe(false);

            updateDelayer.add('test2', {}, function() {
                expect(delayed).toBe(true);
            });
        });

        delayed = true;
        $timeout.flush();
    });


    it('should queue up multiple updates', function() {
        $rootScope.$on('pre:poo', function(scope, changes, delayer) {
            delayer.delay = 10;
        });

        var arr = [];

        updateDelayer.add('poo', {}, function() {
            arr.push('first');
        });
        updateDelayer.add('wiz', {}, function() {
            arr.push('second');
        });
        updateDelayer.add('wee', {}, function() {
            arr.push('third');
        });

        expect(arr).toEqual([]);

        $timeout.flush();
        expect(arr).toEqual(['first', 'second', 'third']);

        $timeout.verifyNoPendingTasks();

    });

});
