/*
settings is an object that can contain these properties:
id - favorite record id.
name - favorite record name. `name` or `id` can be used interchangeably in the settings object.
favHeader - sets favorite record header display options
favFooter - sets favorite record footer display options
keywords - keywords sent with this request only. Will not be set in the global keyword hash.
state - url or JSON encoded key/value pairs of state keywords applied to rendered control. Keys should use only the state key abbreviation. e.g. to apply a new chart title and turn off automatic chart axis labels: "&ti=New%20Title&lae=false" or { ti: "New Title", lae: "false" }.
error - function executed in the event of a DRF error. Return value from function is used as the runFav output. Error function is passed one argument, the favorite record name or id.
*/

// new function signatures
// runFav(id, settings)
// runFav(settings)
var runFromFavorite = function (favoriteId, keywords, favHeader, favFooter) {
	function defaultError(id) {
		if (K("sec.userType") === "SysAdmin") {
			return DDK.errorLog("Error Loading Favorite", ["name / id", id]);
		}
		
		return "";
	}

	var controlData, control, header, footer, dataConfig,
		settings, state, error;

	if (_.isPlainObject(favoriteId)) {
		settings = favoriteId;
	} else if (_.isPlainObject(keywords)) {
		// could be keywords to be sent or could be a settings object
		// check for settings properties:
		// favHeader, favFooter, keywords, state, error
		if (_.intersection(_.keys(keywords), "favHeader favFooter keywords state error".split(" ")).length) {
			settings = keywords;
		}		
	} else if (typeof keywords === "boolean") {
		favFooter = favHeader;
		favHeader = keywords;
		keywords = "";
	}
	
	if (settings) {
		favoriteId = favoriteId || settings.id || settings.name;
		keywords = settings.keywords;
		favHeader = settings.favHeader;
		favFooter = settings.favFooter;
	} else {
		settings = {};
	}

	state = settings.state || "";
	error = settings.error || defaultError;
		
	dataConfig = [
		{
			queryWidget: "PSC_Favorites_Record_Query_" + (_.isNaN(+favoriteId) ? "Name" : "Id"),
			columnPrefix: "sci_fav_",
			datasetMode: "array",
			keywords: "&ddk_fav_id=" + favoriteId,
			shouldCamelizeKeys: true,
			useCoercedTypes: false,
			escapeMode: "keyword",
			datasetKey: "fav"
		},
		{
			method: "runFavHeader",
			keywords: favHeader
		},
		{
			method: "runFavFooter",
			keywords: favFooter
		},
		{
			method: "runFav"
		}
	];
		
	// Throw exception if favoriteId does not evaluate to a positive number
	// or is not a name
	if (!(+favoriteId > 0) && (typeof favoriteId !== "string" || favoriteId === "")) {
		return error(favoriteId);
	}
	
	// get control
	controlData = _.string.parseJSON(DDK.unescape.brackets(run("DDK_Data_Request", _.extend({}, keywords, { "data.config": DDK.escape.brackets(JSON.stringify(dataConfig)), component_state: (typeof state === "string" ? state : _.reduce(state, function (result, value, key) {
		return result + "&" + key + "=" + encodeURIComponent(value);
	}, ""))	}))));

	if (controlData && _.isPlainObject(controlData) && controlData.datasets) {
		header = controlData.datasets[1];
		footer = controlData.datasets[2];
		control = controlData.datasets[3];
	} else {
		return error(favoriteId);
	}
	
	return "\n\n" + header + control.html + footer + (control.stateKeywords ? "\n\n<script>K(\"" + control.stateKeywords + "\");</script>" : "") + "\n\n";
};

var runFav = runFromFavorite;

function renderFavoriteValue() {
	var value;
	
	value = _.string.parseJSON(K.getDatasetField('fav', 'value') || "");
	
	if (_.isObject(value)) {
		value = JSON.stringify(value, null, 4);
	}
	
	return "<pre class='pre-wrap'><code class='language-javascript'>" +
		_.escape(value).replace(/%/g, '&#37;') +
		"</code></pre>";
}

function docKey(key) {
	return "<code style='color: #C4620E;'><span class='text-normal tertiary'>&#37;&#37;</span><span>" + key + "</span><span class='text-normal tertiary'>&#37;&#37;</span></code>";
}