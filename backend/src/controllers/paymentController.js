const Payment = require('../models/Payment');
const Member = require('../models/Member');
const auditLog = require('../utils/auditLogger');

// @desc    Get all payments (with filters)
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  const { month, year, status, memberId } = req.query;
  const query = {};
  if (month) query.month = Number(month);
  if (year) query.year = Number(year);
  if (status) query.status = status;
  if (memberId) query.member = memberId;

  try {
    const payments = await Payment.find(query)
      .populate('member')
      .populate('paymentMethod')
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark payment as paid
// @route   PUT /api/payments/:id/paid
// @access  Private
const markAsPaid = async (req, res, next) => {
  const { paymentMethodId, datePaid, amount } = req.body;

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      res.status(404);
      return next(new Error('Payment record not found'));
    }

    payment.status = 'paid';
    payment.paymentMethod = paymentMethodId;
    payment.datePaid = datePaid || new Date();
    payment.amount = amount || payment.amount;
    payment.receivedBy = req.user.username;

    const updatedPayment = await payment.save();
    await auditLog(req.user.username, 'update', 'Payment', `Marked payment for ${payment.month}/${payment.year} as paid`);

    res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

// @desc    Create manual payment (optional)
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPayments, markAsPaid, createPayment };
