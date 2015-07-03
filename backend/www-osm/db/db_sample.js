/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Database Module
 */

/**
 * PostgreSQL client for node.js module import.
 * @type {exports}
 */
var pg = require('pg');

/**
 * Username for the database connection
 * @type {string}
 */
var username = "<username>";

/**
 * Password for the database connection
 * @type {string}
 */
var password = "<password>";

/**
 * Name of the database
 * @type {string}
 */
var database = "<database>";

/**
 * Address of the database
 * @type {string}
 */
var address = "<address>";

/**
 * Connection string for the database
 * @type {string}
 */
var connString = "postgres://"+username+":"+password+"@"+address+"/"+database;

/**
 * The method executes on the database the given query with the given parameters. The result is then
 * enclosed in the callback object, which contains also the method to call after the database querying.
 * @param query the query to execute
 * @param params the parameters for the query
 * @param callback the object which contains the information about the current process and the next methods calls
 */
var executeQuery = function(query, params, callback){
    /*
     database connection
     */
    pg.connect(connString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        /*
         execute the query
         */
        client.query(query, params, function(err, result) {
            /*
             release to client
             */
            done();
            if(err) {
                if (callback && callback.onError){
                    callback.onError(callback);
                } else {
                    console.error('error running query\n'+query+"\n"+params+"\n", err);
                }
            } else {
                /*
                 If no errors have been detected, then the list of the result is enclosed in
                 the callback.
                 The call for the next method is retrieved from the database object
                 */
                if (callback) {
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

module.exports.execute = executeQuery;
module.exports.conString = connString;