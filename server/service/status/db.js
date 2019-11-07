const { query } = require('../../util/db');

let statusOptions = [];
exports.getStatusOptions = async function() {
    if (statusOptions.length) {
        return statusOptions;
    }
    const result = await query('SELECT * FROM status');
    statusOptions.push(...(result.rows || []));
    return statusOptions;
};
