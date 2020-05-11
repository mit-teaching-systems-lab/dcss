const fs = require('fs');
const path = require('path');

const timestamp = new Date()
  .toISOString()
  .replace(/\D/g, '')
  .substring(0, 14);

const name = process.argv
  .slice(2)
  .join('-')
  .replace(/\W+/g, '-');

if (name.length == 0) {
  console.error('You must provide a name for the migration');
  process.exit(1);
}

const sqlFilename = path.resolve(__dirname, `../sql/${timestamp}-${name}.sql`);
const jsFilename = path.resolve(__dirname, `../${timestamp}-${name}.js`);

fs.writeFileSync(
  jsFilename,
  `'use strict';

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
`
);

fs.writeFileSync(
  sqlFilename,
  `
-- Up above
---
-- Down below
`
);
