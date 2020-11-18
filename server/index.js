const SocketManager = require('./service/socket/socket-manager');
const { app, listener } = require('./server');
// Heroku uses $PORT
const port = process.env.PORT || 5000;
const server = listener.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on ${port}`);
});

const socket = new SocketManager(server);

module.exports = { app, listener, socket };
