(function (window) {
    'use strict';

    function OwlCarouselComponent(){
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/assets/templates/owl-carousel-component.html'
        };

        directive.link = function (scope, elem, attrs) {
            var init = function () {
                var carousel = $(elem).find('.carousel'),
                    activeSlide = null;

                carousel.owlCarousel({
                    dots: false,
					responsive: {
                        0: {
                            items: 1,
                            stagePadding: 80,
                        },
                        400: {
                            items: 1,
                            stagePadding: 120,
                        },
						600: {
							items: 1,
                            stagePadding: 175,
						},
						700: {
							items: 4,
						}
					},
                });

                carousel.on("changed.owl.carousel", function(e) {
                    if ($(window).width() < 700) {
                        setTimeout(function(){
                            scope.$apply(function () {
                                scope.toggleActive(e.item.index);
                            });
                        }, 100);
                    }
                });
            };

            var watcher = scope.$watch("data.length", function (newValue, oldValue) {
                if (newValue === 4) {
                    init();
                    setTimeout(function () {
                        $('.head-0').addClass('active');
                    }, 400);
                    watcher(); // kill watcher.
                }
            });
        };

        return directive;
    }

    window.app.directive('owlCarouselComponent', [OwlCarouselComponent]);
})(window);