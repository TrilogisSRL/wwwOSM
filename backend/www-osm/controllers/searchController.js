/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Search Controller
 */

/**
 * Import of the searchDAO module
 * @type {exports}
 */
var searchDao = require('./../dao/search-dao.js');

/**
 * Import of the validation module
 * @type {exports}
 */
var val = require('./../util/validator.js');

/**
 * It starts the search process over the name value contained in the callback object
 *
 * @param callback Callback object
 */
var getByPartialName = function(callback) {

    /*
     it validates the name value
     */
    val.assertNotUndefined(callback.name);

    /*
    the search process uses partial matches in which only the left side of the word is fixed
     */
    callback.name += '%';

    /*
    execute
     */
    searchDao.getByPartialName(callback);
}

module.exports.getByPartialName = getByPartialName;