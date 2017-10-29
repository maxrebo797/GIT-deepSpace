(function (window) {
    'use strict';

    function CompareTo() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo",
				hideOnSourceNull: "=compareToHideOnSourceNull"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
					//Hides the error message if the upstream source is null, trusting that upstream validation is validating correctly
					if(scope.hideOnSourceNull && !scope.otherModelValue) { return true; }	
                    
					if (!modelValue && !scope.otherModelValue) { return true; }
                    return modelValue === scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }

    window.app.directive("compareTo", CompareTo);
})(window);