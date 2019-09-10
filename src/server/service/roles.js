const { Router } = require('express');
const cors = require('cors');

const {
    validateRequestUsernameAndEmail,
    validateRequestBody
} = require('../util/requestValidation');
const { getUserRoles, addUserRoles } = require('../util/rolesHelpers');

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

module.exports = rolesRouter;
