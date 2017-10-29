(function (window) {
    'use strict';

    function GroupEventSvc($http) {

        this.list = function (success, error) {
            $http.get('/api/group-events').then(success, error);
        };

        this.create = function (model, success, error) {
            $http.post('/api/group-events/create', model).then(success, error);
        };

        this.get = function (groupKey, eventKey, success, error) {
            $http.get('/api/group-events/get?groupKey=' + groupKey + '&eventKey=' + eventKey).then(success, error);
        };

        this.save = function (model, success, error) {
            $http.post('/api/group-events/update', model).then(success, error);
        };

        return this;
    }

    window.app.service('GroupEventSvc', ['$http', GroupEventSvc]);
})(window);