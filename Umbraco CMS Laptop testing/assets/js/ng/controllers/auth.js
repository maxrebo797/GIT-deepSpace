(function (window) {
    'use strict';

    function AuthCtrl($rootScope, $scope, $timeout, AuthSvc) {
        $scope.$loading = false;
        $scope.$registered = false;
        $scope.submitted = false;
		$scope.aboriginalOriginsOptions=[{label:"No",value:0},{label:"Yes, Aboriginal",value:2},{label:"Yes, Torres Strait Islander",value:3},{label:"Yes, Both Aboriginal and Torres Strait Islander",value:4},{label:"Prefer not to say",value:-1}]
        var returnUrl = window.location.search.substring(1).split('=')[0] == "ReturnUrl" ? decodeURIComponent(window.location.search.substring(1).split('=')[1]) : "";

        $scope.login = function () {
            if ($scope.form.$valid) {
                $scope.error = null;
                $scope.$loading = true;
                AuthSvc.login($scope.username, $scope.password, function (resp) {
                    window.location = returnUrl == "" ? "/welcome" : returnUrl; 
                },
                function (resp) {
					if(resp.data === 'UNVERIFIED') {
						$scope.isUnverified = true;
					}
					else {
						$scope.error = resp.data;
                    }
					$scope.$loading = false;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.register = function () {
            if ($scope.form.$valid && $scope.user.dateOfBirth) {
                $scope.user.antiSpam = { response: $scope.antiSpamResponse };

                $scope.$loading = true;
                AuthSvc.register($scope.user, function (/*resp*/) {
                    $scope.$registered = true;
                    $scope.$loading = false;
                },
                function (resp) {
                    $scope.$loading = false;
                    $scope.error = resp.data;

                    $rootScope.$broadcast('recaptcha:reload', 'register-recap');
                });
            } else {
                $scope.submitted = true;
            }
        };

		$scope.verify = function() {
			$scope.verifying = true;
			AuthSvc.verify($scope.username, function(resp) {
				$scope.error = resp.data;
			});
		};
		
		$scope.$on('recaptcha:loaded', function(e, args) {
			$scope.recaptchaLoaded = true;
		});

        $scope.$on('recaptcha:response', function (e, args) {
            if (args.id === 'register-recap') {
                $scope.antiSpamResponse = args.response;
            }
        });

        $scope.logout = function () {
            AuthSvc.logout(function () {
                window.location = '/';
            });
        };
    }

    window.app.controller('AuthCtrl', ['$rootScope', '$scope', '$timeout', 'AuthSvc', AuthCtrl]);
})(window);
