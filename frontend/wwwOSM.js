// WWD
var wwd = new WorldWind.WorldWindow("wwd");
var canvas = document.getElementById("wwd");

var endpoint = "http://wwwosm.trilogis.it/api";

WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_NONE);

var bmngLandsatLayer = new WorldWind.BMNGLandsatLayer();
var bingAerialWithLabelsLayer = new WorldWind.BingAerialWithLabelsLayer(null);
var compassLayer = new WorldWind.CompassLayer();
var viewControlLayer = new WorldWind.ViewControlsLayer(wwd);
var osmLayer =  new WorldWind.OpenStreetMapImageLayer();

wwd.drawContext.clearColor = WorldWind.Color.colorFromBytes(0,0,0,0);

bmngLandsatLayer.enabled = false;
bingAerialWithLabelsLayer.enabled = false;
wwd.addLayer(compassLayer);
wwd.addLayer(viewControlLayer);
wwd.addLayer(osmLayer);
wwd.addLayer(bmngLandsatLayer);
wwd.addLayer(bingAerialWithLabelsLayer);


var shapesLayer = new WorldWind.RenderableLayer("wwwOSM");
wwd.addLayer(shapesLayer);
var _shapeAttributes = new WorldWind.ShapeAttributes(null);

var globe = wwd.globe;
globe.elevationModel = new WorldWind.ZeroElevationModel();

var map = new WorldWind.Globe2D();
map.elevationModel = new WorldWind.EarthElevationModel();
map.projection = new WorldWind.ProjectionEquirectangular();

wwd.navigator.lookAtLocation.latitude = 46.06686259487552;
wwd.navigator.lookAtLocation.longitude = 11.120719683053174;

wwd.navigator.range = 170.55557907761514;
wwd.navigator.tilt = 61;
wwd.redraw();

$.getScript("buildGeometries.js", function(){
    console.log("Script buildGeometries.js loaded");
});

$.getScript("searchFeature.js", function(){
    console.log("Script searchFeature.js loaded");
});


$.getScript("settingsFeatures.js", function(){
    console.log("Script settingsFeatures.js loaded");
    enableSettings();
});

$.getScript("optionPanelFeatures.js", function(){
    console.log("Script optionPanelFeatures.js loaded");
    enableOptionPanel()
});

//Vars
var oldTiles = 0;
var currentLayer = osmLayer;
var lastRedraw = 0;
var db = [];
var activeTiles = [];

var geomList = [];

//options
var drawOutlineFlag = true;
var extrudeFlag = true;
var tiledRoofFlag = true;

var lastRedraw = 0;
var redrawThreshold = 800;

var POLYGON = 0, LINE = 1;
var highlightPolygons = [];

var types = {polygonList: [], polygonEnabled: [36, 4, 1, 32, 33, 17, 34, 35, 14], lineList: [], lineEnabled: []};

var filter = function() {

    console.log("filter");
    var updateSelectedTypes = function(){
        $("#selectedPolygons").empty();
        types.polygonList.forEach(function(entry){
            if (entry.enabled){
                $("#selectedPolygons").append('<li id="selectedPolygon'+entry.typeId+'">'+entry.typeKey+' - '+entry.typeValue+'</li>');
            }
        });

        $("#selectedLines").empty();
        types.lineList.forEach(function(entry){
            if (entry.enabled){
                $("#selectedLines").append('<li id="selectedLine'+entry.typeId+'">'+entry.typeKey+' - '+entry.typeValue+'</li>');
            }
        });
    }

    var redraw = function(){
        shapesLayer.removeAllRenderables();

        activeTiles.forEach(function(tile){
            drawTile(tile);
        });

        highlightPolygons.forEach(function(polygon){
            polygon.visible = true;
            polygon._attributes._drawOutline = true;
            shapesLayer.addRenderable(polygon);
        });

        wwd.redraw();
    }

    types.polygonEnabled.length = 0;
    types.polygonList.forEach(function (entry) {

        var hasClass = $('#' + 'polygon' + entry.typeId).hasClass('active');
        if (hasClass) {
            entry.enabled = true;
            this.types.polygonEnabled.push(entry.typeId);
        } else {
            entry.enabled = false;
        }
    });

    types.lineEnabled.length = 0;
    types.lineList.forEach(function (entry) {

        var hasClass = $('#' + 'line' + entry.typeId).hasClass('active');
        if (hasClass) {
            entry.enabled = true;
            this.types.lineEnabled.push(entry.typeId);
        } else {
            entry.enabled = false;
        }
    });

    updateSelectedTypes();

    redraw();
}

var showDescriptionPanel = function(osmId){

    var excludeField = function(field){
        var toExclude = ['modified_on','z_order', 'way_area', 'is_deleted', 'color_fill', 'color_border', 'line_width']
        for (var i in toExclude){
            if (field === toExclude[i]){
                return true;
            }
        }
        return false;
    }

    if (osmId){
        jQuery.ajax({
            type: "GET",
            url:   endpoint+"/polygon/"+osmId,
            success: function(result) {
                if (result){
                    $('#description_panel').show('clip');

                    $("#obj_description").empty();

                    for (var i in result.properties){
                        if (!excludeField(i)){
                            $("#obj_description").append('<p>'+i+': '+result.properties[i]+'</p>');
                        }
                    }

                    $("#obj_description").append('<a target="_blank" href="'+endpoint+'/polygon/'+osmId+'">get geojson</a>');
                }
            },

            fail: function (){console.log("fail")},
            async:      true,
            crossDomain:true
        });
    }
}

var renderPolygon = function(entry){
    entry.visible = true;

    entry._attributes._drawOutline = drawOutlineFlag;

    shapesLayer.addRenderable(entry);
}

var drawTile = function(tile){

    var isGeomEnabled = function(entity, typeId){
        var list = undefined;

        if (entity === POLYGON) {
            list = types.polygonEnabled;
        } else if (entity === LINE) {
            list = types.lineEnabled;
        }

        if (list){
            for (var i in list){
                if (list[i] === typeId){
                    return true;
                }
            }
        }
        return false;
    }

    if (tile.draw === undefined || tile.draw === null){
        tile.draw = {polygons: [], lines: []};
        buildGeometries(tile, tile.draw.polygons, tile.draw.lines, tile.geometries, false);
    }

    var isHighlighted = function(id){

        for (var i in highlightPolygons){
            if (parseInt(highlightPolygons[i].osmid) === parseInt(id)){
                //console.log("Trovato!!!!!");
                return true;
            }
        }

        return false;
    }


    tile.draw.polygons.forEach(function (entry) {
        if (isGeomEnabled(POLYGON, entry.typeId)){

            if (!isHighlighted(entry.osmid)){
                renderPolygon(entry);
            }

        }
    });

    tile.draw.lines.forEach(function (entry) {
        if (isGeomEnabled(LINE, entry.typeId)){
            entry.visible = true;
            shapesLayer.addRenderable(entry);
        }
    });


}

var redrawEvent = function(){
    //console.log("redraw");
    setTimeout(function() {
        redrawEvent_aux();

    }, 0);


}



var redrawEvent_aux = function(){

    var refreshTiles = function(){

        var storeTile = function(tile){
            db.push(tile);
        }

        var getTileFromServer = function(tile){

            var request = {
                maxLatitude : tile.sector.maxLatitude,
                maxLongitude : tile.sector.maxLongitude,
                minLatitude : tile.sector.minLatitude,
                minLongitude : tile.sector.minLongitude,
                lod: tile.level.levelNumber
            };

            jQuery.ajax({
                type: "POST",
                data: JSON.stringify(request),
                url:   endpoint+"/bbox",
                success: function(result) {
                    tile.geometries = result.geometries;
                    do1(tile);
                },

                fail: function (){console.log("fail")},
                async:      true,
                crossDomain:true
            });

        }



        var doIt = function(tile){
            drawTile(tile);
            activeTiles.push(tile);
            do3();
        }

        var do1 = function(tile){
            storeTile(tile);
            doIt(tile);
        }

        var do3 = function(){
            for (var j in activeTiles){
                var found = false;
                for (var i in currentLayer.currentTiles){
                    if (currentLayer.currentTiles[i].tileKey === activeTiles[j].tileKey){
                        found = true;
                        break;
                    }
                }

                if (!found){
                    eraseTile(activeTiles[j]);
                    activeTiles.splice(j, 1);
                }
            }
        }

        var getTile = function(tile) {
            var found = false;

            for (var i in db){
                if (db[i].tileKey === tile.tileKey){
                    tile = db[i];
                    found = true;
                    break;
                }
            }

            if (found){
                doIt(tile);
            } else {
                getTileFromServer(tile);
                //storeTile(tile);
                //return tile;
            }
        }

        var isTileActive = function(tile){
            for (var i in activeTiles){
                if (activeTiles[i].tileKey === tile.tileKey){
                    return true;
                }
            }

            return false;
        }

        var eraseTile = function(tile){
            if (tile.draw){
                tile.draw.polygons.forEach(function (entry){
                    shapesLayer.removeRenderable(entry);
                });

                tile.draw.lines.forEach(function (entry){
                    shapesLayer.removeRenderable(entry);
                });
            }
        }

        var tile = undefined;

        var do2 = function(tile){
            drawTile(tile);
            activeTiles.push(tile);
        }

        for (var i in currentLayer.currentTiles){
            tile = currentLayer.currentTiles[i];


            if (isTileActive(tile)) {
                do3();
            } else {
                getTile(tile);
            }

        }
    }

    var checkTiles = function(){

        var currentTime = new Date().getTime();
        if ((currentTime - lastRedraw) > redrawThreshold){
            lastRedraw = currentTime;
            setTimeout(function() {
                //console.log("redraw");
                var currentLength = currentLayer.currentTiles.length;
                if (oldTiles !== currentLength){
                    refreshTiles();
                    wwd.redraw();
                }

                oldTiles = currentLength;

            }, 0);
        }


    }

    checkTiles();
}


canvas.addEventListener(WorldWind.REDRAW_EVENT_TYPE, function(){


    setTimeout(function() {
        redrawEvent_aux();

    }, 0);

}, false);


