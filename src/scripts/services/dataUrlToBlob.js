angular.module('futurism')
    .factory('dataUrlToBlob', function() {
        'use strict';

        return function(dataURL) {
            var BASE64_MARKER = ';base64,';
            var parts, contentType, raw;

            if (dataURL.indexOf(BASE64_MARKER) === -1) {
                parts = dataURL.split(',');
                contentType = parts[0].split(':')[1];
                raw = parts[1];

                return new Blob([raw], {type: contentType});
            }

            parts = dataURL.split(BASE64_MARKER);
            contentType = parts[0].split(':')[1];
            raw = window.atob(parts[1]);
            var rawLength = raw.length;

            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], {type: contentType});
        };

    });