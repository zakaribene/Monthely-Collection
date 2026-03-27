const express = require('express');
const router = express.Router();
const { getPermissions, getPermissionByRoleId, updatePermissionByRoleId } = require('../controllers/permissionController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('permissions', 'view'), getPermissions);

router.route('/:roleId')
  .get(protect, checkPermission('permissions', 'view'), getPermissionByRoleId)
  .put(protect, checkPermission('permissions', 'update'), updatePermissionByRoleId);

module.exports = router;
