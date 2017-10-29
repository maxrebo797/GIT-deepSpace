var main = {

	init: function(){
		var self = this;
		self.layout();
		self.mobileNav();
		self.forms();
		self.maps();
	    self.mapView();
		self.faqs();
		self.help();
		self.profile();
		self.grids(true);
		self.accordion();
		self.aside();
		self.carousels();
		self.autoSizeIframes();
		self.brokenImages();
		self.autoSubmits();
		self.browserTweaks();
		self.pagination();
	    self.comments();
	},

	layout: function(){
		// Pull footer up to bottom-align with viewport
		var h = $('footer').outerHeight();
		$('main').css({ minHeight: '100%', paddingBottom: h, marginBottom: h*-1 });

		// Wrap page header for alignment
		$('div.header').find('div.title').wrap($('<div class="table"><div class="cell"></div></div>'));

	    // Wrap all blockquotes with a <p>
	    $('blockquote').each(function() {
	        if (!$(this).find("p").length)
	            $(this).wrapInner("<p>");
	    });

	    // Turn all span.callout-temp in to a Callout
	    $('span.callout-temp').each(function () {
	        var html = $(this).html();
	        $(this).after("<div class='callout'><div class='content'><p>" + html + "</p></div></div>");
	        $(this).remove();
	    });
	},
    
	mobileNav: function(){
		var self = this;
	    var $header = $('header');
	    var $nav = $('body').find('#mobile-nav');
	    var $navInner = $nav.find("#mobile-nav-inner");

	    //we remove hover form first menu options using css and will apply click for mobile.
	    if (isTouchDevice) {
	        $('.quicklinks > ul > li > a').click(function (e) {
	            var $dropdown = $(this).next('ul');
	            if ($dropdown.length > 0) {
	                if ($dropdown.hasClass('active'))
	                    $dropdown.removeClass('active');
	                else
	                    $dropdown.addClass('active');
	                e.preventDefault();
	            }

	        });
	    }

	    function isTouchDevice() {
	        return typeof window.ontouchstart !== 'undefined';
	    }


	    $nav.find('nav.language').wrap('<div class="pre-menu"/>');
	    $header.find('nav.navigation').clone(true).appendTo($navInner);
	    $header.find('nav.quicklinks').clone(true).appendTo($navInner);

		$header.find('.quicklinks > ul > li:first-child').clone(true).wrapAll('<div class="user-mobile"><ul/></div>').parent().parent().appendTo($header.find('.wrap'));
	    $nav.find('nav.language').before('<a class="mobile-nav-trigger"/>').add($nav.find('.mobile-nav-trigger'));//.wrapAll('<div class="pre-menu"/>');

		$nav.find('br').replaceWith('&nbsp;');
		$nav.find('.quicklinks > ul > li').each(function(i){
		    var a = $(this);

			if(i === 0 || ~a.text().indexOf('Privacy Policy') || ~a.text().indexOf('Redirect Page')){
				a.closest('li').remove();
			}
		});
		$nav.find('nav ul > li > a').wrap('<div/>');
		$nav.find('.quicklinks li > ul').each(function(){
			$(this).wrap('<div class="submenu"/>');
		});
		$nav.find('.submenu').prev().children('a').append('<i/>').closest('li').addClass('has-submenu');
		$nav.find('nav ul > .has-submenu').each(function(){
			var li = $(this);

			li.data('base-offset', li.offset().top);
		});
		$nav.find('#mobile-nav-inner').height($(window).outerHeight());

		$('<a class="mobile-nav-trigger">MENU</a>').appendTo($header.find('div.wrap').eq(0));

		var mobileNav = $('#mobile-nav');

		$(document).on('click touch', '.member-nav-mobile.network-nav .action.post', function() {
			$(this).siblings('ul').toggleClass('show');
			return false;
		});
		$(document).on('change', '.member-nav-mobile.network-nav select', function () {
			window.location = $(this).find(":selected").data('href');
		});
		setTimeout(function() {
			$('.member-nav-mobile.network-nav select option').each(function() {
				// After page load, update the custom dropdown with the current page you are on
				if ($(this).data('href') == window.location.pathname) {
					$('.member-nav-mobile.network-nav').find('select.select').siblings('div.value').html($(this).text());
					$('.member-nav-mobile.network-nav').find('select.select').val($(this).text());
				}
			});
		}, 500);

		$('.mobile-nav-trigger').on('click', function(e){

			var mobileNav = $('#mobile-nav'),
				toggleNavVisibility = function(){
					mobileNav.toggleClass('mobile-nav-open');
				};

			$('body').toggleClass('mobile-nav-open');
			mobileNav.hasClass('mobile-nav-open')? setTimeout(toggleNavVisibility, 200) : toggleNavVisibility();

		});

		mobileNav.on('click', '.has-submenu i', function(e){
			var target = $(e.target),
				li = target.closest('li'),
				ancestorMenus = target.parents('.has-submenu'),
				toCollapse = $();

			if(target.is('i')){
				// collapse siblings of ancestor menus and descendents of clicked menu.
				toCollapse = toCollapse.add(ancestorMenus.siblings('.submenu-open'));
				toCollapse = toCollapse.add(target.parent().parent().parent().find('.submenu-open'));
				toCollapse.removeClass('submenu-open');

				if(li.hasClass('submenu-open')) {
					li.removeClass('submenu-open');
				}
				else {
					li.addClass('submenu-open');

					// if a top level item
					if(li.data('base-offset')) {
						console.log('base offset', li.data('base-offset'));
						mobileNav.animate({scrollTop: li.data('base-offset')}, 300);
					}
				}
			}

			e.preventDefault();
		});

		$('#mobile-nav .language').on('touchstart', function(e){
			var tapped = $(this),
				target = $(e.target);

			if(!target.is('a')){
				tapped.closest('.language').toggleClass('tapped');
			}
		});

		$('.user-mobile .logged-in').on('touchstart', function(e){
			$(this).toggleClass('tapped');
		});
	},

	// Form helpers
	forms: function () {

		// Placeholder polyfill
	    $('input, textarea').placeholder();

		// Styled form elements
		$('form').formstyles({
			select: true,
			checkbox: true,
			radio: '.radiogroup',
			file: true
		});

		// File upload previews
		$('input[type="file"]').on('change', function(){
			var $preview = $(this).closest('div.upload').find('div.preview');
			if($preview.length && typeof(FileReader) != 'undefined') {
				$preview.empty().removeClass('loaded');
				var reader = new FileReader();
				reader.onload = function(e) {
					$('<img />').attr('src', e.target.result).appendTo($preview);
					$preview.addClass('loaded');
				};
				reader.readAsDataURL(this.files[0]);
			}
		});

		// Toggle subforms with checkbox
		$('ul.form').find('ul.toggle').each(function(){
			$(this).data('height', $(this).outerHeight()).css({'height': 0, 'overflow': 'hidden'});
		});
		$('input[type="checkbox"].toggle').on('click', function(){
			var $el = $(this).parents('ul').siblings('ul.toggle');
			var h = 0;
			if($(this).is(':checked')) {
				h = $el.data('height');
			}

			$el.css('height', h);
		});

		$('textarea[maxlength]').each(function () {
		    var limit = $(this).attr("maxlength");
		    var elem = $(this).siblings("label").find("span");
		    $(this).limiter(limit, elem);
		});


	},

	maps: function(){
		// Simple maps
		$('div.gmap').each(function() {
		    var el = this,
		        address = $(this).data('address'),
                dataLat = $(this).data('lat'),
                dataLng = $(this).data('lng');

            var latLng = new google.maps.LatLng(dataLat, dataLng);

            var geocoder = new google.maps.Geocoder();

            if (address !== undefined) {
                geocoder.geocode({ 'address': address }, function (result, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        latLng = new google.maps.LatLng(result[0].geometry.location.lat(), result[0].geometry.location.lng());
                        //} else { 
                        //    // if status is either ==   google.maps.GeocoderStatus.ZERO_RESULTS
                        //    //                          google.maps.GeocoderStatus.OVER_QUERY_LIMIT
                        //    //                          google.maps.GeocoderStatus.REQUEST_DENIED
                        //    //                          google.maps.GeocoderStatus.INVALID_REQUEST
                        //    // use the Location that is set in Umbraco
                        //    latLng = new google.maps.LatLng(dataLat, dataLng);
                    }

                    var map = new google.maps.Map(el, {
                        zoom: 16,
                        center: latLng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        zoomControl: true
                    });
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        window.open('//www.google.com.au/maps/place/' + encodeURIComponent(address));
                    });
                });
            } else {

                var map = new google.maps.Map(el, {
                    zoom: 16,
                    center: latLng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    zoomControl: true
                });
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                google.maps.event.addListener(marker, 'click', function () {
                    window.open('//www.google.com.au/maps/place/' + encodeURIComponent(address));
                });

            }
		});

		// Search result maps
		$('div.results-map').each(function(){
			var el = this;
			var geocoder = new google.maps.Geocoder();
			var bounds = new google.maps.LatLngBounds();
			var infoboxes = [];
			var map = new google.maps.Map(el, {
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			$.each(results, function(index){
				var item = this;
				var latlng = new google.maps.LatLng(item.lat, item.lng);
			    var marker = new MarkerWithLabel({
				    position: latlng,
				    icon: '/assets/css/images/map-marker.png',
				    map: map,
				    labelContent: String.fromCharCode(index + 65),
				    labelAnchor: new google.maps.Point(8, 31),
				    labelClass: 'label', // the CSS class for the label
				    labelInBackground: false
				});

			    google.maps.event.addListener(marker, 'click', function() {
				    $.each(infoboxes, function(){
					    this.close();
				    });
				    var infobox = new InfoBox({
					    alignBottom : true,
					    pixelOffset:  new google.maps.Size(0, -70),
					    closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
					    content:	  '<div class="mapinfo"><div class="inner">'
								    + '<a href="' + item.url + '"><div class="image" style="background-image:url(' + item.image + ');" ></div></a>'
								    + '<div class="details">'
								    //+ '<p class="title">' + item.title + '</p>'
								    + '<a href="' + item.url + '"><p class="subtitle">' + item.title + '</p></a>'
                                    + '<p class="date">' + item.date + '</p>'
                                    + '<p class="time">' + item.time + '</p>'
								    + '<p class="categories">' + item.categories + '</p>'
								    + '</div></div></div>'
				    });
				    infobox.open(map, this);
				    infoboxes.push(infobox);
				    map.panTo(this.getPosition());
			    });
			    bounds.extend(latlng);
			    map.fitBounds(bounds);
			});
		});
	    setTimeout(function() {
	        $('.map-view').hide(); // Must hide the map after it has loaded (hiding initially wont load the map)
	    }, 1000);
	},

    mapView: function() {
        $(document).on('click', '.results-view a', function (e) {

            var $this = $(this);
            
            if (!$this.hasClass('active')) {
                if ($this.hasClass('list')) {
                    $('.list-view').show();
                    $('.map-view').hide();
                } else {
                    $('.list-view').hide();
                    $('.map-view').show();
                }
                $('.results-view a').removeClass('active');
                $this.addClass('active');
            } 
            return false;
        });
    },

	faqs: function(){
		$('div.faqs li').each(function(){
			var $question = $(this).find('p.question'),
				$answer = $(this).find('div.answer');
			$answer.wrapInner($('<div class="inner" />'));
			$question.on('click', function(){
				if($question.parent().hasClass('active')) {
					$answer.css('height', 0);
				}
				else {
					$answer.css('height', $answer.find('div.inner').outerHeight());
				}
				$(this).parent().toggleClass('active');
			});
		});
	},

	// Equalise grid item heights per row
	grids: function(init){
		var self = this;

		if(init) {
			$(window).load(function(){
				self.grids(false);
			});
			$(window).smartresize(function(){
				self.grids(false);
			});

			return;
		}

		$('.module.item-list.news li h3 a').ellipsis({
		    lines: 3,             // force ellipsis after a certain number of lines. Default is 'auto'
		    ellipClass: 'ellip',  // class used for ellipsis wrapper and to namespace ellip line
		    responsive: true      // set to true if you want ellipsis to update on window resize. Default is false
		});

		$('article div.module.item-list:not(.sub-content, .contacts) li .content').equalHeights();
		$('article div.module.item-list:not(.sub-content, .contacts) li').equalHeights();
		$('article div.module.item-list.sub-content .border').equalHeights();

		$('article div.module.item-list').each(function () {
		    var $this = $(this);
		    if ($this.find('li').length == 1) {
		        $this.addClass('actions-static');
		    }
		});
		
	},

	help: function(){
		var setPos = function($el){
			var offset = $el.offset(),
				$callout = $el.find('p');
			var right = offset.left + $callout.outerWidth();
			if(right < $(window).width() - 60) {
				$callout.removeClass('left').addClass('right');
			}
			else {
				$callout.removeClass('right').addClass('left');
			}
		};

		$('p.help').wrap($('<div class="inline-help" />'));
		$('div.inline-help').on('click', function(e){
			var $el = $(this);
			e.preventDefault();
			e.stopPropagation();
			$('div.inline-help').removeClass('active');
			setPos($el);
			$(window).smartresize(function(){
				setPos($el);
			});

			if(!$el.hasClass('active')) {
				$('body').on('click.inline-help', function(){
					$('div.inline-help').removeClass('active');
				});
			}
			else {
				$('body').off('click.inline-help');
			}

			$el.toggleClass('active');
		});
	},

	profile: function() {
		var $profile = $('div.network-profile');
		if(!$profile.length) {
			return;
		}

		var $bio = $('div.network-profile').find('div.bio div.content');
		var words = $bio.text().trim().split(' ').splice(0, $bio.data('excerpt')).join(' ');
		var html = '<p>' + words + ' <a class="more">Read more&hellip;</a></p>';
		var $excerpt = $('<div class="excerpt" />').html(html).data('html', html);
		var $full = $bio.wrapInner('<div class="fulltext" style="display: none;" />');
		$bio.append($excerpt);

		$profile.find('a.more, a.profile').on('click', function(e){
			e.preventDefault();

			if(!$bio.hasClass('active')) {
				$bio.css('height', $bio.outerHeight());
				$bio.find('div.excerpt').hide();
				$bio.find('div.fulltext').show();
				$bio.css('height', $bio.find('div.fulltext').outerHeight());
				setTimeout(function(){
					$bio.css('height', '');
					$profile.find('a.profile').html('Read less&hellip;').addClass('close');
					$profile.find('a.more').html('Read less&hellip;');
				}, 250);
			}
			else {
				$bio.css('height', $bio.outerHeight());
				$bio.find('div.excerpt').show();
				$bio.css('height', $bio.find('div.excerpt').outerHeight());

				setTimeout(function(){
					$bio.find('div.fulltext').hide();
				}, 100);

				setTimeout(function(){
					$bio.find('div.fulltext').hide();
					$bio.css('height', '');
					$profile.find('a.profile').html('See full profile').removeClass('close');
					$profile.find('a.more').html('Read more&hellip;');
				}, 250);
			}

			$bio.toggleClass('active');
		});
	},

	accordion: function () {
        if (!$('ul.accordion').length)
	        return;

        var allPanels = $('ul.accordion .message-body').hide();
        
        $(document).on('click', 'ul.accordion > li a',function () {
            allPanels.slideUp();
            $(this).parent().next().slideDown();
            return false;
        });
	},

	aside: function () {
	    $(document).on("click", "aside .more", function () {
	        var $this = $(this);
	        if ($this.attr('href') != '#') { return; }
	        $this.prev(".item-list.module").find("li").show();
	        $this.hide();
	        return false;
	    });

	},

	carousels: function(){
		$('#homepage-header .carousel').owlCarousel({
			items: 1,
            pagination: ($("#homepage-header .carousel .owl-item").length > 1) ? true: false,
            loop: ($("#homepage-header .carousel .owl-item").length > 1) ? true : false,
            autoplay: true,
			autoplayHoverPause: true
		});
	},

	autoSizeIframes: function () {
	    if (window.autosizeiframes) {
	        $(window.autosizeiframes).each(function (idx, config) {
	            iFrameAutoSize.create({
	                domId: config.domId,
	                iFrameUrl: config.iFrameUrl,
	                resizeHelperUrl: '//' + window.location.hostname + '/assets/iFrameAutoSizeHelper.html'
	            });
	        });
	    }
	},

	brokenImages: function () {
	    $('.item-list .news').on('error', 'img', function () {
	        console.log('hi');
	        $(this).attr('src', '/assets/images/placeholder.png');
	    });
	},

	autoSubmits: function () {
	    $('[data-autosubmit]').on('change', function () {
	        $(this).parents('form').submit();
	    });
	},

    browserTweaks: function() {
        // Firefox v30-34 has a bug where -moz-appearance:none doesn't do anything, so the default arrow is always visible in a select. 
        // Here is a hack that attempts to fix this for those versions of firefox.
        // More info: http://stackoverflow.com/questions/23680116/how-can-i-hide-a-select-arrow-in-firefox-30
        var userAgent = navigator.userAgent.toLowerCase();
        if (/firefox/.test(userAgent)) {
            var objOffsetVersion;
            if ((objOffsetVersion = userAgent.indexOf("firefox/")) != -1) {
                var version = parseInt(userAgent.substring(objOffsetVersion + 8));
                if (version < 35 && version >= 30) {
                    console.log("version:" + version);
                    $('div.select').css('overflow', 'hidden');
                    $('div.select select').css('width', '115%');
                }
            }
        }
    },

    pagination: function () {
        var isPaginating = window.location.href.indexOf('page=') != -1;
        if ($('.network-profile').length && isPaginating) {
            $.scrollTo($('.network-profile').next(), 800);
        }
    },

    comments: function () {
        var url = window.location.href;
        var cmtIdIndex = url.indexOf('cmt_id=');
        if (cmtIdIndex == -1)
            return;

        var cmtId = '#' + url.substring(cmtIdIndex + 7, url.length);
        
        setTimeout(function() {
            $.scrollTo(cmtId, 800);
        }, 400);
    }
};
var _tinymce = {
    init: function() {
        // TinyMCE
        tinymce.PluginManager.add('stylebuttons', function(editor, url) {
            ['h1', 'h2', 'h3'].forEach(function(name) {
                editor.addButton("style-" + name, {
                    tooltip: "Toggle " + name,
                    text: name.toUpperCase(),
                    onClick: function() { editor.execCommand('mceToggleFormat', false, name); },
                    onPostRender: function() {
                        var self = this,
                            setup = function() {
                                editor.formatter.formatChanged(name, function(state) {
                                    self.active(state);
                                });
                            };
                        editor.formatter ? setup() : editor.on('init', setup);
                    }
                });
            });
        });

        tinymce.PluginManager.add('quotebutton', function (editor) {
            editor.addButton('quote', {
                tooltip: 'Create quoted text',
                title: 'Create quoted text',
                icon: 'bla',
                onClick: function () {
                    editor.focus();
                    editor.selection.setContent('<blockquote>' + editor.selection.getContent() + '</blockquote>');
                }
            });
        });

        tinymce.PluginManager.add('fileuploader', function (editor) {
            editor.addButton('imageupload', {
                tooltip: 'Upload image',
                title: 'Upload image',
                icon: 'image',
                onClick: function () {
                    editor.windowManager.open({
                        file: '/assets/dialog/upload.html?v=2',
                        title: 'File Upload',
                        width: 420,
                        height: 400,
                        resizable: 'no',
                        inline: 'yes',
                        close_previous: 'no'
                    }, {
                        window: editor.window,
                        editor: editor
                    });
                }
            });
        });

        tinymce.PluginManager.load('paste', '/assets/js/plugins/paste/plugin.min.js');
    }
};

_tinymce.init();

$(document).ready(function(){
	main.init();

	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substrRegex;

			// an array that will be populated with substring matches
			matches = [];

			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');

			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					// the typeahead jQuery plugin expects suggestions to a
					// JavaScript object, refer to typeahead docs for more info
					matches.push({ value: str });
				}
			});

			cb(matches);
		};
	};

});

window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);