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
    /*
     store
     */
    importDao.storeName(callback);
}
module.exports.storeName = storeName;