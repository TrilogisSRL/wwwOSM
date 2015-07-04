/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search Service module
 */

/**
 * Import of the Source DAO module
 * @type {exports}
 */
var sourceDAO = require('./../dao/sources-dao.js');

/**
 * Import of the Response util module
 * @type {exports}
 */
var responseUtil = require('./../services_util/response.js');


/**
 * Web services for the Import process
 * @param router
 */
function listen (router){

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
}

exports.start = listen;
