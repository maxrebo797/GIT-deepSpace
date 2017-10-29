
(function (window) {
    'use strict';

    function GroupEventCreateCtrl($scope, GroupEventSvc, PermissionSvc) {
        $scope.model = {};
        $scope.permissions = [];
        $scope.submitted = false;

        $scope.init = function (key) {
            $scope.model.group = key;
        };

        $scope.save = function () {
            if ($scope.form.$valid) {
                $scope.model.start = window.mergeDateTime($scope.model.startDate, $scope.model.startTime);
                $scope.model.end = window.mergeDateTime($scope.model.endDate, $scope.model.endTime);
                GroupEventSvc.create($scope.model, function (resp) {
                    var url = resp.data.url;

                    PermissionSvc.update(resp.data.id, $scope.permissions, function () {
                        window.location = url;
                    }, function () {
                        alert('something went wrong');
                    });
                },
                function () {
                    alert('something went wrong');
                });
            } else {
                $scope.submitted = true;
            }
        };
    }

    window.app.controller('GroupEventCreateCtrl', ['$scope', 'GroupEventSvc', 'PermissionSvc', GroupEventCreateCtrl]);

    function GroupEventEditCtrl($scope, GroupEventSvc, PermissionSvc, ReferenceSvc) {
        $scope.$loading = true;
        $scope.permissions = [];
        $scope.statesList = ReferenceSvc.states;
        
        $scope.init = function (groupKey, eventKey) {
            GroupEventSvc.get(groupKey, eventKey, function (resp) {
                console.log(resp.data);

                $scope.model = resp.data;
                $scope.model.group = groupKey;
                $scope.model.key = eventKey;

                $scope.model.startDate = $scope.model.startTime = new Date($scope.model.start);
                $scope.model.endDate = $scope.model.endTime = new Date($scope.model.end);

                $scope.stateInit($scope.model);
                
                PermissionSvc.list($scope.model.id, function (resp) {
                    $scope.permissions = resp.data; 
                });

                $scope.$loading = false;
            }, function () {
                alert('something went wrong');
                $scope.$loading = false;
            });
        };

        $scope.stateInit = function(model) {
            if (model.location && model.location.state) {
                for (var i = 0; i < $scope.statesList.length; i++) {
                    if ($scope.statesList[i].displayText === model.location.state) {
                        model.location.state = $scope.statesList[i];
                        return;
                    }
                }
            }
        }

        $scope.save = function () {
            $scope.model.start = window.mergeDateTime($scope.model.startDate, $scope.model.startTime);
            $scope.model.end = window.mergeDateTime($scope.model.endDate, $scope.model.endTime);

            if ($scope.model.location && $scope.model.location.state) {
                $scope.model.location.state = $scope.model.location.state.displayText;
            }

            window.async.parallel([
                function (callback) {
                    GroupEventSvc.save($scope.model,
                        function (resp) { callback(null, resp.data); },
                        function (resp) { callback(resp, resp.data); } );
                },
                function (callback) {
                    PermissionSvc.update($scope.model.id, $scope.permissions,
                        function () { callback(null); },
                        function (resp) { callback(resp, resp.data); } );
                }
            ], function (err, results) {
                if (err) {
                    alert('something went wrong');
                    console.log(results);
                    return;
                }

                window.location = results.clean()[0];

                $scope.$loading = false;
            });
        };
    }

    window.app.controller('GroupEventEditCtrl', ['$scope', 'GroupEventSvc', 'PermissionSvc', 'ReferenceSvc', GroupEventEditCtrl]);

})(window);