(function (window) {
    'use strict';

    function ProfileSvc(Model, $http) {
        var model = Model.config({
            updateUrl: '/api/profile',
            getUrl: '/api/profile'
        });

        this.get = function (callback) {
            return model.get(null, callback);
        };

        return this;
    }

    window.app.service('ProfileSvc', ['Model', ProfileSvc]);
})(window);