/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Line entity
 */

/**
 *  Model of the Polygon style
 * @type {{table: string, typeId: string, typeKey: string, typeValue: string, colorFill: string, colorBorder: string, lod: string, lineWidth: string, elevation: string}}
 */
var model = {
    table : "polygon_style_properties",
    typeId : "type_id",
    typeKey : "type_key",
    typeValue : "type_value",
    colorFill : "color_fill",
    colorBorder : "color_border",
    lod : "lod",
    lineWidth : "line_width",
    elevation : "elevation"
}

module.exports.model = model;