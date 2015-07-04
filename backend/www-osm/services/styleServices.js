/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 */

var styleDAO = require('./../dao/styles-dao.js');

/**
 * Response util module
 * @type {exports}
 */
var responseUtil = require('./../services_util/response.js');

/**
 * Web services for the Import process
 * @param router
 */
function listen (router){

    router.get('/styles/polygon', function(request, response) {
            var _callback =
            {
                parameter     :   response,
                list          :
                    [   responseUtil.printSources
                    ]
            };
        styleDAO.getPolygonStyles(_callback);
    });

    router.get('/styles/polygon/order/lod', function(request, response) {
        var _callback =
        {
            parameter     :   response,
            list          :
                [   responseUtil.printSources
                ]
        };
        styleDAO.getPolygonStylesOrderByLod(_callback);
    });

    router.get('/styles/polygon/order/elevation', function(request, response) {
        var _callback =
        {
            parameter     :   response,
            list          :
                [   responseUtil.printSources
                ]
        };
        styleDAO.getPolygonStylesOrderByElevation(_callback);
    });

    router.post('/styles/polygon', function(request, response) {
        var style = request.post;

        if (!(style.lod && style.elevation && style.typeId && style.fillColor && style.borderColor)){
            return;
        }

        var _callback =
        {
            parameter     :   response,
            style        :   style,
            list          :
                [   responseUtil.printSources
                ]
        };
        styleDAO.updatePolygonStyle(_callback);
    });


    //line

    router.get('/styles/line', function(request, response) {
        var _callback =
        {
            parameter     :   response,
            list          :
                [   responseUtil.printSources
                ]
        };
        styleDAO.getLineStyles(_callback);
    });

    router.get('/styles/line/order/lod', function(request, response) {
        var _callback =
        {
            parameter     :   response,
            list          :
                [   responseUtil.printSources
                ]
        };
        styleDAO.getLineStylesOrderByLod(_callback);
    });


    router.post('/styles/line', function(request, response) {
        var style = request.post;

        if (!(style.lod && style.typeId && style.fillColor)){
            return;
        }

        var _callback =
        {
            parameter     :   response,
            style        :   style,
            list          :
                [   responseUtil.printSources
                ]
        };
        styleDAO.updateLineStyle(_callback);
    });
}

exports.start = listen;
