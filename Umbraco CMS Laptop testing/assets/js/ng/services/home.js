(function (window) {
    'use strict';

    function HomeSvc($http) {

        this.informationModule = function (success, error) {
            $http.get('/api/home/informationModule').then(success, error);
        };

        return this;
    }

    window.app.service('HomeSvc', ['$http', HomeSvc]);
})(window);