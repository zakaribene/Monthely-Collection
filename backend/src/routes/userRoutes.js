const express = require('express');
const router = express.Router();
const { getUsers, updateUserProfile, createUser, deleteUser, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Added this line

router.route('/')
  .get(protect, checkPermission('users', 'view'), getUsers)
  .post(protect, checkPermission('users', 'create'), upload.single('photo'), createUser);

router.route('/profile')
  .put(protect, upload.single('photo'), updateUserProfile); // Added upload.single('photo')

router.route('/:id')
  .put(protect, checkPermission('users', 'update'), upload.single('photo'), updateUser)
  .delete(protect, checkPermission('users', 'delete'), deleteUser);

module.exports = router;
