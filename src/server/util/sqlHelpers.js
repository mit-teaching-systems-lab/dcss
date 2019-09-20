function sql(textParts, ...values) {
    const text = textParts.reduce((memo, string, index) => {
        if (index == 0) return string;
        let typecast = '';
        const value = values[index - 1];
        if (Array.isArray(value)) {
            typecast = '::jsonb';
            values[index - 1] = JSON.stringify(value);
        }
        return memo + '$' + index + typecast + string;
    }, '');
    return { text, values };
}

module.exports = { sql };
