//JQuery Code:
$(document).ready(function() {
	downarrow();
	whatuserlikes();
	rotatewords();
	//Grid
	$(".thumbs").portfolio({
		cols: 3,
    	transition: 'slideDown'
	});
});
//When bouncing arrow is pressed, browser scrolls to next section
function downarrow() {
	$('#down').click(function() {
		$('body, html').animate({
			scrollTop: $('#wdyl').offset().top}, 1000);
		$('.user-input').focus();
	});
}
//Inputs what the user likes
function whatuserlikes() {
	$('.user-input').keydown(function(ent) {
		if (ent.which == 13) {
			var userlikes = $('.user-input').val();
			console.log('user likes1: ' + userlikes);
			ent.preventDefault();
			$('body, html').animate({
			scrollTop: $('#grid-section').offset().top}, 1000);
			$('#user-enjoys').empty().prepend('<h2 class="display-similar"> RecommendMe something similar to: <form id="lock"><input type="text" class="user-input" placeholder="' + userlikes + '"</h2>');
			//Make the search query fixed when scrolling past it
		$(window).scroll(function(){
      		if ( $(this).scrollTop() > $('#grid-section').offset().top ) {
          	$('#user-enjoys').addClass('fixed');
      		} else {
				$('#user-enjoys').removeClass('fixed');
			}
  		});
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

