/*
"nodes_id nid",
"nodes_level nlvl",
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
"nodes_search_text_enabled nste false",
"nodes_sort nso",
"nodes_sort_default nsod",
"nodes_title nt",
"nodes_types nty",
*/

DDK.controlOptions = function (id) {
	return {
		id: "ddk",
		label: "DDK Control State",
		data: {
			id: "data",
			label: "Data",
			options: {
				initWidget: { id: "s_" + id + "_iw", label: "Options Widget", description: "The options in the data-options.", notes: "Widget name." },
				keywords: { id: "s_" + id + "_keywords", label: "Keywords", description: "The state keyword overrides the option keyword, which overrides the data-options attribute.", notes: "" },
				datasource: { id: "s_" + id + "_d", label: "Datasource", description: "Datasource to use when running the query specified in the 'query_widget' option.", notes: "Default value is 'db.amdb'." },
				datasourceShared: { id: "s_" + id + "_dse", label: "Shared Datasource Enabled", description: "Enables (true) or disables (false) the use of a datasource that is being used or shared with other components.", notes: "" },
				queryWidget: { id: "s_" + id + "_qw", label: "Query Widget", description: "Query for the content in the control.", notes: "Widget name." },
				queryHeaderWidget: { id: "s_" + id + "_qhw", label: "Query Header Widget", description: "Query header for the control.", notes: "The value of this option is applied to the AMEngine's 'config.sqlheader' attribute." },
				queryDim: { id: "s_" + id + "_qd", label: "Query Dimension", description: "Query dimension and x-axis for charting in the chart control.", notes: "Field name." },
				queryDimList: { id: "s_" + id + "_qdl", label: "Query Dimension List", description: "List of query dimensions.", notes: "Comma-delimited list by label names each surrounded by single quotes. The chart dimension selector displays this list as options. If value is not \[blank\], the chart dimension toolbar is displayed." },
				queryDimOrder: { id: "s_" + id + "_qdo", label: "Query Dimension Order", description: "Sort direction for the default sorting of the query dimension.", notes: "Accepted values are: ASC and DESC." },
				queryOrder: { id: "s_" + id + "_qo", label: "Query Order", description: "Overrides the default sort direction of the query dimension.", notes: "The value of this option must be a single field and direction pair (e.g. COLUMN1 DESC) or a list of field and direction pairs (e.g. 'COLUMN1','DESC'^'COLUMN2','ASC'^'COLUMN3','DESC'" },
				queryTop: { id: "s_" + id + "_qt", label: "Query Top", description: "Sets the select arbitrary TOP \[value\] records for display in the Top Sort toolbar.", notes: "This option uses the AMEngine's query paging facility for cross platform SQL TOP selection." },
				queryNameEscapeChar: { id: "s_" + id + "_qfnec", label: "Query Field Name Escape Character", description: "Escape Character for the field name of the Query for the control.", notes: "" },
				queryMode: { id: "s_" + id + "_qm", label: "Query Mode", description: "Query mode for the tree or table control.", notes: "Accepted values are: tsql, json, xml, basic, custom." },
				beforeRender: { id: "s_" + id + "_qbr", label: "Before Render Function", description: "Executes a function on the JSON or XML response data before passing it to DataTables for rendering.", notes: "This option transforms the response data into a form acceptable to DataTables and must be set if the selected 'query.mode' option is JSON or XML." },
				url: { id: "s_" + id + "_qu", label: "Datasource URL", description: "URL from which to retrieve the JSON or XML data.", notes: "This option must be set if the selected 'query.mode' option is json or xml." },
				chooseMetricsDatasource: { id: "s_" + id + "_mcd", label: "Choose Metrics Datasource", description: "Datasource to use when running the query specified in the 'metrics_choose_query_widget' option.", notes: "" },
				chooseMetricsEnabled: { id: "s_" + id + "_mce", label: "Choose Metrics Enabled", description: "Enables (true) or disables (false) the 'Choose Metrics' option in the Chart or Table control UI.", notes: "" },
				chooseMetricsQueryWidget: { id: "s_" + id + "_mcqw", label: "Choose Metrics Query Widget", description: "Different query to use in the 'Choose Metrics' option in the Chart and Table control UI.", notes: "Widget name." },
				exportQueryWidget: { id: "s_" + id + "_eqw", label: "Export Query Widget", description: "Query used for the CSV data export.", notes: "This option is useful if the 'query_widget' option has embedded HTML or other formatting built into the SQL that is not suitable for a CSV data export." },
				exportFilenameCSV: { id: "s_" + id + "_ecf", label: "Export CSV Filename", description: "File name of the exported CSV file.", notes: "Default value is data_export_[yyyy]-[mm]-[dd]." },
				filter: { id: "s_" + id + "_fiv", label: "Filter", description: "Sets a custom SQL statement to filter control data.", notes: "" },
				filterValue: { id: "s_" + id + "_fv", label: "Serialized Filters", description: "Serialized filters for the Filter toolbar.", notes: "Valid operators are LIKE, NOT LIKE, =, NOT =, >, >=, <, <=, NONE. e.g. ‘Incidents,’‘>=’‘150’^‘Severity,’‘>=’‘Critical’" },
				metricsDynamic: { id: "s_" + id + "_md", label: "Dynamic Metrics", description: "Metrics to be rendered as dynamic metrics and made available in the 'Choose Metrics' option in the chart control UI.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
				metricsStatic: { id: "s_" + id + "_ms", label: "Static Metrics", description: "Metrics to be rendered as static metrics. These metrics are not available in the 'Choose Metrics' option in the Chart and Table control UI.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
				metricsFormat: { id: "s_" + id + "_mf", label: "Metrics Format", description: "Sets the display type for metrics series names.", notes: "Accepted values are: none, default, lcase, and ucase." }
			}
		},
		toolbars: {
			id: "toolbars",
			label: "Toolbars",
			options: {
				toolbarEnabled: { id: "s_" + id + "_te", label: "Toolbar Enabled", description: "Enables (true) or disables (false) the toolbars in the toolbar in the control.", notes: "" },
				toolbarDefault: { id: "s_" + id + "_td", label: "Toolbar Default", description: "Enables (true) or disables (false) the setting of a single default for all of the following toolbar options: 'query.top.enabled', 'preview.enabled', 'metrics.choose.enabled', 'filter.enabled', 'favorite.enabled', 'export.csv.enabled', 'filter.global.enabled', 'refresh.enabled', 'type.enabled', and 'config.enabled'.", notes: "If 'toolbar.default' is set to false, all of the above options default to false, regardless if they were individually set to true." },
				configEnabled: { id: "s_" + id + "_ce", label: "Config Enabled", description: "Enables (true) or disables (false) the Configuration toolbar in the control.", notes: "" },
				csvExportEnabled: { id: "s_" + id + "_ece", label: "CSV Export Enabled", description: "Enables (true) or disables (false) the 'Export to CSV' option in the control UI.", notes: "" },
				editEnabled: { id: "s_" + id + "_edite", label: "Edit Enabled", description: "Enables (true) or disables (false) the edit option for the control.", notes: "" },
				expandEnabled: { id: "s_" + id + "_ee", label: "Expand Enabled", description: "Enables (true) or disables (false) the ability to expand nodes in the tree control UI.", notes: "" },
				favoriteEnabled: { id: "s_" + id + "_fe", label: "Favorites Enabled", description: "Enables (true) or disables (false) the Favorites toolbar.", notes: "" },
				filterEnabled: { id: "s_" + id + "_fie", label: "Filter Enabled", description: "Enables (true) or disables (false) the Filter toolbar in the control UI.", notes: "" },
				filterGlobalEnabled: { id: "s_" + id + "_fge", label: "Global Filter Enabled", description: "Enables (true) or disables (false) the display of the global text filter input in the control.", notes: "" },
				headerEnabled: { id: "s_" + id + "_he", label: "Header Enabled", description: "Enables (true) or disables (false) the header in the control UI.", notes: "" },
				helpEnabled: { id: "s_" + id + "_helpe", label: "Help Enabled", description: "Enables (true) or disables (false) the help button toolbar in the control.", notes: "" },
				helpWidget: { id: "s_" + id + "_helpw", label: "Custom Help Content Widget", description: "Sets custom content for the help widget in the toolbar in the control.", notes: "" },
				previewEnabled: { id: "s_" + id + "_pe", label: "Preview Enabled", description: "Enables (true) or disables (false) the 'Preview' option in the chart control UI.", notes: "" },
				queryTopEnabled: { id: "s_" + id + "_qte", label: "Query Top Enabled", description: "Enables (true) or disables (false) the Top Sort toolbar in the chart control UI.", notes: "" },
				refreshEnabled: { id: "s_" + id + "_re", label: "Refresh Enabled", description: "Enables (true) or disables (false) the refresh toolbar in the control UI.", notes: "" },
				typeEnabled: { id: "s_" + id + "_tye", label: "Type Enabled", description: "Enables (true) or disables (false) the Type toolbar in the control UI.", notes: "" },
				
				bottomLeft: { id: "s_" + id + "_tblw", label: "Bottom Left Widget", description: "Content to display in the bottom left toolbar in the control.", notes: "Widget name." },
				bottomRight: { id: "s_" + id + "_tbrw", label: "Bottom Right Widget", description: "Content to display in the bottom right toolbar in the control.", notes: "Widget name." },
				topLeft: { id: "s_" + id + "_ttlw", label: "Top Left Widget", description: "Content to display in the top left toolbar in the control.", notes: "Widget name." },
				topRight: { id: "s_" + id + "_ttrw", label: "Top Right Widget", description: "Content to display in the top left toolbar in the control.", notes: "Widget name." }
			}
		},
		config: {
			id: "control_config",
			label: "Configuration",
			options: {
				"class": { id: "s_" + id + "_c", label: "Class", description: "CSS class for additional styling in the main content.", notes: "Default value is \[componentName\]-default." },
				config: { id: "s_" + id + "_con", label: "Config", dataType: "json", description: "Comma-separated list of JSON objects for scorecard or bamset control.", notes: "Keywords (including global keywords, data result set keywords, and automatic data result set aggregate keywords) may be used in this option for any column attribute; all ~ characters must be escaped as %% (double percent)." },
				configWidget: { id: "s_" + id + "_cw", label: "Config Widget", description: "Overrides or adds chart attributes via keywords included in the widget.", notes: "Widget. Runs immediately before the control renders." },
				controlConfigWidget: { id: "s_" + id + "_ccw", label: "Control Config Widget", description: "Sets the custom config for all series in the chart, all dynamic series, all static series, and/or for specific individual series.", notes: "Widget" },
				controlCSS: { id: "s_" + id + "_ccss", label: "Control CSS", description: "Sets the arbitrary CSS to be included in control favorites for use with the Metrics Browser and View Designer.", notes: "Option value will be automatically wrapped in \"<style></style>\" tags and will affect the entire document." },
				controlJS: { id: "s_" + id + "_cjs", label: "Control JavaScript", description: "Arbitrary javascript to be included in control favorites for use with the Metrics Browser and View Designer.", notes: "In the rendered JavaScript script element, function calls are not allowed, so code such as `console.log(\"message\");` will have no effect. Property assignments are allowed, and DDK keyword syntax will be evaluated." },
				mouseover: { id: "s_" + id + "_mouse", label: "Mouseover", description: "Custom mouseover configurations that are activated via a data-ddk-mouseover attribute assigned to any element.", notes: "If no value is found in data-ddk-mouseover or a matching key does not exist, no mouseover will be rendered." },
				nodataWidget: { id: "s_" + id + "_ndw", label: "No-Data Widget", description: "Custom content to be rendered when control query returns no data.", notes: "This will render for all controls except Notes Control." },
				height: { id: "s_" + id + "_h", label: "Height", description: "Height of the content in the chart control (not including toolbars).", notes: "Default value is 300." },
				width: { id: "s_" + id + "_w", label: "Width", description: "Width of content in the chart control (not including toolbars).", notes: "Default value is 500." }
			}
		},
		favorite: {
			id: "control_favorite",
			label: "Favorite",
			options: {
				fav_description: { id: "s_" + id + "_fdesc", label: "Favorite Description", description: "Favorite Bar tooltip." },
				fav_id: { id: "s_" + id + "_fid", label: "Favorite Id", description: "Favorite Id." },
				fav_label: { id: "s_" + id + "_flab", label: "Favorite Label", description: "Favorite Bar label." },
				fav_fod: { id: "s_" + id + "_fod", label: "Favorite Option Display", description: "Deprecated option." },
				fav_uid: { id: "s_" + id + "_fuid", label: "User Id", description: "Favorite User Id" },
			}
		},
		chart: {
			id: "chart",
			label: "Chart",
			options: {
				title: { id: "s_" + id + "_ti", label: "Title", description: "Title for the chart control.", notes: "" },
				type: { id: "s_" + id + "_ty", label: "Type", description: "Default type used for chart series.", notes: "Accepted values are: point, line, stepline, area, stackedarea, stackedarea100, column, stackedcolumn, stackedcolumn100, bar, stackedbar, stackedbar100, doughnut, and pie." },
				autoRefreshEnabled: { id: "s_" + id + "_are", label: "Auto-Refresh Enabled", description: "Enables (true) or disables (false) the 'Auto-Refresh ON/OFF' option at the top of the Series Config toolbar.", notes: "Boolean." },
				dataTableEnabled: { id: "s_" + id + "_de", label: "Data Table Enabled", description: "Enables (true) or disables (false) a datatable under the chart showing series values.", notes: "For vertical chart types only; does not display a datatable under the pie, doughnut, or bar chart types." },
				labelAutoEnabled: { id: "s_" + id + "_lae", label: "Automatic Labels Enabled", description: "Enables (true) or disables (false) the automatic setting of labels for axis.", notes: "Boolean. Labels are set to the names of the series plotted on each axis as the label for that axis." },
				labelAxisX: { id: "s_" + id + "_lax", label: "Axis X Label", description: "Label for the x-axis.", notes: "Default x-axis label is the names of the series plotted on the x-axis." },
				labelAxisY: { id: "s_" + id + "_lay", label: "Axis Y Label", description: "Label for the y-axis.", notes: "Default y-axis label is the names of the series plotted on y-axis (left side)." },
				labelAxisY2: { id: "s_" + id + "_lay2", label: "Axis Y2 Label", description: "Label for the secondary y-axis.", notes: "Default secondary y-axis label is the names of the series plotted on secondary y-axis (right side)." },
				stackedLabelY: { id: "s_" + id + "_layse", label: "Stacked Series Labels Enabled, Axis Y", description: "Enables (true) or disables (false) labels for stacked series totals for series on the y-axis.", notes: "Boolean." },
				stackedLabelY2: { id: "s_" + id + "_lay2se", label: "Stacked Series Labels Enabled, Axis Y2", description: "Enables (true) or disables (false) labels for stacked series totals for series on the secondary y-axis.", notes: "Boolean." },
				legend: { id: "s_" + id + "_lp", label: "Legend Position", description: "Position of the chart legend relative to the chart.", notes: "Accepted values are: none, top, bottom, left, right." },
				seriesConfig: { id: "s_" + id + "_scp", label: "Series Config Position", description: "Position of the Series Config toolbar.", notes: "Accepted values are: none, top, bottom, left, right." },
				templateWidget: { id: "s_" + id + "_tw", label: "Template Widget", description: "Theme options for the chart control.", notes: "Widget." }
			},
			series: {
				id: "series",
				label: "Series",
				options: {
					chartArea: { id: "s_" + id + "_sca", label: "Chart Area", description: "Fields to render on separate chart areas. Comma-delimited list of field names each surrounded by single quotes, with each area delimited by a caret (e.g. 'COLUMN1','COLUMN2'^'COLUMN3'^'COLUMN4'.", notes: "Caret-delimited list of comma-delimited lists of single-quote-wrapped field names." },
					color: { id: "s_" + id + "_sc", label: "Color", description: "Series color indexes matched by splitting the 'series_color' option on ^ and the 'color' option on a comma (,). Indexes must be formatted as field lists delimited by ^.", notes: "" },
					configWidget: { id: "s_" + id + "_scw", label: "Config Widget", description: "Custom configurations for all series in the chart control, including dynamic and static series and specific individual series.", notes: "Widget" },
					enabled: { id: "s_" + id + "_se", label: "Enabled", description: "Fields to render as series.", notes: "Comma-delimited list by label names each surrounded by single quotes. A \[blank\] value indicates that all 'metrics_static' and 'metrics_dynamic' fields are rendered as series." },
					mapareaWidget: { id: "s_" + id + "_smw", label: "Map Area Aattributes Widget", description: "Chart and map area attributes.", notes: "Widget" },
					pie: { id: "s_" + id + "_sp", label: "Pie", description: "Field to render as series when the chart type is set to 'pie'.", notes: "Field name." },
					showLabels: { id: "s_" + id + "_sslav", label: "Show Value Labels", description: "Fields to render as series with values shown as labels.", notes: "Comma-delimited list of field names each surrounded by single quotes." },
					formatAxisX: { id: "s_" + id + "_sxf", label: "X Axis Format", description: "Auto-format type for the x-axis.", notes: "The date auto-format expects the query dimension field to be VARCHAR in the format yyyy-mm-dd as output by the SQL function 'CONVERT(VARCHAR(10), <datetime>, 120)'. The -dash format variant uses a dash between formatted strings rather than spaces or newline characters." },
					formatWidgetAxisX: { id: "s_" + id + "_sxfw", label: "X Axis Format Widget", description: "Custom format for the x-axis.", notes: "Widget" },
					secondaryAxisY: { id: "s_" + id + "_sys", label: "Secondary Y Axis", description: "Fields to render as series on the secondary y-axis.", notes: "Comma-delimited list by field names each surrounded by single quotes." }
				},
				type: {
					id: "type",
					label: "Type",
					options: {
						area: { id: "s_" + id + "_sta", label: "Area", description: "Fields to render as area series for vertical chart types.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
						bar: { id: "s_" + id + "_stb", label: "Bar", description: "Fields to render as bar series for horizontal chart types.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
						column: { id: "s_" + id + "_stc", label: "Column", description: "Fields to render as column series for vertical chart types.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
						line: { id: "s_" + id + "_stl", label: "Line", description: "Fields to render as line series for vertical chart types.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
						point: { id: "s_" + id + "_stp", label: "Point", description: "Fields to render as point series for vertical chart types.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
						stacked: { id: "s_" + id + "_sts", label: "Stacked", description: "Fields to render as stacked series when chart type is 'bar', 'column', or 'area'.", notes: "Comma-delimited list by field names each surrounded by single quotes." },
						stepLine: { id: "s_" + id + "_stsl", label: "Step Line", description: "Fields to render as stepline series for vertical chart types.", notes: "Comma-delimited list by field names each surrounded by single quotes." }
					}
				}
			}
		},
		scorecard: {
			id: "scorecard",
			label: "Scorecard",
			options: {
				headerWidger: { id: "s_" + id + "_hw", label: "Header Widget", description: "Custom content for the header.", notes: "Widget may access AMEngine datasets using the 'psc_component_data' attribute. Header content must have the same number of (or fewer) columns than the control. The header renders nicely with an overhanging th colspan (colspan set so that it runs off the edge of the control if rendered at full column-spanned width). The entire dataset is not available at render time in server-side paging mode, so use aggregate functions with caution." },
				footerWidger: { id: "s_" + id + "_fw", label: "Footer Widget", description: "Custom content for the footer.", notes: "Widget may access AMEngine datasets using the 'psc_component_data' attribute. Footer content must have the same number of (or fewer) columns than the control. The footer renders nicely with an overhanging th colspan (colspan set so that it runs off the edge of the control if rendered at full column-spanned width). The entire dataset is not available at render time in server-side paging mode, so use aggregate functions with caution." },
				groupingKey: { id: "s_" + id + "_gk", label: "Grouping Key", description: "Grouping field name key for the control query.", notes: "If this option has no value, the control is rendered ungrouped. If it has a value, the control is rendered grouped. Grouped control do not use DataTables but ungrouped control do use DataTables." },
				groupingExpanded: { id: "s_" + id + "_ge", label: "Grouping Expanded", description: "Enables (true) or disables (false) expanded grouping.", notes: "If true, control groups are rendered expanded. If false, control groups are rendered collapsed." },
				sortEnabled: { id: "s_" + id + "_soe", label: "Sort Enabled", description: "Enables (true) or disables (false) the 'Sort' option buttonset.", notes: "This option does nothing when the 'grouping.key' option is set." }
			}
		},
		table: {
			id: "table",
			label: "Table",
			options: {
				filterMetricsSelect: { id: "s_" + id + "_fms", label: "Select Column Filters", description: "Selectable filter drop-down menus for columns.", notes: "The filter menu displays at the top of the column it is set for. Comma-delimited list by field names each surrounded by single quotes." },
				filterMetricsText: { id: "s_" + id + "_fmt", label: "Text Column Filters", description: "Filter text field for columns.", notes: "Filter text field displays at the top of the column it is set for. Comma-delimited list by field names each surrounded by single quotes." },
				sortValue: { id: "s_" + id + "_sv", label: "Sort Value", description: "Sorting order of the table column", notes: "Comma-delimited list by field number and sort order each surrounded by single quotes. e.g. '0','asc'^'2','desc'" }
			}
		},
		paging: {
			id: "paging",
			label: "Paging",
			options: {
				thresholdClient: { id: "s_" + id + "_ptc", label: "Client Threshold", description: "Record count threshold to automatically enable client-side paging.", notes: "Default value is 200." },
				thresholdServer: { id: "s_" + id + "_pts", label: "Server Threshold", description: "Record count threshold to automatically enable server-side paging.", notes: "Default value is 1000. Maximum value is 5000. Above 5000 records, server paging is enforced." },
				type: { id: "s_" + id + "_pt", label: "Type", description: "Paging type for the table control.", notes: "Accepted values are \[BLANK\], none, client, server. If \[BLANK\], will automatically determine paging type based on query record count. For best performance with large datasets, set a value of 'server'." }
			}
		}
	};
};

PS.optionsAPI.ddkControl = DDK.controlOptions("content");