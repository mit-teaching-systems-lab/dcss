const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUserRole, checkCanEditUserRoles } = require('./middleware');

const rolesRouter = Router();

const {
    getAllUsersRoles,
    getUserRoles,
    addUserRoles,
    deleteUserRoles,
    setUserRoles
} = require('./endpoints');

rolesRouter.get('/', [requireUserRole('admin'), getAllUsersRoles]);

rolesRouter.get('/:user_id', [requireUserRole('admin'), getUserRoles]);

rolesRouter.put('/:user_id', [
    checkCanEditUserRoles(req => req.params.user_id),
    validateRequestBody,
    setUserRoles
]);

rolesRouter.post('/add', [
    checkCanEditUserRoles(req => req.session.user.id),
    validateRequestBody,
    addUserRoles
]);

rolesRouter.post('/delete', [
    checkCanEditUserRoles(req => req.session.user.id),
    validateRequestBody,
    deleteUserRoles
]);

module.exports = rolesRouter;
