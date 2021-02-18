const { Router } = require('express');

const {
  checkForDuplicate,
  createUser,
  loginUser,
  requireUser,
  resetUserPassword,
  respondWithUser,
  refreshSession,
  updateUser
} = require('./middleware');
const {
  validateRequestUsernameAndEmail,
  validateRequestBody
} = require('../../util/requestValidation');

const router = Router();

router.get('/', [requireUser, respondWithUser]);

router.put('/', [
  requireUser,
  validateRequestBody,
  checkForDuplicate,
  updateUser,
  respondWithUser
]);

router.post('/', [
  validateRequestBody,
  validateRequestUsernameAndEmail,
  checkForDuplicate,
  createUser,
  respondWithUser
]);

router.get('/session', [requireUser, refreshSession, respondWithUser]);

router.post('/reset', [validateRequestBody, resetUserPassword]);

router.get('/usernames/:username/exists', [
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
  req.session.destroy(() => res.json({ logout: true }));
});

module.exports = router;
