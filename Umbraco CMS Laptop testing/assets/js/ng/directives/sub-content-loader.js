(function (window) {
    'use strict';

    function SubContentLoader($compile, $http) {

        var directive = {
            restrict: 'A'
        };

        directive.link = function ($scope, element) {

            var $anchors     = $(element).find("a[data-sub-content-anchor]");
            var $container   = $(element).find("[data-sub-content-container]");

            $anchors.on("click", function(e) {
                e.preventDefault();
                loadSubContent($(this).attr("href"));
                return false;
            });

            var loadSubContent = function (url) {
                $container.html("<div class='loading-spinner'></div>");
                $("html, body").animate({
                    scrollTop: $container.offset().top - 50
                });
                $http.get(url).success(function (data) {
                    var $element = angular.element($(data).find("[data-sub-content-container]").html());
                    $compile($element)($scope);
                    $container.empty().append($element);
                    history.pushState('', '', url);
                });
            };

        };
        return directive;
    }

    window.app.directive('subContentLoader', ['$compile', '$http', SubContentLoader]);
})(window);