// attach window resize handler
$(window).on("resize", _.debounce(function () { $(document).findControls().resizeControls(); }, 250));

// do not close off-canvas menu when clicking on a select2 input
$(".left-off-canvas-menu").on("click", ".select2-choice", function (e) { 
	e.stopPropagation();
});

// section expand/collapse
$(".left-off-canvas-menu").on("click", ".section-header", function (e) {
	var $this;
	
	$this = $(this);
	
	$this.toggleClass("open closed");
	$this.next(".section-content").slideToggle(DDK.ease);
});
