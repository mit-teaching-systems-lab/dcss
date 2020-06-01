const {execSync: shell} = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ROOT_NMP = path.join(ROOT, 'node_modules');
const CLIENT_NMP = path.join(ROOT, 'client', 'node_modules');
const SERVER_NMP = path.join(ROOT, 'server', 'node_modules');

const files = [
  {
    source: path.join(ROOT_NMP, 'suneditor'),
    destination: path.join(CLIENT_NMP)
  }
];

files.forEach(({source, destination}) => {
  const result = shell(`cp -r ${source} ${destination}`).toString();
  if (!result) {
    console.log(`Copied ${source} => ${destination}`);
  }
});
