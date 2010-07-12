//	lib.mono.date.js
//	Evadne Wu at Iridia, 2010










//	Helpers

	String.prototype.clone = function () {
		
		return this.slice(0);
		
	}

	String.prototype.padToLengthWithPaddingString = function (destinationLength, paddingString) {
	
		if (!destinationLength) return this;
		if (this.length >= destinationLength) return this;

		if (!paddingString) paddingString = "0";
	
		var finalString = this.clone();
	
		for (var i = 0; i <= (destinationLength - this.length - 1); i++)
		finalString = (paddingString + finalString);
		
		return finalString;
		
	}










//	Formatting

	Date.prototype.format = function (formatString) {
	
		//	e.g. "#{MONTH} / #{DATE}  #{HOURS}:#{MINUTES}";
		
		var templates = {
		
			"YEAR": this.getFullYear(),
			"MONTH": this.getMonth() + 1,
			"DAY": this.getDate(),			//	Why the day is called “date” is beyond imagination
	
			"HOURS": this.getHours(),
			"MINUTES": this.getMinutes(),
			"SECONDS": this.getSeconds(),
			
			"UTCHOURS": this.getUTCHours(),
			"UTCMINUTES": this.getUTCMinutes(),
			"UTCSECONDS": this.getUTCSeconds(),
			"UTCMILLISECONDS": this.getUTCMilliseconds(),
		
		}
		
		
		
		
		
		var responseString = String(formatString);
		
		//	Expressions:	
		//	#\\{MONTH(?:, )?(?:\\d+)?\\}	in JS strings
		//	#\{MONTH(?:, )?(?:\d+)?\}	in JS Regexs
		//	#{MONTH(?:, )?(?:\d+)?}		in actual values, matches particle parts e.g. #{MONTH, 24}, or #{MONTH}.
		
		
		
		
		
		var parseDigitPredicate = function (inputString) {
		
			if (!inputString) return undefined;
			
			var inputString = String(inputString);
			var pattern = /(\d+)(})/ig;
			var inputMatches = inputString.match(pattern);
		
			if (!inputMatches) return undefined;
			
			return parseInt(String(inputMatches[0]).replace(pattern, '$1'));
		
			
		}
		
		
		
		
		
	//	Smoking some Objective-C won’t hurt.  I don’t really remember what “true” means.
		
		var kjQueryEachLoopBreakingModeBreakLoop = false;
		var kjQueryEachLoopBreakingModeContinueNextIteration = true;
		
		$.each(templates, function (templateItemKey, templateItemValue) {
		
			var pattern = new RegExp("(#\\{)(" + templateItemKey + ")(?:, )?(?:\\d+)?(\\})", "ig");
			var templateTagOccurrances = formatString.match(pattern);
			
			if (!templateTagOccurrances)
			return kjQueryEachLoopBreakingModeContinueNextIteration;
			
			$.each(templateTagOccurrances, function (templateTagOccurranceIndex, templateTagOccurrance) {
			
				var templateItemOccurranceString = String(templateTagOccurrance);
				
				formatString = formatString.replace(
				
					templateItemOccurranceString,
	
					String(templateItemValue).padToLengthWithPaddingString(
					
						parseDigitPredicate(templateItemOccurranceString), 
						"0"
						
					)
				
				);
				
			});
		
		});
		
		return formatString;
		
	}










//	Traversing in time

	Date.prototype.getDayInMonth = function () {
		
		return this.getDate();
		
	}

	Date.prototype.nextDay = function () {
	
		return new Date((new Date(this)).setDate(parseInt(this.getDate()) + 1));
	
	}

	Date.prototype.previousDay = function () {
	
		return new Date((new Date(this)).setDate(parseInt(this.getDate()) - 1));
	
	}
	
	Date.prototype.nextMonth = function () {
	
		return new Date((new Date(this)).setMonth(parseInt(this.getMonth()) + 1));
	
	}

	Date.prototype.previousMonth = function () {
	
		return new Date((new Date(this)).setMonth(parseInt(this.getMonth()) - 1));
	
	}
	
	Date.prototype.nextYear = function () {
	
		return new Date((new Date(this)).setUTCFullYear(parseInt(this.getUTCFullYear()) + 1));
	
	}

	Date.prototype.previousYear = function () {
	
		return new Date((new Date(this)).setUTCFullYear(parseInt(this.getUTCFullYear()) - 1));
	
	}
	
	Date.prototype.firstDayInMonth = function () {
		
		return new Date((new Date(this)).setDate(1));
		
	}
	
	Date.prototype.lastDayInMonth = function () {
		
		return this.nextMonth().firstDayInMonth().previousDay();
		
	}
	
	Date.prototype.firstMonthInYear = function () {
		
		return new Date(this.getUTCFullYear(), 0, this.getDate());
		
	}
	
	Date.prototype.lastMonthInYear = function () {
		
		return new Date(this.getUTCFullYear(), 11, this.getDate());
		
	}
	
	Date.prototype.firstDayInWeek = function () {
		
		return new Date(new Date(this).setDate(this.getDate() + (0 - this.getDay())));
		
	}
	
	Date.prototype.lastDayInWeek = function () {
		
		return new Date(new Date(this).setDate(this.getDate() + (6 - this.getDay())));
		
	}










//	Date Names
	
	Date.prototype.getDateName = function () {
		
		return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()];
		
	}
	
	Date.prototype.getMonthName = function () {
		
		return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.getMonth()];
		
	}
	
	
	
	
	
	
	
	
	
	
//	Missing Introspection Methods

	Date.prototype.getWeek = function () {
	
		return Math.ceil((this - this.firstMonthInYear().firstDayInMonth().firstDayInWeek()) / ((this - this.previousDay()) * 7));
		
	}










//	Helper Methods


	Date.millisecondsFromUnit = function (inUnitName) {
	
		if (inUnitName == "weeks") {
		
			return Date.millisecondsFromUnit("days") * 7;
		
		}
		
		var responseValue = 1;
		var unitExists = false;
		
		var unitMultiplicatorValues = {
		
			"seconds": 1000,
			"minutes": 60,
			"hours": 60,
			"days": 24,
			"years": 365
		
		};
	
		$.each(unitMultiplicatorValues, function (unitName, unitMultiplicator) {
		
			responseValue *= unitMultiplicator;			
			if (unitName == inUnitName) {
				
				unitExists = true;
				return false;
				
			}
			
		});
		
		if (!unitExists) return undefined;
		return responseValue;
	
	}

	

//	Parsing & forming literals

	Date.prototype.toISO8601 = function () {
	
		return this.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2}T#{UTCHOURS, 2}:#{UTCMINUTES, 2}:#{UTCSECONDS, 2}Z");
	
	}

	
	Date.fromISO8601 = function (inString, dateStringContainsDateOnly) {
	
	//	ISO 8601: "2010-07-10T16:00:00.000+08:00"
	
		if (dateStringContainsDateOnly) {
		
			var timeZoneOffsetInMinutes = -1 * (new Date()).getTimezoneOffset();
			var timeZoneSign = (timeZoneOffsetInMinutes < 0) ? "-" : "+";
			
			inString = inString + "T00:00:00.000" + timeZoneSign + String(Math.floor(timeZoneOffsetInMinutes / 60)).padToLengthWithPaddingString(2) + ":" + String((timeZoneOffsetInMinutes % 60)).padToLengthWithPaddingString(2)
		
		}
	
		var dateString = String(inString);
		var dateObject = Date.parse(inString);
		if (isNaN(dateObject)) dateObject = new Date();
		
		var datePattern = /(\d{4})-?(\d{2})-?(\d{2})/;
		var timePattern = /(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/;
		var timeZoneOffsetPattern = /Z|(?:(\+|-)(\d{2}):?(\d{2}))/;
		
		var dateStringPattern = new RegExp(datePattern.source + "T?" + timePattern.source + timeZoneOffsetPattern.source + "?");
		
		if (dateString.match(dateStringPattern) == null) return undefined;
				
		
		var dateMatches = dateString.match(datePattern);
		if (dateMatches == null) return dateObject;
		
		dateObject.setUTCDate(1);
		dateObject.setUTCFullYear(parseInt(dateMatches[1], 10));
		dateObject.setUTCMonth(parseInt(dateMatches[2]) - 1);
		dateObject.setUTCDate(parseInt(dateMatches[3]));
		
		
		var timeMatches = dateString.match(timePattern);
		if (timeMatches == null) return dateObject;
		
		dateObject.setUTCHours(parseInt(timeMatches[1]) || 0);
		dateObject.setUTCMinutes(parseInt(timeMatches[2]) || 0);
		dateObject.setUTCSeconds(parseInt(timeMatches[3]) || 0);
		dateObject.setUTCMilliseconds(parseFloat(timeMatches[4]) || 0);
		
		var timeZoneOffsetMatches = dateString.match(timeZoneOffsetPattern);
		
		if (timeZoneOffsetMatches == null) return dateObject;
		if (timeZoneOffsetMatches[0] == "Z") return dateObject;


	//	Nota: the input timezone is offset already if the code below this line continues
	
		var timeZoneOffsetMultiplier = (function (offsetLiteral){
				
			switch (offsetLiteral) {
			
				case "+": return 1; break;
				case "-": return -1; break;
				default: return 0; break;
				
			}
		
		})(timeZoneOffsetMatches[1]);
		
		var localTimeZoneOffsetInMinutes = dateObject.getTimezoneOffset();
		var inDateTimeZoneOffsetInMinutes = parseInt(timeMatches[2]) * 60 + parseInt(timeMatches[3]);
	
		return new Date(Number(dateObject) - (inDateTimeZoneOffsetInMinutes - localTimeZoneOffsetInMinutes) * (60 * 1000));
		
	}





//	Date Relativity

	Date.prototype.relativeDate = function () {
	
		var nowInMilliseconds = (new Date()).getTime();
		var recentDateInMilliseconds = this.getTime();
		
		var dateDifferenceInMilliseconds = recentDateInMilliseconds - nowInMilliseconds;
		
		var dateIsEarlier = (dateDifferenceInMilliseconds < 0);
		dateDifferenceInMilliseconds = Math.abs(dateDifferenceInMilliseconds);
		
		var differenceProportionsFromMilliseconds = {
		
			"seconds": 1000,
			"minutes": 60,
			"hours": 60,
			"days": 24,
			"years": 365.25
		
		};
		
		var finalDateDifferenceMagnitude = "milliseconds";
		var finalDateDifferenceValue = dateDifferenceInMilliseconds;
		var finalDateDifferenceValueMultiplicator = (dateIsEarlier ? -1 : 1);
		
		var workingDifferenceStore = 1;
		
		$.each(differenceProportionsFromMilliseconds, function (differenceLevel, differenceMultiplicator) {
		
			workingDifferenceStore *= differenceMultiplicator;
		
			if (Math.floor(dateDifferenceInMilliseconds / workingDifferenceStore) < 1) return;
			
			finalDateDifferenceMagnitude = differenceLevel;
			
			finalDateDifferenceValue = (dateDifferenceInMilliseconds / workingDifferenceStore);
			
		});
				
		return {
		
			"differenceUnit": finalDateDifferenceMagnitude,
			"differenceValue": finalDateDifferenceValueMultiplicator * Math.floor(finalDateDifferenceValue)
		}

	}
	
	
	
	
	
	Date.prototype.isInTheRecent = function (numberOfUnit, nameOfUnit) {
	
		return this.isInVicinity(numberOfUnit, nameOfUnit, 0, "milliseconds");
	
	}
	
	
	
	
	
	Date.prototype.isInTheFuture = function (numberOfUnit, nameOfUnit) {
	
		return this.isInVicinity(0, "milliseconds", numberOfUnit, nameOfUnit);
	
	}
	
	
	
	
	
	Date.prototype.isInVicinity = function (numberOfUnitInPast, nameOfUnitInPast, numberOfUnitInFuture, nameOfUnitInFuture) {
	
		var allowanceInPast = numberOfUnitInPast * (Date.millisecondsFromUnit(nameOfUnitInPast) || 0);
		
		var allowanceInFuture = -1 * numberOfUnitInFuture * (Date.millisecondsFromUnit(nameOfUnitInFuture) || 0);
		
		var nowInMilliseconds = (new Date()).getTime();
		var comparedDateInMilliseconds = this.getTime();

		return (allowanceInPast <= (nowInMilliseconds - comparedDateInMilliseconds) <= allowanceInFuture);
	
	}




