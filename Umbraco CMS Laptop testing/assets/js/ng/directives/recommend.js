(function (window) {
    'use strict';

    function Recommend() {
        var directive = {
            scope: true,
            restrict: 'E',
            replace: true,
            template: '<button class="recommend" ng-click="do()" ng-disabled="$loading || $disabled"><span class="action">{{displayText}}</span> <span class="count">{{count | number}}</span></button>'
        };

        var text = {
            'recommend': 'Recommend',
            'error': '__error__'
        };

        var type = 'Recommendation';

        directive.link = function (scope, element, attrs) {
            scope.$element = element;

            scope.init(attrs.entityId, attrs.entityType);
        };

        directive.controller = ['$scope', 'FlagSvc', function ($scope, FlagSvc) {
            $scope.$loading = true;

            $scope.displayText = text.recommend;

            $scope.init = function (entityId, entityType) {
                $scope.entityId = entityId;
                $scope.entityType = entityType;

                FlagSvc.get(entityId, type, function (resp) {
                    $scope.count = resp.data;
                    $scope.$loading = false;
                }, function () {
                    $scope.displayText = text.error;
                    $scope.$disabled = true;
                    $scope.$loading = false;
                });
            };

            $scope.do = function () {
                $scope.$loading = true;
                FlagSvc.create({ id: $scope.entityId, type: type, entityType: $scope.entityType }, function (resp) {
                    $scope.count = resp.data;
                    $scope.$disabled = true;
                    $scope.$loading = false;
                }, function () {
                    $scope.displayText = text.error;
                    $scope.$disabled = true;
                    $scope.$loading = false;
                });
            };
        }];

        return directive;
    }

    window.app.directive('recommend', Recommend);
})(window);