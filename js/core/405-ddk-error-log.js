DDK.errorLog = function () {
	var args, title;
	
	args = [].slice.call(arguments);
	
	title = args.shift();
	
	if (!title) { return ""; }
	
	return '<table class="border-thick"><thead><tr><th colspan=2 class="text-xdkred border-bottom border-thick">' + title + '</th></thead><tbody>' +
		_.reduce(args, function (result, value) {
			return result + '<tr class="background-white"><td class="border-bottom border-xthin">' + _.escape(value[0]) + '</td><td class="border-bottom border-xthin"><code>' + _.escape(value[1]) + '</code></td></tr>';
		}, "") +
		'</tbody></table>';
};