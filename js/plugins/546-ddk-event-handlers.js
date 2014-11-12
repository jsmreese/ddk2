var $document = $(document);

function keywordupdateHandler(e) {
	var keywords = e.keywords;

	if (keywords) {
		_.each(keywords, function (value, key) {
			// data-watch
			$document.find('[data-watch~="' + key + '"]').findControls().reloadControls();
			
			// data-nav-target-keyword
			$document.find('[data-nav-target-keyword~="' + key + '"]').each(function (index, elem) {
				var $elem, targetKeywords, $dateType, $dateStart, $dateEnd, $dateAltStart, $dateAltEnd, year, month, rawValue;
				
				$elem = $(elem);
				
				if ($elem.is("input")) {
					// if the input value matches the new keyword value already
					// then do nothing
					if ($elem.val() === value) { return; }
				
					// set value of select2 picker
					if ($elem.data("nav") === "select2" && (!$elem.data("navEmptyKeywordValue") || $elem.data("navEmptyKeywordValue") !== value)) {
						// select2 in multiselect mode expects an array of values
						if ($elem.data("navMultiple")) {
							$elem.select2("val", (value || "").split(","));
							return;
						}
						
						$elem.select2("val", value).trigger("change", true);
						return;
					}
					else{
						// set value of checkbox or radio input
						$elem.value = value;
						return;
					}
				}
				else if ($elem.is("div")) {
					// set value of date picker inputs
					targetKeywords = $elem.data("nav-target-keyword").split(" ");
					$dateType = $elem.find(".nav-date-type:visible");
					$dateStart = $elem.find(".nav-date-start");
					$dateEnd = $elem.find(".nav-date-end");
					$dateAltStart = $($dateStart.data("altField"));
					$dateAltEnd = $($dateEnd.data("altField"));
					rawValue = value;
					//check if value is a quarter and process to use first month of the quarter
					if(value.indexOf("-Q") > -1){
						year = value.substr(0, value.indexOf("-"));
						month = value.substr(value.indexOf("Q") + 1) * 3 - 2;
						value = year + "-" + month;
					}
					if(targetKeywords.indexOf(key) === 2){
						// if the input value matches the new keyword value already
						// then do nothing
						if ($dateAltEnd.val() === value) { return; }
						
						//settings second param to true will prevent keyword update on change
						$dateEnd.datepicker("setDate", moment(value).toDate()).trigger("change", true);
						$dateAltEnd.val(rawValue);

					//	$dateStart.datepicker("option", "maxDate", value);
					}
					else if(targetKeywords.indexOf(key) === 1){
						if($dateType.length){
							// if the input value matches the new keyword value already
							// then do nothing
							if ($dateAltStart.val() === value) { return; }
						
							$dateStart.datepicker("setDate", moment(value).toDate()).trigger("change", true);
							$dateAltStart.val(rawValue);

					//		$dateEnd.datepicker("option", "minDate", value);
						}
						else{
							// if the input value matches the new keyword value already
							// then do nothing
							if ($dateEnd.val() === value) { return; }

							$dateEnd.datepicker("setDate", moment(value).toDate()).trigger("change", true);
							$dateAltEnd.val(rawValue);

					//		$dateStart.datepicker("option", "maxDate", value);
						}
					}
					else if(targetKeywords.indexOf(key) === 0){
						if($dateType.length){
							// if the input value matches the new keyword value already
							// then do nothing
							if ($dateType.val() === value) { return; }

							$dateType.val(value).trigger("change", true);
						}
						else{
							// if the input value matches the new keyword value already
							// then do nothing

							if ($dateAltStart.val() === value) { return; }
						
							$dateStart.datepicker("setDate", moment(value).toDate()).trigger("change", true);
							$dateAltStart.val(rawValue);

					//		$dateEnd.datepicker("option", "minDate", value);
						}
					}
				}
			});
		});
	}
}

function navGoHandler(e) {
	var $target, $controls;
	
	$target = $(e.currentTarget);
	$controls = $target.closestControlGroup();
	
	$controls.reloadControls();
	$(".exit-off-canvas").click();
}

function favOpenHandler(e) {
	var $target;
	
	$target = $(e.currentTarget);
	
	window.open("amengine.aspx?config.mn=" + $target.data("target") + $target.data("keywords"));
}

/*
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
*/
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
	
	$document.on("click", ".fav-open button", favOpenHandler);
}