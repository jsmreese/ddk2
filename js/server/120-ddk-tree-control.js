DDK.tree = DDK.tree || {};

DDK.tree.sortQuery = function(optionSort, toolbarSort){
	var out = "",
		prioritySort = ["sort_order", "node_name", "node_label"];
		
	if(optionSort > ""){
		out += optionSort;
	}
	if(toolbarSort && optionSort.indexOf(toolbarSort) < 0){
		out += out > "" && out.charAt(out.length-1) != "," ?  "," : "";
		out += toolbarSort;
	}
	out += out > "" && out.charAt(out.length-1) != "," ?  "," : "";
	out += _.reject(prioritySort, function(item){ return item === toolbarSort || optionSort.indexOf(item) > -1}).join(",");
	return out;
};