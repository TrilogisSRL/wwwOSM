/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 */


/**
 * Enable the Settings Panel
 */
var enableSettings = function (){

    var enableSettingsField = function(id){
        var hasClass = $('#'+id).hasClass('btn-default');
        if (hasClass){
            $('#' + id).removeClass('btn-default');
            $('#'+id).addClass('btn-primary');
            $('#'+id).text('Enabled');
        } else {
            $('#' + id).removeClass('btn-primary');
            $('#'+id).addClass('btn-default');
            $('#'+id).text('Disabled');
        }
    }

    var isSettingFieldEnabled = function(id){
        return $('#'+id).hasClass('btn-primary');
    }

    var handleOutlineOption = function(enable){
        if (enable){
            drawOutlineFlag = true;
        } else {
            drawOutlineFlag = false;
        }
        shapesLayer.removeAllRenderables();
        wwd.redraw();

        filter();
    }

    var handleTiledRoofption = function(enable){
        if (enable){
            tiledRoofFlag = true;
        } else {
            tiledRoofFlag = false;
        }
        shapesLayer.removeAllRenderables();
        db.forEach(function(tile){
            tile.draw = undefined;
        });

        filter();
    }

    var handleExtrusionOption = function(enable){
        if (enable){
            extrudeFlag = true;
        } else {
            extrudeFlag = false;
        }
        shapesLayer.removeAllRenderables();

        db.forEach(function(tile){
            tile.draw = undefined;
        });

        filter();
    }

    var layerBingAction = function(){
        enableSettingsField('layer_bing');
        if (isSettingFieldEnabled('layer_bing')){
            bingAerialWithLabelsLayer.enabled = true;
        } else {
            bingAerialWithLabelsLayer.enabled = false;
        }

        wwd.redraw();
    }

    var layer_bingButton =  document.getElementById("layer_bing");
    layer_bingButton.onclick = layerBingAction;

    var fun_outlineAction = function(){
        enableSettingsField('fun_outline');
        handleOutlineOption(isSettingFieldEnabled('fun_outline'));
    }

    var fun_outlineButton =  document.getElementById("fun_outline");
    fun_outlineButton.onclick = fun_outlineAction;


    var layer_bmng_landsatAction = function(){
        enableSettingsField('layer_bmng_landsat');
        if (isSettingFieldEnabled('layer_bmng_landsat')){
            bmngLandsatLayer.enabled = true;
        } else {
            bmngLandsatLayer.enabled = false;
        }
        wwd.redraw();
    }

    var layer_bmng_landsatButton =  document.getElementById("layer_bmng_landsat");
    layer_bmng_landsatButton.onclick = layer_bmng_landsatAction;

    var layer_compassAction = function() {
        enableSettingsField('layer_compass');
        if (isSettingFieldEnabled('layer_compass')){
            compassLayer.enabled = true;
        } else {
            compassLayer.enabled = false;
        }

        wwd.redraw();
    }

    var layer_compassButton =  document.getElementById("layer_compass");
    layer_compassButton.onclick = layer_compassAction;

    var fun_tiled_roofsAction = function(){
        enableSettingsField('fun_tiled_roofs');
        handleTiledRoofption(isSettingFieldEnabled('fun_tiled_roofs'));
        selectAll();
    }

    var fun_tiled_roofsButton =  document.getElementById("fun_tiled_roofs");
    fun_tiled_roofsButton.onclick = fun_tiled_roofsAction;

    var fun_extrusion_Action = function(){
        enableSettingsField('fun_extrusion');
        handleExtrusionOption(isSettingFieldEnabled('fun_extrusion'));
        selectAll();
    }

    var fun_extrusion_Button =  document.getElementById("fun_extrusion");
    fun_extrusion_Button.onclick = fun_extrusion_Action;

}