// DDK Mouseovers
$.extend(true, DDK.mouseover, {
	"chartDefault": {
		// default chart data-ddk-detail attribute is a comma-delimited string
		// [0] #VALX
		// [1] #VALY
		// [2] SeriesName
		// [3] SeriesLabel
		// [4] SeriesIndex
		// [5] SeriesType
		// [6] SeriesColor
		content: {
			text: function() {
				var $this = $(this),
					data = $this.data(),
					detail = data.ddkDetail.split(",");

				return detail[3] + ": " + detail[1];
			},
			title: {
				text: function() {
					var $this = $(this),
						data = $this.data(),
						detail = data.ddkDetail.split(",");

					return detail[0];
				}
			}
		}
	}
});