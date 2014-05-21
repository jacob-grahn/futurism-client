angular.module('futurism')
    .factory('unread', function($timeout, NotificationResource, session) {
        'use strict';


        var freq = 1000 * 60; // one minute
        var promise;

        var doneWaiting = function() {
            promise = $timeout(doneWaiting, freq);
            self.refresh();
        };



        var self = {

            unreadCount: 0,
            inviteCount: 0,
            applicantCount: 0,

            start: function() {
                self.stop();
                doneWaiting();
            },

            stop: function() {
                $timeout.cancel(promise);
            },

            refresh: function() {
                if(session.data) {
                    var data = NotificationResource.get({}, function() {
                        self.unreadCount = data.unreadCount;
                        self.inviteCount = data.inviteCount;
                        self.applicantCount = data.applicantCount;
                    });
                }
            },
            
            totalCount: function() {
                return self.unreadCount + self.inviteCount + self.applicantCount;
            }
        };

        return self;
    });