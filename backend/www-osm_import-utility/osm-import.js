/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Import module
 */

var namesController = require('./controllers/names-controller');
/**
 * Import of the query definitions module
 * @type {exports}
 */
var queries = require('./queries/queries.js');

var nameQueries = require('./queries/names-dao-queries.js');

/**
 * Import of the log module
 * @type {exports}
 */
var log = require('./util/debug.js');

/**
 * Import of the params module
 * @type {exports}
 */
var params= require('./util/params.js');

/**
 * Import of the module which contains utilities for the callback object
 * @type {exports}
 */
var cbu = require('./util/callback-util.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./validation/validation.js');

/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./db/db.js');

/**
 * It represent the current entity type used for the import process
 * @type {number}
 */
var current = undefined;

/**
 * It represents the number of records to store in the main database for the 'current' entity
 * @type {number}
 */
var counter = undefined;

/**
 * Short link for the variable of the main database
 * @type {exports.GIS|*}
 */
var GIS = params.GIS;

/**
 * Short link for the variable of the temporary database
 * @type {exports.TEMP|*}
 */
var TEMP = params.TEMP;

var getNames = function(callback){
    database.execute(GIS, nameQueries.getNames(callback), [], callback);
}


var storeNames = function(callback){

    if (callback.rows.length === 0){
        callback.list_next = callback.list;
        afterCreate(callback);
    }
    for (var i in callback.rows) {
        var obj = callback.rows[i];
        if (obj.name) {
            console.log(obj.name);
            var _nameArray = obj.name.split(" ");

            counter += _nameArray.length;

            _nameArray.forEach(function (name) {
                var cb = {};

                cb.list_next = callback.list;
                cb.osmId = obj.osm_id;
                cb.type = current;
                cb.params  = {type: current},
                cb.name = name;
                cb.list = [afterCreate];
                namesController.storeName(cb);
            });
        }
    }
}

/**
 * Internal use: it updates the 'type_id' column in the tables of the temporary database according to the
 * values of the attributes of the record
 * @param callback Callback object in which are stored the properties list
 */
var applyProperties = function(callback){

    /*
    validation for the list of properties stored within the callback object
     */
    val.assertNotUndefined(callback.types, 'oi03');


    /*
    the appropriate type identifier is applied to each record
     */

    var queryList = [];

    callback.types.forEach(function (entry){
        if (entry.type_id >1) {
            var query = queries.applyTypeIdPartialQuery(callback, entry.type_key, entry.type_id, entry.type_value);
            queryList.push(query);
        }
    });


    var transaction = "";
    queryList.forEach(function(entry){
        transaction +=entry;
    });

    database.execute(TEMP, queries.updateData(transaction), [], undefined);

    cbu.next(callback,"error 003");
}

/**
 * Internal use: it copies the records from the temporary table to the main table
 * @param callback Callback object
 */
var moveRows = function(callback){
    database.execute(GIS, queries.moveRows(), [], callback);
}

/**
 * Internal use: it set the timestamp of the operation as a value for the column 'modified_on'
 * @param callback Callback object
 */
var setTimestamp = function(callback){
    database.execute(GIS, queries.setTimestamp(new Date().toISOString()), [], callback);
}

/**
 * Internal use: it deletes the old records stored in the main database. The process is based on the
 * soft delete approach.
 * @param callback Callback object in which is stored the list of identifier
 */
var softDeleteRecords = function(callback) {

    database.execute(GIS, queries.softDelete(), [], callback);

}
var hardDeleteRecords = function(callback) {

    database.execute(GIS, queries.softDelete(), [], callback);

}

/**
 * Internal use: it retrieves a list of properties for the given entity, in order to assign the correct type
 * identifier to each record before to store them in the main database.
 * @param callback Callback object in which is stored the entity type used to select the correct table
 */
var getProperties = function(callback){
    /*
    query execution
     */
    database.execute(GIS, queries.getProperties(callback), [], callback);
}

/**
 * Internal use: it manages the result of the query executed by the 'getProperties' method. It is stored
 * the callback object
 * @param callback Callback object in which is stored the result of the query execution
 */
var getProperties_aux = function(callback){

    /*
    validation of the query execution result
     */
    val.assertRows(callback);

    /*
    the result is stored in the callback object
     */
    callback.types = [];

    /*
    copy process
     */
    callback.rows.forEach(function(entry){
        callback.types.push(entry);
    });

    cbu.next(callback,"error 007");
}

/**
 * Internal use: it adds some columns to the temporary table of the current entity
 * @param callback Callback object
 */
var setTable = function(callback){
    database.execute(GIS, queries.setTable(), [], callback);
}

/**
 * Internal use: this method is called after the creation process, and it updates the counter by decrementing it.
 * When the count reaches the zero, the workflow for the current entity ends.
 */
var afterCreate = function(callback){

    val.assertNotUndefined(callback, "oi099");

    /*
    check the counter validity
     */
    if (counter >= 0){


        /*
        at this point the creation of a new record within the main database is ensure, then the counter value
        is decremented
         */
        counter --;

        /*
        when the counter reaches  zero, then workflow for the current entity ends.
         */
        if (counter <= 0){
            callback.list = callback.list_next;
            cbu.next(callback,"error 009");
        }
    }
}

/**
 * Internal use: this method is called when the workflow for an entity ends. It calls the init method
 */
var endEntity = function(){
    init();
}

/**
 * Internal use: it initializes the callback object and the workflow for the selected entity. Then the
 * process starts with the first call
 */
var startProcess = function(){
    /**
     * Callback object init
     * @type {{params: {type: number}, list: Array}} It contains the identified of the current entity type
     * and the empty initialization of the list field used as a queue of method calls
     */
    var callback = {
        params : {
            type : current
        },
        list : []
    };

    /*
    debug message
     */
    log.debug("CURRENT: "+params.typeDescriptions[current]);

    /*
    workflow
     */
    callback.list.push(endEntity);
    callback.list.push(applyProperties);
    callback.list.push(getProperties_aux);
    callback.list.push(getProperties);

    getProperties(callback);
}

/**
 * It manages the import process
 */
var init = function(){
    console.log("init");

    /*
    the counter variable, which represent the number of record to insert/update and used for
    progression purposes is reset
     */
    counter = 0;

    /*
    if the current entity identifier is undefined, it means that it is the first execution.
     */
    if (current === undefined){

        /*
        if it is the first execution, then then the first entity is selected
         */
        current = 0;
    } else {

        /*
        if it is not the first execution, then the next entity is selected
         */
        current++;
    }

    /*
    check if the identifier of the current entity it is within the range
     */
    if (current < params.types.length){
        /*
        start the import process for the selected entity
         */
        startProcess();
    } else {

        /*
        otherwise the process has been completed for all the entities. At this point the program ends.
         */
        log.end();
    }
}

var applyTimestamp = function(){
    var callback = {
        params : {
            type : current
        },
        list : [log.end]
    };
    setTimestamp(callback);
}

var updateNames = function(){

    counter = 0;

    if (current === undefined){
        current = 3;
        console.log("current: "+current);

        var callback = {
            params : {
                type : current
            },
            list : [updateNames, storeNames]
        };
        getNames(callback);
    } else {
        current++;
        if (current < params.types.length){
            var callback = {
                params : {
                    type : current
                },
                list : [updateNames, storeNames]
            };
            getNames(callback);
        } else {
            log.end();
        }

    }
}

var reindexTables = function () {
    var callback = {
        params : {
            type : current
        },
        list : [log.end]
    };
    database.execute(GIS, queries.reindexTables(callback), [], callback);
}

var applySoftDelete = function () {
    var callback = {
        params : {
            type : current
        },
        list : [log.end]
    };
    softDeleteRecords(callback);
}

var applyHardDelete = function () {
    var callback = {
        params : {
            type : current
        },
        list : [log.end]
    };
    hardDeleteRecords(callback);
}

var move = function(){
    var callback = {
        params : {
            type : current
        },
        list : [log.end]
    };
    moveRows(callback);
}

var updateTable = function(){
    var callback = {
        params : {
            type : current
        },
        list : [log.end]
    };
    setTable(callback);
}

var runAll = function(){
    var spawn = require('child_process').spawn;
    var child = spawn('./import.sh', ['/Users/gustavosoria/Desktop/sernaglia.xml']);

    child.stdout.on('data', function(data) {
        console.log(decodeURI(data));
    });

    child.stderr.on('data', function (data) {
        try {
            console.log(decodeURI(data));
        } catch (ex){
            console.log("Processing...");
        }
    });
}

var test = function () {

    console.log("my test");
}

module.exports.init = init;
module.exports.runAll = runAll;
module.exports.move = move;
module.exports.applyTimestamp = applyTimestamp;
module.exports.updateTable = updateTable;
module.exports.updateNames = updateNames;
module.exports.reindexTables = reindexTables;
module.exports.applySoftDelete = applySoftDelete;
module.exports.applyHardDelete = applyHardDelete;
module.exports.test = test;