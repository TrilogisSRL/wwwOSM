/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 */
var buildGeometries = function(tile, polygonList, lineList, geometries, searchResult) {


    //color
    var hexToR = function(h) {return parseInt((cutHex(h)).substring(0,2),16)};
    var hexToG = function(h) {return parseInt((cutHex(h)).substring(2,4),16)};
    var hexToB = function(h) {return parseInt((cutHex(h)).substring(4,6),16)};
    var cutHex = function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h};


    var getGeom = function(osmId){
        var found = 0;
        for (var i in geomList){
            if (osmId === geomList[i].osmId){
                found = i;
                return found;
            }
        }
        return found;
    }

    var addGeom = function(osmId, fillColor, elevation){

        if (getGeom(osmId) === 0){
            var geom = {osmId: osmId, fillColor: fillColor, elevation: elevation};
            geomList.push(geom);
        }
    }

    var calcQuadKey = function (levelNumber, row, column) {
        var digit, mask, key = "";

        for (var i = levelNumber + 1; i > 0; i--) {
            digit = 0;
            mask = 1 << (i - 1);

            if ((column & mask) != 0) {
                digit += 1;
            }

            if ((row & mask) != 0) {
                digit += 2;
            }

            key += digit.toString();
        }
        return key;
    }


    var getXDispl = function(tileBasePoint, vertex){

        var a = tileBasePoint.lat - vertex.lat;

        if (a < 0){
            a = 0;
        }

        var d = a/tileBasePoint.latW;

        d = parseFloat(d.toFixed(4));
        return (1-d);
    }

    var getYDispl = function(tileBasePoint, vertex){
        var a = tileBasePoint.lon - vertex.lon;
        if (a < 0){
            a = 0;
        }
        var d = a/tileBasePoint.lonW;
        if (d < 0.001) {
            d = 0;
        }
        d = parseFloat(d.toFixed(4));
        return (1-d);
    }

    var getVector = function(tileBasePoint, vertex){
        var vector = new WorldWind.Vec2(getYDispl(tileBasePoint, vertex), getXDispl(tileBasePoint, vertex));
        return vector;
    }

    var updatePolygonList = function(){
        $("#polygonsList").empty();
        types.polygonList.forEach(function(entry){
            $("#polygonsList").append('<a id="polygon'+entry.typeId+'" onclick="return select(this.id);" class="list-group-item">'+entry.typeKey+' - '+entry.typeValue+'</a>');

            if (entry.enabled){
                $('#'+'polygon'+entry.typeId).addClass('active');
            }
        });
    }

    var updatePolylineList = function(){
        $("#polylinesList").empty();
        types.lineList.forEach(function(entry){
            $("#polylinesList").append('<a id="line'+entry.typeId+'" onclick="return select(this.id);" class="list-group-item">'+entry.typeKey+' - '+entry.typeValue+'</a>');

            if (entry.enabled){
                $('#'+'line'+entry.typeId).addClass('active');
            }
        });
    }

    var addType = function(entity, type) {
        var addTypeSelection = function(entity, type){
            var div = undefined;
            var id = undefined;
            if (entity === POLYGON) {
                div = "#polygonsList";
                id = "polygon"+type.typeId;
            } else if (entity === LINE) {
                div = "#polylinesList";
                id = "line"+type.id;
            }

            var toAppend = '<a id="'+id+'"  onclick="return select(this.id);" class="list-group-item">'+type.typeKey+' - '+type.typeValue+'</a>';

            $(div).append(toAppend);
        }

        var list = undefined;

        if (entity === POLYGON) {
            list = types.polygonList;
        } else if (entity === LINE) {
            list = types.lineList;
        }

        if (list){
            var found = false;

            for (var i in list){
                if (list[i].typeId === type.typeId){
                    found = true;
                    break;
                }
            }

            if (!found){
                list.push(type);

                addTypeSelection(entity, type);


                if (entity === POLYGON) {
                    updatePolygonList();
                } else if (entity === LINE) {
                    console.log(list);
                    updatePolylineList();
                }
            }
        }
    }

    var createType = function(typeId, typeKey, typeValue, enabled){
        return {typeId: typeId, typeKey: typeKey, typeValue: typeValue, enabled: enabled};
    }


    for (var k in geometries){
        var entry = geometries[k];

        _shapeAttributes.outlineWidth = entry.properties.line_width/2;

        if (entry.type === 'Polygon' || entry.type === 'MultiPolygon') {
            for (var i in entry.coordinates) {

                if (entry.properties.type_id !== 40 && (entry.properties.type_id !== 1 || searchResult)){

                    var boundaries = [];
                    boundaries[0] = []; // outer boundary

                    var isGeomAlreadyStored = false;
                    var geomIndex = 0;

                    if (getGeom(entry.id) > 0){
                        isGeomAlreadyStored = true;
                        geomIndex = getGeom(entry.id);
                    }



                    var elevation;
                    if (extrudeFlag){
                        if (entry.properties.type_key === 'building' && entry.properties.type_value === 'yes'){
                            if (isGeomAlreadyStored){

                                elevation = geomList[geomIndex].elevation;
                            } else {
                                elevation = 6 + Math.floor((Math.random() * 9));
                            }
                        } else {
                            elevation = entry.properties.elevation;
                        }
                    } else {
                        elevation = 0.1;
                    }

                    var vertices = [];
                    var tileBasePoint;
                    if (tile){
                        tileBasePoint = {
                            lat : tile.sector.maxLatitude,
                            latW : tile.sector.maxLatitude - tile.sector.minLatitude,
                            lon : tile.sector.maxLongitude,
                            lonW : tile.sector.maxLongitude - tile.sector.minLongitude
                        };
                    }

                    for (var j in entry.coordinates[i]) {
                        boundaries[0].push(new WorldWind.Position(entry.coordinates[i][j][1], entry.coordinates[i][j][0], elevation));

                        if (tile){
                            var vertex = getVector(tileBasePoint, {lat: entry.coordinates[i][j][1], lon: entry.coordinates[i][j][0]});

                            vertices.push(vertex);
                        }
                    }

                    var polygon = new WorldWind.Polygon(boundaries);
                    polygon.altitudeMode = WorldWind.ABSOLUTE;
                    polygon.extrude = true;
                    var polygonAttributes = new WorldWind.ShapeAttributes(null);


                    if (tiledRoofFlag && tile && entry.properties.type_key === 'building'){
                        polygon.textureCoordinates = [vertices];
                        var imgUrl = "http://ecn.t3.tiles.virtualearth.net/tiles/a"+calcQuadKey(tile.level.levelNumber, tile.row, tile.column)+".jpeg?g=3517&mkt={culture}";
                        polygonAttributes.imageSource = imgUrl;
                    }

                    polygonAttributes.drawInterior = true;
                    polygonAttributes.drawOutline = drawOutlineFlag;
                    polygonAttributes.drawVerticals = polygon.extrude;

                    var alphaOut = 0.6;
                    var alphaInt = 1;

                    if (entry.properties.type_id === 1){
                        alphaInt = 50/255;
                    }

                    var r = hexToR(entry.properties.color_fill);
                    var g = hexToG(entry.properties.color_fill);
                    var b = hexToB(entry.properties.color_fill);


                    if (entry.properties.type_key === 'building' && entry.properties.type_value === 'yes'){

                        if (isGeomAlreadyStored){
                            r = geomList[geomIndex].fillColor.r;
                            g = geomList[geomIndex].fillColor.g;
                            b = geomList[geomIndex].fillColor.b;
                        } else {

                            var rVariation = Math.floor((Math.random() * 4));
                            var gVariation = Math.floor((Math.random() * 6));
                            var bVariation = Math.floor((Math.random() * 7));


                            if (Math.random() > 0.5) {
                                r += rVariation;
                            } else {
                                r -= rVariation;
                            }

                            if (Math.random() > 0.5) {
                                g += gVariation;
                            } else {
                                g -= gVariation;
                            }

                            if (Math.random() > 0.5) {
                                b += bVariation;
                            } else {
                                b -= bVariation;
                            }

                        }
                    }

                    polygonAttributes.outlineColor = new WorldWind.Color(hexToR(entry.properties.color_border) / 255, hexToG(entry.properties.color_border) / 255, hexToB(entry.properties.color_border) / 255, alphaOut);
                    polygonAttributes.interiorColor = new WorldWind.Color(r/255, g/255, b/255, alphaInt);
                    polygonAttributes.drawVerticals = polygon.extrude;
                    polygon.attributes = polygonAttributes;


                    var highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
                    highlightAttributes.interiorColor = WorldWind.Color.RED;
                    highlightAttributes.outlineColor = WorldWind.Color.RED;
                    polygon.highlightAttributes = highlightAttributes;

                    polygon.osmid = entry.id;


                    polygon.typeId = entry.properties.type_id;
                    polygon.properties = entry.properties;

                    if (searchResult) {
                        polygon.visible = true;
                        shapesLayer.addRenderable(polygon)
                        polygonAttributes.drawOutline = true;
                        polygonAttributes.outlineColor = WorldWind.Color.RED;
                    } else {
                        polygon.visible = false;
                    }
                    polygonList.push(polygon);

                    if (!isGeomAlreadyStored){
                        addGeom(entry.id, {r: r, g: g, b: b}, elevation);
                    }

                    addType(POLYGON, createType(entry.properties.type_id, entry.properties.type_key, entry.properties.type_value, false));

                    if (searchResult) {
                        //console.log(polygon);
                        return polygon;
                    }
                }
            }
        } else if (entry.type === 'LineString') {
            var _coords = [];

            for (var j in entry.coordinates) {
                _coords.push(new WorldWind.Location(entry.coordinates[j][1], entry.coordinates[j][0]));
            }
            _shapeAttributes.outlineColor = new WorldWind.Color(hexToR(entry.properties.color_fill) / 255, hexToG(entry.properties.color_fill) / 255, hexToB(entry.properties.color_fill) / 255, 1);
            _shapeAttributes.lineWidth = entry.properties.line_width;

            var _line = new WorldWind.SurfacePolyline(_coords, new WorldWind.ShapeAttributes(_shapeAttributes));

            _line.osmid = entry.id;
            if (entry.type_id === 1){
                list.push(entry.id);
            }
            _line.highlightAttributes = new WorldWind.ShapeAttributes(_shapeAttributes);
            _line.visible = false;
            _line.typeId = entry.properties.type_id;
            _line.properties = entry.properties;
            lineList.push(_line);
            _line.visible = false;



            addType(LINE, createType(entry.properties.type_id, entry.properties.type_key, entry.properties.type_value, false));




//            console.log(createType(entry.properties.type_id, entry.properties.type_key, entry.properties.type_value, false));
//
//            var pathPositions = [];
//
//            for (var j in entry.coordinates) {
//                pathPositions.push(new WorldWind.Position(entry.coordinates[j][1], entry.coordinates[j][0], 0.0));
//            }
//
//            // Create the path.
//            var path = new WorldWind.Path(pathPositions);
//            path.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
//            path.followTerrain = true;
//            path.extrude = false; // make it a curtain
//            path.useSurfaceShapeFor2D = true; // use a surface shape in 2D mode
//
//            // Create and assign the path's attributes.
//            var pathAttributes = new WorldWind.ShapeAttributes(null);
//
//            pathAttributes.outlineColor = new WorldWind.Color(hexToR(entry.properties.color_fill) / 255, hexToG(entry.properties.color_fill) / 255, hexToB(entry.properties.color_fill) / 255, 1);
//            pathAttributes.outlineWidth = entry.properties.line_width * 4;
//
//            pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
//            pathAttributes.drawVerticals = path.extrude; // draw verticals only when extruding
//            path.attributes = pathAttributes;
//
//            // Create and assign the path's highlight attributes.
//            var highlightAttributes = new WorldWind.ShapeAttributes(pathAttributes);
//            highlightAttributes.outlineColor = WorldWind.Color.RED;
//            highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
//            path.highlightAttributes = highlightAttributes;
//
//            // Add the path to a layer and the layer to the World Window's layer list.
//
//            path.visible = false;
//            path.typeId = entry.properties.type_id;
//            path.properties = entry.properties;
//            lineList.push(path);
//            path.visible = false;
        } else {
            //console.log(entry.type);
        }
    }
}