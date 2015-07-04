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

/**
 * Retrieve a list of all Sources
 * @param callback callback object
 */
var getSources = function(callback){

    /*
     query execution
     */
    database.execute(queries.getSources(), [], callback);
}

/**
 * Store a new record of a Source entity into the database
 * @param callback callback object
 */
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

/**
 * Retrieve the Source object with the provided identifier [callback.source.sourceId]
 * @param callback callback object
 */
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

/**
 * Update the last import value of a source object
 * @param callback callback object
 */
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

/**
 * Update the log id of the last import of the source object with the provided identifier
 * @param callback callback object
 */
var updateLastLogId = function(callback){

    /*
    validation
     */
    if (callback && callback.log) {
        /*
         initialization of the parameters for the parametrized query
         */
        var _params = [callback.log.log_id, callback.source.source_id];

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