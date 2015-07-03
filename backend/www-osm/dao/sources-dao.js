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
var queries = require('./../queries/source-dao-queries.js');

/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./../db/db.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./../util/validator.js');

var getSources = function(callback){
    /*
     query execution
     */
    database.execute(queries.getSources(), [], callback);
}

var addSource = function(callback){
    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.source.sourceUrl, callback.source.sourceFilename, new Date().toISOString(), new Date().toISOString()];

    /*
     query execution
     */
    database.execute(queries.addSource(), _params, callback);
}

var getSourceById = function(callback){
    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.source.sourceId];

    /*
     query execution
     */
    database.execute(queries.getSourceById(), _params, callback);
}

var updateLastImport = function(callback){
    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [new Date().toISOString(), callback.sourceId];

    /*
     query execution
     */
    database.execute(queries.updateLastImport(), _params, callback);
}

var updateLastLogId = function(callback){
    console.log("updateLastLogId");
    //console.log(callback);
    if (callback && callback.log) {
        console.log(callback.log);
        console.log(callback.source);
        /*
         initialization of the parameters for the parametrized query
         */
        var _params = [callback.log.log_id, callback.source.source_id];

        console.log(_params);
        console.log(queries.updateLastLogId());

        /*
         query execution
         */
        database.execute(queries.updateLastLogId(), _params, callback);
    }
}

module.exports.getSources = getSources;
module.exports.addSource = addSource;
module.exports.updateLastImport = updateLastImport;
module.exports.updateLastLogId = updateLastLogId;
module.exports.getSourceById = getSourceById;