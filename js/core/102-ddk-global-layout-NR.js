	// PSC_Layout_JS

	var PSC_Layout_Object;
	var bSaveLayoutState = true;

	var aoTabs = [-1, -1, -1, -1];
	var aoAccordion = [-1, -1, -1, -1];

	/* body layout panes var aoTabsndexes: 0 = center, 1 = west, 2 = east, 3 = south */
	var asPane = ['center', 'west', 'east', 'south'];
	var asSection = ['middle', 'top', 'bottom'];

	function fnUpdateQueryString(sQueryString, sKeywordName, sKeywordValue) {
		/* If sQueryString starts with keyword name, or if &sKeywordName appears in sQueryString, update the value */
		if (sQueryString.indexOf(sKeywordName) >= 0) {
			sQueryString = fnUpdateQueryStringValue(sQueryString, sKeywordName, sKeywordValue);
		} else {
			sQueryString += '&' + sKeywordName + '=' + sKeywordValue;
		}
		return sQueryString ;
	}

	function fnUpdateQueryStringValue(sQueryString, sKeywordName, sKeywordValue) {
		var sUpdatedQueryString;
		var asQueryStringKeywords = sQueryString.split('&'),
			i;
		for (i = 0; i < asQueryStringKeywords.length; i += 1) {
			if (asQueryStringKeywords[i].split('=')[0] == sKeywordName) {
				asQueryStringKeywords[i] = sKeywordName + '=' + sKeywordValue;
			}
		}
		for (i = 0; i < asQueryStringKeywords.length; i += 1) {
			if (i == 0) {
				sUpdatedQueryString = asQueryStringKeywords[i];
			} else {
				sUpdatedQueryString += '&' + asQueryStringKeywords[i];
			}
		}
		return sUpdatedQueryString;
	}

	var PSC_Layout_Center_Accordion_Object;
	var PSC_Layout_West_Accordion_Object;
	var PSC_Layout_East_Accordion_Object;
	var PSC_Layout_South_Accordion_Object;

	var PSC_Layout_Center_Tabs_Object;
	var PSC_Layout_West_Tabs_Object;
	var PSC_Layout_East_Tabs_Object;
	var PSC_Layout_South_Tabs_Object;

	/* Placeholder function for custom resize to be overridden by developer */
	function PSC_Layout_Center_CustomResize() {}
	function PSC_Layout_West_CustomResize() {}
	function PSC_Layout_East_CustomResize() {}
	function PSC_Layout_South_CustomResize() {}

	function PSC_Layout_Pane_CustomResize(iPane) {
		switch (iPane) {
			case 0:
				PSC_Layout_Center_CustomResize();
				typeof DDK.layout.center.customResize === "function" && DDK.layout.center.customResize.call();
			break;
			case 1:
				PSC_Layout_West_CustomResize();
				typeof DDK.layout.west.customResize === "function" && DDK.layout.west.customResize.call();
			break;
			case 2:
				PSC_Layout_East_CustomResize();
				typeof DDK.layout.east.customResize === "function" && DDK.layout.east.customResize.call();
			break;
			case 3:
				PSC_Layout_South_CustomResize();
				typeof DDK.layout.south.customResize === "function" && DDK.layout.south.customResize.call();
			break;
		}
	}

	function PSC_Layout_Pane_CustomResize_DDK2(iPane, section) {
		switch (iPane) {
			case 0:
				PSC_Layout_Center_CustomResize();
				typeof DDK.layout.center.customResize === "function" && DDK.layout.center.customResize.call();
				if (DDK.layout.center[section])
					typeof DDK.layout.center[section].customResize === "function" && DDK.layout.center[section].customResize.call();
			break;
			case 1:
				PSC_Layout_West_CustomResize();
				typeof DDK.layout.west.customResize === "function" && DDK.layout.west.customResize.call();
				if (DDK.layout.west[section])
					typeof DDK.layout.west[section].customResize === "function" && DDK.layout.west[section].customResize.call();
			break;
			case 2:
				PSC_Layout_East_CustomResize();
				typeof DDK.layout.east.customResize === "function" && DDK.layout.east.customResize.call();
				if (DDK.layout.east[section])
					typeof DDK.layout.east[section].customResize === "function" && DDK.layout.east[section].customResize.call();
			break;
			case 3:
				PSC_Layout_South_CustomResize();
				typeof DDK.layout.south.customResize === "function" && DDK.layout.south.customResize.call();
				if (DDK.layout.south[section])
					typeof DDK.layout.south[section].customResize === "function" && DDK.layout.south[section].customResize.call();
			break;
		}
	}

	function fnSaveLayoutState() {
		bSaveLayoutState = true;

		var iLayoutWidth = $('#layout_container').width();

		var iLayoutWestSize = PSC_Layout_Object.state.west.size;
		var bLayoutWestIsClosed = PSC_Layout_Object.state.west.isClosed;
		var iLayoutWestPercent = (iLayoutWestSize * 100 / iLayoutWidth).toFixed();

		var iLayoutEastSize = PSC_Layout_Object.state.east.size;
		var bLayoutEastIsClosed = PSC_Layout_Object.state.east.isClosed;
		var iLayoutEastPercent = (iLayoutEastSize * 100 / iLayoutWidth).toFixed();

		var iLayoutSouthSize = PSC_Layout_Object.state.south.size;
		var iLayoutSouthMaxSize = PSC_Layout_Object.state.south.maxSize;
		var bLayoutSouthIsClosed = PSC_Layout_Object.state.south.isClosed;
		var iLayoutSouthPercent = (iLayoutSouthSize * 100 / iLayoutSouthMaxSize).toFixed();

		iLayoutWestSize && daaURLUpdate('s_lpw', iLayoutWestSize + ',' + iLayoutWestPercent + ',' + bLayoutWestIsClosed);
		iLayoutEastSize && daaURLUpdate('s_lpe', iLayoutEastSize + ',' + iLayoutEastPercent + ',' + bLayoutEastIsClosed);
		iLayoutSouthSize && daaURLUpdate('s_lps', iLayoutSouthSize + ',' + iLayoutSouthPercent + ',' + bLayoutSouthIsClosed);

	}

	//PSDDK-175: toggle top/bottom panes
	function fnSaveLayoutState_DDK2() {
		bSaveLayoutState = true;

		var iLayoutWidth = $('#layout_container').width();

		//modify use of state for nested layout
		var outerCenter = PSC_Layout_Object.center.children.layout1;
		var iLayoutWestSize, bLayoutWestIsClosed, iLayoutWestPercent;
		var iLayoutEastSize, bLayoutEastIsClosed, iLayoutEastPercent;
		var iLayoutSouthSize, bLayoutSouthIsClosed, iLayoutSouthPercent, iLayoutSouthMaxSize;
		var iLayoutNorthSize, bLayoutNorthIsClosed, iLayoutNorthPercent;

		if (outerCenter.west !== false) {
			iLayoutWestSize = outerCenter.state.west.size;
			bLayoutWestIsClosed = outerCenter.state.west.isClosed;
			iLayoutWestPercent = (iLayoutWestSize * 100 / iLayoutWidth).toFixed();
			daaURLUpdate('s_lpw', iLayoutWestSize + ',' + iLayoutWestPercent + ',' + bLayoutWestIsClosed);
			if (outerCenter.west.children.layout1.north !== false) {
				var wTop = outerCenter.west.children.layout1.state.north;
				var wTopPercent = (wTop.size * 100 / wTop.maxSize).toFixed();
				daaURLUpdate('s_lpwt', wTop.size + ',' + wTopPercent + ',' + wTop.isClosed);
			}
			if (outerCenter.west.children.layout1.south !== false) {
				var wBottom = outerCenter.west.children.layout1.state.south;
				var wBottomPercent = (wBottom.size * 100 / wBottom.maxSize).toFixed();
				daaURLUpdate('s_lpwb', wBottom.size + ',' + wBottomPercent + ',' + wBottom.isClosed);
			}
		}

		if (outerCenter.east !== false) {
			iLayoutEastSize = outerCenter.state.east.size;
			bLayoutEastIsClosed = outerCenter.state.east.isClosed;
			iLayoutEastPercent = (iLayoutEastSize * 100 / iLayoutWidth).toFixed();
			daaURLUpdate('s_lpe', iLayoutEastSize + ',' + iLayoutEastPercent + ',' + bLayoutEastIsClosed);
			if (outerCenter.east.children.layout1.north !== false) {
				var eTop = outerCenter.east.children.layout1.state.north;
				var eTopPercent = (eTop.size * 100 / eTop.maxSize).toFixed();
				daaURLUpdate('s_lpet', eTop.size + ',' + eTopPercent + ',' + eTop.isClosed);
			}
			if (outerCenter.east.children.layout1.south !== false) {
				var eBottom = outerCenter.east.children.layout1.state.south;
				var eBottomPercent = (eBottom.size * 100 / eBottom.maxSize).toFixed();
				daaURLUpdate('s_lpeb', eBottom.size + ',' + eBottomPercent + ',' + eBottom.isClosed);
			}
		}

		if (outerCenter.south !== false) {
			iLayoutSouthSize = outerCenter.state.south.size;
			iLayoutSouthMaxSize = outerCenter.state.south.maxSize;
			bLayoutSouthIsClosed = outerCenter.state.south.isClosed;
			iLayoutSouthPercent = (iLayoutSouthSize * 100 / iLayoutSouthMaxSize).toFixed();
			daaURLUpdate('s_lps', iLayoutSouthSize + ',' + iLayoutSouthPercent + ',' + bLayoutSouthIsClosed);
			if (outerCenter.east.children.layout1.north !== false) {
				var sTop = outerCenter.east.children.layout1.state.north;
				var sTopPercent = (sTop.size * 100 / sTop.maxSize).toFixed();
				daaURLUpdate('s_lpst', sTop.size + ',' + sTopPercent + ',' + sTop.isClosed);
			}
			if (outerCenter.east.children.layout1.south !== false) {
				var sBottom = outerCenter.east.children.layout1.state.south;
				var sBottomPercent = (sBottom.size * 100 / sBottom.maxSize).toFixed();
				daaURLUpdate('s_lpsb', sBottom.size + ',' + sBottomPercent + ',' + sBottom.isClosed);
			}
		}

		if (outerCenter.north !== false) {
			iLayoutNorthSize = outerCenter.state.north.size;
			bLayoutNorthIsClosed = outerCenter.state.north.isClosed;
			//iLayoutNorthPercent = (iLayoutNorthSize * 100 / iLayoutWidth).toFixed();
			daaURLUpdate('s_lpn', iLayoutNorthSize + ',' + iLayoutNorthPercent + ',' + bLayoutNorthIsClosed);
		}
	}

	function fnResizeLayoutContent(iPane) {
		// add media-query spoof classes to all panes
		DDK.spoofMediaQuery($("#layout_" + asPane[iPane]));

		if (aoAccordion[iPane] !== -1) {
			aoAccordion[iPane].accordion('refresh');
			resizeContent(iPane, false, "accordion");
			setTimeout(function() {
				resizeContent(iPane, true, "accordion");
				PSC_Layout_Pane_CustomResize(iPane);
			}, 100);
		} else if (aoTabs[iPane] !== -1) {
			aoTabs[iPane].tabs('refresh');
			resizeContent(iPane, false, "tabs");
			setTimeout(function() {
				resizeContent(iPane, true, "tabs");
				PSC_Layout_Pane_CustomResize(iPane);
			}, 100);
		} else {
			resizeContent(iPane, false);
			setTimeout(function() {
				resizeContent(iPane, true);
				PSC_Layout_Pane_CustomResize(iPane);
			}, 100);
		}

		if (bSaveLayoutState) {
			bSaveLayoutState = false;
			setTimeout(fnSaveLayoutState,1000);
		}
	}

	//PSDDK-175: toggle top/bottom panes
	function fnResizeLayoutContent_DDK2(iPane, iSection) {
		var p = asPane[iPane],
			sec = iSection? (typeof iSection === "string"? iSection : asSection[iSection]) : "middle"
		;
		
		// add media-query spoof classes to all panes
		DDK.spoofMediaQuery($("#layout_" + sec + "_" + p));

		if (DDK.accordion[p] !== undefined && DDK.accordion[p][sec] !== undefined) {
			DDK.accordion[p][sec].accordion('refresh');
			resizeContent(iPane, false, "accordion", sec);
			setTimeout(function() {
				resizeContent(iPane, true, "accordion", sec);
				PSC_Layout_Pane_CustomResize_DDK2(iPane, sec);
			}, 100);

		} else if (DDK.tabs[p] !== undefined && DDK.tabs[p][sec] !== undefined) {
			DDK.tabs[p][sec].tabs('refresh');
			resizeContent(iPane, false, "tabs", sec);
			setTimeout(function() {
				resizeContent(iPane, true, "tabs", sec);
				PSC_Layout_Pane_CustomResize_DDK2(iPane, sec);
			}, 100);
		} else {
			resizeContent(iPane, false, "", sec);
			setTimeout(function() {
				resizeContent(iPane, true, "", sec);
				PSC_Layout_Pane_CustomResize_DDK2(iPane, sec);
			}, 100);
		}

		if (bSaveLayoutState) {
			bSaveLayoutState = false;
			setTimeout(fnSaveLayoutState_DDK2,1000);
		}
	}

	function shrinkLayoutContent(iPane) {
		var selector,
			$pane,
			$content;

		if (aoAccordion[iPane] !== -1) {
			selector = "#layout_" + asPane[iPane] + "_accordion > .ui-accordion-content-active";
		} else if (aoTabs[iPane] !== -1) {
			selector = "#layout_content_" + asPane[iPane] + " > .ui-tabs-panel:visible";
		} else {
			selector = "#layout_content_" + asPane[iPane];
		}

		$pane = $(selector);
		$content = $pane.children("div.ps-content-row:visible, div.ps-content-block:visible").not(".ps-content-fixed");

		$content
			.addClass("ddk-restrict-overflow")
			.width(layoutContentMinwidth);

		$content.each(function() {
			var $this = $(this);
			if ($this.hasClass("ps-content-block")) {
				$this.height(layoutContentMinheight);
			}
		});
	}

	//PSDDK-175: toggle top/bottom panes
	function shrinkLayoutContent_DDK2(iPane, iSection) {
		var selector,
			$pane,
			$content,
			p = asPane[iPane],
			sec = iSection? (typeof iSection === "string"? iSection : asSection[iSection]) : "middle"
		;

		if (DDK.accordion[p] !== undefined && DDK.accordion[p][sec] !== undefined) {
			selector = "#layout_" + (sec === "middle"? "" : sec + "_") + p + "_accordion > .ui-accordion-content-active";
		} else if (DDK.tabs[p] !== undefined && DDK.tabs[p][sec] !== undefined) {
			selector = "#layout_" + (sec === "middle"? "" : sec + "_") + "content_" + p + " > .ui-tabs-panel:visible";
		} else {
			selector = "#layout_" + (sec === "middle"? "" : sec + "_") + "content_" + p;
		}

		$pane = $(selector);
		$content = $pane.children("div.ps-content-row:visible, div.ps-content-block:visible").not(".ps-content-fixed");

		$content
			.addClass("ddk-restrict-overflow")
			.width(layoutContentMinwidth);

		$content.each(function() {
			var $this = $(this);
			if ($this.hasClass("ps-content-block")) {
				$this.height(layoutContentMinheight);
			}
		});
	}

	function resizeControl($elem) {
		var id = $elem.attr("id"),
			idParts
		;
		if (id) {
			idParts = id.split("_");
			if (idParts[0] === "psc" && idParts[3] === "widget") {
				DDK.format(id);
				PSC_Resize(idParts[1], idParts[2]);
			}
		}
	}

	/* Resize Pane Content */
	//PSDDK-175: toggle top/bottom panes
	function resizeContent(pane, resizeComponents, contentType, sectionType) {
		var section = (sectionType === undefined || sectionType === "" || sectionType === "middle")? "" : sectionType + "_";
			selector = "#layout_" + section + (contentType === "accordion" ? "" : "content_") + asPane[pane] + (contentType ? (contentType === "accordion" ? "_accordion > .ui-accordion-content-active" : " > .ui-tabs-panel:visible") : ""),
			$pane = $(selector),
			$content = $pane.children("div.ps-content-row:visible, div.ps-content-block:visible"),
			$rows = $content.filter("div.ps-content-row, div.ps-content-block.ps-content-newgroup"),
			$bam = $content.closest("div[id^=\"psc_bamset\"][id$=\"_widget\"]"),
			$scard = $content.closest("div[id^=\"psc_scorecard\"][id$=\"_widget\"]"),
			blockGroups = [],
			fixedBlockGroups = [],
			$blocks = undefined,
			$firstChild = $content.first(),
			paneContentHeight = $pane.height() - (contentType ? 3 : 0),
			//paneContentWidth = $pane.width(),
			paneContentWidth = (contentType === "accordion")? $pane.parent().width() : $pane.width(),
			fixedHeight = 0,
			availableHeight = undefined,
			availableWidth = undefined,
			blockHeight = undefined,
			blockWidth = undefined,
			blockCount = undefined,
			rowWidth = undefined,
			i = 0,
			blockColumns = undefined,
			blockRows = undefined,
			$fixedBlocks = undefined;

		// clear .ddk-restrict-overflow
		$content.removeClass("ddk-restrict-overflow");
		// fix accordion active option defect when pane is hidden
		if (contentType === "accordion") $pane.width("");

		// allow 22px for scrollbar
		// except when:
		// - the html element has a class of `touch`
		// - any of the pane content has a `ps-pane-noscroll` or `ps-content-noscroll` flag class
		// - the pane content is a single div.ps-content-block
		if ($("html").hasClass("touch") || $content.hasClass("ps-pane-noscroll") || $content.hasClass("ps-content-noscroll") || ($content.size() === 1 && $content.hasClass("ps-content-block"))) {
			// don't add scrollbar padding
			// add 2px padding buffer to handle rounding errors in block size calculations
			paneContentWidth -= 2;
			paneContentHeight -= 2;
		} else {
			// add scrollbar padding
			paneContentWidth -= 22;
			paneContentHeight -= 22;
		}

		// determine available width for rows and blocks
		availableWidth = paneContentWidth;
		if (availableWidth < layoutContentMinwidth) { availableWidth = layoutContentMinwidth; }
		rowWidth = availableWidth - 2 * layoutContentPadding; // - 2;
		if (rowWidth < layoutContentMinwidth) { rowWidth = layoutContentMinwidth; }

		// find first block group if the first child of the pane is a block but not a newgroup block
		if ($firstChild.hasClass("ps-content-block") && !$firstChild.hasClass("ps-content-newgroup")) {
			$blocks = $firstChild.nextUntil(".ps-content-row:visible, .ps-content-block.ps-content-newgroup:visible").addBack();
			if ($blocks.hasClass("ps-content-fixed")) {
				fixedBlockGroups.push($blocks);
			} else {
				blockGroups.push($blocks);
			}
		}

		//console.log("Height: ", paneContentHeight, " Width: ", paneContentWidth, " Available Width: ", availableWidth);

		// loop through the rows and newgroup blocks
		$rows.each(function() {
			var $this = $(this),
				borderVertical = (parseInt($this.css("border-top-width")) || 0) + (parseInt($this.css("border-bottom-width")) || 0),
				borderHorizontal = (parseInt($this.css("border-left-width")) || 0) + (parseInt($this.css("border-right-width")) || 0);

			// find all blocks in this group
			if ($this.hasClass("ps-content-block")) {
				$blocks = $this.nextUntil(".ps-content-row:visible, .ps-content-block.ps-content-newgroup:visible").addBack();
			} else {
				$blocks = $this.nextUntil(".ps-content-row:visible, .ps-content-block.ps-content-newgroup:visible");
			}
			if ($blocks.size()) {
				if ($blocks.hasClass("ps-content-fixed")) {
					fixedBlockGroups.push($blocks);
				} else {
					blockGroups.push($blocks);
				}
			}

			if ($this.hasClass("ps-content-row")) {
				// set row element width
				$this.width(rowWidth - borderHorizontal);

				// resize control (if this row is a control div)
				resizeComponents && resizeControl($this);

				// add up row heights
				fixedHeight += $this.outerHeight(true);
			}
		});

		// resize each block group that contains a ps-content-fixed element
		for (i = 0; i < fixedBlockGroups.length; i += 1) {
			$blocks = fixedBlockGroups[i];

			$fixedBlocks = $blocks.filter(".ps-content-fixed");

			// block height is based on the first fixed block element found in the group
			//console.log("Fixed block height components:", parseInt($fixedBlocks.height()), (parseInt($fixedBlocks.css("border-top-width")) || 0), (parseInt($fixedBlocks.css("border-bottom-width")) || 0));
			blockHeight = parseInt($fixedBlocks.height()) + (parseInt($fixedBlocks.css("border-top-width")) || 0) + (parseInt($fixedBlocks.css("border-bottom-width")) || 0);
			//console.log("Calculated block height:", blockHeight);
			availableWidth = paneContentWidth;
			$fixedBlocks.each(function() {
				var $this = $(this),
					borderVertical = (parseInt($this.css("border-top-width")) || 0) + (parseInt($this.css("border-bottom-width")) || 0),
					borderHorizontal = (parseInt($this.css("border-left-width")) || 0) + (parseInt($this.css("border-right-width")) || 0);

					availableWidth -= $this.width() + borderHorizontal + 2 * layoutContentPadding; // + 2;
			});

			blockCount = $blocks.size() - $fixedBlocks.size();
			if (blockCount) {
				blockWidth = (availableWidth / blockCount).toFixed() - 2 * layoutContentPadding; // - 2;

				$blocks.each(function() {
					var $this = $(this),
						borderVertical = (parseInt($this.css("border-top-width")) || 0) + (parseInt($this.css("border-bottom-width")) || 0),
						borderHorizontal = (parseInt($this.css("border-left-width")) || 0) + (parseInt($this.css("border-right-width")) || 0);

					if (!$this.hasClass("ps-content-fixed")) {
						$this.height(blockHeight - borderVertical);
						$this.width(blockWidth - borderHorizontal);
					}

					// resize control (if this block is a control div)
					resizeComponents && resizeControl($this);

				});
			}

			// add fixed block group height
			fixedHeight += blockHeight + 2 * layoutContentPadding;
		}

		// determine available height for non-fixed-height blocks
		availableHeight = paneContentHeight - fixedHeight;
		if (availableHeight < layoutContentMinheight) { availableHeight = layoutContentMinheight; }
		availableWidth = paneContentWidth;

		// resize each block group that does not contain a ps-content-fixed element
		for (i = 0; i < blockGroups.length; i += 1) {
			$blocks = blockGroups[i];
			blockCount = $blocks.size();
			blockRows = 1;
			blockColumns = 1;

			if (availableWidth > (2 * layoutContentMinwidth + 60) && blockCount > 1) { blockColumns = 2; }
			if (availableWidth > (3 * layoutContentMinwidth + 90) && blockCount > 2) { blockColumns = 3; }

			blockRows = (blockCount / blockColumns).toFixed();
			if (blockRows < 1) { blockRows = 1; }

			/* allow 2 * layout_content_padding for div element padding */
			blockHeight = (availableHeight / blockGroups.length / blockRows).toFixed() - 2 * layoutContentPadding;
			blockWidth = (availableWidth / blockColumns).toFixed() - 2 * layoutContentPadding; // - 2;

			if (blockHeight < layoutContentMinheight) { blockHeight = layoutContentMinheight; }
			if (blockWidth < layoutContentMinwidth) { blockWidth = layoutContentMinwidth; }

			$blocks.each(function() {
				var $this = $(this),
					borderVertical = (parseInt($this.css("border-top-width")) || 0) + (parseInt($this.css("border-bottom-width")) || 0),
					borderHorizontal = (parseInt($this.css("border-left-width")) || 0) + (parseInt($this.css("border-right-width")) || 0);

				$this.height(blockHeight - borderVertical);
				$this.width(blockWidth - borderHorizontal);

				// resize control (if this block is a control div)
				resizeComponents && resizeControl($this);
			});
		}
	}