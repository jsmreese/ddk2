DDK.initStylesheets = function () {	var $window, $document;	var range, sizes, groups, sheets, viewportHeight, ruleHeights, groupHeights, addRules, insertRule, currentSize, getActiveSizes;	var menuChange, initSection, menuToContainer, menuToSection;	sizes = "small medium large xlarge xxlarge".split(" ");	groups = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");		// setup responsive block stylesheets	DDK.styleSheets = sheets = {};		_.each(sizes, function (size) {		sheets[size] = $.createStylesheet(Foundation.media_queries[size]);	});		// setup screen size detection	DDK.screenSize = function () {		return _.findLast(sizes, function (size) {			return matchMedia(Foundation.media_queries[size]).matches;		});	};		//currentSize = DDK.screenSize();	$window = $(window);		$document = $(document);		range = _.range(1, 13);		viewportHeight = function () {		var $clear = $(".page-title").add(".block-clear");				return $window.height()			- 45 // top bar			- 5 // match .block margin-left -- todo: make this detect the margin size!			- $clear.totalHeight(); // .page-title and .block-clear element heights	};		ruleHeights = function () {		var vh = viewportHeight() - ($window.width() > 1024 ? 5 : 0);				return _.map(range, function (value) {			return Math.round(vh * value / 12 - 10); // the (- 10) accounts for block margin-top -- todo: make this detect the margin size!		});	};		getActiveSizes = function () {		return sizes.slice(0, _.indexOf(sizes, currentSize) + 1);	};		insertRule = function (sheet, rule) {		sheet.insertRule(rule, sheet.cssRules.length);	};		groupHeights = function () {		var cache, activeSizes, $blocks;				cache = {};				activeSizes = getActiveSizes();		$blocks = $(".block");				_.each(activeSizes, function (size) {			cache[size] = {};		});		// cache size-group selections for all active sizes		_.each(groups, function (group) {			_.each(activeSizes, function (size) {				var selector, $elems;								// select the current size-group, e.g. medium-height-c				selector = "." + size + "-height-" + group;								$elems = $blocks.filter(selector);								if ($elems.length) {					// cache selection					cache[size][group] = $elems;				}			});		});				// create size-groups for current size		_.each(groups, function (group) {			var largerSizes, smallerSizes, $group, $smaller, sizeIndex, groupHeight;						sizeIndex = _.indexOf(activeSizes, currentSize);			largerSizes = activeSizes.slice(sizeIndex + 1);			smallerSizes = activeSizes.slice(0, sizeIndex);						// get current size-group from cache			$group = $().add(cache[currentSize][group]);			// filter $group elements for *larger* size overrides from all active sizes			// search element class list for classes that start with <largerSize>-height-			// can't do a jQuery :not([class*='...']) attribute filter here			// because large-* would also match xlarge-* and xxlarge-*			if ($group.length) {				_.each(largerSizes, function (largerSize) {					$group = $group.filter(function (index, elem) {						// return those that do not have a larger class override						return !_.find(elem.classList, function (className) {							return _.string.startsWith(className, largerSize + "-height-");						});					});				});			}						// add all smaller size-groups			$smaller = $();			_.each(smallerSizes, function (smallerSize) {				$smaller = $smaller.add(cache[smallerSize][group]);			});						// filter $smaller elements for size overrides from all active sizes			// find the size of the matched group then filter for any larger size overrides			// can't do a jQuery :not([class*='...']) attribute filter here			// because large-* would also match xlarge-* and xxlarge-*			if ($smaller.length) {				$smaller = $smaller.filter(function (index, elem) {					var classList, matchSize, overrideSizes;					classList = elem.classList;					matchSize = _.find(classList, function (className) {						return _.string.endsWith(className, "-height-" + group);					}).split("-")[0];					overrideSizes = activeSizes.slice(_.indexOf(sizes, matchSize) + 1);										// return elements that *don't* have a larger class overriding the matched group					return !_.find(classList, function (className) {						return _.any(overrideSizes, function (overrideSize) {							return _.string.startsWith(className, overrideSize + "-height-");						});					});				});			}						$group = $group.add($smaller);			if ($group.length) {				// find max element height in group				// use outerHeight to include padding and border because of box-sizing: border-box;				// add one px to account for zoomed factional pixels				groupHeight = 1 + Math.max.apply(null, $group.map(function (index, elem) { return $(elem).outerHeight(); }));								// write CSS rules for active sizes and groups				_.each(activeSizes, function (size) {					insertRule(sheets[size], ".block." + size + "-height-" + group + " { height: " + groupHeight + "px; }");				});			}		});	};		addRules = function () {		var largeSheet, heights, activeSizes, $blocks;		activeSizes = getActiveSizes();		$blocks = $(".block");				// add rule for large+ screens when screenSize is actually that big		if (activeSizes.length > 2) {			// full row width rule (large screens and above only)			// match .block margin-left + margin-right -- todo: make this detect the margin size!			// use window.innerWidth instead of $window.width() to ignore scrollbars at the document body level			insertRule(sheets.large, ".row.full { max-width: " + (window.innerWidth - 10) + "px; }");		}		heights = ruleHeights();				// allows 5px extra margin at the bottom for a cleaner look on large screens		// block height rules		_.each(activeSizes, function (size) {			var sheet;						sheet = sheets[size];			_.each(heights, function (value, index) {				var $group;								$group = $blocks.filter("." + size + "-height-" + (index + 1));								if ($group.length) {					insertRule(sheet, ".block." + size + "-height-" + (index + 1) + " { height: " + value + "px; }");					insertRule(sheet, ".block." + size + "-height-" + (index + 1) + " > .block-header + .block-content { position: absolute; left: 0; right: 0; bottom: 0; top: 36px; overflow: auto; }");				}			});						insertRule(sheet, ".block." + size + "-height-auto { height: auto; }");			insertRule(sheet, ".block." + size + "-height-auto > .block-header + .block-content { position: initial; left: initial; right: initial; bottom: initial; top: initial; overflow: initial; }");		});			// must do group heights at the end		// otherwise large+ screensize rule and proportional-height rules can cause scrollbars		// on group-height block contents		groupHeights();	};		deleteRules = function () {		_.each(sizes, function (size) {			var sheet = sheets[size];						while (sheet.cssRules.length) {				sheet.deleteRule(0);			}		});	};	// initialize content sidebar section	initSection = function (index, elem) {		var $elem, $section, $sectionContent, $content, data, sectionId, smallOnly, sectionHeader, $sections, $contents, inserted;				$elem = $(elem);		data = $elem.data();		sectionId = data.menu;		smallOnly = data.menuSmallOnly;		sectionOrder = data.menuOrder || 50;		contentOrder = data.menuContentOrder || 50;		sectionHeader = data.menuHeader || "";				// check for a cached section reference, or look in the DOM		$section = data.$menuSection || $('[data-menu-id="' + sectionId + '"]');		$content = data.$menuContent;				if (!$section.length) {			inserted = false;						// create section			$section = $('<div class="section section-menu-auto hide-for-' + (smallOnly ? "medium" : "large") + '-up" data-menu-id="' + sectionId + '" data-menu-order="' + sectionOrder + '"><div class="section-header open">' + sectionHeader + '</div><div class="section-content"></div></div>');						// append section in sorted order			$sections = $(".left-off-canvas-menu .section");			$sections.each(function (index, elem) {				var $elem, elemOrder;								$elem = $(elem);				elemOrder = $elem.data("menuOrder");								if (elemOrder > sectionOrder) {					$elem.before($section);					inserted = true;					return false;				}			});						// append at the end if not already inserted			if (!inserted) {				$sections.last().after($section);			}		}				// cache section reference		if (!data.$menuSection) {			$elem.data("$menuSection", $section);		}				if (!$content) {			inserted = false;						// create content			$content = $('<div data-menu-content-order="' + contentOrder + '"></div>');						// cache content and container reference			$elem.data("$menuContent", $content);			$content.data("$menuParent", $elem);						$sectionContent = $section.find(".section-content");						// append content in sorted order			$contents = $sectionContent.children();						if ($contents.length) {				$contents.each(function (index, elem) {					var $elem, elemOrder;										$elem = $(elem);					elemOrder = $elem.data("menuContentOrder");										if (elemOrder > contentOrder) {						$elem.before($content);						inserted = true;						return false;					}				});								// append at the end if not already inserted				if (!inserted) {					$contents.last().after($content);				}			} else {				$sectionContent.append($content);			}		}	};	// move content back to its original container element	menuToContainer = function (index, elem) {		var $elem, $content;				$elem = $(elem);		$content = $elem.data("$menuContent");		if ($content) {			$content.children().appendTo($elem);		}	};		// move content from its original container element to its sidebar section	menuToSection = function (index, elem) {		var $elem, $content;				$elem = $(elem);		$content = $elem.data("$menuContent");				if ($content) {			$elem.children().appendTo($content);		}	};		menuChange = function (size) {		var $menuItems, $smallMenuItems;				$menuItems = $("[data-menu]");				if (size.indexOf("large") > -1) {			// move any data-menu section content back to its original container			$menuItems.each(menuToContainer);			return;		}				if (size === "small") {			// initialize any data-menu and data-menu-small-only sections			$menuItems.each(initSection);						// move any data-menu and data-menu-small-only content to the sections			$menuItems.each(menuToSection);			return;		}				// size is medium		$smallMenuItems = $menuItems.filter("[data-menu-small-only]");		$menuItems = $menuItems.not($smallMenuItems);				// initialize any data-menu sections (but not data-menu-small-only sections)		$menuItems.each(initSection);				// move any data-menu content to the sections		$menuItems.each(menuToSection);				// move any data-menu-small-only section content back to its original container		$smallMenuItems.each(menuToContainer);	};		// initialize rules	//addRules();		// window resize handler	$window.on("resize", _.debounce(function () {		var oldSize, newSize;				oldSize = currentSize;		newSize = DDK.screenSize();				// save new screen size		currentSize = newSize;		// screen size change events		if (oldSize !== newSize) {			$document.trigger("screenchange", [newSize]);			$document.trigger(newSize + ".screenchange");		}				// update stylesheet rules		deleteRules();		addRules();	}, 250));		// screenchange logging	$document.on("screenchange", function (e, size) {		DDK.log("DDK Screenchange Event:", size);		// update menu content		menuChange(size);			});};		