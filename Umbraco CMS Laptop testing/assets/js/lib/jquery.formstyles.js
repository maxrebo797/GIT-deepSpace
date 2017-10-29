(function($) {
	$.fn.formstyles = function(options){
		var settings = $.extend({
			select: false,
			checkbox: false,
			radio: false,
			file: false
		}, options );
		
		var $form = this;
		
		if(settings.select) {
		    $form.find('select').each(function () {
		        if (!$(this).parent("div.select").length)
		            $(this).wrap('<div class="select"></div>');
			});
		}
		
		if (settings.checkbox) {
		    // Changed to pure css..
		}
		
		if(settings.radio) {
			$form.find(settings.radio).not('.styled').each(function(){
				var $group = $(this).addClass('styled');
				$group.find('input[type="radio"]:checked').parent().addClass('active');
				$group.find('input[type="radio"]').on('click', function(){
					$group.find('.active').removeClass('active');
					$(this).parent().addClass('active');
				});
				$group.find('input.other').on('focus', function(){
					$group.find('.active').removeClass('active');
					$group.find('input[type="radio"]').prop('checked', false);
				});
			});
		}
		
		if(settings.file) {
			$form.find('input[type="file"]').not('.styled').each(function(){
				var $wrap = $('<div class="fileinput placeholder" />').insertBefore($(this));
				$('<div class="value" />').text($(this).data('placeholder')).appendTo($wrap);
				$(this).appendTo($wrap).on('change', function(){
					$(this).siblings('div.value').html($(this).val().split('\\').pop());
					$(this).parent().removeClass('placeholder');
				});
			});
		}
		
		
	};
}(jQuery));