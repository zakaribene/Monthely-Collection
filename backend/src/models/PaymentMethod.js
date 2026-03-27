const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  details: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
