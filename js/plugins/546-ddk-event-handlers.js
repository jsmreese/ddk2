function dataWatchHandler(e) {
	var keywords = e.keywords;

	if (keywords) {
		_.each(keywords, function (value, key) {
			$(document).find('[data-watch~="' + key + '"]').findControls().reloadControls();
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
	if (data.$elem) {
		$parents = data.$elem.parents();
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
	});
}

if (!DDK.outputPDF) {
	var $document = $(document);
	
	$document.on("click", "button.ddk-chart-series-config", DDK.chart.seriesConfig);
	$document.on("click", "input.ddk-color:not(.loaded)", DDK.initColorPicker);
	$document.on("click", "button[data-ddk-dialog]", DDK.dialog);
	$document.on("click", "button[data-ddk-button-action]", DDK.eventHandler);
	$document.on("change keyup", "input[data-ddk-validate], textarea[data-ddk-validate]", DDK.validate);
	$document.on("click", ".ddk-dropdown", DDK.dropdown.show);
	$document.on("click", DDK.dropdown.hide);

	// initialize DDK Mouseovers on initial document content
	$("[data-ddk-mouseover]").each(DDK.mouseover);
	
	$document.on("keywordupdate", dataWatchHandler);
	$document.on("click", ".nav-go", navGoHandler);
}