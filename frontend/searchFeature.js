/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 */

var searchStack = [];

var closeDescriptionPanel = function(){
    if($("#description_panel").is(':visible')){
        $("#description_panel").hide('clip');
    }
}

var showSelectedGeomsPanel = function () {
    if($("#selected_geoms_panel").is(':hidden')){
        $("#selected_geoms_panel").show('drop');
    }
}

var hideSelectedGeomsPanel = function () {
    $("#selected_geoms_panel").hide('drop');
}

var addHighlightedPolygon = function(id, name){
    var entry = '<div id="'+id+'"> '+
        '<button id="remove'+id+'" type="button" onclick="return removePolygon(this.id);" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> '+
        '<a><h5 id="select'+id+'" onclick="return selectPolygon(this.id);">'+name+'</h5></a> '+
        '</div>';
    $("#highlightedPolygons").append(entry);
}

var removeHighlightedPolygon = function(id){
    $("#"+id).remove();

    var polygon = getPolygonFromCache(id);
    dehighlightPolygon(polygon);

    for (var i in highlightPolygons){
        if (parseInt(highlightPolygons[i].osmid) === parseInt(id)){
            highlightPolygons.splice(i, 1);
        }
    }
    if (highlightPolygons.length === 0){
        hideSelectedGeomsPanel();
    }
    filter();
    closeDescriptionPanel();

}

var getPolygonFromCache = function(osmId){
    for (var i in activeTiles){
        for (var j in activeTiles[i].draw.polygons) {
            var entry = activeTiles[i].draw.polygons[j];
            if (parseInt(entry.osmid) === parseInt(osmId)){
                return entry;
            }
        }
    }
    return undefined;
}

var centerPolygon = function (polygon) {
    var lat_tmp = 0;
    var lon_tmp = 0;
    var size = 0;

    polygon._boundaries.forEach(function(entry){
        size += entry.length;
        entry.forEach(function(coordinate){
            lon_tmp += coordinate.longitude;
            lat_tmp += coordinate.latitude;

        });
    });

    var lat = lat_tmp/size;
    var lon = lon_tmp/size;

    wwd.navigator.lookAtLocation.latitude = lat;
    wwd.navigator.lookAtLocation.longitude = lon;
    wwd.navigator.range = 2e2;
    wwd.navigator.tilt = 55;
}

var highlightPolygon = function(polygon){
    if (polygon){
        highlightPolygons.push(polygon);
        polygon.fillColor = { red: polygon._attributes._outlineColor.red,
            green: polygon._attributes._outlineColor.green,
            blue: polygon._attributes._outlineColor.blue}

        polygon.borderColor = { red: polygon._attributes._interiorColor.red,
            green: polygon._attributes._interiorColor.green,
            blue: polygon._attributes._interiorColor.blue}

        polygon._attributes._outlineColor.red = 1;
        polygon._attributes._outlineColor.green = 0;
        polygon._attributes._outlineColor.blue = 0;
        polygon._attributes._interiorColor.red = 0.85;
    } else {
        console.log("polygon not found");
    }
}


var dehighlightPolygon = function(entry){
    if (entry && entry.fillColor && entry.borderColor){
        entry._attributes._outlineColor.red = entry.fillColor.red;
        entry._attributes._outlineColor.green = entry.fillColor.green;
        entry._attributes._outlineColor.blue = entry.fillColor.blue;
        entry._attributes._interiorColor.red = entry.borderColor.red;
    } else {
        console.log("polygon not found");
    }
}

var fillDescriptionPanel = function(polygon){

    var excludeField = function(field){
        var toExclude = ['modified_on','z_order', 'way_area', 'is_deleted', 'color_fill', 'color_border', 'line_width']
        for (var i in toExclude){
            if (field === toExclude[i]){
                return true;
            }
        }
        return false;
    }

    if (polygon){
        $('#description_panel').show('clip');

        $("#obj_description").empty();

        for (var i in polygon.properties){
            if (!excludeField(i)){
                $("#obj_description").append('<p>'+i+': '+polygon.properties[i]+'</p>');
            }
        }
        $("#obj_description").append('<hr/>');
        $("#obj_description").append('<a target="_blank" href="'+endpoint+'/polygon/'+polygon.id+'">get geojson</a>');
        $("#obj_description").append('<br/>');
        $("#obj_description").append('<a target="_blank" href="http://www.openstreetmap.org/way/'+polygon.id+'">show on openstreetmap.org</a>');
        $("#obj_description").append('<br/>');
        $("#obj_description").append('<a target="_blank" href="https://www.openstreetmap.org/edit?way='+polygon.id+'">edit on openstreetmap.org</a>');
    }
}

var getCompletePolygon = function(osmId){

    var json = undefined;
    if (osmId){
        jQuery.ajax({
            type: "GET",
            url:   endpoint+"/polygon/"+osmId,
            success: function(result) {

                json = result;
            },

            fail: function (){console.log("fail")},
            async:      false,
            crossDomain:true
        });
    }
    return json;
}

var selectResultEntry = function(osmId){
    var polygonProps = getCompletePolygon(osmId);

    fillDescriptionPanel(polygonProps);
    var polygon = undefined;
    if (polygonProps.coordinates){
        polygon =  buildGeometries(undefined, [], [], [], [polygonProps], true);
    }

    centerPolygon(polygon);
}

var retrievePolygon = function(id){
    id = id.replace("search_polygon_", "");

    var getPolygonFromServer = function(id){

        var polygon = undefined;

        jQuery.ajax({
            type: "GET",
            url:   endpoint+"/polygon/"+id,
            success: function(result) {
                $('#searchResultPolygonsPanel').hide('blind');

                if (result.coordinates){
                    polygon =  buildGeometries(undefined, [], [], [], [result], true);
                }
            },

            fail: function (){console.log("fail")},
            async:      false,
            crossDomain:true
        });

        return polygon;
    }

    id = id.replace("search_polygon_", "");

    var polygon = getPolygonFromServer(parseInt(id));
    highlightPolygon(polygon);

    //center polygon
    centerPolygon(polygon);

    //hide the search result panel
    $('#searchResultPolygonsPanel').hide('blind');

    //retrieve all information
    var polygonProps = getCompletePolygon(id);

    //show the description panel

    fillDescriptionPanel(polygonProps);

    //add the entry to the searched polygon list
    if (polygonProps && polygonProps.properties && polygonProps.properties.name){
        addHighlightedPolygon(id, polygonProps.properties.name);
    } else {
        console.log("error polygon");
    }
    filter();

    showSelectedGeomsPanel();

    //redraw
    wwd.redraw();

}

var search = function(){

    var match = $("#searchInput").val();

    jQuery.ajax({
        url:   endpoint+"/search/polygon/19/"+match,
        success: function(result) {

            if (result.list.length === 0){
                if ($('#no_results').length === 0) {
                    $('#searchResultPolygons').append('<p class="list-group-item" id="no_results">No Results</p>');
                    searchStack.push('no_results');
                }

            } else {
                result.list.forEach(function(entry){
                    var element = '<a id="search_polygon_'+entry.id+'" onclick="return selectResult(this.id);" class="list-group-item">'+entry.value+'</a>';
                    searchStack.push('search_polygon_'+entry.id);

                    $('#searchResultPolygons').append(element);
                });
            }

            showSearchStack();

        },

        fail: function (){console.log("fail")},
        async:      true,
        crossDomain:true
    });
}

$("#close_pol_res_panel").click(function( event ) {
    event.preventDefault();

    $('#searchResultPolygonsPanel').hide('blind');

});

$("#searchForm").submit(function( event ) {
    event.preventDefault();
    if ($("#searchInput").val().length>0){
        hideSearchStack();
        if (!$("#searchResultPolygonsPanel").is(":visible")){
            $('#searchResultPolygonsPanel').show('blind');
        }
        setTimeout(search, 20)
    }
});

$("#searchSubmit").click(function( event ) {
    event.preventDefault();
    if ($("#searchInput").val().length>0){
        hideSearchStack();
        if (!$("#searchResultPolygonsPanel").is(":visible")) {
            $('#searchResultPolygonsPanel').show('blind');
        }
        setTimeout(search, 20)
    }

});


var hideSearchStack = function(){
    $('#searchResultPolygons').children().hide("drop");

    $('#searchResultPolygons').children().remove();
}

var showSearchStack = function(){

    $('#searchResultPolygons').children().show("drop");
}
