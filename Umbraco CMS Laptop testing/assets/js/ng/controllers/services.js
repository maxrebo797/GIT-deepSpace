(function (window) {
    'use strict';

    function CreateServiceCtrl($scope, ServiceSvc, AuthSvc) {
        $scope.model = {};
        $scope.submitted = false;

        AuthSvc.me(function (resp) {
            if (resp.data) {
                $scope.model.contactEmail = $scope.model.contactEmail || resp.data.email;
                $scope.model.contactPhone = $scope.model.contactPhone || resp.data.phone;
                $scope.model.contactName = $scope.model.contactName || resp.data.name;
            }
        }, function () {
            // user not logged in.
        });

        $scope.create = function () {
            if ($scope.form.$valid) {            
                $scope.model.antiSpam = { response: $scope.antiSpamResponse };

                ServiceSvc.create($scope.model, function () {
                    $scope.$finished = true;
                },
                function () {
                    alert('something went wrong');
                });
            } else {
                $scope.submitted = true;
            }
        };


        $scope.$on('recaptcha:response', function (e, args) {
            if (args.id === 'suggest-recap') {
                $scope.antiSpamResponse = args.response;
            }
        });
    }

    window.app.controller('CreateServiceCtrl', ['$scope', 'ServiceSvc', 'AuthSvc', CreateServiceCtrl]);

    function EditServiceCtrl($scope, ServiceSvc) {
        $scope.whatWeDoOptions = [
            'Face-to-face support',
            'Online support',
            'Provide information',
            'Fundraise',
            'Social events',
            'Exercise',
            'Advocacy'
        ];

        $scope.init = function (id) {
            $scope.$loading = true;
            ServiceSvc.get(id, function (resp) {
                $scope.model = resp.data;
                $scope.model.whatWeDoDisp = $scope.model.whatWeDo.reduce(function (o, v) { o[v] = true; return o; }, {});

                $scope.$loading = false;
            });
        };

        $scope.save = function () {
            $scope.$loading = true;

            ServiceSvc.save($scope.model, function (resp) {
                window.location = resp.data.url;
            },
            function () {
                alert('something went wrong');
            });
        };

        $scope.$watch('model.whatWeDoDisp', function () {
            if (!$scope.model) { return; }
            $scope.model.whatWeDo = Object.keys($scope.model.whatWeDoDisp).filter(function (k) { return $scope.model.whatWeDoDisp[k]; }).map(function (k) { return k; });
        }, true);
    }

    window.app.controller('EditServiceCtrl', ['$scope', 'ServiceSvc', EditServiceCtrl]);

})(window);
