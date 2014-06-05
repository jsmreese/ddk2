DDK.controlOptions = function (id) {
	return {
		id: "ddk",
		label: "DDK Control",
		description: "DDK Control options determine all aspects of Control render, from the query used to generate a Control's dataset to custom content in a Control's toolbars.",
		data: {
			id: "data",
			label: "Data",
			description: "Common Control data options govern how data is loaded in the control.  This includes whether the data is loaded server side or client side, if data is to be shared across controls, what data source to use and so on.  For server side data the most used options are the query options detailing how to retrieve the data.",
			options: {
				initWidget: {
					id: "s_" + id + "_iw",
					label: "Options Widget",
					description: "Options widgets provide a way to set all Control options using an ActiveMetrics widget interface.",
					notes: "When using the Metrics Browser, the default options widget is <code>MB2_Content_Options</code>. Control options should be set via the Metrics Browser interface rather than through the Control options widget."
				},
				keywords: {
					id: "s_" + id + "_keywords",
					label: "Keywords",
					description: "Control keywords overrides keywords set elsewhere, such as in the Control options widget or in the global keyword hash.",
					notes: "Keywords must be formatted as a URL query string. e.g. <code>&amp;key1=value1&amp;key2=value2</code>"
				},
				datasource: {
					id: "s_" + id + "_d",
					label: "Datasource",
					description: "Datasource to use when running the control query.",
					defaultValue: "db.amdb"
				},
				datasourceShared: {
					id: "s_" + id + "_dse",
					label: "Shared Datasource Enabled",
					description: "When <code>true</code>, enables Controls to use a previously created AMEngine dataset keyword.",
					notes: "AMEngine dataset keyword must be named <code>psc_component_data</code>. If the dataset keyword is not available, the control well execute its query to create a dataset.",
					values: ["true"],
					examples: ["Example_DDK1_ASD_Advanced_Shared_Datasets", "Example_DDK1_SD_Charts_With_Shared_Dataset"]
				},
				queryWidget: {
					id: "s_" + id + "_qw",
					label: "Query Widget",
					description: "Widget executed to create the Control query.",
					notes: "All keywords used in the Control query must be prefixed with <code>p_</code>."
				},
				queryHeaderWidget: {
					id: "s_" + id + "_qhw",
					label: "Query Header Widget",
					description: "Widget executed to create the Control query header.",
					notes: "The Control query header is set to the keyword <code>config.sqlheader</code> in AMEngine."
				},
				queryFooterWidget: {
					id: "s_" + id + "_qfw",
					label: "Query Footer Widget",
					description: "Widget executed to create the Control query footer.",
					notes: "The Control query footer is set to the keyword <code>config.sqlfooter</code> in AMEngine."
				},
				queryDim: {
					id: "s_" + id + "_qd",
					label: "Query Dimension",
					description: "Query dimension and x-axis for charting in the Chart Control.",
					notes: "Field name. Not wrapped in single quotes."
				},
				queryDimList: {
					id: "s_" + id + "_qdl",
					label: "Query Dimension List",
					description: "List of query dimensions for plotting on the Chart Control x-axis.",
					notes: "Comma-delimited list of field names, each surrounded by single quotes. <p>When using the Metrics Browser, this option will be set automatically based on the Control data.",
					examples: ["Example_DDK1_QDL_Chart_With_Query_Dimension_List"]
				},
				queryDimOrder: {
					id: "s_" + id + "_qdo",
					label: "Query Dimension Order",
					description: "Sort direction for the default sorting of the query dimension.",
					values: ["ASC", "DESC"]
				},
				queryOrder: {
					id: "s_" + id + "_qo",
					label: "Query Order",
					description: "Overrides the default sort direction of the query dimension. Allows for complex query sort expressions.",
					notes: "Option value must be a single field and direction pair. e.g. <code>COLUMN1 DESC</code>. <p>Or a list of field and direction pairs. e.g. <code>'COLUMN1','DESC'^'COLUMN2','ASC'^'COLUMN3','DESC'</code>"
				},
				queryTop: {
					id: "s_" + id + "_qt",
					label: "Query Top",
					description: "Will return the initial number of specified records, depending on sort settings for a query.",
					notes: "Uses the AMEngine query paging feature (<code>config.startrecord</code> and <code>config.maxrecords</code>) for cross platform SQL TOP selection. <p>AMEngine generates paged queries by delegating to the datasource driver."
				},
				queryNameEscapeChar: {
					id: "s_" + id + "_qfnec",
					label: "Query Field Name Escape Character",
					description: "Escape Character for the field name of the Query for the control.",
					notes: "Value must be a single decimal character code. e.g. <code>34</code> will escape all field names with double quotes. <p>Or a comma-separated list of character codes. e.g. <code>91,93</code> will escape all field names with open/close square brackets.",
					examples: ["Example_DDK1_Query_Field_Name_Escape_Character"]
				},
				queryMode: {
					id: "s_" + id + "_qm",
					label: "Query Mode",
					description: "Query mode for the tree or table control.",
					notes: "Table and Tree Controls use options <code>json</code> or <code>xml</code> to use a non-query datasource.",
					values: ["json", "xml", "tsql", "basic", "custom"]
				},
				beforeRender: {
					id: "s_" + id + "_qbr",
					label: "Before Render Function",
					description: "Used by the Table and Tree Controls to execute a function on the JSON or XML response data before passing it to DataTables or JSTree for rendering.",
					notes: "This function transforms the response data into a form acceptable to DataTables or JSTree and must be set if the selected <code>query.mode</code> option is <code>json</code> or <code>xml</code>.",
					examples: ["Example_DDK1_JD_Table_And_Tree_With_JSON_Data"]
				},
				url: {
					id: "s_" + id + "_qu",
					label: "Datasource URL",
					description: "URL from which to retrieve the JSON or XML data.",
					notes: "This option must be set if the selected <code>query.mode</code> option is <code>json</code> or <code>xml</code>.",
					examples: ["Example_DDK1_JD_Table_And_Tree_With_JSON_Data"]
				},
				chooseMetricsDatasource: {
					id: "s_" + id + "_mcd",
					label: "Choose Metrics Datasource",
					description: "Datasource to use when running the query rendered by the Choose Metrics Query Widget.",
					notes: ""
				},
				chooseMetricsQueryWidget: {
					id: "s_" + id + "_mcqw",
					label: "Choose Metrics Query Widget",
					description: "Used by the Table and Chart Controls to specify an alternate query widget for the Choose Metrics dialog."
				},
				exportQueryWidget: { 
					id: "s_" + id + "_eqw",
					label: "Export Query Widget",
					description: "Query used for the CSV data export.",
					notes: "This option is useful if the <code>query.widget</code> has embedded HTML or other formatting built into the SQL that is not suitable for a CSV data export."
				},
				exportFilenameCSV: {
					id: "s_" + id + "_ecf",
					label: "Export CSV Filename",
					description: "File name of the exported CSV file.",
					defaultValue: "data_export_[yyyy]-[mm]-[dd]"
				},
				filter: {
					id: "s_" + id + "_fiv",
					label: "Filter",
					description: "Sets a custom SQL statement to filter control data.",
					notes: ""
				},
				filterValue: {
					id: "s_" + id + "_fv",
					label: "Serialized Filters",
					description: "Serialized representation of the Control Filter toolbar.",
					notes: "Valid operators are <code>LIKE</code>, <code>NOT LIKE</code>, <code>=</code>, <code>NOT =</code>, <code>&gt;</code>, <code>&gt;=</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>NONE</code>. e.g. <code>'Incidents','&gt;=','150'^'Severity','&gt;=','Critical'</code>"
				},
				metricsDynamic: {
					id: "s_" + id + "_md",
					label: "Dynamic Metrics",
					description: "Fields to be rendered as dynamic fields. Dynamic fields may be added to or removed from Chart and Table Controls via the Choose Metrics dialog.",
					notes: "Comma-delimited list of field names, each surrounded by single quotes."
				},
				metricsStatic: {
					id: "s_" + id + "_ms",
					label: "Static Metrics",
					description: "Fields to be rendered as static fields in a Chart or Table Control. Static fields are not available in the Choose Metrics dialog.",
					notes: "Comma-delimited list of field names, each surrounded by single quotes."
				},
				metricsFormat: {
					id: "s_" + id + "_mf",
					label: "Metrics Format",
					description: "Sets the display case for metrics series names.",
					notes: "By default, field names are displayed in title case (underscores to spaces, first character of words is capitalized).",
					values: ["none", "lcase", "ucase"]
				}
			}
		},
		
		config: {
			id: "control_config",
			label: "Configuration",
			description: "Control configuration options are used to govern appearance and client-side effects such as mouseovers.  Many of the options pertain to styling such as Class to reference CSS and Control CSS for custom styles.  Other options trigger client-side effects including Control Javascript which is used to trigger javascript at render time.  One major item of note is the Config option which can contain JSON for control rendering (used especially for BAMSets, Scorecards, and NavSets).",
			options: {
				class_name: {
					id: "s_" + id + "_c",
					label: "Class",
					description: "CSS class for additional styling in the main content.",
					notes: "Default value is <code>[componentName]-default</code>. <p>If adding custom control class names using this option, it is usally a good idea to include the default control class in the custom value. e.g. <code>table-default striped-blue hover-blue</code>"
				},
				config: {
					id: "s_" + id + "_con",
					label: "Config",
					dataType: "json",
					description: "JSON data structure used to render Control content. Describes Scorecard Control columns as well as BAM Control BAMs.",
					notes: "Keywords (globals, data, data aggregate) may be used via DDK Keyword syntax (<code>%%KEY%%</code>). <p>DDK Keyword Alias syntax (<code>%{ATTR}%</code>) may also be used to evaluate metric attributes in the context of each data record."
				},
				configWidget: {
					id: "s_" + id + "_cw",
					label: "Config Widget",
					description: "Widget will be executed after all Control keywords are created, but before Control content render.",
					notes: "May be used to override automatically generated Control keywords, such as chart series keywords.",
					examples: ["Example_DDK1_CCSC_Custom_Chart_Config"]
				},
				controlConfigWidget: {
					id: "s_" + id + "_ccw",
					label: "Control Config Widget",
					description: "Widget will be executed after Control Framework keywords are created, but before Control Framework content render.",
					notes: "May be used to override automatically generated Control Framework keywords, such as <code>table_metrics_dynamic</code>.",
					examples: ["Example_DDK1_Control_Config_Widget"]
				},
				controlCSS: {
					id: "s_" + id + "_ccss",
					label: "Control CSS",
					description: "Arbitrary CSS may be included in control favorites for use with the Metrics Browser and View Designer.",
					notes: "Option value will be automatically wrapped in a <code>style</code> element and will affect the entire document."
				},
				controlJS: {
					id: "s_" + id + "_cjs",
					label: "Control JavaScript",
					description: "Arbitrary javascript may be included in control favorites for use with the Metrics Browser and View Designer.",
					notes: "Option value will be automatically wrapped in a <code>script</code> element. <p>DDK keyword syntax will be evaluated before JavaScript is parsed and executed."
				},
				mouseover: {
					id: "s_" + id + "_mouse",
					label: "Mouseover",
					description: "Mouseover configuration activated via data-ddk-mouseover attribute on the control.",
					notes: "If no value is found in data-ddk-mouseover or a matching key does not exist, no mouseover will be rendered. Specific element for mouseover varies by control: Scorecards apply mouseover to <code>tr</code> elements, while Charts apply mouseover to <code>area</code> elements. BAMs apply mouseover to <code>div.bam</code> elements.",
					examples: ["Example_DDK1_BM_Bamset_Mouseover", "Example_DDK1_SCM_Scorecard_Mouseover"]
				},
				nodataWidget: {
					id: "s_" + id + "_ndw",
					label: "No-Data Widget",
					description: "Custom content to be rendered when control query returns no data.",
					notes: "This will render for all controls except Notes Control."
				}
			}
		},

		toolbars: {
			id: "toolbars",
			label: "Toolbars",
			description: "Control toolbar options govern the buttons and custom content placed around controls.  These can be enabled and disabled globally or turned on/off individually.  Custom toolbars can also be added through widgets.",
			options: {
				toolbarEnabled: {
					id: "s_" + id + "_te",
					label: "Toolbar Enabled",
					description: "When <code>false</code>, globally disables Control toolbars.",
					notes: "",
					values: ["false"],
					examples: ["Example_DDK1_NF_Chart_Grid_With_Toolbars_Disabled"]
				},
				toolbarDefault: {
					id: "s_" + id + "_td",
					label: "Toolbar Default",
					description: "When <code>false</code>, sets the default value of all Control toolbar options to <code>false</code>. <p>Affects these toolbar options: <code>query.top.enabled</code>, <code>preview.enabled</code>, <code>metrics.choose.enabled</code>, <code>filter.enabled</code>, <code>favorite.enabled</code>, <code>export.csv.enabled</code>, <code>filter.global.enabled</code>, <code>refresh.enabled</code>, <code>type.enabled</code>, and <code>config.enabled</code>.", 
					notes: "Individual toolbars may be turned on by setting their specific options to <code>true</code>.",
					values: ["false"]
				}
			},
			toolbarButtons: {
				id: "toolbar_buttons",
				label: "Toolbar Buttons",
				description: "Options to enable or disable individual toolbar buttons.",
				options: {
				
					configEnabled: {
						id: "s_" + id + "_ce",
						label: "Config Enabled",
						description: "Enables or disables the Control Configuration toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					csvExportEnabled: {
						id: "s_" + id + "_ece",
						label: "CSV Export Enabled",
						description: "Enables or disables the Control Export to CSV toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					chooseMetricsEnabled: {
						id: "s_" + id + "_mce",
						label: "Choose Metrics Enabled",
						description: "Enables or disables the Chart and Table Control Choose Metrics toolbar button, or the Scorecard and BAM Control Build Scorecard/BAM button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					editEnabled: {
						id: "s_" + id + "_edite",
						label: "Edit Enabled",
						description: "Enables or disables the Control Edit toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					expandEnabled: {
						id: "s_" + id + "_ee",
						label: "Expand Enabled",
						description: "Enables or disables the Tree Control Expand Nodes buttons.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					favoriteEnabled: {
						id: "s_" + id + "_fe",
						label: "Favorites Enabled",
						description: "Enables or disables the Control Favorites toolbar buttons.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					filterEnabled: {
						id: "s_" + id + "_fie",
						label: "Filter Enabled",
						description: "Enables or disables the Control Filter toolbar buttons.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					filterGlobalEnabled: {
						id: "s_" + id + "_fge",
						label: "Global Filter Enabled",
						description: "Enables or disables the Table and Tree Control global search text input.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					headerEnabled: {
						id: "s_" + id + "_he",
						label: "Header Enabled",
						description: "Enables or disables the Control header.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					helpEnabled: {
						id: "s_" + id + "_helpe",
						label: "Help Enabled",
						description: "Enables or disables the Control Help toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					previewEnabled: {
						id: "s_" + id + "_pe",
						label: "Preview Enabled",
						description: "Enables or disables the Control Preview toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					queryTopEnabled: {
						id: "s_" + id + "_qte",
						label: "Query Top Enabled",
						description: "Enables or disables the Control Sort toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					refreshEnabled: {
						id: "s_" + id + "_re",
						label: "Refresh Enabled",
						description: "Enables or disables the Control Reload toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					},
					typeEnabled: {
						id: "s_" + id + "_tye",
						label: "Type Enabled",
						description: "Enables or disables the Chart Control Chart Type toolbar button.",
						notes: "Default value is from the <code>toolbar_default</code> option.",
						values: ["true", "false"]
					}
				}
			},

			toolbarWidgets: {
				id: "toolbar_widgets",
				label: "Toolbar Widgets",
				description: "Toolbar widgets add custom content to Control tooblars.",
				options: {
			
					bottomLeft: {
						id: "s_" + id + "_tblw",
						label: "Bottom Left Widget",
						description: "Widget to render in the Control's bottom left toolbar."
					},
					bottomRight: {
						id: "s_" + id + "_tbrw",
						label: "Bottom Right Widget",
						description: "Widget to render in the Control's bottom right toolbar."
					},
					topLeft: {
						id: "s_" + id + "_ttlw",
						label: "Top Left Widget",
						description: "Widget to render in the Control's top left toolbar."
					},
					topRight: {
						id: "s_" + id + "_ttrw",
						label: "Top Right Widget",
						description: "Widget to render in the Control's top right toolbar."
					},
					topTopLeft: {
						id: "s_" + id + "_tttlw",
						label: "Top Top Left Widget",
						description: "Widget to render in the Control's top top left toolbar."
					},
					topTopRight: {
						id: "s_" + id + "_tttrw",
						label: "Top Top Right Widget",
						description: "Widget to render in the Control's top top right toolbar."
					},

					helpWidget: {
						id: "s_" + id + "_helpw",
						label: "Custom Help Content Widget",
						description: "Widget to render in the Control's toolbar help dialog.",
						examples: ["Example_DDK1_CHC_Custom_Help_Dialog_Content"]
					}
				}
			}
		},
		
		favorite: {
			id: "control_favorite",
			label: "Favorite",
			description: "Control favorite options are special parameters used to control the Favorite record loaded for a Control.  These are not typically edited by users.  They are used by the UIs for favorites.",
			options: {
				fav_description: {
					id: "s_" + id + "_fdesc",
					label: "Favorite Description",
					description: "Favorite Bar tooltip.",
					notes: "Rendered from the Favorite record description field."
				},
				fav_id: {
					id: "s_" + id + "_fid",
					label: "Favorite Id",
					description: "Favorite record id."
				},
				fav_label: {
					id: "s_" + id + "_flab",
					label: "Favorite Label",
					description: "Favorite Bar label.",
					notes: "Rendered from the Favorite record label field."
				},
				fav_uid: {
					id: "s_" + id + "_fuid",
					label: "User Id",
					description: "Owner of the loaded Favorite record."
				}
			}
		},
		
		paging: {
			id: "paging",
			label: "Paging",
			description: "Paging is used by the Table and Tree Controls to determine how much data should be loaded from the server at one time.",
			options: {
				thresholdClient: {
					id: "s_" + id + "_ptc",
					label: "Client Threshold",
					description: "Record count threshold to automatically enable client-side paging.",
					notes: "Maximum value is 5000. Above 5000 records, server paging mode is enforced.",
					defaultValue: "200"
				},
				thresholdServer: {
					id: "s_" + id + "_pts",
					label: "Server Threshold",
					description: "Record count threshold to automatically enable server-side paging.",
					notes: "Maximum value is 5000. Above 5000 records, server paging mode is enforced.",
					defaultValue: "1000"
				},
				type: {
					id: "s_" + id + "_pt",
					label: "Type",
					description: "Paging type for the table control.",
					notes: "If not specified, will automatically determine paging type based on query record count. For best performance with large datasets, set a value of <code>server</code> to force server paging mode.",
					values: ["none", "client", "server"]
				}
			}
		},
		
		headerFooter: {
			id: "header_footer",
			label: "Header and Footer",
			description: "Widgets to add custom header and footer content to control tables.",
			notes: "Used by controls that generate HTML tables: Table, Scorecard (v1 and v2).",
			options: {
				headerWidger: {
					id: "s_" + id + "_hw",
					label: "Header Widget",
					description: "Custom content for a control's <code>thead</code> element.",
					notes: "Will be rendered before any control-generated header content. <p>Widget may access AMEngine datasets using the <code>psc_component_data</code> datasource. <p>Header content must have the same number of (or fewer) columns than the control. The header renders nicely with an overhanging th colspan (colspan set so that it runs off the edge of the control if rendered at full column-spanned width). The entire dataset is not available at render time in server-side paging mode, so use aggregate functions with caution.",
					examples: ["Example_DDK1_CHF_Table_With_Custom_Header_And_Footer"]
				},
				footerWidger: {
					id: "s_" + id + "_fw",
					label: "Footer Widget",
					description: "Custom content for a control's <code>tfoot</code> element.",
					notes: "Will be rendered after any control-generated footer content. <p>Widget may access AMEngine datasets using the <code>psc_component_data</code> datasource. <p>Footer content must have the same number of (or fewer) columns than the control. The footer renders nicely with an overhanging th colspan (colspan set so that it runs off the edge of the control if rendered at full column-spanned width). The entire dataset is not available at render time in server-side paging mode, so use aggregate functions with caution.",
					examples: ["Example_DDK1_CHF_Table_With_Custom_Header_And_Footer"]
				}
			}
		},
		scorecard: {
			id: "scorecard",
			label: "Scorecard",
			description: "Options specific to the Scorecard Control.",
			notes: "Used by both Scorecard v1 and Scorecard v2.",
			options: {
				groupingKey: {
					id: "s_" + id + "_gk",
					label: "Grouping Key",
					description: "Field name to be used for grouping scorecard rows.",
					notes: "Scorecards are rendered ungrouped by default. If this option has a value, the scorecard will be grouped on changes in the specified field's data."
				},
				groupingExpanded: {
					id: "s_" + id + "_ge",
					label: "Grouping Expanded",
					description: "When <code>true</code>, scorecard groups will be initialized in an open state.",
					notes: "Scorecard groups are rendered in a collapsed state by default. <p>This option does nothing when the <code>grouping.key</code> option has no value.",
					values: ["true"]
				},
				sortEnabled: {
					id: "s_" + id + "_soe",
					label: "Sort Enabled",
					description: "When <code>true</code>, enables sorting on scorecards.",
					notes: "The jQuery <a href=\"http://datatables.net\">DataTables</a> plugin is used to create a sortable scorecard. <p>This option does nothing when the <code>grouping.key</code> option is set. <p> The default value for Scorecard v1 is <code>true</code>. The default value for Scorecard v2 is <code>false</code>.",
					values: ["true"]
				}
			}
		},
		table: {
			id: "table",
			label: "Table",
			description: "Options specific to the Table Control.",
			options: {
				filterMetricsSelect: {
					id: "s_" + id + "_fms",
					label: "Column Filters (Dropdown)",
					description: "Places a selectable dropdown above columns for in-browser record filtering.",
					notes: "Comma-delimited list by field names, each surrounded by single quotes. <p>e.g. <code>'COLUMN_A','COLUMN_B'</code>"
				},
				filterMetricsText: {
					id: "s_" + id + "_fmt",
					label: "Column Filters (Text Input)",
					description: "Places a text input field above columns for in-browser record filtering.",
					notes: "Comma-delimited list by field names, each surrounded by single quotes. <p>e.g. <code>'COLUMN_A','COLUMN_B'</code>"
				},
				sortValue: {
					id: "s_" + id + "_sv",
					label: "Sort Value",
					description: "Initial sorting applied to table columns. Applied in the browser, not at the data level.",
					notes: "Comma-delimited list of column indexes (0-based) and sort orders, each surrounded by single quotes. <p>e.g. <code>'0','asc'^'2','desc'</code>"
				}
			}
		},

		chart: {
			id: "chart",
			label: "Chart",
			description: "Options specific to the Chart Control.",
			options: {
				title: {
					id: "s_" + id + "_ti",
					label: "Title",
					description: "Title for the rendered chart.",
					notes: ""
				},
				type: {
					id: "s_" + id + "_ty",
					label: "Type",
					description: "Default type used for chart series.",
					notes: "May be overridden for any particular series using the <code>chart_series_type_...</code> options.",
					values: ["point", "line", "stepline", "column", "stackedcolumn", "stackedcolumn100", "area", "stackedarea", "stackedarea100", "bar", "stackedbar", "stackedbar100", "pie", "doughnut"]
				},
				height: {
					id: "s_" + id + "_h",
					label: "Height",
					description: "Height of the content in the chart control (not including toolbars).",
					defaultValue: "300"
				},
				width: {
					id: "s_" + id + "_w",
					label: "Width",
					description: "Width of content in the chart control (not including toolbars).",
					defaultValue: "500"
				},
				autoRefreshEnabled: {
					id: "s_" + id + "_are",
					label: "Auto-Refresh Enabled",
					description: "When <code>false</code>, disables chart auto-refresh for any configuration change.",
					notes: "The Auto-Refresh option toggle is at the top of the Series Config toolbar.",
					values: ["false"]
				},
				dataTableEnabled: {
					id: "s_" + id + "_de",
					label: "Data Table Enabled",
					description: "When <code>true</code>, displays a datatable under the chart showing series values.",
					notes: "For chart types with a vertical y-axis only (area, column, line, etc.) <p>Datatable is not displayed under the pie, doughnut, or bar chart types.",
					values: ["true"]
				},
				labelAutoEnabled: {
					id: "s_" + id + "_lae",
					label: "Automatic Labels Enabled",
					description: "When <code>false</code>, disables automatic chart axis labels.",
					notes: "Default axis labels are created from the names of the series plotted on each axis.",
					values: ["false"]
				},
				labelAxisX: {
					id: "s_" + id + "_lax",
					label: "Axis X Label",
					description: "Label for the x-axis.",
					notes: "Default x-axis label is the name of the series plotted on the x-axis."
				},
				labelAxisY: {
					id: "s_" + id + "_lay",
					label: "Axis Y Label",
					description: "Label for the primary y-axis.",
					notes: "Default primary y-axis label is the names of the series plotted on y-axis."
				},
				labelAxisY2: {
					id: "s_" + id + "_lay2",
					label: "Axis Y2 Label",
					description: "Label for the secondary y-axis.",
					notes: "Default secondary y-axis label is the names of the series plotted on secondary y-axis."
				},
				stackedLabelY: {
					id: "s_" + id + "_layse",
					label: "Stacked Series Labels Enabled, Axis Y",
					description: "When <code>true</code>, enables labels for stacked series totals for series on the primary y-axis.",
					notes: "",
					values: ["true"]
				},
				stackedLabelY2: {
					id: "s_" + id + "_lay2se",
					label: "Stacked Series Labels Enabled, Axis Y2",
					description: "When <code>true</code>, enables labels for stacked series totals for series on the secondary y-axis.",
					notes: "",
					values: ["true"]
				},
				legendPosition: {
					id: "s_" + id + "_lp",
					label: "Legend Position",
					description: "Position of the chart legend relative to the chart.",
					notes: "",
					values: ["none", "top", "bottom", "left", "right"],
					defaultValue: "right"
				},
				seriesConfigPosition: {
					id: "s_" + id + "_scp",
					label: "Series Config Position",
					description: "Position of the Series Config toolbar.",
					notes: "",
					values: ["none", "top", "bottom", "left", "right"],
					defaultValue: "left"
				},
				templateWidget: {
					id: "s_" + id + "_tw",
					label: "Template Widget",
					description: "AMEngine Chart widget containing theme parameters for the Chart Control.",
					notes: "Widget chart attributes will be used by the Chart Control as it is rendered. <p>Series, title, height, and width chart attributes will be ignored."
				}
			},
			series: {
				id: "series",
				label: "Series",
				description: "Used to configure Chart Control series.",
				options: {
					chartArea: {
						id: "s_" + id + "_sca",
						label: "Chart Area",
						description: "Fields to render on separate chart areas.",
						notes: "Comma-delimited field names, each surrounded by single quotes, with each area delimited by a caret. <p>e.g. <code>'COLUMN1','COLUMN2'^'COLUMN3'^'COLUMN4'</code>."
					},
					color: {
						id: "s_" + id + "_sc",
						label: "Color",
						description: "Sets series colors using an indexed list of fields matched to <code>chart_color</code> option indexes.",
						notes: "Comma-delimited field names, each surrounded by single quotes, with each color delimited by a caret. <p>e.g. <code>'COLUMN1','COLUMN2'^'COLUMN3'^'COLUMN4'</code>. <p>Series color indexes matched by splitting the <code>chart_series_color</code> option on <code>^</code> and the <code>chart_color</code> option on a comma."
					},
					configWidget: {
						id: "s_" + id + "_scw",
						label: "Series Config Widget",
						description: "Widget executed for any series in the chart control. Widgets may be configured for particular series, for all series, for all static series, and for all dynamic series.",
						notes: "Value is written ad part of a JavaScript object literal. e.g. <code>'Games':'Example_DDK1_CCSC_Chart_SeriesConfig_Games', 'dynamic':'Example_DDK1_CCSC_Chart_SeriesConfig_Dynamic', 'static':'Example_DDK1_CCSC_Chart_SeriesConfig_Static', 'all':'Example_DDK1_CCSC_Chart_SeriesConfig_All'</code>",
						examples: ["Example_DDK1_CCSC_Custom_Chart_Config"]
					},
					enabled: {
						id: "s_" + id + "_se",
						label: "Enabled Series",
						description: "Series to be rendered on the chart.",
						notes: "Comma-delimited list of field names, each surrounded by single quotes. <p>If this option does not have a value, all <code>metrics_static</code> and <code>metrics_dynamic</code> fields are rendered as series."
					},
					mapAreaWidget: {
						id: "s_" + id + "_smw",
						label: "Map Area Aattributes Widget",
						description: "Widget used to render custom chart map area attributes.",
						notes: "Will override default chart map area attributes, which will disable default chart map area mouseovers.",
						examples: ["Example_DDK1_CMCE_Custom_Chart_Events"]
					},
					pie: {
						id: "s_" + id + "_sp",
						label: "Pie",
						description: "Series to render when the chart type is set to <code>pie</code>.",
						notes: "Field name."
					},
					showLabels: {
						id: "s_" + id + "_sslav",
						label: "Show Value Labels",
						description: "Series to be rendered with values labels displayed.",
						notes: "Comma-delimited list of field names, each surrounded by single quotes."
					},
					formatAxisX: {
						id: "s_" + id + "_sxf",
						label: "X Axis Format",
						description: "Format type for the x-axis.",
						notes: "X-axis format options expect query dimension field values in the format <code>yyyy-mm-dd</code> as output by the SQL function <code>CONVERT(VARCHAR(10), &lt;datetime&gt;, 120)</code>. <p>The <code>-dash</code> format variant uses a dash between formatted strings rather than spaces or newline characters.",
						values: ["day", "day-dash", "month", "month-dash"],
						examples: ["Example_DDK1_AXF_AxisX_Format"]
					},
					formatWidgetAxisX: {
						id: "s_" + id + "_sxfw",
						label: "X Axis Format Widget",
						description: "Custom format widget for chart x-axis values.",
						notes: "Widget should execute a keyword update on <code>chart.series&#126;chart_series_index&#126;.points.valuex</code>. Keyword value should be an AMEngine server code block (VBScript is best) that will be executed for each chart x-axis value. <p>See widget <code>PSC_Chart_Build_Series_Detail_xAxis_day</code>."
					},
					secondaryAxisY: {
						id: "s_" + id + "_sys",
						label: "Secondary Y Axis",
						description: "Fields to render as series on the secondary y-axis.",
						notes: "Comma-delimited list of field names, each surrounded by single quotes."
					}
				},
				type: {
					id: "type",
					label: "Type",
					description: "Used to override the default chart type for specific series.",
					notes: "Based on these options, a series will strive to be the type that best fits the default chart type. <p>If a series appears in both the <code>bar</code> and <code>area</code> options, and the default chart type is <code>line</code>, then the series will be displayed with type <code>area</code>.",
					options: {
						area: {
							id: "s_" + id + "_sta",
							label: "Area",
							description: "Fields to render as area series for charts with a vertical y-axis (area, column, line, etc.)",
							notes: "Comma-delimited list of field names, each surrounded by single quotes."
						},
						bar: {
							id: "s_" + id + "_stb",
							label: "Bar",
							description: "Fields to render as bar series for charts with a horizontal y-axis (bar).",
							notes: "Comma-delimited list of field names, each surrounded by single quotes."
						},
						column: {
							id: "s_" + id + "_stc",
							label: "Column",
							description: "Fields to render as column series for charts with a vertical y-axis (area, column, line, etc.)",
							notes: "Comma-delimited list of field names, each surrounded by single quotes."
						},
						line: {
							id: "s_" + id + "_stl",
							label: "Line",
							description: "Fields to render as line series for charts with a vertical y-axis (area, column, line, etc.)",
							notes: "Comma-delimited list of field names, each surrounded by single quotes."
						},
						point: {
							id: "s_" + id + "_stp",
							label: "Point",
							description: "Fields to render as point series for charts with a vertical y-axis (area, column, line, etc.)",
							notes: "Comma-delimited list of field names, each surrounded by single quotes."
						},
						stacked: {
							id: "s_" + id + "_sts",
							label: "Stacked",
							description: "Fields to render as stacked series when series type is <code>bar</code>, <code>column</code>, or <code>area</code>.",
							notes: "Comma-delimited list of field names, each surrounded by single quotes."
						},
						stepLine: {
							id: "s_" + id + "_stsl",
							label: "Step Line",
							description: "Fields to render as stepline series for charts with a vertical y-axis (area, column, line, etc.)",
							notes: "Comma-delimited list of field names, each surrounded by single quotes."
						}
					}
				}
			}
		},

		tree: {
			id: "tree",
			label: "Tree",
			description: "Options specific to the Tree Control.",
			options: {
				nodesId: {
					id: "s_" + id + "_nid",
					label: "Nodes Id",
					description: "Filters the tree by returning a single level of leaf nodes of the given node id.",
					notes: "(Not in Options Widget. For internal use) Highest priority over all option filters, if set to a value tree will ignore other option filters.",
					defaultValue: ""
				},
				nodesLoad: {
					id: "s_" + id + "_nl",
					label: "Nodes Load",
					description: "Filters the tree with the given list of node id and open them with its leaf nodes.",
					notes: "Third highest priority on all option filters. If set to a value, tree will ignore tree_nodes_open. Format is a comma separated list of id with single quotes. Should not contain double quotes.",
					defaultValue: ""
				},
				nodesMenuDefaultCreate: {
					id: "s_" + id + "_nmdcr",
					label: "Nodes Menu Default Create",
					description: "Callback function when a node is created.",
					notes: "Format is a function name or an anonymous function.",
					defaultValue: ""
				},
				nodesMenuDefaultDelete: {
					id: "s_" + id + "_nmdd",
					label: "Nodes Menu Default Delete",
					description: "Callback function when a node is deleted.",
					notes: "Format is a function name or an anonymous function.",
					defaultValue: ""
				},
				nodesMenuDefaultEnabled: {
					id: "s_" + id + "_nmde",
					label: "Nodes Menu Default Enabled",
					description: "When <code>false</code>, hides the default create, edit, rename, delete items in the context menu.",
					notes: "Actions and labels for these items can be added/modified in the nodesMenuItems",
					values: ["true", "false"],
					defaultValue: "true"
				},
				nodesMenuDefaultRename: {
					id: "s_" + id + "_nmdr",
					label: "Nodes Menu Default Rename",
					description: "Callback function when a node is renamed.",
					notes: "Format is a function name or an anonymous function.",
					defaultValue: ""
				},
				nodesMenuEnabled: {
					id: "s_" + id + "_nme",
					label: "Nodes Menu Enabled",
					description: "Enables the context menu when you right click on a node. ",
					notes: "Actions and labels for these items can be added/modified in the nodesMenuItems",
					defaultValue: "true"
				},
				nodesMenuItems: {
					id: "s_" + id + "_nmi",
					label: "Nodes Menu Items",
					description: "Custom items which are included on the context menu. ",
					notes: "Should be in a JSON Format and should not contain double quotes. Options are the same with the jstree contextmenu plugin http://www.jstree.com/documentation/contextmenu.",
					defaultValue: ""
				},
				nodesOnClick: {
					id: "s_" + id + "_noc",
					label: "Nodes On Click",
					description: "Action when a node is clicked.",
					notes: "Difference with onselect is the onselect triggers when the tree is refreshed since the selection is retain when tree is refreshed. Format is a function name or an anonymous function.",
					defaultValue: ""
				},
				nodesOnSelect: {
					id: "s_" + id + "_nos",
					label: "Nodes On Select",
					description: "Action that triggers when a node is selected in the tree.",
					notes: "Format is a function name or an anonymous function.",
					defaultValue: ""
				},
				nodesOnSelectEnabled: {
					id: "s_" + id + "_nose",
					label: "Nodes On Select Enabled",
					description: "Enables highlighing of nodes.",
					notes: "",
					defaultValue: "true"
				},	
				nodesOpen: {
					id: "s_" + id + "_no",
					label: "Nodes Open",
					description: "Opens the node(s) of the given list of node id.",
					notes: "Lowest priority on all option filters. Only triggers when the other 3 option filters are empty. Format is a comma separated list of id with single quotes. Should not contain double quotes. ",
					defaultValue: ""
				},
				nodesSearch: {
					id: "s_" + id + "_ns",
					label: "Nodes Search",
					description: "Filters the tree with the given string without their children. ",
					notes: "Second highest priority on all option filters. If set to a value, tree will ignore tree_nodes_load and tree_nodes_open. Format is a string without single or double quotes.",
					defaultValue: ""
				},
				nodesSearchText: {
					id: "s_" + id + "_nst",
					label: "Nodes Search Text",
					description: "Custom text displayed after tree return search results",
					notes: "Use &#126;reccount&#126; keyword to indicate result count. e.g. <code>&#126;reccount&#126; matching metric(s).</code>",
					defaultValue: "Found &#126;reccount&#126; object(s)"
				},
				nodesSort: {
					id: "s_" + id + "_nso",
					label: "Nodes Sort",
					description: "Sort columns of the tree nodes.",
					notes: "Uses sql sorting and takes priority over the sort dropdown in the toolbar.",
					defaultValue: ""
				},
				nodesSortDefault: {
					id: "s_" + id + "_nsod",
					label: "Nodes Sort Default",
					description: "Default value of the sort dropdown.",
					notes: "",
					values: ["node_label", "node_name", "sort_order"],
					defaultValue: "node_label"
				},
				nodesTitle: {
					id: "s_" + id + "_nt",
					label: "Nodes Title",
					description: "Tooltip text for the nodes.",
					notes: "text should be wrapped in single quotes and can also use the column names. Eg. 'id = '+node_id",
					defaultValue: ""
				},
				nodesTypes: {
					id: "s_" + id + "_nty",
					label: "Nodes Types",
					description: "Custom types of nodes.",
					notes: "Options are the same with jstree type plugin http://www.jstree.com/documentation/types. Should be in JSON format without double quotes.",
					defaultValue: ""
				}
			}
		}
	};
};

PS.optionsAPI.ddkControl = DDK.controlOptions("content");
