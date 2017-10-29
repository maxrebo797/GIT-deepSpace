(function (window) {
    'use strict';

    function PermissionSvc($http) {
        this.list = function (entity, success, error) {
            $http.get('/api/security/list?entity=' + entity).then(success, error);
        };

        this.update = function (entity, settings, success, error) {
            $http.post('/api/security/update', settings, { params: { entity: entity }}).then(success, error);
        };

        return this;
    }

    window.app.service('PermissionSvc', ['$http', PermissionSvc]);
})(window);