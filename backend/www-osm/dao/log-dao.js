/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search DAO
 */

/**
 * Import of the search-dao-queries module
 * @type {exports}
 */
var queries = require('./../queries/log-dao-queries.js');

/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./../db/db.js');


var createLog = function(callback){
    /*
     query execution
     */
    database.execute(queries.createLog(), [new Date().toISOString()], callback);
}

var createLogDetail = function(logId, logValue){

    var params = [logId, logValue, new Date().toISOString()];
    //console.log(params);

    /*
     query execution
     */
    database.execute(queries.createLogDetail(), params, {});
}

var getLogDetails = function(callback){

    var params = [parseInt(callback.log.logId)];
    //console.log(params);
    /*
     query execution
     */
    database.execute(queries.getLogDetails(), params, callback);
}

module.exports.createLog = createLog;
module.exports.createLogDetail = createLogDetail;
module.exports.getLogDetails = getLogDetails;