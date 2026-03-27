const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('roles', 'view'), getRoles)
  .post(protect, checkPermission('roles', 'create'), createRole);

router.route('/:id')
  .get(protect, checkPermission('roles', 'view'), getRoleById)
  .put(protect, checkPermission('roles', 'update'), updateRole)
  .delete(protect, checkPermission('roles', 'delete'), deleteRole);

module.exports = router;
