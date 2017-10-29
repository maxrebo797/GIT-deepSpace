(function (window) {
    'use strict';

    function AuthSvc($http) {
        
        this.login = function (username, password, success, error) {
            $http.post('/api/login', { username: username, password: password }).then(success, error);
        };

        this.register = function (user, success, error) {
            $http.post('/api/register', user).then(success, error);
        };

        this.verify = function(username, success, error) {
            $http.post('/api/verify', { userName: username }).then(success, error);
        }

        this.logout = function (success, error) {
            $http.post('/api/logout').then(success, error);
        };

        this.me = function (success, error) {
            $http.get('/api/me').then(success, error);
        };

        return this;
    }

    window.app.service('AuthSvc', ['$http', AuthSvc]);
})(window);
