PS.optionsAPI.ddkJavaScript = {
	"id": "client_javascript",
	"label": "Client JavaScript",
	"description": "Libraries and Functions included in the DDK Client JavaScript package.",
	"edit": "https://github.com/jsmreese/ddk2/edit/master/js/docs/001-javascript-client.js",
	"libraries": {
		"id": "libraries",
		"label": "Libraries",
		"description": "Third party libraries.",
		"options": {	
			"modernizr": {
				"id": "modernizr",
				"label": "Modernizr",
				"description": "",
				"url": "http://modernizr.com/",
				"notes": "",
				"version": "2.7.2"
			},
			"jQuery": {
				"id": "jquery",
				"label": "jQuery",
				"description": "",
				"url": "http://jquery.com/",
				"notes": "Version 1.11.1 included in the DDK legacy build (served to IE8 and PDF ouput mode).",
				"version": "2.1.1"
			},
			"jQueryMigrate": {
				"id": "jquery_migrate",
				"label": "jQuery Migrate",
				"description": "",
				"url": "http://jquery.com/",
				"notes": "The minified version of jQuery Migrate is included, so deprecated jQuery API calls will not genrate error messages.",
				"version": "1.2.1"
			},
			"jQueryUI": {
				"id": "jquery_ui",
				"label": "jQuery UI",
				"description": "",
				"url": "http://jqueryui.com/",
				"notes": "",
				"version": "1.10.3"
			},
			
			
			"loDash": {
				"id": "lo_dash",
				"label": "Lo-Dash",
				"description": "",
				"url": "http://lodash.com/",
				"notes": "DDK standard build includes the Lo-Dash modern build. DDK legacy build includes the Lo-Dash compat build.",
				"version": "2.4.1"
			},

			
			"loDashString": {
				"id": "lo_dash_string",
				"label": "Lo-Dash String",
				"description": "",
				"url": "http://github.com/jsmreese/underscore.string/",
				"notes": "A custom fork of the Underscore.String project."
			},
			
			"backbone": {
				"id": "backbone",
				"label": "Backbone",
				"description": "",
				"url": "http://backbonejs.org/",
				"notes": "",
				"version": "1.1.0"
			},
			
			"backboneEpoxy": {
				"id": "backbone_epoxy",
				"label": "Backbone Epoxy",
				"description": "",
				"url": "http://epoxyjs.org/index.html",
				"notes": ""
			},
			
			"moment": {
				"id": "moment",
				"label": "Moment",
				"description": "",
				"url": "http://momentjs.com/",
				"notes": "",
				"version": "2.3.1"
			},
			
			"momentDurationFormat": {
				"id": "moment_duration_format",
				"label": "Moment Duration Format",
				"description": "",
				"url": "https://github.com/jsmreese/moment-duration-format",
				"notes": "",
				"version": "1.2.1"
			},
			
			"numeral": {
				"id": "numeral",
				"label": "Numeral",
				"description": "",
				"url": "http://adamwdraper.github.com/Numeral-js/",
				"notes": "",
				"version": "1.5.1"
			},
			
			"ratio": {
				"id": "ratio",
				"label": "Ratio",
				"description": "",
				"url": "http://larrybattle.github.io/Ratio.js/",
				"notes": "",
				"version": "0.4.0"
			},
			
			"foundation": {
				"id": "foundation",
				"label": "Foundation",
				"url": "http://foundation.zurb.com/",
				"version": "5.2.3"
			},
			"select2": {
				"id": "select2",
				"label": "Select 2",
				"url": "http://ivaynberg.github.io/select2/",
				"version": "3.4.0"
			},
			"jgrowl": {
				"id": "jgrowl",
				"label": "jGrowl",
				"url": "https://github.com/stanlemon/jGrowl",
				"version": "1.2.12"
			},

			"sparkline": {
				"id": "sparkline",
				"label": "Sparkline",
				"url": "http://omnipotent.net/jquery.sparkline/",
				"version": "2.1.2"
			},
			"qtip2": {
				"id": "qtip2",
				"label": "qTip2",
				"url": "http://craigsworks.com/projects/qtip2/",
				"version": "2.1.1"
			},
			"datatables": {
				"id": "datatables",
				"label": "DataTables",
				"url": "http://datatables.net/",
				"version": "1.9.4"
			},

			"jstree": {
				"id": "jstree",
				"label": "jsTree",
				"url": "http://jstree.com/",
				"version": "3.0.4"
			},
			"footable": {
				"id": "footable",
				"label": "FooTable",
				"description": "Includes filter, paginate, sort, and striping plugins.",
				"url": "http://http://themergency.com/footable/",
				"version": "2.0.1.4"
			},

			"codemirror": {
				"id": "code_mirror",
				"label": "CodeMirror",
				"description": "Includes JS Hint, JavaScript, SQL, SQL Hint, closebrackets, and matchbrackets plugins.",
				"url": "http://codemirror.net/index.html",
				"version": "4.1.0"
			},

			"js_hint": {
				"id": "js_hint",
				"label": "JSHint",
				"url": "http://www.jshint.com/",
				"version": "2.1.11"
			},
			"prism": {
				"id": "prism",
				"label": "Prism",
				"url": "http://prismjs.com/"
			},
			"naturalSort": {
				"id": "natural_sort",
				"label": "Natural Sort",
				"url": "https://github.com/overset/javascript-natural-sort",
				"version": "0.6"
			}

		}
	},
			
	"stable": {
		"id": "stable",
		"label": "Stable",
		"description": "Stable functions.",
		"options": {
			"findControls": {
				"id": "jquery_fn_find_controls",
				"label": "$.fn.findControls",
				"description": "<p>jQuery plugin.</p><p>Used to find DDK Controls inside a containing collection.</p>",
				"syntax": ["$().findControls()"],
				"returns": "<p>A jQuery collection of the identified control element(s).</p>",
				"notes": "<p>Will search for DDK Controls among all the descendant elements of a jQuery collection, and will return the resulting collection of DDK Controls.</p><p>For each of the calling collection's elements, will find descendant control elements in DOM order.</p><p>Often used together with <code>reloadControls</code>.</p><p>Do not apply this method to the <code>$(document)</code> collection. That will find controls such as the list control used in the page header menu, in addition to the expected content controls.</p>",
				"usage": "<p>In the DDK Responsive Template, the <code>.main-section</code> element wraps page content.</p><pre class='language-javascript'><code>$(\".main-section\").findControls().reloadControls();</code></pre><p>In the DDK Layout Template, the <code>#ddk_page_content</code> element wraps page content.</p><pre class='language-javascript'><code>$(\"#ddk_page_content\").findControls().reloadControls();</code></pre>"
			},

			"reloadControls": {
				"id": "jquery_fn_reload_controls",
				"label": "$.fn.reloadControls",
				"description": "<p>jQuery plugin.</p><p>Used to reload all DDK Controls that are members of a jQuery collection.</p>",
				"syntax": ["$().reloadControls()"],
				"returns": "<p>The calling jQuery collection.</p>",
				"notes": "<p>Will load controls in the order they appear in the calling collection. Uses a queue to load controls in series so only one AMEngine request is made at a time.</p><p>Use <code>findControls</code> to identify controls inside a container element, then <code>reloadControls</code> to reload them.</p><p>Do not apply this method to the <code>$(document)</code> collection. That will reload controls such as the list control used in the page header menu, in addition to the expected content controls.</p>",
				"usage": "<p>In the DDK Responsive Template, the <code>.main-section</code> element wraps page content.</p><pre class='language-javascript'><code>$(\".main-section\").findControls().reloadControls();</code></pre><p>In the DDK Layout Template, the <code>#ddk_page_content</code> element wraps page content.</p><pre class='language-javascript'><code>$(\"#ddk_page_content\").findControls().reloadControls();</code></pre>"
			},

			"resizeControls": {
				"id": "jquery_fn_resize_controls",
				"label": "$.fn.resizeControls",
				"description": "<p>jQuery plugin.</p><p>Used to resize all DDK Controls that are members of a jQuery collection.</p>",
				"syntax": ["$().resizeControls()"],
				"returns": "<p>The calling jQuery collection.</p>",
				"notes": "<p>In most situations control resizing is automatically executed by the DDK Responsive and Layout Templates (on window resize, pane resize, etc.) This function should be used only for manual control resize.</p><p>Will resize controls in the order they appear in the calling collection.</p><p>Use <code>findControls</code> to identify controls inside a container element, then <code>resizeControls</code> to resize them.</p><p>Do not apply this method to the <code>$(document)</code> collection. That will resize controls such as the list control used in the page header menu, in addition to the expected content controls.</p>",
				"usage": "<p>In the DDK Responsive Template, the <code>.main-section</code> element wraps page content.</p><pre class='language-javascript'><code>$(\".main-section\").findControls().resizeControls();</code></pre><p>In the DDK Layout Template, the <code>#ddk_page_content</code> element wraps page content.</p><pre class='language-javascript'><code>$(\"#ddk_page_content\").findControls().resizeControls();</code></pre>"
			},
			"initControls": {
				"id": "jquery_fn_init_controls",
				"label": "$.fn.initControls",
				"description": "<p>jQuery plugin.</p><p>Used to initialize all DDK Controls that are members of a jQuery collection.</p>",
				"syntax": ["$().initControls()"],
				"returns": "<p>The calling jQuery collection.</p>",
				"notes": "<p>In most situations control initialization is automatically executed by the DDK Responsive and Layout Templates (on dashboard load, favorite load, control load, etc.) This function should be used only for manual control initialization.</p><p>Control initialization refers to executing client JavaScript associated with a DDK Control, such as calling DataTables on a DDK Table Control's table element. This will also invoke any <code>customInit</code> functions attached to a control.</p><p>Will initialize controls in the order they appear in the calling collection.</p><p>Use <code>findControls</code> to identify controls inside a container element, then <code>initControls</code> to initialize them.</p>",
				"usage": "<p>In the DDK Responsive Template, the <code>.main-section</code> element wraps page content.</p><pre class='language-javascript'><code>$(\".main-section\").findControls().initControls();</code></pre><p>In the DDK Layout Template, the <code>#ddk_page_content</code> element wraps page content.</p><pre class='language-javascript'><code>$(\"#ddk_page_content\").findControls().initControls();</code></pre>"
			},
			"parentControl": {
				"id": "jquery_fn_parent_control",
				"label": "$.fn.parentControl",
				"description": "<p>jQuery plugin.</p><p>Used to identify the DDK Control element that contains each element in the calling collection.</p>",
				"syntax": ["$().parentControl()"],
				"returns": "<p>A jQuery collection containing the unique set of parent control elements for each element in the calling collection.</p><p>If no parent control elements are identified, will return an empty jQuery collection.",
				"notes": "<p>Use <code>parentControl</code> in an event handler to identify the control associated with an event's target element, then <code>controlData</code> to gather more information about that control.</p>",
				"usage": "<p>In an event handler, the <code>e.currentTarget</code> element refers to the event's generating element.</p><pre class='language-javascript'><code>function (e) {\n\tvar $target, controlData;\n\t$target = $(e.currentTarget);\n\tcontrolData = $target.parentControl().controlData();\n\tDDK.info(controlData);\n}</code></pre>"
			},
			
			"controlData": {
				"id": "jquery_fn_control_data",
				"label": "$.fn.controlData",
				"description": "<p>jQuery plugin.</p><p>Used to find all the meta-data associated with a DDK Control, including the control name and id, as well as control dataset columns, metrics, and metric attributes.</p>",
				"syntax": ["$().controlData()"],
				"returns": "<p>If the calling collection does not have any DDK Control elements, returns <code>null</code>.</p><p>If the calling collection contains a single DDK Control element, returns a single control data object.</p><p>If the calling collection contains multiple DDK Control elements, returns an array of control data objects.</p>",
				"notes": "<p>Use <code>parentControl</code> in an event handler to identify the control associated with an event's target element, then <code>controlData</code> to gather more information about that control.</p>",
				"usage": "<p>In an event handler, the <code>e.currentTarget</code> element refers to the event's generating element.</p><pre class='language-javascript'><code>function (e) {\n\tvar $target, controlData;\n\t$target = $(e.currentTarget);\n\tcontrolData = $target.parentControl().controlData();\n\tDDK.info(controlData);\n}</code></pre>"
			},

			"target": {
				"id": "target",
				"label": "$.target",
				"description": "<p>jQuery extension.</p><p>Used to resolve a target element identifier.</p>",
				"syntax": ["$.target(identifier)"],
				"arguments": [
					["identifier", "<p>Can be an element id string, a DOM element, a jQuery selector string, or a jQuery collection.</p>"]
				],
				"returns": "<p>A jQuery collection of the identified element(s).</p>",
				"notes": "<p>The <code>identifier</code> argument is evaluated first as an element id string, then as a jQuery selector string. In the unlikely event an element's id string is also a valid jQuery selector, the element with that id string would be returned.</p>",
				"usage": "<p>Resolve an element id string into a jQuery collection:</p><pre class='language-javascript'><code>$.target(\"sample_element_id\")</code></pre>"
			},

			"runFav": {
				"id": "run_fav",
				"label": "runFav",
				"description": "<p>Function to retrive and render a favorite from the Metrics Catalog Database. Can render Content, Content List, and Control Favorites.</p>",
				"syntax": ["runFav(target, id [, success|settings])", "runFav(settings)"],
				"arguments": [
					["target", "An element id string, a DOM element, a jQuery selector string, or a jQuery collection."],
					["id", "The name or id (<code>sci_fav_name</code> or <code>sci_fav_id</code>) of the favorite record to be rendered."],
					["success", "Function executed after favorite load is complete. Do not use for control initialization &ndash; use <code>customInit</code> in control JavaScript for that. Success function acts as a callback. For Control Favorites, success function is passed two arguments: <code>controlName</code>, <code>controlId</code>. For Content and Content List Favorites, success function is passed three arguments as per the jQuery.ajax success function: <code>data</code>,<code>staus</code>,<code>xhr</code>."],
					["settings", "<p>Object containing one or more of the following properties:</p>", [
						["target", "As above."],
						["id", "As above."],
						["name", "As <code>id</code> above. <code>name</code> or <code>id</code> can be used interchangeably in the settings object."],
						["success", "As above."],
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
			},

			"runFavs": {
				"id": "run_favs",
				"label": "runFavs",
				"description": "<p>Function to initiate automatic favorite loading using <code>data-fav</code> attributes.</p>",
				"syntax": ["runFavs(target)"],
				"arguments": [
					["target", "An element id string, a DOM element, a jQuery selector string, or a jQuery collection."]
				],
				"notes": "<p>Will load favorites defined by all <code>data-fav</code> attributes on the target element and all descendant elements.</p><p><code>runFavs</code> is called automatically when the DDK Repsonsive Template is loaded, and again on the rendered content from every runFav request.</p><p>This function should be used only to manually initiate favorite loading .</p>"
			},
			
			"run": {
				"id": "run",
				"label": "run",
				"description": "<p>Function to retrive and render a widget from the ActiveMetrics Database.</p>",
				"syntax": ["run(target, widgetName [, keywords] [, success])"],
				"arguments": [
					["target", "An element id string only, NOT a DOM element, jQuery selector string or jQuery collection."],
					["widgetName", "The name of the widget to be rendered."],
					["keywords", "URL-encoded key/value pairs to be included as keywords for this widget request only. These keywords will not be made global in the client keyword hash."],
					["success", "Function to execute after widget is rendered."]
				],
				"notes": "<p><code>run</code> is simply a wrapper for <code>load</code> that requires a target and always inserts the rendered response into the DOM.</p><p>An additional <code>settings</code> object argument is for internal use only and can be used to filter control state keywords from widget requests.</p>"
			},
			
			"load": {
				"id": "load",
				"label": "load",
				"description": "<p>Function to retrive and render a widget from the ActiveMetrics Database.</p>",
				"syntax": ["load(target, widgetName [, keywords] [, success])"],
				"arguments": [
					["target", "An element id string only, NOT a DOM element, jQuery selector string or jQuery collection. Can be <code>null</code> indicating no intended target."],
					["widgetName", "The name of the widget to be rendered."],
					["keywords", "URL-encoded key/value pairs to be included as keywords for this widget request only. These keywords will not be made global in the client keyword hash."],
					["success", "Function to execute after widget is rendered."]
				],
				"notes": "<p>When the <code>load</code> function is given a callback function, it will not automatically insert the rendered widget response into the DOM. <code>load</code> can be used in this way to post-process a rendered widget before DOM insertion, or simply to retrieve raw data.</p><p>An additional <code>settings</code> object argument is for internal use only and can be used to filter control state keywords from widget requests.</p>"
			},

			"K": {
				"id": "k",
				"label": "K",
				"description": "<p>Function to get and set keyword values in the client keyword hash.</p>",
				"syntax": ["K(key|keys|obj|url [, value|values] [, prefix])"],
				"arguments": [
					["key", "A keyword name."],
					["value", "A keyword value."],
					["keys", "An array of keyword names."],
					["values", "An array of keyword values."],
					["obj", "Object of key/value pairs."],
					["url", "URL-encoded list of key/value pairs."],
					["prefix", "Prefix applied to keys before keyword get/set operation."]
				],
				"returns": "<p>Basic getter returns a keyword value, array getter returns an array of keyword values.</p><p>Setter signatures do not return a value.</p>",
				"usage": "<p><code>K</code> can be used to get or set keyword values in many ways:</p><h5>Basic Getter</h5><pre class='language-javascript'><code>K(\"p_key1\");\n// \"Value1\"</code></pre><h5>Basic Setter</h5><pre class='language-javascript'><code>K(\"p_key1\", \"Value1\");</code></pre><h5>Array Getter</h5><pre class='language-javascript'><code>K([\"p_key1\", \"p_key2\"]);\n// [\"Value1\", \"Value2\"]</code></pre><h5>Array Setter</h5><pre class='language-javascript'><code>K([\"p_key1\", \"p_key2\"], [\"Value1\", \"Value2\"]);</code></pre><h5>Object Setter</h5><pre class='language-javascript'><code>K({\n\tp_key1: \"Value1\",\n\tp_key2: \"Value2\"\n});</code></pre><h5>URL Setter</h5><pre class='language-javascript'><code>K(\"&amp;p_key1=Value1&amp;p_key2=Value2\");</code></pre><h5>Array Getter with Prefix</h5><pre class='language-javascript'><code>K([\"1\", \"2\"], \"p_key\");\n// [\"Value1\", \"Value2\"]</code></pre><h5>Array Setter with Prefix</h5><pre class='language-javascript'><code>K([\"1\", \"2\"], [\"Value1\", \"Value2\"], \"p_key\");</code></pre><h5>Object Setter with Prefix</h5><pre class='language-javascript'><code>K({\n\t\"1\": \"Value1\",\n\t\"2\": \"Value2\"\n}, \"p_key\");</code></pre><h5>URL Setter with Prefix</h5><pre class='language-javascript'><code>K(\"&amp;1=Value1&amp;2=Value2\", \"p_key\");</code></pre>"
			},

			"k_toURL": {
				"id": "k_to_url",
				"label": "K.toURL",
				"description": "Get a URL-encoded string of key/value pairs from the keyword hash by specifying one or more prefixes.",
				"syntax": ["K.toURL(prefix|prefixes)"],
				"arguments": [
					["prefix", "A keyword name prefix."],
					["prefixes", "An array of keyword name prefixes."]
				],
				"returns": "<p>A URL-encoded list of key/value pairs for all keys matching the specified prefix(es).</p>",
				"usage": "<pre class='language-javascript'><code>K.toURL(\"p_key\");\n// \"&amp;p_key1=Value1&amp;p_key2=Value2\"</code></pre>"
			},
			"k_toObject": {
				"id": "k_to_object",
				"label": "K.toObject",
				"description": "Get an object of key/value pairs from the keyword hash by specifying one or more prefixes.",
				"syntax": ["K.toObject(prefix|prefixes)"],
				"arguments": [
					["prefix", "A keyword name prefix."],
					["prefixes", "An array of keyword name prefixes."]
				],
				"returns": "<p>An object of key/value pairs for all keys matching the specified prefix(es).</p>",
				"usage": "<pre class='language-javascript'><code>K.toObject(\"p_key\");\n// { p_key1: \"Value1\", p_key2: \"Value2\" }</code></pre>"
			},

			"k_remove": {
				"id": "k_remove",
				"label": "K.remove",
				"description": "Delete a specific keyword from the client keyword hash.",
				"syntax": ["K.remove(key)"],
				"arguments": [
					["key", "A keyword name."]
				],
				"notes": ""
			},
			"k_flush": {
				"id": "k_flush",
				"label": "K.flush",
				"description": "Delete a group of keywords from the client keyword hash by specifying one or more key prefixes.",
				"syntax": ["K.flush(prefix|prefixes)"],
				"arguments": [
					["prefix", "A keyword name prefix."],
					["prefixes", "An array of keyword name prefixes."]
				],
				"notes": ""
			},

			"k_setDefault": {
				"id": "k_set_default",
				"label": "K.setDefault",
				"description": "Set a keyword value only if that keyword does not already have a value.",
				"syntax": ["K.setDefault(key, value)"],
				"arguments": [
					["key", "A keyword name."],
					["value", "A keyword value."]
				],
				"notes": ""
			},

				
		}
	},
	
	"undocumented": {
		"id": "undocumented",
		"label": "Undocumented",
		"description": "Undocumented functions.",
		"options": {

			"ddk_defer": {
				"id": "ddk_defer",
				"label": "DDK.defer"
			},

			"ddk_format": {
				"id": "ddk_format",
				"label": "DDK.format"
			},
			"ddk_nav_format": {
				"id": "ddk_nav_format",
				"label": "DDK.navFormat"
			}
		},
		"logging": {
			"id": "logging",
			"label": "Logging",
			"description": "Console and error logging functions.",
			"options": {
				"ddk_log": {
					"id": "ddk_log",
					"label": "DDK.log"
				},
				"ddk_info": {
					"id": "ddk_info",
					"label": "DDK.info"
				},
				"ddk_warn": {
					"id": "ddk_warn",
					"label": "DDK.warn"
				},
				"ddk_error": {
					"id": "ddk_error",
					"label": "DDK.error"
				},
				"ddk_errorlog": {
					"id": "ddk_errorlog",
					"label": "DDK.errorLog"
				}	
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
/*				"closestControlGroup": {
					"id": "closest_control_group",
					"label": "$.fn.closestControlGroup",
					"description": "",
					"notes": ""
				},
*/				
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
		}
	},
	
	"private": {
		"id": "private",
		"label": "Private",
		"description": "Functions and variables that should be treated as internal and private.",
		"options": {
			"daa_showloading": {
				"id": "daa_showloading",
				"label": "daa_showloading"
			},
			"daa_polling": {
				"id": "daa_polling",
				"label": "daa_polling"
			},
			"daa_urlitem": {
				"id": "daa_urlitem",
				"label": "daa_urlitem"
			},
			"daa_cursor": {
				"id": "daa_cursor",
				"label": "daa_cursor"
			},
			"daa_showerror": {
				"id": "daa_showerror",
				"label": "daa_showerror"
			},
			"daa_returnfunction": {
				"id": "daa_returnfunction",
				"label": "daa_returnfunction;"
			},
			"daa_showmask": {
				"id": "daa_showmask",
				"label": "daa_showmask;"
			},
			"daa_detectlogin": {
				"id": "daa_detectlogin",
				"label": "daa_detectlogin"
			},
			"daa_serialize": {
				"id": "daa_serialize",
				"label": "daa_serialize"
			},
			"daa_showmask": {
				"id": "daa_showmask",
				"label": "daa_showmask"
			},
			"jQuery_am": {
				"id": "jquery_am",
				"label": "$.am"
			},
			"jQuery_fn_am": {
				"id": "jquery_fn_am",
				"label": "$.fn.am"
			},
			"ps_extend": {
				"id": "ps_extend",
				"label": "PS.extend"
			},
			"ps_am_sync": {
				"id": "ps_am_sync",
				"label": "PS.AM.sync"
			},
			"ps_filter_settings": {
				"id": "ps_filter_settings",
				"label": "PS.FilterSettings"
			},
			"ps_filter_settings_test": {
				"id": "ps_filter_settings_test",
				"label": "PS.FilterSettings.test"
			},
			"ps_formatter": {
				"id": "ps_formatter",
				"label": "PS.Formatter"
			},
			"ps_formatter_formats": {
				"id": "ps_formatter_formats",
				"label": "PS.Formatter.formats"
			},
			"ps_formatter_type_map": {
				"id": "ps_formatter_type_map",
				"label": "PS.Formatter.typeMap"
			},
			"ps_formatter_register": {
				"id": "ps_formatter_register",
				"label": "PS.Formatter.register"
			},
			"ps_formatter_register_style": {
				"id": "ps_formatter_register_style",
				"label": "PS.Formatter.registerStyle"
			},
			"ps_formatter_color_range": {
				"id": "ps_formatter_color_range",
				"label": "PS.Formatter.colorRange"
			},
			"ps_formatter_color_range_red": {
				"id": "ps_formatter_color_range_red",
				"label": "PS.Formatter.colorRange.red"
			},
			"ps_formatter_color_range_yellow": {
				"id": "ps_formatter_color_range_yellow",
				"label": "PS.Formatter.colorRange.yellow"
			},
			"ps_formatter_color_range_green": {
				"id": "ps_formatter_color_range_green",
				"label": "PS.Formatter.colorRange.green"
			},
			"ps_formatter_color_range_blue": {
				"id": "ps_formatter_color_range_blue",
				"label": "PS.Formatter.colorRange.blue"
			},
			"ps_formatter_color_range_gray": {
				"id": "ps_formatter_color_range_gray",
				"label": "PS.Formatter.colorRange.gray"
			},
			"ps_formatter_color_range_neutral": {
				"id": "ps_formatter_color_range_neutral",
				"label": "PS.Formatter.colorRange.neutral"
			},
			"ps_formatter_color_range_grey": {
				"id": "ps_formatter_color_range_grey",
				"label": "PS.Formatter.colorRange.grey"
			},
			"ps_formatter_fn_get_settings": {
				"id": "ps_formatter_fn_get_settings",
				"label": "PS.Formatter.fn.getSettings"
			},
			"ps_formatter_fn_defaults": {
				"id": "ps_formatter_fn_defaults",
				"label": "PS.Formatter.fn.defaults"
			},
			"ps_formatter_fn_text": {
				"id": "ps_formatter_fn_text",
				"label": "PS.Formatter.fn.text"
			},
			"ps_formatter_fn_html": {
				"id": "ps_formatter_fn_html",
				"label": "PS.Formatter.fn.html"
			},
			"ps_formatter_fn_auto": {
				"id": "ps_formatter_fn_auto",
				"label": "PS.Formatter.fn.auto"
			},
			"ps_formatter_fn_number": {
				"id": "ps_formatter_fn_number",
				"label": "PS.Formatter.fn.number"
			},
			"ps_formatter_fn_currency": {
				"id": "ps_formatter_fn_currency",
				"label": "PS.Formatter.fn.currency"
			},
			"ps_formatter_fn_date": {
				"id": "ps_formatter_fn_date",
				"label": "PS.Formatter.fn.date"
			},
			"ps_formatter_fn_time": {
				"id": "ps_formatter_fn_time",
				"label": "PS.Formatter.fn.time"
			},
			"ps_formatter_fn_chart": {
				"id": "ps_formatter_fn_chart",
				"label": "PS.Formatter.fn.chart"
			},
			"ps_formatter_fn_bar": {
				"id": "ps_formatter_fn_bar",
				"label": "PS.Formatter.fn.bar"
			},
			"ps_formatter_fn_stackedbar": {
				"id": "ps_formatter_fn_stackedbar",
				"label": "PS.Formatter.fn.stackedbar"
			},
			"ps_formatter_fn_stackedbar100": {
				"id": "ps_formatter_fn_stackedbar100",
				"label": "PS.Formatter.fn.stackedbar100"
			},
			"ps_formatter_fn_arrow": {
				"id": "ps_formatter_fn_arrow",
				"label": "PS.Formatter.fn.arrow"
			},
			"ps_formatter_fn_bulb": {
				"id": "ps_formatter_fn_bulb",
				"label": "PS.Formatter.fn.bulb"
			},
			"ps_formatter_fn_percent": {
				"id": "ps_formatter_fn_percent",
				"label": "PS.Formatter.fn.percent"
			},
			"ps_formatter_fn_calcs": {
				"id": "ps_formatter_fn_calcs",
				"label": "PS.Formatter.calcs"
			},
			"ps_formatter_fn_calcs_percentchange": {
				"id": "ps_formatter_fn_calcs_percentchange",
				"label": "PS.Formatter.calcs.percentChange"
			},
			"ps_formatter_fn_calcs_change": {
				"id": "ps_formatter_fn_calcs_change",
				"label": "PS.Formatter.calcs.change"
			},
			"ps_nav_formatter": {
				"id": "ps_nav_formatter",
				"label": "PS.NavFormatter"
			},
			"ps_nav_formatter_formats": {
				"id": "ps_nav_formatter_formats",
				"label": "PS.NavFormatter.formats"
			},
			"ps_nav_formatter_register": {
				"id": "ps_nav_formatter_register",
				"label": "PS.NavFormatter.register"
			},
			"ps_nav_formatter_register_style": {
				"id": "ps_nav_formatter_register_style",
				"label": "PS.NavFormatter.registerStyle"
			},
			"ps_nav_formatter_fn_data": {
				"id": "ps_nav_formatter_fn_data",
				"label": "PS.NavFormatter.fn.data"
			},
			"ps_nav_formatter_fn_get_settings": {
				"id": "ps_nav_formatter_fn_get_settings",
				"label": "PS.NavFormatter.fn.getSettings"
			},
			"ps_nav_formatter_fn_defaults": {
				"id": "ps_nav_formatter_fn_defaults",
				"label": "PS.NavFormatter.fn.defaults"
			},
			"ps_nav_formatter_fn_date": {
				"id": "ps_nav_formatter_fn_date",
				"label": "PS.NavFormatter.fn.date"
			},
			"ps_nav_formatter_fn_date_defaults": {
				"id": "ps_nav_formatter_fn_date_defaults",
				"label": "PS.NavFormatter.fn.date.defaults"
			},
			"ps_nav_formatter_fn_functions": {
				"id": "ps_nav_formatter_fn_functions",
				"label": "PS.NavFormatter.fn.functions"
			},
			"ps_nav_formatter_fn_functions_getcolumnindex": {
				"id": "ps_nav_formatter_fn_functions_getcolumnindex",
				"label": "PS.NavFormatter.fn.functions.getColumnIndex"
			},
			"ps_nav_formatter_fn_functions_ajaxsetup": {
				"id": "ps_nav_formatter_fn_functions_ajaxsetup",
				"label": "PS.NavFormatter.fn.functions.ajaxSetup"
			},
			"ps_nav_formatter_fn_functions_initselection": {
				"id": "ps_nav_formatter_fn_functions_initselection",
				"label": "PS.NavFormatter.fn.functions.initSelection"
			},
			"ps_nav_formatter_fn_functions_format": {
				"id": "ps_nav_formatter_fn_functions_format",
				"label": "PS.NavFormatter.fn.functions.format"
			},
			"ps_nav_formatter_fn_functions_setdata": {
				"id": "ps_nav_formatter_fn_functions_setdata",
				"label": "PS.NavFormatter.fn.functions.setData"
			},
			"ps_nav_formatter_fn_functions_updatecache": {
				"id": "ps_nav_formatter_fn_functions_updatecache",
				"label": "PS.NavFormatter.fn.functions.updateCache"
			},
			"ps_nav_formatter_fn_functions_localdatasetup": {
				"id": "ps_nav_formatter_fn_functions_localdatasetup",
				"label": "PS.NavFormatter.fn.functions.localDataSetup"
			},
			"ps_nav_formatter_fn_functions_createdatetype": {
				"id": "ps_nav_formatter_fn_functions_createdatetype",
				"label": "PS.NavFormatter.fn.functions.createDateType"
			},
			"ps_nav_formatter_fn_functions_initdate": {
				"id": "ps_nav_formatter_fn_functions_initdate",
				"label": "PS.NavFormatter.fn.functions.initDate"
			},
			"ps_nav_formatter_fn_functions_mapdateformat": {
				"id": "ps_nav_formatter_fn_functions_mapdateformat",
				"label": "PS.NavFormatter.fn.functions.mapDateFormat"
			},
			"ps_nav_formatter_fn_functions_createnavdate": {
				"id": "ps_nav_formatter_fn_functions_createnavdate",
				"label": "PS.NavFormatter.fn.functions.createNavDate"
			},
			"ps_nav_formatter_fn_select2": {
				"id": "ps_nav_formatter_fn_select2",
				"label": "PS.NavFormatter.fn.select2"
			},
			"ps_nav_formatter_fn_dateday": {
				"id": "ps_nav_formatter_fn_dateday",
				"label": "PS.NavFormatter.fn.dateday"
			},
			"ps_nav_formatter_fn_dateweek": {
				"id": "ps_nav_formatter_fn_dateweek",
				"label": "PS.NavFormatter.fn.dateweek"
			},
			"ps_nav_formatter_fn_datemonth": {
				"id": "ps_nav_formatter_fn_datemonth",
				"label": "PS.NavFormatter.fn.datemonth"
			},
			"ps_nav_formatter_fn_datequarter": {
				"id": "ps_nav_formatter_fn_datequarter",
				"label": "PS.NavFormatter.fn.datequarter"
			},
			"ps_nav_formatter_fn_dateyear": {
				"id": "ps_nav_formatter_fn_dateyear",
				"label": "PS.NavFormatter.fn.dateyear"
			},
			"ps_nav_formatter_fn_datecustom": {
				"id": "ps_nav_formatter_fn_datecustom",
				"label": "PS.NavFormatter.fn.datecustom"
			},
			"ps_nav_formatter_fn_checkbox": {
				"id": "ps_nav_formatter_fn_checkbox",
				"label": "PS.NavFormatter.fn.checkbox"
			},
			"ps_nav_formatter_fn_radio": {
				"id": "ps_nav_formatter_fn_radio",
				"label": "PS.NavFormatter.fn.radio"
			},
			"ps_nav_formatter_fn_input": {
				"id": "ps_nav_formatter_fn_input",
				"label": "PS.NavFormatter.fn.input"
			},
			"ps_mc_models_record_base": {
				"id": "undocumented_82",
				"label": "PS.MC.Models.Record.Base"
			},
			"ps_mc_models_record_favorite_category": {
				"id": "ps_mc_models_record_favorite_category",
				"label": "PS.MC.Models.Record.FavoriteCategory"
			},
			"ps_mc_models_record_favorite": {
				"id": "ps_mc_models_record_favorite",
				"label": "PS.MC.Models.Record.Favorite"
			},
			"ps_mc_models_record_favorite_rel": {
				"id": "ps_mc_models_record_favorite_rel",
				"label": "PS.MC.Models.Record.FavoriteRel"
			},
			"ps_mc_models_record_favorite_cat_rel": {
				"id": "ps_mc_models_record_favorite_cat_rel",
				"label": "PS.MC.Models.Record.FavoriteCatRel"
			},
			"ps_mc_models_record_favorite_org_rel": {
				"id": "ps_mc_models_record_favorite_org_rel",
				"label": "PS.MC.Models.Record.FavoriteOrgRel"
			},
			"ps_mc_models_option": {
				"id": "ps_mc_models_option",
				"label": "PS.MC.Models.Option"
			},
			"ps_mc_models_option_group": {
				"id": "ps_mc_models_option_group",
				"label": "PS.MC.Models.OptionGroup"
			},
			"ps_mc_collections_option_groups": {
				"id": "ps_mc_collections_option_groups",
				"label": "PS.MC.Collections.OptionGroups"
			},
			"ps_toolbar": {
				"id": "ps_toolbar",
				"label": "PS.Toolbar"
			},
			"old_ie": {
				"id": "old_ie",
				"label": "oldIE"
			},
			"recnet_ie": {
				"id": "recnet_ie",
				"label": "recentIE"
			},
			"ddk_loadresources": {
				"id": "ddk_loadresources",
				"label": "DDK.loadResources"
			},
			"ddk_loadtools": {
				"id": "ddk_loadtools",
				"label": "DDK.loadTools"
			},
			"ddk_initstylesheets": {
				"id": "ddk_initstylesheets",
				"label": "DDK.initStylesheets"
			},

			"reload_control_container": {
				"id": "reload_control_container",
				"label": "reloadControlContainer"
			},
			"_document": {
				"id": "_document",
				"label": "$document"
			},
			"keywordupdate_handler": {
				"id": "keywordupdate_handler",
				"label": "keywordupdateHandler"
			},
			"nav_go_handler": {
				"id": "nav_go_handler",
				"label": "navGoHandler"
			},
			"ps_options_api": {
				"id": "ps_options_api",
				"label": "PS.optionsAPI"
			},
			"ddk_column_metric_triggers": {
				"id": "ddk_column_metric_triggers",
				"label": "DDK.COLUMN_METRIC_TRIGGERS"
			},
			
			"ddk_validate": {
				"id": "ddk_validate",
				"label": "DDK.validate"
			},
			"ddk_control_init": {
				"id": "ddk_control_init",
				"label": "DDK.control.init"
			},
			"ddk_eventhandler": {
				"id": "ddk_eventhandler",
				"label": "DDK.eventHandler"
			},
			"ddk_dialog": {
				"id": "ddk_dialog",
				"label": "DDK.dialog"
			},
			"ddk_dialog2": {
				"id": "ddk_dialog2",
				"label": "DDK.dialog2"
			},
			"ddk_mouseover": {
				"id": "ddk_mouseover",
				"label": "DDK.mouseover"
			},
			"ddk_pdfgo": {
				"id": "ddk_pdfgo",
				"label": "DDK.pdfGo"
			},			
			"ddk_regex": {
				"id": "ddk_regex",
				"label": "DDK.regex"
			},

			"ddk_char": {
				"id": "ddk_char",
				"label": "DDK.char"
			},
			"ddk_escape": {
				"id": "ddk_escape",
				"label": "DDK.escape"
			},
			"ddk_unescape": {
				"id": "ddk_unescape",
				"label": "DDK.unescape"
			},
			"ddk_resourcesload": {
				"id": "ddk_resourcesload",
				"label": "DDK.resourcesLoad"
			},
			"ddk_ease": {
				"id": "ddk_ease",
				"label": "DDK.ease"
			}

		}
	},
	
	"deprecated": {
		"id": "deprecated",
		"label": "Deprecated",
		"description": "Deprecated and other legacy functions and variables.",
		"options": {	
			"overlib": {
				"id": "overlib",
				"label": "overlib"
			},
			"nd": {
				"id": "nd",
				"label": "nd"
			},
			"psc_resize": {
				"id": "psc_resize",
				"label": "PSC_Resize"
			},
			"psc_reload": {
				"id": "psc_reload",
				"label": "PSC_Reload"
			},
			"psc_list_resize": {
				"id": "psc_list_resize",
				"label": "PSC_List_Resize"
			},
			"psc_list_reload": {
				"id": "psc_list_reload",
				"label": "PSC_List_Reload"
			},
			"psc_bamset2_resize": {
				"id": "psc_bamset2_resize",
				"label": "PSC_Bamset2_Resize"
			},
			"psc_bamset2_reload": {
				"id": "psc_bamset2_reload",
				"label": "PSC_Bamset2_Reload"
			},
			"psc_navset2_resize": {
				"id": "psc_navset2_resize",
				"label": "PSC_Navset2_Resize"
			},
			"psc_navset2_reload": {
				"id": "psc_navset2_reload",
				"label": "PSC_Navset2_Reload"
			},
			"psc_chart_delayed_reload": {
				"id": "psc_chart_delayed_reload",
				"label": "PSC_Chart_Delayed_Reload"
			},
			"psc_chart_reload": {
				"id": "psc_chart_reload",
				"label": "PSC_Chart_Reload"
			},
			"psc_chart_updatechart": {
				"id": "psc_chart_updatechart",
				"label": "PSC_Chart_UpdateChart"
			},
			"add_column_filters": {
				"id": "add_column_filters",
				"label": "addColumnFilters"
			},
			"dt_sort_value": {
				"id": "dt_sort_value",
				"label": "dtSortValue"
			},
			"add_dt_sort_listener": {
				"id": "add_dt_sort_listener",
				"label": "addDTSortListener"
			},
			"fn_create_column_filter": {
				"id": "fn_create_column_filter",
				"label": "fnCreateColumnFilter"
			},
			"fn_create_input_text": {
				"id": "fn_create_input_text",
				"label": "fnCreateInputText"
			},
			"fn_create_select": {
				"id": "fn_create_select",
				"label": "fnCreateSelect"
			},
			"psc_table_filterglobal": {
				"id": "psc_table_filterglobal",
				"label": "PSC_Table_FilterGlobal"
			},
			"psc_table_reload": {
				"id": "psc_table_reload",
				"label": "PSC_Table_Reload"
			},
			"psc_table_updatetable": {
				"id": "psc_table_updatetable",
				"label": "PSC_Table_UpdateTable"
			},
			"psc_table_resize": {
				"id": "psc_table_resize",
				"label": "PSC_Table_Resize"
			},
			"psc_table_resize_scroll_body": {
				"id": "psc_table_resize_scroll_body",
				"label": "PSC_Table_Resize_Scroll_Body"
			},
			"psc_scorecard_reload": {
				"id": "psc_scorecard_reload",
				"label": "PSC_Scorecard_Reload"
			},
			"psc_scorecard_resize": {
				"id": "psc_scorecard_resize",
				"label": "PSC_Scorecard_Resize"
			},
			"psc_scorecard_resize_scroll_body": {
				"id": "psc_scorecard_resize_scroll_body",
				"label": "PSC_Scorecard_Resize_Scroll_Body"
			},
			"psc_tree_resize": {
				"id": "psc_tree_resize",
				"label": "PSC_Tree_Resize"
			},
			"psc_tree_reload": {
				"id": "psc_tree_reload",
				"label": "PSC_Tree_Reload"
			},
			"psc_tree_refresh": {
				"id": "psc_tree_refresh",
				"label": "PSC_Tree_Refresh"
			},
			"psc_bamset_reload": {
				"id": "psc_bamset_reload",
				"label": "PSC_Bamset_Reload"
			},
			"psc_bamset_resize": {
				"id": "psc_bamset_resize",
				"label": "PSC_Bamset_Resize"
			},
			"normalize_levels": {
				"id": "normalize_levels",
				"label": "normalizeLevels"
			},
			"resize_bam_text": {
				"id": "resize_bam_text",
				"label": "resizeBamText"
			},
			"resize_bamset_ul": {
				"id": "resize_bamset_ul",
				"label": "resizeBamsetUL"
			},
			"psc_scorecard2_reload": {
				"id": "psc_scorecard2_reload",
				"label": "PSC_Scorecard2_Reload"
			},
			"psc_scorecard2_resize": {
				"id": "psc_scorecard2_resize",
				"label": "PSC_Scorecard2_Resize"
			},
			"psc_scorecard2_resize_scroll_body": {
				"id": "psc_scorecard2_resize_scroll_body",
				"label": "PSC_Scorecard2_Resize_Scroll_Body"
			},
			"fix_column_sizing": {
				"id": "fix_column_sizing",
				"label": "fixColumnSizing"
			},
			"psc_chart_resize": {
				"id": "psc_chart_resize",
				"label": "PSC_Chart_Resize"
			},
			"ddk_util_stringrepeat": {
				"id": "ddk_util_stringrepeat",
				"label": "DDK.util.stringRepeat"
			},
			"ddk_util_trunc": {
				"id": "ddk_util_trunc",
				"label": "DDK.util.trunc"
			},
			"ddk_util_characterwidths": {
				"id": "ddk_util_characterwidths",
				"label": "DDK.util.characterWidths"
			},
			"ddk_util_stringwidth": {
				"id": "ddk_util_stringwidth",
				"label": "DDK.util.stringWidth"
			},
			"ddk_focus": {
				"id": "ddk_focus",
				"label": "DDK.focus"
			},
			"ddk_blur": {
				"id": "ddk_blur",
				"label": "DDK.blur"
			},
			"ddk_makebutton": {
				"id": "ddk_makebutton",
				"label": "DDK.makeButton"
			},
			"ddk_deletefavorite": {
				"id": "ddk_deletefavorite",
				"label": "DDK.deleteFavorite"
			},
			"ddk_loadfavorite": {
				"id": "ddk_loadfavorite",
				"label": "DDK.loadFavorite"
			},
			"ddk_updatefavoritevalue": {
				"id": "ddk_updatefavoritevalue",
				"label": "DDK.updateFavoriteValue"
			},
			"ddk_displaydialog": {
				"id": "ddk_displaydialog",
				"label": "DDK.displayDialog"
			},
			"ddk_initcolorpicker": {
				"id": "ddk_initcolorpicker",
				"label": "DDK.initColorPicker"
			},
			"ddk_loadcontrols": {
				"id": "ddk_loadcontrols",
				"label": "DDK.loadControls"
			},
			"ddk_writefavoritechanges": {
				"id": "ddk_writefavoritechanges",
				"label": "DDK.writeFavoriteChanges"
			},
			"ddk_initcontrols": {
				"id": "ddk_initcontrols",
				"label": "DDK.initControls"
			},
			"ddk_template": {
				"id": "ddk_template",
				"label": "DDK.template"
			},
			"ddk_template_menuitem": {
				"id": "ddk_template_menuitem",
				"label": "DDK.template.menuItem"
			},
			"ddk_chart_resize": {
				"id": "ddk_chart_resize",
				"label": "DDK.chart.resize"
			},
			"ddk_chart_reload": {
				"id": "ddk_chart_reload",
				"label": "DDK.chart.reload"
			},
			"ddk_chart_data": {
				"id": "undocumented_155",
				"label": "DDK.chart.data"
			},
			"ddk_chart_settype": {
				"id": "ddk_chart_settype",
				"label": "DDK.chart.setType"
			},
			"ddk_chart_init": {
				"id": "ddk_chart_init",
				"label": "DDK.chart.init"
			},
			"ddk_chart_seriesconfig": {
				"id": "undocumented_158",
				"label": "DDK.chart.seriesConfig"
			},
			"ddk_chart_title": {
				"id": "ddk_chart_title",
				"label": "DDK.chart.title"
			},
			"ddk_chart_resizedatatable": {
				"id": "ddk_chart_resizedatatable",
				"label": "DDK.chart.resizeDatatable"
			},
			"ddk_chart_updateimage": {
				"id": "ddk_chart_updateimage",
				"label": "DDK.chart.updateImage"
			},
			"ddk_table_bajaxdataget": {
				"id": "ddk_table_bajaxdataget",
				"label": "DDK.table.bAjaxDataGet"
			},
			"ddk_table_resize": {
				"id": "ddk_table_resize",
				"label": "DDK.table.resize"
			},
			"ddk_table_reload": {
				"id": "ddk_table_reload",
				"label": "DDK.table.reload"
			},
			"ddk_table_data": {
				"id": "ddk_table_data",
				"label": "DDK.table.data"
			},
			"ddk_table_init": {
				"id": "ddk_table_init",
				"label": "DDK.table.init"
			},
			"ddk_table_title": {
				"id": "ddk_table_title",
				"label": "DDK.table.title"
			},
			"ddk_table_defaultoptions": {
				"id": "ddk_table_defaultoptions",
				"label": "DDK.table.defaultOptions"
			},
			"ddk_table_clientoptions": {
				"id": "ddk_table_clientoptions",
				"label": "DDK.table.clientOptions"
			},
			"ddk_table_jsonoptions": {
				"id": "ddk_table_jsonoptions",
				"label": "DDK.table.JSONOptions"
			},
			"ddk_table_serveroptions": {
				"id": "ddk_table_serveroptions",
				"label": "DDK.table.serverOptions"
			},
			"ddk_tree_resize": {
				"id": "undocumented_172",
				"label": "DDK.tree.resize"
			},
			"ddk_tree_reload": {
				"id": "ddk_tree_reload",
				"label": "DDK.tree.reload"
			},
			"ddk_tree_refresh": {
				"id": "ddk_tree_refresh",
				"label": "DDK.tree.refresh"
			},
			"ddk_tree_data": {
				"id": "ddk_tree_data",
				"label": "DDK.tree.data"
			},
			"ddk_tree_init": {
				"id": "ddk_tree_init",
				"label": "DDK.tree.init"
			},
			"ddk_tree_title": {
				"id": "ddk_tree_title",
				"label": "DDK.tree.title"
			},
			"ddk_tree_defaultoptions": {
				"id": "ddk_tree_defaultoptions",
				"label": "DDK.tree.defaultOptions"
			},
			"ddk_scorecard_resize": {
				"id": "ddk_scorecard_resize",
				"label": "DDK.scorecard.resize"
			},
			"ddk_scorecard_reload": {
				"id": "ddk_scorecard_reload",
				"label": "DDK.scorecard.reload"
			},
			"ddk_scorecard_data": {
				"id": "ddk_scorecard_data",
				"label": "DDK.scorecard.data"
			},
			"ddk_scorecard_init": {
				"id": "ddk_scorecard_init",
				"label": "DDK.scorecard.init"
			},
			"ddk_scorecard_title": {
				"id": "ddk_scorecard_title",
				"label": "DDK.scorecard.title"
			},
			"ddk_scorecard_defaultoptions": {
				"id": "ddk_scorecard_defaultoptions",
				"label": "DDK.scorecard.defaultOptions"
			},
			"ddk_scorecard2_resize": {
				"id": "ddk_scorecard2_resize",
				"label": "DDK.scorecard2.resize"
			},
			"ddk_scorecard2_reload": {
				"id": "ddk_scorecard2_reload",
				"label": "DDK.scorecard2.reload"
			},
			"ddk_scorecard2_data": {
				"id": "ddk_scorecard2_data",
				"label": "DDK.scorecard2.data"
			},
			"ddk_scorecard2_init": {
				"id": "ddk_scorecard2_init",
				"label": "DDK.scorecard2.init"
			},
			"ddk_scorecard2_title": {
				"id": "ddk_scorecard2_title",
				"label": "DDK.scorecard2.title"
			},
			"ddk_scorecard2_defaultoptions": {
				"id": "ddk_scorecard2_defaultoptions",
				"label": "DDK.scorecard2.defaultOptions"
			},
			"ddk_bamset_resize": {
				"id": "ddk_bamset_resize",
				"label": "DDK.bamset.resize"
			},
			"ddk_bamset_reload": {
				"id": "ddk_bamset_reload",
				"label": "DDK.bamset.reload"
			},
			"ddk_bamset_data": {
				"id": "ddk_bamset_data",
				"label": "DDK.bamset.data"
			},
			"ddk_bamset_init": {
				"id": "ddk_bamset_init",
				"label": "DDK.bamset.init"
			},
			"ddk_list_resize": {
				"id": "ddk_list_resize",
				"label": "DDK.list.resize"
			},
			"ddk_list_reload": {
				"id": "ddk_list_reload",
				"label": "DDK.list.reload"
			},
			"ddk_list_data": {
				"id": "ddk_list_data",
				"label": "DDK.list.data"
			},
			"ddk_list_init": {
				"id": "ddk_list_init",
				"label": "DDK.list.init"
			},
			"ddk_bamset2_resize": {
				"id": "ddk_bamset2_resize",
				"label": "DDK.bamset2.resize"
			},
			"ddk_bamset2_reload": {
				"id": "ddk_bamset2_reload",
				"label": "DDK.bamset2.reload"
			},
			"ddk_bamset2_data": {
				"id": "ddk_bamset2_data",
				"label": "DDK.bamset2.data"
			},
			"ddk_bamset2_init": {
				"id": "ddk_bamset2_init",
				"label": "DDK.bamset2.init"
			},
			"ddk_navset2_resize": {
				"id": "ddk_navset2_resize",
				"label": "DDK.navset2.resize"
			},
			"ddk_navset2_reload": {
				"id": "ddk_navset2_reload",
				"label": "DDK.navset2.reload"
			},
			"ddk_navset2_data": {
				"id": "ddk_navset2_data",
				"label": "DDK.navset2.data"
			},
			"ddk_navset2_init": {
				"id": "ddk_navset2_init",
				"label": "DDK.navset2.init"
			},

			"ddk_help": {
				"id": "ddk_help",
				"label": "DDK.help"
			},

			
			"ddk_accordion": {
				"id": "ddk_accordion",
				"label": "DDK.accordion"
			},
			"ddk_tabs": {
				"id": "ddk_tabs",
				"label": "DDK.tabs"
			},
			"ddk_reloadcontrol": {
				"id": "ddk_reloadcontrol",
				"label": "DDK.reloadControl"
			},


			"ddk_template_metricdisplay": {
				"id": "ddk_template_metricdisplay",
				"label": "DDK.template.metricDisplay"
			},

			"ddk_reloadfromfavoritequeue": {
				"id": "ddk_reloadfromfavoritequeue",
				"label": "DDK.reloadFromFavoriteQueue"
			},
			"ddk_reloadfromfavoriteloading": {
				"id": "ddk_reloadfromfavoriteloading",
				"label": "DDK.reloadFromFavoriteLoading"
			},
			"ddk_reloadfromfavorite": {
				"id": "ddk_reloadfromfavorite",
				"label": "DDK.reloadFromFavorite",
				"notes": "Replaced by <a href='amengine/amengine.aspx?config.mn=DDK2_Docs&api=ddkJavaScript#run_fav'><code>runFav</code></a>."
			},
			"ddk_reloadfromfavoriterequest": {
				"id": "ddk_reloadfromfavoriterequest",
				"label": "DDK.reloadFromFavoriteRequest"
			},


			"ddk_pluginsload": {
				"id": "ddk_pluginsload",
				"label": "DDK.pluginsLoad"
			},
			"ddk_addonsload": {
				"id": "ddk_addonsload",
				"label": "DDK.addonsLoad"
			},
			"ddk_loadscript": {
				"id": "ddk_loadscript",
				"label": "DDK.loadScript"
			},
			"ddk_deferplugins": {
				"id": "ddk_deferplugins",
				"label": "DDK.deferPlugins"
			},
			"ddk_allload": {
				"id": "ddk_allload",
				"label": "DDK.allLoad"
			},

			"run_from_favorite": {
				"id": "run_from_favorite",
				"label": "runFromFavorite"
			}


		}
	}
};

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

DataTables Extensions
	
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


