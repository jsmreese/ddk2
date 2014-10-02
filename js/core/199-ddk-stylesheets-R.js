DDK.initStylesheets = function () {	var $window, $document, range, sizes, groups, sheets, viewportHeight, ruleHeights, groupHeights, addRules, currentSize;	sizes = "small medium large xlarge xxlarge".split(" ");	groups = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");		// setup responsive block stylesheets	DDK.styleSheets = sheets = {};		_.each(sizes, function (size) {		sheets[size] = $.createStylesheet(Foundation.media_queries[size]);	});		// setup screen size detection	DDK.screenSize = function () {		return _.findLast(sizes, function (size) {			return matchMedia(Foundation.media_queries[size]).matches;		});	};		currentSize = DDK.screenSize();	$window = $(window);		$document = $(document);		range = _.range(1, 13);		viewportHeight = function () {		var $clear = $(".page-title").add(".block-clear");				return $window.height()			- 45 // top bar			- 5 // match .block margin-left -- todo: make this detect the margin size!			- $clear.totalHeight(); // .page-title and .block-clear element heights	};		ruleHeights = function () {		var vh = viewportHeight() - ($window.width() > 1024 ? 5 : 0);				return _.map(range, function (value) {			return Math.round(vh * value / 12 - 10); // the (- 10) accounts for block margin-top -- todo: make this detect the margin size!		});	};		groupHeights = function () {		var cache, activeSizes;				cache = {};				activeSizes = sizes.slice(0, _.indexOf(sizes, currentSize) + 1);				_.each(activeSizes, function (size) {			cache[size] = {};		});		// cache size-group selections for all active sizes		_.each(groups, function (group) {			_.each(activeSizes, function (size) {				var selector, $elems;								// select the current size-group, e.g. medium-height-c				selector = "." + size + "-height-" + group;								$elems = $(selector);								if ($elems.length) {					// cache selection					cache[size][group] = $elems;				}			});		});				// create size-groups for current size		_.each(groups, function (group) {			var largerSizes, smallerSizes, $group, $smaller, sizeIndex, groupHeight;						sizeIndex = _.indexOf(activeSizes, currentSize);			largerSizes = sizes.slice(sizeIndex + 1);			smallerSizes = sizes.slice(0, sizeIndex);						// get current size-group from cache			$group = $().add(cache[currentSize][group]);			// filter $group elements for *larger* size overrides			// search element class list for classes that start			// with <largerSize>-height-			// can't do a jQuery :not([class*='...']) attribute filter here			// because large-* would also match xlarge-* and xxlarge-*			if ($group.length) {				_.each(largerSizes, function (largerSize) {					$group = $group.filter(function (index, elem) {						// return those that do not have a larger class override						return !_.find(elem.classList, function (className) {							return _.string.startsWith(className, largerSize + "-height-");						});					});				});			}						// add all smaller size-groups			$smaller = $();			_.each(smallerSizes, function (smallerSize) {				$smaller = $smaller.add(cache[smallerSize][group]);			});						// filter $smaller elements for size overrides			// find the size of the matching group			// then filter for any larger size overrides			// can't do a jQuery :not([class*='...']) attribute filter here			// because large-* would also match xlarge-* and xxlarge-*			if ($smaller.length) {				$smaller = $smaller.filter(function (index, elem) {					var classList, matchSize, overrideSizes;					classList = elem.classList;					matchSize = _.find(classList, function (className) {						return _.string.endsWith(className, "-height-" + group);					}).split("-")[0];					overrideSizes = sizes.slice(_.indexOf(sizes, matchSize) + 1);										// return elements that *don't* have a larger class override for the current group					return !_.find(classList, function (className) {						return _.any(overrideSizes, function (overrideSize) {							return _.string.startsWith(className, overrideSize + "-height-");						});					});				});			}						$group = $group.add($smaller);			if ($group.length) {				// find max element height in group				// use outerHeight to include padding and border because of box-sizing: border-box;				// add one px to account for zoomed factional pixels				groupHeight = 1 + Math.max.apply(null, $group.map(function (index, elem) { return $(elem).outerHeight(); }));								console.log("Writing rules", group, groupHeight);								// write CSS rules for active sizes and groups				_.each(activeSizes, function (size) {					var sheet = sheets[size];					sheet.insertRule(".block." + size + "-height-" + group + " { height: " + groupHeight + "px; }", sheet.cssRules.length);				});			}		});	};		addRules = function () {		var largeSheet, heights;				heights = ruleHeights();				// allows 5px extra margin at the bottom for a cleaner look on large screens		// block height rules		_.each(sizes, function (size) {			var sheet = sheets[size];			_.each(heights, function (value, index) {				sheet.insertRule(".block." + size + "-height-" + (index + 1) + " { height: " + value + "px; }", sheet.cssRules.length);			});		});				groupHeights();				// full row width rule (large screens and above only)		largeSheet = sheets.large;				// match .block margin-left + margin-right -- todo: make this detect the margin size!		largeSheet.insertRule(".row.full { max-width: " + ($window.width() - 10) + "px; }", largeSheet.cssRules.length);	};		deleteRules = function () {		_.each(sizes, function (size) {			var sheet = sheets[size];						while (sheet.cssRules.length) {				sheet.deleteRule(0);			}		});	};		// initialize rules	addRules();		// window resize handler	$window.on("resize", _.debounce(function () {		var oldSize, newSize;				oldSize = currentSize;		newSize = DDK.screenSize();				// save new screen size		currentSize = newSize;		// update stylesheet rules		deleteRules();		addRules();				// possibly refresh rules to account for screen scrollbar...		//_.defer();						// exit if there is no change		if (oldSize === newSize) {			return;		}				// screen size change event		$document.trigger("screenchange", [newSize]);		// size-based screen size change event		$document.trigger(newSize + ".screenchange");				if (_.indexOf(sizes, newSize) >= 2 && _.indexOf(sizes, oldSize) <= 1) {			// top menu enabled event			$document.trigger("menuchange", ["top"]);			$document.trigger("top.menuchange");		} else if (_.indexOf(sizes, newSize) <= 1 && _.indexOf(sizes, oldSize) >= 2) {			// side menu enabled event			$document.trigger("menuchange", ["side"]);			$document.trigger("side.menuchange");		}	}, 250));		// screenchange logging	$document.on("screenchange", function (e, size) {		DDK.info("DDK Screenchange Event:", size);	});		// menuchange logging	// and data-menu-side / data-menu-top updates	$document.on("menuchange", function (e, type) {		var $elems, oldType;				DDK.info("DDK Menuchange Event:", type);				oldType = (type === "top" ? "side" : "top");				// find all data-menu-<type> elements		$elems = {};		$elems.side = $document.find("[data-menu-side]");		$elems.top = $document.find("[data-menu-top]");				if ($elems.side && $elems.top) {			// for each oldType elem, find a newType elem that matches			// and transfer the HTML content			$elems[oldType].each(function (index, oldElem) {				var $oldElem, $oldChildren, $newElem, key;				$oldElem = $(oldElem);				$oldChildren = $oldElem.children();								if ($oldChildren.length) {					key = $oldElem.data("menu" + _.string.titleize(oldType));										$newElem = $elems[type].filter(function (index, newElem) {						return $(newElem).data("menu" + _.string.titleize(type)) === key;					});										if ($newElem.length) {						$newElem.empty().append($oldChildren);					}				}			});		}	});		// trigger initial menuchange and screenchange events	$document.trigger("screenchange", [currentSize]);	$document.trigger(currentSize + ".screenchange");		if (_.indexOf(sizes, currentSize) >= 2) {		$document.trigger("menuchange", ["top"]);		$document.trigger("top.menuchange");	}		if (_.indexOf(sizes, currentSize) <= 1) {		$document.trigger("menuchange", ["side"]);		$document.trigger("side.menuchange");	}};		