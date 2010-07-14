//	lib.mono.date.js
//	Evadne Wu at Iridia, 2010

//	This library works with monoString.  We use an anonymous function to wrap everything so as to hide the code that sniffs for irLocalizedString.





	mono.dateAdditions = true;





(function (presets) {

//! 
//!	Presets Declaration

	var _irLocalizedString = presets._irLocalizedString;










//	! 
//	!Formatting

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
	
					String(templateItemValue).pad(
					
						parseDigitPredicate(templateItemOccurranceString), 
						"0"
						
					)
				
				);
				
			});
		
		});
		
		return formatString;
		
	}





//	! 
//	!Traversing in time

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





//	! 
//	!Date Names

	Date.prototype.getMonthName = function () {
		
		return _irLocalizedString("names", "months", this.getMonth()) || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.getMonth()];
		
	}
	
	Date.prototype.getWeekdayName = function () {
	
		return _irLocalizedString("names", "weekdays", this.getDay()) || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()];
	
	}
	
	Date.prototype.getDateName = Date.prototype.getWeekdayName;
	
	
	
	

//	! 	
//	!Introspection

	Date.prototype.getWeek = function () {
	
		return Math.ceil((this - this.firstMonthInYear().firstDayInMonth().firstDayInWeek()) / ((this - this.previousDay()) * 7));
		
	}





//	! 
//	!Helper


	Date.millisecondsFromUnit = function (inUnitName) {
	
		if (inUnitName == "weeks")
		return Date.millisecondsFromUnit("days") * 7;
		
		
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





//	! 
//	!Parsing & forming ISO Strings

	Date.prototype.toISO8601 = function () {
	
		return this.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2}T#{UTCHOURS, 2}:#{UTCMINUTES, 2}:#{UTCSECONDS, 2}Z");
	
	}

	
	Date.fromISO8601 = function (inString, dateStringContainsDateOnly) {
		
	//	ISO 8601: "2010-07-10T16:00:00.000+08:00"
	
		var dateString = String(inString);
	
		if (dateStringContainsDateOnly) {
		
			var timeZoneOffset = -1 * (new Date()).getTimezoneOffset();
			
			var timeZoneOffsetMinutes = String(Math.floor(timeZoneOffset / 60)).pad(2);
			
			var timeZoneOffsetHours = String((timeZoneOffset % 60)).pad(2);
			
			dateString = dateString + [
			
				"T00:00:00.000",
				
				((timeZoneOffsetMinutes < 0) ? "-" : "+"),
				timeZoneOffsetMinutes, ":", timeZoneOffsetHours
			
			].join("");
			
		}
		
		
		var dateObject = Date.parse(dateString);
		if (isNaN(dateObject)) dateObject = new Date();
		
		var datePattern = /(\d{4})-?(\d{2})-?(\d{2})/;
		var timePattern = /(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/;
		var timeZoneOffsetPattern = /(?:Z|(?:(\+|-)(\d{2}):?(\d{2})))/;
		
		var dateStringPattern = new RegExp(datePattern.source + "T?" + timePattern.source + timeZoneOffsetPattern.source + "?");
				
		if (dateString.match(dateStringPattern) == null)		
		return undefined;
		
		if (dateString.match(dateStringPattern)[0] == "")
		return undefined;		
				
		
		var dateMatches = dateString.match(datePattern);
		if (dateMatches == null) return dateObject;
		
		dateObject.setUTCDate(1);
		dateObject.setUTCFullYear(parseInt(dateMatches[1], 10));
		dateObject.setUTCMonth(parseInt(dateMatches[2], 10) - 1);
		dateObject.setUTCDate(parseInt(dateMatches[3], 10));
		
		
		var timeMatches = dateString.match(timePattern);
		if (timeMatches == null) return dateObject;
		
		dateObject.setUTCHours(parseInt(timeMatches[1], 10) || 0);
		dateObject.setUTCMinutes(parseInt(timeMatches[2], 10) || 0);
		dateObject.setUTCSeconds(parseInt(timeMatches[3], 10) || 0);
		dateObject.setUTCMilliseconds(parseFloat(timeMatches[4], 10) || 0);
		
		
		var timeZoneOffsetMatches = dateString.match(timeZoneOffsetPattern);
		
		if (timeZoneOffsetMatches == null) return dateObject;
		if (timeZoneOffsetMatches[0] == "Z") return dateObject;


	//	Nota: the input timezone is offset already if the code below this line continues
	
		var timeZoneOffsetMultiplier = (function (offsetLiteral){
				
			if (offsetLiteral == "+") return 1;
			if (offsetLiteral == "-") return -1;
			
			return 0;
		
		})(timeZoneOffsetMatches[1]);
		
		var localTimeZoneOffsetInMinutes = dateObject.getTimezoneOffset();
		var inDateTimeZoneOffsetInMinutes = parseInt(timeMatches[2], 10) * 60 + parseInt(timeMatches[3], 10);
			
		return new Date(Number(dateObject) - (inDateTimeZoneOffsetInMinutes - localTimeZoneOffsetInMinutes) * Date.millisecondsFromUnit("minutes"));
		
		
	}





//	! 
//	!Date Relativity

	Date.prototype.relativeDate = function (inMagnitude) {
	
		if (inMagnitude == "") return undefined;
		
		var makeResponse = function (differenceUnit, differenceValue) {

			return {
			
				"differenceUnit": differenceUnit,
				"differenceValue": differenceValue
			
			};	
		
		};
		
		var flooredDelta = function (inBaseValue, inUnit) {
		
			return ((inBaseValue >= 0) ? 1 : -1 ) * Math.floor(Math.abs(inBaseValue) / Math.abs(inUnit));
		
		}
		
		
		
		
		
		var now = new Date();
		
		switch (inMagnitude) {
		
			case "years": return makeResponse("years", 
				
				now.getUTCFullYear() - this.getUTCFullYear()
					
			); break;
				
			case "months":
			
				return makeResponse("months", 
				
					((this.getUTCFullYear() - 1) * 12 + this.getUTCMonth()) - ((now.getUTCFullYear() - 1) * 12 + now.getUTCMonth())
					
				);
			
				break;
			
				
			case "weeks":
			
				return makeResponse("weeks", 
				
					((this.getUTCFullYear() - 1) * 54 + this.getWeek()) - ((now.getUTCFullYear() - 1) * 54 + now.getWeek())
				
				); break;
			
			
			case "days":	
			case "milliseconds":
			case "seconds":
			case "minutes":
			case "hours":
			
				return makeResponse(inMagnitude, flooredDelta(
					
					(this.getTime() - now.getTime()),
					Date.millisecondsFromUnit(inMagnitude)
						
				)); break;
			
				
			default: 
			
			//	We’ll have to make out the most meaningful level, starting from milliseconds — eh.
			
			//	var finalDateDifferenceMagnitude = "milliseconds";
				var finalDateDifferenceMagnitude = "days";
				
				var timeDelta = this.getTime() - now.getTime();
			
				$.each(["milliseconds", "seconds", "minutes", "hours", "days", "weeks", "years"], function (differenceLevelIndex, differenceLevelName) {
				
					if (Math.abs(flooredDelta(
					
						timeDelta,
						Date.millisecondsFromUnit(differenceLevelName)
							
					)) < 1) return false;
					
					finalDateDifferenceMagnitude = differenceLevelName;
					
				});
				
				return this.relativeDate(finalDateDifferenceMagnitude);
				
				break;
		
		}

	}
	
	
	
	

//	! 
//	!Presenting Relativity
	
	Date.prototype.isInTheRecent = function (numberOfUnit, nameOfUnit) {
	
		return this.isInVicinity(numberOfUnit, nameOfUnit, 0, "milliseconds");
	
	}
	
	
	
	
	
	Date.prototype.isInTheFuture = function (numberOfUnit, nameOfUnit) {
	
		return this.isInVicinity(0, "milliseconds", numberOfUnit, nameOfUnit);
	
	}
	
	
	
	
	
	Date.prototype.isInVicinity = function (numberOfUnitInPast, nameOfUnitInPast, numberOfUnitInFuture, nameOfUnitInFuture) {
	
		numberOfUnitInFuture = numberOfUnitInFuture || numberOfUnitInPast;
		nameOfUnitInFuture = nameOfUnitInFuture || nameOfUnitInPast;
	
		var nowInMilliseconds = (new Date()).getTime();
	
		var allowancePast = nowInMilliseconds - numberOfUnitInPast * (Date.millisecondsFromUnit(nameOfUnitInPast) || 0);
		
		var allowanceFuture = nowInMilliseconds + numberOfUnitInFuture * (Date.millisecondsFromUnit(nameOfUnitInFuture) || 0);
		
		var comparedDateInMilliseconds = this.getTime();
		
		return ((allowancePast <= comparedDateInMilliseconds) && (comparedDateInMilliseconds <= allowanceFuture));
	
	}





//	! 
//	!Localized Relative Date

	Date.prototype.relativeDateLocalized = function (inMagnitude) {
	
	
	//	Decoration.  Some magnitudes are merely “decorated”, e.g. the weekdays are “decorated” weeks.  We use hashes because if the key does not exist in a hash the query will return undefined and the guard takes place.
	
		var relativeDate = this.relativeDate({
		
			"weekdays": "weeks"
			
		}[inMagnitude] || inMagnitude);
		
		var inUnit = ({
		
			"weekdays": "weekdays"
			
		}[inMagnitude] || relativeDate.differenceUnit);
		
		var inDifference = relativeDate.differenceValue;
		
		var templates = {
		
			"DIFFERENCE_VALUE": Math.abs(inDifference),

			"WEEKDAY_NAME": this.getWeekdayName(),
			"DIFFERENCE_IN_WEEKS": Math.abs(this.relativeDate("weeks").differenceValue)
		
		};
	
		
	//	Localized String	

		
		
		
		//	These strings are localized under mono.date.relativeDate.{scope} but we do not transform them now.  We do that later on-demand.
		
		var localizationTransforms = {
		
			"days": {
			
				"< -2": "#{DIFFERENCE_VALUE} days ago",
				"== -2": "the day before yesterday",
				"== -1": "yesterday",
				"== 0": "today",
				"== 1": "tomorrow",
				"== 2": "the day after tomorrow",
				"> 2": "#{DIFFERENCE_VALUE} days after"
			
			},
			
			"weeks": {
			
				"< -2": "#{DIFFERENCE_VALUE} weeks ago",
				"== -2": "#{DIFFERENCE_VALUE} weeks ago",
				"== -1": "last week",
				"== 0": "this week",
				"== 1": "next week",
				"== 2": "#{DIFFERENCE_VALUE} weeks after",
				"> 2": "#{DIFFERENCE_VALUE} weeks after"
			
			},
			
			"weekdays": {
			
				"< -1": "the #{WEEKDAY_NAME} #{DIFFERENCE_IN_WEEKS} weeks ago",
				"== -1": "last #{WEEKDAY_NAME}",
				"== 0": "this #{WEEKDAY_NAME}",
				"== 1": "next #{WEEKDAY_NAME}",
				"> 1": "the #{WEEKDAY_NAME} #{DIFFERENCE_IN_WEEKS} weeks after"
			
			},
			
			"months": {
			
				"< -2": "#{DIFFERENCE_VALUE} months ago",
				"== -2": "#{DIFFERENCE_VALUE} months ago",
				"== -1": "last month",
				"== 0": "this month",
				"== 1": "next month",
				"== 2": "#{DIFFERENCE_VALUE} months after",
				"> 2": "#{DIFFERENCE_VALUE} months after"
			
			},
			
			"years": {
				
				"< -2": "#{DIFFERENCE_VALUE} years ago",
				"== -2": "#{DIFFERENCE_VALUE} years ago",
				"== -1": "last year",
				"== 0": "this year",
				"== 1": "next year",
				"== 2": "#{DIFFERENCE_VALUE} years after",
				"> 2": "#{DIFFERENCE_VALUE} years after"
			
			}
		
		}
		
		
		
		
		
		if (!localizationTransforms.hasOwnProperty(inUnit))
		return undefined;
		
		inDifference = parseInt(inDifference);
		if (isNaN(inDifference))
		return undefined;
			
		
		var theResponse = undefined;
		
		$.each(localizationTransforms[inUnit], function (conditionLiteral, responseString) {
		
			if (!eval(inDifference + conditionLiteral))
			return true;

		
		//	We do the localization till this very end to prevent unnecessary work
			
			theResponse = _irLocalizedString("relativeDate", inUnit, conditionLiteral, responseString);
			
			$.each(templates, function (templateItemKey, templateItemValue) {
			
				var pattern = new RegExp("(#\\{)(" + templateItemKey + ")(?:, )?(?:\\d+)?(\\})", "ig");
				
				var templateTagOccurrances = theResponse.match(pattern);
				
				if (templateTagOccurrances == null)
				return true;
				
				$.each(templateTagOccurrances, function (templateTagOccurranceIndex, templateTagOccurrance) {
			
					theResponse = theResponse.replace(
					
						String(templateTagOccurrance),
						templateItemValue
						
					);
						
				});
			
			});
			
			return false;
		
		});
		
		return theResponse;
	
	}









})({

//! 
//!	Presets Capture

	"_irLocalizedString": function (inCategory, inScope, inStringKey, inDefaultString) {
		
		if ((iridia && iridia.localizedString && iridia.localizedString.stringForKey || undefined) === undefined) return inDefaultString;
		
		return iridia.localizedString.stringForKey(
		
			["mono", "date", String(inCategory), String(inScope)].join("."),
			String(inStringKey)
		
		) || (inDefaultString || "");

	}

});









