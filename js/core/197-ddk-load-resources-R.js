// initial population of global keyword hashK(DDK_KEYWORDS);DDK.loadResources = function () {	var widgets = DDK_CONFIG && DDK_CONFIG.widget,		links = DDK_CONFIG && DDK_CONFIG.link && DDK_CONFIG.link.js && DDK_CONFIG.link.js.split(DDK.regex.delimiter) || [],		dataConfig, url;	// if no page content is specified (via widgets or links)	// load the demo page for the Responsive Template	if (!(widgets.css || widgets.content || widgets.js || links.css || links.js)) {		widgets.content = DDK_CONFIG.widget.content = "DDK2_Responsive_Template_Demo";	}		// load plugins script	$.loadScript('resources/ddk/' + DDK_PATH + '/js/ddk2-plugins-responsive-' + DDK_BUILD + DDK_MIN + '.js');	// load js links	_.each(links, function (link) {		$.loadScript(link);	});		// there will always be a content widget once the default page is created	dataConfig = [		widgets.css ? { widget: widgets.css } : null,		widgets.js ? { widget: widgets.js } : null,		widgets.content ? { widget: widgets.content } : null	];	url = "amengine.aspx?config.mn=DDK_Data_Request&data.config=" + 		DDK.escape.brackets(JSON.stringify(dataConfig));		$.ajax({		url: url,		dataType: "json",		type: "POST",		// send the global keyword hash		// except sec.* keywords		data: K.toRequestData(),		success: function (data) {			var datasets = data && data.datasets,				css = datasets && datasets[0],				js = datasets && datasets[1],				content = datasets && datasets[2],				$loading = $("#loading"),				$loadingMask = $("#loading_mask");			// defer rendering of the content			// until the plugins script is loaded			DDK.deferPlugins(function () {				if (css) {					$("head").append("<style>" + DDK.unescape.brackets(css) + "</style>");				}								if (content) {					// add content to the body					// so it shows up under the loading mask					$("body").prepend(DDK.unescape.brackets(content));				}								// initialize Foundation				$(document).foundation();												// fire DDK.defer callbacks to initialize content				DDK.resourcesLoad.resolve();								// append js and execute				if (js) {					$("body").append("<script>" + DDK.unescape.brackets(js) + "</script>");				}								// initialize DDK Controls that were part of the initial content load				// this needs to come after all developer-included JavaScript is executed				// so that Control customInit functions and other Control configuration				// may be set				$(document).findControls().initControls();								// fade out loading message				$loading.fadeOut(300, function () {					$loading.remove();										// then fade out mask (fade in content					$loadingMask.fadeOut(300, function () {						$loadingMask.remove();					});				});			});		}	});};DDK.loadResources();