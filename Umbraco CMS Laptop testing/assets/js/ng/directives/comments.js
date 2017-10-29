(function (window) {
    'use strict';

    function Comments() {
        var directive = {
            restrict: 'E',
            templateUrl: '/assets/templates/comments.html',
            replace: true
        };

        directive.link = function ($scope, element, attrs) {
            $scope.element = element;
            $scope.entity = attrs.entity;
            $scope.entityType = attrs.entityType;
            $scope.admin = attrs.admin;
            $scope.loggedIn = attrs.loggedIn;

            $scope.init();
            main.forms();
        };

        directive.controller = ['$scope', '$sce', 'CommentSvc', function ($scope, $sce, CommentSvc) {
            $scope.refresh = function () {
                $scope.$loading = true;
                CommentSvc.list($scope.entity, function (resp) {
                    $scope.data = resp.data;

                    $scope.$loading = false;
                });

            };

            $scope.init = function () {
                $scope.refresh();
            };

            $scope.create = function (source) {
                var model = {
                    entityId: $scope.entity,
                    entityType: $scope.entityType
                };

                var $create = null;

                if (source) {
                    model.parentId = source.id;

                    $create = source.$create;
                }
                else {
                    $create = $scope.$create;
                }

                model.body = $create.body;

                $create.$loading = true;
                CommentSvc.create(model,
                    function () {
                        $scope.refresh();
                        $create.body = null;
                        if (!source) {
                            // comment at root level. hide input
                            $scope.$cmtvisible = false;
                        }
                        $create.$loading = false;

                    }, function () {
                        alert('something went wrong');
                        $create.$loading = false;
                    });

            };

            $scope.edit = function (source) {
                var model = {
                    entityId: $scope.entity,
                    entityType: $scope.entityType
                };

                var $edit = null;

                if (source) {
                    $edit = source.$edit;
                }
                else {
                    $edit = $scope.$edit;
                }

                model.body = $edit.body;
                model.Id = $edit.id;

                $edit.$loading = true;
                CommentSvc.edit(model,
                    function () {
                        $scope.refresh();
                        $edit.body = null;
                        if (!source) {
                            // comment at root level. hide input
                            $scope.$cmtvisible = false;
                        }
                        $edit.$loading = false;

                    }, function () {
                        alert('something went wrong');
                        $edit.$loading = false;
                    });

            };

            $scope.safe = function (input) {
                return $sce.trustAsHtml(input);
            };
        }];

        return directive;
    }

    window.app.directive('comments', [Comments]);
})(window);