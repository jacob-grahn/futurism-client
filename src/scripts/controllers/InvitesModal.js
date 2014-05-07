angular.module('futurism')
    .controller('InvitesModalCtrl', function($scope, UserInvitationResource, lang, me) {
        'use strict';
        $scope.lang = lang;
        $scope.invites = UserInvitationResource.get({userId: me.userId});
    });