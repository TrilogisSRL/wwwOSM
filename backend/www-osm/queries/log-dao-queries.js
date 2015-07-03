/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 */

/**
 * @type {exports}
 */
var log = require('./../models/log.js');

var source = require('./../models/source.js');

/**
 * @type {exports}
 */
var logDetail = require('./../models/log_detail.js');


var createLog = function(){

    var _query = "" +
        "INSERT INTO "+log.model.table+" ("+log.model.logStart+") " +
        "VALUES ($1::timestamp) " +
        "returning "+log.model.logId+";";
    //console.log(_query);
    return _query;
}


var createLogDetail = function(){
    //console.log(logDetail);
    var _query = "" +
        "INSERT INTO "+logDetail.model.table+" ("+logDetail.model.logParent+", "+logDetail.model.logValue+", "+logDetail.model.logPrintedOn+") " +
        "VALUES ($1::bigint, $2::varchar, $3::timestamp);";
    //console.log(_query);
    return _query;
}

var getLogDetails = function(){

    var _query = "" +
        "SELECT * FROM "+logDetail.model.table+" " +
        "WHERE "+logDetail.model.logParent+"=  $1::bigint ORDER BY "+logDetail.model.logPrintedOn+" DESC LIMIT 50;";
    //console.log(_query);
    return _query;
}

module.exports.createLog = createLog;
module.exports.createLogDetail = createLogDetail;
module.exports.getLogDetails = getLogDetails;