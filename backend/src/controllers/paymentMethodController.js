const PaymentMethod = require('../models/PaymentMethod');
const auditLog = require('../utils/auditLogger');

// @desc    Get all payment methods
// @route   GET /api/payment-methods
// @access  Private
const getPaymentMethods = async (req, res, next) => {
  try {
    const methods = await PaymentMethod.find({});
    res.json(methods);
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment method
// @route   POST /api/payment-methods
// @access  Private/Admin
const createPaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.create(req.body);
    await auditLog(req.user.username, 'create', 'PaymentMethod', `Created payment method ${method.name}`);
    res.status(201).json(method);
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment method
// @route   PUT /api/payment-methods/:id
// @access  Private/Admin
const updatePaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (method) {
      Object.assign(method, req.body);
      const updatedMethod = await method.save();
      await auditLog(req.user.username, 'update', 'PaymentMethod', `Updated payment method ${method.name}`);
      res.json(updatedMethod);
    } else {
      res.status(404);
      next(new Error('Payment method not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payment-methods/:id
// @access  Private/Admin
const deletePaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (method) {
      await method.deleteOne();
      await auditLog(req.user.username, 'delete', 'PaymentMethod', `Deleted payment method ${method.name}`);
      res.json({ message: 'Payment method removed' });
    } else {
      res.status(404);
      next(new Error('Payment method not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod };
