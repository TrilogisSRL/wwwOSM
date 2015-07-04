/**
/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 */

var endpoint = "http://wwwosm.trilogis.it/api";
var currentLog = 0;
var panels = [];
var buttons = ['submitButton'];
var links = [];

var showPanels = function(){
    var delay = 0;
    var incDelay = function(){
        delay +=90;
        return delay;
    }
    $('#insertPanel').delay(incDelay()).fadeIn();
    panels.forEach(function (entry) {
        $('#'+entry).delay(incDelay()).fadeIn();
    })
    incDelay();
    buttons.forEach(function (entry) {
        $('#'+entry).delay(incDelay()).fadeIn();
    })
    incDelay();
    links.forEach(function (entry) {
        $('#'+entry).delay(incDelay()).fadeIn();
    })
}

var showLog = function(id){
    currentLog = id;
    retrieveLog(id);
    updateLogPanel(20);
}

var fillSourceList = function () {

    var sourceEntry = function (id, lastLogId, url, filename, lastImport) {

        var panelId = "sourcePanel"+id;
        var buttonId =  "sourceId"+id;
        var linkId =  "log"+lastLogId;
        //
        var string = '<div class="panel panel-default" id="'+panelId+'" style="display: none;">' +
            '<div class="panel-body"> ' +
            '<div class="col-md-10">' +
            '<a href="'+url+'" target="_blank"><h4>'+filename+'</h4></a>'+
            '<h4 class="secondary"><small>'+url+'</small></h4> ';

        if (lastImport){
            string += '<h4 class="secondary"><small>Last import: '+lastImport+'</small></h4> ';
        }

        string +=
            '<a style="display: none;" id="'+linkId+'" href="#" onclick="openLog(this.id);">Show Log</a>&nbsp'+
            '</div> '+
            '<div class="col-md-2"> '+
            '<button style="display: none;" type="button" id="'+buttonId+'" class="btn btn-default btn-block" onclick="importAction(this.id);" aria-label="Left Align"> '+
            '<span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> '+
            '</button> '+
            '</div> '+
            '</div> '+
            '</div>';

        panels.push(panelId);
        buttons.push(buttonId);
        links.push(linkId);
        return string;
    }

    jQuery.ajax({
        type: "GET",
        url:   endpoint+"/sources/",
        success: function(result) {
            if (result){

                $('#sources').empty();
                result.forEach(function(entry){
                    $('#sources').append(sourceEntry(entry.source_id, entry.last_log_id, entry.source_url, entry.source_filename, entry.last_import));
                });

                showPanels();
            }
        },

        fail: function (){console.log("fail")},
        async:      true,
        crossDomain:true
    });
}

fillSourceList();

var retrieveLog = function(id){
    //alert(id);
    if (id && id > 0){
        jQuery.ajax({
            type: "GET",
            url:   endpoint+"/log/"+id,
            success: function(result) {
                if (result){
                    $("#test").empty();
                    $("#logPanel").show("slow");
                    result.forEach(function(entry){
                        if (entry.log_value !== '\n') {
                            var value = entry.log_value.replace("\n", "").replace("\r", "").replace("\\", "").replace('"', '');
                            var date = entry.log_printed_on;
                            $("#test").append("<h5><small>"+date+": </small>"+JSON.stringify(value)+"</h5>");
                        }
                    });

                }
            },

            fail: function (){console.log("fail")},
            async:      true,
            crossDomain:true
        });
    } else {
        alert("invalid currentLog");
    }
}

var submitButtonAction = function () {
    var sourceUrl = $("#url_field").val();
    var sourceFilename = $("#filename_field").val();
    jQuery.ajax({
        type: "POST",
        data: JSON.stringify({sourceUrl: sourceUrl, sourceFilename: sourceFilename}),
        url:   endpoint+"/sources/",
        success: function(result) {
            fillSourceList();
            $("#url_field").val("");
            $("#filename_field").val("");
        },

        fail: function (){console.log("fail")},
        async:      true,
        crossDomain:true
    });
}

var updateLogPanel = function(counter){
    if (counter > 0){
        setTimeout(function(){
            retrieveLog(currentLog);
            updateLogPanel(--counter);
        }, 2000);
    } else {
        $("#reloadButton").show("slow");
    }
}

var doImport = function(id){
    id = id.replace("sourceId", "");
    jQuery.ajax({
        type: "GET",
        url:   endpoint+"/import/"+id,
        success: function(result) {
            if (result){
                updateSourceTimestamp(id);
                currentLog = result.log_id;
                $("#logPanel").show("slow");
                //alert("currentLog: "+currentLog);
                retrieveLog(currentLog);

                updateLogPanel(20);
            }
        },

        fail: function (){console.log("fail")},
        async:      true,
        crossDomain:true
    });
}

var updateSourceTimestamp = function(id){
    jQuery.ajax({
        type: "GET",
        url:   endpoint+"/source/update/"+id,
        success: function(result) {
            if (result){
                //nothing to do
            }
        },

        fail: function (){console.log("fail")},
        async:      true,
        crossDomain:true
    });
}

var closeButtonAction = function () {
    $("#logPanel").hide("slow");
}

var updateLogButtonAction = function(){
    retrieveLog(currentLog);
}

var submitButton =  document.getElementById("submitButton");
submitButton.onclick = submitButtonAction;
var updateLogButton =  document.getElementById("reloadButton");
updateLogButton.onclick = updateLogButtonAction;
var closeButton =  document.getElementById("closeButton");
closeButton.onclick = closeButtonAction;