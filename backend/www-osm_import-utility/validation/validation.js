/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module with validation tools
 */

/**
 * Import of the log module
 * @type {exports}
 */
var log = require('./../util/debug.js');


/**
 * The method asserts that the table name is defined
 * (not undefined and not null). Otherwise an error is
 * printed and the process terminates.
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
 * @param callback
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
 * @param obj Object to check
 */
var assertNotUndefined = function(obj, message){
    if (obj === undefined || obj === null){
        log.error("Obj is null or undefined: "+message);
//        log.error(callback);
    }
}

/**
 * The method asserts that the given the result of the query
 * execution is not undefined and not null.
 * Otherwise an error is printed and the process terminates.
 * @param callback
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