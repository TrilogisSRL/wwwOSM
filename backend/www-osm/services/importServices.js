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
        console.log("execute");

        responseUtil.outputLogId(callback);
        //console.log(callback);

        console.log("execute2");

        var spawn = require('child_process').spawn;
        //var child = spawn('./../www-osm_import-utility/test.sh', []);
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
                //console.log(string);
                if (isValid(string)){
                    console.log(string);
                    logDAO.createLogDetail(callback.log.log_id, string);
                }
            } catch (ex){
                //string = "Processing...";
                //console.log(string);
                logDAO.createLogDetail(callback.log.log_id, string);
            }
        });

        //child.stderr.on('end', function (data) {
        //    //console.log("end ----");
        //    //process.exit(0);
        //});
    } else {
        console.log(">>>>>error on method EXECUTE");
        console.log(callback);
    }
}

//PUBLIC METHODS
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
        //console.log("IMPORT")
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
        //console.log("IMPORT")

        var callback = {
            log : {logId : logId},
            list : [responseUtil.outputLog],
            parameter:   response
        };

        logDAO.getLogDetails(callback);
    });
}

exports.start = listen;
