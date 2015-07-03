/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search Service module
 */

/**
 * Search controller import
 * @type {exports}
 */
var searchController = require('./../controllers/searchController.js');

/**
 * Response util module
 * @type {exports}
 */
var responseUtil = require('./../services_util/response.js');

/**
 * Parameters module
 * @type {exports}
 */
var params = require('./../util/params.js');


//PUBLIC METHODS
function listen (router){


    router.get('/search/line/:lod/:match', function(request, response) {
        var _match = request.params.match.replace("_", " ");
        var _lod = request.params.lod;

        var _callback =
        {
            name          :   _match,
            lod           :   _lod,
            params        :   {type: params.LINE},
            parameter     :   response,
            list          :
                [   responseUtil.printNames
                ]
        };
        searchController.getByPartialName(_callback);
    });

    router.get('/search/point/:lod/:match', function(request, response) {
        var _match = request.params.match.replace("_", " ");
        var _lod = request.params.lod;

        var _callback =
        {
            name          :   _match,
            lod           :   _lod,
            params        :   {type: params.POINT},
            parameter     :   response,
            list          :
                [   responseUtil.printNames
                ]
        };
        searchController.getByPartialName(_callback);
    });


    router.get('/search/polygon/:lod/:match', function(request, response) {
        var _match = request.params.match.replace("_", " ");
        var _lod = request.params.lod;

        var _callback =
        {
            name          :   _match,
            lod           :   _lod,
            params        :   {type: params.POLYGON},
            parameter     :   response,
            list          :
                [   responseUtil.printNames
                ]
        };
        searchController.getByPartialName(_callback);
    });

}

exports.start = listen;
