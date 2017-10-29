(function (window) {
    'use strict';

    // TODO: merge this with `connection-actions.js`

    // Note: `show-only-connect` hides the button if there's any other action but "Connect" available
    // at present only used on group member list page

    function UserConnection() {
        var directive = {
            scope: true,
            restrict: 'E',
            replace: true,
            template: '<button class="connect" ng-click="do()" ng-disabled="$loading || $disabled" ng-hide="$hidden">{{displayText}}</button>'
        };

        var actions = {
            'connect': 'connect',
            'approve': 'approve',
        };

        var text = {
            'connected': 'Connected',
            'pending': 'Pending',
            'approve': 'Approve',
            'connect': 'Connect',
            'error': '__error__'
        };

        directive.link = function (scope, element, attrs) {
            scope.$element = element;

            scope.init(attrs.userId, attrs.showOnlyConnect || false);
        };

        directive.controller = ['$scope', 'ConnectionSvc', function ($scope, ConnectionSvc) {
            $scope.$hidden = true;
            $scope.$loading = true;

            $scope.init = function (userId, showOnlyConnect) {
                $scope.userId = userId;

                ConnectionSvc.get(userId, function (resp) {
                    var data = resp.data;
                    if (data) {
                        if (data.isSelf) {
                            return;
                        }
                        switch (data.status) {
                            case 'Active':
                                $scope.displayText = text.connected;
                                $scope.$disabled = true;
                                $scope.$hidden = showOnlyConnect;
                                break;
                            case 'Pending':
                                if (data.isInstigator) {
                                    $scope.displayText = text.pending;
                                    $scope.$disabled = true;
                                }
                                else {
                                    $scope.displayText = text.approve;
                                    $scope.action = actions.approve;
                                    $scope.id = data.id;
                                }
                                $scope.$hidden = showOnlyConnect;
                                break;
                        }
                    }
                    else {
                        $scope.displayText = text.connect;
                        $scope.action = actions.connect;
                        $scope.$hidden = false;
                    }

                    $scope.$loading = false;
                }, function () {
                    $scope.displayText = text.error;
                    $scope.$disabled = true;
                    $scope.$loading = false;
                    $scope.$hidden = false;
                });
            };

            $scope.do = function () {
                var fn, id;
                switch ($scope.action) {
                    case actions.connect:
                        fn = ConnectionSvc.send;
                        id = $scope.userId;
                        break;
                    case actions.approve:
                        fn = ConnectionSvc.approve;
                        id = $scope.id;
                        break;
                }

                fn(id, function () {
                    $scope.displayText = $scope.action === actions.connect ? text.pending : text.connected;
                    $scope.$disabled = true;
                }, function () {
                    $scope.displayText = text.error;
                    $scope.$disabled = true;
                });
            };
        }];

        return directive;
    }

    window.app.directive('userConnection', UserConnection);
})(window);