PS.NavFormatter = function (el) {
	function exec() {
		var formatter = this.nav && this[this.nav],
			formattedValue;
			
		if (typeof formatter === "function") {
			formattedValue = formatter.call(this);
		}
			
		if (formattedValue != null) {
			this.$el.html(formattedValue);
		}
		
		this.$el.removeAttr("data-nav");
	}
	
	var $el = $(el);

	// there can be only one element
	if ($el.length > 1) { throw "PS.NavFormatter matched more than one element." }
	if (!$el.length) { throw "PS.NavFormatter did not match any elements." }

	// extend the formatter object
	// with all of the data attributes from 
	// this element and all parent elements
	_.extend(this, _.pick($el.dataStack(), function (value, key) {
		return _.string.startsWith(key, "nav");
	}));
	
	// setup element references
	this.$el = $el;
	this.el = $el.get(0);
	
	// create exec function reference
	this.exec = exec;
};

// create a jQuery-esque reference to the PS.NavFormatter prototype
PS.NavFormatter.fn = PS.NavFormatter.prototype;

// formats array to be used as a datasource for UI (structured for Select2)
PS.NavFormatter.formats = [];

// register method for adding formats to the formats array
PS.NavFormatter.register = function (settings) {
	// verify that the format function exists
	if (typeof PS.NavFormatter.fn[settings.id] !== "function") {
		DDK.error("Unable to register formatter. `PS.NavFormatter.fn." + settings.id + "` is not a function.");
		return;
	}
	
	// add format to the formats array
	PS.NavFormatter.formats.push({
		id: settings.id,
		text: settings.text,
		sortOrder: settings.sortOrder,
		name: settings.name
	});
	
	// sort formats array
	PS.NavFormatter.formats.sort(function (a, b) {
		return a.sortOrder - b.sortOrder;
	});
	
	// add defaults to the formatter function
	PS.NavFormatter.fn[settings.id].defaults = settings.defaults || {};
	
	// set default format
	if (!PS.NavFormatter.defaultFormat || settings.isDefaultFormat) {
		PS.NavFormatter.defaultFormat = settings.id;
	}
};

PS.NavFormatter.fn.getSettings = function () {
	return _.extend(
		// start with an empty object
		{},
		
		// add the global default format settings
		this.defaults,
		
		// add the default format settings for this format
		this[this.nav].defaults,
		
		// override with any data-format attributes from the data stack
		// remove the 'format' prefix and camelize the remaining name
		_.reduce(_.pick(this, function (value, key) {
			return key !== "nav" && _.string.startsWith(key, "nav");
		}), function (accumulator, value, key) {
			accumulator[_.string.camelize(key.slice(3))] = value;
			return accumulator;
		}, {})
	);
};

PS.NavFormatter.fn.defaults = {
	// add default NavFormatter options here

};

// default nav formatter functions
PS.NavFormatter.fn.select2 = function () {
	var settings = this.getSettings();
	
	this.$el.select2(settings);
};

// need to regiter nav formatter functions, too
PS.NavFormatter.register({
	id: "select2",
	text: "Dropdown",
	sortOrder: 200,
	name: "Select2"
});
