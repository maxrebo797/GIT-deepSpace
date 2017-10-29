(function (window) {
    'use strict';

    function PrivacySelector() {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                xgOptions: '=',
                source: '='
            },
            templateUrl: '/assets/templates/privacy-selector.html'
        };

        var levels = {
            'public': 'Public',
            'private': 'Private',
            'restricted': 'Restricted'
        };

        var defaultLevel = levels.private;
        var defaultTitle = 'Privacy options for standard form:';

        directive.link = function (scope, element, attrs) {

            var defaultOptions = [
                {
                    displayText: 'Public - Visible to everyone',
                    value: levels.public
                },
                {
                    displayText: 'Private - Visible only to you',
                    value: levels.private
                },
                {
                    displayText: 'Contacts Only - Visible to you and your contacts',
                    value: levels.restricted
                }
            ];

            scope.options = scope.xgOptions || defaultOptions;
            scope.title = attrs.title || defaultTitle;

            // ensure that private is a valid default option
            var hasPrivate = scope.options.filter(function (ent) { return ent.value === levels.private; }).length > 0;

            if (!hasPrivate) {
                defaultLevel = levels.restricted;
            }

            defaultLevel = attrs.defaultLevel || defaultLevel;

            scope.$property = attrs.property;
            scope.$property = scope.$property[0].toUpperCase() + scope.$property.substr(1);

            scope.setValue = function (value) {
                var isSet = false;
                angular.forEach(scope.source, function (ent) {
                    if (ent.property === scope.$property) {
                        isSet = true;
                        ent.level = value;
                    }
                });

                if (!isSet) {
                    scope.source.push({
                        property: scope.$property,
                        level: value
                    });
                }

                scope.value = value;
            };

            scope.getValue = function (source) {
                var ret = defaultLevel;

                angular.forEach(source || scope.source, function (ent) {
                    if (ent.property === scope.$property) {
                        ret = ent.level;
                    }
                });

                return ret;
            };

            scope.$watch('value', function (newVal) {
                scope.setValue(newVal);
            });

            scope.$watch('source', function (newVal) {
                scope.setValue(scope.getValue(newVal));
            });

            scope.setValue(scope.getValue());
        };

        directive.controller = ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.value = null;

            // ensure only one is displayed at a time
            $rootScope.$on('privacy-selector:shown', function (ev, args) {
                if (args !== $scope.id) {
                    $scope.$visible = false;
                }
            });

            $scope.id = Math.random();
            $scope.toggle = function (ev) {
                if ($(ev.target).hasClass('settings')) {
                    $scope.$visible = true;
                    $rootScope.$emit('privacy-selector:shown', $scope.id);
                }
                else if ($(ev.target).hasClass('privacy-submit')) {
                    $scope.$visible = false;
                }
            };
        }];

        return directive;
    }

    window.app.directive('privacySelector', [PrivacySelector]);
})(window);
