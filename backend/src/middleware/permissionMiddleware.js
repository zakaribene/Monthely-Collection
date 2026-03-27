const Permission = require('../models/Permission');

const checkPermission = (page, action) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.roleId) {
      console.log('[DEBUG] No user or roleId on request');
      return res.status(401).json({ message: 'Not authorized' });
    }

    try {
      const userRoleId = String(req.user.roleId._id || req.user.roleId);
      const permission = await Permission.findOne({ roleId: userRoleId });

      if (permission && Array.isArray(permission.pages)) {
        const pagePerm = permission.pages.find(p => p.name === page);
        
        if (pagePerm && pagePerm.actions) {
          const actions = pagePerm.actions;
          const hasPerm = actions[action] === true || 
                          (typeof actions.get === 'function' && actions.get(action) === true) ||
                          (actions instanceof Map && actions.get(action) === true);
          
          if (hasPerm) return next();
        }
      }

      return res.status(403).json({ message: 'Permission denied' });
    } catch (error) {
      console.error('[PERM ERROR]', error);
      res.status(500).json({ message: 'Permission check error' });
    }
  };
};

/**
 * Check if user has ANY of the specified permissions
 * @param {Array<{page: string, action: string}>} requirements 
 */
const checkAnyPermission = (requirements) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.roleId) {
      console.log('[DEBUG] No user or roleId on request');
      return res.status(401).json({ message: 'Not authorized' });
    }

    try {
      const userRoleId = String(req.user.roleId._id || req.user.roleId);
      const permission = await Permission.findOne({ roleId: userRoleId });

      if (permission && Array.isArray(permission.pages)) {
        for (const { page, action } of requirements) {
          const pagePerm = permission.pages.find(p => p.name === page);
          if (pagePerm && pagePerm.actions) {
            const actions = pagePerm.actions;
            const hasPerm = actions[action] === true || 
                            (typeof actions.get === 'function' && actions.get(action) === true) ||
                            (actions instanceof Map && actions.get(action) === true);
            
            if (hasPerm) return next();
          }
        }
      }

      return res.status(403).json({ message: 'Permission denied' });
    } catch (error) {
      console.error('[PERM ERROR]', error);
      res.status(500).json({ message: 'Permission check error' });
    }
  };
};

module.exports = { checkPermission, checkAnyPermission };
