/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Road entity
 */

/**
 * Model of the Road entity
 * @type {{table: string, styleTable: string, osmId: string, isDeleted: string, typeId: string, geom: string}}
 */
var model = {
    table : "osm_roads",
    nameTable : "road_names",
    nameRelTable : "road_names_rel",
    styleTable : "roads_style_properties",
    osmId : "osm_id",
    isDeleted : "is_deleted",
    typeId : "type_id",
    geom : "geom"
}

module.exports.model = model;