(function (window) {
    'use strict';

    function FileModel($parse) {
        var directive = {
            restrict: 'A'
        };

        directive.link = function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        };

        return directive;
    }

    window.app.directive('fileModel', ['$parse', FileModel]);


    function FileUpload ($http, $q) {
        this.uploadFileToUrl = function (file, uploadUrl) {
            var def = $q.defer();

            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function (data) {
                def.resolve(data);
            })
            .error(function (data) {
                def.reject(data);
            });

            return def.promise;
        };
    }

    window.app.service('fileUpload', ['$http', '$q', FileUpload]);


    function MediaSelector(fileUpload) {
        var directive = {
            restrict: 'E',
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=',
                isUploading: '='
            },
            template: '<div ng-disabled="$loading"><input type="file" file-model="myFile"/></div>'
        };

        directive.link = function (scope, element, attrs) {
            scope.upload = function () {
                scope.$error = null;
                scope.$loading = true;
                scope.isUploading = true;
                fileUpload.uploadFileToUrl(scope.myFile, '/api/media').then(function (data) {
                    scope.ngModel = data[0];
                    scope.$loading = false;
                    scope.isUploading = false;
                },
                function (data) {
                    scope.$error = data;
                    scope.$loading = false;
                    scope.isUploading = false;
                });
            };

            scope.$watch('myFile', function (newVal) {
                if (newVal) { scope.upload(); }
            });
        };

        return directive;
    }

    window.app.directive('mediaSelector', ['fileUpload', MediaSelector]);
})(window);