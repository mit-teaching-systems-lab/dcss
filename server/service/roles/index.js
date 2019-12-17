const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUserRole, checkCanEditUserRoles } = require('./middleware');

const router = Router();

const {
    getAllUsersRoles,
    getUserRoles,
    getUserPermissions,
    getUsersByPermission,
    addUserRoles,
    deleteUserRoles,
    setUserRoles
} = require('./endpoints');

router.get('/', [requireUserRole('admin'), getAllUsersRoles]);

router.get('/permission', [getUserPermissions]);

router.post('/user/permission', [getUsersByPermission]);

router.get('/:user_id', [requireUserRole('admin'), getUserRoles]);

router.put('/:user_id', [
    checkCanEditUserRoles(req => req.params.user_id),
    validateRequestBody,
    setUserRoles
]);

router.post('/add', [
    checkCanEditUserRoles(req => req.session.user.id),
    validateRequestBody,
    addUserRoles
]);

router.post('/delete', [
    checkCanEditUserRoles(req => req.session.user.id),
    validateRequestBody,
    deleteUserRoles
]);

module.exports = router;
