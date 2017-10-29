(function (window) {
    'use strict';

    function ConnectionSvc($http) {
        this.list = function (callback) {
            var ret = [];

            $http.get('/api/connections').success(function (data) {
                angular.forEach(data, function (e) {
                    ret.push(e);
                });

                callback && callback(ret);
            });

            return ret;
        };

        this.send = function (id, success, error) {
            return $http.post('/api/connections/send?member=' + id).then(success, error);
        };

        this.accept = function (id, success, error) {
            return $http.post('/api/connections/approve?id=' + id).then(success, error);
        };

        this.decline = function (id, success, error) {
            return $http.post('/api/connections/decline?id=' + id).then(success, error);
        };

        this.revoke = function (id, success, error) {
            return $http.post('/api/connections/revoke?id=' + id).then(success, error);
        };

        this.get = function (id, success, error) {
            $http.get('/api/connections/get?id=' + id).then(success, error);
        };

        return this;
    }

    window.app.service('ConnectionSvc', ['$http', ConnectionSvc]);
})(window);