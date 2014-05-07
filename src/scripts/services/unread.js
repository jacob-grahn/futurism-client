angular.module('futurism')
    .factory('unread', function($timeout, UnreadResource, InvitationResource, UserInvitationResource, session, me) {
        'use strict';


        /**
         * Private
         */
        var freq = 1000 * 20; // one minute
        var promise;

        var doneWaiting = function() {
            promise = $timeout(doneWaiting, freq);
            unread.refresh();
        };


        /**
         * Public
         */
        var unread = {

            count: 0,
            invitationCount: 0,

            start: function() {
                unread.stop();
                doneWaiting();
            },

            stop: function() {
                $timeout.cancel(promise);
            },

            refresh: function() {
                if(session.getToken()) {
                    var newCount = UnreadResource.get({}, function() {
                        unread.count = Number(newCount[0]);
                    });
                    var invitations = UserInvitationResource.get({userId: me.userId}, function() {
                        console.log(invitations, invitations.length);
                        unread.invitationCount = invitations.length;
                    });
                }
            }
        };

        return unread;
    });