//JQuery Code:
$(document).ready(function() {
	//When bouncing arrow is pressed, browser scrolls to next section
	$('#down').click(function() {
		$('body, html').animate({
			scrollTop: $('#wdyl').offset().top}, 1000);
	});
});


//Javascript Code:
window.onload = function(){ 

};