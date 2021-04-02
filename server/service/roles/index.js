const { Router } = require('express');
const router = Router();

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../session/middleware');
const { requireUserRole, checkCanEditUserRoles } = require('./middleware');
const {
  getAllUsers,
  getAvailableUsers,
  getAllUsersCount,
  getAvailableUsersCount,
  getUserRoles,
  getUserPermissions,
  getUsersByPermission,
  addUserRoles,
  deleteUserRoles,
  setUserRoles
} = require('./endpoints');

router.get('/all', [requireUser, getAllUsers]);

router.get('/available', [requireUser, getAvailableUsers]);

router.get('/all/count', [
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  getAllUsersCount
]);

router.get('/available/count', [requireUser, getAvailableUsersCount]);

router.get('/permission', [getUserPermissions]);
// PREVIOUSLY:
// ("/user/permission/" was handled by POST:)
// router.post('/user/permission', [
//   requireUserRole(['admin', 'super_admin', 'facilitator']),
//   getUsersByPermission
// ]);
router.get('/user/permission/:permission', [
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  getUsersByPermission
]);

router.get('/:user_id', [
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  getUserRoles
]);

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
