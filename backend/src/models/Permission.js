const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true, unique: true },
  pages: [{
    name: { type: String, required: true },
    actions: { type: mongoose.Schema.Types.Mixed, default: {} }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);
