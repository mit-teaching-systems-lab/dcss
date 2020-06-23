// const { Router } = require('express');
// const router = Router();

// const { validateRequestBody } = require('../../util/requestValidation');
// const { requireUserRole, checkCanEditUserRoles } = require('./middleware');
// const { getAllCohortGrants } = require('./endpoints');

// const requiredRoles = ['admin', 'super_admin', 'researcher'];

// router.get('/', [requireUserRole(requiredRoles), getAllCohortGrants]);

// router.get('/permission', [getUserPermissions]);
// router.post('/user/permission', [
//   requireUserRole(requiredRoles),
//   getUsersByPermission
// ]);

// router.get('/:user_id', [
//   requireUserRole(['admin', 'super_admin', 'researcher']),
//   getUserRoles
// ]);

// router.put('/:user_id', [
//   checkCanEditUserRoles(req => req.params.user_id),
//   validateRequestBody,
//   setUserRoles
// ]);

// router.post('/add', [
//   checkCanEditUserRoles(req => req.session.user.id),
//   validateRequestBody,
//   addUserRoles
// ]);

// router.post('/delete', [
//   checkCanEditUserRoles(req => req.session.user.id),
//   validateRequestBody,
//   deleteUserRoles
// ]);

// module.exports = router;
