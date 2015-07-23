//JQuery Code:
$(document).ready(function() {
	$('#grid-section').hide(); //Hide grid section in the beginning
	 $('.recommenedmore').hide(); // Hide the what else do you like div
	var userlikes;//global
	downarrow();
	whatuserlikes();
	rotatewords();
	recmemore();
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
	$('.user-submit').click(function(ent) {
		scrolltogrid();
		ent.preventDefault();
	})
	$('.user-input').keydown(function(ent) {
		if (ent.which == 13) {
			scrolltogrid();
			ent.preventDefault(); // Do not reload on submission
		} 
	});
}
function scrolltogrid() {
	userlikes = $('.user-input').val();//global variable for better search results
			if (userlikes !== '') {
			//Send the query to Tastekid!
			getTastekid(userlikes, 'null');
			$('#grid-section').fadeIn('medium');
			$('body, html').animate({
			scrollTop: $('#grid-section').offset().top}, 1000);
			$('.user-input').val('');
			}
}
//Animates the rotation of words in the statmenet before input
function rotatewords() {
	var words = ['artist','movie','game','book','author', 'tv-show'];
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

function getTastekid(query, newquery) {
	var request = {
		k: "147333-grinberg-Q21V1S5Z",
		info: 1,
		verbose: 1,
		format: "JSON"
	};
	var searchme = "https://www.tastekid.com/api/similar?q=";
	if (newquery !== 'null') {
		searchme += ('%2C+' + newquery);
	
	}
	else {
		searchme += query;
	}
	$.ajax({
		url: searchme,
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		console.log('searchme is: ' + searchme);
		//Show the item the user likes
		$.each(result.Similar.Info, function(i, item) {
			getBing(query, item.Type, item, 1);
		});
		var thumbnumber = 1;
		//Show the recommeneded items that are similar
		$.each(result.Similar.Results, function(i, item) {
			var simResExec = true;
			//Need to change the thumb number so the correct information gets displayed
			if(simResExec = true) {
			thumbnumber++;
				//Show 10 similar results
				if(thumbnumber <= 12) {
					console.log('thumbernumber is now: ' + thumbnumber);
			getBing(item.Name, item.Type, item, thumbnumber);
			//displayinfo(item, thumbnumber);
				}
			}	
		});
	})
	.fail(function(jqXHR, error, errorThrown) {
		console.log('you messed up');
	})
}
function getBing(searchquery, type, displayitem, displaythumbnumber) {
	var serviceURL = 'https://api.datamarket.azure.com/Bing/Search/v1/Image'; 
	var AppId = ":O6C5e3SgWA9+peQEUMmHD1Y2T9HvafJAJz0KNruu+o0";//StackOverflow says to add a colon in front of your ID!!
	var EncAppId = btoa(AppId);
	var search = "?Query=%27%" + searchquery;
	var typesearch = "%20" + type +	"%27";
	var size = "&ImageFilters=%27Aspect%3AWide%27";
	var format = "&$format=json";
	var burl = serviceURL + search + typesearch + size + format;
	
	var bresult = $.ajax({
		url: burl,
		type: 'GET',
		headers: {	'Authorization': "Basic " + EncAppId}
	})
	.success( bresult = function(bingdata) {
		console.log('bing query worked');
		displayinfo(displayitem, displaythumbnumber, bingdata.d.results[0].MediaUrl);
	})
	.fail(function(jqXHR, error, errorThrown) {
		console.log(' Bing Result :Failed');
	})
}
function displayinfo(rec, thumbnumber, imgurl) {
	var displaythumbs = $('#grid-section').find('.thumbs');
	var displaydesc = $('#grid-section').find('.portfolio-content');
	console.log(rec.Name);
	var imagelink = imgurl; // replace this with actual links
		//Append the thumbs portion for each entry
		displaythumbs.append('<li><a href="#thumb' + thumbnumber + '" class="thumbnail" ' + 'style="background-image: url(' + imagelink + ')"><h4>' + rec.Type + '</h4><span class="description">' + rec.Name + '</span></a></li>');
		//Append the in-depth info and links
		displaydesc.append('<div id="thumb' + thumbnumber + '">' + '<div class="media"><iframe src="' + rec.yUrl + '" width="512" height="370" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>' + '<h1>' + rec.Name + '</h1><p>' + rec.wTeaser + '</p> <a href="' + rec.wUrl + '" class="btn btn-primary">Learn More</a></div>');
	/*Don't forget category books don't have youtube videos*/
	if (rec.Type === "book" || rec.Type === "Book" || rec.Type === "Author" || rec.Type === "author") {
		var thumbnum = "#thumb" + thumbnumber;
		var notube = $(thumbnum).find('.media');
		console.log('found you')
		notube.hide();
	}
	//Run the grid code!
	$(".thumbs").portfolio({
		cols: 3,
    	transition: 'slideDown'
	});
}
//Allow user to get better search results by inputting what else they like
function recmemore() {
	$('.alsolike').click(function(ent) {
		var morelikes = $('.morelike').val();
		if (morelikes !== '') {
			$('#grid-section').fadeOut();
			$('.thumbs, .portfolio-content').empty();
			//Send the query to Tastekid!
			getTastekid(userlikes, morelikes);
			$('.alsolike').val('');
		}
		ent.preventDefault();
	})
	$('.morelike').keydown(function(ent) {
		if (ent.which == 13) {
			var morelikes = $('.morelike').val();
			if (morelikes !== '') {
				$('#grid-section').hide();
				//Send the query to Tastekid!
				getTastekid(userlikes, morelikes);
				$('#grid-section').fadeIn();
			}
		$('.alsolike').val('');
		}
		ent.preventDefault();
	});
}