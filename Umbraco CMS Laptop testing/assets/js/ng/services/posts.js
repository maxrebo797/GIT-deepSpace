(function (window) {
    'use strict';

    function PostSvc($http) {

        this.get = function (id, success, error) {
            $http.get('/api/posts/get?id=' + id).then(success, error);
        };

        this.create = function (model, success, error) {
            $http.post('/api/posts/create', model).then(success, error);
        };

        this.update = function (id, model, success, error) {
            $http.post('/api/posts/update?id=' + id, model).then(success, error);
        }

        return this;
    }

    window.app.service('PostSvc', ['$http', PostSvc]);
})(window);