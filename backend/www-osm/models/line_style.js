/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Line entity
 */

/**
 *  Model of the Line style
 * @type {{table: string, typeId: string, typeKey: string, typeValue: string, colorFill: string, colorBorder: string, lod: string, lineWidth: string, elevation: string}}
 */
var model = {
    table : "line_style_properties",
    typeId : "type_id",
    typeKey : "type_key",
    typeValue : "type_value",
    colorFill : "color_fill",
    lod : "lod",
    lineWidth : "line_width",
}

module.exports.model = model;