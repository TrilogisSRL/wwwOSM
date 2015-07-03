/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Clean data of the temporary database module
 */

/**
 * Import of the queries module
 * @type {exports}
 */
var queries = require ('./queries/clean-queries');

/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./db/db.js');

/**
 * Import of the params module
 * @type {exports}
 */
var params= require('./util/params.js');

/**
 * Import of the debug module
 * @type {exports}
 */
var debug = require('./util/debug.js');

/**
 * Short link for the variable of the temporary database
 * @type {exports.TEMP|*}
 */
var GIS = params.GIS;

/*
execute the clean process
 */
database.execute(GIS, queries.cleanTemp(), [], {list: [debug.end]});