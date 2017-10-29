(function (window) {
    'use strict';

    // TODO: merge this with `user-connection.js`

    function ConnectionActions() {
        var directive = {
            scope: true,
            restrict: 'E',
            replace: true,
            template: '<button ng-repeat="btn in buttons" class="{{btn.class}}" ng-click="$parent.do(btn.action)" ng-hide="$hidden" ng-disabled="$disabled || $loading || !btn.action">{{btn.displayText}}</button>'
        };

        var text = {
            'disconnect': 'Disconnect',
            'approve': 'Approve',
            'deny': 'Not now',
            'connect': 'Connect',
            'pending': 'Pending',
            'error': '__error__'
        };

        var classes = {
            'disconnect': 'disconnect',
            'approve' : 'approve',
            'deny': 'deny',
            'connect': 'connect',
            'pending': 'connect'
        };

        var buttons = {
            'disconnect': {
                class: classes.disconnect,
                displayText: text.disconnect,
                action: classes.disconnect
            },
            'approve': {
                class: classes.approve,
                displayText: text.approve,
                action: classes.approve
            },
            'deny': {
                class: classes.deny,
                displayText: text.deny,
                action: classes.deny
            },
            'connect': {
                class: classes.connect,
                displayText: text.connect,
                action: classes.connect
            },
            'pending': {
                class: classes.pending,
                displayText: text.pending
            }
        };

        directive.link = function (scope, element, attrs) {
            scope.$element = element;

            scope.init(attrs.userId);
        };


        directive.controller = ['$scope', 'ConnectionSvc', function ($scope, ConnectionSvc) {
            $scope.$loading = true;

            $scope.displayText = text.disconnect;

            $scope.init = function (userId) {
                $scope.userId = userId;

                $scope.buttons = [];

                ConnectionSvc.get(userId, function (resp) {
                    var data = resp.data;
                    if (data) {
                        if (data.isSelf) {
                            $scope.buttons = [];
                        }
                        else {
                            $scope.id = data.id;
                            if (data.status === 'Active') {
                                $scope.buttons = [buttons.disconnect];
                            }
                            else if (data.status === 'Pending') {
                                if (!data.isInstigator) {
                                    $scope.buttons = [buttons.approve, buttons.deny];
                                }
                                else {
                                    $scope.buttons = [buttons.pending];
                                }
                            }
                        }
                    }
                    else {
                        $scope.id = userId;
                        $scope.buttons = [buttons.connect];
                    }
                    //console.log(resp.data);
                    $scope.$loading = false;
                }, function () {
                    $scope.displayText = text.error;
                    $scope.$disabled = true;
                    $scope.$loading = false;
                });
            };

            $scope.do = function (action) {
                // console.log(action);
                var fn = null;
                switch(action) {
                    case classes.approve:
                        fn = ConnectionSvc.accept;
                        break;
                    case classes.deny:
                        fn = ConnectionSvc.decline;
                        break;
                    case classes.disconnect:
                        fn = ConnectionSvc.revoke;
                        break;
                    case classes.connect:
                        fn = ConnectionSvc.send;
                        break;
                }

                fn($scope.id, function () {
                    if (action === classes.approve) {
                        $scope.buttons = [buttons.disconnect];
                    }
                    else if (action === classes.connect) {
                        $scope.buttons = [buttons.pending];
                    }
                    else {
                        $scope.buttons = [];
                        window.location.reload();
                    }
                }, function () {
                    alert('something went wrong');
                });
            };
        }];

        return directive;
    }

    window.app.directive('connectionActions', ConnectionActions);
})(window);