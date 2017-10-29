(function (window) {
    'use strict';

    function SubscriptionCtrl($scope, SubscriptionSvc) {
        $scope.frequencies = ['Instantly', 'Daily', 'Weekly'];
        $scope.deliveryMethods = ['Email', 'Message'];

        $scope.refresh = function () {
            SubscriptionSvc.list(function (resp) {
                $scope.list = resp.data;
            },
            function () {
                alert('something went wrong.');
            });
        };

        $scope.update = function (sub) {
            sub.$loading = true;
            SubscriptionSvc.modify(sub.type, sub.frequency, sub.deliveryMethod, sub.isActive, function () {
                sub.$loading = false;
            }, function () {
                sub.$loading = false;
            });
        };

        $scope.refresh();
    }

    window.app.controller('SubscriptionCtrl', ['$scope', 'SubscriptionSvc', SubscriptionCtrl]);

    function EditSubscriptionsCtrl($scope, SubscriptionSvc) {

        SubscriptionSvc.list(function (resp) {
            angular.forEach(resp.data, function (sub) {
                if (sub.type == 'WeeklyDigest') {
                    $scope.weeklyDigest = sub.isActive;
                }
            });
        },
        function () {
            alert('something went wrong');
        });

        $scope.save = function () {
            $scope.$loading = true;
            SubscriptionSvc.modify('WeeklyDigest', 'Instantly', 'Message', $scope.weeklyDigest, function () {
                $scope.$loading = false;
            },
            function () {
                alert('something went wrong');
                $scope.$loading = false;
            });
        };
    }

    window.app.controller('EditSubscriptionsCtrl', ['$scope', 'SubscriptionSvc', EditSubscriptionsCtrl]);
})(window);