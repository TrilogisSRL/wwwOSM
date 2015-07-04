/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * The module handles the ways and its associations.
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
var queries = require('./../queries/way-dao-queries.js');

/**
 * Retrieve the way entity with the given identifier, including its tags, properties and level of detail
 * @param id the identifier of the way entity
 * @param callback the object which contains the information about the current process and the next methods calls
 */
var getPolygonByOsmId = function(id, callback) {

    /*
     Check the validity of the identifier. An error is raised if it is not satisfied
     */
    if (!validator.identifier(id)){
        error.send(callback, "invalid identifier [undefined or negative or zero]");
    }

    /*
     The way identifier is ready to be used within the query
     */
    var _params = [id];
    console.log(id);

    /*
     set the current entity type
     */
    callback.entity = "way";

    /*
     The callback object includes the way builder method call and the one for the exposure
     of the information via JSON.
     */
    database.execute(queries.getPolygonByOsmId(), _params, callback);
};


/**
 * Retrieve the way entity with the given identifier, including its tags, properties and level of detail
 * @param id the identifier of the way entity
 * @param callback the object which contains the information about the current process and the next methods calls
 */
var getPolylineByOsmId = function(id, callback) {

    /*
     Check the validity of the identifier. An error is raised if it is not satisfied
     */
    if (!validator.identifier(id)){
        error.send(callback, "invalid identifier [undefined or negative or zero]");
    }

    /*
     The way identifier is ready to be used within the query
     */
    var _params = [id];


    /*
     set the current entity type
     */
    callback.entity = "way";

    /*
     The callback object includes the way builder method call and the one for the exposure
     of the information via JSON.
     */
    database.execute(queries.getPolylineByOsmId(), _params, callback);
};

/**
 * Retrieves the polygons within the given bounding box which satisfy the requested level of detail, including their tags.
 * The parts of the geometries which are out of the bounding box are cut.
 * @param callback the object which contains the information about the current process and the next methods calls
 */
var getPolygonsByBBox = function(callback) {
    /*
     Check the validity of the bounding box. An error is raised if it is not satisfied
     */
//    if (!validator.bbox(callback.bbox)){
//        error.send(callback, "invalid bounding box");
//    }

    /*
     Check the validity of the level of detail. An error is raised if it is not satisfied
     */
    if (!validator.lod(callback.lod)){
        error.send(callback, "invalid level of detail");
    }

    /*
     set the current entity type
     */
    callback.entity = "way";

    /*
     The variables are now ready to be used within the query
     */
    var _params = [
        callback.bbox.longitudeLB,
        callback.bbox.latitudeLB,
        callback.bbox.longitudeUB,
        callback.bbox.latitudeUB,
        callback.lod
    ];

    var list = callback.excludePolygons;

    /*
     The callback object includes the way builder method call and the one for the exposure
     of the information via JSON.
     */
    database.execute(queries.getPolygonsByBbox(list), _params , callback);
};

/**
 * Retrieves the polylines within the given bounding box which satisfy the requested level of detail, including their tags.
 * The parts of the geometries which are out of the bounding box are cut.
 * @param callback the object which contains the information about the current process and the next methods calls
 */
var getPolylinesByBBox = function(callback) {
    /*
     Check the validity of the bounding box. An error is raised if it is not satisfied
     */
//    if (!validator.bbox(callback.bbox)){
//        error.send(callback, "invalid bounding box");
//    }

    /*
     Check the validity of the level of detail. An error is raised if it is not satisfied
     */
    if (!validator.lod(callback.lod)){
        error.send(callback, "invalid level of detail");
    }

    /*
     set the current entity type
     */
    callback.entity = "way";

    /*
     The variables are now ready to be used within the query
     */
    var _params = [
        callback.bbox.longitudeLB,
        callback.bbox.latitudeLB,
        callback.bbox.longitudeUB,
        callback.bbox.latitudeUB,
        callback.lod
        ];

    var list = callback.excludeLines;

    /*
     The callback object includes the way builder method call and the one for the exposure
     of the information via JSON.
     */
    database.execute(queries.getPolylinesByBbox(list), _params, callback);
};

var getPolylinesByName = function(callback){
    var _params = [
        callback.name
    ];

    /*
     The callback object includes the way builder method call and the one for the exposure
     of the information via JSON.
     */
    database.execute(queries.getPolylinesByName(), _params, callback);
}

module.exports.getPolygonByOsmId = getPolygonByOsmId;
module.exports.getPolylineByOsmId = getPolylineByOsmId;
module.exports.getPolygonsByBbox = getPolygonsByBBox;
module.exports.getPolylinesByBbox = getPolylinesByBBox;
module.exports.getPolylinesByName = getPolylinesByName;