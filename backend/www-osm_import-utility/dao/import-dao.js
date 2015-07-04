/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Names DAO
 */

/**
 * Import of the search-dao-queries module
 * @type {exports}
 */
var queries = require('./../queries/names-dao-queries.js');

/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./../db/db.js');

/**
 * Import of the params module
 * @type {exports}
 */
var params= require('./../util/params.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./../validation/validation.js');


/**
 * Short link for the variable of the main database
 * @type {exports.GIS|*}
 */
var GIS = params.GIS;



var storeName = function(callback){
    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.name, callback.osmId];
    /*
     query execution
     */
    database.executeStoreNameQuery(GIS, _params, callback);
}

module.exports.storeName = storeName;
