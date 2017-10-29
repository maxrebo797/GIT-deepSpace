(function (window) {
    'use strict';

    function FormStyle() {
        var directive = {
            restrict: 'A',
            replace: false
        };

        directive.link = function (scope, element, attrs) {
            var tag = $(element).prop('tagName');

            switch (tag) {
                case 'SELECT':
                    $(element).wrap('<div class="select"></div>');

                    break;
            }
        };

        return directive;
    }

    window.app.directive('formStyle', [FormStyle]);
})(window);


window.app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});