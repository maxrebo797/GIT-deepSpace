(function (window) {
    'use strict';

    function SubscriptionSvc($http) {
        this.list = function (success, error) {
            $http.get('/api/subscriptions').then(success, error);
        };

        this.modify = function (type, frequency, deliveryMethod, isActive, success, error) {
            $http.post('/api/subscriptions/modify', { type: type, frequency: frequency, deliveryMethod: deliveryMethod, isActive: isActive }).then(success, error);
        };

        return this;
    }

    window.app.service('SubscriptionSvc', ['$http', SubscriptionSvc]);
})(window);