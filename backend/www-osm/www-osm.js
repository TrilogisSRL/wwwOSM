/**
 * @author Trilogis
 * @type {exports}
 */

//IMPORTS
var http = require("http");

var wayServices = require('./services/wayServices.js');
var nodeServices = require('./services/nodeServices.js');
var searchServices = require('./services/searchServices.js');
var sourceServices = require('./services/sourceServices.js');
var styleServices = require('./services/styleServices.js');
var importServices = require('./services/importServices.js');
//var bboxServices = require('./services/bboxServices.js');
//var relationServices = require('./services/relationServices.js');

var Router = require('node-simple-router');

//INIT VARS
var router = Router();
var server = http.createServer(router);

//HOME
router.get('/', function(request, response) {
    response.end("<html><head><title>www-osm</title></head><body><div>www-osm</div></body></html>");
});

//SERVER STARTUP
server.listen(8080);

//WEB-SERVICES STARTUP
wayServices.start(router);
nodeServices.start(router);
searchServices.start(router);
sourceServices.start(router);
styleServices.start(router);
importServices.start(router);
//bboxServices.start(router);
//relationServices.start(router);

console.log ("server is ready :)");