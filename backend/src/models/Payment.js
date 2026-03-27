const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  datePaid: { type: Date },
  receivedBy: { type: String }, // Username of the user who received it
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
