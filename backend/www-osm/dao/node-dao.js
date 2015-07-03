/**
* @author Trilogis Srl
* @author Gustavo German Soria
*
* The module handles the nodes and its associations.
*/


/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./../db/db.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var validator = require('./../util/validator.js');

/**
 * Import of the error module
 * @type {exports}
 */
var error = require('./../util/error.js');

/**
 * Import of the queries module
 * @type {exports}
 */
var queries = require('./../queries/node-dao-queries.js');

/**
 * Retrieve the node with the given identifier, including its tags, properties and level of detail
 * @param id the identifier
 * @param callback the object which contains the information about the current process and the next methods calls
 */
var getNodeById = function(id, callback) {

    /*
    Check the validity of the identifier. An error is raised if it is not satisfied
     */
    if (!validator.identifier(id)){
        error.send(callback, "invalid identifier [undefined or negative or zero]");
    }
    
    /*
     the node identifier is ready to be used within the query
     */
    var _params = [id];

    /*
     set the current entity type
     */
    callback.entity = "node";
    
    /*
     The callback object includes the node builder method call and the one for the exposure
     of the information via JSON.
     */
    database.execute(queries.getPointByOsmId(), _params, callback);
};

/**
 * Retrieve the nodes within the given bounding box which satisfy the requested level of detail, including their tags
 * @param callback the object which contains the information about the current process and the next methods calls
 */
var getPointsByBBox = function(callback) {

    /*
    * Check the validity of the bounding box. An error is raised if it is not satisfied
    */
    if (!validator.bbox(callback.bbox)){
        error.send(callback, "invalid bounding box");
    }

    /*
    * Check the validity of the level of detail. An error is raised if it is not satisfied
    */
    if (!validator.lod(callback.lod)){
        error.send(callback, "invalid level of detail");
    }

    /*
     set the current entity type
     */
    callback.entity = "node";
    
    /*
    * The variables are now ready to be used within the query
    */
    var _params = [
        callback.bbox.longitudeLB,
        callback.bbox.latitudeLB,
        callback.bbox.longitudeUB,
        callback.bbox.latitudeUB,
//        callback.lod
        ];

    /*
    * The method calls for the build of the geometries and the data exposure are enclosed
    * in the callback object
    */
    database.execute(queries.getPointsByBBox(), _params, callback);
}

module.exports.getNodeById = getNodeById;
module.exports.getPointsByBBox = getPointsByBBox;