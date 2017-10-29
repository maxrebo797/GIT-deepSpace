(function (window) {
    'use strict';

    function NotificationSvc($http) {
        this.list = function (includeRead, success, error) {
            $http.get('/api/notifications?includeRead=' + includeRead).then(success, error);
        };

        return this;
    }

    window.app.service('NotificationSvc', ['$http', NotificationSvc]);
})(window);