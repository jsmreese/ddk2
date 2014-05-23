PS.extend("optionsAPI");

PS.optionsAPI.responsiveTemplate = {
	"id": "responsive_template",
	"label": "Responsive Template Options",
	"description": "The DDK Responsive Template combines DDK Controls with the responsive Foundation CSS framework, facilitating the development of responsive dashboards and views.",
	"settings": {
		"id": "settings",
		"label": "Settings",
		"description": "Basic dashboard configuration options.",
		"options": {
			"theme": {
				"id": "theme",
				"label": "Theme",
				"description": "<a href='http://jqueryui.com/'>jQuery UI</a> theme used on the dashboard.",
				"notes": "<p>jQuery UI theme CSS file reference will be automatically generated <code>resources/ddk/themes/[theme]/jquery-ui.css</code>. Custom themes must be installed at this location.<p>jQuery UI themes may be generated using the <a href='http://jqueryui.com/themeroller/'>jQuery UI Themeroller</a>. jQuery UI version 1.10 is included in DDK 2.",
				"defaultValue": "ps-doral"
			},

			"title": {
				"id": "title",
				"label": "Title",
				"description": "Dashboard title.",
				"notes": "<p>Will be used in the rendered page title element, and will be used as the nav bar title text."
			}}
	},
	"links": {
		"id": "links",
		"label": "File Links",
		"description": "External file path references to be used on the dashboard.",
		"options": {
			"css": {
				"id": "link_css",
				"label": "CSS File Links",
				"description": "One or more external CSS files may be referenced by the dashboard.",
				"notes": "<p>Value is a list of one or more CSS file path strings.<p>Paths are relative to the <code>amengine</code> folder.<p>Path strings may be delimited with a comma or with whitespace. e.g. <code>resources/sample/file_1.css,resources/sample/file_2.css</code>"
			},

			"js": {
				"id": "link_js",
				"label": "JavaScript File Links",
				"description": "One or more external JavaScript files may be referenced by the dashboard.",
				"notes": "<p>Value is a list of one or more JavaScript file path strings.<p>Paths are relative to the <code>amengine</code> folder.<p>Path strings may be delimited with a comma or with whitespace. e.g. <code>resources/sample/file_1.js,resources/sample/file_2.js</code><p>Files are requested after the <code>ddk2-responsive-core</code> file is parsed and executed. Files are downloaded asynchronously, so execution order cannot be guaranteed.<p>If dependencies on the <code>ddk2-responsive-plugins</code> file are required, wrap file code in a deferred function to be called after that file is loaded and executed. e.g. <code>DDK.deferPlugins(function () { /* code here... */ });</code><p>If dependencies on the dashboard content are required, wrap file code in a deferred function to be called after the content is loaded and inserted into the DOM. e.g. <code>DDK.defer(function () { /* code here... */ });</code>"
			}}
	},
	"widgets": {
		"id": "widgets",
		"label": "Widgets",
		"description": "Widget references used to render the dashboard.",
		"options": {
			"content": {
				"id": "widget_content",
				"label": "Content Widget",
				"description": "Widget used to render dashboard body content.",
				"notes": "<p>Content widget is not rendered in the initial application load. It is requested using an AJAX call to the Data Request Framework that renders the CSS, JS, and Content widgets.<p>A best practice is to fully render at least one <em>above the fold</em> control or content item in the content widget (using <code>runFromFavorite()</code> or <code>run()</code> on the server).<p>Additional content may be requested after the initial content load is completed using deferred JavaScript. e.g. <code>DDK.defer(function () { DDK.reloadFromFavorite(); });</code>"
			},
			
			"css": {
				"id": "widget_css",
				"label": "CSS Widget",
				"description": "Widget used to render dashboard CSS.",
				"notes": "<p>CSS widget is not rendered in the initial application load. It is requested using an AJAX call to the Data Request Framework that renders the CSS, JS, and Content widgets.<p>A best practice is to move dashboard style rules to external files using the CSS Link option once application development is stable.<p>The CSS widget must be rendered by AMEngine with <em>every dashboard request</em>. External files are cached by the browser and will imporove render performance."
			},

			"error": {
				"id": "widget_error",
				"label": "Error Widget",
				"description": "Widget used to render custom error content when dashboard security validation fails.",
				"notes": "<p>Error widget is only rendered in the initial application load when there is a Security widget defined, but the Security widget's execution does not set the keyword <code>v_securitycheck</code> to a value of <code>passed</code>."
			},

			"js": {
				"id": "widget_js",
				"label": "JavaScript Widget",
				"description": "Widget used to render dashboard JavaScript.",
				"notes": "<p>JavaScript widget is not rendered in the initial application load. It is requested using an AJAX call to the Data Request Framework that renders the CSS, JavaScript, and Content widgets.<p>While it is convenient to use widgets for dashboard JavaScript during development, a best practice is to move dashboard style rules to external files using the JavaScript Link option once the application is stable.<p>The JavaScript widget must be rendered by AMEngine with <em>every dashboard request</em>. External files are cached by the browser and will imporove dashboard render performance."
			},
			
			"loading": {
				"id": "widget_loading",
				"label": "Loading Widget",
				"description": "Widget used to render custom content in place of the Loading message box.",
				"notes": "<p>If it is defined, the Loading widget will be rendered in the initial application load.<p>Be cautious when including dynamically created content in this widget because it will impact the overall dashboard render performance."
			},
			
			"security": {
				"id": "widget_security",
				"label": "Security Widget",
				"description": "Widget used to perform custom security checks.",
				"notes": "<p>If it is defined, the Security widget will be rendered in the initial application load, and must set the keyword <code>v_securitycheck</code> to a value of <code>passed</code>.<p>If the Security widget does not set <code>v_securitycheck</code> or does not set it to a value of <code>passed</code>, an error message will be rendered instead of dashboard content. Custom error content may be configured using the Error widget.<p>The Security widget output (if any) is rendered as the first element child of the document <code>body</code> element.<p>Be cautious when including dynamically created content in this widget because it will impact the overall dashboard render performance."
			},
			
			"setdefaults": {
				"id": "widget_setdefaults",
				"label": "Set Defaults Widget",
				"description": "Widget used to set keyword defaults and perform keyword value validation.",
				"notes": "<p>If it is defined, the Set Defaults widget will be rendered in the initial application load, and should be used to set default keyword values as well as perform keyword value validation. e.g. sanitizing keywords set via the URL query string.<p>The Set Defaults widget output (if any) is rendered in the document <code>head</code> element, and may be used to add custom content to the document <code>head</code> such as additional <code>meta</code> elements.<p>The Set Defaults widget should not be used to add script or style links to the dashboard. Use the CSS Link and JavaScript link options instead.<p>Be cautious when including dynamically created content in this widget because it will impact the overall dashboard render performance."
			}
		}
	}                
};



