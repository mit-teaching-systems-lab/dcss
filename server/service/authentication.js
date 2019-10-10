const { Router } = require('express');
const {
    createUser,
    duplicatedUser,
    loginUser,
    requireUser
} = require('../util/authenticationHelpers');
const {
    validateRequestUsernameAndEmail,
    validateRequestBody
} = require('../util/requestValidation');

const authRouter = Router();

authRouter.post('/signup', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    duplicatedUser,
    createUser,
    (req, res) => {
        res.json({ user: req.session.user });
    }
]);

authRouter.post('/login', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    loginUser,
    (req, res) => {
        res.json(req.session.user);
    }
]);

authRouter.post('/logout', (req, res) => {
    delete req.session.user;
    req.session.destroy(() => res.send('ok'));
});

authRouter.get('/me', requireUser, (req, res) => {
    return res.json(req.session.user);
});

module.exports = authRouter;
