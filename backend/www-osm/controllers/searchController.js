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
 * It initiates the search process over the name value contained in the callback object
 *
 * @param callback Callback object
 */
var getByPartialName = function(callback) {

    /*
    Validation of name value
     */
    val.assertNotUndefined(callback.name);

    /*
    The search process works with partial matches.
    Only the left side of the word is fixed
     */
    callback.name += '%';

    /*
    Execute query
     */
    searchDao.getByPartialName(callback);
}

module.exports.getByPartialName = getByPartialName;