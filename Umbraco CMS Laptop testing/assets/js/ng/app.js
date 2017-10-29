(function (window, moment) {
    'use strict';

    window.mergeDateTime = function (date, time) {
        var d = moment(date).toDate(),
            t = moment(time).toDate();

        var ret = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());

        return ret;
    };

    window.app = angular.module('app', ['ngMessages', 'ngTouch', 'model', 'ngTypeahead', 'ngSanitize', 'ngAnimate', 'ui.select', 'ngCookies', 'ui.bootstrap'])

        .config(['$httpProvider',
            function ($httpProvider) {
                $httpProvider.defaults.withCredentials = true;
            }
        ])

        .run([function () { }]);
})(window, window.moment);
