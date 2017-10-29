(function (window) {
    'use strict';

    function AppCtrl($rootScope, $modal, $q, ConnectionSvc, ReferenceSvc, GroupSvc, TypeaheadSvc) {
        $rootScope.ConnectionSvc = ConnectionSvc;
        $rootScope.ReferenceSvc = ReferenceSvc;
        $rootScope.GroupSvc = GroupSvc;
        $rootScope.TypeaheadSvc = TypeaheadSvc;

        window.moment.locale('en-AU');

        $rootScope.moment = window.moment.utc; // hacky, but useful.

        $rootScope.showLogin = function() {
            $modal.open({
                animation: true,
                templateUrl: '/assets/templates/login-modal.html',
                controller: 'AuthCtrl',
                size: 'md'
            });
        };

        $rootScope.confirm = function(title, prompt, buttonText, size) {
            var def = $q.defer();

            $modal.open({
                animation: true,
                templateUrl: '/assets/templates/confirm-modal.html',
                controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.title = title || 'Confirm';
                    $scope.prompt = prompt;
                    $scope.buttonText = buttonText || 'OK';
                }],
                size: size || 'md'
            }).result.then(function () {
                def.resolve();
            }, function () {
                def.reject();
            });

            return def.promise;
        }
    }

    window.app.controller('AppCtrl', ['$rootScope', '$modal', '$q', 'ConnectionSvc', 'ReferenceSvc', 'GroupSvc', 'TypeaheadSvc', AppCtrl]);
})(window);
