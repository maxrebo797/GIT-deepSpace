(function (window) {
    'use strict';

    function CreatePostCtrl($scope, PostSvc) {
        $scope.model = {};
        $scope.$loading = false;
        $scope.submitted = false;

        $scope.save = function () {
            if ($scope.form.$valid) {
                $scope.$loading = true;
                $scope.model.postTags = $scope.model.$tags.split(',').map(function (x) { return { tag: { displayText: x.trim() } }; });

                PostSvc.create($scope.model, function (resp) {
                    window.location = resp.data;
                },
                function () {
                    alert('something went wrong');
                    $scope.$loading = false;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.setGroup = function (id) {
            $scope.model.groupId = id;
        };
    }

    window.app.controller('CreatePostCtrl', ['$scope', 'PostSvc', CreatePostCtrl]);

    function EditPostCtrl($scope, PostSvc) {
        $scope.model = {};
        $scope.$loading = false;
        $scope.submitted = false;

        $scope.init = function (id) {
            $scope.id = id;
            PostSvc.get(id, function (resp) {
                $scope.model = resp.data;
            });
        };

        $scope.save = function () {
            if ($scope.form.$valid) {
                $scope.$loading = true;

                PostSvc.update($scope.id, $scope.model, function (resp) {
                    window.location = resp.data;
                },
                function () {
                    alert('something went wrong');
                    $scope.$loading = false;
                });
            } else {
                $scope.submitted = true;
            }
        };
    }

    window.app.controller('EditPostCtrl', ['$scope', 'PostSvc', EditPostCtrl]);

})(window);