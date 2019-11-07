const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUserRole, checkCanEditUserRoles } = require('./middleware');

const rolesRouter = Router();

const {
    getAllUsers,
    getUserRoles,
    addUserRoles,
    deleteUserRoles,
    setUserRoles
} = require('./endpoints');

rolesRouter.get('/', [requireUserRole('admin'), getAllUsers]);

rolesRouter.get('/:user_id', [requireUserRole('admin'), getUserRoles]);

rolesRouter.put('/:user_id', [
    checkCanEditUserRoles(req => req.params.user_id),
    validateRequestBody,
    setUserRoles
]);

rolesRouter.post('/:user_id/add', [
    checkCanEditUserRoles(req => req.params.user_id),
    validateRequestBody,
    addUserRoles
]);

rolesRouter.post('/:user_id/delete', [
    checkCanEditUserRoles(req => req.params.user_id),
    validateRequestBody,
    deleteUserRoles
]);

module.exports = rolesRouter;
