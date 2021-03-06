	/*
	 * DDK Global Object
	 *
	 *
	 */
(function(window, undefined) {
	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document,
		navigator = window.navigator,
		location = window.location,
		$ = window.jQuery
	;

	var DDK = (function() {

		var util = {
			/*
			   Function: DDK.util.string

			   Generates a string that contains the repeated input string.

			   Parameters:

				  s - The string to be repeated.
				  n - The number of times to repeat the string.

			   Returns:

				  A string of s repeated n times.

			   See Also:

				  <DDK.util.trunc>
			*/
			stringRepeat: function(s, n) {
				"use strict";
				var str = "",
					i
				;

				// n must be positive
				if (!n || n < 0) {
					return "";
				} else {
					// build a string that repeats s n times
					for (i = 0; i < n; i += 1) {
						str += s;
					}

					return str;
				}
			},

			/*
			   Function: DDK.util.trunc

			   Truncates a number to a given decmial precision.

			   Parameters:

				  x - The number to be truncated.
				  n - The decimal precision with which to truncate the number.

			   Returns:

				  A string representation of the truncated number.

			   See Also:

				  <DDK.util.string>
			*/
			trunc: function(x, n) {
				"use strict";
				var xStr = (x && x.toString() ? x.toString() : "0"),
					xParts,
					i, // integer part of x
					d, // decimal part of x
					v, // exponential notation value
					e // exponential notation exponent
				;

				// return empty string for no arguments
				if (x === undefined) {
					return "";
				}

				// treat the number as a string
				// and find the integer and decimal parts
				if (xStr.indexOf("e") > -1) {
					// handle exponential notation output from Number.toString() conversion when x is not a string
					// using strings, convert number strings in exponential notation into number strings in standard decimal notation
					xParts = xStr.split("e");
					v = xParts[0];
					e = parseInt(xParts[1], 10);

					if (e > 0) {
						i = parseInt(v.replace(".", ""), 10).toString() + DDK.util.stringRepeat("0", e - (v.length - 1));
						d = undefined;
					} else {
						i = "0";
						d = DDK.util.stringRepeat("0", -e) + v.replace(".", "");
					}
				} else {
					// x is a string not in exponential notation
					// or Number.toString() conversion did not result in exponential notation
					xParts = xStr.split(".");
					i = xParts[0] || "0";
					d = xParts[1];
				}

				if (n === undefined) {
					// n undefined
					// truncating to 0 decimal places
					return i;
				} else {
					n = parseInt(n, 10);
					if (n === 0) {
						// n is 0
						return i;
					} else if (!n) {
						// n is defined but not a number
						return;
					} else if (n < 0) {
						// truncate the integer part
						return i.slice(0, n) + (i.slice(0, n).length ? DDK.util.stringRepeat("0", -n) : "0");
					} else {
						// n > 0
						// truncate (or pad) to n decimal places
						if (d) {
							return i + "." + d.slice(0, n) + DDK.util.stringRepeat("0", n - d.slice(0, n).length);
						} else {
							return i + "." + DDK.util.stringRepeat("0", n);
						}
					}
				}
			},

			/*
			   Object: DDK.util.characterWidths

			   Arrays of normalized character widths for character codes 0 to 255 for each basic font family.

			   See Also:

				  <DDK.util.stringWidth>
			*/
			characterWidths: {

				// sans-serif (Arial, etc.)
				sansserif: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,7,7,12,9,2,4,4,5,8,4,4,4,4,7,7,7,7,7,7,7,7,7,7,4,4,8,8,8,7,13,9,9,9,9,9,8,10,9,3,6,9,7,11,9,10,9,10,9,9,7,9,9,13,7,9,7,4,4,4,5,7,4,7,7,7,7,7,3,7,7,3,3,7,3,11,7,7,7,7,4,7,4,7,5,9,7,7,7,4,3,4,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,3,7,7,7,7,3,7,4,10,4,7,8,0,10,7,5,7,4,4,4,7,7,4,4,4,5,7,11,11,11,8,9,9,9,9,9,9,13,9,9,9,9,9,3,3,3,3,9,9,10,10,10,10,10,8,10,9,9,9,9,9,9,9,7,7,7,7,7,7,12,7,7,7,7,7,3,3,3,3,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7".split(","),

				// serif (Times New Roman, etc.)
				serif: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,6,7,6,11,10,2,4,4,7,7,3,4,3,4,6,6,6,6,6,6,6,6,6,6,3,4,7,7,7,6,12,10,8,8,9,7,7,8,9,4,5,9,7,12,9,9,7,9,8,7,8,9,8,13,9,8,8,4,4,4,6,7,4,6,7,6,7,6,4,7,7,3,3,6,3,9,7,7,7,7,4,6,4,7,7,9,5,7,5,6,2,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,6,7,7,7,2,7,4,10,4,7,7,0,10,7,5,7,4,4,4,7,6,4,4,4,4,7,10,10,10,5,10,10,10,10,10,10,11,8,7,7,7,7,4,4,4,4,9,9,9,9,9,9,9,7,9,9,9,9,9,8,7,7,6,6,6,6,6,6,9,6,6,6,6,6,3,3,3,3,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7".split(","),

				// monospace (Courier New, etc.)
				monospace: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8".split(","),

				// cursive
				cursive: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,6,11,9,11,9,5,5,5,7,6,4,5,3,7,8,6,8,8,8,8,8,8,8,8,4,4,5,7,5,7,11,9,8,8,9,8,8,9,10,7,9,8,7,11,10,10,7,11,8,9,9,10,8,13,9,9,9,5,6,5,6,8,7,7,8,7,8,7,7,7,7,4,5,7,4,9,7,7,7,7,6,6,5,7,6,10,8,7,7,5,5,5,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,2,8,10,8,8,5,8,7,10,6,8,7,0,10,8,5,6,8,8,6,7,9,3,7,8,6,8,8,8,8,7,9,9,9,9,9,9,15,8,8,8,8,8,7,7,7,7,9,10,10,10,10,10,10,6,10,10,10,10,10,9,7,6,7,7,7,7,7,7,12,7,7,7,7,7,4,4,4,4,7,7,7,7,7,7,7,6,7,7,7,7,7,7,7".split(","),

				// fantasy
				fantasy: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,8,7,9,7,2,4,4,4,7,2,4,2,5,7,5,7,7,7,7,7,5,7,7,3,3,7,7,7,7,10,7,7,7,7,5,5,7,7,4,4,7,5,9,7,7,7,7,7,7,6,7,7,11,5,6,5,4,5,4,6,7,4,7,7,6,7,7,4,7,7,4,4,6,4,10,7,7,7,7,5,6,4,7,5,9,5,6,5,5,4,5,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4,7,7,7,6,4,6,4,10,4,5,7,0,10,7,5,7,4,4,4,6,7,4,4,3,4,5,8,8,9,7,7,7,7,7,7,7,9,7,5,5,5,5,4,4,4,4,7,7,7,7,7,7,7,7,7,7,7,7,7,6,7,7,7,7,7,7,7,7,10,6,7,7,7,7,4,4,4,4,7,7,7,7,7,7,7,7,7,7,7,7,7,6,7".split(",")
			},
			/*
			   Function: DDK.util.stringWidth

			   Calculates the normalized string width for a string and a given font family.

			   Parameters:

				  s - The string to be evaluated.
				  fontFamily - The font family with which the string is rendered.

			   Returns:

				  An integer representing the normalized width (pixel length) of the string.

			   See Also:

				  <DDK.util.characterWidths>
			*/
			stringWidth: function(s, fontFamily) {
				"use strict";
				var i,
					width = 0,
					len = s.length,
					charCode;

				for (i = 0; i < len; i += 1) {
					// character codes between 0 and 255 inclusive are supported
					// out-of-range values are clipped to 0 or 255
					charCode = Math.max(Math.min(s.charCodeAt(i), 255), 0);
					width += ((DDK.util.characterWidths[fontFamily] && parseInt(DDK.util.characterWidths[fontFamily][charCode], 10)) || 0);
				}

				return width;
			},
			/*
			   Function: DDK.util.keywordFromUrl

			   Sets or gets the keyword value from the given url formatted keyword-value pair

			   Parameters:

				  url - The url formatted keyword-value pair
				  keyword - Keyword name to get the value from
				  value - optional, if supplied, value will be set to the keyword name

			   Returns:

				  If get, returns a string value of the keyword
				  If set, returns the new url formatted keyword-value pair

			*/
			keywordFromUrl: function(url, keyword, value) {
				"use strict";
				var keyPairs, keyPairArr, keywordValue, newUrl;
				if(typeof(url) !== "undefined" && keyword){
					keyPairs = url.split("&");
					keyPairs = _.map(keyPairs, function(keyPair, index){
						keyPairArr = keyPair.split("=");
						if(keyPairArr[0] === keyword){
							if(typeof(value) !== "undefined"){	//if value is specified, set it to the keyword value
								keyPairArr[1] = value;
							}
							else{	//if value is undefined, return the keyword value
								keywordValue = keyPairArr[1];
							}
						}
						return keyPairArr.join("=");
					});
					//if value has a value and keyword does not exist yet, add it in the url
					if(typeof(value) !== "undefined"){
						newUrl = keyPairs.join("&");
						if(newUrl === url){
							newUrl += "&" + keyword + "=" + value;
						}
						return newUrl;
					}
					return keywordValue;
				}
			},
			/*
			   Function: DDK.util.mergeUrl

			   Merge two or more url formatted keyword value pair without duplicates. 
			   If a property of the first object is itself an object or array, 
			   it will be completely overwritten by a property with the same key in the second or subsequent object

			   Parameters:

				  Two or more url formatted keyword-value pair

			   Returns:

				  Returns the merged url

			*/
			mergeUrl: function() {
				"use strict";
				var ctr, url1, url2, keyPairs1, keyPairs2, keyPairArr1, keyPairArr2, newKeyPairs, excludePair, newUrl;
				excludePair = [];
				newKeyPairs = [];
				url1 = arguments[0];
				url2 = arguments[1];
				if(typeof(url1) !== "undefined" && typeof(url2) !== "undefined"){
					keyPairs1 = url1.split("&");
					keyPairs2 = url2.split("&");
					_.each(keyPairs1, function(keyPair1, index){
						keyPairArr1 = keyPair1.split("=");
						_.each(keyPairs2, function(keyPair2, index2){
							keyPairArr2 = keyPair2.split("=");
							if(keyPairArr2[0]){
								if(keyPairArr1[0] === keyPairArr2[0]){
									keyPairArr1[1] = keyPairArr2[1];
									excludePair.push(keyPair2);
								}
							}
						});
						if(keyPairArr1[0]){
							newKeyPairs.push("&" + keyPairArr1[0] + "=" + keyPairArr1[1]);
						}
					});
					_.each(keyPairs2, function(keyPair2, index2){
						if(excludePair.indexOf(keyPair2) < 0 && keyPair2){
							newKeyPairs.push("&" + keyPair2);
						}
					});
					ctr = 2;
					newUrl = newKeyPairs.join("");
					while(arguments[ctr]){
						newUrl = mergeUrl(newUrl, arguments[ctr]);
						ctr++;
					}
					return newUrl
				}
			}
		};
		
		function focus(e) {
			if (this.value === e.data) {
				this.value = "";
			}
		}

		function blur(e) {
			if (!this.value) {
				this.value = e.data;
			}
		}

		function setChartType(e) {
			K({
				//hd: "",
				//hdt: "",
				ty: $(this).prevAll("input").get(0).value
			}, "s_" + e.data + "_");

			if (this.value === "pie") {
				K({
					se: "",
					are: "true"
				}, "s_" + e.data + "_");

				DDK.chart.data[id].are = true;
			}

			PSC_Chart_Reload(e.data);
		}

		function configChartSeries(e) {
			var $this = $(this),
				name = "chart",
				data = $this.data("ddk"),
				id = data.split(",")[0],
				column = data.split(",")[1],
				$dialog = $('#psc_chart_' + id + '_series_config_dialog_' + column),
				keywords = {};

			if ($dialog.hasClass('ps-hidden')) {
				$dialog
					.appendTo('body')
					.removeClass('ps-hidden')
					.position({
						my: 'left top',
						at: 'left bottom',
						of: $this,
						offset: '-9 3'
					});

				//K(name + "_id", id);
				keywords[name + "_id"] = id;
				
				//K("s_" + id + "_iw", K("s_" + id + "_iw") || K(name + "__" + id + "_init_widget") || $("#psc_" + name + "_" + id + "_widget").data("options"));
				keywords["s_" + id + "_iw"] = K("s_" + id + "_iw") || K(name + "__" + id + "_init_widget") || $("#psc_" + name + "_" + id + "_widget").data("options");

				//K(name + "_init_widget", K("s_" + id + "_iw"));
				keywords[name + "_init_widget"] = keywords["s_" + id + "_iw"];

				//K({
				//	name: name,
				//	id: id
				//}, "component_");
				keywords["component_name"] = name;
				keywords["component_id"] = id;				

				//K("column_name", column);
				keywords["column_name"] = column;

				load('psc_chart_' + id + '_series_config_dialog_' + column, 'PSC_Chart_Config_Dialog_Frame', keywords, null, { stateFilter: "s_" + id + "_" });
			} else {
				$('#pscChartFrame' + id + column).attr('src', '').remove();
				$('#psc_chart_' + id + '_series_config_dialog_' + column).addClass('ps-hidden').insertAfter('#psc_chart_' + id + '_series_config_container_' + column);
			}
		}

		function makeButton() {
			var $this = $(this),
				data = $this.data(),
				role = (data.ddkRole || $this.closest("div").data("role")),
				primaryIcon = data.ddkPrimaryIcon,
				options = {};

			// console.log("role: ", role);
			if (!$this.hasClass("is-plain-button")) { 
				if ((role && role.indexOf("-icon-") > -1) || primaryIcon) {
					if (primaryIcon) {
						options = {
							icons: { primary: primaryIcon }
						}
					} else {
						options = {
							icons: { primary: role },
							text: false
						}
					}
				} else if (role) {
					options = {
						icons: { primary: "ps-icon-" + role + "-" + this.value },
						text: false
					}
				}
				// console.log($this, this.value, role, options);
				$this.button(options);
			}
		}

		function loadFavorite(name, id, fav) {
			if (fav && fav.value) {
				K.flush("s_" + id + "_");
				K(fav.value);
				K({
					fid: fav.id,
					fuid: fav.userid,
					fdesc: fav.description,
					flab: fav.label
				}, "s_" + id + "_");

				DDK[name].reload(id);
			}
		}

		var defaultTableOptions = {
			  "sScrollX": "100%"
			, "bScrollCollapse": true
			, "bDeferRender": true
			, "sDom": "ti"
			, "bPaginate": false
			, "bProcessing": false
			, "bLengthChange": false
			, "bJQueryUI": false
			, "bAutoWidth": true
			//, "aaSorting": [[ 0, "asc" ]]
			, "aoColumnDefs": [
				{ "sType": "natural", "aTargets": ["_all"] }
			]
			, "oLanguage": {
				  "oPaginate": {
							  "sFirst": "First"
							, "sLast": "Last"
							, "sNext": "Next"
							, "sPrevious": "Prev"
						}
				, "sInfo": "Showing _TOTAL_ entries"
				, "sInfoEmpty": "Showing 0 entries"
				, "sLengthMenu": "Show _MENU_"
				, "sSearch": "Search"
				, "sProcessing": "<img src=\"" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/spinner_32x32.gif\" alt=\"Processing...\">"
			}
		};

		var clientTableOptions = {
			  "sDom": "ltrip"
			, "bPaginate": true
			, "bLengthChange": true
			, "sPaginationType": "full_numbers"
			, "oLanguage": {
				  "sInfo": "_START_ to _END_ of _TOTAL_ entries"
			}
		};

		var serverTableOptions = {
			  "bDeferRender": true
			, "bServerSide": true
			, "sDom": "lftrip"
			, "bProcessing": true
			, "bPaginate": true
			, "bLengthChange": true
			, "sPaginationType": "full_numbers"
			, "oLanguage": {
				  "sInfo": "_START_ to _END_ of _TOTAL_ entries",
				  "sInfoFiltered": ""
			}
		};

		var JSONTableOptions = {
			  //"sDom": "ltrip"	//duplicate sDom
			  "bPaginate": true
			, "bLengthChange": true
			, "sPaginationType": "full_numbers"
			, "oLanguage": {
				  "sInfo": "_START_ to _END_ of _TOTAL_ entries",
				  "sInfoFiltered": ""
			}
			, "bDeferRender": true
			, "sDom": "lftrip"
			, "bProcessing": true
		};

		function initScorecard(id) {
			var $widget = $('#psc_scorecard_' + id + '_widget'),
				$data = $('#psc_scorecard_data_' + id),
				data = $data.data(),
				count = data && data.count || 0,
				height = data && data.height || 0,
				md = data && data.md || "",
				ms = data && data.ms || "",
				config = data && data.config || "\"\"",
				options = {},
				scorecardOptions = {},
				isGrouped = Boolean(data && data.gk || false),
				isSortable = Boolean(data && data.sortable || false),
				$content,
				metrics,
				attributes,
				displays;

			DDK.scorecard.data[id] = DDK.scorecard.data[id] || {};

			options = $.extend(true, DDK.scorecard.data[id], {
				height: height,
				md: md,
				ms: ms
			});

			if (config === "\"\"") {
				$.extend(true, data, $widget.find("[data-ddk-metrics]").data());
				$data.html(DDK.scorecard.template.empty);
				$content = $data.find(".ddk-control-splash-content");

				metrics = _.uniq(_.map(data && data.ddkMetrics || {}, function(value) {
					return {
						name: value.columnMetric,
						label: _.string.titleize(value.columnMetric)
					};
				}), false, function(value, index) { return value.name; });

				attributes =  _.uniq(_.map(data && data.ddkMetrics || {}, function(value) {
					return {
						name: value.columnMetricAttr,
						label: _.string.titleize(value.columnMetricAttr)
					};
				}), false, function(value, index) { return value.name; }).sort(function(a, b) {
					//console.log(a.label, b.label, a.label > b.label);
					if (a.label > b.label) {
						return 1;
					} else if (b.label > a.label) {
						return -1;
					} else {
						return 0;
					}
				});

				displays = _.map($.extend(true, {}, DDK.template.metricDisplay, (DDK.scorecard.data[id] && DDK.scorecard.data[id].customMetricDisplayTemplate) || {}), function(value, key) {
					return {name: key, label: value.displayLabel};
				}).sort(function(a, b) {
					//console.log(a.label, b.label, a.label > b.label);
					if (a.label > b.label) {
						return 1;
					} else if (b.label > a.label) {
						return -1;
					} else {
						return 0;
					}
				});

				//console.log(data, metrics, attributes, displays);

				$content.html($(DDK.template.render.scorecardChooseMetricsDialog(data)));
				$data.on("click", "button[data-ddk-button]", function (e) {
					function toggleOptions(action, $container) {
						switch (action) {
							case "show":
								$container.find(".ddk-dialog-content-header").removeClass("ps-hidden");
								$container.find("button[data-ddk-button=\"OK\"]").removeClass("ps-hidden");
							break;
							case "hide":
								$container.find(".ddk-dialog-content-header").addClass("ps-hidden");
								$container.find("button[data-ddk-button=\"OK\"]").addClass("ps-hidden");
							break;
						}
					}

					var $this = $(this),
						//$dialog = $this.closest(".ddk-dialog"),
						//data = $.extend(true, {}, data, $this.data()),
						action = $this.data().ddkButton,
						//id = data.ddkControlId,
						//name = data.ddkControlName,
						//controlElementData = $("#" + id).data(),
						//controlData = $("#psc_" + name + "_data_" + id).data(),
						oldConfig,
						newConfig,
						columns = [];

					//$.extend(true, data, controlData, controlElementData);
					// console.log($this, action, $this.data("ddkAction"));

					//console.log(action, data, metrics, attributes, displays);

					switch (action) {
						case "editMetric":
							$column = $this.closest(".ddk-dialog-bamset-bam");
							columnData = $column.data();

							columnData.$dialog = DDK.dialogs.edit({ 
								title: "Edit Column",
								save: function (value) {
									$column.data("columnConfig", _.string.parseJSON(value));
								},
								dataType: "json",
								value: JSON.stringify(columnData.columnConfig),
								$target: $this
							});
							
							if (columnData.$dialog.dialog("isOpen")) {
								columnData.$dialog.dialog("moveToTop");
							} else {
								columnData.$dialog.dialog("open");
							}
							break;
						case "removeMetric":
							if ($this.closest(".ddk-dialog-content-columns").children().size() === 1) {
								toggleOptions("hide", $this.closest(".ddk-control-splash"));
							}
							$this.closest(".ddk-dialog-bamset-bam").remove();
							break;
						case "Add_Column":
							$(DDK.template.render.scorecardDialogColumn())
								.find("select.display")
									//.html("<optgroup label=\"Formatted\">" + DDK.template.render.option(displays) + "</optgroup><optgroup label=\"Unformatted\">" + DDK.template.render.option(attributes) + "</optgroup>")
									.html(DDK.template.render.option(displays))
									.val("currentValue")
									.end()
								.find("select.metric")
									.html(DDK.template.render.option(metrics))
									.each(function() {
										var $this = $(this);
										if (metrics.length === 1) {
											$this.prop("disabled", true);
										}
									})
									.end()
								.find("button")
									.each(DDK.makeButton)
									.end()
								.appendTo($this.closest(".ddk-control-splash").find(".ddk-dialog-content-columns"))
								.find(".ddk-dialog-bamset-bam-options")
									.toggle()
									.end();

							toggleOptions("show", $this.closest(".ddk-control-splash"));
							break;
						case "expandOptions":
							$this
								.find(".ui-icon")
									.toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s")
									.end()
								.closest(".ddk-dialog-bamset-bam")
									.find(".ddk-dialog-bamset-bam-options")
									.toggle();
							break;
						case "OK":
							oldConfig = {};
							$columns = $content.find(".ddk-dialog-bamset-bam");

							$columns.each(function() {
								var $this = $(this),
									metric = ($this.find(".metric").val() || ""),
									display = ($this.find(".display").val() || ""),
									layout = ($this.find(".layout").val() || ""),
									title = ($this.find(".title").val() || ""),
									subtitle = ($this.find(".subtitle").val() || ""),
									newColumn = {};

								newColumn.columnMetric = $.trim((metric + " " + display + " " + layout));
								if (title) {
									newColumn.columnTitle = title;
								}
								if (subtitle) {
									newColumn.columnSubtitle = subtitle;
								}
								columns.push(newColumn);
							});

							newConfig = oldConfig;
							newConfig.scorecardColumn = columns;

							//console.log(newConfig);

							//console.log(newConfig, JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(91)).replace(/\x5D/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(93)));

							//K("s_" + id + "_con", JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, String.fromCharCode(92) + String.fromCharCode(91)).replace(/\x5D/g, String.fromCharCode(92) + String.fromCharCode(93)));
							K("s_" + id + "_con", DDK.escape.brackets(JSON.stringify(newConfig)));
							DDK.scorecard.reload(id);
							break;
					}
				})
				.find(".ddk-dialog-content-columns")
					.sortable({
						placeholder: "ddk-dialog-bamset-bam-placeholder ui-state-highlight",
						handle: ".ui-icon-grip-dotted-vertical"
					});
			} else {
				scorecardOptions = $.extend(true, {}, DDK.scorecard.defaultOptions, {
					"bSort": isSortable
				});

				if ($widget.hasClass("ps-content-block") && !DDK.modePDF) {
					$.extend(true, scorecardOptions, {
						"sScrollY": height
					});
				}

				// all scorecards should use the ddk-formatted sort type
				scorecardOptions.aoColumnDefs.push({ "sType": "ddk-formatted", "aTargets": ["_all"] });

				if (isGrouped) {
					groupScorecard(id);
				} else {
					options.table = $('#' + id).dataTable( $.extend(true, scorecardOptions, DDK.scorecard.data[id].customOptions || {}) );
					fixColumnSizing('#psc_scorecard_' + id + '_widget');
				}

				DDK.format($widget);
				DDK.scorecard.resize(id);
			}

			DDK.control.init($widget);
		}

		function groupScorecard(id, version) {
			var $widget = $('#psc_scorecard' + (version || "") + '_' + id + '_widget'),
				$data = $('#psc_scorecard' + (version || "") + '_data_' + id),
				isExpanded = $data.data("ge"),
				$rows = $widget.find("tbody tr"),
				groupIndex = 0;

			$rows.each(function(index, elem) {
				var $elem = $(elem);

				if ($elem.hasClass("group")) {
					groupIndex = 0;
					$elem
						.find("th:first")
							.prepend("<span class=\"ddk-icon toggle\">" + (isExpanded ? /* down */ "&#286;" : /* right */ "&#285;") + "</span>")
							.find(".sc-content")
								.addClass("text-nowrap sc-group-toggle")
								.end()
							// get the first group header th element to have text-align: left
							.addClass("text-left")
							// add +/- image and toggle event
							.click(function (e) {
								var $this = $(this),
									$icon = $this.find(".ddk-icon.toggle");
									
								e.stopPropagation();
									
								$icon.html(function (index, value) {
									return (value === /* down */ "\u011E" ? /* right */ "\u011D" : /* down */ "\u011E");
								});

								$this.closest("tr").nextUntil(".group").toggleClass("ps-hidden");
								DDK.format($widget);
							})
					
				} else if ($elem.hasClass("row-grouping-header"))  {
					groupIndex = 0;
					$elem
						.find("th:first")
							// get the first group header th element to have text-align: left
							.addClass("ddk-format-metricname")
							// add +/- image and toggle event
							.prepend("<img class='detail-toggle' src='" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/scorecard/" + (isExpanded ? "minus.png" : "plus.png") + "'>")
								.click(function(e) {
									var $this = $(this),
										$img = $this.find("img:first"),
										src = $img.attr("src");

									e.stopPropagation();

									if (src.indexOf("minus.png") > -1) {
										$img.attr("src", (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/scorecard/plus.png");
									} else {
										$img.attr("src", (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/scorecard/minus.png");
									}
									$this.closest("tr").nextUntil(".row-grouping-header").toggleClass("ps-hidden");
									DDK.format($widget);
								});
				} else {
					$elem.addClass(groupIndex % 2 ? "even" : "odd");
					groupIndex += 1;
					$elem[isExpanded ? "removeClass" : "addClass"]("ps-hidden");
				}
			});
		}

		var defaultScorecardOptions = {
			  "sScrollX": "100%"
			, "bScrollCollapse": true
			, "bDeferRender": false
			, "sDom": "t"
			, "bPaginate": false
			, "bProcessing": false
			, "bLengthChange": false
			, "bJQueryUI": false
			, "bAutoWidth": true
			, "aaSorting": []
			, "aoColumnDefs": []
			, "oLanguage": {
				  "oPaginate": {
							  "sFirst": "First"
							, "sLast": "Last"
							, "sNext": "Next"
							, "sPrevious": "Prev"
						}
				, "sInfo": "Showing _TOTAL_ entries"
				, "sInfoEmpty": "Showing 0 entries"
				, "sProcessing": "<img src=\"" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/spinner_32x32.gif\" alt=\"Processing...\">"
			}
		};

		var defaultScorecardOptions2 = {
			  "sScrollX": "100%"
			, "bScrollCollapse": true
			, "bDeferRender": false
			, "sDom": "t"
			, "bPaginate": false
			, "bProcessing": false
			, "bLengthChange": false
			, "bJQueryUI": false
			, "bAutoWidth": true
			, "aaSorting": []
			, "aoColumnDefs": []
			, "oLanguage": {
				  "oPaginate": {
							  "sFirst": "First"
							, "sLast": "Last"
							, "sNext": "Next"
							, "sPrevious": "Prev"
						}
				, "sInfo": "Showing _TOTAL_ entries"
				, "sInfoEmpty": "Showing 0 entries"
				, "sProcessing": "<img src=\"" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/spinner_32x32.gif\" alt=\"Processing...\">"
			}
		};

		function initScorecard2(id) {
			var $control = $('#psc_scorecard2_' + id + '_widget'),
				$data = $('#psc_scorecard2_data_' + id),
				data = $data.data(),
				count = data && data.count || 0,
				height = data && data.height || 0,
				md = data && data.md || "",
				ms = data && data.ms || "",
				config = data && data.config || "\"\"",
				options = {},
				scorecardOptions = {},
				isGrouped = Boolean(data && data.gk || false),
				isSortable = Boolean(data && data.sortable || false),
				$content,
				metrics,
				attributes,
				displays;

			DDK.scorecard2.data[id] = DDK.scorecard2.data[id] || {};

			options = $.extend(true, DDK.scorecard2.data[id], {
				height: height,
				md: md,
				ms: ms
			});

			//scorecardOptions = $.extend(true, {}, DDK.scorecard2.defaultOptions, {
			//	"bSort": isSortable
			//});
			
			scorecardOptions = $.extend(true, {}, DDK.scorecard2.defaultOptions);

			if ($control.hasClass("ps-content-block") && !DDK.modePDF) {
				$.extend(true, scorecardOptions, {
					"sScrollY": height
				});
			}

			// all scorecards should use the ddk-formatted sort type
			scorecardOptions.aoColumnDefs.push({ "sType": "ddk-scorecard2", "aTargets": ["_all"] });

			if (isGrouped) {
				groupScorecard(id, "2");
			} else if (isSortable && !DDK.outputPDF) {
				options.table = $('#' + id).dataTable( $.extend(true, scorecardOptions, DDK.scorecard2.data[id].customOptions || {}) );
				fixColumnSizing('#psc_scorecard2_' + id + '_widget');
			}

			DDK.format($control);
			DDK.scorecard2.resize(id);

			DDK.control.init($control);
						
			if (!config || !config.columns) {
				if (count && DDK.eventHandler.sc2BuildColumns) {
					$control.find("[data-ddk-button-action=\"sc2BuildColumns\"]").click();
				}
			}
		}
		
		
		function initTable(id) {
			var $widget = $('#psc_table_' + id + '_widget'),
				$data = $('#psc_table_data_' + id),
				columns = jQuery.makeArray( $data.data('columns') ),
				source = $data.data('src'),
				count = $data.data('count'),
				height = $data.data('height'),
				fod = $data.data('fod'),
				qfe = $data.data('qfe') || "",
				fgi = $data.data('fgi'),
				ptype = $data.data('ptype'),
				ptc = $data.data('ptc'),
				pts = $data.data('pts'),
				md = $data.data('md'),
				ms = $data.data('ms'),
				fms = $data.data('fms'),
				fmt = $data.data('fmt'),
				qm = $data.data('qm') || "",
				sv = ($data.data('sv')? $data.data('sv').split("^") : ["'0','asc'"]),
				keywords = _.extend({}, _.string.parseQueryString(K("s_" + id + "_keywords") || ""), _.string.parseQueryString($widget.data("keywords") || "")),
				//sv = $data.data('sv') || ["'0','asc'"],
				sort = [],
				sortFav = (K("s_" + id + "_tsort")? K("s_" + id + "_tsort").split("^") : undefined),
				//sortFav = K("s_" + id + "_tsort") || undefined,
				sortArray = (sortFav? sortFav : (sv? sv : [])),
				options = {},
				server = false,
				beforeRender = (DDK.table.data[id] && DDK.table.data[id].query) ? DDK.table.data[id].query.beforeRender : undefined;

			for (var i = 0; i<sortArray.length; i+=1) {
				var s = sortArray[i].replace(DDK.regex.singleQuote, "").split(",");
				sort[i] = [parseInt(s[0],10),s[1]];
			}
			
			var displayLengthOptions = {
				"iDisplayLength": $widget.hasClass("ps-content-block") ? 100 : 25
			};

			var tableOptions = $.extend(true, {}, DDK.table.defaultOptions, {
				  "sScrollY": (($widget.hasClass("ps-content-row") || $widget.parents().hasClass("row") || DDK.modePDF) ? "" : height)
				, "aoColumns": columns
				, "aaData": DDK.table.data[id] && DDK.table.data[id].data ? DDK.table.data[id].data : []
				, "aaSorting": sort
			});

			var tableServerOptions = $.extend(true, {}, DDK.table.defaultOptions, DDK.table.serverOptions, {
				  "sScrollY": (($widget.hasClass("ps-content-row") || $widget.parents().hasClass("row") || DDK.modePDF) ? "" : height)
				, "sAjaxSource": source
				, "aoColumns": columns
				, "fnServerData": function ( url, data, callback, settings ) {
					//K($widget.data("keywords"));
					_.each(K.toObject(["v_", "p_"]), function (value, key) {
						data.push({ name: key, value: value });
					});
					if (qfe) {
						data.push({name: "table_query_fieldname_escapechar", value: qfe});
					}
					data.push({name: "table_metrics_static", value: ms});
					data.push({name: "table_metrics_dynamic", value: md});
					data.push({name: "table_keywords", value: $.param(keywords) });
					//data.push({name: "table_keywords", value: keywords });
					//_.forOwn(keywords, function (value, key) {
					//	data.push({ name: key, value: value });
					//});
					
					settings.jqXHR = $.ajax( {
						"url": url,
						"data": data,
						"success": function (json) {
							$(settings.oInstance).trigger('xhr', settings);
							callback( json );
			
							if ($widget.hasClass('ps-content-block')) {
								PSC_Table_Resize(id);
							} else if ( options.table.oSettings ) {
								options.table.fnAdjustColumnSizing();
							}

							fixColumnSizing('#psc_table_' + id + '_widget');
							//setTimeout( function() { addColumnFilters(id, true); }, 0);
							if (K("ddk.useVersion2Up") === "True") K("s_" + id + "_tsort", dtSortValue(settings));
						},
						"dataType": "json",
						"type": "POST",
						"cache": false,
						"error": function (xhr, error, thrown) {
							if ( error == "parsererror" ) {
								DDK.warn( "DataTables warning: JSON data from server could not be parsed. "+
									"This is caused by a JSON formatting error." );
							}
						}
					} );
				}
				, "aaSorting": sort
			});

			var tableServerJSONOptions = $.extend(true, {}, DDK.table.defaultOptions, DDK.table.JSONOptions, {
				  "sScrollY": (($widget.hasClass("ps-content-row") || $widget.parents().hasClass("row") || DDK.modePDF) ? "" : height)
				, "sAjaxSource": source
				, "aoColumns": columns
				, "fnServerData": function ( url, data, callback, settings ) {
					K($widget.data("keywords"));
					_.each(K.toObject(["v_", "p_"]), function (value, key) {
						data.push({ name: key, value: value });
					});
					settings.jqXHR = $.ajax( {
						"url": url,
						"data": data,
						"success": function (json) {
							$(settings.oInstance).trigger('xhr', settings);
							callback( json );
							fixColumnSizing('#psc_table_' + id + '_widget');
							//setTimeout( function() { addColumnFilters(id, true); }, 0);
							if (K("ddk.useVersion2Up") === "True") K("s_" + id + "_tsort", dtSortValue(settings));
						},
						"dataFilter": beforeRender,
						"dataType": "json",
						"type": "GET",
						"cache": false,
						"error": function (xhr, error, thrown) {
							if ( error == "parsererror" ) {
								DDK.warn( "DataTables warning: JSON data from server could not be parsed. "+
									"This is caused by a JSON formatting error." );
							}
						}
					} );
				}
				, "aaSorting": sort
			});

			DDK.table.data[id] = DDK.table.data[id] || {};

			options = $.extend(true, DDK.table.data[id], {
				height: height,
				fod: fod,
				fgi: fgi,
				ptype: ptype,
				ptc: ptc,
				pts: pts,
				md: md,
				ms: ms,
				fms: fms,
				fmt: fmt
			});

			if (options && typeof options.ptype === "string") {
				if (
						(DDK.outputPDF) ||
						(	(count < options.ptc)
						 && (count < options.pts)
						 && (options.ptype.toLowerCase() !== "client")
						 && (options.ptype.toLowerCase() !== "server")
						 && (count < 5000)
						) ||
						(	(options.ptype.toLowerCase() === "none")
						 && (count < 5000)
						)
				) {
					options.table = $('#' + id).dataTable( $.extend(true, tableOptions, DDK.table.data[id].customOptions || {}) );
					if (!DDK.outputPDF) {
						fixColumnSizing('#psc_table_' + id + '_widget');
						setTimeout( function() { addColumnFilters(id); }, 0);
						//PSDDK-280: Allow users to Save the Sorting done on the Table Control
						if (K("ddk.useVersion2Up") === "True") addDTSortListener(id);
					}
				} else if (
					   ((count < options.pts) || (options.ptype.toLowerCase() == 'client'))
					&& (options.ptype.toLowerCase() !== 'server')
					&& (count < 5000)
				) {
					options.table = $('#' + id).dataTable( $.extend(true, tableOptions, displayLengthOptions, DDK.table.clientOptions, DDK.table.data[id].customOptions || {}) );
					fixColumnSizing('#psc_table_' + id + '_widget');
					setTimeout( function() { addColumnFilters(id); }, 0);
					//PSDDK-280: Allow users to Save the Sorting done on the Table Control
					if (K("ddk.useVersion2Up") === "True") addDTSortListener(id);
				} else {
					server = true;
					if (qm === "json" || qm === "xml") {
						options.table = $('#' + id).dataTable( $.extend(true, tableServerJSONOptions, displayLengthOptions, DDK.table.data[id].customOptions || {}) );
					} else {
						options.table = $('#' + id).dataTable( $.extend(true, tableServerOptions, displayLengthOptions, DDK.table.data[id].customOptions || {}) );
					}
					//setTimeout( function() { addColumnFilters(id); }, 0);
				}
			}

			/* Add Events for UI-friendly column-specific text search inputs */
			$('#psc_table_' + id + '_filter_global_input').val(options.fgi);

			$('#psc_table_' + id + '_filter_global_input').focus( function () {
				if ( this.className == 'ps-filter' ) {
					this.value = '';
				}
				this.className = 'ps-filter ps-filter-active ps-filter-focus';
			} );

			$('#psc_table_' + id + '_filter_global_input').blur( function () {
				if ( this.value == '' ) {
					this.className = 'ps-filter';
					this.value = options.fgi;
				} else {
					this.className = 'ps-filter ps-filter-active';
				}
			} );

			DDK.control.init($widget);
		}

		var defaultTreeOptions = {
			"types" : {
				"types" : {
					"organization" : {
						"icon" : {
							"image" : (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/tree/Organization_16.png"
						}
					},
					"contact" : {
						"icon" : {
							"image" : (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/tree/Contact_16.png"
						}
					},
					"category" : {
						"icon" : {
							"image" : (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/tree/Category_16.png"
						}
					},
					"metric" : {
						"icon" : {
							"image" : (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/tree/Metric_16.png"
						}
					},
					"location" : {
						"icon" : {
							"image" : (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/tree/Location_16.png"
						}
					}
				}
			},
			"search": {
				"show_only_matches" : true
			},
			"plugins" : [ "themes", "search", "types" ]
		};

		function initTree(id) {
			var $widget = $('#psc_tree_' + id + '_widget'),
				$data = $('#psc_tree_data_' + id),
				source = $data.data('src'),
				count = $data.data('count'),
				ptype = $data.data('ptype'),
				menuEnabled = $data.data("nme"),
				menuDefaultEnabled = $data.data("nmde"),
				nodesSearch = $data.data("ns"),
				nodesSearchText = $data.data("nst"),
				nodesOpen = $data.data("no"),
				nodesLoad = $data.data("nl"),
				queryMode = $data.data("qm"),
				queryGetMode = $data.data("qgm"),
				onselectEnabled = $data.data("nose"),
				nodesSelect = (DDK.tree.data[id] && DDK.tree.data[id].nodes) ? DDK.tree.data[id].nodes.onselect : "",
				data = DDK.tree.data[id] ? DDK.tree.data[id].data : "",
				$search = $("#" + id + "Search"),
				$searchLabel = $("#"+id+"SearchCount"),
				items,
				options = {},
				format,
				nodesSort = $("#"+id+"Sort").find("a[checked]").attr("value") || "node_label",
				nodesCreate = (DDK.tree.data[id] && DDK.tree.data[id].nodes && DDK.tree.data[id].nodes.menu && DDK.tree.data[id].nodes.menu.defaultOptions) ? DDK.tree.data[id].nodes.menu.defaultOptions.createOption : "",
				nodesRename = (DDK.tree.data[id] && DDK.tree.data[id].nodes && DDK.tree.data[id].nodes.menu && DDK.tree.data[id].nodes.menu.defaultOptions) ? DDK.tree.data[id].nodes.menu.defaultOptions.renameOption : "",
				nodesDelete = (DDK.tree.data[id] && DDK.tree.data[id].nodes && DDK.tree.data[id].nodes.menu && DDK.tree.data[id].nodes.menu.defaultOptions) ? DDK.tree.data[id].nodes.menu.defaultOptions.deleteOption : "",
				nodesClick = (DDK.tree.data[id] && DDK.tree.data[id].nodes) ? DDK.tree.data[id].nodes.onclick : "",
				queryUrl = $data.data("url"),
				beforeRender = (DDK.tree.data[id] && DDK.tree.data[id].query) ? DDK.tree.data[id].query.beforeRender : "";

			DDK.tree.data[id] = DDK.tree.data[id] || {};
			$.extend(true, options, DDK.tree.defaultOptions);
			$.extend(true, options.types.types, DDK.tree.data[id] && DDK.tree.data[id].nodes ? DDK.tree.data[id].nodes.types : {});

			if(onselectEnabled){
				options.plugins.push("ui");
			}
			if(menuDefaultEnabled){
				options.plugins.push("crrm");
			}
			if(queryMode == "json"){
				format = "json_data";
			}
			else{
				format = "xml_data";
			}
			options.plugins.push(format);
			if(DDK.tree.data[id].customPlugins){	// combines the plugins with the custom plugins
				$.merge(options.plugins, DDK.tree.data[id].customPlugins);
			}
			if(menuEnabled){
				items = DDK.tree.data[id] && DDK.tree.data[id].nodes && DDK.tree.data[id].nodes.menu ?
						DDK.tree.data[id].nodes.menu.items : {};
				options.plugins.push("contextmenu"); // add contextmenu if enabled
				if(menuDefaultEnabled){
					$.extend(true, options, {
						"contextmenu": {
							"items": items
						}
					});
				}
				else{
					// if crrm is not enabled, overwrite the default items (crrm) in contextmenu
					$.extend(true, options, {
						"contextmenu": {
							"items": function ($node) {
								return items;
							}
						}
					});
				}
			}
			options[format] = {};
			//ajax loading url
			$.extend(true, options[format], {
	//			"xml_data" : {
					"ajax" : {
						"complete": function(jqXHR, textStatus){
							if (typeof DDK.tree.data[id].customAjaxComplete === "function") {
								DDK.tree.data[id].customAjaxComplete.call(this, name, id);
							}
							hideMask("psc_tree_" + id + "_widget");
							//triggers the search to filter tree for client side only
							if(queryMode == "basic" || (ptype != "server" && queryGetMode == "all")){
								$search.keyup();
							}
							setTimeout(function(){	//uses timeout for IE8 because of slow browser render
								var searchCount = $(".jstree-search", "#"+id).length;
								//Add count of found nodes on id match
								searchCount += $("#"+id).find("li[id*='" + $search.val() + "']").length;
								// Displays result text
								if($search.val()){
									if(nodesSearchText){
										var key = /~recCount~/g;
										$searchLabel.text(nodesSearchText.replace(key, searchCount));
									}
									else{
										$searchLabel.text("Found "+ searchCount + " object(s)");
									}
								}
								else{
									$searchLabel.text("");
								}
							}, 200);
						},
						"url" : queryMode == "json" || queryMode == "xml" ? queryUrl : source ? source.replace(/'/g, "%27").replace(/\+/g, "%2b") : "",
						"dataFilter" : beforeRender,
						"data" : function (node) {
							var nodeId = '', tempOpen;
							if(node !== -1){
								nodeId = node.attr("id");
							}
							//clear nodesOpen to only use it once
							tempOpen = nodesOpen;
							nodesOpen = "";
							return {
								tree_nodes_load : nodesLoad,
								tree_nodes_open: tempOpen,
								tree_nodes_id : nodeId,
								tree_nodes_search : nodesSearch,
								p_tree_sort: nodesSort
							};
						}
					}
	//			}
			});

			DDK.tree.data[id].tree = $("#" + id).jstree($.extend(true, {}, options, DDK.tree.data[id].customOptions || {}))
				.on("select_node.jstree", nodesSelect)
			if(nodesClick){
				DDK.tree.data[id].tree.on("click", "a", nodesClick);
			}
			//})).on("click", "a", nodesSelect);
			// Add functions of the menu default item in tree
			DDK.tree.data[id].tree
				.bind("create.jstree", nodesCreate)
				.bind("rename.jstree", nodesRename)
				.bind("remove.jstree", nodesDelete)
				.bind("loaded.jstree", function(event, data){
					DDK.tree.resize($(event.currentTarget).attr("id"));
				})
				.bind("refresh.jstree", function(e){
					var $tree = $(e.currentTarget);
					if($tree.find("li").length === 0 && !nodesSearch){
						DDK.tree.reload($tree.attr("id"), DDK.tree.data[$tree.attr("id")].callback);
					}
				});
			// Set the search string in option widget in text box
			$search.val(nodesSearch);
			$search.on("keyup", function(e){
				var c = e.which ? e.which : e.keycode;
				if(!(c == 9 ||				//tab
					(c > 15 && c < 21) ||			//shift, ctrl, alt capslock
					c == 27 || c == 91 ||		//escape and window key
					(c > 33 && c < 41) ||			//pgup, pgdown, end, home, nav arrows
					c == 44 || c == 45 ||		//printscreen, pause
					(c > 111 && c < 124) ||	//f1-f12
					c == 255						//Fn Key
				)) {
					delay(function(){
						if(DDK.tree.data[id].tree && DDK.tree.data[id].tree.length > 0){
							if(queryMode == "basic" || (ptype != "server" && queryGetMode == "all") || queryMode == "json"  || queryMode == "xml"){
								DDK.tree.data[id].tree.jstree("search", $search.val());
								c && $search.val() == "" ? DDK.tree.data[id].tree.jstree("close_all") : "";
								var searchCount = $(".jstree-search", "#"+id).length;
								// Displays result text
								if($search.val()){
									if(nodesSearchText){
										var key = /~recCount~/g;
										$searchLabel.text(nodesSearchText.replace(key, searchCount));
									}
									else{
										$searchLabel.text("Found "+ searchCount + " object(s)");
									}
								}
								else{
									$searchLabel.text("");
								}
							}
							else{
								if($search.val().length > 2 || $search.val().length == 0){
									c && $search.val() == "" ? DDK.tree.data[id].tree.jstree("close_all") : "";
									nodesSearch = $search.val();
									K("s_"+id+"_ns", nodesSearch);
									showMask("psc_tree_" + id + "_widget");
									DDK.tree.refresh(id);
								}
								else{
									$searchLabel.text("");
									$.jGrowl("Please enter 3 characters or more to filter the tree");
								}
							}
						}
					}, 500);
				}
			});
			//Tree refresh button
			$("#"+id+"Refresh").button().on("click", function(){
				showMask("psc_tree_" + id + "_widget");
				DDK.tree.refresh(id)
			});
			//Tree sort buttonset
			/*$("#"+id+"Sort").buttonset().find("input:radio").on("click", function(){
				nodesSort = $(this).val();
				K("s_"+id+"_nso", nodesSort);
				DDK.tree.refresh(id)
			});
			*/
			DDK.dropdown.init($("#"+id+"Sort"));
			$("#"+id+"Sort").on("click", "dd a", function(){
				nodesSort = $(this).attr("value");
				K("s_"+id+"_nso", nodesSort);
				DDK.tree.refresh(id)
			});
			//Tree collapse button
			$("#"+id+"Collapse").button().on("click", function(){
				DDK.tree.data[id].tree.jstree("close_all");
			});
			//Tree expand button
			$("#"+id+"Expand").button().on("click", function(){
				if((ptype == "server" || (queryMode == "tsql" && queryGetMode != "all"))){
					if(confirm("Tree is in server mode, are you sure you want to expand all nodes?")){
						DDK.tree.data[id].tree.jstree("open_all");
					}
				}
				else{
					DDK.tree.data[id].tree.jstree("open_all");
				}
			});

			DDK.control.init($widget);
		}

		function resizeChartDatatable($table, $map, isVertical) {
			var $rows = $table.find("tr"),
				$dataRows = $rows.slice(1),
				$areas = $map.find("area[tablemarker]").reverse(),
				areasCount = $areas.size(),
				$nameCells = $rows.find("td:first-child"),
				$dataCells = $rows.find("td:not(:first-child)"),
				$chartDataCells = $rows.slice(1).find("td:not(:first-child)"),
				seriesCenters = [],
				seriesCenterSpacing,
				firstSeriesSpacing,
				dataCellWidth,
				nameCellWidth,
				coords;

			if (!isVertical) {
				$table.width("100%");
			} else {
				if (areasCount === 1) {
					firstSeriesSpacing = $areas.attr("coords").split(",")[0];
					seriesCenterSpacing = Math.max(100, firstSeriesSpacing - 200);
				} else {
					$areas.each(function(index, elem) {
						var $this = $(this),
							center = $this.attr("coords").split(",")[0];

						seriesCenters.push(center);
					});

					// calculate seriesCenterSpacing (equal to the distance between series center points)
					// and firstSeriesSpacing (equal to the location of the first series center point)
					seriesCenterSpacing = Math.floor(seriesCenters[1] - seriesCenters[0]);
					firstSeriesSpacing = Math.floor(seriesCenters[0]);

					// console.log(firstSeriesSpacing, seriesCenterSpacing);

				}

				dataCellWidth = seriesCenterSpacing - 1; // -1 for the border
				nameCellWidth = firstSeriesSpacing - Math.floor(seriesCenterSpacing / 2) - parseInt($nameCells.css("padding-left")) - parseInt($nameCells.css("padding-right"));
				$dataCells.width(dataCellWidth).find("span").width(dataCellWidth);
				$nameCells.width(nameCellWidth).find("span:first-child").width(nameCellWidth - 16);

				$dataCells.each(resizeTableCellText);
				$nameCells.each(resizeTableCellText);
			}
		}

	function resizeTableCellText(index, elem) {
		var $elem = $(elem),
			childCount = $elem.children().size(),
			height = $elem.height(),
			width = $elem.width(),
			text = $elem.text(),
			textLength = text.length,
			maxTextWidth = Math.max(width - (childCount * 2), 1),
			maxTextHeight = Math.max(height - 4, 1),
			minTextHeight = 8,
			fontFamily = $elem.css("font-family").replace(/ /g, "").replace(/-/g, "").split(",").pop();

		// console.log(index, elem, height, maxTextHeight)
		$elem.css({
			"font-size": Math.max(Math.floor(Math.min(maxTextHeight, maxTextWidth * 13 / DDK.util.stringWidth(text, fontFamily) )), minTextHeight) + "px",
			"line-height": height + "px"
		});
	}

		function initChart(id) {
			var $widget = $('#psc_chart_' + id + '_widget'),
				$data = $('#psc_chart_data_' + id),
				$table = $widget.find("#" + id + "_datatable"),
				$map = $widget.find("#" + id + "_imageImageMap"),
				height = $data.data('height'),
				width = $data.data('width'),
				fod = $data.data('fod'),
				scp = $data.data('scp'),
				lp = $data.data('lp'),
				are = $data.data('are'),
				md = $data.data('md'),
				ms = $data.data('ms'),
				chartType = (((typeof $data.data("type") === "string") && $data.data("type")) ? $data.data("type") : "column"),
				isVertical = (chartType.indexOf("pie") === -1) && (chartType.indexOf("doughnut") === -1) && (chartType.indexOf("bar") === -1),
				options = {};

			DDK.chart.data[id] = DDK.chart.data[id] || {};
			
			// setup and UpdateImage function for each chart
			// Apply the chart id through _.partial
			// Throttle image replacement via _.throttle
			DDK.chart.data[id].updateImage = _.throttle(_.partial(DDK.chart.updateImage, id), 500, { leading: false, trailing: true });


			options = $.extend(true, DDK.chart.data[id], {
				height: height,
				width: width,
				fod: fod,
				scp: scp,
				lp: lp,
				are: are,
				md: md,
				ms: ms
			});

			$table.size() && isVertical && DDK.chart.resizeDatatable($table, $map, isVertical);

			$widget.find("div[data-role=\"chart\"] label").click(id, DDK.chart.setType);

			$('#psc_chart_' + id + '_series_config > div > button').button( { icons: { primary: 'ui-icon-gear' }, text: false } );
			$('#psc_chart_' + id + '_series_config > div:not(.ps-chart-autorefresh)').buttonset();

			$('#psc_chart_' + id + '_series_config_options_refresh').button( { icons: { primary: 'ui-icon-arrowrefresh-1-e' }, text: false } ).click(function() {
				PSC_Chart_Resize(id, true);
			});

			$('#psc_chart_' + id + '_series_config_options_auto').button();

			$('#psc_chart_' + id + '_series_config > div.ps-chart-autorefresh > label > span.ui-button-text').css({'font-size': '10px', 'line-height': '17px'});

			DDK.control.init($widget);
		}


		function deleteFavorite(e) {
			var $this = $(this),
				$dialog = $this.closest(".ps-tooltip-dialog"),
				data = $dialog.data(),
				spinner = "<img class=\"ddk-wait\" src=\"" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/spinner_16x16.gif\" alt=\"Saving...\" />",
				name = data.ddkControlName,
				id = data.ddkControlId,
				record = (data.ddkFavorite.id || 0);

			K("fav_delete_id", record);

			$(spinner).insertAfter($this);

			load("", "PSC_Favorites_Comp_Toolbar_Delete", function(data){
				// console.log(response);
				if (data === "ok") {
					PSC_Reload(name, id);
				} else {
					$this.nextAll("img").remove();
					$this.addClass( 'ddk-state-error', 10, function() {
						setTimeout(function() { $this.removeClass( 'ddk-state-error', 20 ); }, 50);
					});
				}
			});
		}

		function updateFavoriteValue(e) {
			var $this = $(this),
				$dialog = $this.closest(".ps-tooltip-dialog"),
				data = $dialog.data(),
				spinner = "<img class=\"ddk-wait\" src=\"" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/spinner_16x16.gif\" alt=\"Saving...\" />",
				name = data.ddkControlName || K("v_content_type") || "",
				id = data.ddkControlId || "content",
				record = data.record || this.value || K("s_content_fid") || 0,
				stateKeys = (K.toURL("s_" + id + "_") + "&" + K.toURL("p_")).split("&"),
				favValue = "";

			_.each(stateKeys, function (value, index) {
				if (_.string.startsWith(value, "s_" + id + "_fid") ||
					_.string.startsWith(value, "s_" + id + "_fuid") ||
					_.string.startsWith(value, "s_" + id + "_fdesc") ||
					_.string.startsWith(value, "s_" + id + "_flab")) {
					// ignore this state keyword in favorite values
				} else if (value) {
					favValue += "&" + value;
				}
			});

			K({
				record: record,
				value: favValue
			}, "ddk_fav_");
			
			K({
				id: id
			}, "fav_comp_");

			$(spinner).insertAfter($this);

			load("", "PSC_Favorites_Comp_FavBar_Value_Update", function(data){
				// console.log(response);
				if (data === "ok") {
					PSC_Reload(name, id);
				} else {
					$this.nextAll("img").remove();
					$this.addClass( 'ddk-state-error', 10, function() {
						setTimeout(function() { $this.removeClass( 'ddk-state-error', 20 ); }, 50);
					});
				}
			});
		}

		function writeFavoriteChanges(e) {
			var $this = $(this),
				$dialog = $this.closest(".ps-tooltip-dialog"),
				data = $dialog.data(),
				fav = data.ddkFavorite || {},
				loadFavorite = e.data,
				spinner = "<img class=\"ddk-wait\" src=\"" + (oldIE ? fullPath : "") + "resources/ddk/" + DDK_PATH + "/imgs/spinner_16x16.gif\" alt=\"Saving...\" />",
				$label = $dialog.find(".ddk-fav-label"),
				name = data.ddkControlName,
				id = data.ddkControlId,
				record = ((data.ddkFavorite && data.ddkFavorite.id) || 0),
				favOptions = {
					label: ($label.length > 0 ? $label.val() : (fav.label || "")),
					description: $dialog.find(".ddk-fav-desc").val() || fav.description || "",
					sort: $dialog.find(".ddk-fav-sort").val() || fav.sort || 200,
					color: $dialog.find(".ddk-color").val() || fav.color || "",
					isPersonalDefault: $dialog.find(".ddk-fav-default").prop("checked") || false,
					isGroupDefault: $dialog.find(".ddk-fav-group-default").prop("checked") || false,
					isPublished: ($dialog.find(".ddk-fav-published").length > 0 ? $dialog.find(".ddk-fav-published").prop("checked") : Boolean($dialog.find(".ddk-group").val())),
					group: ($dialog.find(".ddk-group").length > 0 ? $dialog.find(".ddk-group").val() : ($dialog.find(".ddk-fav-published").data("group") || "")),
					icon: $dialog.find(".ddk-fav-icon input:checked").val() || fav.image || ""
				},
				filterValue = $('#psc_fav_comp_toolbar_input_filter_' + id).val();
			;

			// console.log(data);

			favOptions.description = (favOptions.description === "Enter a description") ? "" : favOptions.description;

			if (favOptions.label && (favOptions.label !== "Enter a name")) {
				K({
					id: id,
					name: name,
					record: record,
					label: favOptions.label,
					desc: favOptions.description,
					sort: favOptions.sort,
					color: favOptions.color,
					pd: favOptions.isPersonalDefault,
					gd: favOptions.isGroupDefault && favOptions.isPublished,
					pub: favOptions.isPublished,
					group: favOptions.group,
					icon: favOptions.icon
				}, "fav_comp_");

				K({
					name: name,
					id: id
				}, "component_");

				if (!record) {
					K({
						//hd: favOptions.label,
						//hdt: favOptions.description,
						fod: "false",
						f: filterValue
					}, "s_" + id + "_", { silent: true });
				}

	//			$(spinner).insertAfter($this);
				//use mask to avoid duplicate save
				showMask($this.parent().attr("id"));
				// flush state keywords handling the active favorite
				K.flush("s_" + id + "_fid");
				K.flush("s_" + id + "_fuid");
				K.flush("s_" + id + "_fdesc");
				K.flush("s_" + id + "_flab");

				// console.log(K.toObject("fav_comp_"));
				load("", "PSC_Favorites_Comp_Toolbar_Update", K.toObject("s_" + id), function(data){
					var response = data.split(",");
					// console.log(response);
					if (response[1] === "ok") {
						if (loadFavorite && parseInt(response[0]) > 0) {
							// reset state keywords handling the active favorite
							K({
								fid: response[0],
								fuid: K("sec.username"),
								fdesc: favOptions.description,
								flab: favOptions.label
							}, "s_" + id + "_");
							// K("s_" + id + "_fid", response[0]);
						}
						if (PS.app && PS.app.forceReload) {
								PS.app.forceReload();
						}
						DDK[name].reload(id);
					} else {
						$this.nextAll("img").remove();
						$this.addClass( 'ddk-state-error', 10, function() {
							setTimeout(function() { $this.removeClass( 'ddk-state-error', 20 ); }, 50);
						});
					}
				});

			} else {
				$label.addClass( 'ddk-state-error', 10, function() {
					setTimeout(function() { $label.removeClass( 'ddk-state-error', 20 ); }, 50);
				});
			}
		}

		function displayDialog($dialog, $this) {
			if ($dialog.hasClass("ps-hidden")) {
				$dialog
					.appendTo("body")
					.removeClass("ps-hidden")
					.position({
						my: "left top",
						at: "left bottom",
						of: $this,
						offset: "-9 3"
					})
				;
			} else {
				$dialog
					.addClass("ps-hidden")
					.insertAfter($this)
				;
			}
		}

		function initColorPicker(e) {
			var $this = $(this),
				$dialog = $this.closest(".ps-tooltip-dialog"),
				$target = $("#" + $this.data("target"))
			;

			$this
				.addClass("loaded")
				.focusout(function() {
					if (this.value === "") {
						$this.css("background", "").css("color", "#000");
					}
				})
			;
			$target
				.removeClass("ps-hidden")
				/* .appendTo("body") */
				.farbtastic($this)
				.position({ my: "left top", at: "right top", of: $this, offset: "8 0", collision: "fit" })
			;

		}
		
		function makeDialog2($elem, settings) {
			var $dialog;
			
			settings = _.extend({
				title: ""
			}, settings.defaults);
			
			$dialog = $("<div>" + settings.content + "</div>");
			
			return $dialog.dialog(settings.passthrough);
		}		
		
		function dialog2(e) {
			var $this = $(this),
				data = $this.data(),
				dialog = data.dialog,
				$dialog = data.$dialog,
				settings = DDK.dialogs[dialog];
			
			// dialog2 settings are an object
			// {
			// 		content: ..., // html content to be rendered in dialog body
			//		defaults: {}, // default settings passed to dialog creation function
			//		passthrough: {} // settings passed into $.fn.dialog()
			// }

			if (!$dialog) {
				// create a new dialog
				$dialog = makeDialog2($this, settings)
				
				// cache a reference to the new dialog
				$this.data("$dialog", $dialog);
			}
			
			if ($dialog.dialog("isOpen")) {
				$dialog.dialog("moveToTop");
			} else {
				$dialog.dialog("open");
			}
		}

		function dialog(e) {
			var $this = $(this),
				data = $this.data(),
				dialogType = data.ddkDialog,
				target = data.target,
				metrics,
				filterValue,
				options = DDK.dialog[dialogType],
				$parentDialog,
				$dialog,
				$control,
				controlIdParts,
				controlId,
				controlName,
				controlData;

			if (target) {
				$control = $("[id$=\"" + target + "_widget\"]");
				controlData = $control.controlData();
				metrics = controlData.ddkMetrics;
				filterValue = controlData.ddkFilterValue;
			} else {
				metrics = $this.closest(".ps-toolbar").data("ddk-metrics");
				filterValue = $this.closest(".ps-toolbar").data("ddk-filter-value");
			}

			if (options) {

				$("body").children("div.ps-tooltip-dialog" + (options.dlgSecondary ? "-secondary" : "")).not(".ddk-dialog-persist").remove();

				if (options.dlgSecondary) {
					$parentDialog = $this.closest(".ps-tooltip-dialog");
					$.extend(true, data, $parentDialog.data());
					data.ddkParentClickedButton = data.ddkClickedButton;
					data.ddkDialog = dialogType;
					// console.log(data, $parentDialog.data());
				} else {
					$control = $control || $this.closest("div[id^=\"psc_\"][id$=\"_widget\"]");
					if ($control.size()) {
						controlIdParts = $control.attr("id").split("_");
						controlId = controlIdParts[2];
						controlName = controlIdParts[1];

						data.ddkMetrics = metrics;
						data.ddkControlId = controlId;
						data.ddkControlName = controlName;
						data.ddkFilterValue = filterValue;
					}
				}

				data.ddkClickedButton = $this;

				$dialog = $(renderDialog(options))
					.data(data)
					.appendTo("body")
					.position({
						my: "left top",
						at: "left bottom",
						of: $this,
						offset: "-9 3",
						collision: "fit"
					})
					.css("z-index", $.topZ())
					.find("button")
						.each(makeButton)
						.end()
					.find("button.cancel, button[data-ddk-button=\"Cancel\"]")
						.click(function() {
							var $this = $(this),
								$dialog = $this.closest("div.ps-tooltip-dialog");

							$dialog.remove();
						})
						.end();

				if (typeof options.dlgInit === "function") {
					options.dlgInit($dialog);
				}
			}
		}

		function renderDialog(options) {
			var out = "",
				buttons,
				buttonCount,
				i,
				buttonFloat;

			// begin dialog
			out += "<div class=\"ps-tooltip-dialog " + (options.dlgSecondary ? "ps-tooltip-dialog-secondary " : "") + "ui-corner-all ui-state-focus ddk-dialog ";
			out += (options.dlgClassName || "") + (options.dlgConfirm ? " ddk-dialog-confirm " : "") + " \" " + (options.dlgAttr || "");
			out += " >";
			// begin title
			out += "<div id=\"ddk_" + (options.dlgSecondary ? "secondary_" : "") + "dialog_header\" class=\"ddk-dialog-header ui-helper-clearfix\">";
			if (!options.dlgConfirm) {
				out += "<div style=\"float: right;\" data-role=\"ui-icon-close\">";
				out += "<button class=\"cancel ui-priority-secondary\">Cancel</button>";
				out += "</div>";
			}
			out += "<div class=\"ddk-dialog-title ui-priority-primary\">";
			if (options.dlgIcon) {
				out += "<span class=\"ui-icon " + options.dlgIcon + "\"></span>";
			}
			out += "<span id=\"ddk_" + (options.dlgSecondary ? "secondary_" : "") + "dialog_title\">";
			if (options.dlgTitle) {
				out += options.dlgTitle;
			}
			out += "</span>";
			out += "</div>";
			out += "<div class=\"ddk-dialog-title ddk-dialog-subtitle ui-priority-secondary\">";
			out += "<span id=\"ddk_" + (options.dlgSecondary ? "secondary_" : "") + "dialog_subtitle\">";
			if (options.dlgSubitle) {
				out += options.dlgSubtitle;
			}
			out += "</span>";
			out += "</div>";
			out += "</div>";
			// end title

			// begin content
			out += "<div id=\"ddk_" + (options.dlgSecondary ? "secondary_" : "") + "dialog_content\" class=\"ddk-dialog-content ui-helper-clearfix\">";
			if (options.dlgContent) {
				out += options.dlgContent;
			}
			out += "</div>";
			// end content

			// begin footer
			if (options.dlgButtons) {
				out += "<div id=\"ddk_" + (options.dlgSecondary ? "secondary_" : "") + "dialog_footer\" class=\"ddk-dialog-separator ddk-dialog-footer ui-helper-clearfix\">";
				buttons = options.dlgButtons.split(" ");
				buttons = _.filter(buttons, function(value, index) {
					value.indexOf("_") === 0;
				}).concat(_.reject(buttons,  function(value, index) {
					value.indexOf("_") === 0;
				}).reverse());

				buttonsCount = buttons.length;
				for (i = 0; i < buttonsCount; i += 1) {
					button = buttons[i];
					if (button.indexOf("_") === 0) {
						buttonFloat = "left";
						button = button.slice(1);
					} else {
						buttonFloat = "right";
					}
					out += "<button data-ddk-button=\"" + button + "\" " + /* (button === "OK" ? "class=\"ui-priority-primary\"" : "") + */ (button === "Cancel" ? "class=\"ui-priority-secondary\"" : "") + " style=\"float: " + buttonFloat + ";\">" + button.replace(/_/g, " ") + "</button>";
				}
				out += "</div>";
			}
			// end footer

			out += "</div>";
			// end dialog

			return out;
		}

		// modified in DDK 1.9.2 final to accept a generic selector that may be an element or a jQuery collection as well as an id
		// 1.9.3 - selection expands to match an entire control if possible (bug where DataTables footers weren't getting formatted because they are in a separate table)
		function formatSpans(selector) {
			var $selection = $(selector), $control = $("[id^=\"psc_\"][id$=\"_widget\"]");
			//console.log("SelectionSize: ", $selection.size()); 
			if (!$selection.size()) { $selection = $("#" + selector); }
			if (!$selection.size() && $control.size()) { $selection = $control; }

			DDK.log("formatSpans:", $selection.find("span[data-format]:visible"));

			$selection.find("span[data-format]:visible").each(function() {
				var $this = $(this),
					formatOptions = $this.data("format"),
					formatType = (formatOptions.type || formatOptions); // support initial prototype API of data-format="formatType" as well as new API of data-format="{...JSON String...}"

				if (typeof DDK.format[formatType] === "function") {
					DDK.format[formatType]($this, formatOptions);
					$this.removeAttr("data-format");
				}
				DDK.log("DDK.format ", " selector: ", selector, " element: ", $this[0], " formatType: ", formatType, " formatOptions: ", formatOptions);
			});
		}
		var controlQueue = [],
			isLoading = false;

		function loadControls(controls) {
			if (!controls) { 
				DDK.warn("loadControls: no controls found");
				return;
			}
			
			DDK.log("Queue controls (loadControls): " + JSON.stringify(controls));
			
			// mask all controls at queue time
			// they will be unmasked on initialization
			if (_.isPlainObject(controls)) {
				$("#psc_" + controls.name + "_" + controls.id + "_widget").am("showmask");
			} else {
				_.each(controls, function (control) {
					$("#psc_" + control.name + "_" + control.id + "_widget").am("showmask");
				});
			}

			controlQueue = controlQueue.concat(controls);
			
			if (!isLoading) {
				isLoading = true;
				//$("body").prepend("<div style='width: 700px; height: 100px;'>" + JSON.stringify(controlQueue) + "</div>");
				loadControlQueue();
			}
		}

		function loadControlQueue() {
			var control = controlQueue.shift();
			if (control) { DDK.log("Load control from queue (loadControlQueue): " + control.name + " " + control.id); }

			DDK.reloadControl(control.name, control.id, function() {
				if (controlQueue.length) {
					setTimeout(loadControlQueue, 0);
				} else {
					isLoading = false;
					setTimeout(pdfGo, DDK_PDF_WAIT);
				}
			});
		}

		function pdfGo() {
			//console.log(DDK.outputPDF, isLoading, (!isLoading && DDK.outputPDF));
			//if (!isLoading && DDK.outputPDF) {
			if (DDK.outputPDF && (!isLoading)) {
				setTimeout(function(){
					$("#ddk_page_header").remove();
					$("#ddk_page_content").children().unwrap();
					
					$("[id^=\"layout_\"]").not("[id^=\"layout_header\"], [id^=\"layout_footer\"]").each(function (index, elem) {
						$(elem).children().unwrap();
					});
					$(document).find(".dataTables_wrapper").convertToHtmlTable();
					$(document).find("table").breakTableByHeight();
					$(document).find("table").breakTableByWidth();
					$(document).expandControlTableParents()
			
					window.ABCpdf_go = true;
					//console.log("pdf output");
				}, DDK_PDF_WAIT);
			}
		}

		function initControls($target) {
			DDK.defer(function () {
				if (!$target) {
					$target = $(document);
				}
				
				$target.findControls().initControls();
			});
		}
		
		function initControl($control) {
			var controlContainerId = $control.attr("id"),
				controlContainerIdParts = (controlContainerId ? controlContainerId.split("_") : []),
				controlName = controlContainerIdParts[1],
				controlId = controlContainerIdParts[2],
				controlData = controlName && controlId && DDK[controlName].data[controlId];

			DDK.log("Initialize control (initControl): " + controlName + " " + controlId);

			$control.find("button, input[type=\"radio\"]").each(makeButton);
			$control.find(".ddk-buttonset").buttonset();
			$control.find("button.ps-filter-bar").on("mouseenter mouseleave", function() {
				$(this).toggleClass('ui-priority-secondary ps-filter-bar-border');
			});
			//$control.find("[data-ddk-mouseover]").on("mouseenter mouseleave", DDK.mouseover);
			if (!DDK.outputPDF) {
				$control.find("[data-ddk-mouseover]").each(DDK.mouseover);
			}

			if (controlData && typeof controlData.customInit === "function") {
				controlData.customInit.call(this, controlName, controlId);
			}
		}

		function eventHandler(e) {
			var $this = $(this),
				data = $this.data(),
				buttonAction = data.ddkButtonAction,
				$control = $(e.currentTarget).parentControl(),
				controlData = $control.controlData();

			$.extend(true, data, controlData, {
				$this: $this
			});
			DDK.eventHandler[buttonAction](e, data);
		}

		function validate(e) {
			var $this = $(this),
				data = $this.data(),
				validateType = data.ddkValidate,
				originalValue = $this.val(),
				validatedValue = DDK.validate[validateType](originalValue);

			if (originalValue !== validatedValue) {
				$this.val(validatedValue).addClass( 'ddk-state-error', 10, function() {
					setTimeout(function() { $this.removeClass( 'ddk-state-error', 20 ); }, 50);
				})
			}
		}

		var defaultMouseoverOptions = {
			position: {
				adjust: {
					mouse: true,
					x: 15,
					y: 5
				},
				target: "mouse"
			},
			show: {
				effect: false
			},
			style: {
				classes: "ui-tooltip-bootstrap ui-tooltip-shadow ui-tooltip-rounded",
				tip: {
					corner: false
				}
			}
		};

		function mouseover(index, elem) {
			var $this = $(elem),
				mouseoverOptions = DDK.mouseover[$this.data("ddkMouseover")];

			if (mouseoverOptions) {
				$this.qtip($.extend(true, {}, defaultMouseoverOptions, mouseoverOptions));
			}
		}

		function dropdownInit(selector, callback){
			var $dd;
			if(typeof selector === "object"){
				$dd = selector;
			}
			else if(typeof selector === "string"){
				$dd = $(selector);
			}
			else{
				$dd = $(".ddk-dropdown");
			}
			$dd.each(function(){
				var $this = $(this),
					$options = $this.find("dd ul li"),
					$defaultOption = $options.find("[checked]");
				if($defaultOption.length > 0){
					$defaultOption.click();
				}
				else{	//if there is no default, select first option
					$($options.get(0)).children("a").click();
				}
			});
			if(callback){
				callback.call();
			}
		}
		function dropdownShow(e){
			var $this = $(this),
				$target = $(e.target),
				$selected = $("dt a", this),
				$options = $("dd ul li a", this);
			if($target.is($selected) || $target.is($selected.children())){
				$this.find("dd ul").toggle();
			}
			else if($target.is($options)){
				$this.find("dt").empty().append($target.clone());
				$this.find("dd ul").hide();
			}
			else if($target.is($options.children())){
				$this.find("dt").empty().append($target.parent().clone());
				$this.find("dd ul").hide();
			}
		}
		function dropdownHide(e){
			var $clicked = $(e.target);
			if (! $clicked.parents().hasClass("ddk-dropdown"))
				$(".ddk-dropdown dd ul").hide();
		}
		function setAccordionOptions(options){
			var obj,
				i, j,
				pane, sec,
				lo,
				nesw = ["center", "north", "south"],
				opt;
			if (K("ddk.useVersion2Up") !== "True") return;

			for (i=0; i<asPane.length; i+=1) {
				pane = asPane[i];
				lo = DDK.layout.widget.center.children.layout1[pane];
				//console.log(i, lo);
				if (lo) {
					for (j=0; j<asSection.length; j+=1) {
						sec = asSection[j];
						$.extend(true, opt = {}, options || {}, DDK.accordion[pane].customOptions || {});
						//if (lo.children.layout1[nesw[j]] && DDK.accordion[pane][sec]) {
						if (DDK.accordion[pane][sec]) {
							if (DDK.accordion[pane][sec].customOptions) $.extend(true, opt, DDK.accordion[pane][sec].customOptions);
							for (obj in opt) {
								if (obj && opt[obj]) {
									//console.log(pane, sec, obj, opt[obj]);
									DDK.accordion[pane][sec].accordion("option", obj, opt[obj]);
								}
							}	// end for opt
						}
					}	//end for section
				}
			}
		}
		function setTabsOptions(options){
			var obj,
				i, j,
				pane, sec,
				lo,
				nesw = ["center", "north", "south"],
				opt;
			if (K("ddk.useVersion2Up") !== "True") return;
			for (i=0; i<asPane.length; i+=1) {
				pane = asPane[i];
				lo = DDK.layout.widget.center.children.layout1[pane];
				if (lo) {
					for (j=0; j<asSection.length; j+=1) {
						sec = asSection[j];
						$.extend(true, opt = {}, options || {}, DDK.tabs[pane].customOptions || {});
						//if (lo.children.layout1[nesw[j]] && DDK.tabs[pane][sec]) {
						if (DDK.tabs[pane][sec]) {
							if (DDK.tabs[pane][sec].customOptions) $.extend(true, opt, DDK.tabs[pane][sec].customOptions);
							for (obj in opt) {
								if (obj && opt[obj]) {
									//console.log(asPane[i], asSection[j], obj, opt[obj]);
									DDK.tabs[pane][sec].tabs("option", obj, opt[obj]);
								}
							}
						}
					}
				}
			}
		}
		return {
			util: util,
			focus: focus,
			blur: blur,
			makeButton: makeButton,
			deleteFavorite: deleteFavorite,
			loadFavorite: loadFavorite,
			updateFavoriteValue: updateFavoriteValue,
			displayDialog: displayDialog,
			initColorPicker: initColorPicker,
			//format: formatSpans,
			loadControls: loadControls,
			pdfGo: pdfGo,
			dialog: dialog,
			dialog2: dialog2,
			mouseover: mouseover,
			writeFavoriteChanges: writeFavoriteChanges,
			initControls: initControls,
			template: {},
			chart: {
				resize: PSC_Chart_Resize,
				reload: PSC_Chart_Reload,
				data: {},
				setType: setChartType,
				init: initChart,
				seriesConfig: configChartSeries,
				title: "Chart",
				fodResize: false,
				resizeDatatable: resizeChartDatatable
			},
			table: {
				bAjaxDataGet: true,
				resize: PSC_Table_Resize,
				reload: PSC_Table_Reload,
				data: {},
				init: initTable,
				title: "Table",
				fodResize: true,
				defaultOptions: defaultTableOptions,
				clientOptions: clientTableOptions,
				JSONOptions: JSONTableOptions,
				serverOptions: serverTableOptions
			},
			tree: {
				resize: PSC_Tree_Resize,
				reload: PSC_Tree_Reload,
				refresh: PSC_Tree_Refresh,
				data: {},
				init: initTree,
				title: "Tree",
				fodResize: true,
				defaultOptions: defaultTreeOptions
			},
			scorecard: {
				resize: PSC_Scorecard_Resize,
				reload: PSC_Scorecard_Reload,
				data: {},
				init: initScorecard,
				title: "Scorecard",
				fodResize: true,
				defaultOptions: defaultScorecardOptions
			},
			scorecard2: {
				resize: PSC_Scorecard2_Resize,
				reload: PSC_Scorecard2_Reload,
				data: {},
				init: initScorecard2,
				title: "Scorecard",
				fodResize: true,
				defaultOptions: defaultScorecardOptions2
			},

			control: {
				init: initControl
			},
			dropdown: {
				init: dropdownInit,
				show: dropdownShow,
				hide: dropdownHide
			},
			eventHandler: eventHandler,
			help: {},
			validate: validate,
			accordion: {
				center: {},
				west: {},
				east: {},
				south: {},
				initOptions: setAccordionOptions
			},
			tabs: {
				center: {},
				west: {},
				east: {},
				south: {},
				initOptions: setTabsOptions
			}
		};

	}());

	// Expose DDK to the global object
	window.DDK = DDK;
}(window));

		$.extend(true, DDK, {
		bamset: {
			data: {},
			init: function(id) {
				var $control = $("#psc_bamset_" + id + "_widget"),
					$data = $('#psc_bamset_data_' + id),
					data = $data.data(),
					config = data && data.config || null,
					$content,
					metrics,
					attributes,
					displays,
					hasBams = false;

				DDK.bamset.data[id] = DDK.bamset.data[id] || {};

				if (config) {
					if (_.isPlainObject(config.bamsetBam)) { hasBams = true; }
					if (_.isArray(config.bamsetBam) && _.flatten(config.bamsetBam).length) { hasBams = true; }
					// check for prototype configuration
					if (_.isPlainObject(config.bam)) { hasBams = true; }
					if (_.isArray(config.bam) && _.flatten(config.bam).length) { hasBams = true; }
				}

				if (!hasBams) {
					$.extend(true, data, $control.find("[data-ddk-metrics]").data());
					$data.html(DDK.bamset.template.empty);
					$content = $data.find(".ddk-control-splash-content");

					metrics = _.uniq(_.map(data && data.ddkMetrics || {}, function(value) {
						return {
							name: value.columnMetric,
							label: _.string.titleize(value.columnMetric)
						};
					}), false, function(value, index) { return value.name; });

					attributes =  _.uniq(_.map(data && data.ddkMetrics || {}, function(value) {
						return {
							name: value.columnMetricAttr,
							label: _.string.titleize(value.columnMetricAttr)
						};
					}), false, function(value, index) { return value.name; }).sort(function(a, b) {
						//console.log(a.label, b.label, a.label > b.label);
						if (a.label > b.label) {
							return 1;
						} else if (b.label > a.label) {
							return -1;
						} else {
							return 0;
						}
					});

					displays = _.map($.extend(true, {}, DDK.template.metricDisplay, (DDK.scorecard.data[id] && DDK.scorecard.data[id].customMetricDisplayTemplate) || {}), function(value, key) {
						return {name: key, label: value.displayLabel};
					}).sort(function(a, b) {
						//console.log(a.label, b.label, a.label > b.label);
						if (a.label > b.label) {
							return 1;
						} else if (b.label > a.label) {
							return -1;
						} else {
							return 0;
						}
					});

					//console.log(data, metrics, attributes, displays);

					$content.html($(DDK.template.render.bamsetChooseMetricsDialog(data)));
					$data.on("click", "button[data-ddk-button]", function (e) {
						function toggleOptions(action, $container) {
							//console.log(action);
							switch (action) {
								case "show":
									$container.find(".ddk-dialog-content-header").removeClass("ps-hidden");
									$container.find("button[data-ddk-button=\"OK\"]").removeClass("ps-hidden");
								break;
								case "hide":
									$container.find(".ddk-dialog-content-header").addClass("ps-hidden");
									$container.find("button[data-ddk-button=\"OK\"]").addClass("ps-hidden");
								break;
							}
						}

						var $this = $(this),
							action = $this.data().ddkButton,
							oldConfig,
							newConfig,
							newBamsetBam = [],
							$clusters;

						switch (action) {
							case "removeSet":
								if ($this.closest(".ddk-dialog-content-clusters").children().size() === 1) {
									toggleOptions("hide", $this.closest(".ddk-control-splash"));
								}
								$this.closest(".ddk-dialog-bamset-cluster").remove();
								break;
							case "removeMetric":
								$this.closest(".ddk-dialog-bamset-bam").remove();
								break;
							case "Add_Set":
								$("<div class=\"ddk-dialog-bamset-cluster\"><div class=\"ddk-dialog-bamset-cluster-bams\">"
									+ DDK.template.render.bamsetDialogBam()
									+ "</div>"
									+ "<div class=\"ddk-dialog-bamset-cluster-buttons\"><button data-ddk-button=\"addMetric\" class=\"ddk-bamset-add-metric\">Add Metric</button><button data-ddk-button=\"removeSet\" class=\"ddk-bamset-remove-cluster ui-priority-secondary\">Remove Set</button></div>"
									+ "</div>")
									.find("select.display")
										.html(DDK.template.render.option(displays))
										.val("currentValue")
										.end()
									.find("select.metric")
										.html(DDK.template.render.option(metrics))
										.end()
									.find("button")
										.each(DDK.makeButton)
										.end()
									.appendTo($content.find(".ddk-dialog-content-clusters"))
									.find(".ddk-dialog-bamset-bam-options")
										.toggle()
										.end()
									.find(".ddk-dialog-bamset-cluster-bams")
										.sortable({
											placeholder: "ddk-dialog-bamset-bam-placeholder ui-state-highlight",
											connectWith: ".ddk-dialog-bamset-cluster-bams",
											handle: ".ui-icon-grip-dotted-vertical"
										});
								toggleOptions("show", $this.closest(".ddk-control-splash"));
								break;
							case "addMetric":
								$(DDK.template.render.bamsetDialogBam())
									.find("select.display")
										//.html("<optgroup label=\"Formatted\">" + DDK.template.render.option(displays) + "</optgroup><optgroup label=\"Unformatted\">" + DDK.template.render.option(attributes) + "</optgroup>")
										.html(DDK.template.render.option(displays))
										.val("currentValue")
										.end()
									.find("select.metric")
										.html(DDK.template.render.option(metrics))
										.end()
									.find("button")
										.each(DDK.makeButton)
										.end()
									.appendTo($this.closest(".ddk-dialog-bamset-cluster").find(".ddk-dialog-bamset-cluster-bams"))
									.find(".ddk-dialog-bamset-bam-options")
										.toggle()
										.end();
								break;
							case "expandOptions":
								$this
									.find(".ui-icon")
										.toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s")
										.end()
									.closest(".ddk-dialog-bamset-bam")
										.find(".ddk-dialog-bamset-bam-options")
										.toggle();
								break;
							case "OK":
								oldConfig = {};
								$clusters = $content.find(".ddk-dialog-bamset-cluster");
								$clusters.each(function() {
									var $this = $(this);
									cluster = [];
									$this.find(".ddk-dialog-bamset-bam").each(function() {
										var $this = $(this),
											metric = ($this.find(".metric").val() || ""),
											display = ($this.find(".display").val() || ""),
											layout = ($this.find(".layout").val() || ""),
											title = ($this.find(".title").val() || ""),
											subtitle = ($this.find(".subtitle").val() || ""),
											newBam = {};

										newBam.bamMetric = $.trim((metric + " " + display + " " + layout));
										if (title) {
											newBam.bamTitle = title;
										}
										if (subtitle) {
											newBam.bamSubtitle = subtitle;
										}
										cluster.push(newBam);
									});
									newBamsetBam.push(cluster);
								});

								newConfig = oldConfig;
								newConfig.bamsetBam = newBamsetBam;
								newConfig.bamsetDatabind = $content.find(".ddk-bamset-databind").prop("checked");

								//console.log(newConfig);

								//console.log(newConfig, JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(91)).replace(/\x5D/g, DDK.util.stringRepeat(String.fromCharCode(92), 3) + String.fromCharCode(93)));

								//K("s_" + id + "_con", JSON.stringify(newConfig).replace(/"/g, "'").replace(/\x5B/g, String.fromCharCode(92) + String.fromCharCode(91)).replace(/\x5D/g, String.fromCharCode(92) + String.fromCharCode(93)));
								K("s_" + id + "_con", DDK.escape.brackets(JSON.stringify(newConfig)));
								//console.log(K("s_" + id + "_con"));
								DDK.bamset.reload(id);
								break;
						}
					})
					.find(".ddk-dialog-content-columns")
						.sortable({
							placeholder: "ddk-dialog-bamset-bam-placeholder ui-state-highlight",
							handle: ".ui-icon-grip-dotted-vertical"
						});
				} else {
					DDK.format($control);
					DDK.bamset.resize(id);
				}

				DDK.control.init($control);
			},
			resize: PSC_Bamset_Resize,
			reload: PSC_Bamset_Reload
		}
	});

	// selector can be an element id, a selector string, a jQuery collection
	// a DOM element, or a DDK control id
	DDK.format = function (selector) {
		var $selection, $targets;
			
		if (typeof selector === "string") {	
			$selection = $("[id^=\"psc_\"][id$=\"" + selector + "_widget\"]");
			
			if (!$selection.length) {
				$selection = $("#" + selector);
			}
		}

		if (!$selection || !$selection.length) {
			$selection = $(selector);
		}

		// excute DDK1 formatting
		$selection.find("span[data-format]:visible").each(function() {
			var $this = $(this),
				formatOptions = $this.data("format"),
				formatType = (formatOptions.type || formatOptions); // support initial prototype API of data-format="formatType" as well as new API of data-format="{...JSON String...}"

			if (typeof DDK.format[formatType] === "function") {
				DDK.format[formatType]($this, formatOptions);
				DDK.log("DDK.format (DDK1)", selector, $this[0], formatType, formatOptions);
				$this.removeAttr("data-format");
			}
		});
		
		// execute DDK2 formatting
		$targets = $selection.find("[data-format]");
		$targets.each(function() {
			(new PS.Formatter(this)).exec();
		});
		
		return $targets.length;
	};

	// selector can be an element id, a selector string, a jQuery collection
	// a DOM element, or a DDK control id
	DDK.navFormat = function (selector) {
		var $selection;
		if(selector !== undefined){	
			if (typeof selector === "string") {	
				$selection = $("[id^=\"psc_\"][id$=\"" + selector + "_widget\"]");
				
				if (!$selection.length) {
					$selection = $("#" + selector);
				}
			}

			if (!$selection || !$selection.length) {
				$selection = $(selector);
			}
		}
		else{
			$selection = $(document);
		}
		// execute DDK2 formatting
		$selection.find("[data-nav]").andSelf("[data-nav]").each(function() {
			(new PS.NavFormatter(this)).exec();
		});
	};


$.extend(true, DDK, {
	list: {
		data: {},
		init: function(id) {
			var $control = $("#psc_list_" + id + "_widget"),
				$data = $('#psc_list_data_' + id),
				data = $data.data(),
				config = data && data.config || null,
				count = data && data.count || 0,
				$content,
				metrics,
				attributes,
				displays;

			DDK.list.data[id] = DDK.list.data[id] || {};

			DDK.format($control);
			
			$(document).foundation();
			
			DDK.list.resize(id);

			DDK.control.init($control);
		},
		resize: PSC_List_Resize,
		reload: PSC_List_Reload
	},
	bamset2: {
		data: {},
		init: function(id) {
			var $control = $("#psc_bamset2_" + id + "_widget"),
				$data = $('#psc_bamset2_data_' + id),
				data = $data.data(),
				config = data && data.config || null,
				count = data && data.count || 0,
				$content,
				metrics,
				attributes,
				displays,
				hasBams = false;

			DDK.bamset2.data[id] = DDK.bamset2.data[id] || {};

			DDK.format($control);
			DDK.bamset2.resize(id);

			DDK.control.init($control);
			
			if (!config || !config.setBodyBams) {
				if (count && DDK.eventHandler.bs2BuildSet) {
					$control.find("[data-ddk-button-action=\"bs2BuildSet\"]").click();
				}
			}
		},
		resize: PSC_Bamset2_Resize,
		reload: PSC_Bamset2_Reload
		},
	navset2: {
		data: {},
		defaultSelect2Options: {
			queryWidget: "",
			targetKeyword: "",
			emptyKeywordValue: "",
			label: "",
			placeholder: "",
			value: "",
			width: "100%",
			inputId: "",
			inputClass: "",
			inputAttributes: "",
			attributes: "",
			className: "",
			valueWrapString: "",
			pickerMode: "select2",
			pageSize: "50",
			checkedText: "YES",
			checkedValue: "true",
			uncheckedText: "NO",
			uncheckedValue: "false",
			dateFormat: "yy-mm-dd",
			treeCheckbox: true,
			closeOnSelect: false,
			allowClear: true
		},
		init: function(id) {
				var thisNavset = this,
					$control = $("#psc_navset2_" + id + "_widget"),
					$data = $('#psc_navset2_data_' + id),
					data = $data.data(),
					config = data && data.config || null,
					tempArr = [],
					$content,
					metrics,
					attributes,
					displays,
					hasBams = false;
				tempArr = tempArr.concat(config.setHeaderNavs || []).concat(config.setBodyNavs || []).concat(config.setFooterNavs || []);
				//initialize elements
				_.each(tempArr, function(nav, index){
					var tempArr2 = [];
					tempArr2 = tempArr.concat(nav.navHeaderElements || []).concat(nav.navContentElements || []).concat(nav.navFooterElements || []);
					_.each(tempArr2, function(elem, index2){
						//initialize date
						var initElem = _.delegator({
							"default": function(){},
							"date": function(){
								$control.find("#" + elem.elemId).datepicker(elem.elemConfig);
							},
							"select2": function(){
								var options = $.extend(true, {}, thisNavset.defaultSelect2Options, elem.elemConfig);
								if(elem.elemConfig.queryWidget){
									$.extend(true, options, getAjaxSetup(options));
								}
								else{
									$.extend(true, options, {
										data: elem.elemConfig.data || []
									});
								}
								$control.find("#" + elem.elemId).select2(options);
							}
						}, "default");
			/*			if(elem.elemId && elem.elemConfig){
							//initialize select2
							initElem(elem.elemType);
							//add change event for target keyword
							if(elem.elemConfig.targetKeyword){
								$control.find("#" + elem.elemId).on("change", function(e){
									K(elem.elemConfig.targetKeyword, $(this).val());
								});					
							}
						}
			
						if(elem.elemConfig){
							//add change event for target keyword
							if(elem.elemConfig.targetKeyword && elem.elemId){
								$control.find("#" + elem.elemId).on("change", function(e){
									K(elem.elemConfig.targetKeyword, $(this).val());
								});					
							}
						}
			*/		});
				});
				DDK.navset2.data[id] = DDK.navset2.data[id] || {};
	
				DDK.format($control);
				DDK.navset2.resize(id);
	
				DDK.control.init($control);
				DDK.navFormat($control);
			},
		resize: PSC_Navset2_Resize,
		reload: PSC_Navset2_Reload
	}
});
