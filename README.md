#	`lib.mono.date.js`

##	Usage

	var aDateObject = new Date();
	
	var prettyDate = aDateObject.format("#{YEAR, 4} #{MONTH, 2}/#{DATE, 2} #{HOURS, 2}:#{MINUTES, 2}");




##	Supported Tags

*	`#{YEAR}`, `#{YEAR, n}` 
*	`#{MONTH}`, `#{MONTH, n}`
*	`#{DATE}`, `#{DATE, n}`

*	`#{HOURS}`, `#{HOURS, n}`
*	`#{MINUTES}`, `#{MINUTES, n}`
*	`#{SECONDS}`, `#{SECONDS, n}`





##	Known Issues

This formatter eats your hashes and curly braces.




