/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search DAO
 */

/**
 * Import of the search-dao-queries module
 * @type {exports}
 */
var queries = require('./../queries/style-dao-queries.js');

/**
 * Import of the database module
 * @type {exports}
 */
var database = require('./../db/db.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./../util/validator.js');

var getPolygonStyles = function(callback){
    /*
     query execution
     */
    database.execute(queries.getPolygonStyles(), [], callback);
}

var getPolygonStylesOrderByLod = function(callback){
    /*
     query execution
     */
    database.execute(queries.getPolygonStylesOrderByLod(), [], callback);
}

var getPolygonStylesOrderByElevation = function(callback){
    /*
     query execution
     */
    database.execute(queries.getPolygonStylesOrderByElevation(), [], callback);
}


var updatePolygonStyle = function(callback){
    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.style.lod, callback.style.elevation, callback.style.fillColor, callback.style.borderColor, callback.style.typeId];

    /*
     query execution
     */
    database.execute(queries.updatePolygonStyle(), _params, callback);
}

//line

var getLineStyles = function(callback){
    /*
     query execution
     */
    database.execute(queries.getLineStyles(), [], callback);
}

var getLineStylesOrderByLod = function(callback){
    /*
     query execution
     */
    database.execute(queries.getLineStylesOrderByLod(), [], callback);
}

var updateLineStyle = function(callback){
    /*
     initialization of the parameters for the parametrized query
     */
    var _params = [callback.style.lod, callback.style.fillColor, callback.style.typeId];

    /*
     query execution
     */
    database.execute(queries.updateLineStyle(), _params, callback);
}

module.exports.getPolygonStyles = getPolygonStyles;
module.exports.getPolygonStylesOrderByLod = getPolygonStylesOrderByLod;
module.exports.getPolygonStylesOrderByElevation = getPolygonStylesOrderByElevation;
module.exports.getLineStyles = getLineStyles;
module.exports.getLineStyles = getLineStyles;
module.exports.getLineStylesOrderByLod = getLineStylesOrderByLod;
module.exports.updateLineStyle = updateLineStyle;
module.exports.updatePolygonStyle = updatePolygonStyle;