DDK.reloadFromFavoriteQueue = [];
DDK.reloadFromFavoriteLoading = false;

DDK.reloadFromFavorite = function (target, favoriteId, callback, beforeInit, beforeReload, unshift) {
	DDK.reloadFromFavoriteQueue[unshift ? "unshift" : "push"]({
		target: target,
		favoriteId: favoriteId,
		callback: callback,
		beforeInit: beforeInit,
		beforeReload: beforeReload
	});
	
	_.defer(function () {
		if (!DDK.reloadFromFavoriteLoading) {
			DDK.reloadFromFavoriteRequest();
		}
	});
};

DDK.reloadFromFavoriteRequest = function () {
	var settings,
		$target,
		dataConfig,
		ajaxSettings;
	
	if (!DDK.reloadFromFavoriteQueue.length) {
		DDK.info("DDK.reloadFromFavoriteQueue is empty.");
		return false;
	}

	settings = DDK.reloadFromFavoriteQueue.shift();
	//$.getJSON("http://rnddeva1.pureshare.com/amengine/amengine.aspx?config.mn=DDK_Data_Request&data.config=%5C%5B%7B%22queryWidget%22%3A%22PSC_Favorites_Record_Query%22%2C%22useCoercedTypes%22%3Afalse%2C%22datasetMode%22%3A%22array%22%2C%22columnPrefix%22%3A%22sci_fav_%22%2C%22shouldCamelizeKeys%22%3Atrue%2C%22keywords%22%3A%22%26ddk.fav.id%3D501%22%7D%2C%7B%22method%22%3A%22renderControlFromFavorite%22%7D%5C%5D", function (data) { var control = data.datasets[1]; $("#layout_content_center").html(DDK.unescape.brackets(control.html)); reloadControlContainer(control.name, control.id, {}); });
	
	dataConfig = [
		{
			queryWidget: "PSC_Favorites_Record_Query",
			columnPrefix: "sci_fav_",
			datasetMode: "array",
			keywords: "&ddk.fav.id=" + settings.favoriteId,
			shouldCamelizeKeys: true,
			useCoercedTypes: false,
		},
		{
			method: "renderControlFromFavorite"
		}
	];
	
	ajaxSettings = {
		type: "POST",
		url: "amengine.aspx",
		dataType: "json",
		data: {
			"config.mn": "DDK_Data_Request"
		},
		success: function (data) {
			var control = data.datasets[1];
			
			$target.empty().html(DDK.unescape.brackets(control.html));
			reloadControlContainer(control.name, control.id, settings, settings.callback, $target.children().eq(0));
			K(control.stateKeywords);
			
			// clear loading status
			DDK.reloadFromFavoriteLoading = false;
			
			return DDK.reloadFromFavoriteRequest();
		}		
	};
	
	// target could be a DOM node, a jQuery selector, or a jQuery collection, or an id string
	$target = $(settings.target);
	if (!$target.size()) { $target = $("#" + settings.target); }

	// exit with a warning if the target cannot be found
	if (!$target.size()) {
		DDK.warn("DDK.reloadFromFavorite() target not found:", settings.target);
		return DDK.reloadFromFavoriteRequest();
	}

	// if there is no favoriteId supplied, check the target for a data-favorite-id attribute
	if (!settings.favoriteId) {
		settings.favoriteId = $target.data("favoriteId");
	}
	
	// Exit with an error if favoriteId does not evaluate to a positive number
	// or is not a name
	if (!(+settings.favoriteId > 0)) {
		if (typeof settings.favoriteId !== "string" || settings.favoriteId === "") {
			DDK.error("DDK.reloadFromFavorite(): invalid favoriteId. " + settings.favoriteId + "\nMust be a positve number or a string.");
			return DDK.reloadFromFavoriteRequest();
		}
	}
	
	// beforeReload
	if (settings.beforeReload && typeof settings.beforeReload === "function") {
		// can't pass controlName and controlId to beforeReload because we don't know them yet
		settings.beforeReload();
	}
	
	ajaxSettings.data["data.config"] = DDK.escape.brackets(JSON.stringify(dataConfig));
	
	// send the global keyword hash
	_.extend(ajaxSettings.data, _.transform(K.toObject(), function (accumulator, value, key) {
		// ignore all state keywords and sec.keywords
		if (key === "sectoken" || _.string.startsWith(key, "s_") || _.string.startsWith(key, "sec.")) {
			return;
		}
		
		accumulator[key] = value;
	}));
	
	// set loading status
	DDK.reloadFromFavoriteLoading = true;


	// get control
	return $.ajax(ajaxSettings);
};

/*
// original reloadFromFavorite
DDK.reloadFromFavorite = function (target, favoriteId, callback, beforeInit, beforeReload) {
	// target could be a DOM node, a jQuery selector, or a jQuery collection
	var $target = $(target),
		dataConfig = {
			queryWidget: "PSC_Favorites_Record_Query",
			useCoercedTypes: false,
			datasetMode: "array"
		},
		ajaxSettings = {
			type: "POST",
			url: "amengine.aspx",
			dataType: "json",
			data: {
				"config.mn": "DDK_Data_Request"
			},
			success: function (data) {
				var dataset = data && data.datasets && data.datasets[0],
					record =  dataset && dataset[0],
					originalControlId = record && record.sci_fav_ext_id3,
					originalFavName = record && record.sci_fav_name.split && record.sci_fav_name.split(","),
					originalFavId = record && record.sci_fav_id,
					originalControlOptions = originalFavName && originalFavName[4],
					originalControlName = originalFavName && originalFavName[3],
					originalFavValue = record && record.sci_fav_value,
					newControlId = originalControlName && originalControlName + originalFavId + "x" + _.uniqueId(),
					newFavValue = originalFavValue && originalFavValue.replace(RegExp(originalControlId, "g"), newControlId),
					newKeys = newFavValue ? newFavValue.split("&") : [],
					dataKeywords = "";

				if (originalFavId && originalControlName && originalControlOptions && newControlId) {
					// parse new favorite value
					// keyword update all state keywords (s_)
					// add all other keywords to the control container's data-keywords attribute
					_.each(newKeys, function (value, index) {
						if (_.string.startsWith(value, "s_")) {
							K(value);
						} else {
							dataKeywords += "&" + value;
						}
					});
					$target.empty().html("<div style='height: 100%; width: 100%;' id='psc_" + originalControlName + "_" + newControlId + "_widget' data-options='" + originalControlOptions + "' data-keywords=\"" + dataKeywords + "\"></div>");
					DDK.reloadControl(originalControlName, newControlId, callback, beforeInit, beforeReload);
				} else {
					DDK.error("DDK.reloadFromFavorite(): cannot parse favorite id " + favoriteId);
				}                        
			}
		};

	// target could be an id string
	if (!$target.size()) { $target = $("#" + target); }

	// exit with a warning if the target cannot be found
	if (!$target.size()) {
		DDK.warn("DDK.reloadFromFavorite(): target not found.");
		return;
	}

	// if there is no favoriteId supplied, check the target for a data-favorite-id attribute
	if (!favoriteId) {
		favoriteId = $target.data("favoriteId");
	}
	
	// Exit with an error if favoriteId does not evaluate to a positive number
	// or is not a name
	if (!(+favoriteId > 0)) {
		if (typeof favoriteId !== "string" || favoriteId === "") {
			DDK.error("DDK.reloadFromFavorite(): invalid favoriteId. " + favoriteId + "\nMust be a positve number or a string.");
			return;
		}
	}
	
	// use keyword ddk.fav.id for favoriteId
	ajaxSettings.data["ddk.fav.id"] = favoriteId;
	ajaxSettings.data["data.config"] = JSON.stringify(dataConfig);
	
	// get favorite data
	$.ajax(ajaxSettings);
};
*/

/* Ray's reloadFromFavorite
DDK.reloadFromFavorite = function (target, favoriteId, callback, beforeInit, beforeReload) {
	// target could be a DOM node, a jQuery selector, or a jQuery collection
	var $target = $(target),
		ajaxSettings = {
			type: "POST",
			url: "amengine.aspx",
			dataType: "json",
			data: {
				"config.mn": "DDK_Control_Data_Request"
			},
			success: function (data) {
				var control = data && data.controls && data.controls[0],
				    errorMessage = data && data.errorMessage,
				    controlContainerId = control && control.controlContainerId,
				    controlName = control && control.controlName,
				    controlId = control && control.controlId,
				    controlOptions = control && control.controlOptions,
				    $control = $("#" + controlContainerId),
				    controlHtml = (control && control.controlHtml)? _.unescape(control.controlHtml) : "",
				    controlFavVal = control && control.controlFavValue,
				    controlData = $control.data() || {},
				    options,
				    containerWidth = $control.width(),
				    containerHeight = $control.height();
					
				if (errorMessage) {
					DDK.error("AMEngine Server JavaScript Error: ", errorMessage);
				} 
				else if ($control.size()) {
					// initialize custom control options object
					DDK[controlName].data[controlId] = DDK[controlName].data[controlId] || {};
					// cache options for this function
					options = DDK[controlName].data[controlId];

					// cache the callback, beforeInit, and beforeReload functions
					// to custom control options, or grab them from custom control options
					// if they are not passed to this function
					if (callback) {
						DDK[controlName].data[controlId].callback = callback;
					} else if (options.callback) {
						callback = options.callback;
					}
					if (beforeInit) {
						DDK[controlName].data[controlId].beforeInit = beforeInit;
					} else if (options.beforeInit) {
						beforeInit = options.beforeInit;
					}
					if (beforeReload) {
						DDK[controlName].data[controlId].beforeReload = beforeReload;
					} else if (options.beforeReload) {
						beforeReload = options.beforeReload;
					}
					// if using data-aspect-ratio, set control container height based on the width
					if (controlData.aspectRatio) {
						containerHeight = containerWidth / controlData.aspectRatio;
						$control.height(containerHeight);
					}

					DDK.defer(function () {
						var subTarget = "psc_" + controlName + "_" + controlId + "_widget",
						    //add class attr if controlName = table to fix issue when resizing window
						    divHtml = "<div style='height: 100%; width: 100%;' id='" + subTarget + "' data-options='" + controlOptions + "' data-keywords=\"" + controlFavVal + "\" " + (controlName === "table"? " class='ps-content-row'" : "") + "></div>";
						hideMask(target);
						$("body").children(".ps-tooltip-dialog").not(".ddk-dialog-persist").remove();
						$target.empty().html(divHtml).find("#"+subTarget).html(controlHtml);

						reloadControlContainer(controlName, controlId, options, callback, $control);
					});
				}
			}
		};

	// target could be an id string
	if (!$target.size()) { $target = $("#" + target); }

	// exit with a warning if the target cannot be found
	if (!$target.size()) {
		DDK.warn("DDK.reloadFromFavorite(): target not found.");
		return;
	} else if (!$target.isControl()) {
		DDK.warn("DDK.reloadFromFavorite(): target is not a control element.");
		return;
	}

	// if there is no favoriteId supplied, check the target for a data-favorite-id attribute
	if (!favoriteId) {
		favoriteId = $target.data("favoriteId");
	}
	
	// Exit with an error if favoriteId does not evaluate to a positive number
	// or is not a name
	if (!(+favoriteId > 0)) {
		if (typeof favoriteId !== "string" || favoriteId === "") {
			DDK.error("DDK.reloadFromFavorite(): invalid favoriteId. " + favoriteId + "\nMust be a positve number or a string.");
			return;
		}
	}
	
	// use keyword ddk.fav.id for favoriteId
	ajaxSettings.data["ddk.fav.id"] = favoriteId;

	//include K.toObject values to ajaxSettings.data
	_.each(_.omit(K.toObject(), function (value, key) { 
		return _.string.startsWith(key, "sec.") || (_.string.startsWith(key, "s_")); 
	}), function(value, key) {
		if (key !== "table_id" && key !=="scorecard_id")
			ajaxSettings.data[key] = value;
	});

	// get favorite data
	$.ajax(ajaxSettings);
}
*/

DDK.reloadControl = function (controlName, controlId, callback, beforeInit, beforeReload, keywords) {
	var controlTitle = _.string.capitalize(controlName),
		controlContainerId = "psc_" + controlName + "_" + controlId + "_widget",
		options,
		$control = $("#" + controlContainerId),
		controlData = $control.data() || {},
		re = new RegExp(controlId,'g'),
		containerHeight,
		containerWidth,
		request = $.Deferred();
		
	// register error if controId contains any uppercase characters or underscore characters
	if (!/^[a-z][a-z0-9]*$/.test(controlId)) {
		DDK.error("Invalid control id: " + controlId + "\n" + 
			"Control ids should begin with a lowercase letter and should contain only numbers and lowecase letters.\n" + 
			"Uppercase letters and underscore characters will cause errors in many control interactions.");
	};

	// initialize custom control options object
	DDK[controlName].data[controlId] = DDK[controlName].data[controlId] || {};
	// cache options for this function
	options = DDK[controlName].data[controlId];

	// cache the callback, beforeInit, and beforeReload functions
	// to custom control options, or grab them from custom control options
	// if they are not passed to this function
	if (callback) {
		DDK[controlName].data[controlId].callback = callback;
	} else if (options.callback) {
		callback = options.callback;
	}
	if (beforeInit) {
		DDK[controlName].data[controlId].beforeInit = beforeInit;
	} else if (options.beforeInit) {
		beforeInit = options.beforeInit;
	}
	if (beforeReload) {
		DDK[controlName].data[controlId].beforeReload = beforeReload;
	} else if (options.beforeReload) {
		beforeReload = options.beforeReload;
	}

	// if a control container is found, load the control
	// else, warn that the container is not found
	if ($control.size()) {
		DDK.pdfCount += 1;
		
		containerWidth = $control.width();
		containerHeight = $control.height();
		
		// if using data-aspect-ratio, set control container height based on the width
		if (controlData.aspectRatio) {
			containerHeight = containerWidth / controlData.aspectRatio;
			$control.height(containerHeight);
		}

		K({
			id: controlId,
			init_widget: K("s_" + controlId + "_iw") || K(controlName + "__" + controlId + "_init_widget") || controlData.options,
			container_height: options.height || containerHeight || 0,
			container_width: options.width || containerWidth || 0
		}, controlName + "_");

		if (controlName === "bamset" || controlName === "scorecard") {
			K("s_" + controlId + "_mdt", K("s_" + controlId + "_mdt") || JSON.stringify(
				$.extend(true, {}, DDK.template.metricDisplay, (options.customMetricDisplayTemplate) || {})
			).replace(/'/g, "\\'").replace(/"/g, "'"));
		}

		// grab the data-keywords from the control container, and merge them
		// into any existing `s_<id>_keywords` keyword value
		var oldKeys = _.zipObject(_.map(decodeURIComponent(K("s_" + controlId + "_keywords") || "").split("&"), function (value) {
			return value.split("=");
		}));

		var newKeys = _.zipObject(_.map(controlData.keywords ? controlData.keywords.split("&") : [], function (value) {
		  var pair = value.split("=");
		  return [ pair[0], decodeURIComponent(pair[1]) ];
		}));

		K("s_" + controlId + "_keywords", _.reduce(_.extend({}, oldKeys, newKeys), function (memo, value, key) {
			return memo + (key ? "&" + key + "=" + (value ? encodeURIComponent(value) : "") : "");
		}, ""));

		$("body").children(".ps-tooltip-dialog").not(".ddk-dialog-persist").remove();

		if (typeof options.beforeReload === "function") {
			options.beforeReload(controlName, controlId);
		}
		run(controlContainerId, "PSC_" + controlTitle + "_Widget", keywords, function (data, header, id) {
			reloadControlContainer(controlName, controlId, options, callback, $control);
		}, { 
			stateFilter: "s_" + controlId + "_",
			requestId: _.uniqueId(),
			requestState: request
		});
		
		return request;
	}
	
	DDK.warn(controlTitle + " Control Reload: " + controlId + " not found.");
	return request.reject();
};
