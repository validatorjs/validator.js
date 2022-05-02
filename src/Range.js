import assertString from './assertString.js';
import isDate from '../isDate.js';
import isAfter from '../isAfter.js';
import toDate from '../toDate.js';

// Define the allowed boundary types for a range
export const NumberBoundary = Symbol("integer");
export const DateBoundary = Symbol("date");
export const InvalidBoundary = Symbol("invalid!");

// Define the different kinds of inclusivity for a ranges
export const InclusiveRange = Symbol("incRange"); // x ... y, where the range includes x and y
export const NonInclusiveUBRange = Symbol("nonIncUB"); // x ..< y, where the range runs from x up to, but not including, y
export const NonInclusiveLBRange = Symbol("nonIncLB"); // x >.. y, where the range runs from, but not including, x up to y
export const NonInclusiveRange = Symbol("nonInc"); // x >.< y, where the range runs from, but not including, x up to, but not including, y

/**

Bit of D.R.Y. to check that a supplied boundary for the range is allowed.
Returns one of the constants from the allowed types as well as the boundary in it's correct formar
*/
function checkBoundary(boundary) {
	
	if (!Number.isNaN(Number(boundary))) {
		return {type: NumberBoundary, boundary: _boundary};
	}
	
	var _boundary = toDate(boundary,{"format":"MM/DD/YYYY", "delimiters":["/",".","_","-"]});
	if (boundary.success) {
		return {type: DateBoundary, boundary: _boundary};
	}
	
	_boundary = toDate(boundary, {"format":"DD/MM/YYYY", "delimiters":["/",".","_","-"]});
	if (_boundary) {
		return {type: DateBoundary, boundary: _boundary};
	}
	
	_boundary = toDate(boundary, {"format":"YYYY/MM/DD", "delimiters":["/",".","_","-"]});
	if (_boundary) {
		return {type: DateBoundary, boundary: _boundary};
	}
	
	return {type: InvalidBoundary, boundary: null};
}


/**

Custom class to replicate Range as in Swift
**/
export class Range {
	
	#lowerBoundary; // the lower boundary of the range
	#upperBoundary; // the upper boundary of the range
	#inclusivity; // indicates whether it's inclusive of both boundaries or doesn't 'reach' one or more of them
	#boundaryType; // indicates the type of elements in the range (currently Date/Integer)
	
	constructor(l, u, inclusivity) {
		
		let ubType = checkBoundary(u);
		let lbType = checkBoundary(l);
		
		if (ubType.type != lbType.type || lbType.type == InvalidBoundary) {
			// We've been supplied with two different types of boundary for the same range.
			throw new TypeError("Cannot create range with a " + lbType.type.toString() + " and a " + ubType.type.toString());
		}
		
		this.#lowerBoundary = lbType.boundary;
		this.#upperBoundary = ubType.boundary;
		
		this.orderBoundaries();
		this.setInclusivity(inclusivity ?? InclusiveRange);
		this.#boundaryType = lbType.type;
	}
	
	orderBoundaries() {
		
		let lb = this.#lowerBoundary;
		let ub = this.#upperBoundary;
		
		switch (this.#boundaryType) {
			case DateBoundary:
				if (ub > lb) {
					this.#lowerBoundary = lb;
					this.#upperBoundary = ub;
				} else {
					this.#lowerBoundary = ub;
					this.#upperBoundary = lb;
				}
				break;
			case NumberBoundary:
				this.#lowerBoundary = Math.min(lb, ub);
				this.#upperBoundary = Math.max(lb, ub);
				break;
			default:
				break;
		}
	}
	
	getLowerBoundary() { return this.#lowerBoundary; }
	
	setLowerBoundary(newValue) {
		var newBoundary = checkBoundary(newValue);
		if (newBoundary.type != this.#boundaryType) {
			throw new TypeError("Can't assign " + newValue.constructor.name + " to a range with type " + this.#boundaryType.toString());
		}
		this.#lowerBoundary = newBoundary.boundary;
		this.orderBoundaries();
	}
	
	setUpperBoundary(newValue) {
		var newBoundary = checkBoundary(newValue);
		if (newBoundary.type != this.#boundaryType) {
			throw new TypeError("Can't assign " + newValue.constructor.name + " to a range with type " + this.#boundaryType.toString());
		}
		this.#upperBoundary = newBoundary.boundary;
		this.orderBoundaries();
	}
	
	getUpperBoundary() { return this.#upperBoundary; }
	
	getBoundaryType() { return this.#boundaryType; }
	
	getInclusiviy() { return this.#inclusivity; }
	
	setInclusivity(newValue) {
		
		if (newValue != InclusiveRange && newValue != NonInclusiveLBRange && newValue != NonInclusiveUBRange && newValue != NonInclusiveRange) {
			throw new TypeError("Cannot set Range's inclusivity to " + newValue.toString());
		}
		
		this.#inclusivity = newValue;
	}
	
	contains(a) {
		
		// Check contains a range
		if (a instanceof Range) {
			if (this.#boundaryType != a.getBoundaryType()) {
				return false;
			}
			// Since during construction we ensure that the lowerboundary is definitely lower
			// than the upperboundary then 
			return (a.getLowerBoundary() >= this.#lowerBoundary) && (a.getUpperBoundary() <= this.#upperBoundary);
		}
		
		// Check contains a number
		let _a = Number(a);
		if (!Number.isNaN(_a)) {
			let check = checkBoundary(_a);
			if (check == InvalidBoundary || check != this.type) {
				return false;
			}
			
			return (_a >= this.#lowerBoundary) && (_a <= this.#upperBoundary);
		}
		
		return false;
	}
	
	intersects(anotherRange) {
		
	}
}