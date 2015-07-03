/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Polygon entity
 */

/**
 * Model of the Polygon entity
 * @type {{table: string, styleTable: string, osmId: string, isDeleted: string, typeId: string, geom: string}}
 */
var model = {
    table : "osm_polygon",
    nameTable : "polygon_names",
    nameRelTable : "polygon_names_rel",
    styleTable : "polygon_style_properties",
    osmId : "osm_id",
    isDeleted : "is_deleted",
    typeId : "type_id",
    geom : "geom"
}

module.exports.model = model;