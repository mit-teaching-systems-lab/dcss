import Zip from 'jszip';
import hash from 'object-hash';
import { saveAs } from 'file-saver';
import slugify from 'slugify';

const escape = input => {
  return input.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/gm, '""');
};

const downloadZipAsync = async files => {
  const zip = new Zip();

  files.forEach(([file, contents]) => zip.file(file, contents));

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${hash(files)}.zip`);
};

const download = (filename, content) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${encodeURI(slugify(filename))}.csv`);
};

export default {
  escape,
  download,
  downloadZipAsync
};
