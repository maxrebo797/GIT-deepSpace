(function (window) {
    'use strict';

    function Report() {
        var directive = {
            scope: true,
            restrict: 'E',
            replace: true,
            template: ['<form class="report">',
                       '    <select title="Report post">',
                       '        <option value="">Report</option>',
                       '        <option value="Spam">Report SPAM content</option>',
                       '        <option value="Inappropriate">Report members content as inappropriate</option>',
                       '    </select>',
                       '</form>'].join('')
        };

        directive.link = function (scope, element, attrs) {
            scope.init(attrs.entityId, attrs.entityType);

            $(element).find('select').on('change', function () {
                scope.do($(this).val());
                $(this).val('');
            });
        };

        directive.controller = ['$scope', '$modal', function ($scope, $modal) {
            $scope.init = function (entityId, entityType) {
                $scope.entityId = entityId;
                $scope.entityType = entityType;

                $('form').formstyles({
                    select: true,
                    checkbox: true,
                    radio: '.radiogroup',
                    file: true
                });
            };

            $scope.do = function (type) {
                $modal.open({
                    animation: true,
                    templateUrl: '/assets/templates/report-content-modal.html',
                    size: 'md',
                    controller: 'ReportContentCtrl',
                    resolve: {
                        type: function () { return type; },
                        entityId: function () { return $scope.entityId; },
                        entityType: function () { return $scope.entityType; }
                    }
                });
            };
        }];

        return directive;
    }

    window.app.directive('report', [Report]);

    function ReportContentCtrl($scope, FlagSvc, type, entityId, entityType) {
        $scope.submit = function (summary) {
            $scope.$loading = true;
            FlagSvc.create({ id: entityId, type: type, entityType: entityType, summary: summary }, function () {
                $scope.responseMessage = 'Thank you for submitting this report. BCNA administrators will review the content and take appropriate action.';
                $scope.$loading = false;
            }, function () {
                alert('An error has occurred.');
                $scope.$loading = false;
            });
        };
    }

    window.app.controller('ReportContentCtrl', ['$scope', 'FlagSvc', 'type', 'entityId', 'entityType', ReportContentCtrl]);

})(window);
