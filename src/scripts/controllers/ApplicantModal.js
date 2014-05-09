angular.module('futurism')
    .controller('ApplicantModalCtrl', function($scope, ApplicantResource, lang, me, _) {
        'use strict';
        
        $scope.lang = lang;
        $scope.applicants = ApplicantResource.query({guildId: me.user.guild});
        
        
        $scope.accept = function(userId) {
            ApplicantResource.post({action: 'accept', guildId: me.user.guild, userId: userId});
            _.remove($scope.applicants, {_id: userId});
        };
        
        
        $scope.delete = function(userId) {
            ApplicantResource.delete({guildId: me.user.guild, userId: userId});
            _.remove($scope.applicants, {_id: userId});
        };
        
    
    });