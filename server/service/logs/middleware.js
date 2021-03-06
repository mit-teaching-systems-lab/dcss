const { asyncMiddleware } = require('../../util/api');
const { addCapturedRequestAndResponse } = require('./db');
const hash = require('object-hash');

const lastRequest = {};

exports.logRequestAndResponse = asyncMiddleware(async (req, res, next) => {
  // For not we're not logging GET requests.
  if (req.method === 'GET') {
    return next();
  }

  // Don't log activity that isn't from a logged in user
  if (!req.session || (req.session && !req.session.user)) {
    return next();
  }

  const { url, session, headers, method, query, params, body } = req;

  // Don't log run events
  if (url.includes('/event/')) {
    return next();
  }

  const request = {
    url,
    session,
    headers,
    method,
    query,
    params,
    body
  };

  const { user } = session;

  const capture = {
    request
  };

  const send = res.send.bind(res);
  res.send = (...args) => {
    // Reset res.send to its expected value
    res.send = send;
    capture.response = args[0];
    // This is an async function, however it does not need to be awaited here.
    addCapturedRequestAndResponse(capture);
    return send(...args);
  };

  next();
});
