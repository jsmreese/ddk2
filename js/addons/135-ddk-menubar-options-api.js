PS.extend("optionsAPI");

PS.optionsAPI.menubar = {
	"id": "menubar_favorite",
	"label": "Menubar Favorite",
	"description": "Menubar API for Metrics Catalog Favorite records",
	"options": {
		"name": {
			"id": "fav_name",
			"label": "Menu Item Name",
			"description": "Unique database identifier for this menubar item favorite record."
		},
		"label": {
			"id": "fav_label",
			"label": "Menu Item Label",
			"description": "Will appear as the menu item label, unless `showLabel` is `false`.\nIf label value is a single `-` (dash) character, a separator will be rendered. Separator will be a single horizontal line for dropdowns, and will be a `>` icon for the top-level menu bar.\nCan be overridden using fav_value_label."
		},
		"url": {
			"id": "fav_url",
			"label": "Menu Item URL",
			"description": "URL for menubar href.\nWill be automatically generated from startingWidget value.\nWill be automatically cleared when menubar item is active."
		}
	},
	"value": {
		"id": "fav_value",
		"label": "Value",
		"description": "sci_fav_value field options",
		"options": {
			"attr": {
				"id": "fav_attr",
				"label": "Menu Item Attributes",
				"description": "HTML attribute string added to menubar li element."
			},
			"className": {
				"id": "fav_class_name",
				"label": "Menu Item Class",
				"description": "Class name string added to menubar li element."
			},
			"label": {
				"id": "fav_label_alt",
				"label": "Menu Item Label Override",
				"description": "Override for fav_label, when the actual sci_fav_label value is not suitable for display. Will appear as the menu item label, unless `showLabel` is `false`.\nIf label value is a single `-` (dash) character, a separator will be rendered. Separator will be a single horizontal line for dropdowns, and will be a `>` icon for the top-level menu bar."
			},
			"icon": {
				"id": "fav_icon",
				"label": "Icon",
				"description": "Will appear to the left of the label. If the value looks like an html character escape code, it will be automatically wrapped in a span.ddk-icon element. Otherwise, icon value will be rendered unmodified."
			},
			"iconRight": {
				"id": "fav_icon_right",
				"label": "Icon (Right)",
				"description": "Will apper to the right of the label. If the value looks like an html character escape code, it will be automatically wrapped in a span.ddk-icon element. Otherwise, iconRight value will be rendered unmodified."
			},
			"fcat": {
				"id": "fav_fcat",
				"label": "Favorite Category",
				"description": "Menu item favorites with an fcat attribute are a group placeholder reference to another favorite category tree. That group tree will be rendered and substituted for this placeholder item. The default widget used to render favorite groups is `DDK2_Menubar_Favorites`, and that may be changed via the `widget` attribute."
			},
			"widget": {
				"id": "fav_widget",
				"label": "Widget",
				"description": "Menu item favorites with a widget attribute are a group placeholder reference. That group will be generated using the named widget and substituted for this placeholder item.",
				"default": "DDK2_Menubar_Favorites"
			},
			"position": {
				"id": "fav_position",
				"label": "Position",
				"description": "When a menubar item on the top bar has position set to `right`, that item and all following items will appear on the right side of the top bar."
			},
			"startingWidget": {
				"id": "fav_starting_widget",
				"label": "Starting Widget",
				"description": "Starting widget name for which this menubar item should appear active. Will auto-generate a menubar item url link referencing this starting widget."
			},
			"showLabel": {
				"id": "fav_show_label",
				"label": "Show Label",
				"description": "When set to `false`, the menubar item will not be rendered.",
				"default": true
			},
			"subgroupWidget": {
				"id": "fav_subgroup_widget",
				"label": "Subgroup Widget",
				"description": "Widget to use for rendering active menubar item subgroup. Will function as the default widget for any nested active menubar item.",
				"default": "DDK2_Menubar_Favorites"
			},
			"subgroupFcat": {
				"id": "fav_subgroup_fcat",
				"label": "Subgroup Favorite Category",
				"description": "Favorite category to use for active menubar item subgroup. Will function as the default subgroup for any nested active menubar item. Default value is automatically generated from the current menubar item name: `&lt;name&gt;_SUB`"
			},
			"anchorAttr": {
				"id": "fav_anchor_attr",
				"label": "Anchor Attributes",
				"description": "Attributes to be rendered on the anchor element."			
			},
			"anchorClassName": {
				"id": "fav_anchor_class_name",
				"label": "Anchor Classes",
				"description": "Classes to be rendered on the anchor element."			
			},
			"anchorNew": {
				"id": "fav_anchor_new",
				"label": "Open New Window/Tab",
				"description": "If true, Anchor element will be created with a target=\"_blank\" attribute to force link opening in a new tab or window.",
				"default": false		
			}
		}
	}
};
