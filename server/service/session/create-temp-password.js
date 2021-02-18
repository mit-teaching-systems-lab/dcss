const passwordGenerator = require('password-generator');
const { saltHashPassword } = require('../../util/pwHash');

let salt, passwordHash;
// let password = '$Hkdn%8F@2)~t/<9';
let password = passwordGenerator(20, false, /[\w\d?-]/, '');

if (password) {
  let passwordObj = saltHashPassword(password);
  salt = passwordObj.salt;
  passwordHash = passwordObj.passwordHash;
}

// eslint-disable-next-line no-console
console.log('password', password);
// eslint-disable-next-line no-console
console.log('salt', salt);
// eslint-disable-next-line no-console
console.log('passwordHash', passwordHash);
