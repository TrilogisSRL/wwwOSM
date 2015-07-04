/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search DAO queries module
 */

/**
 * Import of the Polygon Style model
 * @type {exports|module.exports}
 */
var polygonStyle = require('./../models/polygon_style.js');
var polygonStyleModel = polygonStyle.model;

/***
 * Import of the Line Style model
 * @type {exports|module.exports}
 */
var lineStyle = require('./../models/line_style.js');
var lineStyleModel = lineStyle.model;

/**
 * Retrieve the polygon styles
 * @returns {string} query
 */
var getPolygonStyles = function () {
    var query = "SELECT * FROM "+polygonStyleModel.table+" ORDER BY "+polygonStyleModel.typeKey+", "+polygonStyleModel.typeValue+";";
    console.log(query);
    return query;
}

/**
 * Retrieve the polygon styles. The list is ordered by LOD
 * @returns {string} query
 */
var getPolygonStylesOrderByLod = function () {
    var query = "SELECT * FROM "+polygonStyleModel.table+" ORDER BY "+polygonStyleModel.lod+" DESC, "+polygonStyleModel.typeKey+", "+polygonStyleModel.typeValue+";";
    console.log(query);
    return query;
}

/**
 * Retrieve the polygon styles. The list is ordered by Elevation
 * @returns {string} query
 */
var getPolygonStylesOrderByElevation = function () {
    var query = "SELECT * FROM "+polygonStyleModel.table+" ORDER BY "+polygonStyleModel.elevation+" DESC, "+polygonStyleModel.lod+", "+polygonStyleModel.typeKey+", "+polygonStyleModel.typeValue+";";
    console.log(query);
    return query;
}

/**
 * Update the polygon style
 * @returns {string} query
 */
var updatePolygonStyle = function (){
    var query = "UPDATE "+polygonStyleModel.table+" " +
        "SET "+polygonStyleModel.lod+" = $1::integer, " +
        polygonStyleModel.elevation+" = $2::integer, " +
        polygonStyleModel.colorFill+" = $3::varchar, " +
        polygonStyleModel.colorBorder+" = $4::varchar " +
        "WHERE "+polygonStyleModel.typeId+" = $5::integer RETURNING *;";
    return query;
}

/**
 * Retrieve the line styles
 * @returns {string} query
 */
var getLineStyles = function () {
    var query = "SELECT * FROM "+lineStyleModel.table+" ORDER BY "+lineStyleModel.typeKey+", "+lineStyleModel.typeValue+";";
    return query;
}

/**
 * Retrieve the line styles. The list is ordered by LOD
 * @returns {string} query
 */
var getLineStylesOrderByLod = function () {
    var query = "SELECT * FROM "+lineStyleModel.table+" ORDER BY "+lineStyleModel.lod+" DESC, "+lineStyleModel.typeKey+", "+lineStyleModel.typeValue+";";
    console.log(query);
    return query;
}

/**
 * Retrieve the line styles. The list is ordered by Elevation
 * @returns {string} query
 */
var updateLineStyle = function (){
    var query = "UPDATE "+lineStyleModel.table+" " +
        "SET "+lineStyleModel.lod+" = $1::integer, " +
        lineStyleModel.colorFill+" = $2::varchar " +
        "WHERE "+lineStyleModel.typeId+" = $3::integer RETURNING *;";
    return query;
}

module.exports.getPolygonStyles = getPolygonStyles;
module.exports.getPolygonStylesOrderByLod = getPolygonStylesOrderByLod;
module.exports.getPolygonStylesOrderByElevation = getPolygonStylesOrderByElevation;
module.exports.getLineStyles = getLineStyles;
module.exports.getLineStylesOrderByLod = getLineStylesOrderByLod;
module.exports.updateLineStyle = updateLineStyle;
module.exports.updatePolygonStyle = updatePolygonStyle;