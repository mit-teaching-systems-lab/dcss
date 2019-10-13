const { Router } = require('express');
const {
    createUser,
    duplicatedUser,
    loginUser,
    requireUser,
    respondWithUser
} = require('../util/authenticationHelpers');
const {
    validateRequestUsernameAndEmail,
    validateRequestBody
} = require('../util/requestValidation');

const authRouter = Router();

authRouter.get('/me', requireUser, respondWithUser);

authRouter.post('/signup', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    duplicatedUser,
    createUser,
    respondWithUser
]);

authRouter.post('/login', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    loginUser,
    respondWithUser
]);

authRouter.post('/logout', (req, res) => {
    delete req.session.user;
    req.session.destroy(() => res.send('ok'));
});

module.exports = authRouter;
