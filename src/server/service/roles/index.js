const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');

const rolesRouter = Router();

const {
    getUserRoles,
    addUserRoles,
    deleteUserRoles,
    setUserRoles
} = require('./endpoints');
rolesRouter.get('/:user_id', getUserRoles);
rolesRouter.put('/:user_id', [validateRequestBody, setUserRoles]);

rolesRouter.post('/:user_id/add', [validateRequestBody, addUserRoles]);

rolesRouter.post('/:user_id/delete', [validateRequestBody, deleteUserRoles]);

module.exports = rolesRouter;
