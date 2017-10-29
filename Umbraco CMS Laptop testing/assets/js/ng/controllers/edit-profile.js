(function (window) {
    'use strict';

    function EditProfileCtrl($scope, $location, ProfileSvc, PermissionSvc) {
        $scope.$loading = true;
        $scope.submitted = false;

        

        $scope.permissions = [];
        $scope.profile = ProfileSvc.get(function (ent) {
            //PermissionSvc.list(ent.id, function (resp) {
            //    $scope.permissions = resp.data;
            //});

            $scope.$loading = false;
        });

        $scope.save = function () {
            if ($scope.form.$valid && $scope.profile.breastCancerExperienceId) {
                $scope.$loading = true;
                // save the profile and the permissions
                window.async.parallel([
                    function (callback) {
                        $scope.profile.save(function () {
                            callback(null);                            
                        });
                    }
                ], function (err, results) {
                    if (err) {
                        alert('something went wrong');
                        console.log(results);
                        return;
                        $scope.success = false;
                    } else {
                        $scope.success = true;
                    }

                    $scope.$loading = false;
                });
            } else {
                $scope.submitted = true;
            }
        };
    }

    window.app.controller('EditProfileCtrl', ['$scope', '$location', 'ProfileSvc', 'PermissionSvc', EditProfileCtrl]);
})(window);