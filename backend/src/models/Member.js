const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  photo: { type: String, default: '' },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  monthlyAmount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
