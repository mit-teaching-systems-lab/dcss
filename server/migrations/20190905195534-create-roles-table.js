'use strict';

const sqlFile = require('./helpers/sql-file')(__filename);
exports.up = function(db) {
    return db.runSql(sqlFile.up);
};
exports.down = function(db) {
    return db.runSql(sqlFile.down);
};
exports._meta = {
    version: 1
};
