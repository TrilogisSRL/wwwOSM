/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
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
var val = require('./../validation/validation.js');

/**
 * Import of the parameters module
 * @type {exports}
 */
var params = require('./../util/params.js');

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

    val.assertNotUndefined(table, 'ndq02');

    return table;
}

var getTempTable = function(callback){

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
            table = line.model.tempTable;
        }
            break;
        case params.POLYGON :
        {
            table = polygon.model.tempTable;
        }
            break;
        case params.ROAD :
        {
            table = road.model.tempTable;
        }
            break;
        case params.POINT :
        {
            table = point.model.tempTable;
        }
            break;
    }

    /*
     validation of the table variable
     */

    val.assertNotUndefined(table, 'ndq02');

    return table;
}

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
            table = line.model.mainTable;
        }
            break;
        case params.POLYGON :
        {
            table = polygon.model.mainTable;
        }
            break;
        case params.ROAD :
        {
            table = road.model.mainTable;
        }
            break;
        case params.POINT :
        {
            table = point.model.mainTable;
        }
            break;
    }

    /*
     validation of the table variable
     */

    val.assertNotUndefined(table, 'ndq03');

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
    val.assertNotUndefined(table, 'ndq01');

    return table;
}

/**
 * Query used to store the partial name in the correct table according to the entity identifier
 *
 * It requires:
 * $1::varchar -> the name value to store
 *
 * @param callback Callback object
 * @returns {string} the query string
 */
var storePartialName = function(callback){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getNameTable(callback);

    var _query = "" +
        "INSERT INTO "+table+" (name) " +
        "SELECT $1::varchar " +
        "returning name_id;";
    return _query;
}

/**
 * Query used to retrieve the identifier of the record with the given name value
 *
 * It requires:
 * $1::varchar -> the name value to retrieve
 *
 *
 * @param callback Callback object
 * @returns {string} the query string
 */
var selectPartialName = function(callback){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getNameTable(callback);

    var _query = "" +
        "SELECT name_id FROM "+table+" WHERE name = $1::varchar";
    return _query;
}

/**
 * Query used to store the relationship between the name values and the entities which they belongs.
 *
 * It requires:
 * $1::bigint   -> the osm identifier
 * $2::bigint   -> the name value identifier
 *
 * @param callback Callback object Callback object
 * @returns {string} the query string
 */
var storeNameRelation = function(callback){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getNameRelTable(callback);

    var _query = "" +
        "INSERT INTO "+table+" (osm_id, name_id) VALUES ($1::bigint, $2::bigint)";
    return _query;
}

var getNames = function(callback){

    var table = getTable(callback);
    //var table = getTempTable(callback);
    var query = "SELECT osm_id, name FROM "+table+" WHERE name IS NOT NULL";
    return query;
}


var storeName = function (callback) {
    var nameTable = getNameTable(callback);
    var nameRelTable = getNameRelTable(callback);

    var query = "BEGIN; "+
        "INSERT INTO "+nameTable+" "+
        "(name) "+
        "SELECT $1::varchar "+
        "WHERE "+
        "NOT EXISTS ( "+
        "(SELECT name_id FROM "+nameTable+" WHERE name = $1::varchar) "+
        "); "+
        "INSERT INTO "+nameRelTable+" "+
        "(osm_id, name_id) "+
        "SELECT $2::bigint, (SELECT name_id FROM "+nameTable+" WHERE name = $1::varchar) "+
        "WHERE "+
        "NOT EXISTS ( "+
        "(SELECT * FROM "+nameRelTable+" WHERE osm_id = $2::bigint AND name_id = (SELECT name_id FROM "+nameTable+" WHERE name = $1::varchar)) "+
        "); "+
        "END; COMMIT;";
    return query;
}

module.exports.storePartialName = storePartialName;
module.exports.selectPartialName = selectPartialName;
module.exports.storeNameRelation = storeNameRelation;
module.exports.getNames = getNames;
module.exports.storeName = storeName;