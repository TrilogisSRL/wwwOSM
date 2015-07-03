/**
 * @author Trilogis Srl
 * @author Gustavo German Soria
 *
 * Module for the model of the Line entity
 */


/**
 * Model of the Source entity
 * @type {{table: string, sourceId: string, sourceUrl: string, sourceFilename: string, insertOn: string, modifiedOn: string, lastImport: string}}
 */
var model = {
    table : "sources",
    sourceId : "source_id",
    sourceUrl : "source_url",
    sourceFilename : "source_filename",
    insertOn : "insert_on",
    modifiedOn : "modified_on",
    lastImport : "last_import",
    lastLogId : "last_log_id"
}

module.exports.model = model;