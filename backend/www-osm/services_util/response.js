/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Response util module
 */

var send = function(callback) {
    if (callback) {

        if (callback.obj) {
            callback.parameter.setHeader('Content-Type', 'application/json');
            callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
            callback.parameter.end(JSON.stringify(callback.obj));
        } else {
            callback.parameter.end("an error as occurred with code 001");
        }
    }
};

var print = function(callback) {

    if (callback.rows.length === 0){
        callback.parameter.end(JSON.stringify({"type": "GeometryCollection", "geometries": []}));
        return;
    }

    callback.parameter.setHeader('Content-Type', 'application/json');
    callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
    if (callback.obj === undefined){
        callback.obj = {"type": "GeometryCollection", "geometries": []};
    }

    for (var i in callback.rows){

        var obj = callback.rows[i];
        var geom = JSON.parse(callback.rows[i].geom);
        var toJSON = {
            'type': geom.type,
            'id': obj.osm_id,
            'coordinates': geom.coordinates,
            'properties': {}
        }

        delete obj['way'];
        delete obj['osm_id'];
        delete obj['bgeom'];
        delete obj['geom'];
        delete obj['geomm'];

        for (var k in obj) {
            if (!(obj[k] === null || obj[k] === undefined)) {
                if (k === 'color_fill' || k === 'color_border'){
                    toJSON.properties[k] = "#"+obj[k];
                } else {
                    toJSON.properties[k] = obj[k];
                }
            }
        }
        callback.obj.geometries.push(toJSON);
    }

    var _next = callback.list.pop();
    if (_next){
        _next(callback);
    } else {
        callback.parameter.end(JSON.stringify(callback.obj));
    }
};

var printSources = function(callback){
    if (callback.rows && callback.rows[0]){
        callback.parameter.setHeader('Content-Type', 'application/json');
        callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
        callback.parameter.end(JSON.stringify(callback.rows));
    } else {
    callback.parameter.end("an error as occurred with code 0021");
}
}

var printSource = function(callback){
    if (callback.rows && callback.rows[0]){
        callback.parameter.setHeader('Content-Type', 'application/json');
        callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
        callback.parameter.end(JSON.stringify(callback.rows[0]));
    } else {
        callback.parameter.end("an error as occurred with code 0022");
    }

}

var printGeometry = function(callback) {
    callback.parameter.setHeader('Content-Type', 'application/json');
    callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
    var toJSON = {};
    if (callback.rows && callback.rows[0] && callback.rows[0].way[0]) {
        var obj = callback.rows[0].way[0];
        var geom = JSON.parse(callback.rows[0].geom);
        toJSON = {
            'type': geom.type,
            'id': obj.osm_id,
            'coordinates': geom.coordinates,
            'properties': {}
        }

        delete obj['way'];
        delete obj['osm_id'];
        delete obj['geom'];

        for (var k in obj) {
            if (!(obj[k] === null || obj[k] === undefined)) {
                if (k === 'color_fill' || k === 'color_border') {
                    toJSON.properties[k] = "#" + obj[k];
                } else {
                    toJSON.properties[k] = obj[k];
                }
            }
        }
    }
    callback.parameter.end(JSON.stringify(toJSON));
};


var printGeometries = function(callback) {
    callback.parameter.setHeader('Content-Type', 'application/json');
    callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
    var list = [];
    var toJSON = {};
    if (callback.rows) {
        for (var i in callback.rows){
            var obj = callback.rows[i];
            var geom = JSON.parse(callback.rows[i].geom);
            toJSON = {
                'type': geom.type,
                'id': obj.osm_id,
                'coordinates': geom.coordinates,
                'properties': {}
            }

            delete obj['way'];
            delete obj['osm_id'];
            delete obj['geom'];

            for (var k in obj) {
                if (!(obj[k] === null || obj[k] === undefined)) {
                    if (k === 'color_fill' || k === 'color_border') {
                        toJSON.properties[k] = "#" + obj[k];
                    } else {
                        toJSON.properties[k] = obj[k];
                    }
                }
            }
            list.push(toJSON);
        }
    }
    callback.parameter.end(JSON.stringify(list));
};


var printNames = function(callback) {
    callback.parameter.setHeader('Content-Type', 'application/json');
    callback.parameter.setHeader('Access-Control-Allow-Origin', '*');

    var list = [];
    var checkExtant = function (name) {
        for (var i in list) {
            if (name === list[i].value) {
                return true;
            }
        }
        return false;
    }

    if (callback.rows) {
        for (var j in callback.rows) {
            if (!checkExtant(callback.rows[j].name)) {
                list.push({
                    'id'    : callback.rows[j].osm_id,
                    'value' : callback.rows[j].name,
                    'type' : callback.entity
                });
            }
        }

        var result = {
            'match': callback.name.replace("%",""),
            'list': list
        }

        callback.parameter.end(JSON.stringify(result));
    }

};

var outputNames = function(callback) {
    if (callback){
        if (callback.list){
            callback.parameter.setHeader('Content-Type', 'application/json');
            callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
            callback.parameter.end(JSON.stringify(callback.list));
        } else {
            callback.parameter.end("an error as occurred with code 002");
        }
    }
};

var outputLogId = function(callback) {
    if (callback){
        if (callback.log){
            callback.parameter.setHeader('Content-Type', 'application/json');
            callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
            callback.parameter.end(JSON.stringify(callback.log));
        } else {
            callback.parameter.end("an error as occurred with code 002");
        }
    }
};

var outputLog = function(callback) {
    if (callback){
        if (callback.rows){
            callback.parameter.setHeader('Content-Type', 'application/json');
            callback.parameter.setHeader('Access-Control-Allow-Origin', '*');
            callback.parameter.end(JSON.stringify(callback.rows));
        } else {
            callback.parameter.end("an error as occurred with code 0023");
        }
    }
};

exports.send = send;
exports.print = print;
exports.printNames = printNames;
exports.printSources = printSources;
exports.printGeometry = printGeometry;
exports.outputNames = outputNames;
exports.printGeometries = printGeometries;
exports.outputLogId = outputLogId;
exports.outputLog = outputLog;