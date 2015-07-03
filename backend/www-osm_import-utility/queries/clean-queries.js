/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Clean queries module
 */

/**
 * Query used to delete the temporary tables
 * @returns {string} the query string
 */
var cleanTemp = function(){
    return "    DROP TABLE IF EXISTS planet_osm_line;" +
               "DROP TABLE IF EXISTS planet_osm_roads;" +
               "DROP TABLE IF EXISTS planet_osm_polygon;" +
               "DROP TABLE IF EXISTS planet_osm_point;" ;
}

/**
 * RESET
 * only for test purposes
 * Query used to delete the main tables.
 * @returns {string} the query string
 */
var cleanMain = function(){
    return "    DELETE FROM osm_line;" +
        "DELETE FROM osm_roads;" +
        "DELETE FROM osm_polygon;" +
        "DELETE FROM osm_point;" +
        "DELETE FROM line_names;" +
        "DELETE FROM line_names_rel;" +
        "DELETE FROM road_names;" +
        "DELETE FROM road_names_rel;" +
        "DELETE FROM polygon_names;" +
        "DELETE FROM polygon_names_rel;" +
        "DELETE FROM point_names;" +
        "DELETE FROM point_names_rel;";
}

module.exports.cleanTemp = cleanTemp;
module.exports.cleanMain = cleanMain;