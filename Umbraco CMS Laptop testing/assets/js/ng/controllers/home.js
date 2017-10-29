(function(window){
    'use strict';

    function HomeInfoResourcesCtrl($scope, HomeSvc) {
        var activeIndex = null;

        $scope.data = [];

        $scope.init = function () {
            HomeSvc.informationModule(function(resp) {

                $scope.data = resp.data;
                $scope.activeIndex = 0;

                $scope.isActive = function (index) {
                    return !!($scope.activeIndex === index);
                };

                $scope.getActiveClass = function (index) {
                    return $scope.isActive(index) ? 'active' : '';
                };

                $scope.toggleActive = function (index) {
                    $scope.activeIndex = index;
                };

                $scope.$watch("activeIndex", function(val) {
                    $scope.activeHead = $scope.data[$scope.activeIndex];
                });

            },
            function () {
                alert('something went wrong');
            });
        };
        
    }

    window.app.controller('HomeInfoResourcesCtrl', ['$scope', 'HomeSvc', HomeInfoResourcesCtrl]);



})(window);
