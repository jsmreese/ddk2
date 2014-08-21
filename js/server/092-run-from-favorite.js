var runFromFavorite = function (favoriteId, keywords, favDetail) {
	var controlData,
		control,
		detail,
		dataConfig = [
			{
				queryWidget: "PSC_Favorites_Record_Query_" + (_.isNaN(+favoriteId) ? "Name" : "Id"),
				columnPrefix: "sci_fav_",
				datasetMode: "array",
				keywords: "&ddk_fav_id=" + favoriteId,
				shouldCamelizeKeys: true,
				useCoercedTypes: false,
				datasetKey: "fav"
			}
		];

	if (typeof keywords === "boolean") {
		favDetail = keywords;
		keywords = "";
	}
	
	if (favDetail) {
		dataConfig.push({
			method: "runFavDetail",
			keywords: favDetail
		});	
	}
	
	dataConfig.push({
		method: "runFav"
	});
	
	// Throw exception if favoriteId does not evaluate to a positive number
	// or is not a name
	if (!(+favoriteId > 0)) {
		if (typeof favoriteId !== "string" || favoriteId === "") {
			return "AMEngine JScript runtime error - runFromFavorite: invalid favoriteId. '" + favoriteId.toString() + "' must be a positve number or a string.";
		}
	}
	
	// get control
	controlData = _.string.parseJSON(DDK.unescape.brackets(run("DDK_Data_Request", _.extend({}, keywords, { "data.config": DDK.escape.brackets(JSON.stringify(dataConfig)) }))));
	
	if (!_.isPlainObject(controlData)) {
		return "AMEngine JScript runtime error - runFromFavorite: unable to parse favorite '" + favoriteId + "'.";
	}
	
	if (favDetail) {
		detail = controlData.datasets[1];
		control = controlData.datasets[2];
	} else {
		detail = "";
		control = controlData.datasets[1];
	}
			
	return "\n\n" + detail + control.html + "\n\n<script>K(\"" + control.stateKeywords + "\");</script>\n\n";
};

var runFav = runFromFavorite;