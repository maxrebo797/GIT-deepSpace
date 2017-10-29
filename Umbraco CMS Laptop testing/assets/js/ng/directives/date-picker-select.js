(function (window, moment) {
    'use strict';

    function DatePickerSelect() {

        function link(scope, element) {
            var $this = $(element);
            $().dateSelectBoxes({
                generateOptions: true,
                dayElement: $('#dob-day'),
                monthElement: $('#dob-month'),
                yearElement: $('#dob-year')
            });

            $this.on('change', function () {
                var $element = $(this);
                var dayVal = $element.find('#dob-day').val();
                if (dayVal.length == 1) dayVal = "0" + dayVal;

                var mthVal = $element.find('#dob-month').val();
                if (mthVal.length == 1) mthVal = "0" + mthVal;

                scope.$apply(function() {
                    scope.model = moment($element.find('#dob-year option:selected').text() + '-' + mthVal + '-' + dayVal).format('YYYY-MM-DD');
                });

                $element.find('option[value=clean]').remove();
            });

            $this.find('option[value=clean]').remove();
        }

        return {
            restrict: 'E',
            require: ['ngModel'],
            scope: {
                model: '=ngModel'
            },
            template: '<div id="dob-select"><div class="select-day"><select id="dob-day" name="dob-day"></select></div><div class="select-month"><select id="dob-month" name="dob-month"></select></div><div class="select-year"><select id="dob-year" name="dob-year"></select></div></div>',
            replace: true,
            link: link
        };
    }

    window.app.directive('datePickerSelect', [DatePickerSelect]);
})(window, window.moment);