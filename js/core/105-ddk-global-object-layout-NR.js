DDK.layout = {
	options: {
		paneClass: "pane",
		resizerClass: "resizer",
		togglerClass: "toggler",
		north__closable: false,
		north__resizable: false,
		north__spacing_open: 0,
		center__onsizecontent_start: function () { shrinkLayoutContent(0); },
		west__onsizecontent_start: function () { shrinkLayoutContent(1); },
		east__onsizecontent_start: function () { shrinkLayoutContent(2); },
		south__onsizecontent_start: function () { shrinkLayoutContent(3); },
		center__onresize_end: function () { fnResizeLayoutContent(0); },
		west__onresize_end: function () { fnResizeLayoutContent(1); },
		east__onresize_end: function () { fnResizeLayoutContent(2); },
		south__onresize_end: function () { fnResizeLayoutContent(3); }
	},
	options2: {
		paneClass: "outerpane",
		//resizerClass: "resizer",
		//togglerClass: "toggler",
		north__closable: false,
		north__resizable: false,
		north__spacing_open: 0,
		center__paneSelector: ".ui-layout-outer-center",
		center__children: {
			paneClass: "pane",
			resizerClass: "resizer",
			togglerClass: "toggler"
		}
	},
	center: {},
	west: {},
	east: {},
	south: {}
};

DDK.spoofMediaQuery = function ($elem) {
	var width = $elem.width(),
		sizes = DDK.spoofMediaQuery.sizes,
		ranges = DDK.spoofMediaQuery.ranges,
		classList = _.map(sizes, function (size) {
			return "ddk-mq-" + size;
		});

	$elem.removeClass(classList.join(" "));
		
	_.each(sizes, function (size, index) {
		if (width > ranges[size].min && width <= ranges[size].max) {
			$elem.addClass(classList[index]);
		}
	});
	
	// resize controls in the pane that are contained in grid row elements
	$elem.find(".row").findControls().resizeControls();
};

DDK.spoofMediaQuery.sizes = "small medium large".split(" ");
DDK.spoofMediaQuery.ranges = {
	small: {
		min: 0,
		max: 480
	},
	medium: {
		min: 480,
		max: 1024
	},
	large: {
		min: 1024,
		max: Infinity
	}
};