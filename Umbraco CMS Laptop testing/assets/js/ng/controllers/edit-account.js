(function (window) {
    'use strict';

    function EditAccountCtrl($scope, UserSvc) {
        $scope.$loading = true;
        $scope.materialFormats = [null, 'HardCopy', 'SoftCopy'];
        $scope.submitted = false;

        $scope.model = UserSvc.get(function () {
            $scope.model.id = -1;
            $scope.$loading = false;
        });

        $scope.save = function () {
            if ($scope.form.$valid) {
                $scope.$loading = true;
                $scope.error = null;
                $scope.message = null;
                $scope.model.save(function () {
                    $scope.$loading = false;
                    $scope.message = 'Your preferences have been updated.';
                }, function (response) {
                    $scope.$loading = false;
                    $scope.error = response.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.requestRemoval = function () {
            $scope.$loading = true;
            UserSvc.requestRemoval($scope.removalRequestReason, function () {
                alert('ACKNOWLEDGED.');
                $scope.$loading = false;
            },
            function () {
                alert('something went wrong');
            });
        };
    }

    window.app.controller('EditAccountCtrl', ['$scope', 'UserSvc', EditAccountCtrl]);
})(window);
