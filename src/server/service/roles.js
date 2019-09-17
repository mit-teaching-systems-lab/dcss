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

rolesRouter.get('/roles', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    getUserRoles
]);

rolesRouter.post('/roles/add', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    addUserRoles
]);

rolesRouter.post('/roles/delete', [
    validateRequestBody,
    validateRequestUsernameAndEmail,
    deleteUserRoles
]);

module.exports = rolesRouter;
