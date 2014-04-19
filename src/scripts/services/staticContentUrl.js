angular.module('futurism')
    .factory('staticContentUrl', function() {
        'use strict';

        var urlBase = location.href.substring(0, location.href.lastIndexOf('/')+1);
        var futurismStatic;
        var globeStatic;

        if(urlBase.indexOf('production') !== -1) {
            futurismStatic = '//futurism-production.s3-website-us-east-1.amazonaws.com';
            globeStatic = '//globe-production.s3-website-us-east-1.amazonaws.com';
        }
        else if(urlBase.indexOf('staging') !== -1) {
            futurismStatic = '//futurism-staging.s3-website-us-east-1.amazonaws.com';
            globeStatic = '//globe-staging.s3-website-us-east-1.amazonaws.com';
        }
        else {
            futurismStatic = '//futurism-development.s3-website-us-east-1.amazonaws.com';
            globeStatic = '//globe-development.s3-website-us-east-1.amazonaws.com';
        }

        return {
            globe: globeStatic,
            futurism: futurismStatic
        };
    });