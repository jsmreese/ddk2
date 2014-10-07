DDK.AMEval = function (keys, query, settings) {
	var args;

	args = [].slice.call(arguments);
	
	settings = _.extend({
		keys: [],
		query: "",
		datasource: "",
		checkKeys: false,
		databind: false,
		
		// standard operations
		escape: "",
		toCase: "",
		prune: false,
		prefix: "",
		coerce: false,
		overlay: ""
	}, settings);
	
	// parse arguments
	_.each(args, function (arg) {
		if (typeof arg === "string") {
			settings.query = arg;
			return;
		}

		if (_.isArray(arg)) {
			settings.keys = arg;
			return;
		}

		if (_.isPlainObject(arg)) {
			_.extend(settings, arg);
		}
	});

	if (!_.isArray(settings.keys) || !settings.keys.length) { return {}; }
	
	// ps - PureShare
	// p - pair, k - key, v - value, r - record
	settings.list = _.map(settings.keys, function (key) {
		return "<psp><psk>" + key + "</psk><psv>" + DDK.char.tilde + key + DDK.char.tilde + "</psv></psp>";
	}).join("");
	
	// checkKeys only takes effect when there is no query
	if (!settings.query && settings.checkKeys) {
		// check for any global keys that have a value (but not sec.* or favorite_starting_widget)
		// or for keys that appear to be dataset agregates
		// if none are found, return without widget execution
		if (!_.any(settings.keys, function (key) {
			return /(_avg|_min|_max|_sum|_count)$/i.test(key) || (!/^favorite_starting_widget$/i.test(key) && !/^sec\./i.test(key) && K(key));
		})) {
			return _.reduce(settings.keys, function (result, key) {
				// need to handle full settings here: toCase, escape, etc.
				result[key] = K(key);
				
				return result;
			}, {});
		}
	}
		
	if (settings.databind) {
		settings.list = "<psr>" + settings.list + "</psr>";
		keywordUpdateDatabind("html.detail", settings.list);
	} else {
		K("html.detail", settings.list);
	}
	
	if (settings.query) {
		if (!settings.datasource) {
			settings.datasource = "db.amdb";
		}
		
		K("ddk_ameval_query", settings.query);
		K("ddk_ameval_datasource", settings.datasource);
		settings.widget = "DDK2_AMEval";
	} else {
		if (!settings.datasource) {
			settings.datasource = "psc_component_data";
		}
		
		settings.widget = "DDK2_AMEval_" + settings.datasource;
	}
	
	settings.eval = _.string.parseTaggedList(run(settings.widget), settings);
	
	K.flush(["html.detail", "ddk_ameval_"]);
	
	return settings.eval;
};