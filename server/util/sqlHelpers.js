function encodeValue(value) {
    if (Array.isArray(value) || typeof value === 'object') {
        const typecast = '::jsonb';
        return { typecast, value: JSON.stringify(value) };
    }

    return {
        typecast: '',
        value
    };
}

exports.sql = function sql(textParts, ...values) {
    const text = textParts.reduce((memo, string, index) => {
        if (index == 0) return string;
        const { typecast, value } = encodeValue(values[index - 1]);
        values[index - 1] = value;
        return memo + '$' + index + typecast + string;
    }, '');
    return { text, values };
};

exports.updateQuery = function updateQuery(table, where, update) {
    let query = `UPDATE "${table}"\nSET`;
    let positionalParam = 1;
    let values = [];

    for (const [key, inputValue] of Object.entries(update)) {
        if (inputValue === undefined) {
            continue;
        }
        if (inputValue === null) {
            query += `  "${key}" = NULL,\n`;
            continue;
        }
        const { typecast, value } = encodeValue(inputValue);
        values.push(value);
        query += `  "${key}" = $${positionalParam++}${typecast},\n`;
    }

    if (positionalParam == 1) {
        throw new Error('Can not update zero columns');
    }

    query = query.substring(0, query.length - 2) + '\n';

    if (typeof where === 'string') {
        query += `WHERE ${where}`;
    } else if (typeof where === 'number') {
        query += `WHERE id = $${positionalParam++}`;
        values.push(where);
    } else if (typeof where === 'object') {
        query += 'WHERE';
        const joiner = ' AND \n';
        for (const [key, inputValue] of Object.entries(where)) {
            if (inputValue === undefined) {
                continue;
            }
            if (inputValue === null) {
                query += `  "${key}" IS NULL${joiner}`;
                continue;
            }
            const { typecast, value } = encodeValue(inputValue);
            values.push(value);
            query += `  "${key}" = $${positionalParam++}${typecast}${joiner}`;
        }
        query = query.substring(0, query.length - joiner.length) + '\n';
    } else {
        throw new Error('Unknown type of where clause');
    }

    query += '\nRETURNING *;';

    return { text: query, values };
};
