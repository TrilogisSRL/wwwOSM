/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Log and debug module
 */


/**
 * The method prints the given message for debug purposes
 * @param message String to print
 */
var debug = function(message){
    console.log(message);
}

/**
 * The method prints the given message for non-fatal error purposes
 * @param message String to print
 */
var warning = function(message) {
    console.log(message);
}

/**
 * The method prints the given message for fatal error purposes,
 * and it terminates the process.
 * @param errorName String to print
 */
var error = function(errorName){
    warning(errorName);
    exit();
}

/**
 * Internal use: the method terminates the process
 * TODO remove the fixed error code
 */
var exit = function(){
    console.log("exit has been called");
    process.exit(code=2);
}

/**
 * The method terminates the process correctly (error code equals to zero)
 */
var end = function(){
    debug("end");
    process.exit(code=0);
}

module.exports.debug = debug;
module.exports.warning = warning;
module.exports.error = error;
module.exports.end = end;