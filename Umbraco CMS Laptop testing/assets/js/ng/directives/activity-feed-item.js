(function (window) {
    'use strict';

    function activityFeedItem() {
        var directive = {
            restrict: 'AE',
            templateUrl: '/assets/templates/activity-feed-item.html',
            scope: { activity:'=' }
        };

        directive.link = function (scope, element, attrs) {
            scope.element = element;
            scope.entity = attrs.entity;
            scope.init();
        };

        directive.controller = ['$scope', function ($scope) {


            $scope.init = function () {

            };

            $scope.getActorClass = function(activity){
                switch(activity.type) {
                    case "blog_post":
                        return "user";
                    case "created_event":
                        return "quote";
                }
            };

        }];

        return directive;
    }

   window.app.directive('activityFeedItem', [activityFeedItem]);
})(window);
