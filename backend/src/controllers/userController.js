const User = require('../models/User');
const auditLog = require('../utils/auditLogger');
const generateToken = require('../utils/generateToken');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).populate('roleId').select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('roleId');

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.file) {
        user.photo = `/uploads/users/${req.file.filename}`;
      }

      const updatedUser = await user.save();
      await auditLog(req.user.username, 'update', 'User', `Updated profile for ${user.username}`);

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        photo: updatedUser.photo,
        role: updatedUser.roleId ? updatedUser.roleId.name : null,
        roleId: updatedUser.roleId ? updatedUser.roleId._id : null,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private
const createUser = async (req, res, next) => {
  const { fullName, username, password, roleId } = req.body;
  const photo = req.file ? `/uploads/users/${req.file.filename}` : '';

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({ fullName, username, password, roleId, photo });
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        roleId: user.roleId,
        photo: user.photo
      });
    } else {
      res.status(400);
      next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      await auditLog(req.user.username, 'delete', 'User', `Deleted user ${user.username}`);
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.username = req.body.username || user.username;
      user.roleId = req.body.roleId || user.roleId;

      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.file) {
        user.photo = `/uploads/users/${req.file.filename}`;
      }

      const updatedUser = await user.save();
      await auditLog(req.user.username, 'update', 'User', `Updated user ${user.username}`);

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        photo: updatedUser.photo,
        roleId: updatedUser.roleId,
      });
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, updateUserProfile, createUser, deleteUser, updateUser };
