//	lib.mono.date.js
//	Evadne Wu at Iridia, 2010





String.prototype.clone = function() {
	
	return this.slice(0);
	
}





String.prototype.padToLengthWithPaddingString = function(destinationLength, paddingString) {

	if (!destinationLength) return String(this);
	paddingString = paddingString || "0";

	if (this.length >= destinationLength)
	return String(this);

	var finalString = "" + this;

	for (var i = 0; i <= (destinationLength - this.length - 1); i++)
	finalString = (paddingString + finalString);
	
	return finalString;
	
}





Date.prototype.format = function(formatString) {

	//	e.g. "#{MONTH} / #{DATE}  #{HOURS}:#{MINUTES}";
	
	var templates = {
	
		"YEAR": this.getFullYear(),
		"MONTH": this.getMonth() + 1,
		"DAY": this.getDate(),			//	Why the day is called “date” is beyond imagination

		"HOURS": this.getHours(),
		"MINUTES": this.getMinutes(),
		"SECONDS": this.getSeconds()
	
	}
	
	var responseString = "" + formatString;
	
	//	Expressions:	
	//	#\\{MONTH(?:, )?(?:\\d+)?\\}	in JS strings
	//	#\{MONTH(?:, )?(?:\d+)?\}	in JS Regexs
	//	#{MONTH(?:, )?(?:\d+)?}		in actual values, matches particle parts e.g. #{MONTH, 24}, or #{MONTH}.
	
	
	
	
	
	var parseDigitPredicate = function(inputString) {
	
		if (!inputString) return undefined;
		inputString = String(inputString);
	
		var pattern = /(\d+)(})/ig;
	
		if (inputString.match(pattern) != null)
		return Number(String(inputString.match(pattern)[0]).replace((pattern), '$1'));
	
		return undefined;
		
	}
	
	
	
	
	
	for (templateItemKey in templates) {
	
		if (!templates.hasOwnProperty(templateItemKey)) break;
		
		var pattern = new RegExp("(#\\{)(" + templateItemKey + ")(?:, )?(?:\\d+)?(\\})", "ig");
		
		templateTagOccurrances = formatString.match(pattern);
		if (templateTagOccurrances == null) continue;

		for (var templateItemOccurranceKey = 0; templateItemOccurranceKey < templateTagOccurrances.length; templateItemOccurranceKey++) {
		
			templateItemOccurranceString = String(templateTagOccurrances[templateItemOccurranceKey]);
			
			if (templateItemOccurranceString == '') continue;
			
			formatString = formatString.replace(
			
				templateItemOccurranceString,

				String(templates[templateItemKey]).padToLengthWithPaddingString(parseDigitPredicate(templateItemOccurranceString), "0")
			
			);
					
		}
	
	}
	
	return formatString;
	
}





//	Traversing in time

	Date.prototype.nextDay = function() {
	
		return new Date(this.setDate(parseInt(this.getDate()) + 1));
	
	}

	Date.prototype.previousDay = function () {
	
		return new Date(this.setDate(parseInt(this.getDate()) - 1));
	
	}
	
	Date.prototype.nextMonth = function() {
	
		return new Date(this.setMonth(parseInt(this.getMonth()) + 1));
	
	}

	Date.prototype.previousMonth = function () {
	
		return new Date(this.setMonth(parseInt(this.getMonth()) - 1));
	
	}
	
	Date.prototype.nextYear = function() {
	
		return new Date(this.setYear(parseInt(this.getYear()) + 1));
	
	}

	Date.prototype.previousYear = function () {
	
		return new Date(this.setYear(parseInt(this.getYear()) - 1));
	
	}










	//	Parsing & forming literals





	Date.fromISO8601 = function (inString) {
	
	//	ISO 8601: "2010-07-10T16:00:00.000+08:00"
	
		var dateString = String(inString);
		var dateObject = Date.parse(inString);
		if (isNaN(dateObject)) dateObject = new Date();
		
		var datePattern = /(\d{4})-?(\d{2})-?(\d{2})/;
		var timePattern = /(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/;
		var timeZoneOffsetPattern = /(Z|\+|-)(\d{2}):?(\d{2})/;
		
		var dateStringPattern = new RegExp(datePattern.source + "T?" + timePattern.source + timeZoneOffsetPattern.source + "?");
		if (dateString.match(dateStringPattern) == null) return dateObject;
		
		
		var dateMatches = dateString.match(datePattern);
		if (dateMatches == null) return dateObject;
		
		dateObject.setUTCDate(1);
		dateObject.setUTCFullYear(parseInt(dateMatches[1], 10));
		dateObject.setUTCMonth(parseInt(dateMatches[2]) - 1);
		dateObject.setUTCDate(parseInt(dateMatches[3]));
		
		
		var timeMatches = dateString.match(timePattern);
		if (timeMatches == null) return dateObject;
		
		dateObject.setUTCHours(parseInt(timeMatches[1]));
		dateObject.setUTCMinutes(parseInt(timeMatches[2]));
		dateObject.setUTCSeconds(parseInt(timeMatches[3]));
		dateObject.setUTCMilliseconds(parseFloat(timeMatches[4]));
		
				
		var timeZoneOffsetMatches = dateString.match(timeZoneOffsetPattern);
		if (timeZoneOffsetMatches == null) return dateObject;
		
		var timeZoneOffsetMultiplier = (function(offsetLiteral){
				
			switch (offsetLiteral) {
			
				case "+": return 1; break;
				case "-": return -1; break;
				default: return 0; break;
				
			}
		
		})(timeZoneOffsetMatches[1]);
		
		var localTimeZoneOffsetInMinutes = dateObject.getTimezoneOffset();
		var inDateTimeZoneOffsetInMinutes = parseInt(timeMatches[2]) * 60 + parseInt(timeMatches[3]);
	
		return new Date(Number(dateObject) + (inDateTimeZoneOffsetInMinutes - localTimeZoneOffsetInMinutes) * (60 * 1000));
		
	}




