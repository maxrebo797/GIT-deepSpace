(function (window) {
    'use strict';

    function TellFriendCtrl($scope, $rootScope, $http) {
        $scope.init = function (url) {
            $scope.url = url;
        };

        $scope.send = function () {
            $scope.$loading = true;
            var data = {
                sender: $scope.sender,
                email: $scope.email,
                url: $scope.url,
                antiSpam: { response: $scope.antiSpamResponse }
            };
            $http.post('/api/tell-a-friend', data).then(function () {
                $scope.$success = true;
                $scope.$loading = false;
            }, function () {
                alert('something went wrong');
                $scope.$loading = false;
                $rootScope.$broadcast('recaptcha:reload', 'tell-friend-recap');
            });
        };

        $scope.$on('recaptcha:response', function (e, args) {
            if (args.id === 'tell-friend-recap') {
                $scope.antiSpamResponse = args.response;
            }
        });
    }

    window.app.controller('TellFriendCtrl', ['$scope', '$rootScope', '$http', TellFriendCtrl]);

})(window);
