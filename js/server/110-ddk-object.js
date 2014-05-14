/*jshint bitwise: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, plusplus: true, regexp: true, undef: true, strict: true, trailing: true, onevar: true, unused: true */

// DDK.COLUMN_OBJECT_PROPERTIES
// list of properties for column objects returned by DDK.columns()
// list format: "ddkPropName amenginePropName ddkPropNamePlural"
// ddkPropName: property name for the ddkColumnObject returned by DDK.columns()
// amenginePropName: property name in the amengineColumnObject returned by JSON.parse(columnsToJSON())
// ddkPropNamePlural: plural of ddkColumnObject property name used to create DDK.columns[ddkPropNamePlural] function
//	used when ddkPropName does not create its plural by appending an "s"
//
// optional mapping function must be DDK.COLUMN_OBJECT_PROPERTY_MAP[ddkPropName]
// maps from property values in amengineColumnObject to property values in ddkColumnObject
DDK.COLUMN_OBJECT_PROPERTIES = [
	"columnName ColumnName",
	"columnType DataType",
	"columnMetric",
	"columnMetricAttr",
	"columnIndex Ordinal columnIndexes"
];

DDK.COLUMN_OBJECT_PROPERTY_MAP = {
	columnType: function(amenginePropValue) {
		switch (amenginePropValue) {
			case "System.Int32":
				return "int";
			case "System.Double":
				return "float";
			case "System.DateTime":
				return "datetime";
			default:
				return "string";
		}
	}
};

// DDK.COLUMN_METRIC_TRIGGERS
// list of regex matches for column key trigger suffixes
// if a columnName matches a trigger suffix, the prefix becomes a columnMetric
// There is a copy of this in the ddk.js client library.
DDK.COLUMN_METRIC_TRIGGERS = [
	/_ABBR$/,
	/_ID$/,
	/_NAME$/,
	/_LABEL$/,
	/_TARGET$/,
	/_TREND$/,
	/_YOY[1-9][0-9]*$/, // _YOY# positive integer
	/_PRV[1-9][0-9]*$/, // _PRV# positive integer
	/_[12][0-9]{3}$/, // _YYYY - valid 4-digit year 1000-2999
	/_[12][0-9]{3}_Q[1-4]$/, // _YYYY_Q# - valid quarters 1-4
	/_[12][0-9]{3}_W(0[1-9]|[1-4][0-9]|5[0-3])$/, // _YYYY_W## - valid weeks 01-53
	/_[12][0-9]{3}_(0[1-9]|1[12])$/, // _YYYY_MM - valid 2 digit month 01-12
	/_[12][0-9]{3}_(0[1-9]|1[12])_(0[1-9]|[12][0-9]|3[01])$/, // _YYYY_MM_DD - valid 2 digit day 01-31
	/_[1-9][0-9]{0,2}$/ // _# positive integer from 1 to 999
];

// DDK.columns()
// returns: array of column objects containing details about the columns in the current dataset
DDK.columns = function(data) {
	return _.reject(DDK.columns._addProps(_.map(JSON.parse(columnsToJSON()), function(amengineColumnObject) {
		var ddkColumnObject = {};
		
		_.each(DDK.COLUMN_OBJECT_PROPERTIES, function(propObject) {
			var props = propObject.split(" "),
				ddkPropName = props[0],
				amenginePropName = props[1];
			
			if (amenginePropName) {
				if (_.isFunction(DDK.COLUMN_OBJECT_PROPERTY_MAP[ddkPropName])) {
					ddkColumnObject[ddkPropName] = DDK.COLUMN_OBJECT_PROPERTY_MAP[ddkPropName](amengineColumnObject[amenginePropName]);
				} else {
					ddkColumnObject[ddkPropName] = amengineColumnObject[amenginePropName];
				}
			}
		});
		
		return ddkColumnObject;
	 // slice ignores the recordCount column
	}).slice(0, -1), data), function (value) {
		// reject the RDQ_TIMESTAMP column
		// note that for DDK.data.toArray to work properly
		// this assumes that the RDQ_TIMESTAMP column
		// is always at the end of the dataset
		return value.columnMetric === "RDQ_TIMESTAMP";
	});
};

// construct DDK.columns[property]() functions based on DDK.COLUMN_OBJECT_PROPERTIES
// DDK.columns.columnNames()
// DDK.columns.columnTypes()
// etc.
_.each(DDK.COLUMN_OBJECT_PROPERTIES, function(value) {
	var ddkPropParts = value.split(" "),
		ddkPropName = ddkPropParts[0],
		ddkPropNamePlural = ddkPropParts[2];
	DDK.columns[(ddkPropNamePlural ? ddkPropNamePlural : ddkPropName + "s")] = function() {
		return _.pluck(DDK.columns(), ddkPropName);
	};
});

DDK.columns._addProps = function(ddkColumns, data) {
	var columnNames = _.map(_.pluck(ddkColumns, "columnName"), function(value, index) { return value.toUpperCase(); }),
		columnNameCount = columnNames.length,
		columnName,
		columnMetrics = [],
		columnMetricCount,
		columnMetric,
		columnMetricMatch,
		columnMetricTriggers = DDK.COLUMN_METRIC_TRIGGERS,
		columnMetricTriggerCount = columnMetricTriggers.length,
		columnMetricTrigger,
		columnMetricTriggerMatch,
		i,
		j;
	
	// loop through columnNames looking for trigger matches for each columnName
	for (i = 0; i < columnNameCount; i += 1) {
		columnName = columnNames[i];
		// loop through columnMetricTriggers
		for (j = 0; j < columnMetricTriggerCount; j += 1) {
			columnMetricTrigger = columnMetricTriggers[j];
			columnMetricTriggerMatch = columnName.match(columnMetricTrigger);
			if (columnMetricTriggerMatch) {
				columnMetrics.push(columnName.replace(columnMetricTriggerMatch[0], ""));
				break;
			}
		}
	}
	
	// sort columnMetrics by descending length to avoid matching errors with columnMetrics that contain other shorter columnMetrics
	columnMetrics.sort(function(a, b) { 
		return b.length - a.length; 
	});
	columnMetricCount = columnMetrics.length;
	
	// loop through columnNames looking for columnMetric matches for each columnName
	for (i = 0; i < columnNameCount; i += 1) {
		columnName = columnNames[i];
		// loop through columnMetrics
		for (j = 0; j < columnMetricCount; j += 1) {
			columnMetric = columnMetrics[j];
			columnMetricMatch = (columnName + "_").match(columnMetric + "_");
			if (columnMetricMatch) {
				break;
			}
		}
		
		// set column properties
		if (columnMetricMatch && (columnMetric !== columnName)) {
			ddkColumns[i].columnMetric = columnMetric;
			ddkColumns[i].columnMetricAttr = columnName.replace(columnMetric + "_", "");
		} else {
			ddkColumns[i].columnMetric = columnName;
			ddkColumns[i].columnMetricAttr = "VALUE";
		}
		
		// check for numeric data
		if (ddkColumns[i].columnType === "float" || ddkColumns[i].columnType === "int") {
			ddkColumns[i].columnIsNumeric = true;
		} else if (ddkColumns[i].columnType === "string" && data) {
			ddkColumns[i].columnIsNumeric = _.hasNumericData(data, ddkColumns[i].columnIndex);
		} else {
			ddkColumns[i].columnIsNumeric = false;
		}
	}
	
	return ddkColumns;
};

DDK.columns2 = function() {
	var newColumns = [];
	var newColumn;
	_.each(DDK.columns(), function(column) {
		newColumn = {};
		_.each(column, function(value, key) {
			newColumn[_.string.camelize(key.replace("column", ""))] = value;
		});
		newColumns.push(newColumn);
	});
	return newColumns;
};

DDK.data = {};
DDK.data.toArray = function(options) {
	var recordCount = K("rec.count"),
		records = [],
		record,
		recordIndex,
		columns = DDK.columns2(),
		columnCount = columns.length,
		columnName,
		shortColumnName,
		i,
		j,
		data,
		shouldCamelizeKeys = ((options && options.shouldCamelizeKeys != null) ? options.shouldCamelizeKeys : false),
		useRecordObjects = ((options && options.useRecordObjects != null) ? options.useRecordObjects : false),
		columnPrefix = ((options && options.columnPrefix != null) ? options.columnPrefix : ""),
		useCoercedTypes = ((options && options.useCoercedTypes != null) ? options.useCoercedTypes : true),
		extendValue = ((options && useRecordObjects && columnPrefix && useCoercedTypes && options.extendValue != null) ? options.extendValue : false),
		iterator = ((options && typeof options.iterator === "function") ? options.iterator : null),
		coerceMethod,
		escapeMode = options && options.escapeMode || "none",
		escapeMethod,
		columnPrefixRegExp = (columnPrefix ? RegExp("^" + columnPrefix) : null),
		tempValue;
	
	if (escapeMode === "none") { escapeMode = false; }
	if (escapeMode) {
		escapeMethod = DDK.data.escapeModes[escapeMode];
		if (typeof escapeMethod !== "function") {
			throw new Error("DDK.data.toArray(): DDK.data.escapeModes." + escapeMode.toString() + " is not a function.");
		}
	}
	
	for (i = 0; i < recordCount; i += 1) {
		// create a new object to hold each record
		record = (useRecordObjects ? {} : []);
		
		for (j = 0; j < columnCount; j += 1) {
			columnName = columns[j].name;
			
			if (useRecordObjects) {
				// strip prefixes
				shortColumnName = (columnPrefix ? columnName.replace(columnPrefixRegExp, "") : columnName);
				// camelize
				shortColumnName = (shouldCamelizeKeys ? _.string.camelize(shortColumnName) : shortColumnName);
				
				recordIndex = shortColumnName;
			} else {
				recordIndex = j;
			}
			
			data = getData(i, columnName);
			
			if (data.length && useCoercedTypes) {
				coerceMethod = DDK.data.coerceTriggers[data.charAt(0)];
				if (typeof coerceMethod === "function") {
					data = coerceMethod(data);
				}
			}
			record[recordIndex] = ((escapeMode && (typeof data === "string")) ? escapeMethod(data) : data);
		}
		
		if (extendValue) {
			// layer value object onto record object
			// and delete the original `value` property
			// only enabled if useRecordObjects && columnPrefix && useCoercedTypes all are `true`
			tempValue = _.clone(record.value);
			delete record.value;
			_.extend(record, tempValue);
		}
		
		if (iterator) {
			iterator.call(null, record, i);
		}
		
		records[i] = record;
	}
	
	return records;
};

DDK.data.coerceModes = {
	"number": function(data) {
		return (data.match(/^[-]?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?$/) ? +data : data);
	},
	"boolean": function(data) {
		var bool = _.string.toBoolean(data);
		return bool == null ? data : bool;
	},
	"object": function(data) {
		try {
			return JSON.parse(data);
		} catch (e) {
			return data;
		}
	}
};

DDK.data.coerceTriggers = {
	"0": DDK.data.coerceModes.number,
	"1": DDK.data.coerceModes.number,
	"2": DDK.data.coerceModes.number,
	"3": DDK.data.coerceModes.number,
	"4": DDK.data.coerceModes.number,
	"5": DDK.data.coerceModes.number,
	"6": DDK.data.coerceModes.number,
	"7": DDK.data.coerceModes.number,
	"8": DDK.data.coerceModes.number,
	"9": DDK.data.coerceModes.number,
	"-": DDK.data.coerceModes.number,
	"t": DDK.data.coerceModes.boolean,
	"f": DDK.data.coerceModes.boolean,
	"T": DDK.data.coerceModes.boolean,
	"F": DDK.data.coerceModes.boolean,
	"[": DDK.data.coerceModes.object,
	"{": DDK.data.coerceModes.object
};

DDK.data.datasetModes = {
	"object": function(options) {
		return {
			rows: DDK.data.toArray(options),
			columns: DDK.columns2()
		};
	},
	"array": function(options) {
		return DDK.data.toArray(_.extend({}, options, { useRecordObjects: true }));
	}
};

/*
DDK.data.datasetModes = {
	"object": function(options) {
		return {
			rows: DDK.data.toArray({ escapeMode: options && options.escape_mode, useCoercedTypes: options && _.string.toBoolean(options.use_coerced_types) }),
			columns: DDK.columns2()
		};
	},
	"array": function(options) {
		return DDK.data.toArray({ useRecordObjects: true, escapeMode: options && options.escape_mode, useCoercedTypes: options && _.string.toBoolean(options.use_coerced_types) });
	}
};
*/
DDK.data.escapeModes = {
	"html": function (data) {
		return _.escape(data).replace(DDK.regex.openBracket, "&#91;").replace(DDK.regex.closeBracket, "&#93;");
	},
	"html-script": function (data) {
		return data
			.replace(/<script/g, "&lt;script")
			.replace(/<iframe/g, "&lt;iframe")
			.replace(/<!\-\-/g, "&lt;!--")
			.replace(/<\/script>/g, "&lt;/script&gt;")
			.replace(/<\/iframe>/g, "&lt;/iframe&gt;")
			.replace(/\-\->/g, "--&gt;")
			.replace(DDK.regex.openBracket, "&#91;")
			.replace(DDK.regex.closeBracket, "&#93;");		
	},
	"keyword": function (data) {
		return data.replace(DDK.regex.tilde, "%7E").replace(DDK.regex.openBracket, "%5B").replace(DDK.regex.closeBracket, "%5D;");
	}
};

DDK.data.template = function (record, index, template) {
	var columns = _.keys(record);
	
	_.each(columns, function (column) {
		var columnRegex = RegExp("%%" + column + "%%", "gi"),
			escapedColumnRegex = RegExp("%%\-" + column + "%%", "gi");
		
		template = template.replace(columnRegex, record[column]);
		template = template.replace(escapedColumnRegex, _.escape(record[column]));
	});
	
	// replace nRecordCount keyword
	return template.replace(/%%nRecordCount%%|~nRecordCount~|nRecordCount/gi, index);
};

DDK.options = {};

DDK.options.set = function (controlName, controlId) {
	var i,
		options = DDK.options.list,
		optionCount = options.length,
		option,
		optionName,
		optionStateCode,
		optionDefault,
		optionKey,
		optionValue,
		stateValue,
		keywordValue,
		widgetValue,
		defaultValue,
		metricsList,
		metrics,
		metric,
		metricTypes = "static dynamic".split(" "),
		metricType,
		i,
		j;
	
	for (i = 0; i < optionCount; i += 1) {
		option = options[i].split(" ");
		optionName = option[0];
		optionStateCode = option[1];
		optionDefault = option[2];
		
		optionKey = controlName + "_" + optionName;
		
		if (i) {
			stateValue = K.eval("s_" + controlId + "_" + optionStateCode);
			keywordValue = K.eval(controlName + "__" + controlId + "_" + optionName);
			widgetValue = K.eval("template." + controlName + "." + optionName.replace(/_/g, "."));
			defaultValue = (optionDefault ? DDK.options.evalDefault(controlName, optionDefault) : "");
			
			optionValue = stateValue || keywordValue || widgetValue || defaultValue;
			
			K(optionKey, optionValue);
			
			// if `keywords` then instantiate the `value` as keywords
			if (optionName === "keywords") { 
				K(evalKeywordValue(optionValue));
			}
		} else {
			optionsWidget = K(controlName + "_" + optionName);
			keywordsFromWidgetPrefix(optionsWidget, controlName + ".", "template.");			
		}
	}
	
	K("component_title", controlName.slice(0, 1).toUpperCase() + controlName.slice(1));
	
	// evaluate submetrics within metrics_static and metrics_dynamic
	for (i = 0; i < metricTypes.length; i += 1) {
		metricType = metricTypes[i];
		metricsList = K(controlName + "_metrics_" + metricType);
		if (metricsList) {
			metrics = metricsList.split(",");
			for (j = 0; j < metrics.length; j += 1) {
				metric = metrics[j];
				if (metric.indexOf("'") === -1) {
					// metrics than are not wrapped in single quotes must be widgets to be run
					metrics[j] = run(metric);
				}
			}
			K(controlName + "_metrics_" + metricType, metrics.join(","));
		}
	}
	
	K.flush("template.");
};

DDK.options.evalDefault = function(controlName, optionDefault) {
	var optionAction;
	
	if (optionDefault.indexOf("{{") === -1) {
		return optionDefault;
	} else {
		optionAction = optionDefault.slice(2,-2);
		switch (optionAction) {
			case "CLASS":
				return controlName + "-default";
			case "EXPORT_CSV_FILENAME":
				return "data_export_" + (new Date(Date.now())).toISOString().slice(0,10);
			case "SERIES_CONFIG_POSITION":
				return (K(controlName + "_toolbar_enabled") === "true" ? "left" : "none");
			case "MOUSEOVER":
				return controlName + "Default";
			case "PAGING_THRESHOLD_SERVER":
				return controlName === "tree" ? "100" : "1000";
			case "SORT_ENABLED":
				return (controlName !== "scorecard2").toString();
			case "GROUPING_EXPANDED":
				return (controlName !== "scorecard2").toString();
			default:
				return K(controlName + "_" + optionAction);
		}
	}
};

DDK.options.list = [
	// "optionName stateCode defaultValue"
	
	// all other options are depended on the options widget
	"init_widget iw",
	
	// all other options can use keywords passed via the keywords option
	"keywords keywords",
	
	// options that are used as defaults for other options
	"toolbar_default td true",
	"query_widget qw",
	"datasource d db.amdb",
	
	// options with no downstream dependencies
	// {{lowercase}} denotes an option that takes its default from the value of another option
	// {{UPPERCASE}} denotes an option that takes its default from a special case within DDK.options.evalDefault
	"auto_refresh_enabled are true",
	"class c {{CLASS}}",
	"collapse_enabled coe {{toolbar_default}}",
	"color co 636B7E,547E00,007E00,007E7E,00267E,1E007E,50007C,89004D,7E0000,803A00,7C5300,7E6800,7C7C00,838A99,7CB609,0CB40C,0AB4B4,0C3FB4,3209B4,7A0CB6,BA096D,B10E0E,B4590D,B37C0E,B4980D,AFAF07,A7ADBA,A3E028,28E228,2AE4E4,2860E0,5428E2,9F25E2,E72894,E22A2A,E07B26,E0A328,E2C228,E4E421,CDD1DC,C1F658,59F459,5AF8F8,5A89F6,7A54F4,BC57F4,F858B3,FA5959,F4A15C,F6C054,F6DA56,FAFA52,EBF0FA,DBFF92,8FFD8F,92FFFF,90B2FF,AC92FF,D892FF,FF92D0,FF9292,FFC290,FFDA90,FFEC92,FFFF92",
	"color_auto_dark coad 2860E0,E07B26,28E228,9F25E2,5428E2,A3E028,E2C228,2AE4E4,E72894",
	"color_auto_light coal 90B2FF,FFC290,8FFD8F,D892FF,AC92FF,DBFF92,FFEC92,92FFFF,FF92D0",
	"config con",
	"config_column ccol",
	"config_enabled ce {{toolbar_default}}",
	"config_row crow",
	"config_widget cw",
	"control_config_widget ccw",
	"control_js cjs",
	"control_css ccss",
	"datasource_shared_enabled dse false",
	"datatable_enabled de false",
	"edit_enabled edite {{toolbar_default}}",
	"expand_enabled ee {{toolbar_default}}",
	"export_csv_enabled ece {{toolbar_default}}",
	"export_csv_filename ecf {{EXPORT_CSV_FILENAME}}",
	"export_query_widget eqw {{query_widget}}",
	"favorite_description fdesc",
	"favorite_enabled fe {{toolbar_default}}",
	"favorite_id fid",
	"favorite_label flab",
	"favorite_user_id fuid",
	"filter f",
	"filter_enabled fie {{toolbar_default}}",
	"filter_global_enabled fge {{toolbar_default}}",
	"filter_metrics_select fms",
	"filter_metrics_text fmt",
	"filter_value fiv NONE",
	"footer_widget fw",
	"grouping_expanded ge {{GROUPING_EXPANDED}}",
	"grouping_key gk",
	"header hd",
	"header_tooltip hdt",
	"header_widget hw",
	"header_enabled he {{toolbar_default}}",
	"height h 500",
	"help_enabled helpe {{toolbar_default}}",
	"help_widget helpw",
	"label_auto_enabled lae true",
	"label_axisx lax",
	"label_axisy lay",
	"label_axisy_stacked_enabled layse true",
	"label_axisy2 lay2",
	"label_axisy2_stacked_enabled lay2se true",
	"legend_position lp right",
	"metrics_choose_datasource mcd {{datasource}}",
	"metrics_choose_enabled mce {{toolbar_default}}",
	"metrics_choose_query_widget mcqw",
	"metrics_dynamic md",
	"metrics_format mf default",
	"metrics_static ms",
	"metric_display_template mdt",
	"mouseover mouse {{MOUSEOVER}}",
	"nodata_widget ndw",
	"nodes_id nid",
	"nodes_load nl",
	"nodes_menu_default_create nmdcr",
	"nodes_menu_default_delete nmdd",
	"nodes_menu_default_enabled nmde true",
	"nodes_menu_default_rename nmdr",
	"nodes_menu_enabled nme true",
	"nodes_menu_items nmi",
	"nodes_onclick noc",
	"nodes_onselect nos",
	"nodes_onselect_enabled nose true",
	"nodes_open no",
	"nodes_search ns",
	"nodes_search_text nst",
	"nodes_sort nso",
	"nodes_sort_default nsod",
	"nodes_title nt",
	"nodes_types nty",
	"paging_threshold_client ptc 200",
	"paging_threshold_server pts {{PAGING_THRESHOLD_SERVER}}",
	"paging_type pt",
	"preview_enabled pe {{toolbar_default}}",
	"query_beforeRender qbr",
	"query_dimension qd",
	"query_dimension_list qdl",
	"query_dimension_order qdo ASC",
	"query_fieldname_escapechar qfnec",
	"query_header_widget qhw",
	"query_mode qm tsql",
	"query_order qo",
	"query_top qt",
	"query_top_enabled qte {{toolbar_default}}",
	"query_url qu",
	"refresh_enabled re {{toolbar_default}}",
	"series_chartarea sca",
	"series_color sc",
	"series_config_position scp {{SERIES_CONFIG_POSITION}}",
	"series_config_widget scw",
	"series_enabled se",
	"series_mapareaattributes_widget smw",
	"series_pie sp",
	"series_showlabelasvalue sslav",
	"series_type_area sta",
	"series_type_bar stb",
	"series_type_column stc",
	"series_type_line stl",
	"series_type_point stp",
	"series_type_stacked sts",
	"series_type_stepline stsl",
	"series_xaxis_format sxf default",
	"series_xaxis_format_widget sxfw",
	"series_yaxis_secondary sys",
	"sort_enabled soe {{SORT_ENABLED}}",
	"sort_value sv",
	"template_widget tw",
	"title ti",
	"toolbar_bottom_left_widget tblw",
	"toolbar_bottom_right_widget tbrw",
	"toolbar_enabled te true",
	"toolbar_top_left_top_widget ttltw",
	"toolbar_top_left_widget ttlw",
	"toolbar_top_right_top_widget ttrtw",
	"toolbar_top_right_widget ttrw",
	"type ty column",
	"type_enabled tye {{toolbar_default}}",
	"width w 680"
];


DDK.query = {
	filter: function(qf, qfv, co) {
		var out = "",
			i,
			filters = (qfv === "NONE" ? [] : qfv.split("^")),
			filterCount = filters.length,
			filterParts,
			field,
			operator,
			value,
			type,
			escapeChar1 = "",
			escapeChar2 = "",
			escapeCharCodes;
		
		if (co.query_fieldname_escapechar) {
			escapeCharCodes = co.query_fieldname_escapechar.split(DDK.regex.delimiter);
			escapeChar1 = String.fromCharCode(escapeCharCodes[0]);
			escapeChar2 = String.fromCharCode(escapeCharCodes.length > 1 ? escapeCharCodes[1] : escapeCharCodes[0]);
		}
		
		out += " WHERE \r\n";
		out += " " + qf + " \r\n";
		if (qf && (qfv !== "NONE")) {
			out += " AND \r\n";
		}
		if (qfv !== "NONE") {
			// out += " " + run("PSC_Filter_Query_Where") + " \r\n";
			for (i = 0; i < filterCount; i += 1) {
				filterParts = filters[i].split("','");
				field = filterParts[0].replace(/\x27/g, "");
				operator = filterParts[1];
				value = filterParts[2].replace(/\x27/g, ""),
					type = (filterParts[3] ? filterParts[3].replace(/\x27/g, "") : "");
				
				if (i) {
					out += " AND \r\n";
				}
				
				// field
				out += " " + escapeChar1 + field + escapeChar2 + " ";
				
				// operator
				if (operator === "NOT =") {
					out += " != "; // NOT =
				} else {
					out += " " + operator + " ";
				}
				
				// value
				if (operator === "IN" || operator === "NOT IN") {
					//iif(IsNumeric(Replace(Replace(Replace(Split("~filter_value~","','")(2),"'",""),",","")," ",""))," ("&Replace(Split("~filter_value~","','")(2),"'","")&")"  ,   " ('"&Replace(Replace(Replace(Split("~filter_value~","','")(2),", ",",")," ,",","),",","','")&")")
					if (type) {
						if ((type === "int" || type === "float") && _.isRealNumber(value.replace(/,/g, "").replace(/ /g, ""))) {
							out += " (" + value + ") ";
						} else {
							out += " ('" + value.replace(/, /g, ",").replace(/ ,/g, ",").replace(/,/g, "','") + "') ";
						}
					} else {
						if (_.isRealNumber(value.replace(/,/g, "").replace(/ /g, ""))) {
							out += " (" + value + ") ";
						} else {
							out += " ('" + value.replace(/, /g, ",").replace(/ ,/g, ",").replace(/,/g, "','") + "') ";
						}
					}
				} else if (operator === "LIKE" || operator === "NOT LIKE") {
					// "'%"&Replace(Split("~filter_value~","','")(2),"'","")&"%'" 
					out += " '%" + value.replace(/%/g, "^%").replace(/_/g, "^_") + "%' ESCAPE '^' ";
				} else {
					if (type) {
						if ((type === "int" || type === "float") && _.isRealNumber(value)) {
							out += " " + value + " ";
						} else {
							out += " '" + value + "' ";
						}
					} else {
						//iif(IsNumeric(Replace(Split("~filter_value~","','")(2),"'","")),Replace(Split("~filter_value~","','")(2),"'",""),"'"&Split("~filter_value~","','")(2))
						if (_.isRealNumber(value)) {
							out += " " + value + " ";
						} else {
							out += " '" + value + "' ";
						}
					}
				}
				
				out += " \r\n";
				
			}
		}
		
		return out;
	},
	set: function() {
		var out = "",
			controlName = K("component_name"),
			co = K.toObject(controlName + "_"),
			metricsStatic = (co.metrics_static ? co.metrics_static.replace(DDK.regex.singleQuote, "").split(",") : []),
			metricsDynamic = (co.metrics_dynamic ? co.metrics_dynamic.replace(DDK.regex.singleQuote, "").split(",") : []),
			metrics = [].concat(metricsStatic).concat(metricsDynamic),
			metricsCount = metrics.length,
			queryHeader = "",
			cqw = K.eval("component_query_widget"),
			cqhw = K.eval("component_query_header_widget"),
			cnqhw = co.query_header_widget || "",
			qf = co.filter || "",
			qfv = co.filter_value || "NONE",
			qd = co.query_dimension || "",
			qdo = co.query_dimension_order || "",
			qo = co.query_order || "",
			outputCSV = (K("output") === "csv"),
			qw = (outputCSV ? co.export_query_widget : co.query_widget) || "",
			escapeChar1 = "",
			escapeChar2 = "",
			escapeCharCodes;
		
		if (co.query_fieldname_escapechar) {
			escapeCharCodes = co.query_fieldname_escapechar.split(DDK.regex.delimiter);
			escapeChar1 = String.fromCharCode(escapeCharCodes[0]);
			escapeChar2 = String.fromCharCode(escapeCharCodes.length > 1 ? escapeCharCodes[1] : escapeCharCodes[0]);
		}
		
		if (cqhw) {
			queryHeader = run(cqhw); 
		} else if (cnqhw) {
			queryHeader = run(cnqhw); 
		}
		
		if (cqw) {
			out += run(cqw);
		} else {
			out += "SELECT \n";
			// `SELECT *` when metrics_dynamic and metrics_static are not set
			if (!outputCSV || !metricsCount) {
				out += " * \n";
			} else {
				if ((controlName === "chart") && qd) {
					out += " " + escapeChar1 + qd + escapeChar2 + ", ";
				}
				out += escapeChar1 + metrics.join(escapeChar2 + ", " + escapeChar1) + escapeChar2;
			}
			out += " FROM \n";
			out += " ( " + run(qw) + " ) COMPONENT_BASE \n";
			
			if (qf || (qfv !== "NONE")) {
				out += DDK.query.filter(qf, qfv, co);
			}
			
			if (qo) {
				if (qo.indexOf("'") === -1) {
					// old plain-text format for query order
					// cannot contain a single quote character (')
					// `FIELD_NAME ASC`
					out += " ORDER BY " + qo.toUpperCase();
				} else {
					// new serialized format for query order
					// `'FIELD_NAME_1','ASC'^'FIELD NAME 2','ASC'`
					// new format allows application of query_fieldname_escapechar option
					out += " ORDER BY \n";
					_.each(qo.toUpperCase().replace(DDK.regex.singleQuote, "").split("^"), function (value, index) {
						var orderPair = value.split(","),
							fieldName = orderPair[0],
							fieldOrder = orderPair[1];
						
						out += (index ? ", " : " ") + escapeChar1 + fieldName + escapeChar2 + " " + fieldOrder + " \n";
					});
				}
			} else if (qd) {
				out += " ORDER BY " + escapeChar1 + qd + escapeChar2 + " " + qdo;
			}
		}
		
		// uncomment this line to enable the fix for double execution of the query header widget
		// also replace widget PSC_CCS_Data_Set with PSC_CCS_Data_Set_QHW_FIX
		// if (queryHeader) { K("config.sqlheader", queryHeader); }
		return out;
	}
};

DDK.renderJSON = function(obj, escapeHTML, prettify, escapeScriptBlocks) {
	// escapeHTML defaults to `true`
	// escapeScriptBlocks defaults to `false`
	//return DDK.escape.brackets(JSON.stringify(obj)).replace(DDK.regex.singleQuote, "&#39;");
	var str = DDK.escape.brackets(prettify ? JSON.stringify(obj, null, 4): JSON.stringify(obj));
	if (!(escapeHTML === false)) {
		str = _.escape(str);
	}
	if (escapeScriptBlocks) {
		str = (escapeHTML ? DDK.htmlEscape.scriptBlocks(str) : DDK.escape.scriptBlocks(str));
		//str = DDK.escape.scriptBlocks(str);
	}
	return str;
};

DDK.htmlEscape = function(unescapedString) {
	return _.string.escapeHTML(unescapedString);
	//		.replace(DDK.regex.openAngleBracket, "&lt;")
	//		.replace(DDK.regex.closeAngleBracket, "&gt;")
	//		.replace(DDK.regex.doubleQuote, "&quot;")
	//		.replace(DDK.regex.ampersand, "&amp;");		
};

DDK.htmlEscape.scriptBlocks = function(unescapedString) {
	return unescapedString
		.replace(DDK.regex.percentAt, "&#37;&#64;")
		.replace(DDK.regex.atPercent, "&#64;&#37;");
};
/*
DDK.jsonEscape = {};
DDK.jsonEscape.scriptBlocks = function(unescapedString) {
	return unescapedString
		.replace(DDK.regex.percentAt, DDK.char.backslash + DDK.char.backslash + DDK.char.backslash + DDK.char.backslash + DDK.char.percent + DDK.char.at)
		.replace(DDK.regex.atPercent, DDK.char.backslash + DDK.char.backslash + DDK.char.backslash + DDK.char.backslash + DDK.char.at + DDK.char.percent);
};
*/
DDK.regex = {
	closeAngleBracket: /\x3E/g,
	openAngleBracket: /\x3C/g,
	closeBracket: /\x5D/g,
	openBracket: /\x5B/g,
	escapedOpenBracket: /\x5C\x5B/g,
	escapedCloseBracket: /\x5C\x5D/g,
	comma: /\x2C/g,
	caret: /\x5E/g,
	percentPercent: /\x25\x25/g,
	atPercent: /\x40\x25/g,
	percentAt: /\x25\x40/g,
	backslash: /\x5C/g,
	reverseSolidus: /\x5C/g,
	backslashAtPercent: /\x5C\x40\x25/g,
	backslashPercentAt: /\x5C\x25\x40/g,
	atBangPercent: /\x40\x21\x25/g,
	percentBangAt: /\x25\x21\x40/g,
	dollarPercent: /\x24\x25/g,
	percentDollar: /\x25\x24/g,
	bangPercent: /\x21\x25/g,
	percentBang: /\x25\x21/g,
	singleQuote: /\x27/g,
	doubleQuote: /\x22/g,
	ampersand: /\x26/g,
	underscore: /\x5F/g,
	whitespace: /\s+/g,
	delimiter: /\s|,/,
	tilde: /\x7E/g,
	carriageReturn: /\x0D\x0A/g,	//represents \r\n
	tab: /\x09/g,	
	ddkKeyword: /%%[a-zA-Z0-9_\-\.]+?%%/g
};

DDK.char = {
	closeBracket: String.fromCharCode(93),
	doubleQuote: String.fromCharCode(34),
	openBracket: String.fromCharCode(91),
	reverseSolidus: String.fromCharCode(92),
	singleQuote: String.fromCharCode(39),
	tilde: String.fromCharCode(126),
	backslash: String.fromCharCode(92),
	crlf: "\r\n",
	space: " ",
	at: "@",
	bang: "!",
	percent: "%"
};

DDK.escape = {
	angleBrackets: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.openAngleBracket, "&lt;")
			.replace(DDK.regex.closeAngleBracket, "&gt;");
	},	
	brackets: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.openBracket, DDK.char.reverseSolidus + DDK.char.openBracket)
			.replace(DDK.regex.closeBracket, DDK.char.reverseSolidus + DDK.char.closeBracket);
	},
	singleQuote: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.singleQuote, DDK.char.reverseSolidus + DDK.char.singleQuote);
	},
	doubleQuote: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.doubleQuote, DDK.char.reverseSolidus + DDK.char.doubleQuote);
	},
	scriptBlocks: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.percentAt, DDK.char.backslash + DDK.char.percent + DDK.char.at)
			.replace(DDK.regex.atPercent, DDK.char.backslash + DDK.char.at + DDK.char.percent);
	},
	escapedScriptBlocks: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.backslashPercentAt, DDK.char.percent + DDK.char.bang + DDK.char.at)
			.replace(DDK.regex.backslashAtPercent, DDK.char.at + DDK.char.bang + DDK.char.percent);
	},
	carriageReturn: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.carriageReturn, "");
	},
	tab: function(unescapedString) {
		return unescapedString
			.replace(DDK.regex.tab, "");
	}
};

DDK.unescape = {
	brackets: function(escapedString) {
		return escapedString
			.replace(DDK.regex.escapedOpenBracket, DDK.char.openBracket)
			.replace(DDK.regex.escapedCloseBracket, DDK.char.closeBracket);
	},
	tilde: function(escapedString) {
		return escapedString
			.replace(DDK.regex.percentPercent, DDK.char.tilde);
	},
	amControlChars: function(escapedString) {
		return escapedString
			.replace(DDK.regex.percentPercent, DDK.char.tilde);
	},
	tildes: function(escapedString) {
		return escapedString
			.replace(DDK.regex.percentPercent, DDK.char.tilde);
	},
	scriptBlocks: function(escapedString) {
		return escapedString
			.replace(DDK.regex.backslashPercentAt, DDK.char.percent + DDK.char.at)
			.replace(DDK.regex.backslashAtPercent, DDK.char.at + DDK.char.percent);
	},
	escapedScriptBlocks: function(escapedString) {
		return escapedString
			.replace(DDK.regex.percentBangAt, DDK.char.backslash + DDK.char.percent + DDK.char.at)
			.replace(DDK.regex.atBangPercent, DDK.char.backslash + DDK.char.at + DDK.char.percent);
	}
};



DDK.template = DDK.template || {};


DDK.tree = {};
DDK.tree.toolbars = {
	top_right: function(options) {
		var out = "",
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions,
			fe = (fo.status === "installed" && fo.table_status === "installed" && co.favorite_enabled === "true"),
			i;
		
		if (co.refresh_enabled === "true") {
			//out += run("PSC_Tree_Refresh");
			out += "<button type=\"button\" id=\"" + co.id + "Refresh\"  type=\"button\" title=\"Refresh Tree\" style=\"margin-left: 10px;\"><span class=\"ui-button-icon-primary ui-icon ui-icon-arrowrefresh-1-e\"></span></button>";
		}
		if (co.sort_enabled === "true") {			
			out += "<dl id=\"" + co.id + "Sort\" class=\"ddk-dropdown\">";
			out += "<dt></dt>";
			out += "<dd><ul>";
			out += "<li><a href=\"#\" value=\"node_label\" " + (((!co.nodes_sort_default) || (co.nodes_sort_default === "node_label")) ? "checked" : "") + "><span class=\"ui-icon ui-icon-pencil\"></span><label>Label</label></a></li>";
			out += "<li><a href=\"#\" value=\"node_name\" " + (co.nodes_sort_default === "node_name" ? "checked" : "") + "><span class=\"ui-icon ui-icon-person\"></span><label>Name</label></a></li>";
			out += "<li><a href=\"#\" value=\"sort_order\" " + (co.nodes_sort_default === "sort_order" ? "checked" : "") + "><span class=\"ui-icon ui-icon-arrowthick-2-n-s\" ></span><label>Sort</label></a></li>";
			out += "</ul></dd>";
			out += "</dl>";
		}
		if (co.collapse_enabled === "true") {
			//out += run("PSC_Tree_Collapse");
			out += "<button type=\"button\" id=\"" + co.id + "Collapse\"  type=\"button\" title=\"Collapse all\" style=\"margin-left: 2px;\"><span class=\"ui-icon ui-icon-minus\"></span></button>";
		}
		if (co.expand_enabled === "true") {
			//out += run("PSC_Tree_Expand");
			out += "<button type=\"button\" id=\"" + co.id + "Expand\"  type=\"button\" title=\"Expand all\" style=\"margin-left: 10px;\"><span class=\"ui-icon ui-icon-plus\"></span></button>";
		}
		return out;
	},
	top_left: function(options) {
		var out = "",
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions,
			fe = (fo.status === "installed" && fo.table_status === "installed" && co.favorite_enabled === "true"),
			i;
		
		if (co.filter_global_enabled === "true") {
			//out += run("PSC_Tree_Filter_Global");
			out += "<input type=\"text\" id=\"" + co.id + "Search\" style=\"width: 140px;\" placeholder=\"Search\" value=\"" + (co.nodes_search || "") + "\"></input>";
		}
		return out;
	},
	bottom_right: function(options) {
		var out = "",
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions,
			fe = (fo.status === "installed" && fo.table_status === "installed" && co.favorite_enabled === "true"),
			i;
		
		if (co.nodes_search_text_enabled === "true") {
			//out += run("PSC_Tree_Search_Count");
			out += "<label style=\"text-decoration:underline; font-weight:bold;\" id=\"" + co.id + "SearchCount\"></label>";
		}
		return out;
	}
};
DDK.tree.sortQuery = function(optionSort, toolbarSort){
	var out = "",
		prioritySort = ["sort_order", "node_name", "node_label"]
		;
	if(optionSort > ""){
		out += optionSort;
	}
	if(toolbarSort && optionSort.indexOf(toolbarSort) < 0){
		out += out > "" && out.charAt(out.length-1) != "," ?  "," : "";
		out += toolbarSort;
	}
	out += out > "" && out.charAt(out.length-1) != "," ?  "," : "";
	out += _.reject(prioritySort, function(item){ return item === toolbarSort || optionSort.indexOf(item) > -1}).join(",");
	return out;
};
DDK.chart = {};
DDK.chart.setTemplate = function(templateWidget) {
	var i,
		key,
		value,
		pair,
		templateKeywords,
		chartKey;
	
	keywordsFromWidgetPrefix(templateWidget, "chart.", "template.");
	
	templateKeywords = K.toURL("template.chart.").split("&");
	
	for (i = 0; i < templateKeywords.length; i += 1) {
		if (templateKeywords[i]) {
			pair = templateKeywords[i].split("=");
			key = pair[0];
			value = pair[1];
			
			// verify we have a key and a value
			// exclude 'chart.series%','chart.height','chart.width','chart.title'
			if (key && value && key.indexOf("template.chart.") > -1 && key.indexOf("template.chart.") > -1 && key.indexOf("chart.series") === -1 && key.indexOf("chart.title") === -1 && key.indexOf("chart.height") === -1 && key.indexOf("chart.width") === -1) {
				chartKey = key.slice(9);
				
				// if there is no chart keyword already in play (this is like doing a shownull)
				if (!K(chartKey)) {
					K(chartKey, decodeURIComponent(value).replace(/\x2B/g, " "));
				}
			}
		}
	}
	
	K.flush("template.");
};

DDK.chart.toolbars = {
	top_left: function(options) {
		var out = "",
			dataOptions = "id query_fieldname_escapechar export_query_widget query_header_widget query_top query_order datasource metrics_static metrics_dynamic filter filter_enabled filter_value query_dimension query_dimension_list query_widget".split(" "),
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions,
			fe = (fo.status === "installed" && fo.table_status === "installed" && co.favorite_enabled === "true"),
			chartTypeButtons = "line column bar pie".split(" "),
			ctb,
			i;		
		
		if (co.type_enabled === "true") {
			if (_.indexOf(chartTypeButtons, co.type) === -1) {
				chartTypeButtons.push(co.type);
			}
			
			out += "<div class=\"ddk-buttonset\" data-role=\"chart\">";
			
			for (i = 0; i < chartTypeButtons.length; i += 1) {
				ctb = chartTypeButtons[i];
				out += "<input type=\"radio\" value=\"" + ctb + "\" id=\"" + cfo.id + "_b_" + ctb + "\" name=\"" + cfo.id + "_type\" " + (co.type === ctb ? "checked" : "") + "><label for=\"" + cfo.id + "_b_" + ctb + "\">" + ctb + "</label>";
			}
			
			out += "<button type=\"button\" data-ddk-dialog=\"chartType\" data-ddk-chart-type=\"" + co.type + "\" data-ddk-role=\"ui-icon-triangle-1-s\" id=\"" + cfo.id + "_type_dialog_button\" style=\"";
//			if (K("request.http_user_agent").indexOf("IE 9") > -1) {
//				out += "top: -6px;";
//			} else if (K("request.http_user_agent").indexOf("Gecko/ /2.0.1") > -1) {
//				out += "top: -5px;";
//			}
			out += "\">More Chart Types</button></div>";
		}
		
		return out;
	},
	top_right_buttonset: function(options) {
		var out = "",
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions;
		
		out += "<button type=\"button\" data-ddk-dialog=\"chartConfig\" data-ddk-role=\"ui-icon-gear\" data-ddk-chart-options='" + DDK.renderJSON(co) + "'>Chart Options</button>";
		return out;
	},
	query_filter: function(options) {
		var out = "",
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions,
			qft = "";
	
		if (co.query_dimension_list) {
			qft += "<span class=\"ui-priority-secondary ddk-toolbar-label\">X-AXIS</span>" + "<span class=\"ddk-toolbar-value\">" + co.query_dimension.toUpperCase().replace(/_/g, " ") + "</span>";
		}
		
		if (parseInt(co.query_top, 10) && co.query_top_enabled) {
			qft += "<span class=\"ui-priority-secondary ddk-toolbar-label\">TOP</span>";
			qft += "<span class=\"ddk-toolbar-value\">" + co.query_top + "</span>";
		}
		
		qft += "<span class=\"ui-priority-secondary ddk-toolbar-label\">SORT BY</span>";
		if (co.query_order) {
			qft += "<span class=\"ddk-toolbar-value\">";
			qft += co.query_order
				.toUpperCase()
				.replace(DDK.regex.singleQuote, "")
				.replace(DDK.regex.comma, "&nbsp;")
				.replace(DDK.regex.caret, ",&nbsp;&nbsp;")
				.replace(/_/g, " ");
			qft += "</span>";
		} else {
			qft += "<span class=\"ddk-toolbar-value\">" + co.query_dimension.toUpperCase().replace(/_/g, " ") + "&nbsp;&nbsp;" + co.query_dimension_order.toUpperCase() + "</span>";
		}
		
		out += "<div class=\"ps-toolbar-right ui-widget\" style=\"float: right; clear: both; margin-top: 3px;\">";
		out += "<button type=\"button\" id=\"" + cfo.id + "_query_toolbar\" data-ddk-dialog=\"chartQueryFilter\" data-ddk-query='" + DDK.renderJSON(K.toObject("chart_query_")) + "' class=\"ui-priority-secondary ps-filter-bar ps-filter-bar-border\" title=\"Click to edit parameters\">" + qft + "</button>";
		out += "</div>";
		return out;
	}
};

DDK.table = {};

DDK.table.toolbars = {
	top_right: function(options) {
		var out = "",
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions,
			recordCount = parseInt(co.records, 10);
		
		// out += "<div>RecordCount: " + (typeof recordCount) + "," + recordCount + "</div>";
		
		if (
			co.filter_global_enabled === "true" &&
			co.paging_type !== "server" &&
			recordCount < 5000 &&
			(
				co.paging_type === "none" ||
				co.paging_type === "client" ||
				recordCount < co.paging_threshold_server
			)
		) {
			// out += run("PSC_Table_Filter_Global");  
			out += "<input class=\"ps-filter\" id=\"psc_table_" + co.id + "_filter_global_input\" type=\"text\" name=\"psc_table_" + co.id + "_filter_global_input\" onkeyup=\"PSC_Table_FilterGlobal( DDK.table.data." + co.id + ".table, this.value );\" />";
		}
		
		return out;
	}
};

DDK.table.formatColumns = function(metrics, format) {
	return _.map(metrics, function(value) {
		var title;
		switch (format) {
			case "lcase":
				title = value.replace(/_/g, " ").toLowerCase();
				break;
			case "ucase":
				title = value.replace(/_/g, " ").toUpperCase();
				break;
			case "none":
				title = value;
				break;
			default:
				title = value.replace(/_/g, " ");
		}
		return { sTitle: title };
	});
};

DDK.template.render = {
	options: function(options, state) {
		var out = "",
			i,
			optionCount = options.length,
			option,
			selectedText;
		
		for (i = 0; i < optionCount; i += 1) {
			option = options[i];
			if (option.value) {
				selectedText = (option.value === state ? " selected" : "");
				out += "<option value=\"" + (option.value) + "\"" + selectedText + ">" + (option.name) + "</option>";
			} else if (option.label) {
				selectedText = (option.name === state ? " selected" : "");
				out += "<option value=\"" + (option.name) + "\"" + selectedText + ">" + (option.label) + "</option>";					
			} else {
				selectedText = (option === state ? " selected" : "");
				out += "<option value=\"" + option + "\"" + selectedText + ">" + option + "</option>";										
			}
		}
		// console.log(options, out);
		
		return out;
	},
	
	widget: function(widgetName, widgetKeyword, skipWidgetName) {
		var out = "";
		
		if (widgetName && (widgetName !== skipWidgetName)) {
			out = run(widgetName);
		}
		
		if (widgetKeyword) {
			K.flush(widgetKeyword);
		}
		
		return out;
	},
	
	stackedTotalsSeries: function(stackedSeries, options) {
		var seriesTypes = "area bar column".split(" "),
			axisTypes = "primary secondary".split(" "),
			i,
			j,
			stackedTotalsSeriesDetail,
			options = options || {},
			out = "";
		
		if (!stackedSeries) {
			return out;
		} 
		
		for (i = 0; i < seriesTypes.length; i += 1) {
			for (j = 0; j < axisTypes.length; j += 1) {
				stackedTotalsSeriesDetail = stackedSeries[seriesTypes[i]][axisTypes[j]];
				if (stackedTotalsSeriesDetail.length) {
					options.seriesType = seriesTypes[i];
					options.axisType = axisTypes[j];
					//out += "<div>stacked series: " + DDK.renderJSON(options) + " -- " + DDK.renderJSON(stackedTotalsSeriesDetail) + "</div>";
					out += DDK.template.render.stackedTotalsSeriesDetail(stackedTotalsSeriesDetail, options);
				}
			}
		}
		
		//out += "<div>stacked series: " + DDK.renderJSON(stackedSeries) + "</div>";
		return out;
	},
	
	stackedTotalsSeriesDetail: function(stackedSeriesDetail, options) {
		var chartSeriesIndex = parseInt(keywordOrDefault("chart_series_index", ""), 10) + 1,
			out = "";
		
		keywordUpdate("chart_series_index", chartSeriesIndex);
		
		K({
			name: "stackedTotals" + chartSeriesIndex + options.axisType + options.seriesType + (options.chartarea ? options.chartarea : ""),
			yaxistype: options.axisType,
			showlabelasvalue: "true",
			color: "transparent",
			type: options.seriesType,
			showinlegend: "false"
		}, "chart.series" + chartSeriesIndex + ".");
		
		keywordUpdateDatabind("chart.series" + chartSeriesIndex + ".points.valuey", DDK.char.openBracket + DDK.char.tilde + stackedSeriesDetail.join(DDK.char.tilde + "+" + DDK.char.tilde) + DDK.char.tilde + DDK.char.closeBracket);
		
		if (options.chartarea) {
			K("chart.series" + chartSeriesIndex + ".chartarea", "chartarea" + options.chartarea);
		}
		//out += "<div>stacked series: " + "</div>";
		return out;
	},
	
	chartConfig: function(chartOptions, isSidebar) {
		var out = "",
			co = chartOptions,
			isRadial = co.type === "pie" || co.type === "doughnut",
			metricsStatic = (co.metrics_static ? co.metrics_static.replace(DDK.regex.singleQuote, "").split(",") : []),
			metricsDynamic = (co.metrics_dynamic ? co.metrics_dynamic.replace(DDK.regex.singleQuote, "").split(",") : []),
			metrics = [].concat(metricsStatic).concat(metricsDynamic),
			metricsCount = metrics.length,
			chartSeriesName,
			chartSeriesNameFormatted,
			seriesEnabled = ((co.series_enabled && !isRadial) ? co.series_enabled.replace(DDK.regex.singleQuote, "").split(",") : metrics),
			seriesEnabledCount = seriesEnabled.length,
			seriesPie = (co.series_pie ? co.series_pie.replace(DDK.regex.singleQuote, "") : seriesEnabled[0]),
			sideBarPosition = (co.series_config_position === "right" ? "right" : "left");
		
		if (isSidebar) {
			out += "<div class=\"ps-sidebar\"" + (sideBarPosition === "right" ? " style=\"float: right;\"" : "") + "><div id=\"psc_chart_" + co.id + "_series_config\" style=\"float: left; overflow: hidden; padding: 10px 0px 0px 0px; width: 180px;\">";
		} else {
			out += "<div class=\"ps-toolbar\"><div id=\"psc_chart_" + co.id + "_series_config\" class=\"ps-toolbar-left\">";
		}
		
		// out += run("PSC_Chart_Config");
		
		if (isRadial) {
			out += "<label style=\"color: #888; font-size: 9px; float: left; height: 12px; margin-bottom: 2px; margin-left: 10px; text-align: center; width: 160px;\">CHOOSE " + co.type.toUpperCase() + " SERIES</label>";
		} else {
			//run("PSC_Chart_Config_AutoRefresh");	
			out += "<div id=\"psc_chart_" + co.id + "_series_config_options\" class=\"ps-chart-autorefresh\" style=\"float: left; height: 25px; line-height: 25px; margin: 0px; padding: 1px; 0px; width: 180px;\">";
			out += "<input type=\"checkbox\" id=\"psc_chart_" + co.id + "_series_config_options_auto\" value=\"true\" style=\"float: left;\" onclick=\"if (this.checked) { $('#psc_chart_" + co.id + "_series_config_options_auto_label span').text('Auto Refresh ON'); $('#psc_chart_" + co.id + "_series_config_options_refresh').addClass('ps-hidden'); DDK.chart.data." + co.id + ".are = true; daaURLUpdate('s_" + co.id + "_are', 'true'); } else { $('#psc_chart_" + co.id + "_series_config_options_auto_label span').text('Auto Refresh OFF'); $('#psc_chart_" + co.id + "_series_config_options_refresh').removeClass('ps-hidden'); DDK.chart.data." + co.id + ".are = false; daaURLUpdate('s_" + co.id + "_are', 'false'); }\" " + (co.auto_refresh_enabled === "true" ? "CHECKED" : "") + ">";
			out += "<label id=\"psc_chart_" + co.id + "_series_config_options_auto_label\" for=\"psc_chart_" + co.id + "_series_config_options_auto\" style=\"float: left; height: 21px; margin-left: 20px; width: 100px;\">Auto Refresh " + (co.auto_refresh_enabled === "true" ? "ON" : "OFF") + "</label>";
			out += "<button type=\"button\" id=\"psc_chart_" + co.id + "_series_config_options_refresh\" class=\"" + (co.auto_refresh_enabled === "true" ? "ps-hidden" : "") + "\" style=\"float: left; margin-left: 5px;\">Refresh</button>";
			out += "</div>";
		}
		
		for (i = 0; i < metricsCount; i += 1) {
			chartSeriesName = metrics[i];
			
			// set chart series name formatted
			switch (co.metrics_format) {
				case "none":
					chartSeriesNameFormatted = chartSeriesName;	
					break;
				case "lcase":
					chartSeriesNameFormatted = chartSeriesName.replace(/_/g, " ").toLowerCase();	
					break;
				case "ucase":
					chartSeriesNameFormatted = chartSeriesName.replace(/_/g, " ").toUpperCase();
					break;
				default:
					chartSeriesNameFormatted = chartSeriesName.replace(/_/g, " ");		
					break;
			}
			
			out += "<div id=\"psc_chart_" + co.id + "_series_config_container_" + chartSeriesName + "\" style=\"float: left; height: 25px; line-height: 25px; margin: 0px; padding: 1px; 0px; width: 180px;\">";
			if (isRadial) {
				// do nothing
			} else {
				//run("PSC_Chart_Config_Button");
				out += "<button type=\"button\" id=\"psc_chart_" + co.id + "_series_config_" + chartSeriesName + "\" style=\"float: left;\" data-ddk=\"" + co.id + "," + chartSeriesName + "\" class=\"ddk-chart-series-config\">" + chartSeriesNameFormatted + " Options</button>";
			}
			out += "<input type=\"checkbox\" id=\"psc_chart_" + co.id + "_series_config_enable_" + chartSeriesName + "\" value=\"'" + chartSeriesName + "'\" style=\"float: left;\" onclick=\"daaURLUpdate('s_" + co.id + "_hd', ''); daaURLUpdate('s_" + co.id + "_hdt', ''); if ('~chart_type~'==='pie' || '~chart_type~'==='doughnut') { daaURLUpdate('s_" + co.id + "_sp',this.value); } else { var chartSeriesEnabled = $('#psc_chart_" + co.id + "_series_config input').slice(1).filter(':checked').map(function() { return this.value; }).get().join(',');; daaURLUpdate('s_" + co.id + "_se',chartSeriesEnabled);  } if (DDK.chart.data." + co.id + ".are) { PSC_Chart_Reload('" + co.id + "');} \" ";
			out += (_.indexOf(seriesEnabled, chartSeriesName) > -1 ? "CHECKED" : "");
			out += "><label for=\"psc_chart_" + co.id + "_series_config_enable_" + chartSeriesName + "\" ";
			out += ((isRadial && (seriesPie === chartSeriesName)) ? "class=\"ui-priority-primary\"" : "");
			out += " style=\"float: left; font-size: 10px; text-align: left; width: ";
			out += (isRadial ? "173px" : "150px") + ";\">";
			out += chartSeriesNameFormatted + "</label>";
			out += "</div>";
			out += "<div id=\"psc_chart_" + co.id + "_series_config_dialog_" + chartSeriesName + "\" class=\"ps-hidden ps-tooltip-dialog ui-corner-all ui-state-focus ddk-dialog-series-config\" style=\"overflow: hidden; width: 292px;\">";
			out += "<div id=\"psc_chart_" + co.id + "_series_config_frame_" + chartSeriesName + "\" style=\"clear: both; float: left; margin: 5px 0px; overflow-x: visible; overflow-y: hidden;\">";
			out += "</div>";
			out += "</div>";	
		}
		out += "</div></div>";
		
		return out;
	},
	
	controlFrameworkToolbar: function(position, options) {
		var out = "",
			dataOptions = "id query_fieldname_escapechar export_query_widget query_header_widget query_top query_order datasource metrics_static metrics_dynamic filter filter_enabled filter_value query_dimension query_dimension_list query_widget keywords".split(" "),
			co = options.controlOptions,
			cfo = options.controlFrameworkOptions,
			fo = options.favoriteOptions,
			p = position,
			s = p.split("_")[1], // side
			te = (co.toolbar_enabled === "true"),
			cm = cfo.content_mode,
			fe = (fo.status === "installed" && fo.table_status === "installed" && co.favorite_enabled === "true"),
			pe = (fo.status === "installed" && fo.table_status === "installed" && co.preview_enabled === "true");
		
		out += "<div id=\"" + cfo.id + "_toolbar_" + p + "\" class=\"ps-toolbar-" + s + "\"" + (p === "top_left" ? " style=\"clear: both;\"" : "") + ">";
		if (te) {
			if (p === "top_left" && !cm) {
				if (fe) {
					//out += run("PSC_Favorites_Comp_Toolbar_Buttons");
					out += "<div class=\"ddk-buttonset\">";
					if(cfo.name !== "navset2"){
						out += "<button type=\"button\" data-ddk-button-action=\"loadDefaultFavorite\" data-ddk-role=\"ui-icon-home\" >Load Default Favorite</button>";
					}
					out += "<button type=\"button\" data-ddk-role=\"ui-icon-star\" data-ddk-dialog=\"favorites\">Favorites</button>";
					out += "<button type=\"button\" data-ddk-role=\"ui-icon-plusthick\" data-ddk-dialog=\"addFavorite\">Add Favorite</button>";
					out += "</div>";
				}
				if ((co.filter_enabled === "true") || (cfo.choose_metrics_label && co.metrics_choose_enabled === "true")) {
					out += "<div class=\"ddk-buttonset\">";
					if (cfo.choose_metrics_label && co.metrics_choose_enabled === "true") {
						// out += run("PSC_CMS_Button");
						out += "<button type=\"button\" data-ddk-choose-metrics-label=\"" + cfo.choose_metrics_label + "\" ";
						switch (cfo.name) {
							case "scorecard2":
								out += "data-ddk-button-action=\"sc2BuildColumns\"";
								break;
							case "bamset2":
								out += "data-ddk-button-action=\"bs2BuildSet\"";
								break;
							case "navset2":
								out += "data-ddk-button-action=\"ns2BuildSet\"";
								break;
							case "scorecard":
								out += "data-ddk-dialog=\"chooseMetricsScorecard\"";
								break;
							case "bamset":
								out += "data-ddk-dialog=\"chooseMetricsBamset\"";
								break;
							default:
								out += "data-ddk-dialog=\"chooseMetrics\"";
						}
						out += " data-ddk-role=\"ui-icon-calculator\">" + cfo.choose_metrics_label + "</button>";
//						out += ((cfo.name === "scorecard2" || cfo.name === "bamset2" || cfo.name === "navset2") ? "data-ddk-button-action=\"" + (cfo.name === "scorecard2" ? "sc2BuildColumns" : "bs2BuildSet") + "\"" : ("data-ddk-dialog=\"chooseMetrics" + (cfo.name === "scorecard" ? "Scorecard" : "") + (cfo.name === "bamset" ? "Bamset" : "") + "\"")) + " data-ddk-role=\"ui-icon-calculator\">" + cfo.choose_metrics_label + "</button>";
					}
					if (co.filter_enabled === "true" && cfo.name !== "navset2") {
						// out += run("PSC_Filter_Buttons");
						out += "<button type=\"button\" data-ddk-role=\"filter\" value=\"add\" data-ddk-dialog=\"addFilter\">Add Filter</button>";
					}
					out += "</div>";
				}
			}
			if (p === "top_right") {
				out += "<div class=\"ddk-buttonset\">";
				if (!cm) {
					if (co.refresh_enabled === "true" && cfo.name !== "navset2") {
						// out += run("PSC_CCS_Refresh_Button");
						out += "<button type=\"button\" data-ddk-button-action=\"controlRefresh\" data-ddk-role=\"ui-icon-arrowrefresh-1-e\">Refresh " + cfo.title + "</button>"
							}
					if (co.export_csv_enabled === "true" && cfo.name !== "navset2") {
						// out += run("PSC_CCS_Export_CSV");
						out += "<button type=\"button\" data-ddk-role=\"ps-icon-export-csv\" class=\"ddk-csv\" data-ddk-button-action=\"exportCSV\" ";
						out += "data-url=\"amengine.aspx?config.mn=PSC_CCS_Data_Set&sectoken=~sectoken~";
						out += DDK.queryString.removeBlankValues(keywordsToURL("v_") + keywordsToURL("p_") + DDK.queryString.fromOptions(cfo.name, dataOptions));
						out += "&component_name=" + cfo.name + "&component_id=" + cfo.id;
						out += "&filename=" + co.export_csv_filename;
						out += "&output=csv";
						if(co.query_top) {
							out += "&config.maxrecords=" + co.query_top;
							out += "&config.startrecord=0";
						}
						out += "\">Export to CSV</button>";
					}
					if (pe && cfo.name !== "navset2") {
						// out += run("PSC_WPS_Button");
						out += "<button type=\"button\" data-ddk-role=\"ui-icon-link\" data-ddk-dialog=\"controlPreviewLink\">Link to this " + cfo.name + "</button>"
							}
				}
				if (cfo["toolbar_" + p +  "_buttonset_widget"]) {
					out += run(cfo["toolbar_" + p +  "_buttonset_widget"]);
				}
				if (DDK[cfo.name] && DDK[cfo.name].toolbars && DDK[cfo.name].toolbars[p + "_buttonset"]) {
					out += DDK[cfo.name].toolbars[p + "_buttonset"](options);
				}
				if ((cm !== "note") && (co.help_enabled === "true") && cfo.name !== "navset2") {
					out += "<button type=\"button\" data-ddk-role=\"ui-icon-help\" data-ddk-dialog=\"help\"";
					if (co.help_widget) {
						out += " data-ddk-help-widget=\"" + co.help_widget + "\"";
					}
					out += ">Help</button>";
				}
				out += "</div>";
			}
			if (cfo["toolbar_" + p +  "_widget"]) {
				out += run(cfo["toolbar_" + p +  "_widget"]);
			}
			if (DDK[cfo.name] && DDK[cfo.name].toolbars && DDK[cfo.name].toolbars[p]) {
				out += DDK[cfo.name].toolbars[p](options);
			}
		}
		if (co["toolbar_" + p +  "_widget"]) {
			out += run(co["toolbar_" + p +  "_widget"]);
		}
		out += "</div>";
		return out;
	},
	
	scorecardColumnelement: function(rowType, columnelement) {
		"use strict";
		var out = "",
			tag = "td",
			className = ((columnelement && columnelement.columnelementClassName) ? columnelement.columnelementClassName : ""),
			attr = ((columnelement && columnelement.columnelementAttr) ? columnelement.columnelementAttr : ""),
			bams = [].concat((columnelement && columnelement.columnelementBam) ? columnelement.columnelementBam : []),
			bamCount = bams.length,
			bam,
			i;
		
		if (rowType.indexOf("Header") > -1 || rowType.indexOf("Footer") > -1) {
			tag = "th";
		}
		
		out += "<" + tag + " class=\"" + className + "\" " + attr + "><ul>";
		for (i = 0; i < bamCount; i += 1) {
			bam = bams[i];
			out += DDK.template.render.bam(bam);
		}
		out += "</ul></" + tag + ">";
		return out;
	},
	
	scorecardRow: function(row, columns, rowType, scorecardOptions) {
		"use strict";
		var out = "",
			i,
			co = scorecardOptions,
			groupingKey = (co && co.grouping_key) || "",
			groupingExpanded = (co && co.grouping_expanded) || false,
			className = "ddk-scorecard-row-" + rowType + " " + ((row && row.rowClassName) ? row.rowClassName : "") + (rowType === "GroupHeader" ? " row-grouping-header" : "") + (((rowType === "Cell") && groupingKey && (!groupingExpanded)) ? " ps-hidden" : ""),
			attr = ((row && row.rowAttr) ? row.rowAttr : "") + " data-key=\"" + DDK.char.tilde + groupingKey + DDK.char.tilde + "\"" + (((rowType.indexOf("Header") === -1) && co.mouseover) ? " data-ddk-mouseover=\"" + co.mouseover + "\" " : "") + (rowType.indexOf("Header") === -1 ? " data-ddk-detail='" + DDK.template.render.dataDetail() + "' " : ""),
			column,
			columnCount = columns.length,
			columnelement,
			columnMetric,
			columnMetricName,
			columnMetricDisplay,
			columnMetricParameters;
		
		if (columnCount) { 
			out += "<tr class=\"" + className + "\" " + attr + ">";
			for (i = 0; i < columnCount; i += 1) {
				column = columns[i];
				columnelement = column["column" + rowType];
				columnMetric = (column.columnMetric ? column.columnMetric.split(" ") : undefined);
				columnMetricName = (columnMetric && columnMetric[0] ? columnMetric[0] : "");
				columnMetricDisplay = (columnMetric && columnMetric[1] ? columnMetric[1] : "");
				columnMetricParameters = DDK.template.render.columnMetricParameters({
					columnMetricName: columnMetricName,
					columnMetricDisplay: columnMetricDisplay,
					columns: DDK_COLUMNS
				});
				if (columnelement) {
					out += DDK.template.render.scorecardColumnelement(rowType, columnelement)
						.replace(/{{columnTitle}}/g, column.columnTitle)
						.replace(/{{columnSubtitle}}/g, column.columnSubtitle)
						.replace(/{{columnSpan}}/g, columnCount)
						.replace(/{{trend}}/gi, columnMetricParameters.trend)
						.replace(/{{valueMax}}/g, columnMetricParameters.valueMax)
						.replace(/{{valueMin}}/g, columnMetricParameters.valueMin)
						.replace(/{{valueSum}}/g, columnMetricParameters.valueSum)
						.replace(/{{valueAvg}}/g, columnMetricParameters.valueAvg)
						.replace(/{{prevValue}}/g, columnMetricParameters.prevValue)
						.replace(/{{name}}/gi, columnMetricParameters.name)
						.replace(/{{value}}/gi, columnMetricParameters.value)
						.replace(/{{\w+}}/g, function(match) {
							return ("%%" + columnMetricName + "_" + match.slice(2, -2) + "%%").toUpperCase();
						});
				}
			}
			out += "</tr>";
		}
		
		return out;
	},
	
	ddkKeywordEval: function (value, keywords) {
		var keywordEval = function (match) {
				var key = match.slice(2, -2).toLowerCase();

				// out += DDK.log(key, typeof keywords[key], DDK.renderJSON(keywords));

				if (typeof keywords[key] !== "undefined") {
					return keywords[key];
				}

				return match;
			};
		
		if (typeof value === "string") {
			return value.replace(DDK.regex.ddkKeyword, keywordEval);
		}
		
		return JSON.parse(JSON.stringify(value).replace(DDK.regex.ddkKeyword, keywordEval));
	},
	
	scorecard2Row: function(rowType, co, config, globals, record) {
		"use strict";
		var out = "",
			rowClassName = rowType + " " + config[rowType + "RowClassName"],
			//rowClassName = rowType + " " + config[rowType + "RowClassName"] + 
			//(((rowType === "body") && co.groupingKey && !_.string.toBoolean(co.groupingExpanded)) ? " ps-hidden" : ""),
			rowAttr = config[rowType + "RowAttr"] + 
			(((rowType === "body" || rowType === "group") && co.groupingKey) ? " data-key=\"%%" + co.groupingKey + "%%\" " : "") + 
			(((rowType === "body") && co.mouseover) ? " data-ddk-mouseover=\"" + co.mouseover + "\" " : "") + 
			(rowType === "body"  ? " data-ddk-detail='" + DDK.renderJSON(record) + "' " : ""),
			tagName = (rowType === "body" ? "td" : "th"),
			sectionTypes = "header content footer".split(" "),
			metricParameters,
			columnCount = 0,
			// colspan can only happen when not in grouped or sortable modes
			canColspan = (co.groupingKey || !co.sortEnabled),
			// transform runs .toLowerCase() on all keys to give a clean surface for matching
			keywords = _.transform(_.extend({}, globals, record || {}), function (accumulator, value, key) {
				accumulator[key.toLowerCase()] = value;
			}, {});
		
		out += "<tr class=\"" + rowClassName + "\" " + rowAttr + ">";
		
		_.each(config.columns, function (column, index) {
			var cout = "",
				elem = {},
				columnAttr = "",
				columnClassName = "";
			
			// create elem config object by reducing column config object to only those properties that apply to this rowType
			_.each(column, function (value, key) {
				if (_.string.startsWith(key, rowType)) {
					elem[_.string.camelize(key.slice(rowType.length))] = DDK.template.render.ddkKeywordEval(value, keywords);
				}
			});
			
			// pass column.attr and column.className through ddkKeywordEval as well
			if (column.attr) {
				columnAttr = DDK.template.render.ddkKeywordEval(column.attr, keywords);
			}
			if (column.className) {
				columnClassName = DDK.template.render.ddkKeywordEval(column.className, keywords);
			}
			
			// when colspans are enabled, only render an element if it has defined config properties
			if (canColspan) {
				if (!_.any(elem, function (value, key) {
					if (typeof value === "string") {
						return value;
					}
					
					return !_.isEmpty(value); 
				})) {
					// skip this section in the loop
					return;
				}
			}
			
			// if colspans are enabled, track columnCount
			if (canColspan) {
				columnCount += (+elem.colspan || 1);
			}
			
			// open td/th element
			cout += "<" + tagName;
			// elem classNames are rendered after column classNames so they win
			cout += " class=\"" + columnClassName + " " + elem.className + "\"";
			cout += " data-index=\"" + index.toString() + "\"";
			// if colspans are enabled, create colspan attr
			if (canColspan) {
				cout += (elem.colspan ? " colspan=" + elem.colspan : "");
			}
			// elem attrs are rendered before column attrs so they win
			cout += " " + elem.attr + " " + columnAttr + ">";
			
			_.each(sectionTypes, function (sectionType) {
				var section = {};
				
				// create section config object by reducing elem config object to only those properties that apply to this sectionType
				_.each(elem, function (value, key) {
					if (_.string.startsWith(key, sectionType)) {
						section[_.string.camelize(key.slice(sectionType.length))] = value;
					}
				});
				
				// only render a section if it has defined config properties
				if (!_.any(section, function (value, key) {
					if (typeof value === "string") {
						return value;
					}
					
					return !_.isEmpty(value); 
				})) {
					// skip this section in the loop
					return;
				}
					
				// open section
				cout += "<div";
				cout += " class=\"sc-" + sectionType + " " + section.className + "\"";
				cout += " " + section.attr;
				cout += (section.format ? " data-format=\"" + section.format + "\"" : "");
				cout += (section.format ? " data-format-value=\"" + section.value + "\"" : "");
				cout += (section.style ? " data-format-style=\"" + section.style + "\"" : "");
				cout += ">";
				
				// if there is no format, render value
				if (!section.format) {
					cout += section.value;
				}
				
				// close section
				cout += "</div>";
			});
			
			// close th/td element
			cout += "</" + tagName + ">";
			
			// append to row output
			out += cout;
		});
		
		// if colspans are enabled
		// create an autofill element if there are not enough column elements rendered
		// but only autofill footer if there is a footer already defined
		if (canColspan) {
			if ((columnCount < config.columns.length) && ((rowType !== "footer") || (rowType === "footer" && columnCount))) {
				out += "<" + tagName;
				out += " class=\"autofill\"";
				//out += " configLength=" + config.columns.length.toString();
				//out += " columnCount=" + columnCount.toString();
				out += " colspan=" + (config.columns.length - columnCount).toString() + ">";		
				out += "<div class=\"sc-content\"></div>";
				out += "</" + tagName + ">";
			}
		}
		out += "</tr>";
		
		return out;
	},
	
	keywordAlias: function (str, prefix) {
		// evaluate keyword alias for a given string and prefix
		if (!prefix) {
			return str;
		}
		
		return str.replace(/%{\w+ ?\w*?}%/g, _.memoize(function (match) {
			var attr,
				aggregate,
				metric = prefix.toUpperCase(),
				isNamedMetric,
				columns = _.filter(DDK_COLUMNS, { metric: metric }),
				valueAttrSequence;
			
			match = match.slice(2, -2).toUpperCase().split(" ");
			attr = match[0];
			aggregate = match[1];

			// handle named metrics
			// named metrics are fields like "CALLS" or "TICKETS" used in metrics-as-columns queries
			// instead of fields like "METRIC_VALUE" used in metrics-as-rows queries
			if (metric !== "METRIC") {
				// handle `NAME` attribute on named metrics
				if (attr === "NAME") { return metric; }
				
				isNamedMetric = true;
			}
			
			// handle `TREND` and `RTREND` attribute
			if ((attr === "TREND" && (aggregate || !_.any(columns, { metricAttr: "TREND" }))) || attr === "RTREND") {
				// `TREND` attribute combined with aggregate
				// or when there is no <METRIC>_TREND field
				// as well as `RTREND` attribute (reverse trend)
				// require manually constructing the trend
				
				// columns associated with sequenced metric values ALWAYS end in a number (0-9)
				// and can be sorted as text for the correct sort order
				// _YOY# positive integer
				// _PRV# positive integer
				// _YYYY - valid 4-digit year 1000-2999
				// _YYYY_Q# - valid quarters 1-4
				// _YYYY_W## - valid weeks 01-53
				// _YYYY_MM - valid 2 digit month 01-12
				// _YYYY_MM_DD - valid 2 digit day 01-31
				// _# positive integer from 1 to 999
				valueAttrSequence = _.filter(_.pluck(columns, "metricAttr"), function(value, index) {
					return value.match(/[0-9]$/);
				}).sort();
				
				// check for VALUE metric attribute
				if (_.any(columns, { metricAttr: "VALUE" })) {
					// if there is a VALUE metric attribute, sort order is descending, and VALUE is added to trend as the last value
					// if there is not a VALUE metric attribute, sort order is ascending
					valueAttrSequence.reverse();
					valueAttrSequence.push(isNamedMetric ? "" : "VALUE");
				}
				
				if (attr === "RTREND") {
					// reverse the order (most recent value should be first) for RTREND
					valueAttrSequence.reverse();
				}
				
				// return a constructed trend keyword sequence
				return _.map(valueAttrSequence, function(sequenceAttr) {
					// build a keyword out of the metric name, value sequence attribute, and any aggregate
					return "%%" + metric + (sequenceAttr ? "_" + sequenceAttr : "") + (aggregate ? "_" + aggregate : "") + "%%";
				}).join(",");
			}
			
			// build a keyword out of the metric name, metric attribute, and any aggregate
			// handle `VALUE` attribute on named metrics
			return "%%" + metric + ((attr === "VALUE" && isNamedMetric) ? "" : "_" + attr) + (aggregate ? "_" + aggregate : "") + "%%";	
		}));
	},
	
	dataDetail: function () {
		var detail = {},
			columns = DDK_COLUMNS;
		
		_.each(columns, function (column) {
			var columnName = column.columnName.toLowerCase();
			detail[columnName] = "%%-" + columnName + "%%";
			//detail[columnName] = DDK.char.openBracket + "Replace(Replace(\"" + DDK.char.tilde + columnName + DDK.char.tilde + "\",CHR(34),\"&quot;\"),CHR(39),\"&#39;\")" + DDK.char.closeBracket;
		});
		
		return DDK.renderJSON(detail);
	},
	
	//	dataDetail: function() {
	//		var detail = [],
	//			i,
	//			columns = DDK_COLUMNS,
	//			columnCount = columns.length;
	//		
	//		for (i = 0; i < columnCount; i += 1) {
	//			detail.push(DDK.char.tilde + columns[i].columnName + DDK.char.tilde);
	//		}
	//		
	//		return detail.join(",");
	//	},


	bamset2Bams: function(setSectionType, co, config, globals, record) {
		"use strict";
		var bams = config["set" + _.string.titleize(setSectionType) + "Bams"],
		// transform runs .toLowerCase() on all keys to give a clean surface for matching
		keywords = _.transform(_.extend({}, globals, record || {}), function (accumulator, value, key) {
			accumulator[key.toLowerCase()] = value;
		}, {});

		return DDK.template.render.ddkKeywordEval(_.reduce(bams, DDK.template.render.bamset2Bam, ""), keywords);
	},

	bamset2Bam: function (accumulator, bam, index) {
		var bamSections = "header content footer".split(" ");
		
		accumulator += "\n\n<div class=\"column bam-grid " + bam.bamGridClassName + "\" " + bam.bamGridAttr + ">";
		accumulator += "\n<div class=\"bam " + bam.bamClassName + "\" " + bam.bamAttr + ">";

		_.each(bamSections, function (section) {
			var sectionTitle = _.string.titleize(section);
			
			accumulator += "\n\n<div class=\"row bam-" + section + " " + bam["bam" + sectionTitle + "ClassName"] + " " + bam["bam" + sectionTitle + "GridClassName"] + "\" " + bam["bam" + sectionTitle + "Attr"] + " " + bam["bam" + sectionTitle + "GridAttr"] + ">";
			accumulator += _.reduce(bam["bam" + sectionTitle + "Elements"], DDK.template.render.bamset2Element, "");
			
			// if there were elements in this section
			// finish the final element grid div
			if (bam["bam" + sectionTitle + "Elements"].length) {
				accumulator += "</div>";
			}

			accumulator += "</div>";
		});
		
		accumulator += "</div>";
		accumulator += "</div>";
		
		return accumulator;
	},
	
	bamset2Element: function (accumulator, elem, index) {
		if (!index || elem.elemGridClassName || elem.elemGridAttr) {
			if (index && (elem.elemGridClassName || elem.elemGridAttr)) {
				// if this is not the first element
				// and there is a gridClassName or gridAttr
				// finish the previous grid div
				accumulator += "</div>";
			}
		
			// only start a new grid div if this is the first element
			// or if a gridClassName or gridAttr is defined
			accumulator += "\n\n<div class=\"column element-grid " + elem.elemGridClassName + "\" " + elem.elemGridAttr + ">";
		}
		accumulator += "\n<div class=\"bam-element " + elem.elemClassName + "\" " + elem.elemAttr;
		accumulator += (elem.elemFormat ? " data-format=\"" + elem.elemFormat + "\"" : "");
		accumulator += (elem.elemFormat ? " data-format-value=\"" + elem.elemValue + "\"" : "");
		accumulator += (elem.elemFormatStyle ? " data-format-style=\"" + elem.elemFormatStyle + "\"" : "");		
		accumulator += ">";

		// if there is no format, render value
		if (!elem.elemFormat) {
			accumulator += elem.elemValue;
		}
				
		accumulator += "</div>";
		
		return accumulator;
	},

	navset2Navs: function(setSectionType, co, config, globals, record) {
		"use strict";
		var navs = config["set" + _.string.titleize(setSectionType) + "Navs"],
		// transform runs .toLowerCase() on all keys to give a clean surface for matching
		keywords = _.transform(_.extend({}, globals, record || {}), function (accumulator, value, key) {
			accumulator[key.toLowerCase()] = value;
		}, {});

		return DDK.template.render.ddkKeywordEval(_.reduce(navs, DDK.template.render.navset2Nav, ""), keywords);
	},

	navset2Nav: function (accumulator, nav, index) {
		var navSections = "header content footer".split(" ");
		
		accumulator += "\n\n<div class=\"column nav-grid " + nav.navGridClassName + "\" " + nav.navGridAttr + ">";
		accumulator += "\n<div class=\"nav " + nav.navClassName + "\" " + nav.navAttr + ">";

		_.each(navSections, function (section) {
			var sectionTitle = _.string.titleize(section);
			
			accumulator += "\n\n<div class=\"row nav-" + section + " " + nav["nav" + sectionTitle + "ClassName"] + "\" " + nav["nav" + sectionTitle + "Attr"] + ">";
			accumulator += _.reduce(nav["nav" + sectionTitle + "Elements"], DDK.template.render.navset2Element, "");
			accumulator += "</div>";
		});
		
		accumulator += "</div>";
		accumulator += "</div>";
		
		return accumulator;
	},
	
	navset2Element: function (accumulator, elem, index) {
		var addDataNav = function(elemFormat, config){
				var dataString = "";
				dataString += " data-nav=\"" + elemFormat + "\" ";
				_.each(config, function(item, index){
					if(item){
						dataString += " data-nav-" + _.string.dasherize(index) + " = \"";
						if(typeof(item) === "object"){
							dataString += DDK.unescape.brackets(DDK.renderJSON(item));
						}
						else{
							dataString += item;
						}
						dataString += "\" ";
					}
				});
				return dataString;
			},
			createElem = _.delegator({
				"label": function(options){
					return "<label id=\"" + (options.elemId || "") + "\" data-nav=\"label\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + ">" + options.elemLabel + "</label>";
				},
				"input": function(options){
					return "<input id=\"" + (options.elemId || "") + "\" data-nav=\"input\" placeholder=\"" + options.elemLabel + "\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + " value=\"" + (options.elemConfig && options.elemConfig.value || "") + "\"></input>";
				},
				"button": function(options){
					return "<button id=\"" + (options.elemId || "") + "\" data-nav=\"button\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + " value=\"" + (options.elemConfig && options.elemConfig.value || "") + "\">" + options.elemLabel + "</button>";
				},
				"select2": function(options){
					return "<input id=\"" + (options.elemId || "") + "\" placeholder=\"" + options.elemLabel + "\" class=\"ps-nav-select2 nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + " value=\"" + (options.elemConfig && options.elemConfig.value || "") + "\"></input>";
				},
				"checkbox": function(options){
					var html = "";
					if(options.elemLabel){
						html += "<label>";
					}
					html += "<input id=\"" + (options.elemId || "") + "\" type=\"checkbox\" data-nav=\"checkbox\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + " value=\"" + (options.elemConfig && options.elemConfig.value || "") + "\"></input>";
					if(options.elemLabel){
						html += options.elemLabel + "</label>";
					}
					return html;
				},
				"radio": function(options){				
					var html = "";
					if(options.elemLabel){
						html += "<label>";
					}
					html += "<input id=\"" + (options.elemId || "") + "\" type=\"radio\" data-nav=\"radio\" class=\"nav-element is-plain-button " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + " value=\"" + (options.elemConfig && options.elemConfig.value || "") + "\"></input>";
					if(options.elemLabel){
						html += options.elemLabel + "</label>";
					}
					return html;
				},
				"dateday": function(options){
					return "<div id=\"" + (options.elemId || "") + "\" data-nav=\"dateday\" placeholder=\"" + options.elemLabel + "\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + "></div>";
				},
				"dateweek": function(options){
					return "<div id=\"" + (options.elemId || "") + "\" data-nav=\"dateweek\" placeholder=\"" + options.elemLabel + "\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + "></div>";
				},
				"datemonth": function(options){
					return "<div id=\"" + (options.elemId || "") + "\" data-nav=\"datemonth\" placeholder=\"" + options.elemLabel + "\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + "></div>";
				},
				"datequarter": function(options){
					return "<div id=\"" + (options.elemId || "") + "\" data-nav=\"datequarter\" placeholder=\"" + options.elemLabel + "\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + "></div>";
				},
				"dateyear": function(options){
					return "<div id=\"" + (options.elemId || "") + "\" data-nav=\"dateyear\" placeholder=\"" + options.elemLabel + "\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + "></div>";
				},
				"dateany": function(options){
					return "<div id=\"" + (options.elemId || "") + "\" data-nav=\"dateany\" placeholder=\"" + options.elemLabel + "\" class=\"nav-element " + options.elemClassName + "\" " + options.elemAttr + addDataNav(options.elemFormat, options.elemConfig) + "></div>";
				}
			}, "label");
		
		accumulator += "\n\n<div class=\"column element-grid " + elem.elemGridClassName + "\" " + elem.elemGridAttr + ">";
		
		accumulator += createElem(elem.elemFormat, elem);
		/*
		accumulator += "\n<div class=\"nav-element " + elem.elemClassName + "\" " + elem.elemAttr;
		accumulator += (elem.elemFormat ? " data-format=\"" + elem.elemFormat + "\"" : "");
		accumulator += (elem.elemFormat ? " data-format-value=\"" + elem.elemValue + "\"" : "");
		accumulator += (elem.elemFormatStyle ? " data-format-style=\"" + elem.elemFormatStyle + "\"" : "");		
		accumulator += ">";

		// if there is no format, render value
		if (!elem.elemFormat) {
			accumulator += elem.elemValue;
		}
				
		accumulator += "</div>";
		*/
		accumulator += "</div>";
		
		return accumulator;
	},

	columnMetricParameters: function(columnOptions) {
		var metricName, metricColumns, sequenceValueAttrs,
			nameColumn = "",
			labelColumn = "",
			trendColumn = "",
			currentValueColumn;
		
		// metricName is normalized to UPPERCASE
		metricName = columnOptions.columnMetricName.toUpperCase();
		
		// metricColumns are those where columnMetric matches metricName
		metricColumns = _.filter(columnOptions.columns, function(value, index) {
			return value.columnMetric.toUpperCase() === metricName;
		});
		
		// nameColumn is empty (it is the name of the metric), unless the metric name is actually "METRIC"
		if (metricName === "METRIC") {
			nameColumn = "METRIC_NAME"
				}
		
		// labelColumn is empty unless a LABEL metricAttribute is found
		if (_.any(metricColumns, function(value, index) { return value.columnMetricAttr === "LABEL"; })) {
			labelColumn = metricName + "_LABEL";
		}
		
		// currentValueColumn is empty unless a VALUE metricAttribute is found
		if (_.any(metricColumns, function(value, index) { return value.columnMetricAttr === "VALUE"; })) {
			currentValueColumn = (metricName === "METRIC" ? "METRIC_VALUE" : metricName);
		}
		
		// trendColumn is empty unless a TREND metricAttribute is found
		if (_.any(metricColumns, function(value, index) { return value.columnMetricAttr === "TREND"; })) {
			trendColumn = metricName + "_TREND";
		}
		
		// columns associated with sequenced metric values ALWAYS end in a number (0-9)
		// and can be sorted as text for the correct sort order
		// /_YOY[1-9][0-9]*$/, // _YOY# positive integer
		// /_PRV[1-9][0-9]*$/, // _PRV# positive integer
		// /_[12][0-9]{3}$/, // _YYYY - valid 4-digit year 1000-2999
		// /_[12][0-9]{3}_Q[1-4]$/, // _YYYY_Q# - valid quarters 1-4
		// /_[12][0-9]{3}_W(0[1-9]|[1-4][0-9]|5[0-3])$/, // _YYYY_W## - valid weeks 01-53
		// /_[12][0-9]{3}_(0[1-9]|1[12])$/, // _YYYY_MM - valid 2 digit month 01-12
		// /_[12][0-9]{3}_(0[1-9]|1[12])_(0[1-9]|[12][0-9]|3[01])$/, // _YYYY_MM_DD - valid 2 digit day 01-31
		// /_[1-9][0-9]{0,2}$/ // _# positive integer from 1 to 999
		sequenceValueAttrs = _.filter(_.pluck(metricColumns, "columnMetricAttr"), function(value, index) {
			return value.match(/[0-9]$/);
		}).sort();
		
		// if there is a currentValueColumn, sort order is descending, and currentValueColumn is added to a trend
		// if there is not a currentValueColumn, sort order is ascending
		if (currentValueColumn) {
			sequenceValueAttrs.reverse();
		}
		
		return {
			valueAvg: "%%" + (currentValueColumn ? currentValueColumn : metricName + "_" + _.last(sequenceValueAttrs)) + "_AVG%%",
			valueSum: "%%" + (currentValueColumn ? currentValueColumn : metricName + "_" + _.last(sequenceValueAttrs)) + "_SUM%%",
			valueMin: "%%" + (currentValueColumn ? currentValueColumn : metricName + "_" + _.last(sequenceValueAttrs)) + "_MIN%%",
			valueMax: "%%" + (currentValueColumn ? currentValueColumn : metricName + "_" + _.last(sequenceValueAttrs)) + "_MAX%%",
			prevValue: "%%" + (currentValueColumn ? metricName + "_" + _.last(sequenceValueAttrs) : metricName + "_" + _.last(sequenceValueAttrs, 2)[0]) + "%%",
			name: (labelColumn ? "%%" + labelColumn + "%%" : (nameColumn ? "%%" + nameColumn+ "%%" : metricName)),
			value: "%%" + (currentValueColumn ? currentValueColumn : metricName + "_" + _.last(sequenceValueAttrs)) + "%%",
			trend: (
			trendColumn
			? 
			"%%" + trendColumn + "%%"
			: 
			_.map(sequenceValueAttrs, function(attr, index) {
			return "%%" + metricName + "_" + attr + "%%";
		}).join(",") + 
			// if there is a currentValueColumn append it to sequence values
			(currentValueColumn ? ",%%" + currentValueColumn + "%%" : "")
			)
				};
	
},
	
		bams: function(bams) {
			"use strict";
			var out = "",
				bamCount,
				i;
			
			if (!_.isArray(bams)) {
				bams = [].concat(bams);
			}
			bamCount = bams.length;
			
			if (bamCount > 1 || _.isArray(bams[0])) {
				out += "<li class=\"ddk-bam ddk-bam-array\"><ul>";
				for (i = 0; i < bamCount; i += 1) {
					out += DDK.template.render.bams(bams[i]);
				}
				out += "</ul></li>";
			} else if (bamCount === 1) {
				out += DDK.template.render.bam(bams[0]);
			}
			
			return out;
		},
			
			bam: function(bam) {
				"use strict";
				var out = "",
					attr = (bam.bamAttr || ""),
					autoSize = ((bam.bamAutoSize === undefined) ? true : bam.bamAutoSize),
					className = (bam.bamClassName || ""),
					metric = (bam.bamMetric || ""),
					metricName = (metric.split(" ")[0] || "").toLowerCase(),
					metricDisplay = metric.split(" ")[1] || (metricName ? "currentValue" : ""),
					metricDisplayLayout = parseInt(metric.split(" ")[2], 10) || 0,
					displayLayouts = (DDK.template.metricDisplay[metricDisplay] ? [].concat(DDK.template.metricDisplay[metricDisplay].displayLayout) : undefined),
					metricDisplayTemplate = ((displayLayouts && displayLayouts[metricDisplayLayout]) || ""),
					content = ((metricName && metricDisplayTemplate) ? _.deepExtend(metricDisplayTemplate.bamContent, bam.bamContent) : bam.bamContent),
					footer = ((metricName && metricDisplayTemplate) ? _.deepExtend(metricDisplayTemplate.bamFooter, bam.bamFooter) : bam.bamFooter),
					header = ((metricName && metricDisplayTemplate) ? _.deepExtend(metricDisplayTemplate.bamHeader, bam.bamHeader) : bam.bamHeader),
					title = bam.bamTitle || "",
					subtitle = bam.bamSubtitle ||  "",
					metricParameters,
					i;
				
				//log("bam: metricDisplayTemplate");
				//log(DDK.renderJSON(metricDisplayTemplate));
				//log("bam: content");
				//log(DDK.renderJSON(content));
				//log(typeof header + " -- " + typeof title + " -- " + title + " -- " + DDK.renderJSON(header));
				//out += "<div>" + LogMessage + "</div>";
				
				// set title
				if (!title) {
					if (metricName === "metric") {
						title = "{{name}}";
					} else if (metricDisplay === "metricName" || metricDisplay === "NAME" || metricDisplay === "LABEL") {
						// do nothing
					} else {
						title = _.string.titleize(_.string.titleize(metricName));
					}
				}
				
				// if there is no content, create some!
				if (!content) {
					if (metricName && metricDisplay) {
						// if there is a metricName and metricDisplay but no metricDisplayTemplate (and thus no content), the metricDisplay must be a generic metric attribute
						content = {
							bamsectionSpan: {
								spanValue: "{{" + metricDisplay + "}}"
							}
						};
						
					} else {
						// otherwise, just create a generic blank bam content
						content = {
							bamsectionSpan: {
								spanValue: "{{}}"
							}
						};
					}
					
				}
				
				// if the execution context is a bamset...
				if (isBamset) {
					// build automatic bam header
					if (title && _.isEmpty(header)) {
						header = {
							bamsectionSize: "30%",
							bamsectionSpan: {
								spanValue: "{{bamTitle}}"
							}
						}
							}
					
					// build automatic bam footer
					if (subtitle && _.isEmpty(footer)) {
						footer = {
							bamsectionSize: "15%",
							bamsectionSpan: {
								spanValue: "{{bamSubitle}}"
							}						
						}
							}
				}
				
				//content.bamsectionSize = (100 - ((header && header.bamsectionSize) ? parseInt(header.bamsectionSize, 10) : 0) - ((footer && footer.bamsectionSize) ? parseInt(footer.bamsectionSize, 10) : 0)).toString() + "%";
				content.bamsectionSize = 100;
				if (header) {
					content.bamsectionSize = content.bamsectionSize - ((header && header.bamsectionSize) ? parseInt(header.bamsectionSize, 10) : 0);
				}
				if (footer) {
					content.bamsectionSize = content.bamsectionSize - ((footer && footer.bamsectionSize) ? parseInt(footer.bamsectionSize, 10) : 0);
				}
				
				content.bamsectionSize = content.bamsectionSize.toString() + "%";
				
				out += "<li class=\"ddk-bam ddk-bam-object " + (autoSize ? "ddk-bam-autosize " : "") + className + "\" " + attr + (((autoSize !== true) && (autoSize !== false)) ? (" data-bam-autosize=\"" + autoSize + "\"") : "") + (isBamset ? " data-ddk-mouseover=\"" + K("bamset_mouseover") + "\"" : "") + (isBamset ? " data-ddk-detail=\"" + DDK.template.render.dataDetail() + "\"" : "") + ">";
				
				if (header) {
					out += DDK.template.render.bamsection(header, "header");
				}
				if (content) {
					out += DDK.template.render.bamsection(content, "content");
				}
				if (footer) {
					out += DDK.template.render.bamsection(footer, "footer");
				}
				
				out += "</li>";
				
				//log("bam: metricName");
				//log(metricName);
				//log("bam: metricDisplay");
				//log(metricDisplay);
				
				out = out.replace(/{{bamTitle}}/g, title).replace(/{{bamSubitle}}/g, subtitle)
					
					if (metricName) {
						metricParameters = DDK.template.render.columnMetricParameters({
							columnMetricName: metricName,
							columnMetricDisplay: metricDisplay,
							columns: DDK_COLUMNS
						});
						return out
							.replace(/{{trend}}/gi, metricParameters.trend)
							.replace(/{{valueMax}}/g, metricParameters.valueMax)
							.replace(/{{valueMin}}/g, metricParameters.valueMin)
							.replace(/{{valueSum}}/g, metricParameters.valueSum)
							.replace(/{{valueAvg}}/g, metricParameters.valueAvg)
							.replace(/{{prevValue}}/g, metricParameters.prevValue)
							.replace(/{{name}}/gi, metricParameters.name)
							.replace(/{{value}}/gi, metricParameters.value)
							.replace(/{{\w+}}/g, function(match) {
								return ("%%" + metricName + "_" + match.slice(2, -2) + "%%").toUpperCase();
							});
					} else {
						return out;
					}
			},
				
				bamsection: function(section, sectionType) {
					"use strict";
					var out = "",
						spans = (section.bamsectionSpan ? [].concat(section.bamsectionSpan) : []),
						spanCount = spans.length,
						attr = (section.bamsectionAttr || ""),
						className = (section.bamsectionClassName || ""),
						size = (section.bamsectionSize || ""),
						i;
					
					out += "<div class=\"ddk-bam-" + sectionType + " " + className + "\" " + attr + (size ? " style=\"height: " + size + ";\"" : "") + ">";
					
					for (i = 0; i < spanCount; i += 1) {
						out += spans[i].spanValue ? DDK.template.render.span(spans[i], spanCount) : "";
					}
					
					out += "</div>";
					
					return out;
				},
					
					span: function(span, spanCount) {
						"use strict";
						var out = "",
							attr = (span.spanAttr || ""),
							className = (span.spanClassName || ""),
							value = (span.spanValue || ""),
							format = (span.spanFormat ? JSON.stringify(span.spanFormat) : "");
						// , size = (span.spanSize ? span.spanSize : (Math.floor(100 / spanCount) + "%"));
						
						// out += "<span class=\"ddk-format-span " + className + "\" style=\"width: " + size + ";\" " + attr + (format ? " data-format='" + format + "'" : "") + ">";
						out += "<span class=\"ddk-format-span " + className + "\"" + attr + (format ? " data-format='" + format + "'" : "") + ">";
						out += value;
						out += "</span>";
						
						return out;
					},
						
						header: function () {
							var out = "";
							
							if (cwpo.header_content_widget) {
								out += run(cwpo.header_content_widget);
							} else if (DDK.PAGE_HEADER) {
								if (typeof DDK.PAGE_HEADER.CONTENT === "function") {
									out += DDK.PAGE_HEADER.CONTENT(cwpo);
								} else if (typeof DDK.PAGE_HEADER.CONTENT === "string") {
									out += DDK.PAGE_HEADER.CONTENT;
								}
							} else {
								K("v_menubar_is_page_header", "true");
								K("v_menubar_fcat", "PS_HEADER_MENUBAR");
								out += run("DDK2_Menubar");
							}
							return out;
						}
};

DDK.formatObject = function(obj) {
	var formattedObject = {};
	_.each(obj, function(value, key) {
		var initialCharacter = value.charAt(0),
			coerceMethod = DDK.data.coerceTriggers[initialCharacter];
		
		formattedObject[_.string.camelize(key)] = (typeof coerceMethod === "function" ? coerceMethod(value) : value);
	});
	return formattedObject;
};

// if no version entered, use version 2 or higher
DDK.fnVersionCheck = function (v, n) {
	var a = v? v.split(".") : ("2.0").split("."),
		b = n? n.split(".") : ("2.0.0").split("."),
			i=0,
				f=true;
	
	for (i=0; i<=b.length; i+=1) {
		if (a[i] && parseInt(a[i], 10) < parseInt(b[i],10))
			f = false;
		else if (!a[i])
			break;
	}
	
	return f;
};

DDK.parseScriptBlockMatch = function (match) {
	var out = "";
	
	match = DDK.unescape.brackets(match.slice(2, -2));

	try {
		out = eval(match);
	} catch (e) { 
		out = "DDK Script Block Error -- <code>" + DDK.escape.brackets(e.message) + "</code>. Code: <code>" + DDK.escape.brackets(match) + "</code>";
	}
	
	if (out == null) {
		out = "DDK Script Block Error -- return value is <code>null</code> or <code>undefined</code>. Code: <code>" + DDK.escape.brackets(match) + "</code>";
	}
	
	if (!(typeof out == "string" || typeof out == "number" || typeof out == "boolean")) {
		out = "DDK Script Block Error -- return value is not a string, number, or boolean. Return value: <code>" + DDK.renderJSON(out) + "</code> Code: <code>" + DDK.escape.brackets(match) + "</code>";
	}
	
	//return out;
	return DDK.parseScriptBlocks(out);
};

DDK.parseScriptBlocks = function (str) {
	return str.toString().replace(/%@.+?@%/g, DDK.parseScriptBlockMatch);
};

DDK.evalScriptBlocks = function (str) {
	return DDK.unescape.scriptBlocks(DDK.unescape.escapedScriptBlocks(DDK.parseScriptBlocks(DDK.escape.escapedScriptBlocks(str))));
};