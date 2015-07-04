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
var queries = require('./../queries/search-dao-queries.js');

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
 * Search the geometries which contain the name value contained in the callback object
 * @param callback Callback object
 */
var getByPartialName = function(callback){

    /*
     validation for the values to store
     */
    val.assertNotUndefined(callback.lod);
    val.assertNotUndefined(callback.name);

    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [ callback.lod,
                    callback.name];

    /*
     query execution
     */
    database.execute(queries.getByPartialName(callback), _params, callback);
}

module.exports.getByPartialName = getByPartialName;