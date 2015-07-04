/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Node-DAO-queries module
 */

/**
 * Retrieve a point with its properties and tags by providing its identifier.
 *
 * It requires the following parameters:
 *
 * 1: bigint -> identifier.
 *
 * @returns {string} the query string
 */
var getPointByOsmId = function(){
    var _query = "SELECT array_to_json(array_agg(osm_point)) as way, ST_AsGeoJSON(way) as geom FROM osm_point WHERE osm_id = $1::bigint AND is_deleted = false GROUP BY way";
    return _query;
}

/**
 * Retrieve all the nodes (each of them with its properties and tags included) by providing a bounding box.
 * If some parts of the geometries are not in the selected bounding box, then the geometries are cut and only the parts
 * within the bounding box are maintained.
 *
 * It requires the following parameters:
 * 1: bigint    ->  latitude lower bound;
 * 2: bigint    ->  longitude lower bound;
 * 3: bigint    ->  latitude upper bound;
 * 4: bigint    ->  longitude upper bound;
 * 5: integer   ->  level of detail;
 *
 * @returns {string} the query string
 */
var getPointsByBBox = function(){

    var _query = "SELECT *, ST_AsGeoJSON(geomm) as geom " +
        "FROM (	SELECT * " +
        "FROM (	SELECT osm_id, ST_Intersection(osm_point.way, bbox.geom) as geomm " +
        "FROM osm_point, (SELECT ST_SetSRID(ST_MakeBox2d(ST_MakePoint($1::float, $2::float), ST_MakePoint($3::float, $4::float)), 4326) as geom) as bbox " +
        "WHERE ST_Intersects(osm_point.way, bbox.geom)) AND is_deleted = false " +
        "fc ) as t";

    return _query;
}

module.exports.getPointByOsmId = getPointByOsmId;
module.exports.getPointsByBBox = getPointsByBBox;