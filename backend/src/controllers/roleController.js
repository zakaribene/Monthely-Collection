const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
const auditLog = require('../utils/auditLogger');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private
const getRoleById = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      res.json(role);
    } else {
      res.status(404);
      next(new Error('Role not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private
const createRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      res.status(400);
      return next(new Error('Role name already exists'));
    }

    const role = await Role.create({ name, description });

    // Also create initial empty permissions for this role
    await Permission.create({
      roleId: role._id,
      pages: []
    });

    await auditLog(req.user.username, 'create', 'Role', `Created role ${name}`);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private
const updateRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findById(req.params.id);

    if (role) {
      role.name = name || role.name;
      role.description = description || role.description;

      const updatedRole = await role.save();
      await auditLog(req.user.username, 'update', 'Role', `Updated role ${role.name}`);
      res.json(updatedRole);
    } else {
      res.status(404);
      next(new Error('Role not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private
const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (role) {
      // Check if any users are assigned to this role
      const usersWithRole = await User.findOne({ roleId: role._id });
      if (usersWithRole) {
        res.status(400);
        return next(new Error('Cannot delete role that is assigned to users'));
      }

      await Permission.deleteOne({ roleId: role._id });
      await role.deleteOne();
      
      await auditLog(req.user.username, 'delete', 'Role', `Deleted role ${role.name}`);
      res.json({ message: 'Role removed' });
    } else {
      res.status(404);
      next(new Error('Role not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
