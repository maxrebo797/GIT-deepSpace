(function (window) {
    'use strict';

    function FlagSvc($http) {

        this.get = function (id, type, success, error) {
            $http.get('/api/flags/get?id=' + id + '&type=' + type).then(success, error);
        };

        this.create = function (model, success, error) {
            $http.post('/api/flags/create', model).then(success, error);
        };

        return this;
    }

    window.app.service('FlagSvc', ['$http', FlagSvc]);
})(window);