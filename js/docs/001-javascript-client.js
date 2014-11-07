PS.optionsAPI.clientJavaScript = {
	"id": "client_javascript",
	"label": "Client JavaScript",
	"description": "Libraries and Functions included in the DDK Client JavaScript package.",

	"stable": {
		"id": "stable",
		"label": "Stable",
		"description": "Stable JavaScript libraries and functions.",
		"options": {
			"findControls": {
				"id": "find_controls",
				"label": "$.fn.findControls",
				"description": "<p>jQuery plugin to find all DDK Controls inside a container element.</p>",
				"signatures": ["$().findControls()"],
				"notes": "<p>Often used together with <code>reloadControls</code>.</p>",
				"usage": "<pre class='language-javascript'><code>$(\".main-section\").findControls().reloadControls();</code></pre>"
			},

			"reloadControls": {
				"id": "reload_controls",
				"label": "$.fn.reloadControls",
				"description": "<p>jQuery plugin to reload of all DDK Control elements in a jQuery collection.</p>",
				"signatures": ["$().reloadControls()"],
				"notes": "<p>Will load controls in DOM order. Uses a queue to load controls in series so only one AMEngine request is made at a time.</p><p>Use <code>findControls</code> to identify controls inside a container element, then <code>reloadControls</code> to reload them.</p>",
				"usage": "<pre class='language-javascript'><code>$(\".main-section\").findControls().reloadControls();</code></pre>"
			},

			"target": {
				"id": "target",
				"label": "$.target",
				"description": "<p>jQuery extension to resolve a target element identifier.</p>",
				"signatures": ["$.target(identifier)"],
				"arguments": [
					["identifier", "Can be an element id string, a DOM element, a jQuery selector string, or a jQuery collection."]
				],
				"returns": "<p>A jQuery collection containing the identified element(s).</p>"
			},

			"runFav": {
				"id": "run_fav",
				"label": "runFav",
				"description": "<p>Function to retrive and render a favorite from the Metrics Catalog Database. Can render Content, Content List, and Control Favorites.</p>",
				"signatures": ["runFav(target, id, settings)", "runFav(settings)"],
				"arguments": [
					["target", "An element id string, a DOM element, a jQuery selector string, or a jQuery collection."],
					["id", "The name or id (<code>sci_fav_name</code> or <code>sci_fav_id</code>) of the favorite record to be rendered."],
					["settings", "<p>Object containing one or more of the following properties:</p>", [
						["target", "As above."],
						["id", "As above."],
						["name", "As <code>id</code> above. <code>name</code> or <code>id</code> can be used interchangeably in the settings object."],
						["success", "Function executed after control reload is complete. Do not use for control initialization &ndash; use <code>customInit</code> in control JavaScript for that. Success function acts as a callback. For Control Favorites, it is passed two arguments: <code>controlName</code>, <code>controlId</code>."],
						["error", "Function executed in the event of an HTTP request or Data Request Framework processing error. Error function is passed four arguments: <code>xhr</code>, <code>status</code>, <code>message</code>, <code>settings</code>. Target element and favorite id can be retrieved from the settings object."],
						["beforeInit", "Function executed before control initialization."],
						["beforeReload", "Function executed before favorite retrieval HTTP request is sent."],
						["keywords", "Keywords sent with this request only. Will not be set in the global keyword hash."],
						["state", "Url- or JSON-encoded key/value pairs of state keywords applied to rendered control. Keys should use only the state key abbreviation. e.g. to apply a new chart title and turn off automatic chart axis labels: <code>\"&ti=New%20Title&lae=false\"</code> or <code>{ ti: \"New Title\", lae: \"false\" }</code>."],
						["showMask", "If <code>false</code>, will not mask the target element for this request."],
						["favHeader", "Sets favorite record header display options."],
						["favFooter", "Sets favorite record footer display options."],
						["unshift", "Adds request to the front of the reload queue rather than to the back."]
					]]
				],
				"usage": "<pre class='language-javascript'><code>runFav(\"sample_elem_id\", \"SAMPLE_FAV_NAME\", {\n\tshowMask: false,\n\tsuccess: function (name, id) {\n\t\tDDK.info(name, id);\n\t},\n\terror: function (xhr, status, message, settings) {\n\t\tDDK.error(xhr, status, message, settings);\n\t}\n});</code></pre>"
			}
		}
	},
	
	"undocumented": {
		"id": "undocumented",
		"label": "Undocumented",
		"description": "Undocumented JavaScript libraries and functions.",
		"options": {
			"modernizr": {
				"id": "modernizr",
				"label": "Modernizr",
				"description": "",
				"notes": "",
				"version": "2.7.2"
			},
			"jQuery": {
				"id": "jquery",
				"label": "jQuery",
				"description": "",
				"notes": "",
				"version": "2.1.1"
			},
			"jQueryMigrate": {
				"id": "jquery_migrate",
				"label": "jQuery Migrate",
				"description": "",
				"notes": "",
				"version": "1.2.1"
			},
			"jQueryUI": {
				"id": "jquery_ui",
				"label": "jQuery UI",
				"description": "",
				"notes": "",
				"version": "1.10.3"
			},
			
			
			"loDash": {
				"id": "lo_dash",
				"label": "Lo-Dash",
				"description": "",
				"notes": "",
				"version": "2.4.1"
			},

			
			"loDashString": {
				"id": "lo_dash_string",
				"label": "Lo-Dash String",
				"description": "",
				"notes": ""
			},
			
			"backbone": {
				"id": "backbone",
				"label": "Backbone",
				"description": "",
				"notes": "",
				"version": "1.1.0"
			},
			
			"backboneEpoxy": {
				"id": "backbone_epoxy",
				"label": "Backbone Epoxy",
				"description": "",
				"notes": ""
			},
			
			"moment": {
				"id": "moment",
				"label": "Moment",
				"description": "",
				"notes": "",
				"version": "2.3.1"
			},
			
			"momentDurationFormat": {
				"id": "moment_duration_format",
				"label": "Moment Duration Format",
				"description": "",
				"notes": "",
				"version": "1.2.1"
			},
			
			"numeral": {
				"id": "numeral",
				"label": "Numeral",
				"description": "",
				"notes": "",
				"version": "1.5.1"
			},
			
			"ratio": {
				"id": "ratio",
				"label": "Ratio",
				"description": "",
				"notes": "",
				"version": "0.4.0"
			},
			
			
			"K": {
				"id": "k",
				"label": "K",
				"description": "",
				"notes": ""
			},

			"run": {
				"id": "run",
				"label": "run",
				"description": "",
				"notes": ""
			},

			"load": {
				"id": "load",
				"label": "load",
				"description": "",
				"notes": ""
			}
			
		},
		
		"ujQueryExtensions": {
			"id": "undocumented_jquery_extensions",
			"label": "jQuery Extensions",
			"description": "Undocumented jQuery extensions.",
			"options": {
				"topZ": {
					"id": "top_z",
					"label": "$.topZ",
					"description": "",
					"notes": ""
				},
				"loadScript": {
					"id": "load_script",
					"label": "$.loadScript",
					"description": "",
					"notes": ""
				},
				"createStylesheet": {
					"id": "create_stylesheet",
					"label": "$.createStylesheet",
					"description": "",
					"notes": ""
				},
			}
		},
		
		"ujQueryPlugins": {
			"id": "undocumented_jquery_plugins",
			"label": "jQuery Plugins",
			"description": "Undocumented jQuery plugins.",
			"options": {
				"isControl": {
					"id": "is_control",
					"label": "$.fn.isControl",
					"description": "",
					"notes": ""
				},
				"resizeControls": {
					"id": "resize_controls",
					"label": "$.fn.resizeControls",
					"description": "",
					"notes": ""
				},
				"initControls": {
					"id": "init_controls",
					"label": "$.fn.initControls",
					"description": "",
					"notes": ""
				},
				"parentControl": {
					"id": "parent_control",
					"label": "$.fn.parentControl",
					"description": "",
					"notes": ""
				},
				"closestControlGroup": {
					"id": "closest_control_group",
					"label": "$.fn.closestControlGroup",
					"description": "",
					"notes": ""
				},
				"controlData": {
					"id": "control_data",
					"label": "$.fn.controlData",
					"description": "",
					"notes": ""
				},
				"dataStack": {
					"id": "data_stack",
					"label": "$.fn.dataStack",
					"description": "",
					"notes": ""
				},
				"editor": {
					"id": "editor",
					"label": "$.fn.editor",
					"description": "",
					"notes": ""
				},
				"rowspan": {
					"id": "rowspan",
					"label": "$.fn.rowspan",
					"description": "",
					"notes": ""
				},
				"reverse": {
					"id": "reverse",
					"label": "$.fn.reverse",
					"description": "",
					"notes": ""
				},
				"totalHeight": {
					"id": "total_height",
					"label": "$.fn.totalHeight",
					"description": "",
					"notes": ""
				},
				"scaleAreas": {
					"id": "scale_areas",
					"label": "$.fn.scaleAreas",
					"description": "",
					"notes": ""
				},
				"maxWidth": {
					"id": "max_width",
					"label": "$.fn.maxWidth",
					"description": "",
					"notes": ""
				},
				"maxHeight": {
					"id": "max_height",
					"label": "$.fn.maxHeight",
					"description": "",
					"notes": ""
				},
				"breakTableByWidthStack": {
					"id": "break_table_by_width",
					"label": "$.fn.breakTableByWidth",
					"description": "",
					"notes": ""
				},
				"breakTableByHeight": {
					"id": "break_table_by_height",
					"label": "$.fn.breakTableByHeight",
					"description": "",
					"notes": ""
				}
			}
		},
		
		"uKExtensions": {
			"id": "undocumented_k_extensions",
			"label": "K Extensions",
			"description": "Undocumented K extensions.",
			"options": {
				"remove": {
					"id": "remove",
					"label": "K.remove",
					"description": "",
					"notes": ""
				},
				"flush": {
					"id": "flush",
					"label": "K.flush",
					"description": "",
					"notes": ""
				},
				"toURL": {
					"id": "to_url",
					"label": "K.toURL",
					"description": "",
					"notes": ""
				},
				"toObject": {
					"id": "to_object",
					"label": "K.toObject",
					"description": "",
					"notes": ""
				},
				"toRequestData": {
					"id": "to_request_data",
					"label": "K.toRequestData",
					"description": "",
					"notes": ""
				},
				"toRequestURL": {
					"id": "to_request_url",
					"label": "K.toRequestURL",
					"description": "",
					"notes": ""
				},
				"setDefault": {
					"id": "set_default",
					"label": "K.setDefault",
					"description": "",
					"notes": ""
				},
				"fromQueryString": {
					"id": "from_query_string",
					"label": "K.fromQueryString",
					"description": "",
					"notes": ""
				},
				"eval": {
					"id": "eval",
					"label": "K.eval",
					"description": "",
					"notes": ""
				},
				"GC": {
					"id": "gc",
					"label": "K.GC",
					"description": "",
					"notes": ""
				}
			}
		},
			
		"uLoDashExtensions": {
			"id": "undocumented_lodash_extensions",
			"label": "Lo-Dash Extensions",
			"description": "Undocumented Lo-Dash extensions.",
			"options": {
				"delegator": {
					"id": "delegator",
					"label": "_.delegator",
					"description": "",
					"notes": ""
				},
				"collate": {
					"id": "collate",
					"label": "_.collate",
					"description": "",
					"notes": ""
				},
				"collateTree": {
					"id": "collate_tree",
					"label": "_.collateTree",
					"description": "",
					"notes": ""
				}
				
				,
				"guid": {
					"id": "guid",
					"label": "_.guid",
					"description": "",
					"notes": ""
				},
				"prune": {
					"id": "prune",
					"label": "_.prune",
					"description": "",
					"notes": ""
				},
				"isRealNumber": {
					"id": "is_real_number",
					"label": "_.isRealNumber",
					"description": "",
					"notes": ""
				},
				"isPositiveInteger": {
					"id": "is_positive_integer",
					"label": "_.isPositiveInteger",
					"description": "",
					"notes": ""
				},
				"zipNestedObject": {
					"id": "zip_nested_object",
					"label": "_.zipNestedObject",
					"description": "",
					"notes": ""
				},
				"isPairsArray": {
					"id": "is_pairs_array",
					"label": "_.isPairsArray",
					"description": "",
					"notes": ""
				},
				"hasData": {
					"id": "has_data",
					"label": "_.hasData",
					"description": "",
					"notes": ""
				},
				"hasNumericData": {
					"id": "has_numeric_data",
					"label": "_.hasNumericData",
					"description": "",
					"notes": ""
				},
				"toRecordObjects": {
					"id": "to_record_objects",
					"label": "_.toRecordObjects",
					"description": "",
					"notes": ""
				},
				"toRecordArrays": {
					"id": "to_record_arrays",
					"label": "_.toRecordArrays",
					"description": "",
					"notes": ""
				},
				"create_case_converter": {
					"id": "createCaseConverter",
					"label": "_.createCaseConverter",
					"description": "",
					"notes": ""
				},
				"toUpperCase": {
					"id": "to_upper_case",
					"label": "_.toUpperCase",
					"description": "",
					"notes": ""
				}
				
				,
				"toLowerCase": {
					"id": "to_lower_case",
					"label": "_.toLowerCase",
					"description": "",
					"notes": ""
				},
				"isWidgetName": {
					"id": "is_widget_name",
					"label": "_.isWidgetName",
					"description": "",
					"notes": ""
				},
				"isModuleName": {
					"id": "is_module_name",
					"label": "_.isModuleName",
					"description": "",
					"notes": ""
				},
				"isTemplateName": {
					"id": "is_template_name",
					"label": "_.isTemplateName",
					"description": "",
					"notes": ""
				},
				"toCase": {
					"id": "to_case",
					"label": "_.toCase",
					"description": "",
					"notes": ""
				},
				"overlay": {
					"id": "overlay",
					"label": "_.overlay",
					"description": "",
					"notes": ""
				},
				"overlayValue": {
					"id": "overlay_value",
					"label": "_.overlayValue",
					"description": "",
					"notes": ""
				},
				"favTreeToOptionGroup": {
					"id": "fav_tree_to_option_group",
					"label": "_.favTreeToOptionGroup",
					"description": "",
					"notes": ""
				}
			}
		},
		
		"uLoDashStringExtensions": {
			"id": "undocumented_lodash_string_extensions",
			"label": "Lo-Dash String Extensions",
			"description": "Undocumented Lo-Dash String extensions.",
			"options": {
				"nameify": {
					"id": "nameify",
					"label": "_.str.nameify",
					"description": "",
					"notes": ""
				},
				"toBoolean": {
					"id": "to_boolean",
					"label": "_.str.toBoolean",
					"description": "",
					"notes": ""
				},
				"isQueryString": {
					"id": "is_query_string",
					"label": "_.str.isQueryString",
					"description": "",
					"notes": ""
				},
				"parseJSON": {
					"id": "parse_json",
					"label": "_.str.parseJSON",
					"description": "",
					"notes": ""
				},
				"parseQueryString": {
					"id": "parse_query_string",
					"label": "_.str.parseQueryString",
					"description": "",
					"notes": ""
				},
				"parse": {
					"id": "parse",
					"label": "_.str.parse",
					"description": "",
					"notes": ""
				},
				"parseTaggedList": {
					"id": "parse_tagged_list",
					"label": "_.str.parseTaggedList",
					"description": "",
					"notes": ""
				},
				"coerce": {
					"id": "coerce",
					"label": "_.str.coerce",
					"description": "",
					"notes": ""
				}
			}
		},
		
		"undocumentedEtc": {
			"id": "undocumented_etc",
			"label": "Undocumented Etc.",
			"description": "Undocumented JavaScript libraries and functions that aren't yet part of the optionsAPI.",
			"options": {}
		}
	}

};


var undocumentedAPI = [
	//AMEngine AJAX API
	//GlobalVars  (Dashboard Ajax Api)
	'daa_showloading=false;',
	'daa_polling=50;',
	'daa_urlitem="";  //append to URL',
	'daa_cursor="";',
	'daa_showerror=true;',
	'daa_returnfunction;',
	'daa_showmask;',
	'daa_detectlogin=true;',
	'daa_serialize=true;',
	'daa_showmask = true;',
	'$.am',
	'$.fn.am',
	'naturalSort',
	'overlib',
	'nd',

	//PS
	'PS.extend',
	'PS.AM.sync',
	'PS.FilterSettings',
	'PS.FilterSettings.test',
	'PS.Formatter',
	'PS.Formatter.formats',
	'PS.Formatter.typeMap',
	'PS.Formatter.register',
	'PS.Formatter.registerStyle',
	'PS.Formatter.colorRange',
	'PS.Formatter.colorRange.red',
	'PS.Formatter.colorRange.yellow',
	'PS.Formatter.colorRange.green',
	'PS.Formatter.colorRange.blue',
	'PS.Formatter.colorRange.gray',
	'PS.Formatter.colorRange.neutral',
	'PS.Formatter.colorRange.grey',
	'PS.Formatter.fn.getSettings',
	'PS.Formatter.fn.defaults',
	'PS.Formatter.fn.text',
	'PS.Formatter.fn.html',
	'PS.Formatter.fn.auto',
	'PS.Formatter.fn.number',
	'PS.Formatter.fn.currency',
	'PS.Formatter.fn.date',
	'PS.Formatter.fn.time',
	'PS.Formatter.fn.chart',
	'PS.Formatter.fn.bar',
	'PS.Formatter.fn.stackedbar',
	'PS.Formatter.fn.stackedbar100',
	'PS.Formatter.fn.arrow',
	'PS.Formatter.fn.bulb',
	'PS.Formatter.fn.percent',
	'PS.Formatter.calcs',
	'PS.Formatter.calcs.percentChange',
	'PS.Formatter.calcs.change',
	'PS.NavFormatter',
	'PS.NavFormatter.formats',
	'PS.NavFormatter.register',
	'PS.NavFormatter.registerStyle',
	'PS.NavFormatter.fn.data',
	'PS.NavFormatter.fn.getSettings',
	'PS.NavFormatter.fn.defaults',
	'PS.NavFormatter.fn.date',
	'PS.NavFormatter.fn.date.defaults',
	'PS.NavFormatter.fn.functions',
	'PS.NavFormatter.fn.functions.getColumnIndex',
	'PS.NavFormatter.fn.functions.ajaxSetup',
	'PS.NavFormatter.fn.functions.initSelection',
	'PS.NavFormatter.fn.functions.format',
	'PS.NavFormatter.fn.functions.setData',
	'PS.NavFormatter.fn.functions.updateCache',
	'PS.NavFormatter.fn.functions.localDataSetup',
	'PS.NavFormatter.fn.functions.createDateType',
	'PS.NavFormatter.fn.functions.initDate',
	'PS.NavFormatter.fn.functions.mapDateFormat',
	'PS.NavFormatter.fn.functions.createNavDate',
	'PS.NavFormatter.fn.select2',
	'PS.NavFormatter.fn.dateday',
	'PS.NavFormatter.fn.dateweek',
	'PS.NavFormatter.fn.datemonth',
	'PS.NavFormatter.fn.datequarter',
	'PS.NavFormatter.fn.dateyear',
	'PS.NavFormatter.fn.datecustom',
	'PS.NavFormatter.fn.checkbox',
	'PS.NavFormatter.fn.radio',
	'PS.NavFormatter.fn.input',
	'PS.MC.Models.Record.Base',
	'PS.MC.Models.Record.FavoriteCategory',
	'PS.MC.Models.Record.Favorite',
	'PS.MC.Models.Record.FavoriteRel',
	'PS.MC.Models.Record.FavoriteCatRel',
	'PS.MC.Models.Record.FavoriteOrgRel',
	'PS.MC.Models.Option',
	'PS.MC.Models.OptionGroup',
	'PS.MC.Collections.OptionGroups',
	'PS.Toolbar',

	'oldIE',
	'recentIE',
	'PSC_Resize',
	'PSC_Reload',
	'PSC_List_Resize',
	'PSC_List_Reload',
	'PSC_Bamset2_Resize',
	'PSC_Bamset2_Reload',
	'PSC_Navset2_Resize',
	'PSC_Navset2_Reload',
	'PSC_Chart_Delayed_Reload',
	'PSC_Chart_Reload',
	'PSC_Chart_UpdateChart',
	'addColumnFilters',
	'dtSortValue',
	'addDTSortListener',
	'fnCreateColumnFilter',
	'fnCreateInputText',
	'fnCreateSelect',
	'PSC_Table_FilterGlobal',
	'PSC_Table_Reload',
	'PSC_Table_UpdateTable',
	'PSC_Table_Resize',
	'PSC_Table_Resize_Scroll_Body',
	'PSC_Scorecard_Reload',
	'PSC_Scorecard_Resize',
	'PSC_Scorecard_Resize_Scroll_Body',
	'PSC_Tree_Resize',
	'PSC_Tree_Reload',
	'PSC_Tree_Refresh',
	'PSC_Bamset_Reload',
	'PSC_Bamset_Resize',
	'normalizeLevels',
	'resizeBamText',
	'resizeBamsetUL',
	'PSC_Scorecard2_Reload',
	'PSC_Scorecard2_Resize',
	'PSC_Scorecard2_Resize_Scroll_Body',
	'fixColumnSizing',
	'PSC_Chart_Resize',

//DDK
	'DDK.util.stringRepeat',
	'DDK.util.trunc',
	'DDK.util.characterWidths',
	'DDK.util.stringWidth',
	'DDK.focus',
	'DDK.blur',
	'DDK.makeButton',
	'DDK.deleteFavorite',
	'DDK.loadFavorite',
	'DDK.updateFavoriteValue',
	'DDK.displayDialog',
	'DDK.initColorPicker',
	'DDK.loadControls',
	'DDK.pdfGo',
	'DDK.dialog',
	'DDK.dialog2',
	'DDK.mouseover',
	'DDK.writeFavoriteChanges',
	'DDK.initControls',
	'DDK.template',
	'DDK.template.menuItem',
	'DDK.chart.resize',
	'DDK.chart.reload',
	'DDK.chart.data',
	'DDK.chart.setType',
	'DDK.chart.init',
	'DDK.chart.seriesConfig',
	'DDK.chart.title',
	'DDK.chart.resizeDatatable',
	'DDK.chart.updateImage',
	'DDK.table.bAjaxDataGet',
	'DDK.table.resize',
	'DDK.table.reload',
	'DDK.table.data',
	'DDK.table.init',
	'DDK.table.title',
	'DDK.table.defaultOptions',
	'DDK.table.clientOptions',
	'DDK.table.JSONOptions',
	'DDK.table.serverOptions',
	'DDK.tree.resize',
	'DDK.tree.reload',
	'DDK.tree.refresh',
	'DDK.tree.data',
	'DDK.tree.init',
	'DDK.tree.title',
	'DDK.tree.defaultOptions',
	'DDK.scorecard.resize',
	'DDK.scorecard.reload',
	'DDK.scorecard.data',
	'DDK.scorecard.init',
	'DDK.scorecard.title',
	'DDK.scorecard.defaultOptions',
	'DDK.scorecard2.',
	'DDK.scorecard2.resize',
	'DDK.scorecard2.reload',
	'DDK.scorecard2.data',
	'DDK.scorecard2.init',
	'DDK.scorecard2.title',
	'DDK.scorecard2.defaultOptions',
	'DDK.bamset.resize',
	'DDK.bamset.reload',
	'DDK.bamset.data',
	'DDK.bamset.init',
	'DDK.list.resize',
	'DDK.list.reload',
	'DDK.list.data',
	'DDK.list.init',
	'DDK.bamset2.resize',
	'DDK.bamset2.reload',
	'DDK.bamset2.data',
	'DDK.bamset2.init',
	'DDK.navset2.resize',
	'DDK.navset2.reload',
	'DDK.navset2.data',
	'DDK.navset2.init',
	'DDK.control.init',
	'DDK.eventHandler',
	'DDK.help',
	'DDK.validate',
	'DDK.accordion',
	'DDK.tabs',
	'DDK.format',
	'DDK.navFormat',
	'DDK.COLUMN_METRIC_TRIGGERS',
	'DDK.regex.closeAngleBracket: /\x3E/g',
	'DDK.regex.openAngleBracket: /\x3C/g',
	'DDK.regex.closeBracket: /\x5D/g',
	'DDK.regex.openBracket: /\x5B/g',
	'DDK.regex.escapedOpenBracket: /\x5C\x5B/g',
	'DDK.regex.escapedCloseBracket: /\x5C\x5D/g',
	'DDK.regex.percentPercent: /%%/g',
	'DDK.regex.atPercent: /@%/g',
	'DDK.regex.percentAt: /%@/g',
	'DDK.regex.singleQuote: /\x27/g',
	'DDK.regex.doubleQuote: /\x22/g',
	'DDK.regex.ampersand: /\x26/g',
	'DDK.regex.underscore: /\x5F/g',
	'DDK.regex.whitespace: /\s+/g',
	'DDK.regex.delimiter: /\s|,/',
	'DDK.regex.backslash: /\x5C/g',
	'DDK.char.closeBracket: String.fromCharCode(93)',
	'DDK.char.doubleQuote: String.fromCharCode(34)',
	'DDK.char.openBracket: String.fromCharCode(91)',
	'DDK.char.reverseSolidus: String.fromCharCode(92)',
	'DDK.char.backslash: String.fromCharCode(92)',
	'DDK.char.singleQuote: String.fromCharCode(39)',
	'DDK.char.tilde: String.fromCharCode(126)',
	'DDK.char.crlf: "\r\n"',
	'DDK.char.space: " "',
	'DDK.char.at: "@"',
	'DDK.escape.angleBrackets',
	'DDK.escape.brackets',
	'DDK.escape.singleQuote',
	'DDK.escape.doubleQuote',
	'DDK.escape.backslash',
	'DDK.unescape.brackets',
	'DDK.unescape.tilde',
	'DDK.unescape.amControlChars',
	'DDK.template.metricDisplay',
	'DDK.log()',
	'DDK.info()',
	'DDK.warn()',
	'DDK.error()',
	'DDK.reloadFromFavoriteQueue',
	'DDK.reloadFromFavoriteLoading',
	'DDK.reloadFromFavorite',
	'DDK.reloadFromFavoriteRequest',
	'DDK.reloadControl',
	'DDK.ease',
	'DDK.pluginsLoad',
	'DDK.addonsLoad',
	'DDK.resourcesLoad',
	'DDK.loadScript',
	'DDK.deferPlugins',
	'DDK.allLoad',
	'DDK.defer',
	'DDK.loadResources',
	'DDK.loadTools',
	'DDK.initStylesheets',
	'DDK.errorLog',
	'reloadControlContainer',
	'runFromFavorite',
	'runFavs',


	'Foundation version 5.2.3',
	'select2 version 3.4.0',
	'jGrowl version 1.2.12',
	//jGrowl config:
	'$.fn.jGrowl.prototype.defaults.theme = "";',
	'$.fn.jGrowl.prototype.defaults.themeState = "";',
	'Sparkline version 2.1.2',
	'qTip2 version 2.1.1',
	'DataTables version 1.9.4',
	//DataTables extensions:
	'dataTableExt.oApi.fnGetColumnIndex',
	'dataTableExt.oApi.fnGetDisplayNodes',
	'dataTableExt.oApi.fnGetColumnData',
	'dataTableExt.oApi.fnGetFilteredData',
	'dataTableExt.oApi.fnGetFilteredNodes',
	'dataTableExt.oSort["ddk-formatted-asc"]',
	'dataTableExt.oSort["ddk-formatted-desc"]',
	'dataTableExt.oSort["ddk-scorecard2-asc"]',
	'dataTableExt.oSort["ddk-scorecard2-desc"]',
	'dataTableExt.oSort["num-html-asc"]',
	'dataTableExt.oSort["num-html-desc"]',
	'dataTableExt.oSort["natural-asc"]',
	'dataTableExt.oSort["natural-desc"]',
	'ddkScorecardSortValue',
	'ddkScorecardSort',
	'jsTree version 3.0.4',
	'FooTable version 2.0.1.4',
	'filter',
	'paginate',
	'sort',
	'striping',
	'CodeMirror version 4.1.0',
	'JavaScript Hint',
	'JavaScript',
	'SQL',
	'SQL Hint',
	'closebrackets',
	'matchbrackets',
	'JSHint version 2.1.11',
	'Prism',
	'DDK.validate.numberIntegerList',
	'DDK.validate.numberFloatList',
	'DDK.validate.numberInteger',
	'DDK.validate.numberFloat',
	'DDK.validate.textSafe',
	'DDK.validate.textSafeList',
	'DDK.validate.labelSafe',
	'DDK.validate.wordSafe',
	'DDK.validate.nameSafe',
	'DDK.validate.email',
	'DDK.validate.textAreaSafe',
	'$document',
	'keywordupdateHandler',
	'navGoHandler',
	'PS.optionsAPI',
	'Scorecard2 Config Dialog',
	'Navset2 Config Dialog',
	'Bamset2 Config Dialog',
	'DDK.pluginsLoad.resolve();',
	'DDK.addonsLoad.resolve();'
];	

//Event Handlers
//	$document.on("click", "button.ddk-chart-series-config", DDK.chart.seriesConfig);
//	$document.on("click", "input.ddk-color:not(.loaded)", DDK.initColorPicker);
//	$document.on("click", "button[data-ddk-dialog]", DDK.dialog);
//	$document.on("click", "button[data-ddk-button-action]", DDK.eventHandler);
//	$document.on("change keyup", "input[data-ddk-validate], textarea[data-ddk-validate]", DDK.validate);
//	$document.on("click", ".ddk-dropdown", DDK.dropdown.show);
//	$document.on("click", DDK.dropdown.hide);

	// initialize DDK Mouseovers on initial document content
//	$("[data-ddk-mouseover]").each(DDK.mouseover);
	
//	$document.on("keywordupdate", keywordupdateHandler);
//	$document.on("click", ".nav-go", navGoHandler);

//	$(window).on("resize", _.debounce(function () { $(document).findControls().resizeControls(); }, 250));

//	$(document).on("contentloaded", function () {...});



/*
---------------------------------
-- not included in initial API --
---------------------------------

jQuery UI fixes:
	$.ui.dialog.prototype._allowInteraction
	$.ui.tabs.prototype._setupHeightStyle
	$.ui.tabs.prototype._getList

jQuery Function Wrappers
	$.fn.empty

jQuery Plugins:
	$.fn.reload // deprecated
	$.fn.reloadControlsQueue // deprecated
	$.fn.convertToHtmlTable
	$.fn.appendEachCol
	$.fn.expandControlTableParents

	http://mths.be/placeholder v2.0.7 by @mathias
	jQuery BBQ: Back Button & Query Library - v1.2.1
	jQuery hashchange event - v1.2

	Lo-Dash String (_.str or _.string)
	_.str.isBlank
	_.str.stripTags
	_.str.capitalize
	_.str.chop
	_.str.clean
	_.str.count
	_.str.chars
	_.str.swapCase
	_.str.escapeHTML
	_.str.unescapeHTML
	_.str.escapeRegExp
	_.str.splice
	_.str.insert
	_.str.contains
	_.str.join
	_.str.lines
	_.str.reverse
	_.str.startsWith
	_.str.endsWith
	_.str.succ
	_.str.titleize
	_.str.camelize
	_.str.underscored
	_.str.dasherize
	_.str.classify
	_.str.humanize
	_.str.trim
	_.str.ltrim
	_.str.rtrim
	_.str.truncate
	_.str.prune
	_.str.words
	_.str.pad
	_.str.lpad
	_.str.rpad
	_.str.lrpad
	_.str.toNumber
	_.str.numberFormat
	_.str.strRight
	_.str.strRightBack
	_.str.strLeft
	_.str.strLeftBack
	_.str.toSentence
	_.str.slugify
	_.str.surround
	_.str.quote
	_.str.repeat
	_.str.levenshtein
	
Backbone Fixes:
	this.options

Backbone and Backbone Epoxy Config:
	Backbone.Epoxy.binding.config({ optionValue: "id" });
	Backbone.emulateHTTP = true;

Moment fixes:
	moment.fn.humanize = _.partial(moment.fn.fromNow, true);
	moment.duration.fn.fromNow = _.partial(moment.duration.fn.humanize, 

	
AMEngine AJAX API
	util.shouldDebug
	util.membersEqual
	util.describe
	util.debug
	util.error
	util.trim
	util.strip
	
	$_
	$C
	Try.these
	
	getElementsByClassName
	extractIFrameBody
	
	DELAY
	steps
	andThen
	log
	createXMLHttpRequest
	
	ajaxCaller

	daaHash
	daaURLGet
	daaURLFlush
	daaGetValue
	daaURLUpdate
	daaHashUpdate
	daaHashGet
	daaHashList
	daaHashSet
	
	reloadMetricNameInto
	reloadMetricInto
	reloadMetricByName
	reloadMetric
	reloadAll
	GetDash
	drawEachMetric
	runDash
	
	$.fn.serializeAnything
	
	ProcessURL3
	
	hideMask
	getInlineStyle
	showMask
	
	ProcessURL2
	
	delay
	
	ProcessURL
	
	getQueryString
	
	getError
	getErrorHtml
	isError
	
	isLoginPage
	checkLoginPage
	
	returnContents
	processReqChange2
	
	
	Hashtable
	
	URLEncode
	URLDecode
	
	getQueryString
	parseQueryString

*/

_.each(undocumentedAPI, function (item, index) {
	PS.optionsAPI.clientJavaScript.undocumented.undocumentedEtc.options["undocumented_" + index.toString()] = {
		id: "undocumented_" + index.toString(),
		label: item
	};
});

