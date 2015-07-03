/**
 * @author Trilogis
 *
 */

/**
 * Raise an error within both the response and the console
 * @param callback the object which contains information about the progress of the current process,
 *          included in this case information about the error that has occurred
 * @param errorName the description of the error
 */
var raise = function(callback, errorName){
    console.log(errorName);
    callback.parameter.statusCode = 400;
    callback.parameter.end(errorName);
}


module.exports.send = raise;