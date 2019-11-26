const { Router } = require('express');

const {
    createUser,
    loginUser,
    requireUser,
    respondWithUser
} = require('./middleware');
const { checkForDuplicate } = require('./middleware');
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
