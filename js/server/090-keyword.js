/* 
// experimenting with ~- ~ html escaped eval

function evalKeywordValue(value, evaledKeys) {
var potentialKeys, 
matchedKey, 
regexValidKey = /^[a-z_][a-z0-9_]*$/;

// if value is not a string, throw exception
value = value.toString();
if (typeof value !== "string") { throw "K.eval error: keyword value does not coerce to a string"; }

// if evaledKeys is not an array, create an empty array
if (!_.isArray(evaledKeys)) { evaledKeys = []; }

// if value is an empty string, stop
if (value === "") { return value; }

// split the value on the tilde character
potentialKeys = value.split(DDK.char.tilde);

// if the potentialKeys array length is less than or equal to 2, stop
if (potentialKeys.length <= 2) { return value; }

// reject the first and last potentialKeys, which cannot start/end with tildes
potentialKeys = potentialKeys.slice(1, -1);

// map potentialKey array to object with details on html-escaping
potentialKeys = _.map(potentialKeys, function (potentialKey) {
var escape = (potentialKey.charAt(0) === "-");
return { escape: escape, key: (escape ? potentialKey.slice(1) : potentialKey) }
});

// filter the potentialKeys array for valid keys, ignoring - character at start
potentialKeys = _.filter(potentialKeys, function (potentialKey) {
return regexValidKey.test(potentialKey.key);
});

// if the potentialKeys array length is 0, stop
if (!potentialKeys.length) { return value; }

// sort the potentialKeys array based on alphabetical order, ignoring - character at start
potentialKeys.sort(function(a, b) {
return a.key > b.key;
});

// find the first potentialKey that has a value in the keyword hash
matchedKey = _.find(potentialKeys, function (potentialKey) {
return K(potentialKey.key) != null; // test for not null or undefined
});

// if there is no matched key, stop
if (!matchedKey) { return value; }

// check the recursion depth
// filter the evaled keys array for the matchedKey
// throw exception if matchedKey is found more than 5 times
if (_.filter(evaledKeys, function (key) { return key === matchedKey.key; }).length > 5) {
throw "K.eval error: recursive keyword `" + matchedKey.key + "`";
}

// execute a global replace for the matchedKey.key (with tildes and dash) on the value string
value = value.replace(new RegExp(DDK.char.tilde + (matchedKey.escape ? "\\-" : "") + matchedKey.key + DDK.char.tilde, "g"), matchedKey.escape ? _.escape(K(matchedKey.key)) : K(matchedKey.key));

// add the matchedKey to the evaledKeys array
evaledKeys.push(matchedKey.key);

// return a call to evalKeywordValue on the remaining value, passing in the evaledKeys array
return evalKeywordValue(value, evaledKeys);
}
*/

function evalCurrentDateKeywordValue(key) {
	function padTwo(num) {
		num = num.toString();

		if (num.length === 1) {
			return "0" + num;
		}

		return num;
	}

	function formatYear(date, diff) {
		date = date.add(diff, "years");
		return date.format("YYYY");
	}

	function formatQuarter(date, diff) {
		date = date.add(diff * 3, "months");
		return formatYear(date, 0) + "-Q" + date.quarter();
	}

	function formatMonth(date, diff) {
		date = date.add(diff, "months");
		return date.format("YYYY-MM");
	}

	function formatWeek(date, diff) {
		date = date.add(diff * 7, "days");
		return date.isoWeekYear() + "-W" + padTwo(date.isoWeek());
	}

	function formatDay(date, diff) {
		date = date.add(diff, "days");
		return date.format("YYYY-MM-DD");
	}

	var date, diff, diffMatch, rDiff, ret, type, formats;

	formats = {
		year: formatYear,
		quarter: formatQuarter,
		month: formatMonth,
		week: formatWeek,
		day: formatDay
	};

	date = moment();

	rDiff = /[\+\-][0-9]+$/;
	diffMatch = key.match(rDiff);
	diff = 0;

	if (diffMatch && diffMatch.length) {
		// convert the diff into a number (diff operator will affect the number's sign)
		diff = +diffMatch[0];

		// slice off the diff and the underscore
		key = key.slice(0, -(diffMatch[0].length + 1));
	}

	// handle YEST for base date of yesterday
	if (key.slice(0, 4) === "YEST") {
		date = date.add(-1, "days");
	}

	key = key.slice(5);

	switch (key) {
		case "YEAR":
			type = "year";
			break;

		// quarters
		case "YEAR_QSTART":
			date = date.dayOfYear(1);
			type = "quarter";
			break;
		case "YEAR_QEND":
			date = date.month(9).date(1);
			type = "quarter";
			break;
		case "QUARTER":
			type = "quarter";
			break;

		// months
		case "YEAR_MSTART":
			date = date.dayOfYear(1);
			type = "month";
			break;
		case "YEAR_MEND":
			date = date.month(11).date(31);
			type = "month";
			break;
		case "QUARTER_MSTART":
			date = moment({ years: date.year(), months: 0, days: 1 }).quarter(date.quarter());
			type = "month";
			break;
		case "QUARTER_MEND":
			date = moment({ years: date.year(), months: 0, days: 1 }).quarter(date.quarter() + 1).add(-1, "days");
			type = "month";
			break;
		case "MONTH":
			type = "month";
			break;

		// weeks
		case "YEAR_WSTART":
			date = date.isoWeek(1);
			type = "week";
			break;
		case "YEAR_WEND":
			date = date.isoWeek(date.isoWeeksInYear());
			type = "week";
			break;
		case "WEEK":
			type = "week";
			break;

		// days
		case "YEAR_START":
			date = date.dayOfYear(1);
			type = "day";
			break;
		case "YEAR_END":
			date = date.month(11).date(31);
			type = "day";
			break;
		case "QUARTER_START":
			date = moment({ years: date.year(), months: 0, days: 1 }).quarter(date.quarter());
			type = "day";
			break;
		case "QUARTER_END":
			date = moment({ years: date.year(), months: 0, days: 1 }).quarter(date.quarter() + 1).add(-1, "days");
			type = "day";
			break;
		case "MONTH_START":
			date = date.date(1);
			type = "day";
			break;
		case "MONTH_END":
			date = date.add(1, "months").date(1).add(-1, "days");
			type = "day";
			break;
		case "WEEK_START":
			date = date.isoWeekday(1);
			type = "day";
			break;
		case "WEEK_END":
			date = date.isoWeekday(7);
			type = "day";
			break;

		// handles case "DAY"
		default:
			type = "day";
	}

	return formats[type](date, diff);
}

function evalKeywordValue(value, evaledKeys) {
	var potentialKeys, 
		matchedKey,
		matchedKeyValue,
		regexValidKey = /^[a-zA-Z0-9_\-\+\.]+$/,
		rCurrentDateKey = /^(CURR|YEST)_((YEAR|QUARTER|MONTH|WEEK)(_(START|END|WSTART|WEND|MSTART|MEND|QSTART|QEND))*|DAY)(_(\+|\-)[0-9]+)*$/;
	
	// if value is not a string, throw exception
	value = value.toString();
	if (typeof value !== "string") { throw "K.eval error: keyword value does not coerce to a string"; }
	
	// if evaledKeys is not an array, create an empty array
	if (!_.isArray(evaledKeys)) { evaledKeys = []; }
	
	// if value is an empty string, stop
	if (value === "") { return value; }
	
	// split the value on the tilde character
	potentialKeys = value.split(DDK.char.tilde);
	
	// if the potentialKeys array length is less than or equal to 2, stop
	if (potentialKeys.length <= 2) { return value; }
	
	// reject the first and last potentialKeys, which cannot start/end with tildes
	potentialKeys = potentialKeys.slice(1, -1);
	
	// sort the potentialKeys array based on alphabetical order
	// remove null values and duplicates
	potentialKeys = _.unique(_.compact(potentialKeys)).sort();
	
	// filter the potentialKeys array for valid keys
	potentialKeys = _.filter(potentialKeys, function (potentialKey) {
		return regexValidKey.test(potentialKey);
	});
	
	// if the potentialKeys array length is 0, stop
	if (!potentialKeys.length) { return value; }
	
	// find the first potentialKey that has a value in the keyword hash
	matchedKey = _.find(potentialKeys, function (potentialKey) {
		var potentialKeyValue;
		
		// potential key can be a CURRENT_DATE keyword
		if (rCurrentDateKey.test(potentialKey)) {
			matchedKeyValue = evalCurrentDateKeywordValue(potentialKey);
			return true;
		}
		
		// or must have a value that is not null or undefined
		potentialKeyValue = K(potentialKey);
		
		if (potentialKeyValue) {
			matchedKeyValue = potentialKeyValue;
			return true;
		}
	});
	
	// if there is no matched key, stop
	if (!matchedKey) { return value; }
	
	// check the recursion depth
	// filter the evaled keys array for the matchedKey
	// throw exception if matchedKey is found more than 3 times
	if (_.filter(evaledKeys, function (key) { return key === matchedKey; }).length > 3) {
		// execute a global replace for the matchedKey (with tildes) on the value string
		// replace with a recursive keyword message
		value = value.replace(new RegExp(DDK.char.tilde + matchedKey.replace(/\+/g, "\\+").replace(/\-/g, "\\-") + DDK.char.tilde, "g"), "(K.eval error: recursive keyword `" + matchedKey + "`)");
	} else {
		// execute a global replace for the matchedKey (with tildes) on the value string
		// replace with the evaluated keyword value
		value = value.replace(new RegExp(DDK.char.tilde + matchedKey.replace(/\+/g, "\\+").replace(/\-/g, "\\-") + DDK.char.tilde, "g"), matchedKeyValue);
	}
	
	//_.each(potentialKeys, function (potentialKey) {
	//	if (_.indexOf(evaledKeys, potentialKey) > -1) {
	//		
	//	}
	//});
	
	// add the matchedKey to the evaledKeys array
	evaledKeys.push(matchedKey);
	
	// return a call to evalKeywordValue on the remaining value, passing in the evaledKeys array
	return evalKeywordValue(value, evaledKeys);
}

var K = function(key, value, prefix) {
	// K(key [, value] [, prefix])
	
	// Basic Getter/Setter
	
	// K(key) : return value associated with key in hash
	// typeof key === "string" && key.indexOf("=") == -1 && !value && !prefix
	if (typeof key === "string" && key.indexOf("=") == -1 && typeof value === "undefined" && typeof prefix === "undefined") {
	
		// 'ddk' is always an object keyword and should be returned as such
		// making this special case because there is so much code all over the DDK (and elsewhere?)
		// that converts JSON keyword values to objects
		// and making that conversion automatic would break all that code
		// hoping to remedy the object as keyword issue in DDK 3
		if (key === "ddk") {
			return _.string.parseJSON(DDK.unescape.brackets(keywordOrDefault(key, "")));
		}
		
		return keywordOrDefault(key, "");
	}
	
	// K(key, value) : execute keyword update of key value pair in hash
	// typeof key === "string" && key.indexOf("=") == -1 && typeof value === "string" && !prefix
	else if (typeof key === "string" && key.indexOf("=") == -1 && typeof prefix === "undefined") {
		keywordUpdate(key, value);	
	}
	
	
	// Array Getters
	
	// K([key1, key2, ..., keyN]) : return array of values associated with keys in hash
	// _.isArray(key) === true && !value && !prefix
	else if (_.isArray(key) && typeof value === "undefined" && typeof prefix === "undefined") {
		var values = [],
			len = key.length
			;
		
		for (var i = 0; i < len; i++) {
			values[i] = keywordOrDefault(key[i], "");
		}
		
		return values;
	}
	
	// K([key1, key2, ..., keyN], prefix) : return array of values associated with keys in hash, with keys prepended by prefix
	// _.isArray(key) === true && typeof value === "string" && !prefix
	// prefix = value;
	// value = undefined;
	else if (_.isArray(key) && typeof value === "string" && typeof prefix === "undefined") {
		prefix = value;
		value = undefined;
		
		var values = [],
			len = key.length
			;
		
		for (var i = 0; i < len; i++) {
			values[i] = keywordOrDefault(prefix + key[i], "");
		}
		
		return values;			
	}
	
	
	// Array Setters
	
	// K([key1, key2, ..., keyN], [value1, value2, ..., valueN]) : execute keyword updates on all key value pairs in key and value arrays
	// _.isArray(key) && _.isArray(value) && !prefix
	else if (_.isArray(key) && _.isArray(value) && typeof prefix === "undefined") {
		var len = key.length;
		
		for (var i = 0; i < len; i++) {
			keywordUpdate(key[i], value[i])	
				}	
	}
	
	// K([key1, key2, ..., keyN], [value1, value2, ..., valueN], prefix) : execute keyword updates on all key value pairs in key and value arrays, with keys prepended by prefix
	// _.isArray(key) && _.isArray(value) && typeof prefix === "string"
	else if (_.isArray(key) && _.isArray(value) && typeof prefix === "string") {
		var len = key.length;
		
		for (var i = 0; i < len; i++) {
			keywordUpdate(prefix + key[i], value[i])	
				}
	}		
	
	
	// URL Getters
	
	// ... there are no URL Getters ... use .toURL() to return a URL
	
	// URL Setters (note: URL Setters can begin with & or with the first key value, but not with ?)
	
	// K("&key1=value1&key2=value2&...&keyN=valueN") : execute keyword updates on all key value pairs in URL
	// typeof key === "string" && key.indexOf("=") > -1 && !value && !prefix
	else if (typeof key === "string" && key.indexOf("=") > -1 && typeof value === "undefined" && typeof prefix === "undefined") {
		
		var _key = (key.charAt(0) === '?' ? key.substring(1) : key),
			pairs = _key.split('&'),
			i;
		
		for (i = 0; i < pairs.length; i += 1) {
			var pair = pairs[i].split('=');
			if (pair[0] && pair[1]) {
				keywordUpdate(pair[0], decodeURIComponent(pair[1].replace(/\+/g,' ')));
			}
		}	
	}
	
	// K("&key1=value1&key2=value2&...&keyN=valueN", prefix) : execute keyword updates on all key value pairs in URL, with keys prepended by prefix
	// typeof key === "string" && key.indexOf("=") > -1 && typeof value === "string" && !prefix
	// prefix = value;
	// value = undefined;		
	else if (typeof key === "string" && key.indexOf("=") > -1 && typeof value === "string" && typeof prefix === "undefined") {
		prefix = value;
		value = undefined;
		
		var _key = (key.charAt(0) === '?' ? key.substring(1) : key),
			pairs = _key.split('&'),
			i;
		
		for (i = 0; i < pairs.length; i += 1) {
			var pair = pairs[i].split('=');
			if (pair[0] && pair[1]) {
				keywordUpdate(prefix + pair[0], decodeURIComponent(pair[1].replace(/\+/g,' ')));
			}
		}	
	}
	
	
	// Object Getters
	
	// ... there are no Object Getters ... use .toObject to return an Object
	
	
	// Object Setters
	
	// K({key1: value1, key2: value2, ..., keyN: valueN}) : execute keyword updates on all key value pairs in object
	// _.isObject(key) && !key.from && !value && !prefix
	else if (_.isObject(key) && !key.from && typeof value === "undefined" && typeof prefix === "undefined") {
		for (var i in key) {
			keywordUpdate(i, key[i]);	
		}	
	}
	
	// K({key1: value1, key2: value2, ..., keyN: valueN}, prefix) : execute keyword updates on all key value pairs in object
	// _.isObject(key) && typeof value === "string" && !prefix
	// prefix = value;
	// value = undefined;		
	else if (_.isObject(key) && typeof value === "string" && typeof prefix === "undefined") {
		prefix = value;
		value = undefined;
		
		for (var i in key) {
			keywordUpdate(prefix + i, key[i]);	
		}
	}		
	
	
	// Advanced Operations
	
	// K({options...} : executes bulk keyword operation as defined by options object, which requires "from" parameter.
	// _.isObject(key) === true && key.from && !value && !prefix
	
	
	// Else
	
	// unrecognized K function signature: K(typeof key, typeof value, typeof prefix)
	
};

_.extend(K, {
	// .flush(prefix)
	flush: function(prefix) {
		var prefixes = [].concat(prefix),
			prefixCount = prefixes.length,
			i;
		
		for (i = 0; i < prefixCount; i += 1) {
			keywordFlush(prefixes[i]);
		}
	},
	
	// .toURL(prefix)
	toURL: function(prefix) {
		var prefixes = [].concat(prefix || ""),
			prefixCount = prefixes.length,
			i,
			out = "";
		
		for (i = 0; i < prefixCount; i += 1) {
			out += keywordsToURL(prefixes[i]);
		}
		
		return out;
	},

	toObject: function (prefix) {
		var prefixes = [].concat(prefix || ""),
			out = {};
			
		_.each(prefixes, function (prefix) {
			var queryString = keywordsToURL(prefix);
			
			_.extend(out, _.string.parseQueryString(queryString));
		});
		
		return out;
	},
	
	// .toObject3(prefix)
	// legacy server toObject used by DDK 1 and 2 code
	// renamed from toObject in DDK 2.2.0a2
	// will strip all prefixes up to and including the first underscore character in the key
	// for a more sensible prefix stripping, use toObject2
	toObject3: function(prefix) {
		var prefixes = [].concat(prefix),
			prefixCount = prefixes.length,
			i,
			out = {};
		
		for (i = 0; i < prefixCount; i += 1) {
			_.extend(out, DDK.queryString.toObject(keywordsToURL(prefixes[i]), prefixes[i]));
		}
		
		return out;
	},
	
	// .toObject2(prefix)
	// will strip prefixes from the front of keys
	// will camelize remaining key names
	// will coerce value types
/*	toObject2: function(prefix) {
		var prefixes = [].concat(prefix),
			out = {};
		
		_.each(prefixes, function (prefix) {
			var queryString = keywordsToURL(prefix);
			
			_.each(_.filter(_.map(queryString.split("&"), function (pair) {
				// map query string to array pairs
				var parts = pair.split("=");
				return [_.string.camelize(parts[0].slice(prefix.length)), parts[1] ? _.string.coerce(decodeURIComponent(parts[1].replace(/\x2B/g, " "))) : null];
			}), function (pair) {
				// filter for key and value exists
				return pair[0] && (pair[1] != null);
			}), function (pair) {
				out[pair[0]] = pair[1];	
			});
		});
		
		return out;
	},
*/
	toObject2: function(prefix) {
		// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
		function escapeRegexp(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}
		
		var prefixes = [].concat(prefix),
			out = {};
		
		_.each(prefixes, function (prefix) {
			var queryString = keywordsToURL(prefix).replace(new RegExp(escapeRegexp(prefix), "g"), "&");
			
			_.extend(out, _.string.parseQueryString(queryString, { toCase: "camel" }));
		});
		
		return out;
	},

	toNestedObject: function(prefix) {
		// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
		function escapeRegexp(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}
		
		var prefixes = [].concat(prefix),
			out = {};
		
		_.each(prefixes, function (prefix) {
			var queryString = keywordsToURL(prefix).replace(new RegExp(escapeRegexp(prefix), "g"), "&");
			
			_.extend(out, _.string.parseQueryString(queryString, { nested: true }));
		});
		
		return out;
	},
	
	//	// .eval(key)
	//	eval: function(key) {
	//		var value = keywordOrDefault(key, ""),
	//			valueParts = value.split(DDK.char.tilde);
	//		
	//		if (valueParts.length === 3) {
	//			valueParts[1] = keywordOrDefault(valueParts[1], DDK.char.tilde + valueParts[1] + DDK.char.tilde)
	//				value = valueParts.join("");
	//		}
	//		
	//		return value;
	//	},
	
	// .eval(key)
	eval: function (key) {
		return evalKeywordValue(K(key), [key]);
	},
	
	// returns a url-encoded string of all default keys and values set
	setDefault: function(key, value) {
		function setDefaultKeywordValue(result, _value, _key) {
			var initialValue = keywordOrDefault(_key, "");
			
			if (initialValue) {
				// if initial value exists, execute keywordUpdate to make it global
				keywordUpdate(_key, initialValue);
				return result + "";
			}
			
			keywordUpdate(_key, _value);
			
			return result + "&" + _key + "=" + encodeURIComponent(DDK.eval(_value));
		}
		
		if (_.isObject(key)) {
			return _.reduce(key, setDefaultKeywordValue, "");
		} else {
			return setDefaultKeywordValue("", value, key);
		}
	},
	
	// creates a keyword with a value of the current widget id
	// default keyword name is "widget_<widget_name>" where the widget name is lowercased
	// optionally provide a custom keyword name
	fromWidgetId: function(key) {
		K(key || ("widget_" + K("metric.widget_name").toLowerCase()), K("metric.id"));
	},
	
	// returns an object or a string created by parsing the value of the supplied keyword
	// useful for converting a rendered JSON dataset string back into a JavaScript object for use in server JavaScript
	toDatasetObject: function(key) {
		return _.string.parseJSON(DDK.unescape.brackets(K(key)));
	},
	
	// index is optional
	getDatasetField: function (key, index, field) {
		var dataset;
		
		if (typeof index === "string") {
			field = index;
			index = 0;
		}
		
		dataset = _.string.parseJSON(DDK.unescape.brackets(K(key)));
		
		if (dataset && dataset.length && dataset[index]) {
			return dataset[index][field];
		}
		
		return "";
	},
	
	isKeyword: function(key) {
		return _.string.toBoolean(containsKeyword(key));
	},
	
	evalGlobals: function (prefix, settings) {
		var prefixes;
		
		prefixes = ["p_"];
		
		if (prefix) {
			prefixes = _.unique(prefixes.concat(prefix));
		}
		
		_.each(K.toObject(prefixes), function (value, key) {
			// execute a keyword update on all global keywords
			// that have DDK Keywords or Script Blocks in their values
			// except for settings.except
			var evalValue;

			if (settings && settings.except && _.indexOf(settings.except.split(" "), key) > -1) { return; }
			
			evalValue = value;
			
			if (DDK.regex.ddkKeywordTest.test(value) || DDK.regex.ddkScriptBlockTest.test(value)) {
				evalValue = DDK.eval(value);
			}
			
			// data_term and data_id are special as of DDK 2.2.0b14
			// they are not zapped inside the DIMQ
			// so they will kill the DIMQ if left as raw unevaluated keywords
			if (value === "~data_term~" || value === "~data_id~") {
				evalValue = "";
			}
		
			// if evalValue changed, keyword update the new value
			if (evalValue !== value) {
				K(key, evalValue);
			}
		});
	},
	
	scope: function (func, keywords) {
		var hasKeywords,
			result,
			cache = {};
		
		if (typeof keywords === "string" && _.string.isQueryString(keywords)) {
			keywords = _.string.parseQueryString(keywords);
		}
		
		if (_.isPlainObject(keywords)) {
			hasKeywords = true;
			
			// for each keyword, cache the global state
			// and update the keyword value
			_.each(keywords, function (value, key) {
				key = _.string.underscored(key);
				cache[key] = (K.isKeyword(key) ? value : null);
				K(key, evalKeywordValue(value));
			});
		}
		
		result = func();
		
		if (hasKeywords) {
			// restore keyword state
			_.each(cache, function (value, key) {
				if (value === null) {
					KeywordDelete(key);
					return;
				}
				
				K(key, value);
			});
		}
		
		return result;
	}
});
