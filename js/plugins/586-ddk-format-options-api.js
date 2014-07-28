PS.extend("optionsAPI");

PS.optionsAPI.formatFunction = {
	"id": "format_framework_functions",
	"label": "Format Framework Functions",
	"description": "Format Framework Functions can be triggered using data-format attributes, or in Scorecard and BAM configuration using element format.",
	"options": { 
		"arrow": { 
			"id": "arrow", 
			"label": "Arrow", 
			"description": "<p>Draws an arrow (or other up/down indicator).", 
			"notes": "<p>If the format value is a comma-separated list, a change calculation will be performed using the first and last values <code>(last - first)</code>.<p>Arrow direction may be set via <code>data-format-direction</code>, or is automatically determined by the value, with a positive value using an <code>up</code> arrow, a negative value using a <code>down</code> arrow, and a zero value using a <code>nochange</code> arrow (typically a dash).<p>Arrow color is determined based on the <code>data-format-color</code> option, which can be a single CSS color value or DDK Color Keyword (red, yellow, green, blue, gray, grey, neutral), or a comma-separated list of three CSS color values or DDK Color Keywords. Color list is in the order <code>favorable</code>, <code>unfavorable</code>, <code>neutral</code>, corresponding to the element's status. Element status may be set via <code>data-format-status</code>, or is automatically determined based on the value and the orientation. Colors may be overridden using the <code>data-format-positive-color</code>, <code>data-format-negative-color</code>, and <code>data-format-zero-color</code> options. Databind arrow color by using a DDK Keyword Alias in the <code>data-format-color</code> option, e.g. <code>data-format-color='%{RESULT}%'</code>.<p>Use element classes to change the displayed indicator: <code>arrow-xthin</code>, <code>arrow-thin</code>, <code>triangle</code>, <code>caret-thick</code>, <code>caret</code>, <code>chevron</code>, <code>plus-minus</code>, <code>plus-minus-circle</code>, <code>plus-minus-square</code>, <code>check-x</code>, and <code>thumb</code>."
		}, 
		
		"auto": { 
			"id": "auto", 
			"label": "Auto", 
			"description": "<p>Automatically formats a value based on the units.", 
			"notes": "<p>Must be used in conjunction with format units, usually <code>data-format-units='%{UNITS}%'</code>.<p>Recognized units:<table><thead><tr><th>Units</th><th>Format</th></tr></thead><tbody><tr><td>milliseconds</td><td rowspan=8>time</td><td>seconds</td><td>minutes</td><td>hours</td><td>days</td><td>weeks</td><td>months</td><td>years</td></tr><tr><td>dollars</td><td rowspan=1>currency</td></tr><tr><td>percent</td><td rowspan=1>percent</td></tr><tr><td><em>no unit</em></td><td rowspan=1>number or text (based on value)</td></tr></tbody></table>"
		}, 
		
		"bar": { 
			"id": "bar", 
			"label": "Bar", 
			"description": "<p>Draws a horizontal bar plotting a single value against a maximum. <p>Maximum value is automatically detected in tables and scorecards, but must be provided via <code>data-format-max</code> in other contexts (include BAMs). <p>Automatic max value may be overridden by using the <code>data-format-max</code> attribute.", 
			"notes": "<p>Uses the <a href=\"http://omnipotent.net/jquery.sparkline/\">jQuery Sparkline plugin</a>, using the <code>bullet</code> chart type. <p>Use <code>data-format-value-color='%{RESULT}%'</code> to databind bar color. Color keywords with this option will connect bar color to a metric <code>RESULT</code> field. <p>Change the background color of each bar using <code>data-format-fill-color</code>. <p>Add a target and performance to a bar using <code>data-format-target</code>, <code>data-format-target-color</code>, <code>data-format-performance</code>, and <code>data-format-performance-color</code>. <p>Set any <a href=\"http://omnipotent.net/jquery.sparkline/#common\">sparkline plugin option</a> via <code>data-format-*</code> attribute, e.g. set chart <code>targetWidth</code> using <code>data-format-target-width='20'</code>." 
		}, 

		"stackedBar": { 
			"id": "stackedbar", 
			"label": "Bar (Stacked)", 
			"description": "<p>Draws a horizontal bar plotting multiple values against a maximum. <p>Maximum value is automatically detected in tables and scorecards, but must be provided via <code>data-format-max</code> in other contexts (include BAMs). <p>Automatic max value may be overridden by using the <code>data-format-max</code> attribute.", 
			"notes": "<p>Uses the <a href=\"http://omnipotent.net/jquery.sparkline/\">jQuery Sparkline plugin</a>, using the <code>bullet</code> chart type. <p>Use <code>data-format-value-color='%{RESULT}%'</code> to databind bar color. Color keywords with this option will automatically generate a graded scale of color for an arbitrary number of values. <p>Change the background color of each bar using <code>data-format-fill-color</code>. <p>Add a target and performance to a bar using <code>data-format-target</code>, <code>data-format-target-color</code>, <code>data-format-performance</code>, and <code>data-format-performance-color</code>. <p>Set any <a href=\"http://omnipotent.net/jquery.sparkline/#common\">sparkline plugin option</a> via <code>data-format-*</code> attribute, e.g. set chart <code>targetWidth</code> using <code>data-format-target-width='20'</code>." 
		}, 
		
		"stackedBar100": { 
			"id": "stackedbar100", 
			"label": "Bar (100% Stacked)", 
			"description": "<p>Draws a horizontal bar plotting multiple values. Maximum value is not used by this function, and all bar stacks use the same width.", 
			"notes": "<p>Uses the <a href=\"http://omnipotent.net/jquery.sparkline/\">jQuery Sparkline plugin</a>, using the <code>bullet</code> chart type. <p>Use <code>data-format-value-color='%{RESULT}%'</code> to databind bar color. Color keywords with this option will automatically generate a graded scale of color for an arbitrary number of values. <p>Add a target and performance to a bar using <code>data-format-target</code>, <code>data-format-target-color</code>, <code>data-format-performance</code>, and <code>data-format-performance-color</code>. <p>Set any <a href=\"http://omnipotent.net/jquery.sparkline/#common\">sparkline plugin option</a> via <code>data-format-*</code> attribute, e.g. set chart <code>targetWidth</code> using <code>data-format-target-width='20'</code>."
		}, 

		"bulb": { 
			"id": "bulb", 
			"label": "Bulb", 
			"description": "<p>Draws a bulb (or other status indicator).", 
			"notes": "<p>Bulb color may be set via element classes using the text color classes. e.g. <code>text-green</code>. Databind bulb color by using a DDK Keyword Alias in the class name. e.g. <code>text-%{RESULT}%</code> or <code>text-dk%{RESULT}%</code>.<p>Use element classes to change the displayed indicator: <code>square</code>, <code>donut</code>, </code>flag</code>, </code>star</code>, <code>dot</code>." 
		},

		"chart": { 
			"id": "chart", 
			"label": "Chart", 
			"description": "<p>Draws a mini chart.", 
			"notes": "<p>Uses the <a href=\"http://omnipotent.net/jquery.sparkline/\">jQuery Sparkline plugin</a>. Default chart type is <code>line</code>. <p>Set any <a href=\"http://omnipotent.net/jquery.sparkline/#common\">sparkline plugin option</a> via <code>data-format-*</code> attribute. e.g. set chart <code>lineColor</code> using <code>data-format-line-color='#cdf'</code>." 
		}, 
		
		"currency": { 
			"id": "currency", 
			"label": "Currency", 
			"description": "<p>Formats a numeric value as currency.", 
			"notes": "<p>Use <code>data-format-precision</code> to set displayed decimal places. <p>Use <code>data-format-null-to-zero</code>, <code>data-format-null</code>, and <code>data-format-zero</code> to change the way <code>null</code> and <code>zero</code> data values are formatted. <p>Default <code>units</code> value is <code>dollars</code>. Use <code>data-format-units</code> to set a different <code>units</code> value.<p>Colors may be set using the <code>data-format-value-color</code>, <code>data-format-positive-color</code>, <code>data-format-negative-color</code>, and <code>data-format-zero-color</code> options." 
		}, 

		"date": { 
			"id": "date", 
			"label": "Date", 
			"description": "<p>Formats a text value as a date.", 
			"notes": "<p>Format value must be a valid <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date\">JavaScript date string</a>. <p>Uses the <a href=\"http://momentjs.com/\">Moment.js</a> date library to parse and format dates. <p>Set <code>data-format-template</code> and <code>data-format-method</code> to change formatted output." 
		}, 
		
		"html": { 
			"id": "html", 
			"label": "HTML", 
			"description": "<p>Outputs format value as HTML.", 
			"notes": "<p>Output is not HTML-escaped, so the format value will be parsed and rendered as HTML." 
		}, 
		
		"number": { 
			"id": "number", 
			"label": "Number", 
			"description": "<p>Formats a numeric value.", 
			"notes": "<p>Use <code>data-format-precision</code> to set displayed decimal places. <p>Use <code>data-format-null-to-zero</code>, <code>data-format-null</code>, and <code>data-format-zero</code> to change the way <code>null</code> and <code>zero</code> data values are formatted.<p>Colors may be set using the <code>data-format-value-color</code>, <code>data-format-positive-color</code>, <code>data-format-negative-color</code>, and <code>data-format-zero-color</code> options." 
		},
		
		"percent": { 
			"id": "percent", 
			"label": "Percent", 
			"description": "<p>Formats a numeric value as a percent.", 
			"notes": "<p>If format value is a single number, will be directly formatted as a percent. <p>If format value is a comma-separated list of multiple numbers, a percent change calculation will be made on the first and last values <code>(last - first) / first * 100</code> and the result formatted as a percent. <p>Use <code>data-format-precision</code> to set displayed decimal places. <p>Automatically updates <code>units</code> format option to <code>percent</code>. <p>Use <code>data-format-null-to-zero</code>, <code>data-format-null</code>, and <code>data-format-zero</code> to change the way <code>null</code> and <code>zero</code> data values are formatted.<p>Colors may be set using the <code>data-format-value-color</code>, <code>data-format-positive-color</code>, <code>data-format-negative-color</code>, and <code>data-format-zero-color</code> options." 
		},
		
		"text": { 
			"id": "text", 
			"label": "Text", 
			"description": "<p>Outputs format value as text.", 
			"notes": "<p>Output is HTML-escaped." 
		},

		"time": { 
			"id": "time", 
			"label": "Time", 
			"description": "<p>Formats a numeric value as a time duration.", 
			"notes": "<p>Uses the <a href=\"https://github.com/jsmreese/moment-duration-format\">Moment-Duration-Format</a> plugin to the <a href=\"http://momentjs.com/\">Moment.js</a> date library to parse and format durations. <p>Set <code>data-format-template</code> and <code>data-format-method</code> to change formatted output. <p>Set <code>data-format-units</code> to change the input value units. Default <code>units</code> value is <code>seconds</code>. Databind units using DDK Keyword Alias. e.g. <code>data-format-units='%{UNITS}%'</code>." 
		}
	}
};

PS.optionsAPI.format = {
	"id": "format_framework_options",
	"label": "Format Framework Options",
	"description": "Options that can be passed to format framework functions. Can be passed via <code>data-format-*</code> attribute in scorecard/BAM configuration, via format function favorite or format style favorite, or via client JavaScript.",
	"options": { 
		"precision": { 
			"id": "precision", 
			"label": "Precision", 
			"description": "<p>The number of digits of a value that are displayed. <p>As a configuration attribute, use <code>data-format-precision</code>.", 
			"notes": "<p>If a positive number, sets the number of decimal digits to display after the decimal point. If a negative number, sets the number of digits before the decimal point at which to truncate the value. Values are truncated, not rounded. For example, a value of <code>1.23456</code> with precision of <code>4</code> would be rendered as <code>1.2345</code>. A value of <code>6789</code> with precision of <code>-2</code> would be rendered as <code>6700</code>. <p>For time format, precision is applied to the final time-value token in the template. <p>Data-bind precision based on a metric <code>PRECISION</code> field, e.g. <code>data-format-precision='%{PRECISION}%'</code>.", 
			"defaultValue": "0"
		},

		"nullToZero": { 
			"id": "null_to_zero", 
			"label": "Null To Zero", 
			"description": "<p>Converts all <code>null</code> data values to <code>0</code> before formatting. <p>As a configuration attribute, use <code>data-format-null-to-zero</code>.", 
			"notes": "<p>If <code>true</code>, converts <code>null</code> and empty string data values to zero.", 
			"defaultValue": true
		},
		
		"null": { 
			"id": "null", 
			"label": "Null", 
			"description": "<p>Number or text string to be displayed in place of a <code>null</code> or empty string data value. <p>As a configuration attribute, use <code>data-format-null</code>.",
			"notes": "<p>If a number, value will be formatted as a number using precision, units, etc. If text, value will be rendered as text without number formatting.", 
			"defaultValue": "-"
		}, 
		
		"zero": { 
			"id": "zero", 
			"label": "Zero", 
			"description": "<p>Number or text string to be displayed in place of a <code>0</code> data value. <p>As a configuration attribute, use <code>data-format-zero</code>.",
			"notes": "<p>If a number, value will be formatted as a number using precision, units, etc. If text, value will be rendered as text without number formatting.", 
			"defaultValue": "-"
		},
		
		"negative": { 
			"id": "negative", 
			"label": "Negative", 
			"description": "<p>Format template for negative numbers. <p>As a configuration attribute, use <code>data-format-negative</code>.",
			"notes": "<p>The character <code>n</code> will be replaced with the formatted output value.", 
			"defaultValue": "-n",
			"values": ["-n", "(n)", "n"]
		}, 
	
		"units": { 
			"id": "units", 
			"label": "Units", 
			"description": "<p>Units appended to value. <p>As a configuration attribute, use <code>data-format-units</code>.",
			"notes": "<p>Used by time and date formats for value parsing. For <code>percent</code> Default value is <code>%</code> for percent format.", 
			"defaultValue": "" 
		}, 
	
		"unitsPosition": { 
			"id": "units_position", 
			"label": "Units Position", 
			"description": "<p>Render the units to the left or to the right of the value. <p>As a configuration attribute, use <code>data-format-units-position</code>.",
			"notes": "<p>Units span is rendered inline to the right or to the left of the formatted value.", 
			"defaultValue": "right", 
			"values": ["right", "left"] 
		}, 

		"valueClassName": { 
			"id": "value_class_name", 
			"label": "Value Classes", 
			"description": "<p>Classes added to the Value element for the number, currency, and percent format functions. <p>As a configuration attribute, use <code>data-format-value-class-name</code>."
		}, 
	
		"valueAttr": { 
			"id": "value_attr", 
			"label": "Value Attributes", 
			"description": "<p>Attributes added to the Value element for the number, currency, and percent format functions. <p>As a configuration attribute, use <code>data-format-value-attr</code>."
		}, 
	
		"valueTemplate": { 
			"id": "value_template", 
			"label": "Value Template", 
			"description": "<p>Micro-template used to render the value element for the number, currency, and percent format functions. <p>As a configuration attribute, use <code>data-format-value-template</code>.",
			"defaultValue": "<span <%= (valueColor ? \'style=\"color: \' + valueColor + \';\"\' : \'\') %> class=\"format-value <%= valueClassName %>\" <%= valueAttr %>><%= value %></span>" 
		}, 
		
		"unitsClassName": { 
			"id": "units_class_name", 
			"label": "Units Classes", 
			"description": "<p>Classes added to the units element. <p>As a configuration attribute, use <code>data-format-units-class-name</code>."
		}, 
	
		"unitsAttr": { 
			"id": "units_attr", 
			"label": "Units Attributes", 
			"description": "<p>Attributes added to the units element. <p>As a configuration attribute, use <code>data-format-units-attr</code>."
		}, 
	
		"unitsTemplate": { 
			"id": "units_template", 
			"label": "Units Template", 
			"description": "<p>Micro-template used to render the units element. <p>As a configuration attribute, use <code>data-format-units-template</code>.",
			"defaultValue": "<span class=\"format-units <%= unitsClassName %>\" <%= unitsAttr %>><%= units %></span>" 
		}, 
	
		"arrowClassName": { 
			"id": "arrow_class_name", 
			"label": "Arrow Classes", 
			"description": "<p>Classes added to the arrow element. <p>As a configuration attribute, use <code>data-format-arrow-class-name</code>."
		}, 
	
		"arrowAttr": { 
			"id": "arrow_attr", 
			"label": "Arrow Attributes", 
			"description": "<p>Attributes added to the arrow element. <p>As a configuration attribute, use <code>data-format-arrow-attr</code>."
		}, 
	
		"arrowTemplate": { 
			"id": "arrow_template", 
			"label": "Arrow Template", 
			"description": "<p>Micro-template used to render the arrow element. <p>As a configuration attribute, use <code>data-format-arrow-template</code>.",
			"notes": "<p>Renders an up or a down arrow, based on the direction, or based on the value and orientation.", 
			"defaultValue": "<span style=\"color: <%= colors[status] %>;\" class=\"format-arrow <%= direction %> <%= arrowClassName %>\" <%= arrowAttr %>></span>" 
		}, 
	
		"bulbClassName": { 
			"id": "bulb_class_name", 
			"label": "Bulb Classes", 
			"description": "<p>Classes added to the bulb element. <p>As a configuration attribute, use <code>data-format-bulb-class-name</code>."
		}, 
	
		"bulbAttr": { 
			"id": "bulb_attr", 
			"label": "Bulb Attributes", 
			"description": "<p>Attributes added to the bulb element. <p>As a configuration attribute, use <code>data-format-bulb-attr</code>."
		}, 
	
		"bulbTemplate": { 
			"id": "bulb_template", 
			"label": "Bulb Template", 
			"description": "<p>Micro-template used to render the bulb element. <p>As a configuration attribute, use <code>data-format-bulb-template</code>.",
			"defaultValue": "<span class=\"format-bulb <%= bulbClassName %>\" <%= bulbAttr %>></span>" 
		}, 
	
		"orientation": { 
			"id": "orientation", 
			"label": "Orientation", 
			"description": "<p>Used by the arrow format to determine arrow status based on value. <p>As a configuration attribute, use <code>data-format-orientation</code>.<p>When <code>1</code>, an increase in value is favorable.<p>When <code>-1</code>, an increase in value is unfavorable.",
			"notes": "<p>Data-bind orientation based on a metric <code>ORIENTATION</code> field, e.g. <code>data-format-orientation='%{ORIENTATION}%'</code>.", 
			"defaultValue": "1",
			"values": ["1", "0", "-1"]
		}, 
	
		"direction": { 
			"id": "direction", 
			"label": "Direction", 
			"description": "<p>Arrow direction output by the arrow format. Overrides direction determination from value. <p>As a configuration attribute, use <code>data-format-direction</code>.",
			"notes": "<p>The arrow format automatically determines arrow direction from the value. This option will override the automatic direction. Data-bind direction based on a metric <code>DIRECTION</code> field, e.g. <code>data-format-direction='%{DIRECTION}%'</code>.", 
			"values": ["up", "down"] 
		}, 

		"status": { 
			"id": "status", 
			"label": "Status", 
			"description": "<p>Arrow status output by the arrow format. Overrides status determination from value and orientation. <p>As a configuration attribute, use <code>data-format-status</code>.",
			"notes": "<p>The arrow format automatically determines arrow status from the value. This option will override the automatic status.", 
			"values": ["favorable", "neutral", "unfavorable"] 
		},
		
		"color": { 
			"id": "color", 
			"label": "Color", 
			"description": "<p>Used by the arrow format along with the value and orientation to determine the arrow color. <p>As a configuration attribute, use <code>data-format-color</code>.",
			"notes": "<p>Can be a single color, or a comma-separated list of three colors. Colors must be valid CSS color values or DDK Color Keywords. List colors in this order: <code>favorable</code>,<code>unfavorable</code>,<code>neutral</code>. If a single color value, that color will be used for all three statuses. Will be overridden by <code>data-format-positive-color</code>, <code>data-format-negative-color</code>, and <code>data-format-zero-color</code>."
		},
		
		"positiveColor": { 
			"id": "positive_color", 
			"label": "Positive Color", 
			"description": "<p>Used by the arrow, number, currency, and percent formats to determine the value or arrow color for positive values. <p>As a configuration attribute, use <code>data-format-positive-color</code>.",
			"notes": "<p>Can be a valid CSS color value or a DDK Color Keyword. Will override <code>data-format-color</code> and <code>data-format-value-color</code> options."
		},
		
		"negativeColor": { 
			"id": "negative_color", 
			"label": "Negative Color", 
			"description": "<p>Used by the arrow, number, currency, and percent formats to determine the value or arrow color for negative values. <p>As a configuration attribute, use <code>data-format-negative-color</code>.",
			"notes": "<p>Can be a valid CSS color value or a DDK Color Keyword. Will override <code>data-format-color</code> and <code>data-format-value-color</code> options."
		},
		
		"zeroColor": { 
			"id": "zero_color", 
			"label": "Zero Color", 
			"description": "<p>Used by the arrow, number, currency, and percent formats to determine the value or arrow color for zero and null values. <p>As a configuration attribute, use <code>data-format-zero-color</code>.",
			"notes": "<p>Can be a valid CSS color value or a DDK Color Keyword. Will override <code>data-format-color</code> and <code>data-format-value-color</code> options."
		},
		
		"template": { 
			"id": "template", 
			"label": "Template", 
			"description": "<p>Used by the date and time formats to output formatted date and time strings. <p>As a configuration attribute, use <code>data-format-template</code>.",
			"notes": "<p>Date format uses a <a href='http://momentjs.com/docs/#/displaying/format/'>Moment.js date format string</a>. <p>Time format uses the <a href='https://github.com/jsmreese/moment-duration-format'>Moment Duration Format plugin</a>. <p>Example time format templates: <code>y [years], M [months], d [days], h [hours], m [minutes], s [seconds]</code> or <code>d[d] h:mm:ss</code>. Text within square brackets is escaped, and will not be evauluated for a time duration value." 
		}, 
	
		"method": { 
			"id": "method", 
			"label": "Method", 
			"description": "<p>Used by the date and time formats to output formatted date and time strings. <p>As a configuration attribute, use <code>data-format-method</code>.",
			"notes": "<p>Accepted values for the date format are: <code>format</code> (default), <code>humanize</code>, <code>fromNow</code>, <code>calendar</code>, <code>toISOString</code>, <code>valueOf</code>, and <code>unix</code>. Date format method <code>humanize</code> calls <code>moment.fromNow(true)</code>. See <a href='http://momentjs.com/docs/#/displaying/'>Moment</a> for documentation of the Date methods. <p>Accepted values for the time format are: <code>format</code> (default), <code>humanize</code>, and <code>fromNow</code>. Time format method <code>fromNow</code> calls </code>moment.duration.humanize(true)</code>. See <a href='http://momentjs.com/docs/#/displaying/'>Moment</a> and <a href='https://github.com/jsmreese/moment-duration-format'>Moment Duration Format</a> for documentation of the other Time methods." 
		},
		
		"max": { 
			"id": "max", 
			"label": "Max", 
			"description": "<p>Used by the bar and stackedbar formats to determine the maximum bar value. <p>As a configuration attribute, use <code>data-format-max</code>.",
			"notes": "<p>Bar and stackedbar formats will auto-detect max value unless <code>data-format-max</code> is provided. Stackedbar100 format does not use this option. Automatic max value detection only works in tables/scorecards. Max value must be provided in other contexts, including BAMs." 
		},
		
		"fillColor": { 
			"id": "fill_color", 
			"label": "Fill Color", 
			"description": "<p>Used by the bar and stackedbar formats to determine the fill color for any unused bar range. <p>As a configuration attribute, use <code>data-format-fill-color</code>.",
			"notes": "<p>Must be a valid CSS color value. <p>This option will be ignored if the <code>rangeColors</code> option has a value.",
			"defaultValue": "#fff"
		}, 
		
		"valueColor": { 
			"id": "value_color", 
			"label": "Value Color",
			"description": "<p>Used by the bar, stackedbar, and stackedbar100 formats to determine the bar range colors for each value. <p>Used by the number, currency, and percent format functions to determine value element text color. <p>As a configuration attribute, use <code>data-format-value-color</code>.",
			"notes": "<p>Can contain one or more comma-separated CSS color values or a DDK Color Keyword. <p>If using color values, the color list cannot be longer than the values list. <p>A sample comma-separated list of color values: <code>data-format-value-color='#aaa,#ccc,#eee'</code>. <p>Valid color keywords are <code>blue</code>, <code>gray</code>, <code>green</code>, <code>red</code>, <code>yellow</code>, and <code>neutral</code>, and are used like this: <code>data-format-value-color='blue'</code>. <p>Color keywords will be automatically expanded into a gradient of color values to match the values list, and can be used to data-bind bar colors based on a metric <code>RESULT</code> field, e.g. <code>data-format-value-color='%{RESULT}%'</code>. <p>Neutral and gray give the same gray-scale bar colors. <p>This option will be ignored if the <code>rangeColors</code> option has a value.",
			"defaultValue": "neutral"
		},
		
		"target": { 
			"id": "target", 
			"label": "Target", 
			"description": "<p>Used by the bar, stackedbar, and stackedbar100 formats to display a target on a bar. <p>As a configuration attribute, use <code>data-format-target</code>.",
			"notes": "<p>Use in conjunction with <code>data-format-target-color</code> and <code>data-format-target-width</code>."
		},
		
		"performance": { 
			"id": "performance", 
			"label": "Performance", 
			"description": "<p>Used by the bar, stackedbar, and stackedbar100 formats to display a performance line on a bar. <p>As a configuration attribute, use <code>data-format-performance</code>.",
			"notes": "<p>Use in conjunction with <code>data-format-performance-color</code>."
		}
	}
};
