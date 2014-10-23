$.fn.empty = _.wrap($.fn.empty, function (func) {
	this.each(function (index, target) {
		$(target).find("[data-menu]").each(function (index, elem) {
			var $elem, data;
			
			$elem = $(elem);
			data = $elem.data();
			
			if (data.$menuContent) {
				data.$menuContent.empty().remove();
			}
			
			if (data.$menuSection) {
				if (!data.$menuSection.find(".section-content").children().length) {
					data.$menuSection.empty().remove();
				}
			}
		});
	});
	
	return func.call(this);
});