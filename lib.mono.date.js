//	lib.mono.date.js
//	Evadne Wu at Iridia, 2010





String.prototype.padToLengthWithPaddingString = function(destinationLength, paddingString) {

	if (!destinationLength) return this;
	paddingString = paddingString || "0";

	var final = "" + this;

	if (this.length < destinationLength)
	for (var i = 0; i <= (destinationLength - this.length - 1); i++)
	final = (paddingString + final);
	
	return final;
	
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
	
		var pattern = /(\d+)(})/ig;
	
		if (inputString.match(pattern) != null)
		return Number(String(inputString.match(pattern)[0]).replace((pattern), '$1'));
	
		return undefined;
		
	}
	
	
	
	
	
	for (templateItemKey in templates) {
	
		if (!templates.hasOwnProperty(templateItemKey)) return;
		
		var pattern = new RegExp("(#\\{)(" + templateItemKey + ")(?:, )?(?:\\d+)?(\\})", "ig")
		
		templateTagOccurrances = formatString.match(pattern);

		for (templateItemOccurranceKey in templateTagOccurrances) {
		
			if (!templateTagOccurrances.hasOwnProperty(templateItemOccurranceKey)) return;
			
			templateItemOccurranceString = templateTagOccurrances[templateItemOccurranceKey]
			
			formatString = formatString.replace(
			
				templateItemOccurranceString,

				String(templates[templateItemKey]).padToLengthWithPaddingString(parseDigitPredicate(templateItemOccurranceString))
			
			);
					
		}
	
	}

	return formatString;
	
}




 