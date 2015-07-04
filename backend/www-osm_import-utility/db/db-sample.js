/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Database Module
 */

/**
 * Parameters import
 * @type {exports}
 */
var params= require('./../util/params.js');

/**
 * PostgreSQL client for node.js module import.
 * @type {exports}
 */
var pg = require('pg');

/**
 * Username for the main database
 * @type {string}
 */
var gisDatabaseUser = '<username>';

/**
 * Name of the main database
 * @type {string}
 */
var gisDatabaseName = '<database_name>';

/**
 * Address of the main database
 * @type {string}
 */
var gisDatabaseAddress = '<database_address>';

/**
 * Password of the main database
 * @type {string}
 */
var gisDatabasePassword = '<database_password>';

/**
 * Connection string for the main database
 * @type {string}
 */
var gisDatabase = "postgres://"+gisDatabaseUser+":"+gisDatabasePassword+"@"+gisDatabaseAddress+"/"+gisDatabaseName+"";

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

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./../validation/validation.js');

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
 * Execute the query on the given database
 * @param database Database variable in which the query has been executed
 * @param query Query string
 * @param params Parameters for the query
 * @param callback Callback object
 */
var executeQuery = function(database, query, params, callback){

    /*
    connection
     */
    pg.connect(gisDatabase, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        //console.log(query);
        client.query(query, params, function(err, result) {
            done();
            if(err) {

                console.error('error running query\n'+query+"\n"+params+"\n", err);

                if (callback && callback.onError){
                    callback.onError(callback);
                } else {
                    //err 42601: duplicate value generated after storeName procedure;
                    if (parseInt(err.code) !== 42601){

                        console.error('error running query\n'+query+"\n"+params+"\n", err);
                    }
                }
            } else {
                /*
                At this step the query has been correctly executed
                and the result is stored in result.rows.

                The result is stored also in the callback object
                [callback.rows]
                in order to be used in the process flow.

                Then, the next method is called.
                 */
                if (callback && callback.list) {
                    var _next = callback.list.pop();
                    if (_next) {
                        callback.rows = result.rows;
                        _next(callback);
                    }
                }
            }
        });
    });
}


var executeStoreNameQuery = function(database, vars, callback){

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

    var nameTable = getNameTable(callback);
    var nameRelTable = getNameRelTable(callback);

    /*
     connection
     */
    pg.connect(gisDatabase, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        //console.log(query);
        var query2 = "INSERT INTO "+nameRelTable+" "+
            "(osm_id, name_id) "+
            "SELECT $2::bigint, (SELECT name_id FROM "+nameTable+" WHERE name = $1::varchar) "+
            "WHERE "+
            "NOT EXISTS ( "+
            "(SELECT * FROM "+nameRelTable+" WHERE osm_id = $2::bigint AND name_id = (SELECT name_id FROM "+nameTable+" WHERE name = $1::varchar)) "+
            ");";

        client.query("INSERT INTO "+nameTable+" "+
            "(name) "+
            "SELECT $1::varchar "+
            "WHERE "+
            "NOT EXISTS ( "+
            "(SELECT name_id FROM "+nameTable+" WHERE \"name\" = $1::varchar) "+
            ")", [vars[0]], function(err, result) {

            client.query(query2, vars, function(err, result) {
                done();
                if(err) {
                }
                else {
                    if (callback && callback.list) {
                        var _next = callback.list.pop();
                        if (_next) {
                            callback.rows = result.rows;
                            _next(callback);
                        }
                    }
                }
            });
        });


    });
}

module.exports.execute = executeQuery;
module.exports.executeStoreNameQuery = executeStoreNameQuery;
