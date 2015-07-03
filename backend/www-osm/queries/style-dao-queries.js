/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search DAO queries module
 */


var polygonStyle = require('./../models/polygon_style.js');
var polygonStyleModel = polygonStyle.model;

var lineStyle = require('./../models/line_style.js');
var lineStyleModel = lineStyle.model;

var getPolygonStyles = function () {
    var query = "SELECT * FROM "+polygonStyleModel.table+" ORDER BY "+polygonStyleModel.typeKey+", "+polygonStyleModel.typeValue+";";
    console.log(query);
    return query;
}

var getPolygonStylesOrderByLod = function () {
    var query = "SELECT * FROM "+polygonStyleModel.table+" ORDER BY "+polygonStyleModel.lod+" DESC, "+polygonStyleModel.typeKey+", "+polygonStyleModel.typeValue+";";
    console.log(query);
    return query;
}

var getPolygonStylesOrderByElevation = function () {
    var query = "SELECT * FROM "+polygonStyleModel.table+" ORDER BY "+polygonStyleModel.elevation+" DESC, "+polygonStyleModel.lod+", "+polygonStyleModel.typeKey+", "+polygonStyleModel.typeValue+";";
    console.log(query);
    return query;
}


var updatePolygonStyle = function (){
    var query = "UPDATE "+polygonStyleModel.table+" " +
        "SET "+polygonStyleModel.lod+" = $1::integer, " +
        polygonStyleModel.elevation+" = $2::integer, " +
        polygonStyleModel.colorFill+" = $3::varchar, " +
        polygonStyleModel.colorBorder+" = $4::varchar " +
        "WHERE "+polygonStyleModel.typeId+" = $5::integer RETURNING *;";
    return query;
}

//line

var getLineStyles = function () {
    var query = "SELECT * FROM "+lineStyleModel.table+" ORDER BY "+lineStyleModel.typeKey+", "+lineStyleModel.typeValue+";";
    console.log(query);
    return query;
}

var getLineStylesOrderByLod = function () {
    var query = "SELECT * FROM "+lineStyleModel.table+" ORDER BY "+lineStyleModel.lod+" DESC, "+lineStyleModel.typeKey+", "+lineStyleModel.typeValue+";";
    console.log(query);
    return query;
}

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