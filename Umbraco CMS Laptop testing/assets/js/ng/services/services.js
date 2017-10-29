(function (window) {
    'use strict';

    function ServiceSvc($http) {

        this.list = function (success, error) {
            $http.get('/api/services').then(success, error);
        };

        this.create = function (model, success, error) {
            $http.post('/api/services/create', model).then(success, error);
        };

        this.get = function (key, success, error) {
            $http.get('/api/services/get?key=' + key).then(success, error);
        };

        this.save = function (model, success, error) {
            $http.post('/api/services/update?key=' + model.key, model).then(success, error);
        };

        return this;
    }

    window.app.service('ServiceSvc', ['$http', ServiceSvc]);
})(window);