const { Router } = require('express');

const {
    validateRequestUsernameAndEmail,
    validateRequestBody
} = require('../util/requestValidation');
const {
    getUserRoles,
    addUserRoles,
    deleteUserRoles
} = require('../util/rolesHelpers');

const rolesRouter = Router();

rolesRouter.get('/', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    getUserRoles
]);

rolesRouter.post('/add', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    addUserRoles
]);

rolesRouter.post('/delete', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    deleteUserRoles
]);

module.exports = rolesRouter;
