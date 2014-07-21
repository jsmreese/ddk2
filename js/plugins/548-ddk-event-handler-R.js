// attach window resize handler
$(window).on("resize", _.debounce(function () { $(document).findControls().resizeControls(); }, 250));