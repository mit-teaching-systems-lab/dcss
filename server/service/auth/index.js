const { Router } = require('express');

const {
  checkForDuplicate,
  createUser,
  loginUser,
  requireUser,
  respondWithUser,
  updateUser
} = require('./middleware');
const {
  validateRequestUsernameAndEmail,
  validateRequestBody
} = require('../../util/requestValidation');

const router = Router();

router.get('/me', requireUser, respondWithUser);

router.post('/signup', [
  validateRequestBody,
  validateRequestUsernameAndEmail,
  checkForDuplicate,
  createUser,
  respondWithUser
]);

router.post('/update', [
  requireUser,
  validateRequestBody,
  checkForDuplicate,
  updateUser,
  respondWithUser
]);

router.get('/signup/usernames/:username/exists', [
  checkForDuplicate,
  (req, res) => {
    return res.json({ username: req.params.username });
  }
]);

router.post('/login', [
  validateRequestBody,
  validateRequestUsernameAndEmail,
  loginUser,
  respondWithUser
]);

router.post('/logout', (req, res) => {
  delete req.session.user;
  req.session.destroy(() => res.send('ok'));
});

module.exports = router;
