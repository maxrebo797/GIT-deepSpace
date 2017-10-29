(function (window) {
    'use strict';

    function ReferenceSelectorMulti(ReferenceSvc) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=xgModel'
            },
            template: ['<ul class="checkboxes">',
                '<li ng-repeat="o in options">',
                    '<input type="checkbox" ng-model="selections[o.id]" id="{{o.id}}" /><label for="{{o.id}}">{{o.displayText}}</label>',
                '</li>',
                // '<li><em>selections</em> <pre>{{selections | json}}</pre></li>',
                // '<li><em>model</em> <pre>{{model | json}}</pre></li>',
                '</ul>'].join('')
        };

        directive.link = function (scope, element, attrs) {
            // get the references
            ReferenceSvc.get(attrs.refType, function (data) {
                scope.options = data;
            });

            scope.$watch('model', function (newVal) {
                if (newVal && !scope.selections) {
                    // setup the initial state
                    scope.selections = {};
                    angular.forEach(newVal, function (selection) {
                        scope.selections[selection.referenceId] = true;
                    });

                    // watch for changes
                    scope.$watch('selections', function (newVal) {
                        scope.model = [];
                        angular.forEach(Object.keys(newVal), function (k) {
                            if (newVal[k]) {
                                scope.model.push({ referenceId: k });
                            }
                        });
                    }, true);
                }
            });
        };

        return directive;
    }

    window.app.directive('referenceSelectorMulti', ['ReferenceSvc', ReferenceSelectorMulti]);
})(window);