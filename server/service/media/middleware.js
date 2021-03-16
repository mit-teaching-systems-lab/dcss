const sessionMiddleware = require('../session/middleware');
const SocketManager = require('../socket/socket-manager');

exports.requireUserOrMediaRequestToken = (req, res, next) => {
  if (req.headers['x-dcss-media-request-token']) {
    if (
      !SocketManager.isValidToken(req.headers['x-dcss-media-request-token'])
    ) {
      const error = new Error('Invalid media request authentication token.');
      error.status = 401;
      throw error;
    }
    next();
  } else {
    sessionMiddleware.requireUser(req, res, next);
  }
};
