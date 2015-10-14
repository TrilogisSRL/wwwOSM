/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 */


var selectAll = function(){
    types.polygonList.forEach(function(entry){

        var hasClass = $('#'+'polygon'+entry.typeId).hasClass('active');
        if (!hasClass){
            $('#'+'polygon'+entry.typeId).addClass('active');
        }
    });


    types.lineList.forEach(function(entry){

        var hasClass = $('#'+'line'+entry.typeId).hasClass('active');
        if (!hasClass){
            $('#'+'line'+entry.typeId).addClass('active');
        }
    });
    //
    //types.pointList.forEach(function(entry){
    //
    //    var hasClass = $('#'+'point'+entry.typeId).hasClass('active');
    //    if (!hasClass){
    //        $('#'+'point'+entry.typeId).addClass('active');
    //    }
    //});

    filter();
}

var enableOptionPanel = function(){

    var hideDescriptionPanel = function(){
        emptyHighlightedGeoms();
        $('#description_panel').hide('clip');
    }

    var showHideSettingsPanel = function(){
        if($("#settingsPanel").is(':hidden')){
            $("#settingsPanel").show('drop');
        } else {
            $("#settingsPanel").hide('drop');
        }
    }



    var deselectAll = function(){
        types.polygonList.forEach(function(entry){

            var hasClass = $('#'+'polygon'+entry.typeId).hasClass('active');
            if (hasClass){
                $('#'+'polygon'+entry.typeId).removeClass('active');
            }
        });

        types.lineList.forEach(function(entry){

            var hasClass = $('#'+'line'+entry.typeId).hasClass('active');
            if (hasClass){
                $('#'+'line'+entry.typeId).removeClass('active');
            }
        });

        types.pointList.forEach(function(entry){

            var hasClass = $('#'+'point'+entry.typeId).hasClass('active');
            if (hasClass){
                $('#'+'point'+entry.typeId).removeClass('active');
            }
        });

        filter();
    }


    var settingsButton =  document.getElementById("settingsButton");
    settingsButton.onclick = showHideSettingsPanel;

    var closeSettingsButton =  document.getElementById("closeSettingsButton");
    closeSettingsButton.onclick = showHideSettingsPanel;

    var filterButton =  document.getElementById("filterButton");
    filterButton.onclick = filter;

    var selectAllButton =  document.getElementById("selectAllButton");
    selectAllButton.onclick = selectAll;

    var deselectAllButton =  document.getElementById("deselectAllButton");
    deselectAllButton.onclick = deselectAll;

    var closeDescriptionPanelButton =  document.getElementById("close_picked_obj_panel");
    closeDescriptionPanelButton.onclick = hideDescriptionPanel;


    var emptyHighlightedGeoms = function(){
        for (var i in highlightedGeoms){
            highlightedGeoms[i].highlighted = false;
        }
        highlightedGeoms.length = 0;
        highlightedGeoms = [];
    }

    var addToHighlightedGeoms = function(osmid){

        var highlightPolygon = function(osmid, tile){
            tile.draw.polygons.forEach(function (entry) {
                if (entry.visible === true && entry.osmid === osmid){
                    //console.log("found: "+entry.osmid);
                    entry.highlighted = true;
                    highlightedGeoms.push(entry);
                }
            });
        }

        activeTiles.forEach(function(tile){
            highlightPolygon(osmid, tile);
        });

    }

    var getPickedObjects = function(event)
    {
        if (event.which === 1) {
            var x = event.clientX;
            var y = event.clientY;


            //x -= canvas.offsetLeft;
            //y -= canvas.offsetTop;
            emptyHighlightedGeoms();
            //console.log("selected");
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            $("#osm_id").empty();
            for (var i in pickList.objects){
                if (pickList.objects[i].userObject.osmid){
                    //console.log("highlighted: "+pickList.objects[i].userObject.highlighted);
                    emptyHighlightedGeoms();
                    addToHighlightedGeoms(pickList.objects[i].userObject.osmid);
                    var osmId = pickList.objects[i].userObject.osmid;
                    $("#osm_id").append("OSM ID: "+osmId);
                    showDescriptionPanel(osmId);
                }
            }

            wwd.redraw();
        }
    }

    canvas.addEventListener("dblclick", getPickedObjects, false);

}