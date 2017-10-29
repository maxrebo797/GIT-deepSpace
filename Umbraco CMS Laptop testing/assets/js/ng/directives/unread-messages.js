(function (window) {
    'use strict';

    function UnreadMessages() {

        var directive = {
            scope: true,
            restrict: 'E',
            replace: true,
            template: ['<span class="count" ng-show="display">{{display | number}}</span>'].join('')
        };

        directive.link = function (scope, element, attrs) {
            if (attrs.current) {
                scope.display = attrs.current;
            }
            else {
                scope.refresh();
            }
        };

        directive.controller = ['$scope', '$timeout', 'MessagingSvc', function ($scope, $timeout, MessagingSvc) {
            $scope.refresh = function () {
                $timeout(function () {
                    MessagingSvc.getUnreadCount(function (resp) {
                        $scope.display = resp.data;
                    });
                }, 1000);
            };

            $scope.$on('inbox:updated', $scope.refresh);
        }];

        return directive;
    }

    window.app.directive('unreadMessages', UnreadMessages);
})(window);



