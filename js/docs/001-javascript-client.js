PS.optionsAPI.clientJavaScript = {
	"id": "client_javascript",
	"label": "Client JavaScript",
	"description": "Functions included in the DDK Client JavaScript libraries.",
/*
	"section": {
		"id": "section",
		"label": "Dummy Section",
		"description": "Description for dummy section.",
		"options": {
			"attr": {
				"id": "elem_attr",
				"label": "Attributes",
				"description": "Element attributes.",
				"notes": "Sets attributes on the element div.",
				"version": "",
				"deprecated": false
			}

		}
	},
*/
	"options": {
		"findControls": {
			"id": "find_controls",
			"label": "$.fn.findControls",
			"description": "<p>jQuery plugin to find all DDK Controls inside a container element.</p><ul><li><code>$().findControls()</code></li></ul>",
			"notes": "<p>Often used together with <code>reloadControls</code>.</p><h5>Example</h5><pre class='language-javascript'><code>$(\".main-section\").findControls().reloadControls();</code></pre>",
			"version": "",
			"deprecated": false
		},

		"reloadControls": {
			"id": "reload_controls",
			"label": "$.fn.reloadControls",
			"description": "<p>jQuery plugin to reload of all DDK Control elements in a jQuery collection.</p><ul><li><code>$().reloadControls()</code></li></ul>",
			"notes": "<p>Will load controls in DOM order. Uses a queue to load controls in series so only one AMEngine request is made at a time.</p><p>Use <code>findControls</code> to identify controls inside a container element, then <code>reloadControls</code> to reload them.</p><h5>Example</h5><pre class='language-javascript'><code>$(\".main-section\").findControls().reloadControls();</code></pre>",
			"version": "",
			"deprecated": false
		},

		"target": {
			"id": "target",
			"label": "$.target",
			"description": "<p>jQuery extension to resolve a target element identifier.</p><ul><li><code>$.target(identifier)</code></li></ul>",
			"notes": "<h5>Arguments</h5><dl><dt><code>identifier</code></dt><dd>Can be an element id string, a DOM element, a jQuery selector string, or a jQuery collection.</dd></dl><h5>Returns</h5><p>A jQuery collection containing the identified element(s).</p>",
			"version": "",
			"deprecated": false
		},

		"runFav": {
			"id": "run_fav",
			"label": "runFav",
			"description": "<p>Function to retrive and render a favorite from the Metrics Catalog Database. Can render Content, Content List, and Control Favorites.</p><ul><li><code>runFav(target, id, settings)</code></li><li><code>runFav(settings)</code></li></ul>",
			"notes": "<h5>Arguments</h5><dl><dt><code>target</code></dt><dd>can be an element id string, a DOM element, a jQuery selector string, or a jQuery collection.</dd><dt><code>id</code></dt><dd>The name or id (<code>sci_fav_name</code> or <code>sci_fav_id</code>) of the favorite record to be rendered.</dd><dt><code>settings</code></dt><dd>An object that can have the following properties:<dl><dt><code>target</code></dt><dd>As above.</dd><dt><code>id</code></dt><dd>As above.</dd><dt><code>name</code></dt><dd>As <code>id</code> above. <code>name</code> or <code>id</code> can be used interchangeably in the settings object.</dd><dt><code>success</code></dt><dd>Function executed after control reload is complete. Do not use for control initialization &ndash; use <code>customInit</code> in control JavaScript for that. Success function acts as a callback. For Control Favorites, it is passed two arguments: <code>controlName</code>, <code>controlId</code>.</dd><dt><code>error</code></dt><dd>Function executed in the event of an HTTP request or Data Request Framework processing error. Error function is passed four arguments: <code>xhr</code>, <code>status</code>, <code>message</code>, <code>settings</code>. Target element and favorite id can be retrieved from the settings object.</dd><dt><code>beforeInit</code></dt><dd>Function executed before control initialization.</dd><dt><code>beforeReload</code></dt><dd>Function executed before favorite retrieval HTTP request is sent.</dd><dt><code>keywords</code></dt><dd>Keywords sent with this request only. Will not be set in the global keyword hash.</dd><dt><code>state</code></dt><dd>Url- or JSON-encoded key/value pairs of state keywords applied to rendered control. Keys should use only the state key abbreviation. e.g. to apply a new chart title and turn off automatic chart axis labels: <code>\"&ti=New%20Title&lae=false\"</code> or <code>{ ti: \"New Title\", lae: \"false\" }</code>.</dd><dt><code>showMask</code></dt><dd>If <code>false</code>, will not mask the target element for this request.</dd><dt><code>favHeader</code></dt><dd>Sets favorite record header display options.</dd><dt><code>favFooter</code></dt><dd>Sets favorite record footer display options.</dd><dt><code>unshift</code></dt><dd>Adds request to the front of the reload queue rather than to the back.</dd></dl></dd></dl><h5>Example</h5><pre class='language-javascript'><code>runFav(\"sample_elem_id\", \"SAMPLE_FAV_NAME\", {\n\tshowMask: false,\n\tsuccess: function (name, id) { DDK.info(name, id); },\n\terror: function (xhr, status, message, settings) { DDK.error(xhr, status, message, settings); }\n});</code></pre>",
			"version": "",
			"deprecated": false
		}
		
	}	
};


/*
(items that start with a dash (-) are listed in the above options API)

Modernizr v2.7.2
jQuery JavaScript Library v2.1.1
jQuery Migrate v1.2.1
jQuery UI - v1.10.3

jQuery UI fixes:
	$.ui.dialog.prototype._allowInteraction
	$.ui.tabs.prototype._setupHeightStyle
	$.ui.tabs.prototype._getList

jQuery Function Wrappers
	$.fn.empty

jQuery Plugins:
-	$.target
	$.topZ
	$.loadScript
	$.createStylesheet

	$.fn.isControl
-	$.fn.reloadControls
	$.fn.reload // deprecated
	$.fn.reloadControlsQueue // deprecated
	$.fn.resizeControls
	$.fn.initControls
-	$.fn.findControls
	$.fn.parentControl
	$.fn.controlData

	$.fn.dataStack
	$.fn.editor
	$.fn.editor.defaults
	$.fn.rowspan
	$.fn.reverse
	$.fn.totalHeight
	$.fn.scaleAreas
	$.fn.maxWidth
	$.fn.maxHeight
	$.fn.convertToHtmlTable
	$.fn.appendEachCol
	$.fn.breakTableByWidth
	$.fn.breakTableByWidth.defaults
	$.fn.breakTableByHeight
	$.fn.breakTableByHeight.defaults
	$.fn.expandControlTableParents

http://mths.be/placeholder v2.0.7 by @mathias
jQuery BBQ: Back Button & Query Library - v1.2.1
jQuery hashchange event - v1.2

Lo-Dash 2.4.1

Lo-Dash Mixins:
	_.delegator
	_.collate
	_.guid
	_.prune
	_.isRealNumber
	_.isPositiveInteger
	_.zipNestedObject
	_.isPairsArray
	_.hasData
	_.hasNumericData
	_.toRecordObjects
	_.toRecordArrays
	_.createCaseConverter
	_.toUpperCase
	_.toLowerCase
	_.isWidgetName
	_.isModuleName
	_.isTemplateName
	_.toCase
	_.collateTree
	_.overlay
	_.overlayValue
	_.favTreeToOptionGroup

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
	// custom additions
	_.str.nameify
	_.str.toBoolean
	_.str.isQueryString
	_.str.parseJSON
	_.str.parseQueryString
	_.str.parse
	_.str.parseTaggedList
	_.str.coerce
	_.str.coerce.coerceType
	_.str.coerce.coerceTriggers


Backbone.js 1.1.0

Backbone Fixes:
	this.options

Backbone.Epoxy

Backbone and Backbone Epoxy Config:
	Backbone.Epoxy.binding.config({ optionValue: "id" });
	Backbone.emulateHTTP = true;

moment.js version : 2.3.1

Moment fixes:
	moment.fn.humanize = _.partial(moment.fn.fromNow, true);
	moment.duration.fn.fromNow = _.partial(moment.duration.fn.humanize, 

Moment Duration Format v1.2.1
numeral.js version : 1.5.1
Ratio.js version 0.4.0

AMEngine AJAX API
	//GlobalVars  (Dashboard Ajax Api)
	daa_showloading=false;
	daa_polling=50;
	daa_urlitem="";  //append to URL
	daa_cursor="";
	daa_showerror=true;
	daa_returnfunction;
	daa_showmask;
	daa_detectlogin=true;
	daa_serialize=true;
	daa_showmask = true;
	
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
	
	run
	load
	
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
	
	$.am
	$.fn.am
	
	Hashtable
	
	URLEncode
	URLDecode
	
	getQueryString
	parseQueryString

K
	K.remove
	K.flush
	K.toURL
	K.toObject
	K.toRequestData
	K.toRequestURL
	K.setDefault
	K.fromQueryString
	K.eval
	K.GC

naturalSort	

overlib
	nd

PS
	PS.extend
	PS.AM.sync
	PS.FilterSettings
	PS.FilterSettings.test
	PS.Formatter
	PS.Formatter.formats
	PS.Formatter.typeMap
	PS.Formatter.register
	PS.Formatter.registerStyle
	PS.Formatter.colorRange
	PS.Formatter.colorRange.red
	PS.Formatter.colorRange.yellow
	PS.Formatter.colorRange.green
	PS.Formatter.colorRange.blue
	PS.Formatter.colorRange.gray
	PS.Formatter.colorRange.neutral
	PS.Formatter.colorRange.grey
	PS.Formatter.fn.getSettings
	PS.Formatter.fn.defaults
	PS.Formatter.fn.text
	PS.Formatter.fn.html
	PS.Formatter.fn.auto
	PS.Formatter.fn.number
	PS.Formatter.fn.currency
	PS.Formatter.fn.date
	PS.Formatter.fn.time
	PS.Formatter.fn.chart
	PS.Formatter.fn.bar
	PS.Formatter.fn.stackedbar
	PS.Formatter.fn.stackedbar100
	PS.Formatter.fn.arrow
	PS.Formatter.fn.bulb
	PS.Formatter.fn.percent
	PS.Formatter.calcs
	PS.Formatter.calcs.percentChange
	PS.Formatter.calcs.change
	PS.NavFormatter
	PS.NavFormatter.formats
	PS.NavFormatter.register
	PS.NavFormatter.registerStyle
	PS.NavFormatter.fn.data
	PS.NavFormatter.fn.getSettings
	PS.NavFormatter.fn.defaults
	PS.NavFormatter.fn.date
	PS.NavFormatter.fn.date.defaults
	PS.NavFormatter.fn.functions
	PS.NavFormatter.fn.functions.getColumnIndex
	PS.NavFormatter.fn.functions.ajaxSetup
	PS.NavFormatter.fn.functions.initSelection
	PS.NavFormatter.fn.functions.format
	PS.NavFormatter.fn.functions.setData
	PS.NavFormatter.fn.functions.updateCache
	PS.NavFormatter.fn.functions.localDataSetup
	PS.NavFormatter.fn.functions.createDateType
	PS.NavFormatter.fn.functions.initDate
	PS.NavFormatter.fn.functions.mapDateFormat
	PS.NavFormatter.fn.functions.createNavDate
	PS.NavFormatter.fn.select2
	PS.NavFormatter.fn.dateday
	PS.NavFormatter.fn.dateweek
	PS.NavFormatter.fn.datemonth
	PS.NavFormatter.fn.datequarter
	PS.NavFormatter.fn.dateyear
	PS.NavFormatter.fn.datecustom
	PS.NavFormatter.fn.checkbox
	PS.NavFormatter.fn.radio
	PS.NavFormatter.fn.input
	PS.MC.Models.Record.Base
	PS.MC.Models.Record.FavoriteCategory
	PS.MC.Models.Record.Favorite
	PS.MC.Models.Record.FavoriteRel
	PS.MC.Models.Record.FavoriteCatRel
	PS.MC.Models.Record.FavoriteOrgRel
	PS.MC.Models.Option
	PS.MC.Models.OptionGroup
	PS.MC.Collections.OptionGroups
	PS.Toolbar
	
oldIE
recentIE

PSC_Resize
PSC_Reload
PSC_List_Resize
PSC_List_Reload
PSC_Bamset2_Resize
PSC_Bamset2_Reload
PSC_Navset2_Resize
PSC_Navset2_Reload
PSC_Chart_Delayed_Reload
PSC_Chart_Reload
PSC_Chart_UpdateChart
addColumnFilters
dtSortValue
addDTSortListener
fnCreateColumnFilter
fnCreateInputText
fnCreateSelect
PSC_Table_FilterGlobal
PSC_Table_Reload
PSC_Table_UpdateTable
PSC_Table_Resize
PSC_Table_Resize_Scroll_Body
PSC_Scorecard_Reload
PSC_Scorecard_Resize
PSC_Scorecard_Resize_Scroll_Body
PSC_Tree_Resize
PSC_Tree_Reload
PSC_Tree_Refresh
PSC_Bamset_Reload
PSC_Bamset_Resize
normalizeLevels
resizeBamText
resizeBamsetUL
PSC_Scorecard2_Reload
PSC_Scorecard2_Resize
PSC_Scorecard2_Resize_Scroll_Body
fixColumnSizing
PSC_Chart_Resize

DDK
	DDK.util.stringRepeat
	DDK.util.trunc
	DDK.util.characterWidths
	DDK.util.stringWidth
	DDK.focus
	DDK.blur
	DDK.makeButton
	DDK.deleteFavorite
	DDK.loadFavorite
	DDK.updateFavoriteValue
	DDK.displayDialog
	DDK.initColorPicker
	DDK.loadControls
	DDK.pdfGo
	DDK.dialog
	DDK.dialog2
	DDK.mouseover
	DDK.writeFavoriteChanges
	DDK.initControls
	DDK.template
	DDK.template.menuItem
	DDK.chart
		resize
		reload
		data
		setType
		init
		seriesConfig
		title
		resizeDatatable
		updateImage
	DDK.table
		bAjaxDataGet
		resize
		reload
		data
		init
		title
		defaultOptions
		clientOptions
		JSONOptions
		serverOptions
	DDK.tree
		resize
		reload
		refresh
		data
		init
		title
		fodResize
		defaultOptions
	DDK.scorecard
		resize
		reload
		data
		init
		title
		defaultOptions
	DDK.scorecard2
		resize
		reload
		data
		init
		title
		defaultOptions
	DDK.bamset
		resize
		reload
		data
		init
	DDK.list
		resize
		reload
		data
		init
	DDK.bamset2
		resize
		reload
		data
		init
	DDK.navset2
		resize
		reload
		data
		init
	DDK.control.init
	DDK.eventHandler
	DDK.help
	DDK.validate
	DDK.accordion
	DDK.tabs
	DDK.format
	DDK.navFormat
	DDK.COLUMN_METRIC_TRIGGERS
	DDK.regex
		closeAngleBracket: /\x3E/g
		openAngleBracket: /\x3C/g
		closeBracket: /\x5D/g
		openBracket: /\x5B/g
		escapedOpenBracket: /\x5C\x5B/g
		escapedCloseBracket: /\x5C\x5D/g
		percentPercent: /%%/g
		atPercent: /@%/g
		percentAt: /%@/g
		singleQuote: /\x27/g
		doubleQuote: /\x22/g
		ampersand: /\x26/g
		underscore: /\x5F/g
		whitespace: /\s+/g
		delimiter: /\s|,/
		backslash: /\x5C/g
	DDK.char
		closeBracket: String.fromCharCode(93)
		doubleQuote: String.fromCharCode(34)
		openBracket: String.fromCharCode(91)
		reverseSolidus: String.fromCharCode(92)
		backslash: String.fromCharCode(92)
		singleQuote: String.fromCharCode(39)
		tilde: String.fromCharCode(126)
		crlf: "\r\n"
		space: " "
		at: "@"
	DDK.escape
		angleBrackets
		brackets
		singleQuote
		doubleQuote
		backslash
	DDK.unescape
		brackets
		tilde
		amControlChars
	DDK.template.metricDisplay
	DDK.log()
	DDK.info()
	DDK.warn()
	DDK.error()
	DDK.reloadFromFavoriteQueue
	DDK.reloadFromFavoriteLoading
	DDK.reloadFromFavorite
	DDK.reloadFromFavoriteRequest
	DDK.reloadControl
	DDK.ease
	DDK.pluginsLoad
	DDK.addonsLoad
	DDK.resourcesLoad
	DDK.loadScript
	DDK.deferPlugins
	DDK.allLoad
	DDK.defer
	DDK.loadResources
	DDK.loadTools
	DDK.initStylesheets
	DDK.errorLog
	
reloadControlContainer
runFromFavorite
- runFav
runFavs


Foundation version 5.2.3

select2 version 3.4.0

jGrowl version 1.2.12
jGrowl config:
	$.fn.jGrowl.prototype.defaults.theme = "";
	$.fn.jGrowl.prototype.defaults.themeState = "";
	
Sparkline version 2.1.2

qTip2 version 2.1.1

DataTables version 1.9.4
DataTables extensions:
	dataTableExt.oApi.fnGetColumnIndex
	dataTableExt.oApi.fnGetDisplayNodes
	dataTableExt.oApi.fnGetColumnData
	dataTableExt.oApi.fnGetFilteredData
	dataTableExt.oApi.fnGetFilteredNodes
	dataTableExt.oSort["ddk-formatted-asc"]
	dataTableExt.oSort["ddk-formatted-desc"]
	dataTableExt.oSort["ddk-scorecard2-asc"]
	dataTableExt.oSort["ddk-scorecard2-desc"]
	dataTableExt.oSort['num-html-asc']
	dataTableExt.oSort['num-html-desc']
	dataTableExt.oSort['natural-asc']
	dataTableExt.oSort['natural-desc']
	ddkScorecardSortValue
	ddkScorecardSort

jsTree version 3.0.4

FooTable version 2.0.1.4
	filter
	paginate
	sort
	striping

CodeMirror version 4.1.0
	JavaScript Hint
	JavaScript
	SQL
	SQL Hint
	closebrackets
	matchbrackets

JSHint version 2.1.11

Prism

DDK.validate
	numberIntegerList
	numberFloatList
	numberInteger
	numberFloat
	textSafe
	textSafeList
	labelSafe
	wordSafe
	nameSafe
	email
	textAreaSafe

$document

keywordupdateHandler
navGoHandler

Event Handlers
	$document.on("click", "button.ddk-chart-series-config", DDK.chart.seriesConfig);
	$document.on("click", "input.ddk-color:not(.loaded)", DDK.initColorPicker);
	$document.on("click", "button[data-ddk-dialog]", DDK.dialog);
	$document.on("click", "button[data-ddk-button-action]", DDK.eventHandler);
	$document.on("change keyup", "input[data-ddk-validate], textarea[data-ddk-validate]", DDK.validate);
	$document.on("click", ".ddk-dropdown", DDK.dropdown.show);
	$document.on("click", DDK.dropdown.hide);

	// initialize DDK Mouseovers on initial document content
	$("[data-ddk-mouseover]").each(DDK.mouseover);
	
	$document.on("keywordupdate", keywordupdateHandler);
	$document.on("click", ".nav-go", navGoHandler);

	$(window).on("resize", _.debounce(function () { $(document).findControls().resizeControls(); }, 250));

	$(document).on("contentloaded", function () {...});

PS.optionsAPI

Scorecard2 Config Dialog
Navset2 Config Dialog
Bamset2 Config Dialog

DDK.pluginsLoad.resolve();
DDK.addonsLoad.resolve();
*/