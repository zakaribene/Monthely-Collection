const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { getMembers, getMemberDetails, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.route('/')
  .get(protect, checkPermission('members', 'view'), getMembers)
  .post(protect, checkPermission('members', 'create'), upload.single('photo'), createMember);

router.route('/:id')
  .get(protect, checkPermission('members', 'view'), getMemberDetails)
  .put(protect, checkPermission('members', 'update'), upload.single('photo'), updateMember)
  .delete(protect, checkPermission('members', 'delete'), deleteMember);

module.exports = router;
