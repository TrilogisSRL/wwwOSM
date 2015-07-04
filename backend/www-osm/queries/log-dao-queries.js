/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 */

/**
 * Import of the Log module
 * @type {exports}
 */
var log = require('./../models/log.js');

/**
 * Import of the Source model
 * @type {exports|module.exports}
 */
var source = require('./../models/source.js');

/**
 * Import of the Log Detail model
 * @type {exports}
 */
var logDetail = require('./../models/log_detail.js');

/**
 * Create a new Log record into the database
 * @returns {string} the query
 */
var createLog = function(){
    var _query = "" +
        "INSERT INTO "+log.model.table+" ("+log.model.logStart+") " +
        "VALUES ($1::timestamp) " +
        "returning "+log.model.logId+";";
    return _query;
}

/**
 * Create a new Log Detail record into the database related to a Log Detail Object
 * @returns {string} the query
 */
var createLogDetail = function(){
    var _query = "" +
        "INSERT INTO "+logDetail.model.table+" ("+logDetail.model.logParent+", "+logDetail.model.logValue+", "+logDetail.model.logPrintedOn+") " +
        "VALUES ($1::bigint, $2::varchar, $3::timestamp);";
    return _query;
}

/**
 * Retrieve all the values related with the provided Log identifier
 * @returns {string} the query
 */
var getLogDetails = function(){
    var _query = "" +
        "SELECT * FROM "+logDetail.model.table+" " +
        "WHERE "+logDetail.model.logParent+"=  $1::bigint ORDER BY "+logDetail.model.logPrintedOn+" DESC LIMIT 50;";
    return _query;
}

module.exports.createLog = createLog;
module.exports.createLogDetail = createLogDetail;
module.exports.getLogDetails = getLogDetails;