var dataWatchList = {};

function dataWatchHandler(e) {
	var keywords = e.keywords;
	
	dataWatchList = _.extend(dataWatchList, keywords);
	
	dataWatchReloader();
}

var dataWatchReloader = _.throttle(function () {
	var keywords, $watch;
	
	keywords = dataWatchList;
	
	dataWatchList = {};
	
	if (!_.isEmpty(keywords)) {
		$watch = $();
	
		_.each(keywords, function (value, key) {
			$watch = $watch.add($(document).find('[data-watch~="' + key + '"]'));
		});
		
		$watch.findControls().reloadControls();
	}
}, 100, { leading: false, trailing: true });

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
}