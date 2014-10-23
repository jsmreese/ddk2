var $document = $(document);

function keywordupdateHandler(e) {
	var keywords = e.keywords;

	if (keywords) {
		_.each(keywords, function (value, key) {
			// data-watch
			$document.find('[data-watch~="' + key + '"]').findControls().reloadControls();
			
			// data-nav-target-keyword
			$document.find('[data-nav-target-keyword~="' + key + '"]').each(function (index, elem) {
				var $elem;
				
				$elem = $(elem);
				
				if ($elem.is("input")) {
					// set value of select2 picker
					if ($elem.data("nav") === "select2") {
						$elem.select2("val", value);
						return;
					}
					
					// set value of checkbox or radio input
					$elem.value = value;
					return;
				}
				
				// set value of date picker inputs
				
				
			});
		});
	}
}

function navGoHandler(e) {
	var $target, $parents, data;
	
	$target = $(e.currentTarget);
	$parents = $target.parents();
	data = $parents.dataStack();
	
	// redirect to the original content container element
	// if element has moved to sidebar via data-menu
	if (data.$menuParent) {
		$parents = data.$menuParent.parents();
	}
	
	// find closest ancestor element that contains controls
	// then call reloadControls on that element
	$parents.each(function (index, elem) {
		var $elem, $controls;
		
		$elem = $(elem);
		$controls = $elem.findControls();
		
		if ($controls.length) {
			$controls.reloadControls();
			$(".exit-off-canvas").click();
			return false;
		}
		
		// stop climbing parents if the main-section element is reached
		if ($elem.hasClass("main-section")) { return false; }
	});
}

if (!DDK.outputPDF) {
	
	$document.on("click", "button.ddk-chart-series-config", DDK.chart.seriesConfig);
	$document.on("click", "input.ddk-color:not(.loaded)", DDK.initColorPicker);
	$document.on("click", "button[data-ddk-dialog]", DDK.dialog);
	$document.on("click", "button[data-ddk-button-action]", DDK.eventHandler);
	$document.on("change keyup", "input[data-ddk-validate], textarea[data-ddk-validate]", DDK.validate);
	$document.on("click", ".ddk-dropdown", DDK.dropdown.show);
	$document.on("click", DDK.dropdown.hide);

	// initialize DDK Mouseovers on initial document content
	$("[data-ddk-mouseover]").each(DDK.mouseover);
	
	$document.on("keywordupdate", keywordupdateHandler);
	$document.on("click", ".nav-go", navGoHandler);
}