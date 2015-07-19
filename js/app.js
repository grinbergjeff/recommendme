//JQuery Code:
$(document).ready(function() {
	downarrow();
	whatuserlikes();
	rotatewords();
	//Grid
	$("#MyPortfolio").portfolio({
		cols: 3,
    	transition: 'slideDown'
	});
});
//When bouncing arrow is pressed, browser scrolls to next section
function downarrow() {
	$('#down').click(function() {
		$('body, html').animate({
			scrollTop: $('#wdyl').offset().top}, 1000);
	});
}
//Inputs what the user likes
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
//Animates the rotation of words in the statmenet before input
function rotatewords() {
	var words = ['artist','movie','game','book','author'];
	//var rotatingword = words[0];
	var i = 0;
	setInterval(function(){
		var rotatingword = words[0];
		rotatingword = words[i];
		$('.changeme').fadeOut('slow', function() {
			$(this).empty().prepend(rotatingword).fadeIn('slow');
		});
		i++;
		//Make this loop infinitely
		if(i >= words.length) {
			i = 0;
		}
	}, 1000);
}

