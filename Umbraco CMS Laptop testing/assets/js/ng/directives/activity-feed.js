(function (window) {
    'use strict';

    function ActivityFeed($compile,$timeout) {
        var directive = {
            restrict: 'E',
            templateUrl: '/assets/templates/activity-feed.html',
            replace: true
        };

        directive.link = function (scope, element, attrs) {
            scope.element = element;
            scope.entity = attrs.entity;
            scope.entityType = attrs.entityType;
            scope.activityCount = attrs.count !== undefined ? parseInt(attrs.count) : 6 ;
            scope.activityCount = 8;
            scope.refreshinseconds = ( attrs.refreshinseconds !== undefined ?  parseInt(attrs.refreshinseconds) : 15) * 1000;
            scope.init();

            // Create new directive - feed-list-item
            // Compile feed-list-item before appending it
            // Add timeout on for loop for each new item

            var expanderFun = function($item){
                var $thisitem = $item;
                return {
                    expand: function(){
                        $thisitem.addClass('activity-feed__activity--visible');
                        var totalCount = $(element).find(".activity-feed__list li").length;
                        // Remove one when we show one
                        if( totalCount > scope.activityCount ) {
                            $(element).find(".activity-feed__list li:last").remove();
                        }
                    }
                };
            };

            scope.$watch('data.activities.length', function (newLength, oldLength) {
                var timer = 0;
                for (var i = oldLength; i < newLength; i++) {
                    var activity= scope.data.activities[i];
                    var itemDirective =  $compile( "<li class='activity-feed__activity' activity-feed-item activity='data.activities[" + i + "]'></li>")(scope);
                    var newItem = itemDirective[0];
                    $(element).find(".activity-feed__list").prepend(newItem);
                    var expander = new expanderFun($(newItem));
                    $timeout( expander.expand, timer);
                    timer = timer + 3000;
                }
            });
        };

        directive.controller = ['$scope','$interval','$timeout', '$sce', '$filter', 'ActivityFeedSvc', function ($scope, $interval,$timeout, $sce, $filter, ActivityFeedSvc) {
            $scope.data = {};
            $scope.data.activities = [];
            $scope.$loading = true;

            $scope.refresh = function () {
                ActivityFeedSvc.list($scope.activityCount, function (resp) {
                    $scope.$loading = false;
                    for (var i = 0; i < resp.data.length; i++) {
                        addActivityItem(resp.data[i]);
                    }
                });
            };

            // Adds a new item to the list if it doesn't already exist, based on created timestamp
            var addActivityItem = function (item) {
                var matching = $filter('filter')($scope.data.activities, { created: item.created });
                if (matching.length == 0) {
                    $scope.data.activities.push(item);
                }
            };

            $scope.init = function () {
               $scope.refresh();
               $interval($scope.refresh, $scope.refreshinseconds);
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

    window.app.directive('activityFeed',['$compile','$timeout',ActivityFeed]);
})(window);
