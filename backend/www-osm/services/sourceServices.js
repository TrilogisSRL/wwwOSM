/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search Service module
 */

///**
// * Search controller import
// * @type {exports}
// */
var sourceDAO = require('./../dao/sources-dao.js');

/**
 * Response util module
 * @type {exports}
 */
var responseUtil = require('./../services_util/response.js');



//PUBLIC METHODS
function listen (router){

    //console.log("start");
    //router.get('/sources/', function(request, response) {
    //
    //    var _callback =
    //    {
    //        parameter     :   response,
    //        list          :
    //            [   responseUtil.printSources
    //            ]
    //    };
    //    sourceDAO.getSources(_callback);
    //});

    router.get('/sources', function(request, response) {
            var _callback =
            {
                parameter     :   response,
                list          :
                    [   responseUtil.printSources
                    ]
            };
            sourceDAO.getSources(_callback);
    });

    router.post('/sources', function(request, response) {
        console.log(request.post);
        var source = request.post;

        var _callback =
        {
            parameter     :   response,
            source        :   source,
            list          :
                [   responseUtil.printSources
                ]
        };
        sourceDAO.addSource(_callback);
    });

    router.get('/source/update/:id', function(request, response) {
        var sourceId = request.params.id;

        var _callback =
        {
            parameter     :   response,
            sourceId        :   sourceId,
            list          :
                [   responseUtil.printSources
                ]
        };
        sourceDAO.updateLastImport(_callback);
    });

    //router.post('/source/', function(request, response) {
    //    var sourceId = request.params.id;
    //
    //    var _callback =
    //    {
    //        parameter     :   response,
    //        sourceId        :   sourceId,
    //        list          :
    //            [   responseUtil.printSources
    //            ]
    //    };
    //    sourceDAO.updateLastImport(_callback);
    //});

    router.get('/source/:id', function(request, response) {
        var sourceId = request.params.id;

        var _callback =
        {
            parameter   :   response,
            source      :   { sourceId : sourceId },
            list        :
                [   responseUtil.printSources
                ]
        };
        sourceDAO.getSourceById(_callback);
    });

    //router.post('/sources/', function(request, response) {
    //    //var _match = request.params.match.replace("_", " ");
    //    //var _lod = request.params.lod;
    //    //
    //    //var _callback =
    //    //{
    //    //    name          :   _match,
    //    //    lod           :   _lod,
    //    //    params        :   {type: params.POINT},
    //    //    parameter     :   response,
    //    //    list          :
    //    //        [   responseUtil.printNames
    //    //        ]
    //    //};
    //    //searchController.getByPartialName(_callback);
    //});


    //router.get('/search/update/:id/', function(request, response) {
    //
    //    var _id = request.params.id;
    //    console.log(_id);
    //    //var _lod = request.params.lod;
    //    //
    //    //var _callback =
    //    //{
    //    //    name          :   _match,
    //    //    lod           :   _lod,
    //    //    params        :   {type: params.POLYGON},
    //    //    parameter     :   response,
    //    //    list          :
    //    //        [   responseUtil.printNames
    //    //        ]
    //    //};
    //    //searchController.getByPartialName(_callback);
    //});
}

exports.start = listen;
