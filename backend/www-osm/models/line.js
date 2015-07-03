/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Line entity
 */


/**
 * Model of the Line entity
 * @type {{table: string, styleTable: string, osmId: string, isDeleted: string, typeId: string, geom: string}}
 */
var model = {
    table : "osm_line",
    nameTable : "line_names",
    nameRelTable : "line_names_rel",
    styleTable : "line_style_properties",
    osmId : "osm_id",
    isDeleted : "is_deleted",
    typeId : "type_id",
    geom : "geom"
}

module.exports.model = model;