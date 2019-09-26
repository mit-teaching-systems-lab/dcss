const fs = require('fs');
const path = require('path');

module.exports = function(filename) {
    const jsFile = path.basename(filename);

    const sqlFile = path.join(
        __dirname,
        '..',
        'sql',
        jsFile.replace(/\.js$/, '.sql')
    );

    const sqlText = fs.readFileSync(sqlFile, 'utf-8');

    const [up, down = ''] = sqlText.split(/^---\s*$/m);

    return { up, down };
};
