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
		"DATE": this.getDate(),

		"DAY": this.getDay(),
		
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





