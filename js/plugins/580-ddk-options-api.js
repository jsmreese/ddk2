// bamset2 options API
PS.extend("optionsAPI");

PS.optionsAPI.formatElement = {
        "id": "format_elem",
        "label": "Format Element Configuration Options",
        "description": "Options for configuring Format Elements via the Build Bam dialog.",
		"exportGroupId": "config",
		"prefix": "elem",
        "dialog": {
                "id": "dialog",
                "label": "Element Options",
                "description": "Options for controlling the Build Element dialog.",
                "options": {}
        },
        "config": {
                "id": "config",
                "label": "Element Config Options",
                "description": "Options for configuring Element object.",
                "options": {
                        "attr": {
                                "id": "elem_attr",
                                "label": "Attributes",
                                "description": "Element attributes.",
                                "notes": "Sets attributes on the element div."
                        },

                        "className": {
                                "id": "elem_class_name",
                                "label": "Classes",
                                "description": "Element classes.",
                                "notes": "Sets classes on the element div."
                        },

                        "value": {
                                "id": "elem_value",
                                "label": "Value",
                                "description": "Element format value.",
                                "notes": "Sets the data-format-value attribute on the element div."
                        },

                        "format": {
                                "id": "elem_format",
                                "label": "Format",
                                "description": "Element format.",
                                "notes": "Sets the data-format attribute on the element div."
                        },

                        "formatStyle": {
                                "id": "elem_format_style",
                                "label": "Format Style",
                                "description": "Element format style.",
                                "notes": "Sets the data-format-style attribute on the element div."
                        },
                        
                        "gridAttr": {
                                "id": "elem_grid_attr",
                                "label": "Grid Attributes",
                                "description": "Element grid attributes.",
                                "notes": "Sets attributes on the element grid div."
                        },

                        "gridClassName": {
                                "id": "elem_grid_class_name",
                                "label": "Grid Classes",
                                "description": "Element grid classes.",
                                "notes": "Sets classes on the element grid div."
                        }
                }
        }                
};

PS.optionsAPI.bam = {
        "id": "bam",
        "label": "Bam Configuration Options",
        "description": "Options for configuring Bams via the Build Bam dialog.",
		"exportGroupId": "config",
		"childType": "element",
		"childName": "formatElement",
		"sections": "header content footer",
		"prefix": "bam",
        "dialog": {
                "id": "dialog",
                "label": "Build Bam Dialog Options",
                "description": "Options for controlling the Build Bam dialog.",
                "options": {
                        "headerStyle": {
                                "id": "bam_header_style",
                                "label": "Mode",
                                "description": "Toggle header between Title/Subtitle configuration and custom format.",
                                "notes": "",
                                "values": [
                                        { "id": "basic", "text": "Title" },
                                        { "id": "custom", "text": "Elements" }
                                ],
                                "displayType": "radio"
                        },
                        "showFooter": {
                                "id": "bam_show_footer",
                                "label": "Footer",
                                "description": "Show BAM Footer section.",
                                "notes": "",
                                "displayType": "checkbox"
                        },
                        "showSubtitle": {
                                "id": "bam_header_show_subtitle",
                                "label": "Subtitle",
                                "description": "Show BAM Subtitle.",
                                "notes": "",
                                "displayType": "checkbox"
                        }
                }
        },
        "config": {
                "id": "config",
                "label": "Bam Config Options",
                "description": "Options for configuring Bam object.",
                "options": {
                        "prefix": {
                                "id": "bam_prefix",
                                "label": "Metric / Dimension",
                                "description": "Metric or Dimension prefix used when rendering bam.",
                                "notes": "Used to evaluate DDK Keyword Alias notation in the context of an AMEngine dataset."
                        },
                        
                        "title": {
                                "id": "bam_title",
                                "label": "Title",
                                "description": "Bam title.",
                                "notes": "If there is not already a bam header element, will create one with a format of text and a value of this title."
                        },

                        "subtitle": {
                                "id": "bam_subtitle",
                                "label": "Subtitle",
                                "description": "Bam subtitle.",
                                "notes": "If there is not already a bam header element, will create one with a format of text and a value of this subtitle."
                        },

                        "attr": {
                                "id": "bam_attr",
                                "label": "Bam Attributes",
                                "description": "Bam attributes.",
                                "notes": "Sets attributes on the bam div."
                        },

                        "className": {
                                "id": "bam_class_name",
                                "label": "Bam Classes",
                                "description": "Bam classes.",
                                "notes": "Sets classes on the bam div."
                        },
                        
                        "headerAttr": {
                                "id": "bam_header_attr",
                                "label": "Bam Header Attributes",
                                "description": "Bam header attributes.",
                                "notes": "Sets attributes on the bam content div."
                        },

                        "headerClassName": {
                                "id": "bam_header_class_name",
                                "label": "Bam Header Classes",
                                "description": "Bam header classes.",
                                "notes": "Sets classes on the bam content div."
                        },
                        
                        "headerElements": {
                                "id": "bam_header_elements",
                                "label": "Bam Header Elements",
                                "description": "Bam header elements.",
                                "notes": "The array of elements contained in the bam content div.",
                                "optionsAPI": "formatElement"
                        },

                        "headerGridAttr": {
                                "id": "bam_header_grid_attr",
                                "label": "Bam Header Grid Attributes",
                                "description": "Bam header grid attributes.",
                                "notes": "Appends attributes on the bam header div. This option is here to separate the section formatting attributes from the grid attributes in the UI. Both are rendered on the same element."
                        },

                        "headerGridClassName": {
                                "id": "bam_header_grid_class_name",
                                "label": "Bam Header Grid Classes",
                                "description": "Bam header grid classes.",
                                "notes": "Appends classes on the bam header div. This option is here to separate the section formatting classes from the grid classes in the UI. Both are rendered on the same element."
                        },

                        "contentAttr": {
                                "id": "bam_content_attr",
                                "label": "Bam Content Attributes",
                                "description": "Bam content attributes.",
                                "notes": "Sets attributes on the bam content div."
                        },

                        "contentClassName": {
                                "id": "bam_content_class_name",
                                "label": "Bam Content Classes",
                                "description": "Bam content classes.",
                                "notes": "Sets classes on the bam content div."
                        },
                        
                        "contentElements": {
                                "id": "bam_content_elements",
                                "label": "Bam Content Elements",
                                "description": "Bam content elements.",
                                "notes": "The array of elements contained in the bam content div.",
                                "optionsAPI": "formatElement"
                        },

                        "contentGridAttr": {
                                "id": "bam_content_grid_attr",
                                "label": "Bam Content Grid Attributes",
                                "description": "Bam content grid attributes.",
                                "notes": "Appends attributes on the bam content div. This option is here to separate the section formatting attributes from the grid attributes in the UI. Both are rendered on the same element."
                        },

                        "contentGridClassName": {
                                "id": "bam_content_grid_class_name",
                                "label": "Bam Content Grid Classes",
                                "description": "Bam content grid classes.",
                                "notes": "Appends classes on the bam content div. This option is here to separate the section formatting classes from the grid classes in the UI. Both are rendered on the same element."
                        },

						"footerAttr": {
                                "id": "bam_footer_attr",
                                "label": "Bam Footer Attributes",
                                "description": "Bam footer attributes.",
                                "notes": "Sets attributes on the bam footer div."
                        },

                        "footerClassName": {
                                "id": "bam_footer_class_name",
                                "label": "Bam Footer Classes",
                                "description": "Bam footer classes.",
                                "notes": "Sets classes on the bam footer div."
                        },
                        
                        "footerElements": {
                                "id": "bam_footer_elements",
                                "label": "Bam Footer Elements",
                                "description": "Bam footer elements.",
                                "notes": "The array of elements contained in the bam footer div.",
                                "optionsAPI": "formatElement"
                        },
                        
                        "footerGridAttr": {
                                "id": "bam_footer_grid_attr",
                                "label": "Bam Footer Grid Attributes",
                                "description": "Bam footer grid attributes.",
                                "notes": "Appends attributes on the bam footer div. This option is here to separate the section formatting attributes from the grid attributes in the UI. Both are rendered on the same element."
                        },

                        "footerGridClassName": {
                                "id": "bam_footer_grid_class_name",
                                "label": "Bam Footer Grid Classes",
                                "description": "Bam footer grid classes.",
                                "notes": "Appends classes on the bam footer div. This option is here to separate the section formatting classes from the grid classes in the UI. Both are rendered on the same element."
                        },
						
                        "gridAttr": {
                                "id": "bam_grid_attr",
                                "label": "Grid Attributes",
                                "description": "Bam grid attributes.",
                                "notes": "Sets attributes on the bam grid div."
                        },

                        "gridClassName": {
                                "id": "bam_grid_class_name",
                                "label": "Grid Classes",
                                "description": "Bam grid classes.",
                                "notes": "Sets classes on the bam grid div."
                        }
                }
        }                
};

PS.optionsAPI.bamset = {
        "id": "bamset",
        "label": "Bamset Configuration Options",
        "description": "Options for configuring Bamsets via the Build Set dialog.",
		"exportGroupId": "config",
		"childType": "bam",
		"childName": "bam",
        "dialog": {
                "id": "dialog",
                "label": "Build Set Dialog Options",
                "description": "Options for controlling the Build Set dialog.",
                "options": {        
                        "isAdvancedEditor": {
                                "id": "is_advanced_editor",
                                "label": "Toggle Advanced Configuration Editor",
                                "description": "If `true`, will generate a JSON editor for the scorecard 'config' option.",
                                "notes": "Controls the configuration editor state.",
                                "displayType": "checkbox button icon",
                                "icon": "&#311;"
                        }
                }
        },
        "header": {
                "id": "header",
                "label": "Build Set Header Options",
                "description": "Options for controlling the Build Set header section.",
                "options": {        
                        "headerStyle": {
                                "id": "set_header_style",
                                "label": "Mode",
                                "description": "Toggle header between Title/Subtitle configuration and custom format.",
                                "notes": "",
                                "values": [
                                        { "id": "basic", "text": "Title" },
                                        { "id": "custom", "text": "BAM" }
                                ],
                                "displayType": "radio"
                        },
                        "showSubtitle": {
                                "id": "set_header_show_subtitle",
                                "label": "Subtitle",
                                "description": "Show Set Subtitle.",
                                "notes": "",
                                "displayType": "checkbox"
                        }
                }
        },
        "config": {
                "id": "config",
                "label": "Bamset Set Config Options",
                "description": "Options for configuring Bamset Set object.",
                "options": {
                        "title": {
                                "id": "set_title",
                                "label": "Title",
                                "description": "Set title.",
                                "notes": "If there is not already a set header bam, will create one and add an element with a format of text and a value of this title."
                        },

                        "subtitle": {
                                "id": "set_subtitle",
                                "label": "Subtitle",
                                "description": "Set subtitle.",
                                "notes": "If there is not already a set header bam, will create one and add an element with a format of text and a value of this subtitle."
                        },

                        "attr": {
                                "id": "set_attr",
                                "label": "Set Attributes",
                                "description": "Set attributes.",
                                "notes": "Sets attributes on the set div."
                        },

                        "className": {
                                "id": "set_class_name",
                                "label": "Set Classes",
                                "description": "Set classes.",
                                "notes": "Sets classes on the set div."
                        },

                        "databind": {
                                "id": "set_databind",
                                "label": "Databind",
								"displayType": "select",
                                "description": "Set databind. Will render the set body bams once only, or once for each record returned by the control query.",
                                "notes": "Default '1'.\nIf '1', will render set_body_bams once in the context of the last record of data.\nIf '2', will render set_body_bams once for each record of data, all in a single div.row element.\nIf '3', will render set_body_bams once for each record of data, with div.row element for each record.\nValue of `false` is treated as '1'. Value of `true` is treated as '2'.",
								"values": [
									{ "id": "1", "label": "No Databind" },
									{ "id": "2", "label": "Databind (single grid row)" },
									{ "id": "3", "label": "Databind (grid row per record)" }									
								]
                        },

                        "headerAttr": {
                                "id": "set_header_attr",
                                "label": "Set Header Attributes",
                                "description": "Set header attributes.",
                                "notes": "Sets attributes on the set header div."
                        },

                        "headerClassName": {
                                "id": "set_header_class_name",
                                "label": "Set Header Classes",
                                "description": "Set header classes.",
                                "notes": "Sets classes on the set header div."
                        },
                        
                        "headerBams": {
                                "id": "set_header_bams",
                                "label": "Set Header Bams",
                                "description": "Set header bams",
                                "notes": "The array of bams contained in the set header div.",
                                "optionsAPI": "bam"
                        },

                        "headerGridAttr": {
                                "id": "set_header_grid_attr",
                                "label": "Set Header Grid Attributes",
                                "description": "Set header grid attributes.",
                                "notes": "Appends attributes on the set header div. This option is here to separate the section formatting attributes from the grid attributes in the UI. Both are rendered on the same element."
                        },

                        "headerGridClassName": {
                                "id": "set_header_grid_class_name",
                                "label": "Set Header Grid Classes",
                                "description": "Set header grid classes.",
                                "notes": "Appends classes on the set header div. This option is here to separate the section formatting classes from the grid classes in the UI. Both are rendered on the same element."
                        },

                        "bodyAttr": {
                                "id": "set_body_attr",
                                "label": "Set Body Attributes",
                                "description": "Set body attributes.",
                                "notes": "Sets attributes on the set body div."
                        },

                        "bodyClassName": {
                                "id": "set_body_class_name",
                                "label": "Set Body Classes",
                                "description": "Set body classes.",
                                "notes": "Sets classes on the set body div."
                        },
                        
                        "bodyBams": {
                                "id": "set_body_bams",
                                "label": "Set Body Bams",
                                "description": "Set body bams",
                                "notes": "The array of bams contained in the set body div.",
                                "optionsAPI": "bam"
                        },

                        "bodyGridAttr": {
                                "id": "set_body_grid_attr",
                                "label": "Set Body Grid Attributes",
                                "description": "Set body grid attributes.",
                                "notes": "Appends attributes on the set body div. This option is here to separate the section formatting attributes from the grid attributes in the UI. Both are rendered on the same element."
                        },

                        "bodyGridClassName": {
                                "id": "set_body_grid_class_name",
                                "label": "Set Body Grid Classes",
                                "description": "Set body grid classes.",
                                "notes": "Appends classes on the set body div. This option is here to separate the section formatting classes from the grid classes in the UI. Both are rendered on the same element."
                        },

                        "footerAttr": {
                                "id": "set_footer_attr",
                                "label": "Set Footer Attributes",
                                "description": "Set footer classes",
                                "notes": "Sets attributes on the set footer div."
                        },

                        "footerClassName": {
                                "id": "set_footer_class_name",
                                "label": "Set Footer Classes",
                                "description": "",
                                "notes": "Sets classes on the set footer div."
                        },
                        
                        "footerBams": {
                                "id": "set_footer_bams",
                                "label": "Set Footer Bams",
                                "description": "Set footer bams.",
                                "notes": "The array of bams contained in the set footer div.",
                                "optionsAPI": "bam"
                        },

                        "footerGridAttr": {
                                "id": "set_footer_grid_attr",
                                "label": "Set Footer Grid Attributes",
                                "description": "Set footer grid attributes.",
                                "notes": "Appends attributes on the set footer div. This option is here to separate the section formatting attributes from the grid attributes in the UI. Both are rendered on the same element."
                        },

                        "footerGridClassName": {
                                "id": "set_footer_grid_class_name",
                                "label": "Set Footer Grid Classes",
                                "description": "Set footer grid classes.",
                                "notes": "Appends classes on the set footer div. This option is here to separate the section formatting classes from the grid classes in the UI. Both are rendered on the same element."
                        },

                }
        }                
};
PS.optionsAPI.navElemConfig = {
	"id": "elemConfig",
	"label": "Element Configuration Options",
	"description": "Options for configuring Elements via the Build Nav dialog.",
	"config": {
		"id": "config",
		"label": "Element Config Options",
		"description": "Options for configuring Element object.",
		"options": {
			"queryWidget": {
				"id": "query_widget",
				"label": "Query Widget",
				"description": "Element query widget.",
				"notes": "Sets query widget"
			},
			"keywords": {
				"id": "keywords",
				"label": "Query Keywords",
				"description": "Keywords to pass to the query widget",
				"notes": "Keywords to pass to the query widget"
			},
			"targetKeyword": {
				"id": "target_keyword",
				"label": "Target Keyword",
				"description": "Keyword to be updated on change of input",
				"notes": "Can have multiple string separated by comma eg. tp_type, tp_start, tp_end"
			},
			"multiple": {
				"id": "multiple",
				"label": "Multiple",
				"description": "Mode of select2",
				"notes": "Mode of select2",
				"default": "false",
				"values": [
					{
						"value": "true",
						"label": "True"
					},
					{
						"value": "false",
						"label": "False"
					}
				]
			},
			"width": {
				"id": "width",
				"label": "Width",
				"description": "width of select2",
				"notes": "Percent or pixel width of select2"
			},
			"pageSize": {
				"id": "page_size",
				"label": "Page Size",
				"description": "Number of data per data retrieval",
				"notes": ""
			},
			"valueWrapString": {
				"id": "value_wrap_string",
				"label": "Value Wrap String",
				"description": "String to be used as a wrapper for the value",
				"notes": ""
			},
			"value": {
				"id": "value",
				"label": "Default Value",
				"description": "Default value of the input",
				"notes": ""
			},
			"label": {
				"id": "label",
				"label": "Default Label",
				"description": "Default selected label for the select2",
				"notes": "This is used to avoid triggering server request on set of default values"
			},
			"valueField": {
				"id": "value_field",
				"label": "Value Field",
				"description": "Value Field mapping for select2, if this is empty navset will use the column with a 'name' suffix in the sql",
				"notes": "This is the alias name of the column set in the sql statement Eg. SQL: SELECT sci_m_id AS dp_value; valueField: dp_value"
			},
			"labelField": {
				"id": "label_field",
				"label": "Label Field",
				"description": "Label Field mapping for select2, if this is empty navset will use the column with a 'label' suffix in the sql",
				"notes": "This is the alias name of the column set in the sql statement Eg. SQL: SELECT sci_m_label AS dp_label; labelField: dp_label"
			},
			"groupField": {
				"id": "group_field",
				"label": "Group Field",
				"description": "Group Field mapping for select2",
				"notes": "This is the alias name of the column set in the sql statement Eg. SQL: SELECT sci_m_type AS dp_group; labelField: dp_group"
			},
			"iconField": {
				"id": "icon_field",
				"label": "Icon Field",
				"description": "Icon Field mapping for select2",
				"notes": "This is the alias name of the column set in the sql statement Eg. SQL: SELECT sci_m_img AS dp_icon; iconField: dp_icon"
			},
			"typeDefault": {
				"id": "type_default",
				"label": "Type Default",
				"description": "Default value for the date type dropdown",
				"notes": "Only used in a date format which specifies the type of date Eg. DAY_THIS, MONTH_RANGE"
			},
			"dateCustomType": {
				"id": "date_custom_type",
				"label": "Date Custom Type",
				"description": "A string target fav (id in the fav value) or an array of json object to be used in the type dropdown",
				"notes": ""
			},
			"hideDateType": {
				"id": "hide_date_type",
				"label": "Hide Date Type",
				"description": "Flag to show/hide the date type dropdown",
				"notes": "",
				"values": [
					{
						"value": "true",
						"label": "True"
					},
					{
						"value": "false",
						"label": "False"
					}
				]
			},
			"cached": {
				"id": "cached",
				"label": "Cached",
				"description": "A feature to cache dropdown options on select2 to improve performance",
				"notes": "",
				"values": [
					{
						"value": "true",
						"label": "True"
					},
					{
						"value": "false",
						"label": "False"
					}
				]
			}
		}
	}		
};
PS.optionsAPI.navElem = {
	"id": "elem",
	"label": "Element Configuration Options",
	"description": "Options for configuring Elements via the Build Nav dialog.",
	"dialog": {
		"id": "elem_options_dialog",
		"label": "Element Options",
		"description": "Options for controlling the Build Element dialog.",
		"options": {}
	},
	"config": {
		"id": "config",
		"label": "Element Config Options",
		"description": "Options for configuring Element object.",
		"options": {
			"attr": {
				"id": "elem_attr",
				"label": "Attributes",
				"description": "Element attributes.",
				"notes": "Sets attributes on the element div."
			},

			"className": {
				"id": "elem_class_name",
				"label": "Classes",
				"description": "Element classes.",
				"notes": "Sets classes on the element div."
			},

			"gridAttr": {
				"id": "elem_grid_attr",
				"label": "Grid Attributes",
				"description": "Element grid attributes.",
				"notes": "Sets attributes on the element grid div."
			},

			"gridClassName": {
				"id": "elem_grid_class_name",
				"label": "Grid Classes",
				"description": "Element grid classes.",
				"notes": "Sets classes on the element grid div."
			},
/*				"id": {
				"id": "elem_id",
				"label": "Elem Id",
				"description": "Element Id.",
				"notes": "Sets id on the element"
			},
*/				"format": {
				"id": "elem_format",
				"label": "Elem Format",
				"description": "Element Format.",
				"notes": "Sets type on the element",
				"default": "label",
				"values": [
					{
						"value": "label",
						"label": "Label"
					},
					{
						"value": "button",
						"label": "Button"
					},
					{
						"value": "input",
						"label": "Input - Text"
					},
					{
						"value": "radio",
						"label": "Option Button"
					},
					{
						"value": "checkbox",
						"label": "Checkbox"
					},
					{
						"value": "select2",
						"label": "Dropdown"
					},
					{
						"value": "dateday",
						"label": "Date - Day"
					},
					{
						"value": "dateweek",
						"label": "Date - Week"
					},
					{
						"value": "datemonth",
						"label": "Date - Month"
					},
					{
						"value": "datequarter",
						"label": "Date - Quarter"
					},
					{
						"value": "dateyear",
						"label": "Date - Year"
					}
					
				]
			},
			"label": {
				"id": "elem_label",
				"label": "Elem label",
				"description": "Element label.",
				"notes": "Sets label on the element"
			},
			"options": {
				"id": "elem_config",
				"label": "Elem options",
				"description": "Element options.",
				"notes": "Options for the element",
				"optionsAPI": "navElemConfig"
			}
		}
	}		
};

PS.optionsAPI.nav = {
	"id": "nav",
	"label": "Nav Configuration Options",
	"description": "Options for configuring Navs via the Build Nav dialog.",
	"config": {
		"id": "config",
		"label": "Nav Config Options",
		"description": "Options for configuring Nav object.",
		"options": {
			"title": {
					"id": "nav_title",
					"label": "Title",
					"description": "Nav title.",
					"notes": "If there is not already a nav header element, will create one with a format of text and a value of this title."
			},

			"subtitle": {
					"id": "nav_subtitle",
					"label": "Subtitle",
					"description": "Nav subtitle.",
					"notes": "If there is not already a nav header element, will create one with a format of text and a value of this subtitle."
			},

			"attr": {
					"id": "nav_attr",
					"label": "Nav Attributes",
					"description": "Nav attributes.",
					"notes": "Sets attributes on the nav div."
			},

			"className": {
					"id": "nav_class_name",
					"label": "Nav Classes",
					"description": "Nav classes.",
					"notes": "Sets classes on the nav div."
			},
			
			"headerAttr": {
					"id": "nav_header_attr",
					"label": "Nav Header Attributes",
					"description": "Nav header attributes.",
					"notes": "Sets attributes on the nav content div."
			},

			"headerClassName": {
					"id": "nav_header_class_name",
					"label": "Nav Header Classes",
					"description": "Nav header classes.",
					"notes": "Sets classes on the nav content div."
			},
			
			"headerElements": {
					"id": "nav_header_elements",
					"label": "Nav Header Elements",
					"description": "Nav header elements.",
					"notes": "The array of elements contained in the nav content div.",
					"optionsAPI": "navElem"
			},

			"contentAttr": {
					"id": "nav_content_attr",
					"label": "Nav Content Attributes",
					"description": "Nav content attributes.",
					"notes": "Sets attributes on the nav content div."
			},

			"contentClassName": {
					"id": "nav_content_class_name",
					"label": "Nav Content Classes",
					"description": "Nav content classes.",
					"notes": "Sets classes on the nav content div."
			},
			
			"contentElements": {
					"id": "nav_content_elements",
					"label": "Nav Content Elements",
					"description": "Nav content elements.",
					"notes": "The array of elements contained in the nav content div.",
					"optionsAPI": "navElem"
			},

			"footerAttr": {
					"id": "nav_footer_attr",
					"label": "Nav Footer Attributes",
					"description": "Nav footer attributes.",
					"notes": "Sets attributes on the nav footer div."
			},

			"footerClassName": {
					"id": "nav_footer_class_name",
					"label": "Nav Footer Classes",
					"description": "Nav footer classes.",
					"notes": "Sets classes on the nav footer div."
			},
			
			"footerElements": {
					"id": "nav_footer_elements",
					"label": "Nav Footer Elements",
					"description": "Nav footer elements.",
					"notes": "The array of elements contained in the nav footer div.",
					"optionsAPI": "navElem"
			},
			
			"gridAttr": {
					"id": "nav_grid_attr",
					"label": "Grid Attributes",
					"description": "Nav grid attributes.",
					"notes": "Sets attributes on the nav grid div."
			},

			"gridClassName": {
					"id": "nav_grid_class_name",
					"label": "Grid Classes",
					"description": "Nav grid classes.",
					"notes": "Sets classes on the nav grid div."
			}
		}
	} 		
};
PS.optionsAPI.navset = {
	"id": "navset",
	"label": "Navset Configuration Options",
	"description": "Options for configuring Navsets via the Build Set dialog.",
	"exportGroupId": "config",
	"dialog": {
		"id": "dialog",
		"label": "Build Set Dialog Options",
		"description": "Options for controlling the Build Set dialog.",
		"options": {	
			"isAdvancedEditor": {
				"id": "is_advanced_editor",
				"label": "Toggle Advanced Configuration Editor",
				"description": "If true, will generate a JSON editor for the scorecard 'config' option.",
				"notes": "Controls the configuration editor state.",
				"displayType": "checkbox button icon",
				"icon": "&#311;"
			}
		}
	},
	"header": {
		"id": "header",
		"label": "Build Set Header Options",
		"description": "Options for controlling the Build Set header section.",
		"options": {        
				"headerStyle": {
						"id": "set_header_style",
						"label": "Mode",
						"description": "Toggle header between Title/Subtitle configuration and custom format.",
						"notes": "",
						"values": [
								{ "id": "basic", "text": "Title / Subtitle" },
								{ "id": "custom", "text": "Custom" }
						],
						"displayType": "radio"
				}
		}
	},
	"config": {
		"id": "config",
		"label": "Navset Set Config Options",
		"description": "Options for configuring Navset Set object.",
		"options": {
			"title": {
					"id": "set_title",
					"label": "Title",
					"description": "Set title.",
					"notes": "If there is not already a set header nav, will create one and add an element with a format of text and a value of this title."
			},

			"subtitle": {
					"id": "set_subtitle",
					"label": "Subtitle",
					"description": "Set subtitle.",
					"notes": "If there is not already a set header nav, will create one and add an element with a format of text and a value of this subtitle."
			},

			"attr": {
					"id": "set_attr",
					"label": "Set Attributes",
					"description": "Set attributes.",
					"notes": "Sets attributes on the set div."
			},

			"className": {
					"id": "set_class_name",
					"label": "Set Classes",
					"description": "Set classes.",
					"notes": "Sets classes on the set div."
			},

			"databind": {
					"id": "set_databind",
					"label": "Databind",
					"displayType": "checkbox",
					"description": "Set databind. Will render the body navs once for each record returned by the control query.",
					"notes": "Default false. If true will render the setBodyNavs array once for each record of data. If false will render the setBodyNavs once in the context of the last record of data."
			},

			"headerAttr": {
					"id": "set_header_attr",
					"label": "Set Header Attributes",
					"description": "Set header attributes.",
					"notes": "Sets attributes on the set header div."
			},

			"headerClassName": {
					"id": "set_header_class_name",
					"label": "Set Header Classes",
					"description": "Set header classes.",
					"notes": "Sets classes on the set header div."
			},
			
			"headerNavs": {
					"id": "set_header_navs",
					"label": "Set Header Navs",
					"description": "Set header navs",
					"notes": "The array of navs contained in the set header div.",
					"optionsAPI": "nav"
			},

			"bodyAttr": {
					"id": "set_body_attr",
					"label": "Set Body Attributes",
					"description": "Set body attributes.",
					"notes": "Sets attributes on the set body div."
			},

			"bodyClassName": {
					"id": "set_body_class_name",
					"label": "Set Body Classes",
					"description": "Set body classes.",
					"notes": "Sets classes on the set body div."
			},
			
			"body_navs": {
				"id": "set_body_navs",
				"label": "Set Body Navs",
				"description": "Set body navs",
				"notes": "The array of navs contained in the set body div.",
				"optionsAPI": "nav"
			},

			"footerAttr": {
					"id": "set_footer_attr",
					"label": "Set Footer Attributes",
					"description": "Set footer classes",
					"notes": "Sets attributes on the set footer div."
			},

			"footerClassName": {
					"id": "set_footer_class_name",
					"label": "Set Footer Classes",
					"description": "",
					"notes": "Sets classes on the set footer div."
			},
			
			"footerNavs": {
					"id": "set_footer_navs",
					"label": "Set Footer Navs",
					"description": "Set footer navs.",
					"notes": "The array of navs contained in the set footer div.",
					"optionsAPI": "nav"
			}
		}
	}		
};



// Scorecard2 Options API
DDK.scorecard2.optionsAPI = {};
DDK.scorecard2.optionsAPI.config = {
	"id": "scorecard_config_settings",
	"label": "Scorecard Configuration Settings",
	"description": "Settings for configuration of Scorecard and Build Scorecard Dialog.",
	"exportGroupId": "scorecard_config_object_settings",
	"dialog": {
		"id": "scorecard_config_dialog_settings",
		"label": "Scorecard Configuration Dialog Settings",
		"description": "Settings for controlling the Build Scorecard Dialog.",
		"options": {
			"isSortable": {
				"id": "is_sortable",
				"label": "Sortable",
				"description": "If `true`, will generate a sortable scorecard.",
				"notes": "Sets the value of the scorecard 'sort.enabled' option.",
				"displayType": "checkbox"
			},
			
			"isGrouped": {
				"id": "is_grouped",
				"label": "Grouped",
				"description": "If `true`, will generate a grouped scorecard.",
				"notes": "Enables the scorecard 'grouping.key' option to have a value.",
				"displayType": "checkbox"
			},
			
			"groupingKey": {
				"id": "grouping_key",
				"label": "Grouping Field",
				"abbr": "by",
				"description": "If 'is_grouped' is `true`, will generate a grouped scorecard.",
				"notes": "If 'is_grouped' is `true`, will set the value of the scorecard 'grouping.key' option.",
				"displayType": "text abbr"
			},
			
			"isAdvancedEditor": {
				"id": "is_advanced_editor",
				"label": "Toggle Advanced Configuration Editor",
				"description": "If `true`, will generate a JSON editor for the scorecard 'config' option.",
				"notes": "Controls the configuration editor state.",
				"displayType": "checkbox button icon",
				"icon": "&#311;"
			}
		}
	},
	"config": {
		"id": "scorecard_config_object_settings",
		"label": "Scorecard Configuration Object Settings",
		"description": "Settings for controlling the top-level scorecard configuration object.",
		"options": {
			"tableAttr": {
				"id": "table_attr",
				"label": "Table Attributes",
				"description": "Attributes rendered on the scorecard table element.",
				"notes": ""
			},
			
			"tableClassName": {
				"id": "table_class_name",
				"label": "Table Classes",
				"description": "Classes rendered on the scorecard table element.",
				"notes": ""
			},
			
			"columns": {
				"id": "columns",
				"label": "Columns",
				"description": "Columns of the scorecard.",
				"notes": "",
				"optionsAPI": "scorecardColumn"
			}
		}
	}
};

DDK.scorecard2.optionsAPI.columnConfig = {
	"id": "scorecard_column_config_settings",
	"label": "Scorecard Column Configuration Settings",
	"description": "Settings for configuration of Scorecard Columns in the Build Scorecard Dialog.",
	"exportGroupId": "scorecard_column_config_object_settings",
	"dialog": {
		"id": "scorecard_column_config_dialog_settings",
		"label": "Scorecard Column Configuration Dialog Settings",
		"description": "Settings for controlling the Build Scorecard Dialog's Column popup.",
		"options": {
			"headerStyle": {
				"id": "header_style",
				"label": "Mode",
				"description": "Toggle header between Title/Subtitle configuration and custom format.",
				"notes": "",
				"values": [
					{ "id": "basic", "text": "Title / Subtitle" },
					{ "id": "custom", "text": "Custom" }
				],
				"displayType": "radio"
			}
		}
	},
	"config": {
		"id": "scorecard_column_config_object_settings",
		"label": "Column",
		"description": "Scorecard column configuration.",
		"options": {
			"prefix": {
				"id": "prefix",
				"label": "Metric / Dimension",
				"description": "",
				"notes": ""
			},
			
			"title": {
				"id": "title",
				"label": "Title",
				"description": "",
				"notes": ""
			},

			"subtitle": {
				"id": "subtitle",
				"label": "Subtitle",
				"description": "",
				"notes": ""
			},

			"attr": {
				"id": "attr",
				"label": "Column Attributes",
				"description": "",
				"notes": ""
			},

			"className": {
				"id": "class_name",
				"label": "Column Classes",
				"description": "",
				"notes": ""
			},

			"sortValue": {
				"id": "sort_value",
				"label": "Sort Value",
				"description": "Sets the value used for column sorting with sortable scorecards.",
				"notes": "Defaults to the value of the bodyContentValue option."
			}
		}
	}
};

_.each([
	{ id: "body", title: "Body", suffix: "Body", tagName: "td" },
	{ id: "header", title: "Header", suffix: "Header", tagName: "th" },
	{ id: "footer", title: "Footer", suffix: "Footer", tagName: "th" },
	{ id: "group", title: "Group Header", suffix: "Group", tagName: "th" }
], function (rowType) {
	var configOptions = DDK.scorecard2.optionsAPI.config.config.options,
		dialogOptions = DDK.scorecard2.optionsAPI.config.dialog.options,
		columnConfigOptions = DDK.scorecard2.optionsAPI.columnConfig.config.options,
		columnDialogOptions = DDK.scorecard2.optionsAPI.columnConfig.dialog.options;
		
	// row config
	configOptions[rowType.id + "RowAttr"] = {
		"id": rowType.id + "_row_attr",
		"label": rowType.title + " Attributes",
		"description": "HTML attributes rendered on each " + rowType.title + " row tr element.",
		"notes": ""
	};
	configOptions[rowType.id + "RowClassName"] = {
		"id": rowType.id + "_row_class_name",
		"label": rowType.title + " Classes",
		"description": "Classes rendered on each " + rowType.title + " row tr element.",
		"notes": ""
	};
	
	// column config
	columnConfigOptions[rowType.id + "Attr"] = {
		"id": rowType.id + "_attr",
		"label": rowType.title + " Cell Attributes",
		"description": "HTML attributes rendered on each " + rowType.tagName + " element in each " + rowType.title + " row.",
		"notes": ""
	};
	columnConfigOptions[rowType.id + "ClassName"] = {
		"id": rowType.id + "_class_name",
		"label": rowType.title + " Cell Classes",
		"description": "Classes rendered on each " + rowType.tagName + " element in each " + rowType.title + " row.",
		"notes": ""
	};
	columnConfigOptions[rowType.id + "Colspan"] = {
		"id": rowType.id + "_colspan",
		"label": rowType.title + " Column Span",
		"description": "Sets the colspan attribute on each " + rowType.tagName + " element in each " + rowType.title + " row.",
		"notes": ""
	};
	
	// column dialog
	if (rowType.id !== "body") {
		columnDialogOptions["show" + rowType.suffix] = {
			"id": "show_" + rowType.id,
			"label": rowType.title,
			"description": "Shows the dialog config section for the " + rowType.title + " row.",
			"notes": ""
		};
	}
	
	// column section
	_.each([
		{ id: "content", title: "Content" },
		{ id: "header", title: "Header" },
		{ id: "footer", title: "Footer" }
	], function (sectionType) {
		var idPrefix = rowType.id + "_" + sectionType.id + "_",
			labelPrefix = rowType.title + " " + sectionType.title + " ",
			propertyPrefix = rowType.id + sectionType.title;
		
		// config
		columnConfigOptions[propertyPrefix + "Attr"] = {
			"id": idPrefix + "attr",
			"label": sectionType.title + " Attributes",
			"description": "HTML attributes rendered on each div." + sectionType.id + " element in each " + rowType.title + " row.",
			"notes": ""
		};
		columnConfigOptions[propertyPrefix + "ClassName"] = {
			"id": idPrefix + "class_name",
			"label": sectionType.title + " Classes",
			"description": "Classes rendered on each div." + sectionType.id + " element in each " + rowType.title + " row.",
			"notes": ""
		};
		columnConfigOptions[propertyPrefix + "Value"] = {
			"id": idPrefix + "value",
			"label": sectionType.title + " Value",
			"description": "Sets the data-format-value attribute on each div." + sectionType.id + " element in each " + rowType.title + " row.",
			"notes": ""
		};
		columnConfigOptions[propertyPrefix + "Format"] = {
			"id": idPrefix + "format",
			"label": sectionType.title + " Format",
			"description": "Sets the data-format attribute on each div." + sectionType.id + " element in each " + rowType.title + " row.",
			"notes": ""
		};
		columnConfigOptions[propertyPrefix + "Style"] = {
			"id": idPrefix + "style",
			"label": sectionType.title + " Format Style",
			"description": "Sets the data-format-style attribute on each div." + sectionType.id + " element in each " + rowType.title + " row.",
			"notes": ""
		};
		
		// dialog
		if (sectionType.id !== "content") {
			columnDialogOptions["show" + rowType.suffix + sectionType.title] = {
				"id": "show_" + rowType.id + "_" + sectionType.id,
				"label": sectionType.title,
				"description": "Shows the dialog config section for the " + rowType.title + " row " + sectionType.title + " section.",
				"notes": ""
			};
		}
	});
});

PS.optionsAPI.scorecard = DDK.scorecard2.optionsAPI.config;
PS.optionsAPI.scorecardColumn = DDK.scorecard2.optionsAPI.columnConfig;
