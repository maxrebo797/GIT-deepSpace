(function (window) {
    'use strict';

    function CaldSvc($http) {
        
        this.pages = function (success, error) {
            $http.get('/api/cald').then(success, error);
        };

        return this;
    }

    window.app.service('CaldSvc', ['$http', CaldSvc]);
})(window);