angular.module('futurism')
    .factory('websites', function($) {
        'use strict';


        var checkJiggLogin = function(callback) {
            $.ajax('//jiggmin.com/-who-am-i.php', {
                type: 'GET',
                dataType: 'jsonp',
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function(data) {
                if(data.logged_in) {
                    data.site = 'j';
                    return callback(null, data);
                }
                else {
                    return callback('not logged into jiggmin.com');
                }
            })
            .error(callback);
        };


        var lookup = {
            a: {
                name: 'armor games',
                loginFn: null,
                icon: '/images/sites/a.png'
            },
            f: {
                name: 'facebook',
                loginFn: null,
                icon: '/images/sites/f.png'
            },
            n: {
                name: 'newgrounds',
                loginFn: null,
                icon: '/images/sites/n.png'
            },
            j: {
                name: 'jiggmin',
                loginFn: checkJiggLogin,
                icon: '/images/sites/j.png'
            },
            g: {
                name: 'guestville',
                icon: '/images/sites/g.png'
            }
        };


        return {
            checkJiggLogin: checkJiggLogin,
            lookup: lookup
        };

    });