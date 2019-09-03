function sql(textParts, ...values) {
    const text = textParts.reduce((memo, string, index) => {
        if (index == 0) return string;
        return memo + '$' + index + string;
    }, '');
    return { text, values };
}

module.exports = { sql };
