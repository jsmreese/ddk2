// initial population of global keyword hashK(DDK_KEYWORDS);DDK.loadResources = function () {	var widgets = DDK_CONFIG && DDK_CONFIG.widget,		links = DDK_CONFIG && DDK_CONFIG.link && DDK_CONFIG.link.js && DDK_CONFIG.link.js.split(DDK.regex.delimiter) || [],		dataConfig, url;	// if no page content is specified (via widgets or links)	// load the demo page for the Responsive Template	if (!(widgets.css || widgets.content || widgets.js || links.css || links.js)) {		widgets.content = DDK_CONFIG.widget.content = "DDK2_Responsive_Template_Demo";	}		// add plugins script to start of links list	links.shift('resources/ddk/' + DDK_PATH + '/js/ddk2-plugins-responsive-' + DDK_BUILD + DDK_MIN + '.js');		// there will always be a content widget once the default page is created	dataConfig = [		{ widget: "PSC_CWP_Templates" },		widgets.css ? { widget: widgets.css } : null,		widgets.js ? { widget: widgets.js } : null,		widgets.content ? { widget: widgets.content } : null	];	url = "amengine.aspx?config.mn=DDK_Data_Request&data.config=" + 		DDK.escape.brackets(JSON.stringify(dataConfig));		$.ajax({		url: url,		dataType: "json",		type: "POST",		// send the global keyword hash		// except sec.* keywords		data: K.toRequestData(),		success: function (data) {			var datasets = data && data.datasets,				templates = datasets && datasets[0],				css = datasets && datasets[1],				js = datasets && datasets[2],				content = datasets && datasets[3],				$loading = $("#loading"),				$loadingCSS = $("#loading_css"),				$loadingMask = $("#loading_mask");			// defer rendering of the content			// until the plugins script and all other linked scripts are loaded			$.when.apply(null, _.map(links, function (link) { return $.loadScript(link); })).done(function () {				var $body = $("body"),					$head = $("head");								if (templates) {					$body.append(templates);				}								if (css) {					$head.append("<style>" + DDK.unescape.brackets(css) + "</style>");				}								if (content) {					// add content to the body					// so it shows up under the loading mask					$('<section class="main"></section>').prependTo($body).html(DDK.unescape.brackets(content));				}								// initialize Foundation				$(document).foundation();				// cache PureShare templates				$('[id^="template_"]').each(function (index, element) {					var $element = $(element),						templateName = _.string.camelize(element.id.replace("template_", ""));					PS.templateCache[templateName] = _.template($element.html());				});											// fire DDK.defer callbacks to initialize content				DDK.resourcesLoad.resolve();								// append js and execute				if (js) {					$body.append("<script>" + DDK.unescape.brackets(js) + "</script>");				}								// initialize DDK Controls that were part of the initial content load				// this needs to come after all developer-included JavaScript is executed				// so that Control customInit functions and other Control configuration				// may be set				$(document).findControls().initControls();								// initialize Prism.js syntax highlighting				Prism && Prism.highlightAll();								// fade out loading message				$loading.fadeOut(300, function () {					$loading.remove();					$loadingCSS.remove();										// then fade out mask (fade in content					$loadingMask.fadeOut(300, function () {						$loadingMask.remove();					});				});			});		}	});};DDK.loadResources();