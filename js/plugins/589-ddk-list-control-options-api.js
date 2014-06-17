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
			"defaultValue": "bullets",
			"values": [
				{ "label": "Bullets", "value": "bullets" },
				{ "label": "Ordered", "value": "ordered" },
				{ "label": "Buttons", "value": "buttons" },
				{ "label": "Tabs", "value": "tabs" },
				{ "label": "Custom", "value": "custom" }
			]
		},

		"listTitle": {
			"id": "list_title",
			"label": "Title",
			"description": "Title appears as a header above the list element.",
			"notes": ""
		},
		
		"listNested": {
			"id": "list_nested",
			"label": "Nested",
			"description": "If <code>true</code>, list is rendered as a nested collection of items.",
			"notes": "<p>Dataset fields <code>child_count</code> and <code>level</code> are used to traverse nested item structure.<p>Tabs and buttons cannot be rendered as nested strucutres."
		},

		"listElement": {
			"id": "list_element",
			"label": "List Element",
			"description": "Attributes and classes applied to the list element.",
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
					"notes": "<p>Use these classes to control visiblity of list item components: <code>hide-label</code>, <code>hide-description</code>, <code>hide-image</code>, <code>hide-content</code>.<p>The class <code>compact</code> will remove spacing between list items."
				},
				
				"listTagName": {
					"id": "list_tag_name",
					"label": "Tag Name",
					"description": "Tag name used for the list element.",
					"notes": "<p>Default value depends on the list mode option.<table><thead><tr><th>List Mode</th><th>Default Value</th></thead><tbody><tr><td>bullets</td><td>ul</td></tr><tr><td>tabs-*</td><td>ul</td></tr><tr><td>ordered</td><td>ol</td></tr><tr><td>definitions</td><td>dl</td></tr><tr><td>general</td><td>div</td></tr><tr><td>buttons-*</td><td>div</td></tr></tbody></table>"
				}
			}
		},
		
		"itemElement": {
			"id": "item_element",
			"label": "Item Element",
			"description": "Attributes and classes applied to the list item element.",
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
				
				"itemTagName": {
					"id": "item_tag_name",
					"label": "Item Tag Name",
					"description": "Tag name used for each list item element.",
					"notes": "<p>Default value depends on the list mode option. List item elements are not rendered for every list mode."
				},
				
				"itemTemplate": {
					"id": "item_template",
					"label": "Template",
					"description": "Template used to render the contents of each list item element.",
					"notes": "<p>If a list item element is rendered, template will render the html content of each list item element. Otherwise, template will render the entire list item."
				}
			}
		},
		
		"anchorElement": {
			"id": "anchor_element",
			"label": "Anchor Element",
			"description": "Attributes and classes applied to the anchor element.",
			"options": {
				"anchorAttr": {
					"id": "anchor_attr",
					"label": "Attributes",
					"description": "Attributes added to each list anchor element.",
					"notes": ""
				},
				
				"anchorClassName": {
					"id": "anchor_class_name",
					"label": "Classes",
					"description": "Classes added to each list anchor element.",
					"notes": ""
				},
				
				"anchorHref": {
					"id": "anchor_href",
					"label": "URL",
					"description": "<code>href</code> attribute for each list item anchor element.",
					"notes": "",
					"defaultValue": "%%url%%"
				},

				"anchorTarget": {
					"id": "anchor_target",
					"label": "Target",
					"description": "<code>target</code> attribute for each list item anchor element.",
					"notes": "",
					"defaultValue": "_blank"
				}
			}
		},
		
		"labelElement": {
			"id": "label_element",
			"label": "Label Element",
			"description": "Attributes and classes applied to the label element.",
			"options": {
				"labelAttr": {
					"id": "label_attr",
					"label": "Attributes",
					"description": "Attributes added to each list item label element.",
					"notes": ""
				},
				
				"labelClassName": {
					"id": "label_class_name",
					"label": "Classes",
					"description": "Classes added to each list item label element.",
					"notes": ""
				},
				
				"labelValue": {
					"id": "label_value",
					"label": "Label",
					"description": "Value rendered in each list item label element.",
					"notes": "",
					"defaultValue": "%%label%%"
				}
			}
		},

		"imageElement": {
			"id": "image_element",
			"label": "Image Element",
			"description": "Attributes and classes applied to the image element.",
			"options": {
				"imageAttr": {
					"id": "image_attr",
					"label": "Attributes",
					"description": "Attributes added to each list item image element.",
					"notes": ""
				},
				
				"imageClassName": {
					"id": "image_class_name",
					"label": "Classes",
					"description": "Classes added to each list item image element.",
					"notes": ""
				},
				
				"imageSrc": {
					"id": "image_src",
					"label": "Image Source",
					"description": "<code>src</code> attribute for each list item image element.",
					"notes": "Default value varies by list mode.<p>For <code>buttons-large</code>, default value is <code>%%img1%%</code> and images are expected to be 128x128 px.<p>For <code>buttons-medium</code>, default value is <code>%%img2%%</code> and images are expected to be 64x64 px.<p>For all other modes, default value is <code>%%img3%%</code> and images are expected to be 32x32 px."
				},

				"imageAlt": {
					"id": "image_alt",
					"label": "Image Alt",
					"description": "<code>alt</code> attribute for each list item image element.",
					"notes": ""
				}
			}
		},

		"descriptionElement": {
			"id": "description_element",
			"label": "Description Element",
			"description": "Attributes and classes applied to the description element.",
			"options": {
				"descriptionAttr": {
					"id": "description_attr",
					"label": "Attributes",
					"description": "Attributes added to each list item description element.",
					"notes": ""
				},
				
				"descriptionClassName": {
					"id": "description_class_name",
					"label": "Classes",
					"description": "Classes added to each list item description element.",
					"notes": ""
				},
				
				"descriptionValue": {
					"id": "description_value",
					"label": "Description",
					"description": "Value rendered in each list item description element.",
					"notes": "",
					"defaultValue": "%%description%%"
				}
			}
		},

		"contentElement": {
			"id": "content_element",
			"label": "Content Element",
			"description": "Attributes and classes applied to the content element.",
			"options": {
				"contentAttr": {
					"id": "content_attr",
					"label": "Attributes",
					"description": "Attributes added to each list item content element.",
					"notes": ""
				},
				
				"contentClassName": {
					"id": "content_class_name",
					"label": "Classes",
					"description": "Classes added to each list item content element.",
					"notes": ""
				},
				
				"contentValue": {
					"id": "content_value",
					"label": "Description",
					"description": "Value rendered in each list item content element.",
					"notes": ""
				},

				"contentWidget": {
					"id": "content_widget",
					"label": "Content Widget",
					"description": "Widget rendered inside each list item content element.",
					"notes": "Overrides <code>content_value</code> option."
				}
			}
		},

		"tabsElement": {
			"id": "tabs_element",
			"label": "Tabs Element",
			"description": "Attributes and classes applied to the tabs container element.",
			"options": {
				"tabsAttr": {
					"id": "tabs_attr",
					"label": "Attributes",
					"description": "Attributes added to the tabs container element.",
					"notes": ""
				},
				
				"tabsClassName": {
					"id": "tabs_class_name",
					"label": "Classes",
					"description": "Classes added to the tabs container element.",
					"notes": ""
				}
			}
		}
	}
}
