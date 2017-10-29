(function (window, grecaptcha) {
    'use strict';

    var captchaLoaded = false;

    window.RecaptchaLoaded = function() {
        captchaLoaded = true;

        angular.element('body').scope().$root.$broadcast('recaptcha:loaded');
    };

    function Recaptcha() {
        var directive = {
            restrict: 'A',
            scope: true
        };

        directive.link = function (scope, element, attrs) {
            scope.id = attrs.id;

            function callback(response) {
                scope.$emit('recaptcha:response', { id: scope.id, response: response });
            }

            function render() {
                window.grecaptcha.render(element[0], {
                    'sitekey': attrs.siteKey,
                    'callback': callback
                });
            }

            function reset() {
                window.grecaptcha.reset();
            }

            if (grecaptcha) { render(); }
            else {
                scope.$on('recaptcha:loaded', render);
            }

            scope.$on('recaptcha:reload', function (e, args) {
                if (args === scope.id) {
                    reset();
                }
            });
        };

        return directive;
    }

    window.app.directive('recaptcha', Recaptcha);

})(window, window.grecaptcha);
