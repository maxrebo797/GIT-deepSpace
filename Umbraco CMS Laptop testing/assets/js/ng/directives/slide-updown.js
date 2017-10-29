(function (angular) {

    angular.module('app').directive('slideUpdown', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var wrapperClass;
                if (attr.slideUpdownClass !== undefined) {
                    wrapperClass = attr.slideUpdownClass;
                }
                else {
                    wrapperClass = "slideupdown-wrapper";
                }
                var $wrapper = element.wrap("<div class='" + wrapperClass + "'></div>").parent();
                $wrapper.css({
                    "overflow": "hidden",
                });
                scope.$watch(attr.slideUpdown, function (value) {
                    if (value) {
                        $timeout(function () {
                            var elementHeight = $(element).outerHeight();
                            $wrapper.css("height", elementHeight);
                        }, 50);
                    }
                    else {
                        $wrapper.css("height", 0);
                    }
                });
            }
        };
    }]);
})(window.angular, window.$);
