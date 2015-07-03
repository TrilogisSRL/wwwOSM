/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Names Controller
 */

/**
 * Import of the searchDAO module
 * @type {exports}
 */
var importDao = require('./../dao/import-dao.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./../validation/validation.js');


/**
 * It stores the name values for the given entity, by splitting them in single words. For each word,
 * if the insertion is successful, then the identifier of the new record is returned. Otherwise the
 * insertion fails, and the identifier of the existing record is returned.
 *
 * @param callback
 */

var storeName = function(callback){

    //console.log(callback.osmId);
    //console.log(callback.name);


    //var _callback = {
    //    osmId   : callback.osmId,
    //    value   : callback.name,
    //    params  : {type: callback.type},
    //    list    : [callback.end, storePartialName],
    //    list_next    : callback.list_next,
    //    onError : selectPartialName
    //};

    /*
     store
     */
    //importDao.storePartialName(_callback);
    importDao.storeName(callback);
}
//
//var storeNames = function(record, type, end){
//    /*
//     the store process begins only if the record has the name attribute
//     */
//    if (record.name){
//
//        /*
//         split process
//         */
//        var _nameArray = record.name.split(" ");
//
//        /*
//         each partial name value is stored
//         */
//
//        var ctrl = {end : end, counter: _nameArray.length};
//
//        _nameArray.forEach(function(name){
//
//            /*
//             callback object construction
//             */
//            var _callback = {
//                osmId   : record.osm_id,
//                value   : name,
//                ctrl    : ctrl,
//                params  : {type: type},
//                list    : [afterInsert, storePartialName],
//                onError : selectPartialName
//            };
//
//            /*
//             store
//             */
//            importDao.storePartialName(_callback);
//        });
//    }
//}

//var afterInsert = function(ctrl){
//
////    console.log(ctrl.counter);
//    ctrl.counter--;
//
//
//
//    if (ctrl.counter === 0){
//        ctrl.end();
//
////        console.log("ctrl end");
//    }
//
//
//}

///**
// * Internal use: it retrieves the identifiers of the partial name values
// * @param callback Callback object
// */
//var selectPartialName = function(callback) {
//    /*
//    execute request
//     */
//    importDao.selectPartialName(callback);
//}
//
//
///**
// * Internal use: it stores the name value into the relationship table
// * @param callback
// */
//var storePartialName = function(callback) {
//    /*
//     it validates the result of the query execution
//     */
//    val.assertRows(callback);
//
//    /*
//     it ensure that the first entry of the query execution result is valid
//     */
//    val.assertNotUndefined(callback.rows[0], "errora01");
//
//    /*
//     it ensure that the field name_id of the first entry of the query execution result is valid
//     */
//    val.assertNotUndefined(callback.rows[0].name_id,  "errora02");
//
//    /*
//    the value is stored in the callback object
//     */
//    callback.nameId = callback.rows[0].name_id;
//
////    console.log(callback);
//
//    /*
//    store process
//     */
//    importDao.storeNameRelation(callback);
//}

//module.exports.storeNames = storeNames;
module.exports.storeName = storeName;