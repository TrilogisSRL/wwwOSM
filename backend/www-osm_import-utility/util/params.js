/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module in with constants and parameters are declared
 */

/**
 * Variable which represents the main database
 * @type {number}
 */
var GIS = 0;

/**
 * Variable which represents the temporary database
 * @type {number}
 */
var TEMP = 0;

/**
 * Variable which represents the table of the lines
 * @type {number}
 */
var LINE = 0;

/**
 * Variable which represents the table of the polygons
 * @type {number}
 */
var POLYGON = 1;

/**
 * Variable which represents the table of the roads
 * @type {number}
 */
var ROAD = 2;

/**
 * Variable which represents the table of the points
 * @type {number}
 */
var POINT = 3;

/**
 * Array with the available tables
 * @type {*[]}
 */
var types = [LINE, POLYGON, ROAD, POINT];

/**
 * Names of the available tables
 * @type {string[]}
 */
var typeDescriptions = ["LINE", "POLYGON", "ROAD", "POINT"];

/**
 * The method returns the current date time
 * @returns {string} String which represents the current date time
 */
var timestamp = function(){
    return new Date().toISOString();
}

module.exports.LINE = LINE;
module.exports.POLYGON = POLYGON;
module.exports.ROAD = ROAD;
module.exports.POINT = POINT;
module.exports.types = types;
module.exports.typeDescriptions = typeDescriptions;
module.exports.timestamp = timestamp;
module.exports.GIS = GIS;
module.exports.TEMP = TEMP;