angular.module('futurism')
    .factory('formTransformer', function(_) {

        return function(request) {
            var formData = new FormData();
            _.forOwn(request, function(value, key) {
                if(key.charAt(0) !== '$') {
                    formData.append(key, value);
                }
            });
            return(formData);
        };

    });