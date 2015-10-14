/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Line entity
 */

/**
 * Model of the Point style
 * @type {{table: string, typeId: string, typeKey: string, typeValue: string, colorFill: string, lod: string}}
 */

var model = {
    table : "point_style_properties",
    typeId : "type_id",
    typeKey : "type_key",
    typeValue : "type_value",
    colorFill : "color_fill",
    //colorBorder : "color_border",
    lod : "lod"
    //lineWidth : "line_width",
    //elevation : "elevation"
}

module.exports.model = model;