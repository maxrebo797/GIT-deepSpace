(function (angular) {

    angular.module('app').controller('UserSearchCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.search = function () {
            $http.get('/api/search/users?query=' + $scope.query).then(function (resp) {
                $scope.results = resp.data;
            });
        };

    }]);

})(window.angular);
