'use strict';

exports.up = function(db) {
    return db.createTable('users', {});
};

exports.down = function(db) {
    return db.dropTable('users');
};

exports._meta = {
    version: 1
};
