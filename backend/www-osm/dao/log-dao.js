/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Log DAO
 */

/**
 * Import of the log-dao-queries module
 * @type {exports}
 */
var queries = require('./../queries/log-dao-queries.js');

/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./../db/db.js');


/**
 * Create a new log record into the database and returns its ID
 * @param callback Callback Object
 */
var createLog = function(callback){
    /*
    Query execution
     */
    database.execute(queries.createLog(), [new Date().toISOString()], callback);
}

/**
 * Create a new record related to a log entity
 * @param logId Identifier of the Log entity
 * @param logValue Value to associate
 */
var createLogDetail = function(logId, logValue){

    /*
    Query parameters
     */
    var params = [logId, logValue, new Date().toISOString()];

    /*
    Query execution
     */
    database.execute(queries.createLogDetail(), params, {});
}

/**
 * Retrieve all the values related with the provided Log identifier
 * @param callback
 */
var getLogDetails = function(callback){

    /*
     Query parameters
     */
    var params = [parseInt(callback.log.logId)];
    /*
     query execution
     */
    database.execute(queries.getLogDetails(), params, callback);
}

module.exports.createLog = createLog;
module.exports.createLogDetail = createLogDetail;
module.exports.getLogDetails = getLogDetails;