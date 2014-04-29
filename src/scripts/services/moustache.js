angular.module('futurism')
    .factory('moustache', function($filter, _) {
        'use strict';
        
        
        return {
            
            
            /**
             * Replace mustaches {{}} with their value
             * @param txt
             * @param data
             */
            processTxt: function(txt, data) {
                _.each(data, function(value, key) {
                    if(key === 'time') {
                        value = $filter('date')(value, 'shortTime');
                    }
                    txt = txt.replace('{{'+key+'}}', value);
                });
                return txt;
            }
        };
    });