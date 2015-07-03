/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Validator module
 */

/**
 * Import of the log module
 * @type {exports}
 */
var log = require('./../util/debug.js');

/**
 * Check if the format of the identifier is valid
 *
 * @param id the identifier value to check
 * @returns {*|boolean} boolean with the validity result
 */
var identifier = function(id){
    /*
    the identifier is valid if it is defined and greater than zero
     */
    //TODO check identifier format (must be a number)
    return id;
}

/**
 * Check if the format of the level of detail is valid
 *
 * @param lod level of detail value to check
 * @returns {*|boolean} boolean with the validity result
 */
var lod = function(lod){
    //TODO check lod format (must be a number)
    return lod && lod >= 0 ;
        //&& lod <= 15;
}

/**
 * Check if the format of the bounding box is valid
 *
 * @param bbox bounding box object to check
 * @returns {*|boolean} boolean with the validity result
 */
var bbox = function(bbox){
    //TODO check coordinates format
    return (bbox &&
        bbox.latitudeLB &&
        bbox.latitudeUB &&
        bbox.longitudeLB &&
        bbox.longitudeUB);
}

/**
 * Check if the match value is valid
 *
 * @param value
 * @returns {*|boolean} boolean with the validity result
 */
var match = function(value){
    /*
     the match is valid if the object is defined
     */
    return (value !== undefined);
}


/**
 * The method asserts that the table name is defined
 * (not undefined and not null). Otherwise an error is
 * printed and the process terminates.
 *
 * @param table String which represent the table name
 */
var assertTable = function (table) {
    if (table === undefined || table === null) {
        log.error("Invalid table");
    }
}

/**
 * The method asserts that the entity type is defined
 * (not undefined and not null). Otherwise an error is
 * printed and the process terminates.
 *
 * @param callback Callback object which contains the entity type id
 */
var assertType = function (callback) {
    if (callback === undefined || callback === null ||
        callback.params === undefined || callback.params === null ||
        callback.params.type === undefined || callback.params.type === null) {
        log.error("Invalid type");
    }
}

/**
 * The method asserts that the field list and the value list
 * for the insert query is defined (not undefined and not null).
 * Otherwise an error is printed and the process terminates.
 *
 * @param fields String which represents the field list
 * @param values String which represents the value list
 */
var assertInsert = function(fields, values){
    if (fields === undefined || fields === null ||
        values === undefined || values === null ){
        log.error("invalid insert data");
    }
}

/**
 * The method asserts that the identifier is defined
 * (not undefined and not null).
 * Otherwise an error is printed and the process terminates.
 *
 * @param callback Callback object
 */
var assertId = function (callback){
    if (callback.params.id === undefined){
        log.error("Invalid Id");
    }
}

/**
 * The method asserts that the given object is not undefined
 * and not null.
 * Otherwise an error is printed and the process terminates.
 *
 * @param obj Object to check
 */
var assertNotUndefined = function(obj){
    if (obj === undefined || obj === null){
        log.error("Obj is null or undefined");
    }
}

/**
 * The method asserts that the given the result of the query
 * execution is not undefined and not null.
 * Otherwise an error is printed and the process terminates.
 *
 * @param callback Callback object
 */
var assertRows = function (callback) {
    if (callback.rows === undefined || callback.rows === null) {
        log.error("Invalid rows");
    }
}

module.exports.assertTable = assertTable;
module.exports.assertType = assertType;
module.exports.assertInsert = assertInsert;
module.exports.assertId = assertId;
module.exports.assertRows = assertRows;
module.exports.assertNotUndefined = assertNotUndefined;

module.exports.identifier = identifier;
module.exports.lod = lod;
module.exports.bbox = bbox;
module.exports.match = match;