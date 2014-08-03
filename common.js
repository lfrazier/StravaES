// Constants
var milesToKilometers = 1.60934;
var kilometersToMiles = 1.0 / milesToKilometers;
var feetToMeters = 0.3048;
var metersToFeet = 1.0 / feetToMeters;
// seconds per mile, seconds per kilometer
var perMileToPerKilometer = 0.62137119223733;
var perKilometerToPerMile = 1/ perMileToPerKilometer;
var distanceUnits = {metric: "km", imperial: "mi"};
var elevationUnits = {metric: "m", imperial: "ft"};
var paceUnits = {metric: "/km", imperial: "/mi"};
var distanceCoefficient = {
	metric: milesToKilometers,
	imperial: kilometersToMiles, 
};
var elevationCoefficient = { 
	metric: feetToMeters,
	imperial: metersToFeet
};
var paceCoefficient = {
	metric: perMileToPerKilometer,
	imperial: perKilometerToPerMile
};

function convertUnits(fromUnits) {
	var toUnits;
	if (fromUnits === "metric") { 
		toUnits = "imperial";
	} else {
		toUnits = "metric";
	}
	debugger;
	activityFeed(fromUnits, toUnits);
	athleteTraining(fromUnits, toUnits);
}

function scrapeUnits() {
	var foundUnits;
	unitSpans = document.querySelectorAll(".unit", ".week-total-unit");
	debugger;
	Array.prototype.slice.call(unitSpans).forEach(function(element, index) {
		var units = element.textContent.trim();
		if (units === "mi" || units === "/mi" || units === "ft") {
			foundUnits = "imperial";
		} else {
			foundUnits = "metric";
		}
	});
	return foundUnits;
}

function decimalRound(value, decimals) {
	if (!decimals) {
		decimals = 0;
	}
	var newValue = value * Math.pow(10, decimals);
	newValue = Math.round(newValue);
	return newValue / Math.pow(10, decimals);
}

function timeInSeconds (timeString) {
	var parts = timeString.split(":");
	if (parts.length < 2) {
		return 0;
	}
	var hours;
	var minutes;
	var seconds;
	if (parts.length === 2) {
		hours = 0;
		minutes = parseInt(parts[0]);
		seconds = parseInt(parts[1]);
	} else {
		hours = parseInt(parts[0]);
		minutes = parseInt(parts[1]);
		seconds = parseInt(parts[2]);
	}
	return (3600 * hours) + (60 * minutes) + seconds;
}

function stringFromSeconds (sec) {
	var hours = Math.floor(sec / 3600);
	var minutes = Math.floor((sec / 60) % 60);
	var seconds = Math.round(sec % 60);
	if (hours === 0) {
		return minutes + ":" + seconds;
	}
	return hours + ":" + minutes + ":" + seconds;
}

function activityFeed(fromUnits, toUnits) {
	distances = document.querySelectorAll(".unit");
	Array.prototype.slice.call(distances).forEach(function(element, index) {
		if (element.title === "hour" || element.title === "minute") {
			return;
		}
		var units = element.textContent.trim();
		var parentNode = element.parentNode;
		var text = parentNode.textContent;
		var resultDict;
		if (units === paceUnits[fromUnits]) {
			resultDict = convertPace(text, fromUnits, toUnits);
			parentNode.innerHTML = resultDict["newValue"] + '<span class="unit">' + resultDict["newUnits"] + '</span>';
		} else {
			resultDict = convertDistance(text, units, fromUnits, toUnits);
			parentNode.innerHTML = decimalRound(resultDict["newValue"], 1) + '<span class="unit">' + resultDict["newUnits"] + '</span>';
		}
	});
}

function convertPace(text, fromUnits, toUnits) {
	var newPace;
	var newText = text.replace(/\d+:\d+(:\d+)?/, function(n) {
		// Convert from hh:mm:ss to s
		var pace = timeInSeconds(n);
		var convertedPace = pace * paceCoefficient[toUnits];
		// Convert back to hh:mm:ss
		newPace = stringFromSeconds(convertedPace);
		newUnits = paceUnits[toUnits];
	});
	return {"newValue": newPace, "newUnits": newUnits};
}

function convertDistance(text, currentUnits, fromUnits, toUnits) {
	var newLength;
	var newText = text.replace(/\d+(\.\d+)?/g, function(n) {
		var length = parseFloat(n);
		if (currentUnits === distanceUnits[fromUnits]) {
			newLength = length * distanceCoefficient[toUnits];
			newUnits = distanceUnits[toUnits];
		} else {
			newLength = length * elevationCoefficient[toUnits];
			newUnits = elevationUnits[toUnits];
		}
	});
	return {"newValue": newLength, "newUnits": newUnits};
}

function athleteTraining(fromUnits, toUnits) {
	debugger;
	distances = document.querySelectorAll(".week-total-unit");
	Array.prototype.slice.call(distances).forEach(function(element, index) {
		debugger;
		var units = element.textContent.trim();
		var parentNode = element.parentNode;
		var text = parentNode.textContent;
		var resultDict = convertDistance(text, units, fromUnits, toUnits);
		parentNode.innerHTML = decimalRound(resultDict["newValue"], 1) + '<tspan class="week-total-unit">' + resultDict["newUnits"] + '</tspan>';
	});
}

convertUnits(scrapeUnits());
