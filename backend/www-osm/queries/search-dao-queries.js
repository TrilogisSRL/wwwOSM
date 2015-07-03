/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search DAO queries module
 */

/**
 * Import of the line model
 * @type {exports}
 */
var line = require('./../models/line.js');

/**
 * Import of the road model
 * @type {exports}
 */
var road = require('./../models/road.js');

/**
 * Import of the polygon model
 * @type {exports}
 */
var polygon = require('./../models/polygon.js');

/**
 * Import of the point model
 * @type {exports}
 */
var point = require('./../models/point.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./../util/validator.js');

/**
 * Import of the parameters module
 * @type {exports}
 */
var params = require('./../util/params.js');

/**
 * Internal use: it retrieves the correct table name (entity table) from the given entity type identifier stored in the callback object
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {String} a table name
 */
var getTable = function(callback){

    /*
     validation of the entity type identifier
     */
    val.assertType(callback);

    /*
     variable for the table name, initialized as undefined
     */
    var table = undefined;

    /*
     select the correct value for the table variable
     */
    switch (callback.params.type) {
        case params.LINE :
        {
            table = line.model.table;
        }
            break;
        case params.POLYGON :
        {
            table = polygon.model.table;
        }
            break;
        case params.ROAD :
        {
            table = road.model.table;
        }
            break;
        case params.POINT :
        {
            table = point.model.table;
        }
            break;
    }

    /*
     validation of the table variable
     */
    val.assertNotUndefined(table);

    return table;
}

/**
 * Internal use: it retrieves the correct table name (name table) from the given entity type identifier stored in the callback object
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {String} a table name
 */
var getNameTable = function(callback){

    /*
     validation of the entity type identifier
     */
    val.assertType(callback);

    /*
     variable for the table name, initialized as undefined
     */
    var table = undefined;

    /*
     select the correct value for the table variable
     */
    switch (callback.params.type) {
        case params.LINE :
        {
            table = line.model.nameTable;
        }
            break;
        case params.POLYGON :
        {
            table = polygon.model.nameTable;
        }
            break;
        case params.ROAD :
        {
            table = road.model.nameTable;
        }
            break;
        case params.POINT :
        {
            table = point.model.nameTable;
        }
            break;
    }

    /*
     validation of the table variable
     */
    val.assertNotUndefined(table);

    return table;
}

/**
 * Internal use: it retrieves the correct table name (name relationship table) from the given entity type identifier stored in the callback object
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {String} a table name
 */
var getNameRelTable = function(callback){

    /*
     validation of the entity type identifier
     */
    val.assertType(callback);

    /*
     variable for the table name, initialized as undefined
     */
    var table = undefined;

    /*
     select the correct value for the table variable
     */
    switch (callback.params.type) {
        case params.LINE :
        {
            table = line.model.nameRelTable;
        }
            break;
        case params.POLYGON :
        {
            table = polygon.model.nameRelTable;
        }
            break;
        case params.ROAD :
        {
            table = road.model.nameRelTable;
        }
            break;
        case params.POINT :
        {
            table = point.model.nameRelTable;
        }
            break;
    }

    /*
     validation of the table variable
     */
    val.assertNotUndefined(table);

    return table;
}

/**
 * Internal use: it retrieves the correct table name (style table) from the given entity type identifier stored in the callback object
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {String} a table name
 */
var getStyleTable = function(callback){

    /*
     validation of the entity type identifier
     */
    val.assertType(callback);

    /*
     variable for the table name, initialized as undefined
     */
    var table = undefined;

    /*
     select the correct value for the table variable
     */
    switch (callback.params.type) {
        case params.LINE :
        {
            table = line.model.styleTable;
        }
            break;
        case params.POLYGON :
        {
            table = polygon.model.styleTable;
        }
            break;
        case params.ROAD :
        {
            table = road.model.styleTable;
        }
            break;
        case params.POINT :
        {
            table = point.model.styleTable;
        }
            break;
    }

    /*
     validation of the table variable
     */
    val.assertNotUndefined(table);

    return table;
}

var getByPartialName = function(callback){

    /**
     * Table names. They are retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getTable(callback);
    var nameTable = getNameTable(callback);
    var nameRelTable = getNameRelTable(callback);
    var styleTable = getStyleTable(callback);

    var _query = "" +
        "SELECT osm_id, name, lod FROM "+table+" NATURAL JOIN "+styleTable+" WHERE is_deleted = false AND lod <= $1::integer AND osm_id IN (SELECT DISTINCT osm_id FROM "+nameRelTable+" WHERE name_id IN (SELECT name_id FROM "+nameTable+" WHERE name ILIKE $2::varchar)) ORDER BY lod";
    return _query;
}

module.exports.getByPartialName = getByPartialName;