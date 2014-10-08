$(document).ready(function () {
	var $pageHeader = $("#ddk_page_header"),
		$duplicate = $pageHeader.find("#ddk_page_header");
		
	if ($duplicate.length) {
		$duplicate.children()
			.unwrap()
			.find("li")
				.contents()
					.filter(function() { return this.nodeType === 3; })
						.wrap("<a href='#'></a>")
						.end()
					.end()
				.end()
			.find("ul")
				.addClass("dropdown")
				.parent()
					.addClass("has-dropdown");
	}
});