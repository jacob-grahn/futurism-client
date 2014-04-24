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
        /*$rootScope.$$listeners['pre:test'] = [];
        $rootScope.$$listeners['post:test'] = [];
        $rootScope.$$listeners['animDelay'] = [];*/
    });


    it('should dispatch pre:anim, do the update, then dispatch post:anim event', function(done) {
        var seq = [];

        var dereg1 = $rootScope.$on('pre:test', function() {
            seq.push('first');
        });
        var dereg2 = $rootScope.$on('post:test', function() {
            seq.push('third');
            dereg1();
            dereg2();
            done();
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



    it('should return task in callback', function(done) {
        updateDelayer.add('test', {id: 3}, function(task) {
            expect(task.name).toEqual('test');
            expect(task.changes).toEqual({id: 3});
            done();
        });
    });


    it('should delay 10ms if animDelay is fired during pre:anim event', function(done) {
        var dereg1 = $rootScope.$on('pre:test', function() {
            $rootScope.$broadcast('animDelay', 10);
        });

        var delayed = false;
        updateDelayer.add('test', {}, function() {
            expect(delayed).toBe(true);
            dereg1();
            done();
        });

        delayed = true;
        $timeout.flush();
    });


    it('should delay 10ms if animDelay is fired during post:anim event', function(done) {
        var dereg1 = $rootScope.$on('post:test', function() {
            $rootScope.$broadcast('animDelay', 10);
        });

        var delayed = false;
        updateDelayer.add('test', {}, function() {
            expect(delayed).toBe(false);

            updateDelayer.add('test2', {}, function() {
                expect(delayed).toBe(true);
                dereg1();
                done();
            });
        });

        delayed = true;
        $timeout.flush();
    });


    /*it('should queue up multiple updates', function() {
        var dereg1 = $rootScope.$on('pre:poo', function() {
            $rootScope.$broadcast('animDelay', 10);
        });

        var arr = [];

        updateDelayer.add('poo', {}, function() {
            arr.push('first');
        });
        updateDelayer.add('poo', {}, function() {
            arr.push('second');
        });

        expect(arr).toEqual([]);

        $timeout.flush();
        expect(arr).toEqual(['first']);

        $timeout.flush();
        expect(arr).toEqual(['first', 'second']);

        $timeout.verifyNoPendingTasks();
        dereg1();
    });*/

});
