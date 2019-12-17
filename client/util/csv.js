const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const escape = input => {
    return input.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/gm, '""');
};

const download = (filename, content) => {
    const type = IS_SAFARI ? 'application/csv' : 'text/csv';
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', `${encodeURI(filename)}.csv`);
    anchor.setAttribute('target', '_self');
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url));
};

export default {
    escape,
    download
};
