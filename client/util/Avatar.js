import md5 from 'md5';

export default class Avatar {
  constructor(user) {
    this.key = user.email
      ? md5(user.email.trim().toLowerCase())
      : user.username;

    this.src = user.email
      ? `https://www.gravatar.com/avatar/${this.key}?d=robohash`
      : `https://robohash.org/${this.key}?bgset=bg1&size=50x50`;
  }
}
