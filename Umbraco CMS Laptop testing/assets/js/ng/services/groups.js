(function (window) {
    'use strict';

    function GroupSvc($http) {

        this.list = function (success, error) {
            $http.get('/api/groups').then(success, error);
        };

        this.create = function (model, success, error) {
            $http.post('/api/groups/create', model).then(success, error);
        };

        this.get = function (key, success, error) {
            $http.get('/api/groups/get?key=' + key).then(success, error);
        };

        this.save = function (model, success, error) {
            $http.post('/api/groups/update', model).then(success, error);
        };

        this.join = function (key, reason, success, error) {
            $http.post('/api/groups/join', { reason: reason }, { params: { key: key } }).then(success, error);
        };

        this.leave = function (key, success, error) {
            $http.post('/api/groups/leave', null, { params: { key: key } }).then(success, error);
        };

        this.approve = function (key, user, success, error) {
            $http.post('/api/groups/approve', null, { params: { key: key, user: user } }).then(success, error);
        };

        this.deny = function (key, user, success, error) {
            $http.post('/api/groups/deny', null, { params: { key: key, user: user } }).then(success, error);
        };

        this.invite = function (key, user, success, error) {
            $http.post('/api/groups/invite', null, { params: { key: key, user: user } }).then(success, error);
        };

        this.accept = function (key, success, error) {
            $http.post('/api/groups/accept', null, { params: { key: key } }).then(success, error);
        };

        this.decline = function (key, success, error) {
            $http.post('/api/groups/decline', null, { params: { key: key } }).then(success, error);
        };

        this.makeAdmin = function (key, user, success, error) {
            $http.post('/api/groups/makeAdmin', null, { params: { key: key, user: user } }).then(success, error);
        };

        this.removeAdmin = function (key, user, success, error) {
            $http.post('/api/groups/removeAdmin', null, { params: { key: key, user: user } }).then(success, error);
        };

        this.remove = function (key, user, success, error) {
            $http.post('/api/groups/removeMember', null, { params: { key: key, user: user } }).then(success, error);
        };

        this.getMembers = function (key, query, page, pageSize, success, error) {
            $http.get('/api/groups/members', { params: { key: key, query: query, page: page, pageSize: pageSize } }).then(success, error);
        };

        return this;
    }

    window.app.service('GroupSvc', ['$http', GroupSvc]);
})(window);
