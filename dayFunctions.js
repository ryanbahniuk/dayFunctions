function getTime() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	seconds = seconds + (minutes * 60) + (hours * 60 * 60);
	return seconds;
}

function getGreeting(seconds) {
	//86400 seconds in a day
	//1 - 21599 = good night
	//21600 - 43199 = good morning
	//43200 - 64799 = good afternoon
	//64800 - 86400 = good evening
	
	if (seconds <= 21599) {
		$('#greeting').text("Goodnight");
	} else if (seconds >= 21600 && seconds <= 43199) {
		$('#greeting').text("Good Morning");
	} else if (seconds >= 43200 && seconds <= 64799) {
		$('#greeting').text("Good Afternoon");
	} else if (seconds >= 64800 && seconds <= 86400) {
		$('#greeting').text("Good Evening");
	} else {
		$('#greeting').text("Hello");
	}
}

function orbit(seconds) {
	//86400 seconds in a day
	//at 0 the rotation should be at 0 degrees
	//at 21600 the rotation should be at -90
	//at 43200 the rotation should be at -180
	//at 64800 the rotation should be at -270
	$('#sun-moon').css("display", "inline-block");
	var degrees = -(seconds) / 240;
	var rotation = "rotate(" + degrees + "deg)";
	var moonRotation = "rotate(" + (degrees * -1) + "deg)";
	$('#sun-moon').css("transform", rotation);
	$('#sun-moon').css("-ms-transform", rotation);
	$('#sun-moon').css("-webkit-transform", rotation);
	$('#moon').css("transform", moonRotation);
	$('#moon').css("-ms-transform", moonRotation);
	$('#moon').css("-webkit-transform", moonRotation);
}

function skyFeatures(seconds) {
	//between 64800 and 21600 the stars should be visible
	//between 21600 and 64800 the clouds should be visible
	//acceptable range of placement is top: 0-100px and left: screen width
	var screenWidth = $(window).width();
	var incrementer = 1;

	if ((seconds < 10800) || (seconds > 75600)) {
		$('.fa-star-o').css("display", "block");
		$('.fa-cloud').css("display", "none");
	} else if ((seconds < 54000)  && (seconds > 32400)) {
		$('.fa-cloud').css("display", "block");
		$('.fa-star-o').css("display", "none");
	} else {
		$('.fa-cloud').css("display", "none");
		$('.fa-star-o').css("display", "none");
	}

	$('.sky-feature').each(function(){
		if ($(this).css("display") == "block") {
			var xRange = Math.floor((Math.random() * 90) + 1) + 5;
			var xRange = xRange + "%";
			var yRange = ($('#sun-moon').css("top").substring(-2, 2) * incrementer) - 10;
			$(this).css("top", yRange);
			$(this).css("left", xRange);
			incrementer++;
		}
	});
}

function skyColor(seconds) {
	//at 0 the color should be 000000
	//at 43200 the color should be 387bd2
	//at 64800 the color should be halfway between 387bd2 and 000000
	
	var midnight = {
		'R'     : 0,
		'G'     : 0,
		'B'     : 0
	};
	var noon = {
		'R'     : 56,
		'G'     : 123,
		'B'     : 210
	};
	
	var rIncrement, gIncrement, bIncrement, newR, newG, newB, newRGB;
	var differencesMidnightNoon = compareColor(midnight, noon);
	var differencesNoonMidnight = compareColor(noon, midnight);
	var midnightTime = 0;
	var noonTime = 43200;
	var endOfDayTime = 86400;

	if (seconds == midnightTime) {
		newRGB = midnight['R'] + ", " + midnight['G'] + ", " + midnight['B'];
	} else if ((seconds > midnightTime) && (seconds < noonTime)) {
		rIncrement = differencesMidnightNoon['R'] / ((noonTime - midnightTime) - 1);
		gIncrement = differencesMidnightNoon['G'] / ((noonTime - midnightTime) - 1);
		bIncrement = differencesMidnightNoon['B'] / ((noonTime - midnightTime) - 1);

		newR = Math.floor(midnight['R'] + (rIncrement * (seconds - midnightTime)));
		newG = Math.floor(midnight['G'] + (gIncrement * (seconds - midnightTime)));
		newB = Math.floor(midnight['B'] + (bIncrement * (seconds - midnightTime)));

		newRGB = newR + ", " + newG + ", " + newB;
	} else if (seconds == noonTime) {
		newRGB = noon['R'] + ", " + noon['G'] + ", " + noon['B'];
	} else if ((seconds > noonTime) && (seconds < endOfDayTime)) {
		rIncrement = differencesNoonMidnight['R'] / ((endOfDayTime - noonTime) - 1);
		gIncrement = differencesNoonMidnight['G'] / ((endOfDayTime - noonTime) - 1);
		bIncrement = differencesNoonMidnight['B'] / ((endOfDayTime - noonTime) - 1);

		newR = Math.floor(noon['R'] + (rIncrement * (seconds - noonTime)));
		newG = Math.floor(noon['G'] + (gIncrement * (seconds - noonTime)));
		newB = Math.floor(noon['B'] + (bIncrement * (seconds - noonTime)));

		newRGB = newR + ", " + newG + ", " + newB;
	} else if (seconds == endOfDayTime) {
		newRGB = midnight['R'] + ", " + midnight['G'] + ", " + midnight['B'];
	}

	$('.sky-color').css("background-color", "rgb(" + newRGB + ")");
	$('a, h1').not('#wpadminbar a').css("color", "rgb(" + newRGB + ")");
}

function compareColor(color1, color2) {
	var differences = {
		'R'     : color2['R'] - color1['R'],
		'G'     : color2['G'] - color1['G'],
		'B'     : color2['B'] - color1['B']
	};
	return differences;
}