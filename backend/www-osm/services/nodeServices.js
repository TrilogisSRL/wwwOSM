/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Node Service module
 */

/**
 * Node DAO module
 * @type {exports}
 */
var nodeDao = require('./../dao/node-dao.js');

/**
 * Response util module
 * @type {exports}
 */
var responseUtil = require('./../services_util/response.js');

function listen (router){

    /*
    the web service searches for a node object with the given identifier and it
    returned the object found as JSON. If the identifier is not recognized in the system,
    then an empty object is returned.
     */

    router.get('/point/:id', function(request, response) {

        var _callback =
        {
            'parameter'   :   response,
            'list'        :
                [   responseUtil.printGeometry
                ]
        };

        nodeDao.getNodeById(request.params.id, _callback);
    });
}

exports.start = listen;