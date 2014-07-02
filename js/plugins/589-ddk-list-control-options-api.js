PS.optionsAPI.list = {
	"id": "list",
	"label": "List Control Configuration",
	"description": "List Control configuration options.",
	"options": {
		"listMode": {
			"id": "list_mode",
			"label": "Mode",
			"description": "Determines the type of list to be rendered.",
			"notes": "<p>list_mode value will determin default values for many other list configuration options.",
			"defaultValue": "bullet",
			"values": [
				{ "label": "Bullet", "value": "bullet" },
				{ "label": "Ordered", "value": "ordered" },
				{ "label": "Button", "value": "button" },
				{ "label": "Tab", "value": "tab" }
			]
		},

		"listTitle": {
			"id": "list_title",
			"label": "Title",
			"description": "Title appears as a header above the list element.",
			"notes": ""
		}
		
		/*,
		This option will likely be reworked to align with a forthcoming Tree Query API
		Will probably use more generic itemId and itemParentId options that can be databound by default to %%id%% and %%parentId%%
		"listNested": {
			"id": "list_nested",
			"label": "Nested",
			"description": "If <code>true</code>, list is rendered as a nested collection of items.",
			"notes": "<p>Dataset fields <code>child_count</code> and <code>level</code> are used to traverse nested item structure.<p>Tabs and buttons cannot be rendered as nested strucutres."
		}*/
	},

	"listElement": {
		"id": "list_element",
		"label": "List Element",
		"description": "List element configuration.",
		"options": {
			"listAttr": {
				"id": "list_attr",
				"label": "Attributes",
				"description": "Attributes added to the list element.",
				"notes": ""
			},
			
			"listClassName": {
				"id": "list_class_name",
				"label": "Classes",
				"description": "Classes added to the list element.",
				"notes": "<p>The classes <code>small</code>, <code>medium</code>, and <code>large</code> will affect button size in <code>button</code> list mode.<p>The class <code>vertical</code> will render tabs in vertical mode instead of the default horizontal."
			},
			
			"listTemplate": {
				"id": "list_template",
				"label": "Template",
				"description": "Template used to render the list element.",
				"notes": "<p>Evaluated as a Lo-Dash template string.",
				"defaultValue": '<ul class="list-items row full list-<%= listMode %> <%= listClassName %>" <%= listAttr %>><%= items %></ul>'
			}
		}
	},
	
	"itemElement": {
		"id": "item_element",
		"label": "Item Element",
		"description": "List Item element configuration.",
		"options": {
			"itemAttr": {
				"id": "item_attr",
				"label": "Attributes",
				"description": "Attributes added to each list item element.",
				"notes": ""
			},
			
			"itemClassName": {
				"id": "item_class_name",
				"label": "Classes",
				"description": "Classes added to each list item element.",
				"notes": ""
			},
			
			"itemTitle": {
				"id": "item_title",
				"label": "Title",
				"description": "Title attribute added to each list item element.",
				"notes": "",
				"defaultValue": "%%description%%"
			},

			"itemTemplate": {
				"id": "item_template",
				"label": "Template",
				"description": "Template used to render each list item element.",
				"notes": "<p>A list item is rendered for every record in the control dataset.<p>If there is anchor element configuration, the anchor element is rendered inside the list item. Otherwise, the image, label, and content elements are rendered inside the list element.",
				"defaultValue": '<li class="list-item column <%= itemClassName %>" title="<%= itemTitle %>" <%= itemAttr %>><%= (anchorHref || anchorAttr || anchorClassName) ? anchor : image + label + content %></li>'
			}
		}
	},
	
	"anchorElement": {
		"id": "anchor_element",
		"label": "Anchor Element",
		"description": "<p>Anchor element configuration.",
		"notes": "<p>The anchor element is rendered if the <code>anchorAttr</code>, <code>anchorClassName</code>, or <code>anchorHref</code> options have a value.",
		"options": {
			"anchorAttr": {
				"id": "anchor_attr",
				"label": "Attributes",
				"description": "Attributes added to each anchor element.",
				"notes": ""
			},
			
			"anchorClassName": {
				"id": "anchor_class_name",
				"label": "Classes",
				"description": "Classes added to each anchor element.",
				"notes": ""
			},
			
			"anchorHref": {
				"id": "anchor_href",
				"label": "URL",
				"description": "<code>href</code> attribute for each anchor element.",
				"notes": "Anchor element render is not triggered if this option resolves to an AMEngine keyword. e.g. <code>&#126;url&#126;</code>",
				"defaultValue": "%%url%%"
			},

			"anchorTarget": {
				"id": "anchor_target",
				"label": "Target",
				"description": "<code>target</code> attribute for each anchor element.",
				"notes": "",
				"defaultValue": "_blank"
			},
			
			"anchorTemplate": {
				"id": "anchor_template",
				"label": "Template",
				"description": "Template used to render each anchor element.",
				"notes": "<p>The image, label, and content elements are rendered inside the anchor element.",
				"defaultValue": '<a class="list-anchor <%= anchorClassName %>" href="<%= anchorHref %>" target="<%= anchorTarget %>" <%= anchorAttr %>><%= image + label + content %></a>'
			}
		}
	},
	
	"labelElement": {
		"id": "label_element",
		"label": "Label Element",
		"description": "Label element configuration.",
		"notes": "<p>The label element is rendered if the <code>labelAttr</code>, <code>labelClassName</code>, or <code>labelValue</code> options have a value.",
		"options": {
			"labelAttr": {
				"id": "label_attr",
				"label": "Attributes",
				"description": "Attributes added to each label element.",
				"notes": ""
			},
			
			"labelClassName": {
				"id": "label_class_name",
				"label": "Classes",
				"description": "Classes added to each label element.",
				"notes": ""
			},
			
			"labelValue": {
				"id": "label_value",
				"label": "Value",
				"description": "HTML rendered in each label element.",
				"notes": "Label element render is not triggered if this option resolves to an AMEngine keyword. e.g. <code>&#126;label&#126;</code>",
				"defaultValue": "%%label%%"
			},
			
			"labelTemplate": {
				"id": "label_template",
				"label": "Template",
				"description": "Template used to render each label element.",
				"defaultValue": '<div class="list-label <%= labelClassName %>" <%= labelAttr %>><%= labelValue %></div>'
			}
		}
	},

	"imageElement": {
		"id": "image_element",
		"label": "Image Element",
		"description": "Image element configuration.",
		"options": {
			"imageAttr": {
				"id": "image_attr",
				"label": "Attributes",
				"description": "Attributes added to each image element.",
				"notes": ""
			},
			
			"imageClassName": {
				"id": "image_class_name",
				"label": "Classes",
				"description": "Classes added to each image element.",
				"notes": ""
			},
			
			"imageSrc": {
				"id": "image_src",
				"label": "Source",
				"description": "<code>src</code> attribute for each image element.",
				"notes": "Image element render is not triggered if this option resolves to an AMEngine keyword. e.g. <code>&#126;img1&#126;</code>",
				"defaultValue": "%%img1%%"
			},

			"imageAlt": {
				"id": "image_alt",
				"label": "Alt",
				"description": "<code>alt</code> attribute for each image element.",
				"notes": ""
			},
			
			"imageTemplate": {
				"id": "image_template",
				"label": "Template",
				"description": "Template used to render each image element.",
				"defaultValue": '<img class="list-image <%= imageClassName %>" src="<%= imageSrc %>" alt="<%= imageAlt %>" <%= imageAttr %>>'
			}
		}
	},

	"contentElement": {
		"id": "content_element",
		"label": "Content Element",
		"description": "Content element configuration.",
		"options": {
			"contentAttr": {
				"id": "content_attr",
				"label": "Attributes",
				"description": "Attributes added to each content element.",
				"notes": ""
			},
			
			"contentClassName": {
				"id": "content_class_name",
				"label": "Classes",
				"description": "Classes added to each content element.",
				"notes": ""
			},
			
			"contentValue": {
				"id": "content_value",
				"label": "Value",
				"description": "HTML rendered in each content element.",
				"notes": "<p>Content widget render output is appended to the <code>content_value</code> option before template evaluation.<p>Both options <code>content_value</code> and <code>content_widget</code> may have a value, and the combined result will be rendered as the content element HTML."
			},

			"contentWidget": {
				"id": "content_widget",
				"label": "Widget",
				"description": "Widget rendered inside each content element.",
				"notes": "<p>Content widget render output is appended to the <code>content_value</code> option before template evaluation.<p>Both options <code>content_value</code> and <code>content_widget</code> may have a value, and the combined result will be rendered as the content element HTML."
			},
			
			"contentTemplate": {
				"id": "content_template",
				"label": "Template",
				"description": "Template used to render each content element.",
				"defaultValue": '<div class="list-content <%= contentClassName %>" <%= contentAttr %>><%= contentValue %></div>'
			}
		}
	},
/*
	"panelsElement": {
		"id": "panels_element",
		"label": "Panels Element",
		"description": "Attributes and classes applied to the panels container element.",
		"options": {
			"tabsAttr": {
				"id": "panels_attr",
				"label": "Attributes",
				"description": "Attributes added to the panels container element.",
				"notes": ""
			},
			
			"tabsClassName": {
				"id": "panels_class_name",
				"label": "Classes",
				"description": "Classes added to the panels container element.",
				"notes": ""
			}
		}
	}
*/
}
