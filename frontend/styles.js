/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 */
/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 */

// var endpoint = "http://wwwosm.trilogis.it/api";
var endpoint = "http://localhost:8080";
//var endpoint = "http://192.168.199.150:8080";

var polygonStyleList = [];
var selectedStyle = 0;
var panels = [];

var ORDER_BY_KEY = 0;
var ORDER_BY_LOD = 1;
var ORDER_BY_ELEVATION = 2;

var POLYGON = 0;
var LINE = 1;

var selectedType = 0;
var selectedSorting = 0;

var getType = function(){
    switch (selectedType){
        case POLYGON : return "polygon";
        case LINE : return "line";
        default : return "polygon";
    }
}

var getStylesUrl = function(){
    switch (selectedSorting){
        case ORDER_BY_KEY: return endpoint+"/styles/"+getType();
        case ORDER_BY_LOD: return endpoint+"/styles/"+getType()+"/order/lod";
        case ORDER_BY_ELEVATION: return endpoint+"/styles/"+getType()+"/order/elevation";
        default : return endpoint+"/styles/"+getType()+"";
    }
}

var reset = function(){
    polygonStyleList.length = 0;
    panels.length = 0;
    $('#sources').empty();
}

var removeErrors = function() {
    $('#lod_error').remove();
}

var fillModalPanel = function(id){
    id = id.replace("polygon", "");

    var found = false;
    var style = undefined;
    for (var i in polygonStyleList){
        if (parseInt(polygonStyleList[i].type_id) === parseInt(id)){
            found = true;
            style = polygonStyleList[i];
        }
    }

    if (style && found){
        selectedStyle = id;
        console.log(style.type_key);
        $('#editModalLabel').val("Edit Style "+id);
        $('#lod').val(style.lod);
        $('#key').text(+style.type_key);
        $('#value').text(style.type_value);

        $('#elevation').val(style.elevation);

        $('#color_fill').val("#"+style.color_fill);
        $('#color_fill_box').colorpicker('setValue', "#"+style.color_fill);

        $('#color_border').val("#"+style.color_border);
        $('#color_border_box').colorpicker('setValue', "#"+style.color_border);

        removeErrors();

        $('#editModal').modal('show');
    } else {
        alert("not found");
    }
}

var fillSourceList = function () {

    var sourceEntry = function (id, key, value, lod, elevation, fillColor, borderColor) {

        var panelId = "panel_polygon"+id;
        panels.push(panelId);

        var elevationString = "";
        if (selectedType === POLYGON){
            elevationString = '<h4><small>elevation:</small> '+elevation+'</h4> ';
        }

        var string = '<div class="panel panel-default" style="display: none;" id='+panelId+'> '+
        '<div class="panel-body"> '+
        '<div class="col-md-3"> '+
        '<h4><small>key:</small> '+key+'</h4> '+
        '<h4><small>value:</small> '+value+'</h4> '+
        '</div> '+

        '<div class="col-md-2"> '+
        '<h4><small>lod:</small> '+lod+'</h4> '+ elevationString +
        //'<h4><small>elevation:</small> '+elevation+'</h4> '+
        '</div> '+

        '<div class="col-md-2"> '+
        '<h4><small>fill color:</small></h4> '+
        '<table border = "1px solid grey" height="30px" width="30px"><tr><td bgcolor="#'+fillColor+'"></td></tr></table> '+
        '</div> '+
        '<div class="col-md-3"> '+
        '<h4><small>border color:</small></h4> '+
        '<table border = "1px solid grey" height="30px" width="30px"><tr><td bgcolor="#'+borderColor+'"></td></tr></table> '+
        '</div> '+

            '<div class="col-md-2"> <br/>'+
            '<a id="polygon'+id+'" href="#" onclick="openModalAction(this.id);">Edit</a>'+
        '</div> '+
        '</div> '+
        '</div>';

        return string;
    }

    jQuery.ajax({
        type: "GET",
        url:   getStylesUrl(),
        success: function(result) {
            if (result){

                reset();
                result.forEach(function(entry){
                    polygonStyleList.push(entry);
                    $('#sources').append(sourceEntry(
                        entry.type_id,
                        entry.type_key,
                        entry.type_value,
                        entry.lod,
                        entry.elevation,
                        entry.color_fill,
                        entry.color_border));
                });

                var delay = 0;

                var incDelay = function(){
                    delay +=90;
                    return delay;
                }
                panels.forEach(function (entry) {
                    $('#'+entry).delay(incDelay()).fadeIn();
                })
            }
        },

        fail: function (){console.log("fail")},
        async:      true,
        crossDomain:true
    });
}

fillSourceList();

var submitButtonAction = function () {

    if (selectedStyle === 0){
        return;
    }

    var lod = $("#lod").val();
    var elevation = $("#elevation").val();
    var fillColor = $("#color_fill").val().replace("#", "");
    var borderColor = $("#color_border").val().replace("#", "");
    lod = parseInt(lod);

    var style = {lod: lod, typeId: selectedStyle, elevation: elevation, fillColor: fillColor, borderColor: borderColor};

    if (lod){
        jQuery.ajax({
            type: "POST",
            data: JSON.stringify(style),
            url:   endpoint+"/styles/"+getType(),
            success: function(result) {
                if (result){

                    fillSourceList();
                    $('#editModal').modal('hide');
                }
            },

            fail: function (){console.log("fail")},
            async:      true,
            crossDomain:true
        });
    } else {
        removeErrors();
        $("#form").append("<h4 style=”color:#F00″ id='lod_error'>Invalid number</h4>");
    }
}

var submitButton =  document.getElementById("submitButton");
submitButton.onclick = submitButtonAction;

var updateSortingTool = function(){
    if (selectedType === POLYGON){
        $("#orderByElevation").show();
    } else {
        $("#orderByElevation").hide();
    }
}

var updateEditModal = function(){
    if (selectedType === POLYGON){
        $("#div_elevation").show('slow');
        $("#div_color_border").show('slow');
    } else {
        $("#div_elevation").hide('slow');
        $("#div_color_border").hide('slow');
    }
}

var orderByKeyButton =  document.getElementById("orderByKey");
orderByKeyButton.onclick = function(){
    selectedSorting = ORDER_BY_KEY;
    fillSourceList();
};

var orderByLodButton =  document.getElementById("orderByLod");
orderByLodButton.onclick = function(){
    selectedSorting = ORDER_BY_LOD;
    fillSourceList();
};

var orderByElevationButton =  document.getElementById("orderByElevation");
orderByElevationButton.onclick = function(){
    selectedSorting = ORDER_BY_ELEVATION;
    fillSourceList();
};

var selectPolygonButton =  document.getElementById("selectPolygon");
selectPolygonButton.onclick = function(){
    selectedType = POLYGON;
    selectedSorting = ORDER_BY_KEY;
    if (!($("#selectPolygon").hasClass("active"))){
        $("#selectPolygon").addClass("active")
    }
    $("#selectLine").removeClass("active");
    updateSortingTool();
    updateEditModal();
    fillSourceList();
};

var selectLineButton =  document.getElementById("selectLine");
selectLineButton.onclick = function(){
    selectedType = LINE;
    selectedSorting = ORDER_BY_KEY;
    var hasClass = $('#selectLine').hasClass('active');
    if (!hasClass){
        $("#selectLine").addClass("active")
    }
    $("#selectPolygon").removeClass("active");
    updateSortingTool();
    updateEditModal();
    fillSourceList();
};