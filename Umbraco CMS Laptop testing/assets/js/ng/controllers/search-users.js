(function (window) {
    'use strict';

    function SearchUsersCtrl($scope, UserSvc) {
        $scope.$loading = false;

        $scope.search = function () {
            $scope.$loading = true;

            UserSvc.search($scope.query, function (data) {
                $scope.$loading = false;

                $scope.results = data.results;
            });
        };

        $scope.reset = function () {
            $scope.results = null;
        };
    }

    window.app.controller('SearchUsersCtrl', ['$scope', 'UserSvc', SearchUsersCtrl]);
})(window);