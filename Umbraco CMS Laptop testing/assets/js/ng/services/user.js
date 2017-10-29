(function (window) {
    'use strict';

    function UserSvc(Model, $http) {
        var model = Model.config({
            updateUrl: '/api/account',
            getUrl: '/api/account'
        });

        this.get = function (callback) {
            return model.get(null, callback);
        };

        this.search = function (query, callback) {
            return model.queryObj('/api/search/users?query=:query', { query: query }, callback);
        };

        this.requestRemoval = function (reason, success, error) {
            $http.post('/api/user/request-removal', { reason: reason }).then(success, error);
        };

        return this;
    }

    window.app.service('UserSvc', ['Model', '$http', UserSvc]);
})(window);