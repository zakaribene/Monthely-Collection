const User = require('../models/User');
const Permission = require('../models/Permission');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const cleanUsername = username?.trim();

  try {
    const user = await User.findOne({ username: cleanUsername }).populate('roleId');

    if (user && (await user.matchPassword(password))) {
      const permissions = await Permission.findOne({ roleId: user.roleId });
      
      res.json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        photo: user.photo,
        role: user.roleId ? user.roleId.name : null,
        roleId: user.roleId ? user.roleId._id : null,
        permissions: permissions ? permissions.pages : [],
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      next(new Error('Invalid username or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user (Initial/Admin use)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { fullName, username, password, roleId } = req.body;
  const photo = req.file ? `/uploads/users/${req.file.filename}` : '';

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      fullName,
      username,
      password,
      roleId,
      photo
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser };
