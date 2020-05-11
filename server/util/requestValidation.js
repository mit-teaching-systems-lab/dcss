const { apiError } = require('./api');

const validateRequestUsernameAndEmail = function(req, res, next) {
  // "user" will be either an email address or username for getting data
  // without determining which data type is provided
  const { username, email, user } = req.body;

  if (!username && !email && !user) {
    return apiError(res, new Error('Username or email must be defined.'));
  }

  if (email && !email.includes('@')) {
    return apiError(res, new Error('Email address not in correct format.'));
  }
  next();
};

const validateRequestBody = function(req, res, next) {
  const validReqBody = Object.keys(req.body).length > 0;
  if (!validReqBody) {
    return apiError(res, new Error('No request body!'));
  }

  next();
};

module.exports = { validateRequestUsernameAndEmail, validateRequestBody };
