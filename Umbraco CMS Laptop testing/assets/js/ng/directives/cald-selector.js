(function (window) {
    'use strict';

    function CaldSelector() {

        var directive = {
            scope: true,
            restrict: 'E',
            replace: true,
            template: ['<nav class="language">',
                       '    <p title="Current language" ng-repeat="(key, value) in terms" ng-class="{ \'fade-on\': currentIndex == key, \'fade-off\': currentIndex != key }"><span>{{ value }}</span></p>',
                       '    <ul>',
                       '        <li ng-repeat="(key, value) in pages"><a href="{{ value.Url }}">{{ value.Title }}</a></li>',
                       '    </ul>',
                       '</nav>'].join('')
        };

        directive.controller = ['$scope', '$timeout', 'CaldSvc', function ($scope, $timeout, CaldSvc) {

            CaldSvc.pages(function (resp) {
                $scope.pages = resp.data.Pages;
                
                var terms = ["English"];
                for (var i = 0; i < $scope.pages.length; i++) {
                    terms.push($scope.pages[i].Title);
                }

                $scope.terms = terms;

                $scope.currentIndex = 0;

                var toggle = function () {
                    $scope.currentIndex++;
                    if ($scope.currentIndex == terms.length) {
                        $scope.currentIndex = 0;
                    }

                    $timeout(toggle, 3000);
                };

                $timeout(toggle, 3000);

            });

        }];

        return directive;
    }

    window.app.directive('caldSelector', CaldSelector);
})(window);



