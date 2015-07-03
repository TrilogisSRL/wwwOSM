/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Way Service module
 */

/**
 * Way DAO module
 * @type {exports}
 */
var wayDao = require('./../dao/way-dao.js');

/**
 * Boundary builder module
 * @type {exports}
 */
var boundaryBuilder = require('./../util/boundary.js');

/**
 * Response util module
 * @type {exports}
 */
var responseUtil = require('./../services_util/response.js');

var Quadkey = require('quadkeytools');

function listen (router){

    /*
     the web service searches for a way object with the given identifier and it
     returned the object found as JSON. If the identifier is not recognized in the system,
     then an empty object is returned.
    */


    router.get('/polygon/:id', function(request, response) {

        var _callback =
        {
            'parameter'   :   response,
            'list'        :
                [   responseUtil.printGeometry
                ]
        };

        wayDao.getPolygonByOsmId(request.params.id, _callback);
    });

    router.get('/polyline/:id', function(request, response) {

        var _callback =
        {
            'parameter'   :   response,
            'list'        :
                [   responseUtil.printGeometry
                ]
        };

        wayDao.getPolylineByOsmId(request.params.id, _callback);
    });

    router.post('/polyline/by_name', function(request, response) {
        var name = request.post.name;
        console.log(name);
        var _callback =
        {
            parameter   :   response,
            name        :   name,
            list        :
                [   responseUtil.printGeometries
                ]
        };

        wayDao.getPolylinesByName(_callback);
    });

    router.post('/bbox', function(request, response) {

        var maxLatitude =  request.post.maxLatitude;
        var maxLongitude =  request.post.maxLongitude;
        var minLatitude =  request.post.minLatitude;
        var minLongitude =  request.post.minLongitude;
        var lod = request.post.lod;

        var excludePolygons = [];
        var excludeLines = [];

        console.log(request.post);

        var _bbox = boundaryBuilder.build(
            minLatitude,
            maxLatitude,
            minLongitude,
            maxLongitude);


//        if (lod === 9){
//            lod = 15;
//        } else if (lod === 8){
//            lod = 12;
//        } else if (lod === 7){
//            lod = 10;
//        }

        var _callback =
        {
            lod             :    lod,
            bbox            :    _bbox,
            excludePolygons :   excludePolygons,
            excludeLines    :   excludeLines,
            parameter       :   response,
            list            :
                [   responseUtil.print,
                    //wayDao.getPolylinesByBbox,
                    //responseUtil.print
                ]
        };

        wayDao.getPolygonsByBbox(_callback);
    });

    router.get('/bboxtest', function(request, response) {

        var _bbox = boundaryBuilder.build(
            46.05878,
            46.07578,
            11.11473,
            11.13273);

        var _callback =
        {
            lod             :    18,
            bbox            :    _bbox,
            parameter       :   response,
            list            :
                [   responseUtil.print,
                    wayDao.getPolylinesByBbox,
                    responseUtil.print
                ]
        };

        wayDao.getPolygonsByBbox(_callback);
    });


}

exports.start = listen;