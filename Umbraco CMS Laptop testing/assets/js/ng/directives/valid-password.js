(function (window) {
    'use strict';

    function ValidPassword() {
        return {
            require: "ngModel",
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.validPassword = function (modelValue) {
                    if (!modelValue) { return (!!ngModel.$validators.required) ? false : true; }

                    // password must be 8 characters with an uppercase and a number
                    return modelValue.length >= 8 && /\d/.test(modelValue) && /[A-Z]/.test(modelValue);
                };
            }
        };
    }

    window.app.directive('validPassword', ValidPassword);
})(window);