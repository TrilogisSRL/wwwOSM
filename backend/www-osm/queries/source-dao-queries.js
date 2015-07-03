/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search DAO queries module
 */

/**
 * Import of the Source model
 * @type {exports}
 */
var source = require('./../models/source.js');
var model = source.model;

var getSources = function () {
    var query = "SELECT * FROM "+model.table+" ORDER BY last_import DESC;";
    return query;
}

var getSourceById = function () {
    var query = "SELECT * FROM "+model.table+" WHERE "+model.sourceId+" = $1::bigint;";
    return query;
}

var addSource = function() {
    var query = "INSERT INTO "+model.table+" " +
        "("+model.sourceUrl+", "+model.sourceFilename+", "+model.insertOn+", "+model.modifiedOn+") " +
        "VALUES ($1::varchar, $2::varchar, $3::timestamp, $4::timestamp) RETURNING *;";

    return query;
}

var updateLastLogId = function(){

    var _query = "" +
        "UPDATE "+source.model.table+" SET "+source.model.lastLogId+" = $1::bigint "+
        "WHERE "+source.model.sourceId+" = $2::bigint ";
    return _query;
}

var updateLastImport = function (){
    var query = "UPDATE "+model.table+" SET "+model.lastImport+" = $1::timestamp WHERE "+model.sourceId+" = $2::integer RETURNING *;";
    return query;
}


module.exports.getSources = getSources;
module.exports.addSource = addSource;
module.exports.updateLastImport = updateLastImport;
module.exports.updateLastLogId = updateLastLogId;
module.exports.getSourceById = getSourceById;

