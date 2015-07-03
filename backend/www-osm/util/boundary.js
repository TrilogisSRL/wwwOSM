/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * The boundary object represents the area in which the geometries are displayed.
 */


var val = require('./validator');

/**
 * The object which contains the coordinates of a boundary
 * @param latitudeLB The lower bound latitude
 * @param latitudeUB The upper bound latitude
 * @param longitudeLB The lower bound longitude
 * @param longitudeUB The upper bound longitude
 * @returns {{}} The boundary object
 */
var build = function(latitudeLB, latitudeUB, longitudeLB, longitudeUB) {

    /*
    validation of the coordinates
     */
    val.assertNotUndefined(latitudeLB);
    val.assertNotUndefined(latitudeUB);
    val.assertNotUndefined(longitudeLB);
    val.assertNotUndefined(longitudeUB);

    var boundary = {};
    boundary.latitudeLB = latitudeLB;
    boundary.latitudeUB = latitudeUB;
	boundary.longitudeLB = longitudeLB;
    boundary.longitudeUB = longitudeUB;

  	return boundary;
};

exports.build = build;