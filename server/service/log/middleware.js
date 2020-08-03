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

  const request = {
    url,
    session,
    headers,
    method,
    query,
    params,
    body
  };

  const lastRequestKey = hash(session.user);
  const hashed = hash({
    url,
    user: session.user,
    query,
    params,
    body
  });

  // Don't log this if it looks identical to the last request.
  // Sometimes similar requests are made by different components.
  if (lastRequest[lastRequestKey] && lastRequest[lastRequestKey][hashed]) {
    return next();
  }

  lastRequest[lastRequestKey] = {
    [hashed]: true
  };

  const capture = {
    request
  };

  const send = res.send.bind(res);

  res.send = (...args) => {
    capture.response = args;
    // This is an async function, however it does not need to be awaited here.
    addCapturedRequestAndResponse(capture);

    return send(...args);
  };

  next();
});
