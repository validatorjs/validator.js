import assertString from './util/assertString.js';
import * as RangeModule from './util/Range.js';
import toDate from "./toDate.js";

/**
This is a function to convert a `String` in the form of `x ... y` to a `Range`.

Where: 

`x` is any integer | Date
`y` is any integer | Date

`x < y || x > y`

**/
export default function makeRange(str) {
	
	// Check if we've actaully received a String.
	assertString(str);
	
	let types = {"...": RangeModule.InclusiveRange, ">.." : RangeModule.NonInclusiveLBRange, "..<" : RangeModule.NonInclusiveUBRange, ">.<" : RangeModule.NonInclusiveRange};
	
	
	// Get the range type
	var rangeType, boundaries;
	
	for (var aType in types) {
		boundaries = str.split(aType);
		if (boundaries.length > 1) {
			rangeType = types[aType];
			break;
		}
	}
	
	if (rangeType == null) {
		throw new TypeError(str + " is a malformed range");
	}
	
	// If we have a valid string for the type then try to create a Range
	let newRange = new RangeModule.Range(boundaries[0].trim(), boundaries[1].trim(), rangeType);
	
	newRange.setLowerBoundary("22-10-2222");
	
	console.log("RANGE: " + str);
	console.log("------------------");
	console.log("RANGE TYPE: " + newRange.getBoundaryType().toString());
	console.log("LB: " + newRange.getLowerBoundary());
	console.log("UB: " + newRange.getUpperBoundary());
	console.log("DOES CONTAIN: " + newRange.contains(new RangeModule.Range("21-10-2222", "22-10-2222")));
	console.log("------------------");
	
	return newRange;
}