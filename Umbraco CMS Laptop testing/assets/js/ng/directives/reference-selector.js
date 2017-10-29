(function (window) {
    'use strict';

    function ReferenceSelector(ReferenceSvc) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=xgModel'
            },
            template: '<select ng-options="a.id as a.displayText for a in options" ng-model="model" id="{{model.id}}" name="{{model.name}}"></select>'
        };

        directive.link = function (scope, element, attrs) {
            ReferenceSvc.get(attrs.refType, function (data) {
                scope.options = data;
            });
        };

        return directive;
    }

    window.app.directive('referenceSelector', ['ReferenceSvc', ReferenceSelector]);
})(window);