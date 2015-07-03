/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Point entity
 */

/**
 * Model of the Point entity
 * @type {{table: string, styleTable: string, osmId: string, isDeleted: string, typeId: string, geom: string}}
 */
var model = {
    mainTable : "osm_point",
    tempTable : "planet_osm_point",
    nameTable : "point_names",
    nameRelTable : "point_names_rel",
    styleTable : "point_style_properties",
    osmId : "osm_id",
    isDeleted : "is_deleted",
    typeId : "type_id",
    geom : "geom"
}

module.exports.model = model;