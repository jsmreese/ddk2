function fixColumnSizing() {}

function PSC_Chart_Resize(id, forceResize) {
	var options = DDK.chart.data[id] = DDK.chart.data[id] || {};

	var $control = $("#psc_chart_" + id + "_widget"),
		data = $control.controlData(),
		originalHeight = data.height,
		originalWidth = data.width,
		width = $control.width(),
		scaleFactor,
		$chartImage,
		$chartImageMap,
		scp = data.scp,
		$table = $control.find("#" + id + "_datatable"),
		chartType = (((typeof data.type === "string") && data.type) ? data.type : "column"),
		isVertical = (chartType.indexOf("pie") === -1) && (chartType.indexOf("doughnut") === -1) && (chartType.indexOf("bar") === -1),
		$seriesConfig,
		seriesConfigWidth;
		
	// scale chart image based on % change in height
	// account for series config width if it's on the right or left
	$seriesConfig = $control.find("#psc_chart_" + id + "_series_config");
	if ($seriesConfig.length && (scp === "right" || scp === "left")) {
		seriesConfigWidth = $seriesConfig.outerWidth(true);
		scaleFactor = (width - seriesConfigWidth) / (originalWidth - seriesConfigWidth);
	} else {
		scaleFactor = width / originalWidth;
	}
	
	$chartImage = $control.find(".ddk-chart-container").find("img");
	
	$chartImage.width(originalWidth * scaleFactor);
	$chartImage.height(originalHeight * scaleFactor);
	
	// scale image map coordinates
	$chartImageMap = $control.find(".ddk-chart-container").find("map");
	$chartImageMap.scaleAreas(scaleFactor, true);
	
	// resize datatable
	$table.size() && isVertical && DDK.chart.resizeDatatable($table, $chartImageMap, isVertical);
	
	// cache initial scale factor
	if (!DDK.chart.data[id].scaleFactor) {
		DDK.chart.data[id].scaleFactor = scaleFactor;
	}
	
	if (Math.abs(DDK.chart.data[id].scaleFactor - scaleFactor) > 0.1) {
		// cache scale factor
		DDK.chart.data[id].scaleFactor = scaleFactor;
		DDK.chart.data[id].updateImage();
	}
}