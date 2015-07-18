//JQuery Code:
$(document).ready(function() {
	downarrow();
	whatuserlikes();
});
//When bouncing arrow is pressed, browser scrolls to next section
function downarrow() {
	$('#down').click(function() {
		$('body, html').animate({
			scrollTop: $('#wdyl').offset().top}, 1000);
	});
}
function whatuserlikes() {
	$('#user-input').keydown(function(ent) {
		if (ent.which == 13) {
			ent.preventDefault();
			var userlikes = $('#user-input').val();
			console.log('user likes: ' + userlikes);
			$(this).val('');
			
		}
	});
}
/*
//Javascript Code:
window.onload = function(){ 
	/*document.getElementById('stmt').innerHTML('What [] do you like? TEST');
};*/
