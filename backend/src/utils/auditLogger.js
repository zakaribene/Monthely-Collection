const AuditLog = require('../models/AuditLog');

const auditLog = async (user, action, target, details) => {
  try {
    await AuditLog.create({
      user,
      action,
      target,
      details,
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

module.exports = auditLog;
