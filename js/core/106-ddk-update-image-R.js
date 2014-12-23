DDK.chart.updateImage = function (controlId) {
	var controlName = "chart",
		controlTitle = _.string.capitalize(controlName),
		controlContainerId = "psc_" + controlName + "_" + controlId + "_widget",
		$control = $("#" + controlContainerId),
		$controlImageContainer = $("#" + controlId).children("span"),
		controlData = $control.controlData() || {},
		type = controlData.type,
		re = new RegExp(controlId,'g'),
		containerWidth,
		chartType = (((typeof type === "string") && type) ? type : "column"),
		isVertical = (type.indexOf("pie") === -1) && (type.indexOf("doughnut") === -1) && (type.indexOf("bar") === -1);

	// if a control container is found, load the control
	// else, warn that the container is not found
	if ($control.size()) {
	
		containerWidth = $control.width();

		K({
			id: controlId,
			init_widget: K("s_" + controlId + "_iw") || K(controlName + "__" + controlId + "_init_widget") || controlData.options,
			container_width: containerWidth
		}, controlName + "_");

		// grab the data-keywords from the control container, and merge them
		// into any existing `s_<id>_keywords` keyword value
		var oldKeys = _.string.parseQueryString(K("s_" + controlId + "_keywords") || "");

		var newKeys = _.string.parseQueryString(controlData.keywords || "");
		
		K("s_" + controlId + "_keywords", _.reduce(_.extend({}, oldKeys, newKeys), function (memo, value, key) {
			//return memo + (key ? "&" + key + "=" + (value ? encodeURIComponent(value) : "") : "");
			return memo + (key ? "&" + key + "=" + (value != null ? encodeURIComponent(value.toString()) : "") : "");
		}, ""), { silent: true });

		DDK.log("Updating chart image: " + controlId);				

		load("", "PSC_" + controlTitle + "_Widget", null, function (data, header, id) {
			var $data = $(data),
				$container = $data.find("#" + controlId).children("span"),
				$img = $container.find("img"),
				$table,
				$map;
			
			if ($img.get(0)) {
				$img.get(0).onload = function (e) {
					// put new chart image and map in the DOM
					$controlImageContainer.replaceWith($container);
					
					// initialize DDK Mouseovers
					$container.find("[data-ddk-mouseover]").each(DDK.mouseover);
					
					// adjust data-width and data-height
					$container.parents(".ps-chart").data("width", $img.width()).data("height", $img.height());
					
					// resize chart datatable
					$table = $control.find("#" + controlId + "_datatable");
					$map = $container.find("#" + controlId + "_imageImageMap");
					$table.size() && isVertical && DDK.chart.resizeDatatable($table, $map, isVertical);
			
					DDK.log("Updated chart image: " + controlId);				
				};
				
				$img.get(0).onerror = function (e) {
					DDK.warn("Chart Control resize error: unable to update chart image for control " + controlId);
				};
			} else {
				DDK.error("Chart Control resize error: image not found.");
			}
		}, { 
			stateFilter: "s_" + controlId + "_"
		});

	} else {
		DDK.warn(controlTitle + " DDK.chart.updateImage: " + controlId + " not found.");
	}
};