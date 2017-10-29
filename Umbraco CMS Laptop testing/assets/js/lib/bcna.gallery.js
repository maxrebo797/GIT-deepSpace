/** @package bcna-frontend 
 *	Image/video gallery module
 *	@requires jquery.slick
 */

var gallery = {
	
    init: function ($el) {
        var self = this;
        
		self.$items = $el.find('ul');
		$el.prepend('<div class="viewer" />');
		var $viewer = $el.find('.viewer');

		// Thumbnail links
		self.$items.wrap($('<div class="thumbnails" />')).find('li a').each(function () {
		    var $this = $(this);
		    var href = $this.attr('href');
		    // Get youtube thumbnail
		    if (typeof href !== typeof undefined && href !== false) {
		        if (gallery_helper.urlType(href) == 'video' && !$this.children('img').length) {
		            var params = $.parseParams(href.split('?').pop());
		            if (params.v) {
		                var url = '//img.youtube.com/vi/' + params.v + '/1.jpg';
		                $this.empty();
		                $('<img />').attr('src', url).appendTo($this);
		                $('<span class="video" />').appendTo($this);
		            }
		        }
		    
		        $this.on('click', function (e) {
				    e.preventDefault();
				    self.viewItem(href, $viewer, true);
		        });
		    }
		});
		
		// Default to first item, no autoplay
		self.viewItem(self.$items.find('a').eq(0).attr('href'), $viewer, false);
		
		// Carousel
		self.$items.slick({
			slide: 'li',
			slidesToShow: 3,
			slidesToScroll: 3,
			arrows: true,
			prevArrow: '<a class="page prev" />',
			nextArrow: '<a class="page next" />',
			infinite: false,			
			responsive: [
				{
					breakpoint: 960,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}
				},
				{
					breakpoint: 800,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				}
			]
		});

	    
	},
	
	viewItem: function(url, obj, autoplay){
		
		if(autoplay) {
			// Lock height until item loaded
		    obj.css('height', obj.height());
		}
		obj.empty();
		
		switch (gallery_helper.urlType(url)) {
			case 'image':
			    obj.removeClass('video').addClass('image');
			    $('<img />').attr('src', url).appendTo(obj).on('load', function () {
			        obj.css('height', 'auto');
				});
				break;
				
			case 'video':
				var params = $.parseParams(url.split('?').pop());
				url = '//youtube.com/embed/' + params.v;
				if(autoplay) {
					url+= '?autoplay=1';
				}
				obj.removeClass('image').addClass('video');
				$('<iframe />').attr('src', url).appendTo(obj).on('load', function () {
				    obj.css('height', 'auto');
				});
				break;
				
			default:
				console.error('Invalid link type');
				break;
		}
	}
	
};

var gallery_helper = {
    urlType: function(url) {
        //console.log(url, "url");
        if (url.match(/\.(jpeg|jpg|gif|png)/) != null) {
            return 'image';
        } else if (url.match(/(youtube|youtu\.be)/) != null) {
            return 'video';
        }
        return 'error';
    }
};

$(document).ready(function(){
    $('div.gallery').each(function () {
        $(this).attr("id", "gallery-" + new Date().getTime());
		gallery.init($(this));
	});
});
