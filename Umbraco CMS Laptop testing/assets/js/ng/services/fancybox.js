(function (window) {
    'use strict';

    function CommentSvc($compile, $http) {
        this.doFancyBox = function ($scope, url, width, height, data, urlName) {
            $http.get(url).then(function (response) {
                if (response.status === 200) {

                    var template = angular.element(response.data);
                    var compiledTemplate = $compile(template);

                    $scope.data = data;
                    compiledTemplate($scope);

                    var initFancy = function () {
                        var fitToView = false;
                        var margin = 20;
                        var topRatio = 0.5;

                        if ($(window).width() < 600) {
                            width = "100%";
                            height = "100%";
                            fitToView = true;
                            margin = 0;
                            topRatio = 0;
                        }

                        if ($(window).height() < 600) {
                            height = "95%";
                            fitToView = true;
                            margin = 0;
                        }

                        $.fancybox({
                            content: template,
                            type: 'html',
                            width: width,
                            height: height,
                            //maxWidth: 800,
                            //maxHeight: 600,
                            //minWidth: 500,
                            minHeight: 450,
                            margin: margin,
                            fitToView: fitToView,
                            topRatio: topRatio,
                            padding: 20,
                            autoSize: false,
                            closeClick: false,
                            openEffect: 'none',
                            closeEffect: 'none'
                        });
                    };

                    initFancy();
                    history.pushState(null, "", urlName);

                }
            });
        }
    }

    window.app.service('FancyBoxSvc', ['$compile', '$http', CommentSvc]);
})(window);