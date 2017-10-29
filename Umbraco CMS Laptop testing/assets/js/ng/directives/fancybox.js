(function (window) {
    'use strict';

    function FancyBox($compile, $http, FancyBoxSvc) {
        var directive = {
            restrict: 'A'
        };

        directive.controller = ['$scope', function ($scope) {

            $scope.openFancybox = function (url, width, height, data, urlName) {
                FancyBoxSvc.doFancyBox($scope, url, width, height, data, urlName);
            };

        }];

        return directive;
    }

    window.app.directive('fancybox', ['$compile', '$http', 'FancyBoxSvc', FancyBox]);
})(window);