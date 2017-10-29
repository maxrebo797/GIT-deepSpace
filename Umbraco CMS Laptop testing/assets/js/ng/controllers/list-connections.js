(function (window) {
    'use strict';

    function ListConnectionsCtrl($scope, ConnectionSvc) {
        $scope.refresh = function () {
            $scope.list = ConnectionSvc.list();
        };

        $scope.$on('realtime:message', function (/*event, args*/) {
            $scope.refresh();
        });

        $scope.refresh();
    }

    window.app.controller('ListConnectionsCtrl', ['$scope', 'ConnectionSvc', ListConnectionsCtrl]);
})(window);