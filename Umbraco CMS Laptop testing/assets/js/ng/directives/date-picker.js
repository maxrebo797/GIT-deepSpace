(function (window, moment) {
    'use strict';

    function DatePicker() {

        function link(scope, element) {
            var $this = $(element);
            var offsetX = parseInt("-" + $this.width()) - 30;
            var offsetY = parseInt($this.height()) + 20;
            $this.Zebra_DatePicker({
                default_position: 'below',
                offset: [offsetX, offsetY],

                onSelect: function () {
                    var value = arguments[1];

                    scope.$apply(function () {
                        scope.model = value;
                    });
                }
            });

            scope.$watch('model', function (newVal) {
                if (newVal) {
                    scope.model = moment(newVal).format('YYYY-MM-DD');
                }
            });
        }

        return {
            restrict: 'E',
            require: ['ngModel'],
            scope: {
                model: '=ngModel'
            },
            template: '<input type="text" />',
            replace: true,
            link: link
        };
    }

    window.app.directive('datePicker', [DatePicker]);
})(window, window.moment);