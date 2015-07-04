/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 */

var logDAO = require('./../dao/log-dao.js');

var sourceDAO = require('./../dao/sources-dao.js');

/**
 * Response util module
 * @type {exports}
 */
var responseUtil = require('./../services_util/response.js');


/**
 * Internal use
 * @param callback
 */
var execute = function(callback){

    var isValid = function(str){
        if (str.indexOf("Processing") > -1){
            return false;
        }

        var temp = str.replace(new RegExp('.', 'g'), '');
        temp = temp.replace(new RegExp('', 'g'), '');
        if (temp.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    if (callback.log.log_id){
        responseUtil.outputLogId(callback);
        var spawn = require('child_process').spawn;
        console.log("./import.sh "+callback.source.source_url+" "+callback.source.source_filename);
        var child = spawn('./../www-osm_import-utility/import.sh', [callback.source.source_url, callback.source.source_filename]);

        child.stdout.on('data', function(data) {
            var string = decodeURI(data);
            if (isValid(string)){
                console.log(string);
                logDAO.createLogDetail(callback.log.log_id, string);
            }
        });

        child.stderr.on('data', function (data) {
            var string = "";
            try {
                string = decodeURI(data);
                if (isValid(string)){
                    console.log(string);
                    logDAO.createLogDetail(callback.log.log_id, string);
                }
            } catch (ex){
                logDAO.createLogDetail(callback.log.log_id, string);
            }
        });

    } else {
        // nothing to do
    }
}

/**
 * Web services for the Import process
 * @param router
 */
function listen (router){

    var fillSourceObj = function(callback){
        if (callback && callback.rows && callback.rows[0]){
            callback.source = callback.rows[0];
            if (callback.list){
                var _next = callback.list.pop();

                if (_next) {
                    _next(callback);
                }
            }
        }
    }

    var fillLogObj = function(callback){
        if (callback && callback.rows && callback.rows[0]){
            callback.log = callback.rows[0];
            if (callback.list){
                var _next = callback.list.pop();

                if (_next) {
                    _next(callback);
                }
            }
        }
    }

    router.get('/import/:id', function(request, response) {
        var sourceId = request.params.id;;
        var callback = {

            list : [execute, sourceDAO.updateLastLogId, fillSourceObj, sourceDAO.getSourceById, fillLogObj],
            source : {sourceId : sourceId},
            parameter:   response
        };

        logDAO.createLog(callback);
    });

    router.get('/log/:id', function(request, response) {
        var logId = request.params.id;

        var callback = {
            log : {logId : logId},
            list : [responseUtil.outputLog],
            parameter:   response
        };

        logDAO.getLogDetails(callback);
    });
}

exports.start = listen;
