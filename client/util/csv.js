import { saveAs } from 'file-saver';
import slugify from 'slugify';

const escape = input => {
    return input.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/gm, '""');
};

const download = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${encodeURI(slugify(filename))}.csv`);
};

export default {
    escape,
    download
};
