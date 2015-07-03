/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module in with constants and parameters are declared
 */

/**
 * Import of the log module
 * @type {exports}
 */
var log = require('./../util/debug.js');


/**
 * It selects the next method to call, otherwise it prints an error
 * @param callback Callback object which contains a queue of method calls
 * @param error {String} a string which represent the error message
 */
var next = function(callback, error){
    var _next = callback.list.pop();
    if (_next) {
        _next(callback);
    } else {

        log.warning(callback);
        log.warning(error);
    }
}

module.exports.next = next;