/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module in with parametrized queries are stored
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
 * Internal use: it retrieves the correct table name (entity main table) from the given entity type identifier stored in the callback object
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {String} a table name
 */
var getMainTable = function(callback){

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
    val.assertNotUndefined(table);

    return table;
}

/**
 * Internal use: it retrieves the correct table name (entity temporary table) from the given entity type identifier stored in the callback object
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {String} a table name
 */
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

/**
 * Query used to retrieve all the distinct identifiers of the records to insert/update from the temporary table
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {string} the query string
 */
var getIds = function(callback){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getTempTable(callback);

    return "SELECT DISTINCT osm_id FROM "+table;
}

/**
 * Query used to retrieve the list of record with the given osm identifier
 *
 * It requires:
 * $1::bigint -> the osm identifier
 *
 * @param callback Callback object in which is stored the osm identifier
 * @returns {string} the query string
 */
var getById = function(callback){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getTempTable(callback);

    return "SELECT * FROM "+table+" WHERE osm_id = $1::bigint";
}

/**
 * Query used to apply the correct type identifier
 * @param callback Callback object in which is stored the property key
 *
 * It requires:
 * $1::integer -> the type identifier
 * $2::varchar -> the property value
 *
 * @param key {string} the property key
 * @returns {string} the query string
 */
var applyTypeIdPartialQuery = function(callback, key, typeId, value){
    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getTempTable(callback);
    //var table = getMainTable(callback);

    return 'UPDATE ' + table + ' SET type_id = '+typeId+' WHERE "' + key.replace(/\s+/g, '') + '" = \''+value+'\'; ';
}

/**
 * TODO
 * @param callback
 * @param key
 * @returns {string}
 */
var updateData = function(query){

    var query = 'BEGIN; ' + query + ' COMMIT;';
    //console.log(query);
    return query;
}


var softDelete = function(){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    return "BEGIN;" +
        "UPDATE " + polygon.model.mainTable + " SET is_deleted = true WHERE "+polygon.model.osmId+" IN (SELECT osm_id FROM "+polygon.model.tempTable+");"+
        "UPDATE " + line.model.mainTable + " SET is_deleted = true WHERE "+line.model.osmId+" IN (SELECT osm_id FROM "+line.model.tempTable+");"+
        "UPDATE " + road.model.mainTable + " SET is_deleted = true WHERE "+road.model.osmId+" IN (SELECT osm_id FROM "+road.model.tempTable+");"+
        "UPDATE " + point.model.mainTable + " SET is_deleted = true WHERE "+point.model.osmId+" IN (SELECT osm_id FROM "+point.model.tempTable+");"+
        "COMMIT;";
}

var hardDelete = function(){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    return "BEGIN;" +
        "DELETE FROM " + polygon.model.mainTable + " WHERE "+polygon.model.isDeleted+" = true;"+
        "DELETE FROM " + line.model.mainTable + " WHERE "+line.model.isDeleted+" = true;"+
        "DELETE FROM " + road.model.mainTable + " WHERE "+road.model.isDeleted+" = true;"+
        "DELETE FROM " + point.model.mainTable + " WHERE "+point.model.isDeleted+" = true;"+
        "COMMIT;";
}

/**
 * Query used to retrieve the number of records to insert/update
 *
 * @param callback Callback object in which is stored the entity type identifier
 * @returns {string} the query string
 */
var countEntries = function(callback){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getTempTable(callback);
    return "SELECT count(osm_id) as osm_id FROM "+table;
}

/**
 * Query used to retrieve the list of properties. The correct table is selected using the entity type identifier
 * within the callback object
 *
 * @param callback Callback object which contains the entity type identifier
 * @returns {string} the query string
 */
var getProperties = function(callback){

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getStyleTable(callback);
    return "SELECT type_id, type_key, type_value FROM "+table;
}

/**
 * It copies the records from the temporary table to the main one.
 * @param callback Callback object which contains the entity type identifier
 * @returns {string} the query string
 */
var moveRows = function(){

    /**
    // * Table name. It is retrieved from the entity type identifier stored in the callback object
    // * @type {String} the table name
    // */
    var query = "BEGIN;" +
        "INSERT INTO "+polygon.model.mainTable+" SELECT * FROM "+polygon.model.tempTable+";" +
        "INSERT INTO "+line.model.mainTable+" SELECT * FROM "+line.model.tempTable+";" +
        "INSERT INTO "+road.model.mainTable+" SELECT * FROM "+road.model.tempTable+";" +
        "INSERT INTO "+point.model.mainTable+" SELECT * FROM "+point.model.tempTable+";" +
        "COMMIT;";
    return query;
}

/**
 * It adds some columns to the temporary table of the given entity
 * @param callback Callback object which contains the entity type identifier
 * @returns {string} the query string
 */
var setTable = function(){
    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var query = "BEGIN; " +
        "ALTER TABLE "+polygon.model.tempTable+" ADD type_id integer DEFAULT 1;" +
        "ALTER TABLE "+polygon.model.tempTable+" ADD is_deleted bool DEFAULT false;" +
        "ALTER TABLE "+polygon.model.tempTable+" ADD modified_on timestamp; " +

        "ALTER TABLE "+line.model.tempTable+" ADD type_id integer DEFAULT 1;" +
        "ALTER TABLE "+line.model.tempTable+" ADD is_deleted bool DEFAULT false;" +
        "ALTER TABLE "+line.model.tempTable+" ADD modified_on timestamp; " +

        "ALTER TABLE "+road.model.tempTable+" ADD type_id integer DEFAULT 1;" +
        "ALTER TABLE "+road.model.tempTable+" ADD is_deleted bool DEFAULT false;" +
        "ALTER TABLE "+road.model.tempTable+" ADD modified_on timestamp; " +

        "ALTER TABLE "+point.model.tempTable+" ADD type_id integer DEFAULT 1;" +
        "ALTER TABLE "+point.model.tempTable+" ADD is_deleted bool DEFAULT false;" +
        "ALTER TABLE "+point.model.tempTable+" ADD modified_on timestamp; " +

        "COMMIT;";
    return query;
}

var reindexTables = function () {
    var query = "" +
        "REINDEX TABLE "+polygon.model.nameTable +";"+
        "REINDEX TABLE "+line.model.nameTable +";"+
        "REINDEX TABLE "+point.model.nameTable +";"+
        "REINDEX TABLE "+polygon.model.mainTable +";"+
        "REINDEX TABLE "+line.model.mainTable +";"+
        "REINDEX TABLE "+road.model.mainTable +";"+
        "REINDEX TABLE "+point.model.mainTable +";";

    return query;
}

var setTimestamp = function(timestamp){

    var query = "BEGIN;" +
        'UPDATE '+polygon.model.tempTable+' SET modified_on = \''+timestamp+'\';' +
        'UPDATE '+line.model.tempTable+' SET modified_on = \''+timestamp+'\';' +
        'UPDATE '+road.model.tempTable+' SET modified_on = \''+timestamp+'\';' +
        'UPDATE '+point.model.tempTable+' SET modified_on = \''+timestamp+'\';' +
        "COMMIT;";
    return  query;
}


/**
 * Query used to insert a record.
 *
 * @param callback Callback object which contains the entity type identifier
 * @param fields {string} a string which represents the list of fields
 * @param values {string} a string which represents the list of values
 * @returns {string} the query string
 */
var insert = function(callback, fields, values){

    /*
    validation of the list of fields and values
     */
    val.assertInsert(fields, values);

    /**
     * Table name. It is retrieved from the entity type identifier stored in the callback object
     * @type {String} the table name
     */
    var table = getMainTable(callback);

    return "INSERT INTO " + table + " ("+fields+") VALUES ("+values+")";
}

module.exports.getById = getById;
module.exports.getIds = getIds;
module.exports.updateData = updateData;
module.exports.applyTypeIdPartialQuery = applyTypeIdPartialQuery;
module.exports.softDelete = softDelete;
module.exports.hardDelete = hardDelete;
module.exports.countEntries = countEntries;
module.exports.getProperties = getProperties;
module.exports.moveRows = moveRows;
module.exports.setTimestamp = setTimestamp;
module.exports.setTable = setTable;
module.exports.reindexTables = reindexTables;