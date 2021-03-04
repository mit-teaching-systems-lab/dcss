const Socket = require('socket.io');
const Client = require('socket.io-client');
Socket.Client = function(endpoint, options) {
  return Client(endpoint, {
    transports: ['websocket'],
    ...options
  });
};
module.exports = Socket;
