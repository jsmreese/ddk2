DDK.reloadFromFavoriteQueue = [];
DDK.reloadFromFavoriteLoading = false;

// new function signatures:
// DDK.reloadFromFavorite(target, id , settings)
// DDK.reloadFromFavorite(settings)
// old function signature still works:
// DDK.reloadFromFavorite(target, favoriteId, callback, beforeInit, beforeReload, unshift, favHeader, favFooter, keywords)
DDK.reloadFromFavorite = function (target, favoriteId, callback, beforeInit, beforeReload, unshift, favHeader, favFooter, keywords, newState, showMask, error) {
	var $target, args, settings;
	
	// parse arguments
	args = [].slice.call(arguments);
	if (args.length < 4) {
		// might be using the new settings object
		if (_.isPlainObject(target)) {
			settings = target;
			target = settings.target;
		} else if (_.isPlainObject(callback)) {
			settings = callback;
		}
		
		if (settings) {
			callback = settings.success;
			beforeInit = settings.beforeInit;
			beforeReload = settings.beforeReload;
			unshift = settings.unshift;
			favHeader = settings.favHeader;
			favFooter = settings.favFooter;
			keywords = settings.keywords;
			newState = settings.state;
			// can use id or name properties in settings to set favoriteId
			favoriteId = favoriteId || settings.id || settings.name;
			showMask = (settings.showMask == null ? true : settings.showMask);
			error = settings.error;
		}
	}
	
	if (!settings) {
		showMask = (showMask == null ? true : showMask);
	}

	// target could be a DOM node, a jQuery selector, or a jQuery collection, or an id string
	$target = $.target(target);

	// exit with a warning if the target cannot be found
	if (!$target.size()) {
		DDK.warn("DDK.reloadFromFavorite() target not found:", target);
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

	if (showMask) {
		$target.am("showmask");
	}

	DDK.reloadFromFavoriteQueue[unshift ? "unshift" : "push"]({
		$target: $target,
		id: favoriteId,
		success: callback,
		beforeInit: beforeInit,
		beforeReload: beforeReload,
		favHeader: favHeader,
		favFooter: favFooter,
		keywords: keywords,
		state: newState,
		showMask: showMask,
		error: error
	});
	
	_.defer(function () {
		if (!DDK.reloadFromFavoriteLoading) {
			DDK.reloadFromFavoriteRequest();
		}
	});
};

DDK.reloadFromFavoriteRequest = function () {
	var settings,
		dataConfig,
		ajaxSettings;
	
	if (!DDK.reloadFromFavoriteQueue.length) {
		DDK.log("DDK.reloadFromFavoriteQueue is empty.");
		
		// execute keyword has garbage cleanup
		// to remove orphaned state keywords
		K.GC();
		return false;
	}

	settings = DDK.reloadFromFavoriteQueue.shift();
	//$.getJSON("http://rnddeva1.pureshare.com/amengine/amengine.aspx?config.mn=DDK_Data_Request&data.config=%5C%5B%7B%22queryWidget%22%3A%22PSC_Favorites_Record_Query%22%2C%22useCoercedTypes%22%3Afalse%2C%22datasetMode%22%3A%22array%22%2C%22columnPrefix%22%3A%22sci_fav_%22%2C%22shouldCamelizeKeys%22%3Atrue%2C%22keywords%22%3A%22%26ddk.fav.id%3D501%22%7D%2C%7B%22method%22%3A%22renderControlFromFavorite%22%7D%5C%5D", function (data) { var control = data.datasets[1]; $("#layout_content_center").html(DDK.unescape.brackets(control.html)); reloadControlContainer(control.name, control.id, {}); });
	
	dataConfig = [
		{
			queryWidget: "PSC_Favorites_Record_Query_" + (_.isNaN(+settings.id) ? "Name" : "Id"),
			columnPrefix: "sci_fav_",
			datasetMode: "array",
			keywords: "&ddk_fav_id=" + settings.id,
			shouldCamelizeKeys: true,
			useCoercedTypes: false,
			escapeMode: "keyword",
			datasetKey: "fav"
		},
		{
			method: "runFavHeader",
			keywords: settings.favHeader
		},
		{
			method: "runFavFooter",
			keywords: settings.favFooter
		},
		{
			method: "runFav"
		}
	];

	ajaxSettings = {
		type: "POST",
		url: "amengine.aspx",
		dataType: "json",
		data: {
			"config.mn": "DDK_Data_Request",
			"chart_container_width": settings.$target.width()
		},
		error: function (xhr, status, message) {
			// clear loading status
			DDK.reloadFromFavoriteLoading = false;
			DDK.error("Error loading favorite (Request Error).", status, message);

			$.jGrowl("Error Loading Favorite", { themeState: "error" });
			
			if (typeof settings.error === "function") {
				settings.error(xhr, status, message, settings);
			}

			if (DDK_DEBUG) {
				settings.$target.empty().html(DDK.errorLog("Error Loading Favorite", ["name / id", settings.id], ["status", status], ["message", message])
				);
			}
				
			return DDK.reloadFromFavoriteRequest();			
		},
		success: function (data, status, xhr) {
			var control, favHeader, favFooter, controlFavorite, type,
				$controlLabel, $controlNotes, $controlDescription;
			
			if (settings.showMask) {
				settings.$target.am("hidemask");
			}

			// clear loading status
			// do this up here so if there is a JavaScript error in control init, it won't prevent future fav loading
			DDK.reloadFromFavoriteLoading = false;
						
			if (data.apiResult === "ERROR") {
				DDK.error("Error loading favorite (DRF Error).");
				
				$.jGrowl("Error Loading Favorite", { themeState: "error" });
				
				if (typeof settings.error === "function") {
					settings.error(xhr, "drferror", data.errorMessage, settings);
				}
				
				if (DDK_DEBUG) {
					settings.$target.empty().html(DDK.errorLog("Error Loading Favorite", ["name / id", settings.id], ["status", "drferror"], ["message", data.errorMessage]));
				}
			} else {
				control = data.datasets[3];
				favHeader = data.datasets[1];
				favFooter = data.datasets[2];
				controlFavorite = data.datasets[0][0];
				type = controlFavorite.typeLabel;
				
				settings.$target.removeAttr("data-fav").empty().html(DDK.unescape.brackets((favHeader + control.html + favFooter)));
				
				DDK.navFormat(settings.$target);
				DDK.format(settings.$target);
				
				// show export CSV icons in Favorite headers
				toggleCSV();
				
				// initialize Prism.js syntax highlighting
				Prism && Prism.highlightAll();
				
				if (control.stateKeywords) {
					K(control.stateKeywords);
				}
				
				if (type === "Component") {
					reloadControlContainer(control.name, control.id, settings, settings.success, settings.$target.children().eq(0));
				} else {
					if (typeof settings.success === "function") {
						settings.success.call(null, data, status, xhr);
					}
				}

				// trigger screenchange event to update menu framework content
				$document.trigger("screenchange", [DDK.screenSize()]);
				
				// trigger window resize to update responsive block height classes
				$(window).trigger("resize");
				
				// execute runFavs on just-loaded content
				runFavs(settings.$target);
			}
			
			return DDK.reloadFromFavoriteRequest();
		}
	};
		
	// beforeReload
	if (settings.beforeReload && typeof settings.beforeReload === "function") {
		// can't pass controlName and controlId to beforeReload because we don't know them yet
		settings.beforeReload();
	}
	
	ajaxSettings.data["data.config"] = DDK.escape.brackets(JSON.stringify(dataConfig));
	
	// send the global keyword hash
	// ignoring all state keywords and sec.keywords
	_.extend(ajaxSettings.data, _.transform(K.toObject(), function (accumulator, value, key) {
		if (key === "sectoken" || _.string.startsWith(key, "s_") || _.string.startsWith(key, "sec.")) {
			return;
		}
		
		accumulator[key] = value;
	}));
	
	// send any request-specific keywords values
	if (settings.keywords) {
		if (typeof settings.keywords === "string") {
			_.extend(ajaxSettings.data, _.string.parse(settings.keywords));
		} else {
			_.extend(ajaxSettings.data, settings.keywords);
		}
	}

	// send any new state values
	if (settings.state) {
		if (typeof settings.state === "string") {
			_.extend(ajaxSettings.data, { component_state: settings.state });
		} else {
			_.extend(ajaxSettings.data, { component_state: $.param(settings.state) });
		}
	}
	
	// set loading status
	DDK.reloadFromFavoriteLoading = true;
	DDK.log("Loading control from favorite:", settings);

	// get control
	return $.ajax(ajaxSettings);
};

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
			container_height: containerHeight || options.height || 0,
			container_width: containerWidth || options.width || 0,
			container_block: (options.isBlock ? "true" : "false")
		}, controlName + "_");

		if (controlName === "bamset" || controlName === "scorecard") {
			K("s_" + controlId + "_mdt", K("s_" + controlId + "_mdt") || JSON.stringify(
				$.extend(true, {}, DDK.template.metricDisplay, (options.customMetricDisplayTemplate) || {})
			).replace(/'/g, "\\'").replace(/"/g, "'"));
		}

		// grab the data-keywords from the control container, and merge them
		// into any existing `s_<id>_keywords` keyword value
		var oldKeys = _.string.parseQueryString(K("s_" + controlId + "_keywords") || "");

		var newKeys = _.string.parseQueryString(controlData.keywords || "");

		K("s_" + controlId + "_keywords", _.reduce(_.extend({}, oldKeys, newKeys), function (memo, value, key) {
			//return memo + (key ? "&" + key + "=" + (value ? encodeURIComponent(value) : "") : "");
			return memo + (key ? "&" + key + "=" + (value != null ? encodeURIComponent(value.toString()) : "") : "");
		}, ""), { silent: true });

		$("body").children(".ps-tooltip-dialog").not(".ddk-dialog-persist").remove();

		if (typeof options.beforeReload === "function") {
			options.beforeReload(controlName, controlId);
		}
		run(controlContainerId, "PSC_" + controlTitle + "_Widget", keywords, function (data, header, id) {
			reloadControlContainer(controlName, controlId, options, callback, $control);
			// show export CSV icons in Favorite headers
			toggleCSV();
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

function reloadControlContainer(controlName, controlId, options, callback, $control) {
	var $controlDebugOutput,
		$controlDebug,
		beforeInit,
		beforeReload;

	// create a control data object if one does not already exist
	DDK[controlName].data[controlId] = DDK[controlName].data[controlId] || {};
		
	// cache the callback, beforeInit, and beforeReload functions
	// to custom control options, or grab them from custom control options
	// if they are not passed to this function
	if (callback) {
		DDK[controlName].data[controlId].callback = callback;
	} else if (options.callback) {
		DDK[controlName].data[controlId].callback = callback = options.callback;
	}
	if (options.beforeInit) {
		DDK[controlName].data[controlId].beforeInit = beforeInit = options.beforeInit;
	}
	if (options.beforeReload) {
		DDK[controlName].data[controlId].beforeReload = beforeReload = options.beforeReload;
	}
		
	if (typeof options.beforeInit === "function") {
		options.beforeInit(controlName, controlId);
	}
	DDK[controlName].init(controlId);
	if (typeof callback === "function") {
		callback(controlName, controlId);
	}

	if (_.string.toBoolean(K("control_debug"))) {
		$controlDebug = $control.find(".control-debug");
		$controlDebugOutput = $("body").find("#control_debug");
		
		$controlDebugOutput.text("");
		$controlDebug.children().each(function (index, elem) {
			var $elem = $(elem);
			$controlDebugOutput.text(function (textIndex, text) {
				return text + (index ? "\n\n\n\n" : "") + "--------------------\n" + $elem.attr("title") + "\n--------------------\n\n" + $elem.text();
			});
		});
	}
}

var runFromFavorite = function (target, favId, keywords, favHeader, favFooter, newState, showMask, error) {
	if (_.isPlainObject(target)) {
		DDK.reloadFromFavorite(target);
		return;
	}
	
	if (_.isPlainObject(keywords)) {
		// could be keywords to be sent or could be a settings object
		// check for settings properties:
		// success, beforeInit, beforeReload, unshift, favHeader, favFooter, keywords, state, showMask, error
		if (_.intersection(_.keys(keywords), "success beforeInit beforeReload unshift favHeader favFooter keywords state showMask error".split(" ")).length) {
			DDK.reloadFromFavorite(target, favId, keywords);
			return;
		}
	}
	
	if (typeof keywords === "function") {
		DDK.reloadFromFavorite(target, favId, keywords, null, null, null, favHeader, favFooter, null, newState, showMask, error);
		return;
	}

	if (typeof keywords === "boolean") {
		newState = favFooter;
		favFooter = favHeader;
		favHeader = keywords;
		keywords = "";
	}
	
	DDK.reloadFromFavorite(target, favId, null, null, null, null, favHeader, favFooter, keywords, newState, showMask, error);
};

var runFav = runFromFavorite;

function runFavs(target) {
	var $target = $.target(target, document),
		$elems;
	
	// init child controls
	// that were server-rendered via `serverRender: true` in a content favorite
	$elems = $target.find("[data-fav-init]").addBack("[data-fav-init]");
	$elems.findControls().initControls();
	$elems.removeAttr("data-fav-init").data("favInit", null);
	
	// run child favs
	// find all descendant elements that have a data-fav attribute
	// and also include the target element if it has a data-fav attribute
	$elems = $target.find("[data-fav]").addBack("[data-fav]");
	
	$elems.each(function (index, elem) {
		var $elem = $(elem),
			data = $elem.data(),
			dataStack = $elem.dataStack(),
			fav = data.fav,
			favHeader = dataStack.favHeader,
			favFooter = dataStack.favFooter,
			keywords = data.keywords;
			
		if (fav) {
			// clear jQuery data cache for fav so that it will not be loaded again
			$elem.data("fav", null);
			runFav(elem, fav, keywords, favHeader, favFooter);
		}
	});
}
