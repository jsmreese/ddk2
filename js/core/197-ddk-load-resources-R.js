// initial population of global keyword hashK(DDK_KEYWORDS);DDK.template = DDK.template || {};DDK.template.menuItem = function (records, root, title) {	return '<li><a href="#">' + title + '</a></li>';};DDK.loadResources = function () {	var config = _.merge({ content: {}, css: {}, header: {}, js: {}, nav: {} }, DDK_CONFIG),		links = config.js.link && config.js.link.split(DDK.regex.delimiter) || [],		dataConfig,		url,		scriptLoad;			/*		var widgets = DDK_CONFIG && DDK_CONFIG.widget || {},		links = DDK_CONFIG && DDK_CONFIG.link && DDK_CONFIG.link.js && DDK_CONFIG.link.js.split(DDK.regex.delimiter) || [],		headerEnabled = true,		dataConfig, url;		// check header.enabled status	if (config.header && config.mode === "none") {		headerEnabled = false;	}	*/		// if no page content is specified (via content/css/js widget or link)	// load the Docs page for the Responsive Template	if (!(config.css.widget || config.content.widget || config.js.widget || config.css.link || config.js.link)) {		config.content.widget = "DDK2_Responsive_Template_Docs";	}		// add plugins script to start of links list	links.unshift('resources/ddk/' + DDK_PATH + '/js/ddk2-plugins-responsive-' + DDK_BUILD + DDK_MIN + '.js');		dataConfig = [		{ widget: "PSC_CWP_Templates" },		(config.header.mode === "none") ? null : { widget: config.header.widget || "DDK2_Responsive_Template_Header" }	];		_.each("css js nav content".split(" "), function (type) {		dataConfig.push(config[type].widget ? { widget: config[type].widget } : null);	});	url = "amengine.aspx?config.mn=DDK_Data_Request&data.config=" + 		DDK.escape.brackets(JSON.stringify(dataConfig));		// load all linked scripts (including plugins)	// and create a master scriptLoad deferred object	scriptLoad = $.when.apply(null, _.map(links, function (link) { return $.loadScript(link); }));		$.ajax({		url: url,		dataType: "json",		type: "POST",		// send the global keyword hash		// except sec.* keywords		data: K.toRequestData(),		success: function (data) {			var widgets = {},				$loading = $("#loading"),				$loadingCSS = $("#loading_css"),				$loadingMask = $("#loading_mask");						if (data && data.datasets) {				_.each("templates header css js nav content".split(" "), function (type, index) {					var raw = data.datasets[index];										widgets[type] = (raw ? _.string.trim(DDK.unescape.brackets(raw)) : "");				});			}			// defer rendering of the content			// until the plugins script and all other linked scripts are loaded			scriptLoad.done(function () {				var $body = $("body"),					$head = $("head"),					$topbar,					$offCanvas,					$offCanvasLists,					$offCanvasDropdownItems;								// cache template functions					if (widgets.templates) {					$(widgets.templates).each(function (index, element) {						var $element = $(element),							templateName						if (element.id && _.string.startsWith(element.id, "template_")) {							templateName = _.string.camelize(element.id.replace("template_", ""));							PS.templateCache[templateName] = _.template($element.html());						}					});				}				if (widgets.css) {					// link elements don't have a closing tag, so can only test for a closing angle bracket					if (/^<style|^<link/i.test(widgets.css) && />$/.test(widgets.css)) {						$head.append(widgets.css);					} else {						$head.append("<style>" + widgets.css + "</style>");					}				}				if (widgets.content) {					// add content to the body					// so it shows up under the loading mask					$(PS.templateCache[widgets.header ? "responsive" : "responsiveNoHeader"]({						content: widgets.content,						title: DDK_TITLE,						header: widgets.header					})).prependTo($body);				}								// setup top-bar				$topbar = $(".inner-wrap > [id^='psc_list_'] nav.top-bar").addClass("show-for-large-up");								// setup off-canvas menu				$offCanvas = $(".left-off-canvas-menu");				// insert nav widget before setting up offCanvasLists				// so that a list control may be used as the nav widget				if (widgets.nav) {					$offCanvas.find("ul.right").after(widgets.nav);				}												// adjust classes and html structure from top-bar style to off-canvas style				$offCanvasLists = $offCanvas.find("ul.right, ul.left")								$offCanvasLists.removeClass("left right")					.addClass("off-canvas-list")					// .siblings() will expand selection to be all child elements from this parent					// because there are two siblings in the calling collection					.siblings()						.replaceAll($offCanvas.find(".top-bar"));									$offCanvasDropdownItems = $offCanvasLists.find(".list-item.has-dropdown");								// setup expandable sections				$offCanvasDropdownItems.children("a").click(function (e) {					// prevent following anchor and closing off-canvas					e.preventDefault();					e.stopPropagation();										// hide nested lists					$(this).parent().toggleClass("closed open").end().siblings("ul").slideToggle();				});								$offCanvasDropdownItems.addClass("closed").children("ul").hide();								// initialize Foundation				$(document).foundation();												// fire DDK.defer callbacks to initialize content				DDK.resourcesLoad.resolve();								// append js and execute				if (widgets.js) {					if (/^<script/i.test(widgets.js) && /<\/script>$/i.test(widgets.js)) {						$body.append(widgets.js);					} else {						$body.append("<script>" + widgets.js + "</script>");					}				}								// initialize DDK Controls that were part of the initial content load				// this needs to come after all developer-included JavaScript is executed				// so that Control customInit functions and other Control configuration				// may be set				$(document).findControls().initControls();								// initialize Prism.js syntax highlighting				Prism && Prism.highlightAll();								// fade out loading message				$loading.fadeOut(300, function () {					$loading.remove();					$loadingCSS.remove();										// then fade out mask (fade in content					$loadingMask.fadeOut(300, function () {						$loadingMask.remove();					});				});			});		}	});};DDK.loadResources();