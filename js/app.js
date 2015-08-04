//JQuery Code:
$(document).ready(function() {
	$("#fakeloader").fakeLoader({
				timeToHide:3000, //T ime in milliseconds for fakeLoader disappear
				zIndex:"999", // Default zIndex
				spinner:"spinner7", // Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
				bgColor:"#2ecc71", // Hex, RGB or RGBA colors
	});
	$('#grid-section').hide(); // Hide grid section in the beginning
	 $('.recommenedmore').hide(); // Hide the what else do you like div
	searchme = "https://www.tastekid.com/api/similar?q=";
	downArrow();
	whatUserLikes();
	rotateWords();
	recMeMore();
	
	console.log('going to execute alsoLikeClick');
	//After the grid is made, let users have chance to add items that are recommeneded to them but they already like to strengthen their recommendation
		alsoLikeClick();
		console.log('executed alsoLikeClick');
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
	userlikes = $('.user-input').val();// global variable for better search results
			if (userlikes !== '') {
			//Send the query to Tastekid!
			getTastekid(userlikes, userlikes);
			$('#grid-section').fadeIn('medium');
			$('body, html').animate({
			scrollTop: $('#grid-section').offset().top}, 1000);
			$('.user-input').val('');
			}
}
// Animates the rotation of words in the statmenet before input
function rotateWords() {
	var words = ['artist','movie','game','book','author', 'tv-show'];
	var i = 0;
	setInterval(function(){
		var rotatingword = words[0];
		rotatingword = words[i];
		$('.changeme').fadeOut('slow', function() {
			$(this).empty().prepend(rotatingword).fadeIn('slow');
		});
		i++;
		// Make this loop infinitely
		if(i >= words.length) {
			i = 0;
		}
	}, 1000);
}
// Function to get API results from Tastekid!
function getTastekid(query, newquery) {
	var request = {
		k: "147333-grinberg-Q21V1S5Z",
		info: 1,
		verbose: 1,
		format: "JSON"
	};
	// Determines if this is the users first entry or an optimized entry (multiple liked things)
	if (newquery !== query) {
		searchme += ('%2C+' + newquery);
	}
	else { searchme += query; };
	console.log('searchme is: ' + searchme);
	$.ajax({
		url: searchme,
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		console.log('done is: ' + searchme);
		// Show the item the user likes
		$.each(result.Similar.Info, function(i, item) {
			// For every result of the original query, get image from Bing's API:
			//getBing(query, item.Type, item, 1);
			//getBing(newquery, item.Type, item, 1);
			//getBing(item.Name,item.Type, item, 1);
		});
		var thumbnumber = 1;
		//S how the recommeneded items that are similar
		$.each(result.Similar.Results, function(i, item) {
			// Add each similar query result to reach limit of 10 results
			var simResExec = true;
			// Need to change the thumb number so the correct information gets displayed (very important for the grid)
			if(simResExec = true) {
			thumbnumber++;
				//Show 10 similar results
				if(thumbnumber <= 12) {
			getBing(item.Name, item.Type, item, thumbnumber);
				}
			}	
		});
	})
	// If request does not work properly:
	.fail(function(jqXHR, error, errorThrown) {
		// Load a modal indicating no results were found
	})
}
// Function to get the images from Bing's API:
function getBing(searchquery, type, displayitem, displaythumbnumber) {
	var serviceURL = 'https://api.datamarket.azure.com/Bing/Search/v1/Image'; 
	var AppId = ":O6C5e3SgWA9+peQEUMmHD1Y2T9HvafJAJz0KNruu+o0"; // StackOverflow says to add a colon in front of your ID!! 
	var EncAppId = btoa(AppId); // StackOverflow says to encode with base 64!
	var search = "?Query=%27%" + searchquery;
	var typesearch = "%20" + type +	"%27";
	var size = "&ImageFilters=%27Aspect%3AWide%27";
	var format = "&$format=json";
	var burl = serviceURL + search + typesearch + size + format;
	
	var bresult = $.ajax({
		url: burl,
		type: 'GET',
		headers: {	'Authorization': "Basic " + EncAppId} // StackOverflow helps here too!
	})
	.success( bresult = function(bingdata) {
		// If successful in getting results, display the image for each result!
		displayInfo(displayitem, displaythumbnumber, bingdata.d.results[0].MediaUrl);
	})
	// If not successful
	.fail(function(jqXHR, error, errorThrown) {
		console.log(' Bing Result :Failed');
	})
}
// Function to display the thumbnails, extra description of the grid and the images from Bing
function displayInfo(rec, thumbnumber, imgurl) {
	var displaythumbs = $('#grid-section').find('.thumbs');
	var displaydesc = $('#grid-section').find('.portfolio-content');
	console.log(rec.Name);
	var imagelink = imgurl; //URL to Bing's result for the query
		//Append the thumbs portion for each entry
		displaythumbs.append('<li><a href="#thumb' + thumbnumber + '" class="thumbnail" ' + 'style="background-image: url(' + imagelink + ')"><h4>' + rec.Type + '</h4><span class="description">' + rec.Name + '</span></a></li>');
		//Append the in-depth info and links
		displaydesc.append('<div id="thumb' + thumbnumber + '">' + '<div class="media"><iframe src="' + rec.yUrl + '" width="512" height="370" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>' + '<h1 class="titlename">' + rec.Name + '</h1>'+ '<a href="' + rec.wUrl + '" class="moreinfo">Learn More</a>' + '<button type="button" class="addmetoo">I like this!</button>' + '<p>' + rec.wTeaser + '</p>' + '</div>');
	/*Don't forget category books don't have youtube videos*/
	if (rec.Type === "book" || rec.Type === "Book" || rec.Type === "Author" || rec.Type === "author") {
		var thumbnum = "#thumb" + thumbnumber;
		var notube = $(thumbnum).find('.media');
		notube.hide();
	}
	//Run the grid code!
	$(".thumbs").portfolio({
		cols: 3,
    	transition: 'slideDown'
	});
}
//Allow user to get better search results by inputting what else they like
function recMeMore() {
	$('.alsolike').on('click',function(e) {
		var morelikes = $('.morelike').val();
		if (morelikes !== '') {
			$('#grid-section').fadeOut();
			$('.thumbs, .portfolio-content').empty();
			//Send the query to Tastekid!
			getTastekid(userlikes, morelikes);
			$('#grid-section').fadeIn();
			$('.morelike').val('');
		}
		e.preventDefault();
	})
}
//Allow users to click "I also like this!" to get better results.
function alsoLikeClick() {
	$('.thumbs').on('click','.addmetoo',function(e) {
		//Find the title of what user just clicked like for:
		var foundtitle = $(this).parent().find('.titlename').text();
		console.log('foundtitle is: ' + foundtitle);
		$('#grid-section').fadeOut();
		$('.thumbs, .portfolio-content').empty();
		getTastekid(userlikes, foundtitle);
		$('#grid-section').fadeIn();
		e.preventDefault();
	})
}