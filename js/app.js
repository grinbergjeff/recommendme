//JQuery Code:
$(document).ready(function() {
	$('#grid-section, #load-section').hide(); // Hide grid section in the beginning
	 $('.recommenedmore, .rec-fail').hide(); // Hide the what else do you like div
	searchMe = "https://www.tastedive.com/api/similar?q=";
	downArrow();
	whatUserLikes();
	rotateWords();
	recMeMore();
	alsoLikeClick();
});
// When bouncing arrow is pressed, browser scrolls to next section
function downArrow() {
	$('#down').on('click',function() {
		$('body, html').animate({
			scrollTop: $('#wdyl').offset().top}, 1000);
		$('.user-input').focus();
	});
}
// Inputs what the user likes at the very beginning
function whatUserLikes() {
	$('.user-submit').on('click',function(e) {
		scrollToGrid();
		e.preventDefault();
	})
	$('.user-input').keydown(function(e) {
		if (e.which == 13) {
			scrollToGrid();
			e.preventDefault(); // Do not reload on submission
		} 
	});
}
function scrollToGrid() {
	$('.rec-fail').hide();
	$('.load-message').show();
	userLikes = $('.user-input').val();// global variable for better search results
			if (userLikes !== '') {
			//Send the query to Tastekid!
			getTastedive(userLikes, userLikes);	
			$('#load-section').fadeIn('medium');
			$('body, html').animate({
			scrollTop: $('#load-section').offset().top}, 1000);
			$('.user-input').val('');
			setTimeout(function() {
				$('#load-section').fadeOut('fast');
				$('body, html').animate({
			scrollTop: $('#grid-section').offset().top});
			}, 4600);
			}
	//In case user tries to use this input field again:
	$(`#grid-section`).hide();
	$('.thumbs, .portfolio-content').empty();
	searchMe = "https://www.tastedive.com/api/similar?q=";
}
// Animates the rotation of words in the statmenet before input
function rotateWords() {
	var words = ['artist','movie','game','book','author', 'tv-show'];
	var i = 0;
	setInterval(function(){
		var rotatingWord = words[0];
		rotatingWord = words[i];
		$('.changeme').fadeOut('slow', function() {
			$(this).empty().prepend(rotatingWord).fadeIn('slow');
		});
		i++;
		// Make this loop infinitely
		if(i >= words.length) {
			i = 0;
		}
	}, 1000);
}
// Function to get API results from Tastedive!
function getTastedive(query, newQuery) {
	var thumbNumber = 0;
	var request = {
		k: "147333-grinberg-2VEUG8K7",
		info: 1,
		verbose: 1,
		format: "JSON"
	};
	// Determines if this is the users first entry or an optimized entry (multiple liked things)
	if (newQuery !== query) {
		searchMe += ('%2C+' + newQuery);
	}
	else { searchMe += query; };
	$.ajax({
		url: searchMe,
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		thumbNumber = 1;
		if (result.Similar.Results == '') {
				noRecommendations();
		}
		// Show the recommended items that are similar
		$.each(result.Similar.Results, function(i, item) {
			// Add each similar query result to reach limit of 10 results
			var simResExec = true;
			// Need to change the thumb number so the correct information gets displayed (very important for the grid)
			if(simResExec = true) {
				thumbNumber++;
				//Show 12 similar results
				if(thumbNumber < 14) {
					setTimeout(getBing(item.Name, item.Type, item, thumbNumber),1000);
				}
			}
		});
	})
	// If request does not work properly:
	.fail(function(jqXHR, error, errorThrown) {
	})
}
// Function to get the images from Bing's API:
function getBing(searchQuery, type, displayItem, displayThumbnumber) {
	var serviceURL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search?q='; 
	var AppId = "7b789ac547e7433e8a90829219ac754a"; 
	var search = encodeURIComponent(searchQuery);
	var size = "&qft=+filterui:imagesize-medium";
	var format = "&$format=json";
	var burl = serviceURL + search + size + format;
	
	var bresult = $.ajax({
						url: burl,
						type: "GET",
						async: false,
						beforeSend: function(xhrObj){
							//Request headers
							xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", AppId);
					},
	})
	.success( bresult = function(bingdata) {
		// If successful in getting results, display the image for each result!
		displayInfo(displayItem, displayThumbnumber, bingdata.value[0].contentUrl);
	})
	// If not successful
	.fail(function(jqXHR, error, errorThrown) {
	})
}
// Function to display the thumbnails, extra description of the grid and the images from Bing
function displayInfo(rec, thumbNumber, imgUrl) {
	var displayThumbs = $('#grid-section').find('.thumbs');
	var displayDesc = $('#grid-section').find('.portfolio-content');
	var imageLink = imgUrl; //URL to Bing's result for the query
		//Append the thumbs portion for each entry
		displayThumbs.append('<li><a href="#thumb' + thumbNumber + '" class="thumbnail" ' + 'style="background-image: url(' + imageLink + ')"><h4>' + rec.Type + '</h4><span class="description">' + rec.Name + '</span></a></li>');
		//Append the in-depth info and links
		displayDesc.append('<div id="thumb' + thumbNumber + '">' + '<div class="media"><iframe src="' + rec.yUrl + '" width="512" height="370" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>' + '<h1 class="titlename">' + rec.Name + '</h1>'+ '<a href="' + rec.wUrl + '" class="moreinfo">Learn More</a>' + '<button type="button" class="addmetoo">I also like this!</button>' + '<p>' + rec.wTeaser + '</p>' + '</div>');
	/*Don't forget category books don't have youtube videos*/
	if (rec.Type === "book" || rec.Type === "Book" || rec.Type === "Author" || rec.Type === "author") {
		var thumbNum = "#thumb" + thumbNumber;
		var noTube = $(thumbNum).find('.media');
		noTube.hide();
	}
	//Run the grid code!
	$(".thumbs").portfolio({
		cols: 3,
    	transition: 'slideDown'
	});
	setTimeout(function() {
					$('#grid-section').show();
			}, 4600);
}
//Allow user to get better search results by inputting what else they like
function recMeMore() {
	$('.alsolike').on('click',function(e) {
		var moreLikes = $('.morelike').val();
		if (moreLikes !== '') {
			$('#grid-section').fadeOut();
			$('.thumbs, .portfolio-content').empty();
			$('#load-section').fadeIn();
			//Send the query to Tastekid!
			getTastedive(userLikes, moreLikes);
			setTimeout(function() {
				$('#load-section').fadeOut('fast', function() {
					$('#grid-section').show();
				});
			}, 4600);
			$('.morelike').val('');
		}
		e.preventDefault();
	})
}
//Allow users to click "I also like this!" to get better results.
function alsoLikeClick() {
	$('.thumbs').on('click','.addmetoo',function(e) {
		//Find the title of what user just clicked like for:
		var foundTitle = $(this).parent().find('.titlename').text();
		$('#grid-section').fadeOut();
		$('.thumbs, .portfolio-content').empty();
		$('#load-section').fadeIn();
		getTastedive(userLikes, foundTitle);
		setTimeout(function() {
				$('#load-section').fadeOut('fast', function() {
					$('#grid-section').show();
				});
			}, 4600);
		e.preventDefault();
	})
}
//If request did work but Tastekid doesn't actually have recs:
function noRecommendations() {
			$('#grid-section, .load-message').fadeOut();
			$('.rec-fail').fadeIn();
			//Empty grid-section
			$('.thumbs, .portfolio-content').empty();
}