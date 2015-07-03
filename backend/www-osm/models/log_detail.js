/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Line entity
 */

/**
 * Model of the LogDetail entity
 * @type {{table: string, logValue: string, logParent: string, logPrintedOn: string}}
 */
var model = {
    table : "log_details",
    logValue : "log_value",
    logParent : "log_parent",
    logPrintedOn : "log_printed_on",
}

module.exports.model = model;