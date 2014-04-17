PS.Formatter = function (el) {
	function exec() {
		var formatter = this.format && this[this.format],
			formattedValue;
			
		if (typeof formatter === "function") {
			formattedValue = formatter.call(this);
		}
			
		if (formattedValue != null) {
			this.$el.html(formattedValue);
		}
		
		this.$el.removeAttr("data-format");
	}
	
	var $el = $(el);

	// there can be only one element
	if ($el.length > 1) { throw "PS.Formatter matched more than one element." }
	if (!$el.length) { throw "PS.Formatter did not match any elements." }

	// extend the formatter object
	// with all of the data attributes from 
	// this element and all parent elements
	_.extend(this, _.pick($el.dataStack(), function (value, key) {
		return _.string.startsWith(key, "format");
	}));
	
	// setup element references
	this.$el = $el;
	this.el = $el.get(0);
	
	// create exec function reference
	this.exec = exec;
};

// create a jQuery-esque reference to the PS.Formatter prototype
PS.Formatter.fn = PS.Formatter.prototype;

// formats array to be used as a datasource for UI (structured for Select2)
PS.Formatter.formats = [];

// database datatype to format type map
PS.Formatter.typeMap = {};

// register method for adding formats to the formats array
PS.Formatter.register = function(settings) {
	// verify that the format function exists
	if (typeof PS.Formatter.fn[settings.id] !== "function") {
		DDK.error("Unable to register formatter. `PS.Formatter.fn." + settings.id + "` is not a function.");
		return;
	}
	
	// add format to the formats array
	PS.Formatter.formats.push({
		id: settings.id,
		text: settings.text,
		sortOrder: settings.sortOrder,
		name: settings.name,
		styles: []
	});
	
	// sort formats array
	PS.Formatter.formats.sort(function (a, b) {
		return a.sortOrder - b.sortOrder;
	});
	
	// add defaults to the formatter function
	PS.Formatter.fn[settings.id].defaults = settings.defaults || {};
	
	// extend type map
	if (settings.datatype) {
		_.each(settings.datatype.split(" "), function (datatype) {
			PS.Formatter.typeMap[datatype] = settings.id;
		});
	}
	
	// set default format
	if (!PS.Formatter.defaultFormat || settings.isDefaultFormat) {
		PS.Formatter.defaultFormat = settings.id;
	}
};

// register method for adding styles to the format styles array
PS.Formatter.registerStyle = function(settings) {
	var format = _.find(PS.Formatter.formats, { name: settings.parentName }),
		styles = format.styles;
	
	// verify that the format function is registered
	if (!format) {
		DDK.error("Unable to register format style. `Cannot find '" + settings.parentName + "' in PS.Formatter.formats.");
		return;
	}
	
	// add style to the styles array
	styles.push(settings);
	
	// sort styles array
	styles.sort(function (a, b) {
		return a.sortOrder - b.sortOrder;
	});
	
	// add style defaults to the formatter function
	PS.Formatter.fn[format.id][settings.id] = settings.defaults || {};		
};

PS.Formatter.colorRange = function (color, steps) {
	/* Various color utility functions */
	function pack(rgb) {
		var r = Math.round(rgb[0] * 255);
		var g = Math.round(rgb[1] * 255);
		var b = Math.round(rgb[2] * 255);
		return '#' + (r < 16 ? '0' : '') + r.toString(16) +
		   (g < 16 ? '0' : '') + g.toString(16) +
		   (b < 16 ? '0' : '') + b.toString(16);
	}

	function unpack(color) {
		if (color.length == 7) {
			return [parseInt('0x' + color.substring(1, 3)) / 255,
				parseInt('0x' + color.substring(3, 5)) / 255,
				parseInt('0x' + color.substring(5, 7)) / 255];
		}
		else if (color.length == 4) {
			return [parseInt('0x' + color.substring(1, 2)) / 15,
				parseInt('0x' + color.substring(2, 3)) / 15,
				parseInt('0x' + color.substring(3, 4)) / 15];
		}
	}

	function hsl2rgb(hsl) {
		var m1, m2, r, g, b;
		var h = hsl[0], s = hsl[1], l = hsl[2];
		m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
		m1 = l * 2 - m2;
		return [
			hue2rgb(m1, m2, h+0.33333),
			hue2rgb(m1, m2, h),
			hue2rgb(m1, m2, h-0.33333)
		];
	}

	function hue2rgb(m1, m2, h) {
		h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
		if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
		if (h * 2 < 1) return m2;
		if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
		return m1;
	}

	function rgb2hsl(rgb) {
		var min, max, delta, h, s, l;
		var r = rgb[0], g = rgb[1], b = rgb[2];
		min = Math.min(r, Math.min(g, b));
		max = Math.max(r, Math.max(g, b));
		delta = max - min;
		l = (min + max) / 2;
		s = 0;
		if (l > 0 && l < 1) {
			s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
		}
		h = 0;
		if (delta > 0) {
			if (max == r && max != g) h += (g - b) / delta;
			if (max == g && max != b) h += (2 + (b - r) / delta);
			if (max == b && max != r) h += (4 + (r - g) / delta);
			h /= 6;
		}
		return [h, s, l];
	}
	
	function hsl2hex(hsl) {
		return pack(hsl2rgb(hsl));
	}
  
	var settings = PS.Formatter.colorRange[color],
		range = settings.l.max - settings.l.min,
		increment,
		l;
	
	switch (steps) {
		case 1:
			// for a single step, output the 2/3 point
			return [hsl2hex([settings.h, settings.s, settings.l.min + range * 0.66667])];

		case 2:
			// for two steps, output the 1/3 and 2/3 points
			return [
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.33333]),
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.66667])
			];
		
		case 3:
			// for three steps, output the 1/4, 1/2, and 3/4 points
			return [
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.25]),
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.5]),
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.75])
			];

		case 4:
			// four steps
			return [
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.1]),
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.35]),
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.6]),
				hsl2hex([settings.h, settings.s, settings.l.min + range * 0.85])
			];

		default:
			// more than 4 steps
			increment = range / (steps - 1);
			return _.map(_.range(steps), function (value) {
				return hsl2hex([settings.h, settings.s, settings.l.min + increment * value]);
			});
	}
};

PS.Formatter.colorRange.red = { h: 0, s: 1, l: { min: 0.35, max: 0.9 } };
PS.Formatter.colorRange.yellow = { h: 36 / 360, s: 1, l: { min: 0.5, max: 0.9 } };
PS.Formatter.colorRange.green = { h: 100 / 360, s: 1, l: { min: 0.35, max: 0.9 } };
PS.Formatter.colorRange.blue = { h: 212 / 360, s: 1, l: { min: 0.35, max: 0.9 } };
PS.Formatter.colorRange.gray = { h: 0, s: 0, l: { min: 0.35, max: 0.9 } };
PS.Formatter.colorRange.neutral = PS.Formatter.colorRange.gray;

PS.Formatter.fn.getSettings = function () {
	return _.extend(
		// start with an empty object
		{},
		
		// add the global default format settings
		this.defaults,
		
		// add the default format settings for this format
		this[this.format].defaults,
		
		// add the default format settings from this format style
		this[this.format][this.formatStyle],
		
		// override with any data-format attributes from the data stack
		// remove the 'format' prefix and camelize the remaining name
		_.reduce(_.pick(this, function (value, key) {
			return key !== "format" && _.string.startsWith(key, "format");
		}), function (accumulator, value, key) {
			accumulator[_.string.camelize(key.slice(6))] = value;
			return accumulator;
		}, {})
	);
};

PS.Formatter.fn.defaults = {
	precision: 0,
	nullToZero: true,
	zero: "-",
	"null": "-",
	units: "",
	unitsPosition: "right",
	unitsAttr: "",
	unitsClassName: "",
	unitsTemplate: "<span class=\"format-units <%= unitsClassName %>\" <%= unitsAttr %>><%= units %></span>",
	arrowAttr: "",
	arrowClassName: "",
	arrowTemplate: "<span class=\"format-arrow <%= direction %> <%= arrowClassName %>\" <%= arrowAttr %>></span>",
	bulbAttr: "",
	bulbClassName: "",
	bulbTemplate: "<span class=\"format-bulb <%= bulbClassName %>\" <%= bulbAttr %>></span>",
	orientation: 1,
	direction: 0,
	method: "format",
	valueColor: "neutral"
};

// default formatter functions
PS.Formatter.fn.text = function () {
	return _.escape(this.formatValue);
};

PS.Formatter.fn.html = function () {
	return this.formatValue;
};

PS.Formatter.fn.number = function () {
	var num = +this.formatValue,
		isNum = !(num == null || isNaN(num)),
		settings = this.getSettings();

	// null replacement value
	// if nullToZero is false and formatValue is emptyString
	// (null values in the data appear here as empty strings)
	// or if the formatValue does not coerce to a number
	if (!isNum || (!settings.nullToZero && this.formatValue === "")) {
		if (!_.isNumber(settings["null"])) {
			// if settings["null"] is not a number, return the text directly without further formatting
			return settings["null"];
		}
		
		// if settings["null"] is a number, format it with units and proper number formatting
		num = settings["null"];
	} else if (num === 0) {
		if (!_.isNumber(settings.zero)) {
			// if settings.zero is not a number, return the text directly without further formatting
			return settings.zero;
		}
		
		// if settings.zero is a number, format it with units and proper number formatting
		num = settings.zero;
	}
	
	if (settings.units) {
		settings.units = _.template(settings.unitsTemplate, settings);
	}
		
	return (settings.unitsPosition === "left" ? " " + settings.units : "") +
		numeral(num).format("0,0" + (settings.precision ? "." + _.string.repeat("0", settings.precision) : "")) +
		(settings.unitsPosition === "right" ? " " + settings.units : "");
};

PS.Formatter.fn.currency = function () {
	var num = +this.formatValue,
		isNum = !(num == null || isNaN(num)),
		settings = this.getSettings();
		
	// null replacement value
	// if nullToZero is false and formatValue is emptyString
	// (null values in the data appear here as empty strings)
	// or if the formatValue does not coerce to a number
	if (!isNum || (!settings.nullToZero && this.formatValue === "")) {
		if (!_.isNumber(settings["null"])) {
			// if settings["null"] is not a number, return the text directly without further formatting
			return settings["null"];
		}
		
		// if settings["null"] is a number, format it with units and proper number formatting
		num = settings["null"];
	} else if (num === 0) {
		if (!_.isNumber(settings.zero)) {
			// if settings.zero is not a number, return the text directly without further formatting
			return settings.zero;
		}
		
		// if settings.zero is a number, format it with units and proper number formatting
		num = settings.zero;
	}
	
	if (settings.units) {
		if (settings.units === "dollars") { settings.units = "$"; }
		settings.units = _.template(settings.unitsTemplate, settings);
	}
	
	return (settings.unitsPosition === "left" ? " " + settings.units : "") +
		numeral(num).format("0,0" + (settings.precision ? "." + _.string.repeat("0", settings.precision) : "")) +
		(settings.unitsPosition === "right" ? " " + settings.units : "");
};

PS.Formatter.fn.date = function () {
	var settings = this.getSettings(),
		args = [this.formatValue],
		mom;
	
	if (settings.units) {
		args.push(settings.units);
	}
		
	mom = moment.utc.apply(null, args);
	mom.local();

	// pass settings.template argument to fromNow
	if (settings.method === "format") {
		return mom.format(settings.template);
	}
	
	if (typeof mom[settings.method] === "function") {
		return mom[settings.method]();
	}
	
	return "Invalid format method: " + settings.method;
};

PS.Formatter.fn.time = function () {
	var settings = this.getSettings(),
		args = [this.formatValue, settings.units || "seconds"],
		dur;
	
	dur = moment.duration.apply(null, args);
	
	// don't pass settings argument to humanize
	if (settings.method === "humanize") {
		return dur.humanize();
	}

	if (typeof dur[settings.method] === "function") {
		return dur[settings.method](settings);
	}
	
	return "Invalid format method: " + settings.method;
};

PS.Formatter.fn.chart = function () {
	var settings = this.getSettings(),
		elemIndex,
		$parents = this.$el.parents(),
		$table = $parents.filter("table"),
		$cell = $parents.filter("th, td"),
		$cells,
		hasTable = !!$table.length;
	
	(function ($el, settings) {
		_.defer(function () {
			var padding = 0,
				$canvas;

			if (hasTable) {
				// use 80px as the default width for charts in a table
				// use the element font size as the default height for charts in a table
				settings.width = settings.width || 80;
				settings.height = settings.height || parseInt($el.css("line-height"), 10) || parseInt($el.css("font-size"), 10) || 24;
				
			} else {
				// use the element width as the default width for charts
				// in other elements if possible
				// use 3/4 of the element font size as the default height for charts outside of tables
				settings.width = settings.width || $el.width() || 80;
				settings.height = settings.height || (parseInt($el.css("font-size"), 10) * 0.75).toFixed();
			}

			$el.sparkline(settings.value.toString().split(","), settings);
			
			// set the table cell width
			if (hasTable) {
				$canvas = $el.find("canvas");
				padding += parseInt($canvas.css("padding-left"), 10);
				padding += parseInt($canvas.css("padding-right"), 10);
				
				$el.closest("td, th").width(settings.width + padding);
			}
		});
	})(this.$el, settings);
};

PS.Formatter.fn.bar = function () {
	var settings = this.getSettings(),
		elemIndex,
		$parents = this.$el.parents(),
		$table = $parents.filter("table"),
		$cell = $parents.filter("th, td"),
		$cells,
		hasTable = !!$table.length;
	
	// calculate and cache max value if it is not provided or already calculated
	if (!settings.max) {
		if (hasTable) {
			elemIndex = $cell.index();
			$cells = $table.find("tbody").find("tr").find("th:eq(" + elemIndex + "), td:eq(" + elemIndex + ")");
			
			settings.max = Math.max.apply(null, $cells.map(function (index, elem) {
				return $(elem).find("[data-format=\"bar\"]").data("formatValue");
			}).get());
			
			$cells.data("formatMax", settings.max);
		} else {
			DDK.error("Must set data-format-max when using bar format function outside a table or scorecard.");
		}
	}
	
	// create settings.rangeColors if it does not exist
	if (!settings.rangeColors) {
		// expand valueColor
		if (settings.valueColor.toString().indexOf(",") > -1) {
			// valueColor can be a comma-separated list of color values, e.g. #aaa,#ccc,#eee
			settings.valueColor = settings.valueColor.toString().split(",");
		} else if (PS.Formatter.colorRange[settings.valueColor]) {
			// valueColor can be a color keyword set as a property of PS.Formmater.colorRange
			// color keyword will be expanded into a gradient range for as many steps as there are values
			settings.valueColor = PS.Formatter.colorRange(settings.valueColor, settings.value.toString().split(",").length);
		} else {
			settings.valueColor = [settings.valueColor];
		}
		
		settings.rangeColors = [settings.fillColor].concat(settings.valueColor.reverse());
	}
	
	(function ($el, settings) {
		_.defer(function () {
			var padding = 0,
				$canvas;
			
			if (hasTable) {
				// use 160px as the default width for bars in a table
				// use the element font size as the default height for charts in a table
				settings.width = settings.width || 160;
				settings.height = settings.height || parseInt($el.css("line-height"), 10) || parseInt($el.css("font-size"), 10) || 24;
				
			} else {
				// use the element width as the default width for charts
				// in other elements if possible
				// use 3/4 of the element font size as the default height for charts outside of tables
				settings.width = settings.width || $el.width() || 160;
				settings.height = settings.height || (parseInt($el.css("font-size"), 10) * 0.75).toFixed();
			}
			
			settings.type = "bullet";

			$el.sparkline([settings.target || "", settings.performance || "", settings.max, settings.value], settings);
			
			// set the table cell width
			if (hasTable) {
				$canvas = $el.find("canvas");
				padding += parseInt($canvas.css("padding-left"), 10);
				padding += parseInt($canvas.css("padding-right"), 10);
				
				$el.closest("td, th").width(settings.width + padding);
			}
		});
	})(this.$el, settings);
};

PS.Formatter.fn.stackedbar = function () {
	function sum() {
		var args = [].slice.call(arguments);
		return _.reduce(args, function (accumulator, value) {
			return accumulator + (+value);
		}, 0);
	}

	var settings = this.getSettings(),
		elemIndex,
		$parents = this.$el.parents(),
		$table = $parents.filter("table"),
		$cell = $parents.filter("th, td"),
		$cells,
		hasTable = !!$table.length;
	
	// calculate and cache max value if it is not provided or already calculated
	if (!settings.max) {
		if (hasTable) {
			elemIndex = $cell.index();
			$cells = $table.find("tbody").find("tr").find("th:eq(" + elemIndex + "), td:eq(" + elemIndex + ")");
			
			settings.max = Math.max.apply(null, $cells.map(function (index, elem) {
				var formatValue = $(elem).find("[data-format=\"stackedbar\"]").data("formatValue");
				return sum.apply(null, formatValue ? formatValue.split(",") : []);
			}).get());
			
			$cells.data("formatMax", settings.max);
		} else {
			DDK.error("Must set data-format-max when using bar format function outside a table or scorecard.");
		}
	}
	
	// create settings.rangeColors if it does not exist
	if (!settings.rangeColors) {
		// expand valueColor
		if (settings.valueColor.toString().indexOf(",") > -1) {
			// valueColor can be a comma-separated list of color values, e.g. #aaa,#ccc,#eee
			settings.valueColor = settings.valueColor.toString().split(",");
		} else if (PS.Formatter.colorRange[settings.valueColor]) {
			// valueColor can be a color keyword set as a property of PS.Formmater.colorRange
			// color keyword will be expanded into a gradient range for as many steps as there are values
			settings.valueColor = PS.Formatter.colorRange(settings.valueColor, settings.value.toString().split(",").length);
		} else {
			settings.valueColor = [settings.valueColor];
		}
		
		settings.rangeColors = [settings.fillColor].concat(settings.valueColor.reverse());
	}
	
	(function ($el, settings) {
		_.defer(function () {
			var padding = 0,
				$canvas;
				
			var values = _.map(settings.value.toString().split(","), function (value, index, collection) {
				return sum.apply(null, collection.slice(0, index + 1));
			});
			
			if (hasTable) {
				// use 160px as the default width for charts in a table
				// use the element font size as the default height for charts in a table
				settings.width = settings.width || 160;
				settings.height = settings.height || parseInt($el.css("line-height"), 10) || parseInt($el.css("font-size"), 10) || 24;
				
			} else {
				// use the element width as the default width for charts
				// in other elements if possible
				// use 3/4 of the element font size as the default height for charts outside of tables
				settings.width = settings.width || $el.width() || 160;
				settings.height = settings.height || (parseInt($el.css("font-size"), 10) * 0.75).toFixed();
			}
			
			settings.type = "bullet";

			$el.sparkline([settings.target || "", settings.performance || "", settings.max].concat(values.reverse()), settings);
			
			// set the table cell width
			if (hasTable) {
				$canvas = $el.find("canvas");
				padding += parseInt($canvas.css("padding-left"), 10);
				padding += parseInt($canvas.css("padding-right"), 10);
				
				$el.closest("td, th").width(settings.width + padding);
			}
		});
	})(this.$el, settings);
};

PS.Formatter.fn.stackedbar100 = function () {
	var settings = this.getSettings(),
		elemIndex,
		$parents = this.$el.parents(),
		$table = $parents.filter("table"),
		$cell = $parents.filter("th, td"),
		$cells,
		hasTable = !!$table.length;

	// create settings.rangeColors if it does not exist
	if (!settings.rangeColors) {
		// expand valueColor
		if (settings.valueColor.toString().indexOf(",") > -1) {
			// valueColor can be a comma-separated list of color values, e.g. #aaa,#ccc,#eee
			settings.valueColor = settings.valueColor.toString().split(",");
		} else if (PS.Formatter.colorRange[settings.valueColor]) {
			// valueColor can be a color keyword set as a property of PS.Formmater.colorRange
			// color keyword will be expanded into a gradient range for as many steps as there are values
			settings.valueColor = PS.Formatter.colorRange(settings.valueColor, settings.value.toString().split(",").length);
		} else {
			settings.valueColor = [settings.valueColor];
		}
		
		settings.rangeColors = [settings.fillColor].concat(settings.valueColor.reverse());
	}
	
	(function ($el, settings) {
		_.defer(function () {
			function sum() {
				var args = [].slice.call(arguments);
				return _.reduce(args, function (accumulator, value) {
					return accumulator + (+value);
				}, 0);
			}

			var padding = 0,
				$canvas;
				
			var values = _.map(settings.value.toString().split(","), function (value, index, collection) {
				return sum.apply(null, collection.slice(0, index + 1));
			});
			
			if (hasTable) {
				// use 160px as the default width for charts in a table
				// use the element font size as the default height for charts in a table
				settings.width = settings.width || 160;
				settings.height = settings.height || parseInt($el.css("line-height"), 10) || parseInt($el.css("font-size"), 10) || 24;
				
			} else {
				// use the element width as the default width for charts
				// in other elements if possible
				// use 3/4 of the element font size as the default height for charts outside of tables
				settings.width = settings.width || $el.width() || 160;
				settings.height = settings.height || (parseInt($el.css("font-size"), 10) * 0.75).toFixed();
			}
			
			settings.type = "bullet";

			$el.sparkline([settings.target || "", settings.performance || ""].concat(values.reverse()), settings);
			
			// set the table cell width
			if (hasTable) {
				$canvas = $el.find("canvas");
				padding += parseInt($canvas.css("padding-left"), 10);
				padding += parseInt($canvas.css("padding-right"), 10);
				
				$el.closest("td, th").width(settings.width + padding);
			}
		});
	})(this.$el, settings);
};

PS.Formatter.fn.arrow = function () {
	var value = ((this.formatValue && this.formatValue.toString().indexOf(",") > -1) ? 
			PS.Formatter.calcs.change(this.formatValue) : 
			this.formatValue
		),
		num = +value,
		settings = this.getSettings();
	
	if (!settings.direction) {	
		if (num > 0 && settings.orientation === 1 || num < 0 && settings.orientation === -1) {
			settings.direction = "up";
		} else if (num > 0 && settings.orientation === -1 || num < 0 && settings.orientation === 1) {
			settings.direction = "down";
		} else {
			settings.direction = "neutral";		
		}
	}
	
	return _.template(settings.arrowTemplate, settings);
};

PS.Formatter.fn.bulb = function () {
	var settings = this.getSettings();
	
	return _.template(settings.bulbTemplate, settings);
};

PS.Formatter.calcs = {};

PS.Formatter.calcs.percentChange = function (input) {
	// performs calculation of (last - first) / first
	// given a comma-separated list of inputs
	var values = (input ? input.split(",") : []),
		firstValue = values[0],
		firstNum = +firstValue,
		lastValue = values[values.length - 1],
		lastNum = +lastValue;
	
	if ((firstValue == null && lastValue == null) || isNaN(firstNum) || isNaN(lastNum)) {
		// let format function null handling take over
		// if both values are null
		// or if one value is not a number
		return "";
	}
	
	if (firstNum === 0) {
		if (lastNum === 0) {
			// change from 0 to 0 is 0
			return 0;
		}
		
		// change from 0 is always 100%
		return 100;
	}

	return (lastNum - firstNum) / firstNum * 100;
};

PS.Formatter.calcs.change = function (input) {
	// performs calculation of (last - first)
	// given a comma-separated list of inputs
	var values = (input ? input.split(",") : []),
		firstValue = values[0],
		firstNum = +firstValue,
		lastValue = values[values.length - 1],
		lastNum = +lastValue;
	
	if ((firstValue == null && lastValue == null) || isNaN(firstNum) || isNaN(lastNum)) {
		// let format function null handling take over
		// if both values are null
		// or if one value is not a number
		return "";
	}

	return lastNum - firstNum;
};

PS.Formatter.fn.percent = function () {
	var value = ((this.formatValue && this.formatValue.toString().indexOf(",") > -1) ? 
			PS.Formatter.calcs.percentChange(this.formatValue) : 
			this.formatValue
		),
		num = +value,
		isNum = !(num == null || isNaN(num)),
		settings = this.getSettings();
		
	// null replacement value
	// if nullToZero is false and formatValue is emptyString
	// (null values in the data appear here as empty strings)
	// or if the formatValue does not coerce to a number
	if (!isNum || (!settings.nullToZero && value === "")) {
		if (!_.isNumber(settings["null"])) {
			// if settings["null"] is not a number, return the text directly without further formatting
			return settings["null"];
		}
		
		// if settings["null"] is a number, format it with units and proper number formatting
		num = settings["null"];
	} else if (num === 0) {
		if (!_.isNumber(settings.zero)) {
			// if settings.zero is not a number, return the text directly without further formatting
			return settings.zero;
		}
		
		// if settings.zero is a number, format it with units and proper number formatting
		num = settings.zero;
	}
	
	settings.units = "%";
	settings.units = _.template(settings.unitsTemplate, settings);
		
	return numeral(num).format("0,0" + (settings.precision ? "." + _.string.repeat("0", settings.precision) : "")) + settings.units;
};