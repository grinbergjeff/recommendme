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
			var formattedquery = userlikes.replace(/ /g, '+');
			//Send the query to Tastekid!
			getTastekid(userlikes);
			console.log('user likes1: ' + userlikes);
			ent.preventDefault();
			$('body, html').animate({
			scrollTop: $('#grid-section').offset().top}, 1000);
			$('#user-enjoys').empty().prepend('<h2 class="display-similar"> RecommendMe something similar to: <form id="lock"><input type="text" class="user-input" placeholder="' + userlikes + '"</h2>');
			ent.preventDefault();
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

function getTastekid(query) {
	var request = {
		k: "147333-grinberg-Q21V1S5Z",
		q: query,
		info: 1,
		verbose: 1,
		format: "JSON"
	};
	$.ajax({
		url: "https://www.tastekid.com/api/similar",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		$.each(result.Similar.Info, function(i, item) {
			console.log(query);
			console.log('holy it worked!');
			console.log('displaying the query');
			var displayquery = displayinfo(item);
		});
		$.each(result.Similar.Results, function(i, item) {
			console.log('displaying similar results:');
			var displaysimiar = displayinfo(item);
		});
	})
	.fail(function(jqXHR, error, errorThrown) {
		console.log('you messed up');
	})
}
function displayinfo(rec) {
	var i = 1;
	var displaythumbs = $('#grid-section').find('.thumbs');
	var displaydesc = $('#grid-section').find('#portfolio-content');
	var imagelink = '"images/thumb1.jpg"'; // replace this with actual links
	while (i < 11) {
		console.log('i is: ' + i);
		//Append the thumbs portion for each entry
		displaythumbs.html('<li><a href="#thumb' + i + '" class="thumbnail" ' + 'style="background-image: url(' + imagelink + ')"><h4>' + rec.Type + '</h4><span class="description">' + rec.Name + '</span></a></li>');
		//Append the in-depth info and links
		displaydesc.html('div if ="thumb' + i + '">' + '<div class="media"><iframe src"' + rec.yUrl + '" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe><div>' + '<h1>' + rec.Name + '</h1><p>' + rec.wTeaser + '</p> <a href="' + rec.wUrl + '" class="btn btn-primary">Learn More</a></div>');
		i++;
	}
	/*
	console.log('displayinfo executing!');
	//Here is the title of request:
	console.log(rec.Name);
	//Here is the Type of result:
	console.log(rec.Type);
	//Here is the Info:
	console.log(rec.wTeaser);
	//Here is the youtube link to the trailer:
	console.log(rec.yUrl);
	*/
}