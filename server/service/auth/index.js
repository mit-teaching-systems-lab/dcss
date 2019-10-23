const { Router } = require('express');

const {
    requireUser,
    respondWithUser,
    createUser,
    loginUser
} = require('./middleware');
const { checkForDuplicate } = require('./middleware');
const {
    validateRequestUsernameAndEmail,
    validateRequestBody
} = require('../../util/requestValidation');

const authRouter = Router();

authRouter.get('/me', requireUser, respondWithUser);

authRouter.post('/signup', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    checkForDuplicate,
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
