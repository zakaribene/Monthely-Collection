const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username
  action: { type: String, required: true }, // create, update, delete
  target: { type: String, required: true }, // collection name
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
