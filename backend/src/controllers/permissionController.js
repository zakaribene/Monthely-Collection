const Permission = require('../models/Permission');
const auditLog = require('../utils/auditLogger');

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private
const getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find({}).populate('roleId', 'name');
    res.json(permissions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get permission by roleId
// @route   GET /api/permissions/:roleId
// @access  Private
const getPermissionByRoleId = async (req, res, next) => {
  try {
    const permission = await Permission.findOne({ roleId: req.params.roleId });
    if (permission) {
      res.json(permission);
    } else {
      // Return a default permission object instead of 404
      res.json({ roleId: req.params.roleId, pages: [] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update permissions for a role
// @route   PUT /api/permissions/:roleId
// @access  Private
const updatePermissionByRoleId = async (req, res, next) => {
  try {
    const { pages } = req.body;
    const { roleId } = req.params;

    const updatedPermission = await Permission.findOneAndUpdate(
      { roleId },
      { pages },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('roleId');

    // Safe logging: handle both populated and unpopulated roleId
    const roleName = updatedPermission.roleId && updatedPermission.roleId.name 
      ? updatedPermission.roleId.name 
      : roleId;
    
    await auditLog(req.user.username, 'update', 'Permission', `Updated permissions for role ${roleName}`);
    
    res.json(updatedPermission);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPermissions, getPermissionByRoleId, updatePermissionByRoleId };
