function fixColumnSizing(selector) {
	var   $widget = $(selector)
		, $scroll = $widget.find('.dataTables_scroll')
		, scrollWidth = $scroll.width()
		, $head = $scroll.find('.dataTables_scrollHead table')
		, $body = $scroll.find('.dataTables_scrollBody table')
		, $foot = $scroll.find('.dataTables_scrollFoot table');

	// console.log(selector + '  PRE: ', $widget.width(), scrollWidth, $head.width(), $body.width());

	if (scrollWidth >= ($head.width() - (oldIE ? 20 : 0))) {
		// bumped this from 17px to 22px in DDK 1.9.2 final
		$head.width(scrollWidth - 22);
		$body.width(scrollWidth - 22);
		$foot.width(scrollWidth - 22);
	}

	// console.log(selector + '  POST: ', $widget.width(), scrollWidth, $head.width(), $body.width(), (scrollWidth >= $head.width()));

}

function PSC_Chart_Resize(id, forceResize) {
	var options = DDK.chart.data[id] = DDK.chart.data[id] || {};

	var $control = $("#psc_chart_" + id + "_widget"),
		contentBlock = $control.hasClass("ps-content-block"),
		controlHeight = (contentBlock ? $control.height() : 0),
		controlWidth = (contentBlock ? $control.width(): 0),
		isOverResizeThreshold,
		aspectRatio = $control.data("aspectRatio"),
		oldControlHeight,
		oldControlWidth,
		scaleFactor,
		$chartImage,
		$chartImageMap,
		oldImageWidth,
		oldImageHeight,
		data = $('#psc_chart_data_' + id).data() || {},
		scp = data.scp,
		$table = $control.find("#" + id + "_datatable"),
		chartType = (((typeof data.type === "string") && data.type) ? data.type : "column"),
		isVertical = (chartType.indexOf("pie") === -1) && (chartType.indexOf("doughnut") === -1) && (chartType.indexOf("bar") === -1),
		$seriesConfig,
		seriesConfigWidth;

	// if using data-aspect-ratio, set control container height based on the width
	if (aspectRatio) {
		oldControlHeight = $control.height();
		controlWidth = $control.width();
		controlHeight = controlWidth / aspectRatio;
		oldControlWidth = oldControlHeight * aspectRatio;
		$control.height(controlHeight);

		DDK.chart.data[id].height = controlHeight;
		DDK.chart.data[id].width = controlWidth;
		
		// scale chart image based on % change in height
		// account for series config width if it's on the right or left
		$seriesConfig = $control.find("#psc_chart_" + id + "_series_config");
		if ($seriesConfig.length && (scp === "right" || scp === "left")) {
			seriesConfigWidth = $seriesConfig.outerWidth(true);
			scaleFactor = (controlWidth - seriesConfigWidth) / (oldControlWidth - seriesConfigWidth);
		} else {
			scaleFactor = controlHeight / oldControlHeight;
		}
		$chartImage = $control.find(".ddk-chart-container").find("img");
		oldImageWidth = $chartImage.width();
		oldImageHeight = $chartImage.height();
		
		$chartImage.width(oldImageWidth * scaleFactor);
		$chartImage.height(oldImageHeight * scaleFactor);
		
		// scale image map coordinates
		$chartImageMap = $control.find(".ddk-chart-container").find("map");
		$chartImageMap.scaleAreas(scaleFactor);
		
		// resize datatable
		$table.size() && isVertical && DDK.chart.resizeDatatable($table, $chartImageMap, isVertical);
		
		DDK.chart.data[id].updateImage();

		return;
	};

	options.height = options.height ? options.height : 0;
	options.width = options.width ? options.width : 0;

	// !options || Math.abs(options.width - controlWidth) > 150 || Math.abs(options.height - controlHeight) > 150
	if (options) {
		//console.log("Width:", options.width, controlWidth, options.width - controlWidth);
		//console.log("Height:", options.height, controlHeight, options.height - controlHeight);
		isOverResizeThreshold = (
			// getting smaller -- smallest threshold, allows for download bar in Chrome without a resize (52px)
			((options.width - controlWidth) > 60) ||
			((options.height - controlHeight) > 60) ||
			// getting bigger -- medium threshold on height, large threshold on width
			((options.width - controlWidth) < -150) ||
			((options.height - controlHeight) < -80)
		);
	} else {
		isOverResizeThreshold = true;
	}

	if ( forceResize || isOverResizeThreshold) {
		DDK.chart.data[id].height = controlHeight;
		DDK.chart.data[id].width = controlWidth;

		if (PS.app && PS.app.forceReload) {
				PS.app.forceReload();
		}
	
		DDK.loadControls({
			name: "chart",
			id: id
		});
		// PSC_Chart_Reload(id)
	}
}