
(function (window) {
    'use strict';

    function implementation($scope, $modal, $timeout, $cookies) {
		
		$scope.open = function(promotionId) {
			
			if($cookies.seenPromotionIds) {
				var seenPromotions = $cookies.seenPromotionIds.split(',');
				if(!seenPromotions.indexOf(promotionId.toString()) > -1) {
					return;	//Seen this promotion.  GET AHHT OF HEER
				}
			}		
			
			$timeout(function() {
				$modal.open({
					animation: true,
					templateUrl: 'promotionLightbox.html',
					controller: 'PromoLightboxController',
					size: 'md',
					resolve: {
						items: function () {
							return $scope.items;
						}
					}
				});
				
				//if(dataLayer) {
				//	dataLayer.push({
				//		'eventCategory': 	'PromoLightbox',
				//		'event': 			promotionId,
				//		'eventAction': 		'Impression',
				//		'eventLabel': 		''
				//	});
				//}
			}, 1000);
		}
    }

    function PromoLightboxController($scope, $modalInstance, $cookies) {
        $scope.close = function (id) {
            $cookies.seenPromotionIds += "," + id;
            $modalInstance.dismiss('cancel');
        };
    }

    window.app.controller('PromotionalLightbox', ['$scope', '$modal', '$timeout', '$cookies', implementation]);
    window.app.controller('PromoLightboxController', ['$scope', '$modalInstance', '$cookies', PromoLightboxController]);
})(window);
