	window.oldIE = oldIE || false;
	window.recentIE = recentIE || false;

	function PSC_Resize(name, id, forceReload) {
		DDK[name].resize(id, forceReload);
	}

	function PSC_Reload(name, id) {
		/* $("body").children(".ps-tooltip-dialog").not(".ddk-dialog-persist").remove(); */
		DDK[name].reload(id);
	}

	function PSC_List_Resize() {}
	
	function PSC_List_Reload(id, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("list", id, callback, beforeInit, beforeReload, keywords);
	}
	
	function PSC_Bamset2_Resize() {}
	
	function PSC_Bamset2_Reload(id, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("bamset2", id, callback, beforeInit, beforeReload, keywords);
	}
	function PSC_Navset2_Resize() {}
	
	function PSC_Navset2_Reload(id, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("navset2", id, callback, beforeInit, beforeReload, keywords);
	}
	/*	PureShare Component
	 *	Dynamic Chart
	 *	PSC_Chart_JS
	 */

	function PSC_Chart_Delayed_Reload(id) {
		setTimeout(function() { PSC_Chart_Reload(id) }, 300);
	}

	function PSC_Chart_Reload(chartID, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("chart", chartID, callback, beforeInit, beforeReload, keywords);
	}

	function PSC_Chart_UpdateChart(id, metricsDynamic, metricsStatic) {
		$('#psc_chart_' + id + '_metrics_choose_button').click();

		K({
			md: metricsDynamic,
			se: metricsStatic + "," + metricsDynamic
			//hd: "",
			//hdt: ""
		}, "s_" + id + "_");

		PSC_Chart_Reload(id);
	}

	/* PureShare Component
	 * Dynamic Table
	 * PSC_Table_JS
	 */

	function addColumnFilters(id, isServer) {
		var	$widget = $("#psc_table_" + id + "_widget"),
			options = DDK.table.data[id],
			$dataTable = $('#' + id).dataTable(),
			$scrollHead = $('#' + id + '_wrapper .dataTables_scrollHead thead'),
			aoColumns = $dataTable.fnSettings().aoColumns || [],
			filterRow = '<tr>',
			i,
			oColumn;

		if (options.fms || options.fmt) {
			for (i = 0; i < aoColumns.length; i += 1) {
				oColumn = aoColumns[i];
				if (oColumn && oColumn.bVisible !== false) {
					filterRow += fnCreateColumnFilter(id, i, oColumn.sTitle.toUpperCase());
				}
			}
			filterRow += '</tr>';
			if (isServer)
				$scrollHead.children('tr').eq(1).replaceWith(filterRow);
			else
			$scrollHead.append(filterRow);

			}

		// moved this outside the previous if scope so that resize always happens as needed (http://jira.pureshare.com/jira/browse/PSDDK-308)
		if ($widget.hasClass('ps-content-block')) {
			PSC_Table_Resize(id);
		} else if ( options.table.oSettings ) {
			options.table.fnAdjustColumnSizing();
		}
	}

	//PSDDK-280: save the sorting done on the Table
	function dtSortValue(aoSettings) {
		var cSort = "";
		for (var m=0; m<aoSettings.aaSorting.length; m += 1) {
			cSort += (cSort === "" ? "'" : "^'") + aoSettings.aaSorting[m][0] + "','" + aoSettings.aaSorting[m][1] + "'";
		}
		return cSort;
	}

	function addDTSortListener(id) {
		var	$dataTable = $('#' + id).dataTable(),
			aoColumns = $dataTable.fnSettings().aoColumns || [],
			aoSettings = $dataTable.fnSettings(),
			i;
			//cSort;
		for (i = 0; i < aoColumns.length; i += 1) {
			$(aoColumns[i].nTh).off("click.DT.sort");
			$(aoColumns[i].nTh).on("click.DT.sort", function () {
				//cSort = "";
				//for (var m=0; m<aoSettings.aaSorting.length; m += 1) {
				//	cSort += (cSort === "" ? "'" : "^'") + aoSettings.aaSorting[m][0] + "','" + aoSettings.aaSorting[m][1] + "'";
				//}
				//K("s_" + id + "_tsort", cSort);
				K("s_" + id + "_tsort", dtSortValue(aoSettings));
			});
		}
	}

	function fnCreateColumnFilter( id, i, title ) {
		var filterElement,
			options = DDK.table.data[id]
		;
		if (
			(options.fms.toUpperCase().replace(/_/g,'').indexOf('\''+title.replace(/ /g,'')+'\'') >= 0)
			|| (options.ms.toUpperCase().replace(/_/g,'').indexOf('\''+title.replace(/ /g,'')+'\'') >= 0 && options.fms.toLowerCase() === 'static')
			|| (options.ms.toUpperCase().replace(/_/g,'').indexOf('\''+title.replace(/ /g,'')+'\'') < 0 && options.fms.toLowerCase() === 'dynamic')
			|| (options.fms.toLowerCase() === 'all')
		) {
			filterElement = '<td class="ps-filter">';
			filterElement += fnCreateSelect( options.table.fnGetColumnData(i).sort(naturalSort), title, i, id );

		} else if (
			(options.fmt.toUpperCase().replace(/_/g,'').indexOf('\''+title.replace(/ /g,'')+'\'') >= 0)
			|| (options.ms.toUpperCase().replace(/_/g,'').indexOf('\''+title.replace(/ /g,'')+'\'') >= 0 && options.fmt.toLowerCase() === 'static')
			|| (options.ms.toUpperCase().replace(/_/g,'').indexOf('\''+title.replace(/ /g,'')+'\'') < 0 && options.fmt.toLowerCase() === 'dynamic')
			|| (options.fmt.toLowerCase() === 'all')
		) {
			filterElement = '<td class="ps-filter">';
			filterElement += fnCreateInputText( title, i, id );

		} else {
			filterElement = '<td class="ps-filter">';
		}
		filterElement += '</td>';
		return filterElement;
	}

	function fnCreateInputText( sTitle, i, id ) {
		var r = '<input ';
		r += 'title="Enter a value to filter by ' + sTitle + '" ';
		r += 'class="table-filter-column-text" ';
		r += 'id="psc_table_filter_column_text_input" ';
		r += 'type="text" ';
		r += 'name="psc_table_filter_column_text_input" ';
		r += 'value="Search ' + sTitle + '" ';
		r += 'onfocus="if ( this.className == \'table-filter-column-text\' ) { this.value = \'\'; } this.className = \'table-filter-column-text table-filter-active table-filter-focus\';" ';
		r += 'onblur="if ( this.value == \'\' ) { this.className = \'table-filter-column-text\'; this.value = \'Search ' + sTitle + '\'; } else { this.className = \'table-filter-column-text table-filter-active\'; }" ';
		r += 'onkeyup="DDK.table.data.' + id + '.table.fnFilter( $(this).val(), ' + i + ' );" ';
		r += '>';
		return r;
	}

	function fnCreateSelect( aData, sTitle, i, id ) {
		var r='<select title="Select a value to filter by ' + sTitle + '" onchange="DDK.table.data.' + id + '.table.fnFilter( $(this).val(), ' + i + ');"><option value="">ALL</option>', i, iLen=aData.length;
		for ( i=0 ; i<iLen ; i++ )
		{
			r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
		}
		return r+'</select>';
	}

	function PSC_Table_FilterGlobal( PSC_Table_Object, value ) {
		PSC_Table_Object.fnFilter( value );
	}

	function PSC_Table_Reload(tableID, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("table", tableID, callback, beforeInit, beforeReload, keywords);
	}

	function PSC_Table_UpdateTable(id, metricsDynamic, metricsStatic) {
		$('#psc_table_' + id + '_metrics_choose_button').click();

		K({
			md: metricsDynamic,
			se: metricsStatic + "," + metricsDynamic
			//hd: "",
			//hdt: ""
		}, "s_" + id + "_");

		PSC_Table_Reload(id);
	}

	function PSC_Table_Resize(id) {
		/* Adjust column size and table scroll body height twice
		 * because the table scroll head will change size after the first adjustment
		 */
		var options = DDK.table.data[id];
		if (options && options.table && options.table.fnSettings()) {
			PSC_Table_Resize_Scroll_Body(id);
			//if (options.ptype !== "server") {
			setTimeout(function() { PSC_Table_Resize_Scroll_Body(id); }, 200);
			//}
		}
	}

	function PSC_Table_Resize_Scroll_Body(id) {
		var options = DDK.table.data[id];
		DDK.table.bAjaxDataGet = false;
		options.table.fnAdjustColumnSizing();
		DDK.table.bAjaxDataGet = true;

		var $control = $('#psc_table_' + id + '_widget');
		var isBlock = $control.hasClass("ps-content-block");
		var isRow = $control.hasClass("ps-content-row") || $control.parents().hasClass("row");


		var controlHeight = $control.height();
		var controlWidth = $control.width();
		var toolbarHeight = 0;
		$control.children('.ps-toolbar').each(function() {
			toolbarHeight += $(this).outerHeight(true);
		});
		$control.children('.ddk-fav-bar').each(function() {
			toolbarHeight += $(this).outerHeight(true);
		});
		var infoHeight = $control.find('.dataTables_info').outerHeight(true);
		var pageHeight = $control.find('.dataTables_paginate').outerHeight(true);
		var lengthHeight = $control.find('.dataTables_length').outerHeight(true);

		var scrollHeadHeight = $control.find('.dataTables_scrollHead').outerHeight(true);
		var scrollFootHeight = $control.find('.dataTables_scrollFoot').outerHeight(true);

		var scrollBodyHeight = controlHeight - toolbarHeight - lengthHeight - scrollHeadHeight - scrollFootHeight - (options.ptype === "server" ? 20 : 0);
		scrollBodyHeight -= infoHeight > pageHeight ? infoHeight : pageHeight;

		if (!(isRow || DDK.modePDF)) {
			options.table.fnSettings().oScroll.sY = scrollBodyHeight;
			K('s_' + id + '_h', scrollBodyHeight);
			options.height = scrollBodyHeight;

			fixColumnSizing('#psc_table_' + id + '_widget')
		}
	}

	function PSC_Scorecard_Reload(scorecardID, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("scorecard", scorecardID, callback, beforeInit, beforeReload, keywords);
	}

	function PSC_Scorecard_Resize(id) {
		var $control = $('#psc_scorecard_' + id + '_widget'),
			$content = $('#psc_scorecard_data_' + id),
			$data = $('#psc_scorecard_data_' + id),
			controlHeight = $control.height(),
			controlWidth = $control.width(),
			toolbarHeight = $control.children('.ps-toolbar').first().outerHeight(true) + $control.children('.ps-toolbar').last().outerHeight(true) + $control.children('.ddk-fav-bar').outerHeight(true),
			contentHeight = controlHeight - toolbarHeight,
			options = DDK.scorecard.data[id],
			isGrouped = Boolean($data.data('gk')),
			isBlock = $control.hasClass("ps-content-block"),
			isRow = $control.hasClass("ps-content-row") || $control.parents().hasClass("row"),
			isEmpty = $data.data("config") === "\"\"";

		if (isEmpty || isGrouped && isBlock && !DDK.modePDF) {
			K('s_' + id + '_h', contentHeight);
			$content.height(contentHeight);
		} else if (isRow || DDK.modePDF) {
			if (options && options.table && options.table.fnSettings()) {
				PSC_Scorecard_Resize_Scroll_Body(id, true);
				setTimeout(function() { PSC_Scorecard_Resize_Scroll_Body(id, true); }, 200);
			}
		} else {
			if (options && options.table && options.table.fnSettings()) {
				PSC_Scorecard_Resize_Scroll_Body(id);
				setTimeout(function() { PSC_Scorecard_Resize_Scroll_Body(id); }, 200);
			}
		}
	}


	function PSC_Scorecard_Resize_Scroll_Body(id, isRow) {
		var options = DDK.scorecard.data[id];

		options.table.fnAdjustColumnSizing();

		var $control = $('#psc_scorecard_' + id + '_widget');

		var controlHeight = $control.height();
		var controlWidth = $control.width();
		var toolbarHeight = $control.children('.ps-toolbar').first().outerHeight(true);
		toolbarHeight += $control.children('.ps-toolbar').last().outerHeight(true);
		toolbarHeight += $control.children('.ddk-fav-bar').outerHeight(true);
		var infoHeight = $control.find('.dataTables_info').outerHeight(true);
		var pageHeight = $control.find('.dataTables_paginate').outerHeight(true);
		var lengthHeight = $control.find('.dataTables_length').outerHeight(true);

		var scrollHeadHeight = $control.find('.dataTables_scrollHead').outerHeight(true);
		var scrollFootHeight = $control.find('.dataTables_scrollFoot').outerHeight(true);

		var scrollBodyHeight = controlHeight - toolbarHeight - lengthHeight - scrollHeadHeight - scrollFootHeight;
		scrollBodyHeight -= infoHeight > pageHeight ? infoHeight : pageHeight;

		//if (isRow) { scrollBodyHeight = controlHeight; }
		//console.log("Scroll Body Height: ", id, scrollBodyHeight);
		//console.log(scrollBodyHeight, " = ", controlHeight, toolbarHeight, lengthHeight, scrollHeadHeight,scrollFootHeight, infoHeight, pageHeight);
		if (!isRow) {
			options.table.fnSettings().oScroll.sY = scrollBodyHeight + "px";
			K('s_' + id + '_h', scrollBodyHeight);
			options.height = scrollBodyHeight;
		}
		fixColumnSizing('#psc_scorecard_' + id + '_widget')
	}


	function PSC_Tree_Resize(id) {
		var $tree = $("#" + id),
			$treeContainer = $tree.parent().parent(),
			containerHt = $treeContainer.height(),
			toolbarHt;
		if($tree && $tree.length > 0 && containerHt > 0 && $tree.is(":visible")){
			if($treeContainer.children().size() > 1){
				toolbarHt = 0; //to be subtracted to get the new height
				// adds the others height like toolbars, footers etc
				$treeContainer.children(":visible").each(function(){
					var $this = $(this)
					if($this.get(0) != $tree.parent().get(0)){
						toolbarHt += $this.outerHeight();
					}
				});
				$tree.css("max-height", containerHt - toolbarHt - 10); //10 is just for padding
			}
		}

	}

	function PSC_Tree_Reload(treeID, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("tree", treeID, callback, beforeInit, beforeReload, keywords);
	}

	function PSC_Tree_Refresh(id){
		if(DDK.tree.data[id].tree.length > 0){
			DDK.tree.data[id].tree.jstree("refresh");
		}
		else{
			PSC_Tree_Reload(id, DDK.tree.data[id].callback);
		}
	}




	


	function PSC_Bamset_Reload(bamsetID, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("bamset", bamsetID, callback, beforeInit, beforeReload, keywords);
	}

	function PSC_Bamset_Resize(id) {
		var $control = $('#psc_bamset_' + id + '_widget'),
			$content = $('#psc_bamset_data_' + id),
			$data = $('#psc_bamset_data_' + id),
			controlHeight = $control.height(),
			controlWidth = $control.width(),
			toolbarHeight = $control.children('.ps-toolbar').first().outerHeight(true) + $control.children('.ps-toolbar').last().outerHeight(true) + $control.children('.ddk-fav-bar').outerHeight(true),
			contentHeight = controlHeight - toolbarHeight,
			aspectRatio = $control.data("aspectRatio");

		// if using data-aspect-ratio, set control container height based on the width
		// and recalculate contentHeight
		if (aspectRatio) {
			controlHeight = controlWidth / aspectRatio;
			$control.height(controlHeight);
			contentHeight = controlHeight - toolbarHeight;
		}
		
		//console.log($control.children('.ps-toolbar').first().outerHeight(true), $control.children('.ps-toolbar').last().outerHeight(true), $control.children('.ddk-fav-bar').outerHeight(true));
		$content.outerHeight(contentHeight);
		$content.children("ul").each(function() {
			var $this = $(this),
				height = $this.height(),
				width = $this.width(),
				scrollType = ($this.hasClass("ddk-bamset-scroll-vertical") ? "vertical" : ($this.hasClass("ddk-bamset-scroll-horizontal") ? "horizontal" : "none")),
				groups = {},
				$group,
				i,
				groupFontSize = []; // header, content, footer

			// resize bamset ul and li elements
			resizeBamsetUL($this, scrollType);

			// resize text in autosize bams
			$this.find(".ddk-bam-autosize").children("div").each(resizeBamText);

			// check for autosize groups and cache them
			$this.find(".ddk-bam-autosize[data-bam-autosize]").each(function(index, elem) {
				var $elem = $(elem),
					group = $elem.data("bam-autosize");
				if (groups[group]) {
					// group already found, ignore this element
				} else {
					groups[group] = $this.find('[data-bam-autosize="' + group + '"]');
				}
			});

			// for each autosize group, find the min font-size for header, content, and footer sections
			// then adjust all elements in the group to match those values
			for (i in groups) {
				if (groups.hasOwnProperty(i)) {
					groupFontSize = [Infinity, Infinity, Infinity];
					$group = groups[i];
					$group
						.each(function(index, elem) {
							var $elem = $(elem);
							groupFontSize[0] = Math.min(groupFontSize[0], parseInt($elem.find(".ddk-bam-header > span").css("font-size")));
							groupFontSize[1] = Math.min(groupFontSize[1], parseInt($elem.find(".ddk-bam-content > span").css("font-size")));
							groupFontSize[2] = Math.min(groupFontSize[2], parseInt($elem.find(".ddk-bam-footer > span").css("font-size")));
						})
						.find(".ddk-bam-header > span")
							.css("font-size", groupFontSize[0] + "px")
							.end()
						.find(".ddk-bam-content > span")
							.css("font-size", groupFontSize[1] + "px")
							.end()
						.find(".ddk-bam-footer > span")
							.css("font-size", groupFontSize[2] + "px")
							.end();
				}
			}
		});
		
		function normalizeLevels($target) {
			$target.children("ul").each(function (index, elem) {
				var $bams = $(elem).children("li"),
					$level = _.map(["header", "content", "footer"], function (type) {
						return $bams.children(".ddk-bam-" + type).children("span");
					});
				
				// set header, content, and footer font sizes for this level
				_.each($level, function ($group) {
					var groupFontSize = Infinity;
					
					// find the smallest font size in the group
					$group.each(function (index, elem) {
						groupFontSize = Math.min(groupFontSize, parseInt($(elem).css("font-size")));
					});
					
					// apply that font size to all elements in the group
					$group.css("font-size", groupFontSize.toString() + "px")
				});
				
				// recurse on all bams
				normalizeLevels($bams);
			});
		}
		
		// iterate through each level of nesting
		// so that every level of nesting will be rendered consistently
		normalizeLevels($content);
	}

	function resizeBamText(index, elem) {
		var $elem = $(elem),
			$spans = $elem.children(),
			spanCount = $spans.size(),
			height = $elem.height(),
			width = $elem.width(),
			text = $spans.text(),
			textLength = text.length,
			maxTextWidth = Math.max(width - (spanCount * 5), 1),
			maxTextHeight = Math.max(height - 10, 1),
			fontFamily = $elem.css("font-family").replace(/ /g, "").replace(/-/g, "").split(",").pop();

		$spans.css({
			"font-size": Math.floor(Math.min(maxTextHeight, maxTextWidth * 10 / DDK.util.stringWidth(text, fontFamily))) + "px",
			"line-height": height + "px"
		});
	}

	function optimumGrid(options) {
		"use strict";
		var rows,
			columns,
			o = {
				containerHeight: 100,
				containerWidth: 150,
				elementCount: 1,
				preferRows: 2,
				columnFactor: 1,
				rowFactor: 3
			},
			i;

		$.extend(o, options);

		o.aspectRatio = o.containerWidth / o.containerHeight;
		o.square = Math.ceil(Math.pow(o.elementCount, 0.5));
		rows = o.square;
		columns = Math.ceil(o.elementCount / o.square);

		for (i = 0; i < o.square; i += 1) {
			//console.log("c: ", i, o.aspectRatio, o.preferRows * ((o.square - i) * o.columnFactor));
			//console.log("r: ", i, o.aspectRatio, o.preferRows / ((o.square - i) * o.rowFactor));
			if (o.aspectRatio > (o.preferRows * ((o.square - i) * o.columnFactor))) {
				rows = Math.ceil(o.elementCount / (i + 1));
				columns = i + 1;
				break;
			} else if (o.aspectRatio < (o.preferRows / ((o.square - i) * o.rowFactor))) {
				rows = i + 1;
				columns = Math.ceil(o.elementCount / (i + 1));
				break;
			}
		}

		//console.log([columns, rows])
		return [columns, rows];
	}

	function resizeBamsetUL(elem, scrollType) {
		var $elem = $(elem),
			$li = $elem.children("li"),
			liCount = $li.size(),
			height = $elem.height(),
			width = $elem.width() - 17, // leave room for a scrollbar!
			aspectRatio = ($elem.data("bam-aspect-ratio") || 1.5),
			preferRows = 2, // (width / height) aspectRatio below which rows are preferred over columns
			dim,
			marginPercent = parseFloat($elem.closest("ul[data-bam-margin]").data("bam-margin")),
			marginBaseHeight = $elem.closest("ul[data-bam-margin]").height(),
			marginBaseWidth = $elem.closest("ul[data-bam-margin]").width(),
			margin = Math.ceil(0.01 * marginPercent * marginBaseWidth),
			//margin = Math.max(4, Math.floor(0.01 * marginPercent * Math.min(marginBaseHeight, marginBaseWidth))) + "px", // margin is the specified % of the width or the height, whichever is smaller (default margin is 1%, minimum margin is 4px)
			liBaseHeight,
			liBaseWidth;

		//console.log(liCount, margin, height, width, marginBaseHeight, marginBaseWidth);

		if (scrollType === "vertical") {
			// find the base height and base width for the li elements (no borders or margins)
			liBaseWidth = width - 18 - parseInt(margin); // allow 18px + margin for scrollbar and margin above scrollbar
			liBaseHeight = liBaseWidth / aspectRatio;

			// set the height and width, allowing for borders
			$li
				.each(function(index, elem) {
					var $this = $(this),
						borderVertical = (parseInt($this.css("border-top-width")) || 0) + (parseInt($this.css("border-bottom-width")) || 0),
						borderHorizontal = (parseInt($this.css("border-left-width")) || 0) + (parseInt($this.css("border-right-width")) || 0);

					$this.width(liBaseWidth - borderHorizontal).height(liBaseHeight - borderVertical);

				})
				.slice(0, -1)
					.css({"margin-bottom": margin});

		} else if (scrollType === "horizontal") {
			// find the base height and base width for the li elements (no borders or margins)
			liBaseHeight = height - 18 - parseInt(margin); // allow 18px + margin for scrollbar and margin above scrollbar
			liBaseWidth = liBaseHeight * aspectRatio;

			// set the height and width, allowing for borders
			$li
				.each(function(index, elem) {
					var $this = $(this),
						borderVertical = (parseInt($this.css("border-top-width")) || 0) + (parseInt($this.css("border-bottom-width")) || 0),
						borderHorizontal = (parseInt($this.css("border-left-width")) || 0) + (parseInt($this.css("border-right-width")) || 0);

					$this.width(liBaseWidth - borderHorizontal).height(liBaseHeight - borderVertical);

				})
				.slice(0, -1)
					.css({"margin-right": margin});
		} else {
			// scrollType === none
			// figure out how many rows and columns are needed to best lay out li children
			// columns x rows

			// dim = optimumGrid({
				// elementCount: liCount,
				// containerHeight: height,
				// containerWidth: width
			// });

			aspectRatio = width / height;

			if (liCount > 20) {
				// 5 x 5
				dim = [5, 5];
			} else if (liCount > 16) {
				// 5 x 4 or 4 x 5
				if (aspectRatio > preferRows) {
					dim = [5, 4];
				} else {
					dim = [4, 5];
				}
			} else if (liCount === 16) {
				// 4 x 4
				dim = [4, 4];
			} else if (liCount > 12) {
				// 5 x 3 or 3 x 5
				if (aspectRatio > preferRows) {
					dim = [5, 3];
				} else {
					dim = [3, 5];
				}
			} else if (liCount > 9) {
				// 4 x 3 or 3 x 4
				if (aspectRatio > preferRows) {
					dim = [4, 3];
				} else {
					dim = [3, 4];
				}
			} else if (liCount > 6) {
				// 3 x 3
				dim = [3, 3];
			} else if (liCount > 4) {
				// n x 1 or 3 x 2 or 2 x 3 or 1 x n
				if (aspectRatio > (2.5 * preferRows)) {
					dim = [liCount, 1];
				} else if (aspectRatio > preferRows) {
					dim = [3, 2];
				} else if (aspectRatio > (preferRows / 3)) {
					dim = [2, 3];
				} else {
					dim = [1, liCount];
				}
			} else if (liCount === 4) {
				// 2 x 2
				dim = [2, 2];
			} else if (liCount === 3) {
				// 2 x 2 or 3 x 1 or 1 x 3
				if (aspectRatio > (preferRows)) {
					dim = [3, 1];
				} else if (aspectRatio < (preferRows / 1.5)) {
					dim = [1, 3];
				} else {
					dim = [2, 2];
				}
			} else if (liCount === 2) {
				// 2 x 1 or 1 x 2
				if (aspectRatio > preferRows) {
					dim = [2, 1];
				} else {
					dim = [1, 2];
				}
			} else if (liCount === 1) {
				// 1 x 1
				dim = [1, 1];
			}

			// for each li element, set the width, height, margin-right, and margin-bottom

			// find the base height and base width for the li elements (no borders or margins)
			//console.log(width);
			liBaseHeight = Math.floor((height - ((dim[1] - 1) * margin)) / dim[1]) - 2;
			liBaseWidth = Math.floor((width - ((dim[0] - 1) * margin)) / dim[0]) - 2;

			// set the height and width, allowing for borders
			// clear bottom and right margins
			$li.each(function(index, elem) {
					var $this = $(this),
						borderVertical = (Math.ceil(parseFloat($this.css("border-top-width"))) || 0) + (Math.ceil(parseFloat($this.css("border-bottom-width"))) || 0),
						borderHorizontal = (Math.ceil(parseFloat($this.css("border-left-width"))) || 0) + (Math.ceil(parseFloat($this.css("border-right-width"))) || 0);

					$this
						.width(liBaseWidth - borderHorizontal)
						.height(liBaseHeight - borderVertical)
						.css({"margin-bottom": 0})
						.css({"margin-right": 0});

					//console.log(liBaseHeight, liBaseWidth, borderVertical, borderHorizontal);
			});

			// if there is more than one row, set bottom margin for all but the bottom-most row of li elements
			if (dim[1] > 1) {
				// console.log("margin-bottom:", margin, $li.slice(0, dim[0] * (dim[1] - 1)));
				$li
					.slice(0, dim[0] * (dim[1] - 1))
						.css({"margin-bottom": margin});
			}

			// if there is more than one column, set right margin for all but the right-most column of li elements
			if (dim[0] > 1) {
				// console.log("margin-right:", margin, $li.filter(function(index) { return ((index + 1) % dim[0]); }));
				$li
					.filter(function(index) {
						return ((index + 1) % dim[0]);
					})
						.css({"margin-right": margin});
			}
		}

		// for each li child, resize a nested child ul if it has one, all nested ul bamsets are formatted with scrollType=none
		$li.children("ul").each(function(index, elem) {
			resizeBamsetUL(elem, "none");
		});

		// for each trend canvas, resize it to the new parent dimensions
		$li.children(".ddk-bam-content").find("canvas").each(function() {
			var $this = $(this),
				$container = $this.closest(".ddk-bam-content");

			setTimeout(function() {
				//console.log($this, $container.height(), $container.width());
				$this.height($container.height() * 0.95);
				$this.width($container.width() * 0.95);
			}, 0);
		});
	}
	
	function PSC_Scorecard2_Reload(id, callback, beforeInit, beforeReload, keywords) {
		DDK.reloadControl("scorecard2", id, callback, beforeInit, beforeReload, keywords);
	}

	function PSC_Scorecard2_Resize(id) {
		var $control = $('#psc_scorecard2_' + id + '_widget'),
			$content = $('#psc_scorecard2_data_' + id),
			$data = $('#psc_scorecard2_data_' + id),
			controlHeight = $control.height(),
			controlWidth = $control.width(),
			toolbarHeight = $control.children('.ps-toolbar').first().outerHeight(true) + $control.children('.ps-toolbar').last().outerHeight(true) + $control.children('.ddk-fav-bar').outerHeight(true),
			contentHeight = controlHeight - toolbarHeight,
			options = DDK.scorecard2.data[id],
			isGrouped = Boolean($data.data('gk')),
			isSortable = Boolean($data.data('sortable')),
			isBlock = $control.hasClass("ps-content-block"),
			isRow = $control.hasClass("ps-content-row") || $control.parents().hasClass("row"),
			isEmpty = $data.data("config") === "\"\"";

		if (isEmpty || isGrouped && !isSortable && isBlock && !DDK.modePDF) {
			K('s_' + id + '_h', contentHeight);
			$content.height(contentHeight);
		} else if (isRow || DDK.modePDF) {
			if (options && options.table && options.table.fnSettings()) {
				PSC_Scorecard2_Resize_Scroll_Body(id, true);
				setTimeout(function() { PSC_Scorecard2_Resize_Scroll_Body(id, true); }, 200);
			}
		} else {
			if (options && options.table && options.table.fnSettings()) {
				PSC_Scorecard2_Resize_Scroll_Body(id);
				setTimeout(function() { PSC_Scorecard2_Resize_Scroll_Body(id); }, 200);
			}
		}
	}


	function PSC_Scorecard2_Resize_Scroll_Body(id, isRow) {
		var options = DDK.scorecard2.data[id];

		options.table.fnAdjustColumnSizing();

		var $control = $('#psc_scorecard2_' + id + '_widget');

		var controlHeight = $control.height();
		var controlWidth = $control.width();
		var toolbarHeight = $control.children('.ps-toolbar').first().outerHeight(true);
		toolbarHeight += $control.children('.ps-toolbar').last().outerHeight(true);
		toolbarHeight += $control.children('.ddk-fav-bar').outerHeight(true);
		var infoHeight = $control.find('.dataTables_info').outerHeight(true);
		var pageHeight = $control.find('.dataTables_paginate').outerHeight(true);
		var lengthHeight = $control.find('.dataTables_length').outerHeight(true);

		var scrollHeadHeight = $control.find('.dataTables_scrollHead').outerHeight(true);
		var scrollFootHeight = $control.find('.dataTables_scrollFoot').outerHeight(true);

		var scrollBodyHeight = controlHeight - toolbarHeight - lengthHeight - scrollHeadHeight - scrollFootHeight;
		scrollBodyHeight -= infoHeight > pageHeight ? infoHeight : pageHeight;

		//if (isRow) { scrollBodyHeight = controlHeight; }
		//console.log("Scroll Body Height: ", id, scrollBodyHeight);
		//console.log(scrollBodyHeight, " = ", controlHeight, toolbarHeight, lengthHeight, scrollHeadHeight,scrollFootHeight, infoHeight, pageHeight);
		if (!isRow) {
			options.table.fnSettings().oScroll.sY = scrollBodyHeight + "px";
			K('s_' + id + '_h', scrollBodyHeight);
			options.height = scrollBodyHeight;
		}
		fixColumnSizing('#psc_scorecard2_' + id + '_widget')
	}

