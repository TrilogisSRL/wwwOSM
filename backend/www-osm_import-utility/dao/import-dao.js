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


/**
 * It stores the word contained in the callback object.
 *
 * @param callback Callback object which includes the entity type identifier and the value to store
 */
var storePartialName = function(callback){

    /*
    validation for the value to store
     */
    val.assertNotUndefined(callback.value, 'id03');

    /*
    initialization of the parameters for the parametrized query
     */
    var _params = [callback.value];

    /*
    query execution
     */
    database.execute(GIS, queries.storePartialName(callback), _params, callback);
}

var storeName = function(callback){
    //console.log("storeName-import-dao")
    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.name, callback.osmId];

    //console.log(queries.storeName(callback));
    //console.log(_params);
    //console.log("--------");

    /*
     query execution
     */
    database.executeStoreNameQuery(GIS, _params, callback);
}


/**
 * It retrieves the identifier of the record with the given name value
 *
 * @param callback Callback object which includes the entity type identifier and the value to retrieve
 */
var selectPartialName = function(callback){

    /*
     validation for the value to store
     */
    val.assertNotUndefined(callback.value, 'id04');

    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.value];

    /*
     query execution
     */
    database.execute(GIS, queries.selectPartialName(callback), _params, callback);
}

/**
 * It stores the relationship between the name values and the entities which they belongs.
 *
 * @param callback Callback object which includes the osm identifier and the name value identifier
 */
var storeNameRelation = function(callback){
    /*
     validation for the values to store
     */

    val.assertNotUndefined(callback.osmId, 'id01');
    val.assertNotUndefined(callback.nameId, 'id02');

    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.osmId, callback.nameId];

    /*
     query execution
     */
    database.execute(GIS, queries.storeNameRelation(callback), _params, callback);
}

//module.exports.storePartialName = storePartialName;
//module.exports.selectPartialName = selectPartialName;
//module.exports.storeNameRelation = storeNameRelation;
module.exports.storeName = storeName;
